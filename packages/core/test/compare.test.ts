import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareRoutes, estimateTolls, planRoutes, PlanRequestSchema, PlanResponseSchema, lineLengthKm } from '../src/index.ts';
import { SIENA, PIENZA, MONTALCINO, wigglyLine, fakeProviders, FakeRouter } from './fixtures.ts';

const DEST = { lat: 42.95, lon: 11.85 };

test('a detour through Pienza is found, named, and its minutes add up to the extra time', () => {
  const fastLine = wigglyLine([SIENA, DEST]);
  // On the fast road for 10 km, out west to a village, back onto the fast road at 30 km, then on it to the end.
  const out = fastLine[50], back = fastLine[150];
  const VILLAGE = { lat: 43.12, lon: 11.28 };
  const line = [...fastLine.slice(0, 50), ...wigglyLine([out, VILLAGE, back]), ...fastLine.slice(151)];
  const km = lineLengthKm(line), fkm = lineLengthKm(fastLine);
  const c = compareRoutes(
    { line, km, minutes: km, places: [{ name: 'Pienza', atKm: 25 }] },
    { line: fastLine, km: fkm, minutes: fkm * 0.8 },
  );
  assert.equal(c.detours.length, 1);
  const d = c.detours[0];
  assert.ok(d.fromKm > 8 && d.fromKm < 12, `leaves at ${d.fromKm}`);
  assert.ok(Math.abs(d.rejoin.lat - back.lat) < 0.01, 'rejoins where it came back');
  assert.equal(d.name, 'Pienza');
  assert.ok(d.extraKm > 0 && d.extraKm <= c.extraKm + 0.5);
  assert.equal(c.detours.reduce((s, x) => s + x.extraMinutes, 0), c.extraMinutes);
  assert.ok(c.sharedPct > 30 && c.sharedPct < 90, `${c.sharedPct}`);
});

test('the same road twice has no detours', () => {
  const line = wigglyLine([SIENA, MONTALCINO]);
  const km = lineLengthKm(line);
  const c = compareRoutes({ line, km, minutes: 40 }, { line, km, minutes: 40 });
  assert.deepEqual(c.detours, []);
  assert.equal(c.sharedPct, 100);
  assert.equal(c.extraMinutes, 0);
});

test('tolls: per-km by country and vehicle class, vignette countries free per km', () => {
  const car = estimateTolls({ tollKm: 220, tollKmByCountry: { IT: 150, AT: 70 } }, 'car');
  assert.equal(car.eur, 12);
  assert.deepEqual(car.byCountry.map((c) => c.country), ['IT', 'AT']);
  assert.equal(car.byCountry[1].eur, 0);
  const caravan = estimateTolls({ tollKm: 150, tollKmByCountry: { IT: 150 } }, 'caravan');
  assert.ok(caravan.eur > car.eur);
  assert.equal(estimateTolls({ tollKm: 0 }).eur, 0);
  // No per-country split: priced at the fallback country.
  assert.equal(estimateTolls({ tollKm: 100 }, 'car', 'FR').eur, 11);
});

test('plan: every route is compared with the fastest road, which comes back as a line with its tolls', async () => {
  const p = fakeProviders({ router: new FakeRouter(true, (_pts, o) => (o.profile === 'fastest' ? { tollKm: 60, tollKmByCountry: { IT: 60 } } : {})) });
  const res = await planRoutes(PlanRequestSchema.parse({ origin: SIENA, destination: DEST, extraMinutes: 60, departAt: '2026-06-01T07:00:00Z' }), p);
  PlanResponseSchema.parse(res);
  assert.ok(res.fastest.polyline && res.fastest.polyline.length > 10);
  assert.equal(res.fastest.tolls?.eur, 5);
  for (const r of res.routes) {
    assert.ok(r.vsFastest, r.label);
    assert.equal(r.vsFastest!.extraMinutes, r.extraMinutes);
    assert.equal(r.vsFastest!.tollSavedEur, 5 - r.tolls!.eur);
    if (r.source !== 'fastest' && r.vsFastest!.detours.length) assert.equal(r.vsFastest!.detours.reduce((s, d) => s + d.extraMinutes, 0), r.extraMinutes);
  }
  assert.ok(res.routes.some((r) => r.vsFastest!.detours.length > 0));
});

test('a shorter quieter road says so: negative extra km, and no shared road means one detour', () => {
  const fast = wigglyLine([SIENA, { lat: 43.25, lon: 11.8 }, DEST]);
  const line = wigglyLine([SIENA, { lat: 43.1, lon: 11.5 }, DEST]);
  const c = compareRoutes({ line, km: 56, minutes: 80 }, { line: fast, km: 69.5, minutes: 75 });
  assert.equal(c.extraKm, -13.5);
  assert.equal(c.extraMinutes, 5);
  assert.ok(c.sharedPct < 15);
});
