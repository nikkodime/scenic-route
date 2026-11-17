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

test('gravel routes are dropped for rental cars', async () => {
  const router = new FakeRouter(true, (_pts, opts) => (opts.profile === 'scenic' ? { unpavedKm: 4 } : {}));
  const res = await planRoutes(req({ prefs: { rentalCar: true } }), fakeProviders({ router }));
  assert.ok(res.routes.every((r) => r.source === 'fastest'));
});
