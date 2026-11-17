import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planRoutes, PlanRequestSchema, decodePolyline, distKm, PlanResponseSchema, PlanError } from '../src/index.ts';
import { SIENA, PIENZA, fakeProviders, FakeRouter, squareZone, SAN_QUIRICO } from './fixtures.ts';

const DEST = { lat: 42.95, lon: 11.85, label: 'Monte Amiata side' };
const req = (over = {}) => PlanRequestSchema.parse({ origin: SIENA, destination: DEST, extraMinutes: 60, departAt: '2026-06-01T07:00:00Z', ...over });

test('plans ranked scenic routes within the budget, with conditions and handoff', async () => {
  const p = fakeProviders();
  const res = await planRoutes(req(), p, { id: () => 'plan1' });
  PlanResponseSchema.parse(res);
  assert.ok(res.routes.length >= 2);
  assert.equal(res.routes[0].label, 'Most scenic');
  assert.equal(res.routes[0].id, 'plan1-1');
  for (const r of res.routes) assert.ok(r.minutes <= res.fastest.minutes + 60 * 1.1 + 1);
  assert.ok(res.routes[0].score >= res.routes[1].score);
  assert.ok(res.routes[0].conditions!.weather.length === 4);
  assert.ok(new URL(res.routes[0].handoff.googleMaps).searchParams.get('waypoints'));
  const line = decodePolyline(res.routes[0].polyline);
  assert.ok(distKm(line[0], SIENA) < 0.01 && distKm(line[line.length - 1], DEST) < 0.01);
  assert.ok(res.attribution.includes('© OpenStreetMap contributors'));
  assert.deepEqual(res.warnings, []);
  // Scenic profile at three strengths + via-spot detours were tried.
  assert.ok(p.router.calls.filter((c) => c.opts.profile === 'scenic').length >= 4);
});

test('user stops are kept in order on every route', async () => {
  const p = fakeProviders();
  const res = await planRoutes(req({ stops: [PIENZA] }), p);
  for (const call of p.router.calls) assert.ok(call.points.some((x) => distKm(x, PIENZA) < 0.001));
  assert.ok(res.routes.length >= 1);
});

test('routes through a ZTL are dropped and ZTL polygons are sent to the router', async () => {
  const ztl = squareZone(SAN_QUIRICO, 0.8, { kind: 'ztl', name: 'San Quirico' });
  const p = fakeProviders({ zones: () => [ztl] });
  const res = await planRoutes(req(), p);
  for (const r of res.routes) assert.ok(!r.advisories.some((a) => a.kind === 'ztl'), r.label);
  assert.ok(p.router.calls.every((c) => c.opts.avoidZones?.length === 1));
});

test('degrades gracefully when features, elevation and weather fail', async () => {
  const fail = async () => { throw new Error('down'); };
  const p = fakeProviders({ features: { features: fail }, elevation: { elevations: fail }, weather: { hourly: fail } });
  const res = await planRoutes(req(), p);
  assert.ok(res.routes.length >= 1);
  assert.equal(res.warnings.length, 3);
  assert.equal(res.routes[0].conditions!.weather.length, 0);
  assert.ok(res.routes[0].conditions!.sunset);
});

test('works with a router without a scenic profile (OSRM)', async () => {
  const p = fakeProviders({ router: new FakeRouter(false) });
  const res = await planRoutes(req(), p);
  assert.ok(res.routes.length >= 1);
  assert.ok(p.router.calls.every((c) => c.opts.profile === 'fastest'));
});

test('no fastest route → PlanError 422', async () => {
  const router = new FakeRouter();
  router.route = async () => { throw new Error('no path'); };
  await assert.rejects(planRoutes(req(), fakeProviders({ router })), (e: unknown) => e instanceof PlanError && e.status === 422);
});

test('same start and destination → PlanError 422, router never called', async () => {
  const router = new FakeRouter();
  let called = false;
  router.route = async () => { called = true; throw new Error('should not route'); };
  const r = PlanRequestSchema.parse({ origin: SIENA, destination: { ...SIENA, lat: SIENA.lat + 0.0005 }, extraMinutes: 30 });
  await assert.rejects(planRoutes(r, fakeProviders({ router })), (e: unknown) => e instanceof PlanError && e.status === 422 && /same place/.test(e.message));
  assert.equal(called, false);
});

test('gravel routes are dropped for rental cars', async () => {
  const router = new FakeRouter(true, (_pts, opts) => (opts.profile === 'scenic' ? { unpavedKm: 4 } : {}));
  const res = await planRoutes(req({ prefs: { rentalCar: true } }), fakeProviders({ router }));
  assert.ok(res.routes.every((r) => r.source === 'fastest'));
});

test('without any scenic places, side-road probes still offer an alternative to the fastest road', async () => {
  const p = fakeProviders({ router: new FakeRouter(false), features: { features: async () => [] } });
  const res = await planRoutes(req(), p);
  assert.ok(res.routes.length >= 2, `${res.routes.length} routes`);
  assert.ok(res.routes.some((r) => r.source === 'via_spots'));
  for (const r of res.routes) assert.deepEqual(r.scenicStops, [], 'probe points are not shown as scenic stops');
});

test('style sets the time budget; an explicit cap wins', async () => {
  const { budgetMinutes } = await import('../src/index.ts');
  assert.equal(budgetMinutes('relaxed', 60), 10);
  assert.equal(budgetMinutes('scenic', 100), 40);
  assert.equal(budgetMinutes('most_beautiful', 100), 80);
  assert.equal(budgetMinutes('most_beautiful', 300), 180);
  assert.equal(budgetMinutes('most_beautiful', 100, 30), 30);
  const relaxed = await planRoutes(PlanRequestSchema.parse({ origin: SIENA, destination: DEST, style: 'relaxed', departAt: '2026-06-01T07:00:00Z' }), fakeProviders());
  const beautiful = await planRoutes(PlanRequestSchema.parse({ origin: SIENA, destination: DEST, style: 'most_beautiful', departAt: '2026-06-01T07:00:00Z' }), fakeProviders());
  assert.ok(relaxed.budgetMinutes! < beautiful.budgetMinutes!);
  for (const r of relaxed.routes) assert.ok(r.extraMinutes <= relaxed.budgetMinutes! * 1.1 + 1);
  assert.ok(Math.max(...beautiful.routes.map((r) => r.extraMinutes)) >= Math.max(...relaxed.routes.map((r) => r.extraMinutes)));
});

test('interests reweight places; quiet makes motorways cost more', async () => {
  const { applyInterests, scoreRoute } = await import('../src/index.ts');
  const f = [
    { id: 'a', lat: 43, lon: 11, type: 'lake' as const, weight: 3, name: '' },
    { id: 'b', lat: 43, lon: 11, type: 'castle' as const, weight: 3, name: '' },
  ];
  const w = applyInterests(f, ['water']);
  assert.ok(w[0].weight > 3 && w[1].weight === 3, 'chosen places count more; the rest are left as they are');
  assert.equal(applyInterests(f, []), f);
  const line = [{ lat: 43, lon: 11 }, { lat: 43.1, lon: 11.1 }];
  const route = { line, km: 14, minutes: 12, motorwayKm: 14 };
  const near = [{ id: 'v', lat: 43.05, lon: 11.05, type: 'viewpoint' as const, weight: 5, name: 'View' }];
  const loud = scoreRoute({ route, features: near }).score;
  assert.ok(loud > 0);
  assert.ok(scoreRoute({ route, features: near, quiet: true }).score < loud);
});

test('caravans never get gravel and only the gentlest scenic strength', async () => {
  const p = fakeProviders();
  await planRoutes(req({ vehicle: 'caravan', prefs: { avoidUnpaved: false } }), p);
  const router = p.router as FakeRouter;
  const scenic = router.calls.filter((c) => c.opts.profile === 'scenic');
  assert.ok(scenic.length > 0);
  assert.ok(scenic.every((c) => (c.opts.strength ?? 1) <= 1));
  assert.ok(router.calls.every((c) => c.opts.prefs.avoidUnpaved));
});

test('a ZTL around the start is one plan warning, not a block on every route', async () => {
  const ztl = squareZone(SIENA, 0.8, { kind: 'ztl', name: 'Siena' });
  const p = fakeProviders({ zones: () => [ztl] });
  const res = await planRoutes(req(), p);
  assert.ok(res.routes.length >= 2);
  assert.ok(res.warnings.some((w) => /You start inside the Siena ZTL/.test(w)), JSON.stringify(res.warnings));
  assert.ok(!res.warnings.some((w) => /Every route has a restriction/.test(w)));
  for (const r of res.routes) assert.ok(!r.advisories.some((a) => a.kind === 'ztl'));
  assert.ok(p.router.calls.every((c) => !c.opts.avoidZones?.length), 'the router is not asked to avoid the zone it starts in');
});

test('more than a day away is refused; an explicit time limit is never exceeded; labels follow scores', async () => {
  await assert.rejects(planRoutes(req({ origin: { lat: 38.7, lon: -9.1, label: 'Lisbon' } }), fakeProviders()), (e: unknown) => e instanceof PlanError && /more than a day/.test((e as Error).message));
  const res = await planRoutes(req({ extraMinutes: 30 }), fakeProviders());
  for (const r of res.routes) assert.ok(r.minutes <= res.fastest.minutes + 30 + 0.5, `${r.minutes} vs ${res.fastest.minutes}`);
  const top = Math.max(...res.routes.map((r) => r.score));
  assert.equal(res.routes.find((r) => r.label === 'Most scenic')?.score, top);
});

test('interests choose the route but never lower the score shown; results are shown most scenic first', async () => {
  const plain = await planRoutes(req(), fakeProviders());
  const water = await planRoutes(req({ interests: ['water'] }), fakeProviders());
  // Same scoring for the same road, whatever the interests.
  for (const r of water.routes) {
    const same = plain.routes.find((x) => x.polyline === r.polyline);
    if (same) assert.equal(r.score, same.score);
  }
  for (const res of [plain, water]) for (let i = 1; i < res.routes.length; i++) assert.ok(res.routes[i - 1].score >= res.routes[i].score);
  const p = fakeProviders();
  await planRoutes(req({ vehicle: 'caravan' }), p);
  assert.ok(p.router.calls.every((c) => c.opts.vehicle === 'caravan'));
});

test('a place outside the imported map gets a plain explanation', async () => {
  const router = new FakeRouter();
  router.route = async () => { throw new Error('Cannot find point 1: 44.49,11.34'); };
  await assert.rejects(planRoutes(req(), fakeProviders({ router })), (e: PlanError) => e.status === 422 && /outside the area/.test(e.message));
});

test('a bigger time budget reaches for richer places further off the line', async () => {
  const { candidateWaypointSets } = await import('../src/index.ts');
  const start = { lat: 43, lon: 11 }, end = { lat: 43, lon: 12 };
  const spot = (lat: number, lon: number, weight: number, name: string) => ({ lat, lon, weight, count: 3, name, types: ['viewpoint' as const] });
  const spots = [spot(43.03, 11.5, 6, 'near'), spot(43.2, 11.5, 14, 'far')];
  const first = (min: number) => candidateWaypointSets(start, end, spots, min)[1]?.[0]?.name;
  assert.equal(first(30), 'near');
  assert.equal(first(120), 'far');
});
