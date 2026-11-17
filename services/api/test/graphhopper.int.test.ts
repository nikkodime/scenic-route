// Integration test against a real GraphHopper loaded with infra/graphhopper/test/tiny-tuscany.osm.
// Skipped unless GH_URL is set. See infra/graphhopper/README.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GraphHopperRouter } from '../src/providers/graphhopper.ts';
import { makeHttp } from '../src/http.ts';
import { PreferencesSchema, distKm, type LatLon, type Zone } from '@scenic/core';

const url = process.env.GH_URL;
const A = { lat: 43.3, lon: 11.3 }, B = { lat: 43.3, lon: 11.5 };
const S2 = { lat: 43.34, lon: 11.4 }, T1 = { lat: 43.36, lon: 11.4 }, G1 = { lat: 43.315, lon: 11.4 };
const passes = (line: LatLon[], p: LatLon, km = 0.3) => line.some((q) => distKm(q, p) < km);
const prefs = PreferencesSchema.parse({});
const ztlAroundS2: Zone = {
  type: 'Feature', properties: { kind: 'ztl', name: 'Borgo' },
  geometry: { type: 'Polygon', coordinates: [[[11.39, 43.33], [11.41, 43.33], [11.41, 43.35], [11.39, 43.35], [11.39, 43.33]]] },
};

test('GraphHopper: fastest, scenic, ZTL and gravel behave as designed', { skip: !url && 'set GH_URL to run' }, async () => {
  const gh = new GraphHopperRouter(makeHttp({ userAgent: 'scenic-route-test' }), url!, 'car');

  const fastest = await gh.route([A, B], { profile: 'fastest', prefs: { ...prefs, avoidUnpaved: false } });
  assert.ok(fastest.motorwayKm! > fastest.km * 0.9, `fastest should use the motorway: ${JSON.stringify({ km: fastest.km, mw: fastest.motorwayKm })}`);
  assert.ok(fastest.tollKm! > 10);
  assert.ok((fastest.motorwayKmByCountry?.IT ?? 0) > 10, JSON.stringify(fastest.motorwayKmByCountry));

  const scenic = await gh.route([A, B], { profile: 'scenic', strength: 3, prefs });
  assert.equal(Math.round(scenic.motorwayKm!), 0, 'scenic avoids the motorway');
  assert.equal(Math.round(scenic.unpavedKm!), 0, 'scenic avoids gravel by default');
  assert.ok(passes(scenic.line, S2), 'scenic goes through the hill town');
  assert.ok(scenic.minutes > fastest.minutes);

  const noZtl = await gh.route([A, B], { profile: 'scenic', strength: 3, prefs, avoidZones: [ztlAroundS2] });
  assert.ok(!passes(noZtl.line, S2, 0.8), 'ZTL area is avoided');
  assert.ok(passes(noZtl.line, T1), 'bypass is used');

  const gravelOk = await gh.route([A, B], { profile: 'scenic', strength: 3, prefs: { ...prefs, avoidUnpaved: false } });
  assert.ok(gravelOk.unpavedKm! > 5 || passes(gravelOk.line, S2), 'without the unpaved block the gravel road is allowed');
  assert.ok(!passes(scenic.line, G1, 0.2));

  const alts = await gh.alternatives([A, B], { profile: 'scenic', strength: 1, prefs });
  assert.ok(alts.length >= 1);
});

test('GraphHopper + planner: the scenic route wins and the ZTL route is never offered', { skip: !url && 'set GH_URL to run' }, async () => {
  const { planRoutes, PlanRequestSchema } = await import('@scenic/core');
  const gh = new GraphHopperRouter(makeHttp({ userAgent: 'scenic-route-test' }), url!, 'car');
  const features = { features: async () => [
    { id: 'n/1', lat: 43.341, lon: 11.401, type: 'hilltop_village' as const, weight: 2, name: 'Borgo' },
    { id: 'n/2', lat: 43.361, lon: 11.401, type: 'viewpoint' as const, weight: 5, name: 'Belvedere' },
    { id: 'n/3', lat: 43.331, lon: 11.351, type: 'cypress' as const, weight: 3, name: 'Cipressi' },
  ] };
  const req = PlanRequestSchema.parse({ origin: A, destination: B, extraMinutes: 30, departAt: '2026-06-01T07:00:00Z' });
  const res = await planRoutes(req, { router: gh, features, zones: () => [ztlAroundS2] });
  assert.ok(res.routes.length >= 1);
  assert.equal(res.routes[0].parts.motorwayPct, 0);
  assert.ok(res.routes[0].highlights.some((h) => h.name === 'Belvedere'), JSON.stringify(res.routes[0].highlights));
  for (const r of res.routes) assert.ok(!r.advisories.some((a) => a.kind === 'ztl'));
});
