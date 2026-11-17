import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  distKm, encodePolyline, decodePolyline, simplify, pointInGeometry, resample, lineLengthKm, pointAtKm,
  sunTimes, sunPosition, parseOverpass, overpassQuery, clusterSpots, candidateWaypointSets, scoreRoute, describe,
  bendiness, bestStretch, rankRoutes, overlap, assessConditions, glareStretches, routeAdvisories, isBlocked,
  shapingPoints, googleMapsUrl, toGpx, PlanRequestSchema, TripSchema, SyncRequestSchema,
} from '../src/index.ts';
import { SIENA, MONTALCINO, PIENZA, SAN_QUIRICO, wigglyLine, VAL_D_ORCIA_FEATURES, forecast, squareZone } from './fixtures.ts';

test('polyline encode/decode round-trips to 1e-5', () => {
  const line = wigglyLine([SIENA, MONTALCINO], 0.05);
  const back = decodePolyline(encodePolyline(line));
  assert.equal(back.length, line.length);
  for (let i = 0; i < line.length; i++) assert.ok(distKm(line[i], back[i]) < 0.002);
  // Known value from Google's docs
  assert.equal(encodePolyline([{ lat: 38.5, lon: -120.2 }, { lat: 40.7, lon: -120.95 }, { lat: 43.252, lon: -126.453 }]), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
});

test('simplify keeps ends and shortens dense lines', () => {
  const line = resample([SIENA, MONTALCINO], 0.05);
  const s = simplify(line, 0.01);
  assert.equal(s.length, 2);
  assert.deepEqual(s[0], line[0]);
});

test('point in polygon respects holes', () => {
  const z = squareZone(SIENA, 1, { kind: 'ztl', name: 'Siena' });
  assert.ok(pointInGeometry(SIENA, z.geometry));
  assert.ok(!pointInGeometry(MONTALCINO, z.geometry));
  const inner = squareZone(SIENA, 0.3, { kind: 'ztl', name: 'x' }).geometry.coordinates[0];
  const withHole = { type: 'Polygon', coordinates: [z.geometry.coordinates[0], inner] };
  assert.ok(!pointInGeometry(SIENA, withHole));
});

test('sunset in Siena mid-November is around 16:50 local (15:50 UTC)', () => {
  const s = sunTimes(new Date('2026-11-17T12:00:00Z'), SIENA.lat, SIENA.lon)!;
  const mins = s.sunset.getUTCHours() * 60 + s.sunset.getUTCMinutes();
  assert.ok(Math.abs(mins - (15 * 60 + 50)) < 10, s.sunset.toISOString());
});

test('sun position: due south and high at solar noon in June, west and low before sunset', () => {
  const noon = sunPosition(new Date('2026-06-21T11:15:00Z'), SIENA.lat, SIENA.lon);
  assert.ok(Math.abs(noon.azimuth - 180) < 10, `${noon.azimuth}`);
  assert.ok(noon.elevation > 65 && noon.elevation < 72, `${noon.elevation}`);
  const eve = sunPosition(new Date('2026-06-21T18:30:00Z'), SIENA.lat, SIENA.lon);
  assert.ok(eve.azimuth > 285 && eve.azimuth < 310, `${eve.azimuth}`);
  assert.ok(eve.elevation > 0 && eve.elevation < 6, `${eve.elevation}`);
});

test('overpass parsing classifies and boosts tall peaks; query covers bbox', () => {
  const f = parseOverpass({ elements: [
    { type: 'node', id: 1, lat: 43.1, lon: 11.5, tags: { tourism: 'viewpoint', name: 'Belvedere' } },
    { type: 'node', id: 2, lat: 43.2, lon: 11.4, tags: { natural: 'peak', ele: '1200' } },
    { type: 'node', id: 3, lat: 43.2, lon: 11.4, tags: { place: 'village', ele: '420', name: 'Borgo' } },
    { type: 'way', id: 4, center: { lat: 43, lon: 11.3 }, tags: { historic: 'abbey', name: 'Sant\'Antimo' } },
    { type: 'node', id: 5, lat: 43, lon: 11.3, tags: { amenity: 'parking' } },
  ] });
  assert.equal(f.length, 4);
  assert.equal(f.find((x) => x.id === 'node/3')!.type, 'hilltop_village');
  assert.equal(f.find((x) => x.id === 'way/4')!.type, 'heritage');
  assert.ok(f.find((x) => x.id === 'node/2')!.weight > 4);
  assert.match(overpassQuery([43, 11, 44, 12]), /43\.00000,11\.00000,44\.00000,12\.00000/);
});

test('spots cluster nearby features and waypoint sets stay in budget and in order', () => {
  const spots = clusterSpots(VAL_D_ORCIA_FEATURES, 2);
  assert.ok(spots.length < VAL_D_ORCIA_FEATURES.length);
  const sets = candidateWaypointSets(SIENA, { lat: 42.95, lon: 11.85 }, spots, 60);
  assert.deepEqual(sets[0], []);
  assert.ok(sets.length > 1);
  for (const s of sets) for (const p of s) assert.ok('types' in p && !('t' in p));
  assert.deepEqual(candidateWaypointSets(SIENA, MONTALCINO, spots, 0).length, 1);
});

test('a route through the Val d\'Orcia outscores a plain one; motorways are penalised', () => {
  const scenicLine = wigglyLine([SIENA, SAN_QUIRICO, PIENZA], 0.08);
  const plainLine = wigglyLine([SIENA, MONTALCINO]);
  const scenic = scoreRoute({ route: { line: scenicLine, km: lineLengthKm(scenicLine), minutes: 70 }, features: VAL_D_ORCIA_FEATURES, relief: { min: 250, max: 600, climb: 900 } });
  const plain = scoreRoute({ route: { line: plainLine, km: lineLengthKm(plainLine), minutes: 40 }, features: VAL_D_ORCIA_FEATURES, relief: { min: 250, max: 300, climb: 100 } });
  assert.ok(scenic.score > plain.score + 20, `${scenic.score} vs ${plain.score}`);
  assert.ok(scenic.highlights.length >= 3);
  assert.ok(scenic.highlights.every((h, i, a) => i === 0 || a[i - 1].atKm <= h.atKm), 'highlights in driving order');
  assert.match(describe(scenic), /hill towns|viewpoint|cypress/);
  const mw = scoreRoute({ route: { line: scenicLine, km: lineLengthKm(scenicLine), minutes: 70, motorwayKm: lineLengthKm(scenicLine) }, features: VAL_D_ORCIA_FEATURES });
  assert.ok(mw.score < scenic.score / 2);
  assert.ok(bestStretch(scenic.near, lineLengthKm(scenicLine))!.toKm > 40);
});

test('segment samples feed views and scenery when the pipeline has data', () => {
  const line = wigglyLine([SIENA, MONTALCINO]);
  const route = { line, km: lineLengthKm(line), minutes: 40 };
  const without = scoreRoute({ route, features: [] });
  const withSeg = scoreRoute({ route, features: [], segments: Array(30).fill({ beauty: 0.9, view: 0.8 }) });
  assert.equal(without.parts.views, null);
  assert.equal(withSeg.parts.views, 80);
  assert.ok(withSeg.score > without.score + 20);
});

test('bendiness: straight is ~0, wiggly is high', () => {
  assert.ok(bendiness(wigglyLine([SIENA, MONTALCINO])) < 1);
  assert.ok(bendiness(wigglyLine([SIENA, MONTALCINO], 0.05)) > 20);
});

test('ranking enforces the budget and removes near-duplicate lines', () => {
  const a = wigglyLine([SIENA, MONTALCINO]);
  const b = wigglyLine([SIENA, SAN_QUIRICO, MONTALCINO]);
  assert.ok(overlap(a, a) === 1 && overlap(a, b) < 0.5);
  const routes = [
    { id: 'fast', minutes: 40, line: a, scored: { score: 30 } },
    { id: 'dup', minutes: 41, line: a, scored: { score: 31 } },
    { id: 'scenic', minutes: 75, line: b, scored: { score: 80 } },
    { id: 'toolong', minutes: 200, line: b, scored: { score: 99 } },
  ];
  assert.deepEqual(rankRoutes(routes, 40, 45).map((r) => r.id), ['scenic', 'dup']);
});

test('conditions: west-bound at sunset gives glare, golden hour and a dark arrival', () => {
  const east = { lat: 43.3, lon: 12.2 }, west = { lat: 43.3, lon: 11.0 };
  const line = wigglyLine([east, west]);
  const dep = new Date('2026-06-21T17:30:00Z'); // sun low in the WNW
  const minutes = 150;
  assert.ok(glareStretches(line, minutes, dep).length >= 1);
  const c = assessConditions({ line, km: lineLengthKm(line), minutes, departure: dep, forecasts: [forecast(dep, 6), forecast(dep, 6), forecast(dep, 6), forecast(dep, 6)], bestStretch: { fromKm: 40, toKm: 60 } });
  assert.equal(c.arrivesAfterDark, true);
  assert.equal(c.weather.length, 4);
  assert.equal(c.verdict, 'great');
  assert.ok(c.notes.some((n) => /after dark/.test(n)));
  assert.ok(c.notes.some((n) => /Low sun/.test(n)));
});

test('conditions: fog and rain make a poor verdict; missing forecast is tolerated', () => {
  const line = wigglyLine([SIENA, MONTALCINO]);
  const dep = new Date('2026-11-17T08:00:00Z');
  const wet = forecast(dep, 4, { precipProb: 90, lowCloud: 90, fog: true });
  const c = assessConditions({ line, km: 40, minutes: 50, departure: dep, forecasts: [wet, wet, wet, wet] });
  assert.equal(c.verdict, 'poor');
  const none = assessConditions({ line, km: 40, minutes: 50, departure: dep, forecasts: [] });
  assert.equal(none.weather.length, 0);
  assert.equal(none.verdict, 'good');
});

test('advisories: ZTL crossing blocks, ZTL destination warns, gravel blocks with rental car', () => {
  const line = wigglyLine([{ lat: 43.35, lon: 11.33 }, SIENA, MONTALCINO]);
  const ztl = squareZone(SIENA, 0.6, { kind: 'ztl', name: 'Siena', hours: '7:30–20:00' });
  const crossing = routeAdvisories({ line, zones: [ztl] });
  assert.equal(crossing[0].severity, 'block');
  assert.ok(isBlocked(crossing));
  const toCentre = routeAdvisories({ line: wigglyLine([MONTALCINO, SIENA]), zones: [ztl] });
  assert.equal(toCentre[0].severity, 'warning');
  assert.match(toCentre[0].title, /Destination/);
  assert.ok(isBlocked(routeAdvisories({ line, unpavedKm: 3, prefs: { rentalCar: true } })));
  assert.ok(!isBlocked(routeAdvisories({ line, unpavedKm: 3, prefs: {} })));
});

test('advisories: vignette unless owned, seasonal pass closed in winter only', () => {
  const v = routeAdvisories({ line: wigglyLine([SIENA, MONTALCINO]), motorwayKmByCountry: { AT: 40, IT: 100 } });
  assert.equal(v.filter((a) => a.kind === 'vignette').length, 1);
  assert.equal(routeAdvisories({ line: wigglyLine([SIENA, MONTALCINO]), motorwayKmByCountry: { AT: 40 }, prefs: { vignettes: ['AT'] } }).length, 0);
  const stelvio = wigglyLine([{ lat: 46.55, lon: 10.40 }, { lat: 46.5286, lon: 10.4533 }, { lat: 46.50, lon: 10.50 }]);
  assert.equal(routeAdvisories({ line: stelvio, date: new Date('2026-01-10T10:00:00Z') })[0].kind, 'pass_closed');
  assert.equal(routeAdvisories({ line: stelvio, date: new Date('2026-07-10T10:00:00Z') })[0].kind, 'pass_seasonal');
});

test('handoff: shaping points ≤ 9, in driving order, include stops', () => {
  const line = wigglyLine([SIENA, SAN_QUIRICO, { lat: 42.4, lon: 11.9 }]);
  const pts = shapingPoints(line, [SAN_QUIRICO]);
  assert.ok(pts.length <= 9 && pts.length >= 3);
  assert.ok(pts.some((p) => distKm(p, SAN_QUIRICO) < 0.01));
  const u = new URL(googleMapsUrl(SIENA, MONTALCINO, pts));
  assert.equal(u.searchParams.get('waypoints')!.split('|').length, pts.length);
  assert.ok(pointAtKm(line, 10).point.lat < SIENA.lat);
  const gpx = toGpx(line, 'Val d\'Orcia & "friends"', [{ ...SAN_QUIRICO, name: 'San Quirico' }]);
  assert.match(gpx, /<wpt lat="43\.058300"/);
  assert.match(gpx, /&amp; &quot;friends&quot;/);
});

test('contracts apply defaults and reject bad input', () => {
  const r = PlanRequestSchema.parse({ origin: SIENA, destination: MONTALCINO });
  assert.equal(r.extraMinutes, undefined, 'no cap unless the driver sets one');
  assert.equal(r.style, 'scenic');
  assert.deepEqual(r.interests, []);
  assert.equal(r.vehicle, 'car');
  assert.equal(r.prefs.avoidUnpaved, true);
  assert.equal(r.maxRoutes, 3);
  assert.throws(() => PlanRequestSchema.parse({ origin: { lat: 99, lon: 0 }, destination: MONTALCINO }));
  assert.throws(() => PlanRequestSchema.parse({ origin: SIENA, destination: MONTALCINO, extraMinutes: 1000 }));
  const trip = TripSchema.parse({ id: crypto.randomUUID(), name: 'Tuscany', days: [{ origin: SIENA, destination: PIENZA }], createdAt: '2026-11-17T10:00:00Z', updatedAt: '2026-11-17T10:00:00Z' });
  assert.equal(trip.deleted, false);
  assert.deepEqual(SyncRequestSchema.parse({ cursor: null }).changes, { trips: [], ratings: [] });
});
