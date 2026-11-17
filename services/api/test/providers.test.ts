import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { customModel, parseGhPath, GraphHopperRouter } from '../src/providers/graphhopper.ts';
import { parseOsrmRoute } from '../src/providers/osrm.ts';
import { parseMetNo, parseOpenMeteo, MetNoWeather } from '../src/providers/weather.ts';
import { parsePhoton } from '../src/providers/geocode.ts';
import { snapBBox, OverpassFeatures } from '../src/providers/overpass.ts';
import { loadZones } from '../src/providers/zones.ts';
import { makeHttp, UpstreamError } from '../src/http.ts';
import { TtlCache } from '../src/cache.ts';
import { PreferencesSchema } from '@scenic/core';
import { squareZone, SIENA } from '../../../packages/core/test/fixtures.ts';

const prefs = PreferencesSchema.parse({});

test('custom model: scenic strength lowers big roads, blocks gravel and ZTL areas', () => {
  const ztl = squareZone(SIENA, 0.5, { kind: 'ztl', name: 'Siena' });
  const m = customModel({ profile: 'scenic', strength: 3, prefs, avoidZones: [ztl] });
  assert.deepEqual(m.priority[0], { if: 'in_ztl0', multiply_by: '0' });
  assert.ok(m.priority.some((p) => p.if?.includes('surface == GRAVEL') && p.multiply_by === '0'));
  assert.ok(m.priority.some((p) => p.if === 'road_class == MOTORWAY' && Number(p.multiply_by) < 0.1));
  assert.ok(m.priority.every((p) => Number(p.multiply_by) <= 1), 'LM-compatible: never raise priority');
  assert.equal((m.areas!.features[0] as { id: string }).id, 'ztl0');
  assert.equal(m.distance_influence, 10);
  assert.deepEqual(customModel({ profile: 'fastest', prefs: { ...prefs, avoidUnpaved: false } }), { priority: [], distance_influence: 70 });
});

test('GraphHopper path details become km stats, per-country motorway km', () => {
  const coords: [number, number][] = [];
  for (let i = 0; i <= 10; i++) coords.push([11 + i * 0.1, 43]); // ~8.1 km per step
  const p = parseGhPath({
    distance: 81000, time: 3600000, points: { coordinates: coords },
    details: {
      road_class: [[0, 4, 'MOTORWAY'], [4, 8, 'SECONDARY'], [8, 10, 'TRACK']],
      surface: [[0, 8, 'ASPHALT'], [8, 10, 'GRAVEL']],
      toll: [[0, 2, 'ALL'], [2, 10, 'NO']],
      country: [[0, 2, 'AUT'], [2, 10, 'ITA']],
    },
  });
  assert.equal(p.minutes, 60);
  assert.ok(Math.abs(p.motorwayKm! - 32.5) < 1);
  assert.ok(Math.abs(p.unpavedKm! - 2 * 16.3) < 1.5, `${p.unpavedKm}`); // TRACK + GRAVEL both count
  assert.ok(Math.abs(p.motorwayKmByCountry!.AT - 16.3) < 1);
  assert.ok(Math.abs(p.motorwayKmByCountry!.IT - 16.3) < 1);
});

test('GraphHopper router posts the right body and reads the path', async () => {
  let sent: any;
  const fetch = (async (_url: string, init: RequestInit) => {
    sent = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ paths: [{ distance: 1000, time: 60000, points: { coordinates: [[11, 43], [11.01, 43]] } }] }), { status: 200 });
  }) as typeof globalThis.fetch;
  const r = new GraphHopperRouter(makeHttp({ userAgent: 't', fetch }), 'http://gh/', 'car');
  const path = await r.route([SIENA, { lat: 43.1, lon: 11.5 }], { profile: 'scenic', strength: 2, prefs });
  assert.equal(path.km, 1);
  assert.deepEqual(sent.points[0], [SIENA.lon, SIENA.lat]);
  assert.equal(sent['ch.disable'], true);
  assert.ok(sent.details.includes('country'));
  assert.deepEqual(await r.alternatives([SIENA, SIENA, SIENA], { profile: 'fastest', prefs }), []);
});

test('OSRM steps give motorway and toll km', () => {
  const r = parseOsrmRoute({ distance: 5000, duration: 300, geometry: { coordinates: [[11, 43], [11.1, 43]] }, legs: [{ steps: [{ distance: 3000, intersections: [{ classes: ['motorway', 'toll'] }] }, { distance: 2000, intersections: [{}] }] }] });
  assert.equal(r.motorwayKm, 3);
  assert.equal(r.tollKm, 3);
  assert.equal(r.minutes, 5);
});

test('MET Norway and Open-Meteo parse into the same hourly shape', () => {
  const met = parseMetNo({ properties: { timeseries: [
    { time: '2026-11-17T10:00:00Z', data: { instant: { details: { cloud_area_fraction: 80, cloud_area_fraction_low: 60, fog_area_fraction: 70 } }, next_1_hours: { details: { precipitation_amount: 1.2, probability_of_precipitation: 75 } } } },
    { time: '2026-11-20T00:00:00Z', data: { instant: { details: { cloud_area_fraction: 5 } }, next_6_hours: { details: { precipitation_amount: 0 } } } },
  ] } });
  assert.deepEqual(met[0], { time: '2026-11-17T10:00:00Z', cloud: 80, lowCloud: 60, precipProb: 75, precipMm: 1.2, visibilityKm: null, fog: true });
  assert.equal(met[1].precipProb, 0);
  const om = parseOpenMeteo({ time: ['2026-11-17T10:00'], cloud_cover: [20], cloud_cover_low: [5], precipitation_probability: [10], precipitation: [0], visibility: [600] });
  assert.equal(om[0].time, '2026-11-17T10:00:00Z');
  assert.equal(om[0].fog, true);
  assert.equal(om[0].visibilityKm, 0.6);
});

test('MET Norway client rounds coordinates, caches, sends User-Agent', async () => {
  const urls: string[] = [];
  const fetch = (async (url: string, init: RequestInit) => {
    urls.push(url);
    assert.equal((init.headers as Record<string, string>)['User-Agent'], 'scenic-route-test');
    return new Response(JSON.stringify({ properties: { timeseries: [] } }), { status: 200 });
  }) as typeof globalThis.fetch;
  const w = new MetNoWeather(makeHttp({ userAgent: 'scenic-route-test', fetch }));
  await w.hourly([{ lat: 43.31881, lon: 11.33081 }, { lat: 43.31879, lon: 11.33079 }]);
  assert.equal(urls.length, 1);
  assert.match(urls[0], /lat=43\.32&lon=11\.33/);
});

test('Photon labels are readable and de-duplicated', () => {
  const r = parsePhoton({ features: [{ geometry: { coordinates: [11.67, 43.07] }, properties: { name: 'Pienza', city: 'Pienza', county: 'Siena', country: 'Italia', osm_value: 'town' } }] });
  assert.deepEqual(r[0], { lat: 43.07, lon: 11.67, label: 'Pienza, Siena, Italia', kind: 'town' });
});

test('Overpass: bbox snapping shares cache; falls back to second mirror', async () => {
  assert.deepEqual(snapBBox([43.312, 11.29, 43.48, 11.41]), [43.3, 11.2, 43.5, 11.5]);
  let calls = 0;
  const fetch = (async (url: string) => {
    calls++;
    if (url.includes('first')) return new Response('busy', { status: 504 });
    return new Response(JSON.stringify({ elements: [{ type: 'node', id: 1, lat: 43.4, lon: 11.3, tags: { tourism: 'viewpoint' } }] }), { status: 200 });
  }) as typeof globalThis.fetch;
  const o = new OverpassFeatures(makeHttp({ userAgent: 't', fetch }), ['http://first', 'http://second']);
  const a = await o.features([43.312, 11.29, 43.48, 11.41]);
  const b = await o.features([43.33, 11.25, 43.45, 11.45]);
  assert.equal(a.length, 1);
  assert.equal(a, b);
  assert.equal(calls, 2);
});

test('http: 4xx is not retried, 5xx is', async () => {
  let n = 0;
  const f4 = (async () => { n++; return new Response('no', { status: 404 }); }) as typeof fetch;
  await assert.rejects(makeHttp({ userAgent: 't', fetch: f4 }).json('http://x/', { retries: 2 }), (e: unknown) => e instanceof UpstreamError && e.status === 404);
  assert.equal(n, 1);
  n = 0;
  const f5 = (async () => { n++; return n < 2 ? new Response('x', { status: 503 }) : new Response('{"ok":1}', { status: 200 }); }) as typeof fetch;
  assert.deepEqual(await makeHttp({ userAgent: 't', fetch: f5 }).json('http://x/', { retries: 2 }), { ok: 1 });
});

test('cache de-duplicates concurrent loads and evicts LRU', async () => {
  const c = new TtlCache<number>(2);
  let loads = 0;
  const load = () => new Promise<number>((r) => setTimeout(() => r(++loads), 5));
  const [a, b] = await Promise.all([c.wrap('k', 1000, load), c.wrap('k', 1000, load)]);
  assert.equal(a, b);
  assert.equal(loads, 1);
  c.set('x', 1, 1000); c.set('y', 2, 1000);
  assert.equal(c.get('k'), undefined);
});

test('shipped zone files load and are found by bbox', () => {
  const z = loadZones(fileURLToPath(new URL('../../../infra/data/zones/', import.meta.url)));
  assert.ok(z.all.length >= 5, `${z.all.length} zones`);
  assert.ok(z.inBBox([43.30, 11.30, 43.34, 11.35]).some((x) => x.properties.name.includes('Siena')));
  assert.equal(z.inBBox([60, 20, 61, 21]).length, 0);
});

test('geocoder ranking: the city of Pisa beats a Pisa street and places outside Europe', async () => {
  const { rankPlaces } = await import('../src/providers/geocode.ts');
  const ranked = rankPlaces([
    { lat: 37.33, lon: -122.03, label: 'Pisa Pizza, Cupertino, California', kind: 'restaurant' },
    { lat: 43.77, lon: 11.25, label: 'Via Pisana, Firenze, Toscana, Italia', kind: 'street' },
    { lat: 43.7167, lon: 10.4017, label: 'Pisa, Toscana, Italia', kind: 'city' },
  ], 'Pisa');
  assert.equal(ranked[0].label, 'Pisa, Toscana, Italia');
  assert.ok(!ranked.some((r) => r.label.includes('California')));
});
