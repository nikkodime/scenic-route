import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  goldenDeparture, sunAtElevation, sunPosition, sunTimes, routeAdvisories, suggestStops, placesAlong, planRoutes,
  PlanRequestSchema, PlanResponseSchema, SEASONAL_PASSES, GOLDEN_ELEVATION, type StopPlace,
} from '../src/index.ts';
import { SIENA, PIENZA, SAN_QUIRICO, MONTALCINO, wigglyLine, fakeProviders } from './fixtures.ts';

const line = wigglyLine([SIENA, MONTALCINO, SAN_QUIRICO, PIENZA]);

test('sunAtElevation finds the evening moment the sun is 4° high, before sunset', () => {
  const day = new Date('2026-06-01T12:00:00Z');
  const t = sunAtElevation(day, PIENZA.lat, PIENZA.lon, 4, 'evening')!;
  const sun = sunTimes(day, PIENZA.lat, PIENZA.lon)!;
  assert.ok(Math.abs(sunPosition(t, PIENZA.lat, PIENZA.lon).elevation - 4) < 0.1);
  const before = (sun.sunset.getTime() - t.getTime()) / 60000;
  assert.ok(before > 20 && before < 50, `${before} min before sunset`);
});

test('golden departure: leave so the middle of the best stretch is driven in golden light', () => {
  const departure = new Date('2026-06-01T07:00:00Z');
  const g = goldenDeparture({ line, km: 70, minutes: 90, departure, now: departure, bestStretch: { fromKm: 40, toKm: 60 }, place: 'Val d\'Orcia' })!;
  assert.ok(g);
  assert.equal(g.place, 'Val d\'Orcia');
  assert.equal(new Date(g.leaveAt).getUTCMinutes() % 5, 0);
  assert.equal(g.onTime, false);
  // Same day, in the late afternoon (Italy, June: sun 4° high around 18:25 UTC).
  assert.equal(g.leaveAt.slice(0, 10), '2026-06-01');
  const reach = new Date(g.reachAt);
  assert.ok(Math.abs(sunPosition(reach, 43.1, 11.55).elevation - GOLDEN_ELEVATION) < 1.5);
  assert.ok(new Date(g.leaveAt) < reach && reach < new Date(g.sunset));
});

test('golden departure moves to tomorrow once today\'s light has gone, and says on time when it already fits', () => {
  const late = new Date('2026-06-01T19:30:00Z');
  const g = goldenDeparture({ line, km: 70, minutes: 90, departure: late, now: late })!;
  assert.equal(g.leaveAt.slice(0, 10), '2026-06-02');
  const fits = goldenDeparture({ line, km: 70, minutes: 90, departure: new Date('2026-06-01T07:00:00Z'), now: new Date('2026-06-01T07:00:00Z') })!;
  const again = goldenDeparture({ line, km: 70, minutes: 90, departure: new Date(fits.leaveAt), now: new Date('2026-06-01T07:00:00Z') })!;
  assert.equal(again.onTime, true);
});

test('passes are matched within about a kilometre and pinned on the map; closed in winter', () => {
  const stelvio = SEASONAL_PASSES.find((p) => p.name.includes('Stelvio'))!;
  const pass = [{ lat: stelvio.lat - 0.05, lon: stelvio.lon - 0.006 }, { lat: stelvio.lat + 0.05, lon: stelvio.lon - 0.006 }];
  const winter = routeAdvisories({ line: pass, date: new Date('2026-12-10T10:00:00Z') });
  const a = winter.find((x) => x.kind === 'pass_closed')!;
  assert.equal(a.severity, 'block');
  assert.equal(a.lat, stelvio.lat);
  const summer = routeAdvisories({ line: pass, date: new Date('2026-07-10T10:00:00Z') });
  assert.equal(summer[0].kind, 'pass_seasonal');
  assert.equal(routeAdvisories({ line: [SIENA, PIENZA] }).filter((x) => x.kind.startsWith('pass')).length, 0);
});

test('gravel warning is pinned where the gravel starts', () => {
  const adv = routeAdvisories({ line, unpavedKm: 2.4, unpavedAtKm: 30, prefs: { rentalCar: true } });
  const g = adv.find((x) => x.kind === 'unpaved')!;
  assert.equal(g.severity, 'block');
  assert.equal(g.atKm, 30);
  assert.ok(g.lat! > 43 && g.lat! < 43.4);
});

const off = (p: { lat: number; lon: number }, km: number) => ({ lat: p.lat + km / 111, lon: p.lon });
const at = (f: number) => line[Math.round(f * (line.length - 1))];
const PLACES: StopPlace[] = [
  { id: 'v1', kind: 'viewpoint', name: 'Belvedere', ...off(at(0.6), 0.1) },
  { id: 'v2', kind: 'viewpoint', name: 'Far view', ...off(at(0.6), 2) },
  { id: 'c1', kind: 'cafe', name: 'Bar Centrale', ...off(at(0.5), 0.2) },
  { id: 'c0', kind: 'cafe', name: 'Bar at the start', ...off(at(0.01), 0.05) },
  { id: 'a1', kind: 'agriturismo', name: 'Agriturismo Il Poggio', food: true, ...off(at(0.45), 1) },
  { id: 'w1', kind: 'winery', name: 'Cantina Bella', ...off(at(0.7), 0.8) },
];

test('placesAlong keeps only places close enough for their kind', () => {
  const near = placesAlong(line, PLACES).map((p) => p.id).sort();
  assert.deepEqual(near, ['a1', 'c0', 'c1', 'v1', 'w1']);
});

test('suggestStops: viewpoint on the best stretch, lunch at midday, wine, coffee halfway; nothing right after leaving', () => {
  // Leave 10:30 Rome time; 2 h drive puts the 45% point around 11:25–11:45 local.
  const stops = suggestStops({ line, km: 70, minutes: 120, departure: new Date('2026-06-01T09:00:00Z'), places: PLACES, bestStretch: { fromKm: 35, toKm: 50 }, loveWine: true });
  const ids = stops.map((s) => s.id);
  assert.deepEqual(stops.map((s) => [s.id, s.reason]), [['a1', 'lunch'], ['v1', 'view'], ['w1', 'wine']]);
  // Early morning: no lunch, so a coffee about halfway instead; never the bar you just left.
  const early = suggestStops({ line, km: 70, minutes: 120, departure: new Date('2026-06-01T05:00:00Z'), places: PLACES });
  assert.ok(!early.some((s) => s.reason === 'lunch'));
  assert.ok(early.some((s) => s.id === 'c1' && s.reason === 'coffee'));
  assert.ok(!early.some((s) => s.id === 'c0'));
  for (let i = 1; i < early.length; i++) assert.ok(early[i].atKm >= early[i - 1].atKm);
});

test('planner adds stops and a golden departure, and both can be switched off', async () => {
  const req = PlanRequestSchema.parse({ origin: SIENA, destination: PIENZA, departAt: '2026-06-01T07:00:00Z' });
  const direct = wigglyLine([SIENA, PIENZA]);
  const on = (f: number) => direct[Math.round(f * (direct.length - 1))];
  const stops = { attribution: 'Stops test', stops: async (): Promise<StopPlace[]> => [
    { id: 'v', kind: 'viewpoint', name: 'Belvedere', ...off(on(0.6), 0.05) },
    { id: 'c', kind: 'cafe', name: 'Bar', ...off(on(0.5), 0.05) },
  ] };
  const now = new Date('2026-06-01T06:00:00Z');
  const res = await planRoutes(req, fakeProviders({ stops }), { now });
  PlanResponseSchema.parse(res);
  assert.ok(res.routes.some((r) => (r.suggestedStops ?? []).length > 0));
  assert.ok(res.routes[0].conditions!.goldenDeparture);
  assert.ok(res.routes[0].conditions!.notes.some((n) => /^Leave at \d\d:\d\d/.test(n)));
  assert.ok(res.attribution.includes('Stops test'));
  const without = await planRoutes(req, fakeProviders({ stops }), { now, features: { stops: false, goldenDeparture: false } });
  assert.ok(without.routes.every((r) => !r.suggestedStops && !r.conditions!.goldenDeparture));
});

test('a viewpoint without a name is shown only when no named one is on offer, and only once', () => {
  const v = (id: string, name: string, f: number) => ({ id, kind: 'viewpoint' as const, name, ...off(at(f), 0.05) });
  const pick = (places: StopPlace[]) => suggestStops({ line, km: 70, minutes: 40, departure: new Date('2026-06-01T07:00:00Z'), places }).map((s) => s.id);
  assert.deepEqual(pick([v('a', '', 0.3), v('b', 'Belvedere', 0.7)]), ['b']);
  assert.deepEqual(pick([v('a', '', 0.3), v('c', '', 0.7)]), ['a']);
});
