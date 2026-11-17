import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distKm, resample, lineLengthKm, projectT } from '../src/geo.js';
import {
  parseFeatures, clusterSpots, candidateWaypointSets, bendiness, scoreRoute, rankRoutes,
  googleMapsUrl, overpassQuery, corridorBBox, describe, reliefStats, toGpx,
} from '../src/scenic.js';
import { parseOsrm } from '../src/api.js';
import { sunTimes } from '../src/sun.js';

const SIENA = { lat: 43.3188, lon: 11.3308 };
const MONTALCINO = { lat: 43.0586, lon: 11.4893 };

test('distances are sane (Siena to Montalcino ~ 30 km straight)', () => {
  const d = distKm(SIENA, MONTALCINO);
  assert.ok(d > 28 && d < 33, `got ${d}`);
});

test('resample keeps length and spacing', () => {
  const line = [SIENA, MONTALCINO];
  const pts = resample(line, 1);
  assert.ok(pts.length >= 30 && pts.length <= 33);
  assert.ok(Math.abs(lineLengthKm(pts) - lineLengthKm(line)) < 0.01);
});

test('parseFeatures classifies OSM elements and boosts tall peaks', () => {
  const json = {
    elements: [
      { type: 'node', id: 1, lat: 43.1, lon: 11.5, tags: { tourism: 'viewpoint', name: 'Belvedere' } },
      { type: 'node', id: 2, lat: 43.2, lon: 11.4, tags: { natural: 'peak', ele: '1200', name: 'Monte' } },
      { type: 'node', id: 3, lat: 43.2, lon: 11.4, tags: { natural: 'peak', ele: '100' } },
      { type: 'node', id: 4, lat: 43.2, lon: 11.4, tags: { place: 'village', ele: '420', name: 'Borgo' } },
      { type: 'way', id: 5, center: { lat: 43.0, lon: 11.3 }, tags: { landuse: 'vineyard' } },
      { type: 'node', id: 6, lat: 43.0, lon: 11.3, tags: { amenity: 'parking' } },
    ],
  };
  const f = parseFeatures(json);
  assert.equal(f.length, 5);
  assert.equal(f.find((x) => x.id === 'node/4').type, 'hilltop_village');
  const tall = f.find((x) => x.id === 'node/2'), short = f.find((x) => x.id === 'node/3');
  assert.ok(tall.weight > short.weight);
  assert.equal(f.find((x) => x.id === 'way/5').type, 'vineyard');
});

test('overpass query uses a corridor bbox around both ends', () => {
  const bb = corridorBBox(SIENA, MONTALCINO, 30);
  assert.ok(bb[0] < MONTALCINO.lat && bb[2] > SIENA.lat && bb[1] < SIENA.lon && bb[3] > MONTALCINO.lon);
  assert.match(overpassQuery(bb), /tourism"="viewpoint/);
});

test('clusterSpots merges nearby features and anchors on the best one', () => {
  const feats = [
    { id: 'a', lat: 43.1, lon: 11.40, type: 'viewpoint', weight: 5, name: 'View' },
    { id: 'b', lat: 43.101, lon: 11.401, type: 'village', weight: 1, name: 'Borgo' },
    { id: 'c', lat: 43.25, lon: 11.2, type: 'lake', weight: 3, name: 'Lago' },
  ];
  const spots = clusterSpots(feats);
  assert.equal(spots.length, 2);
  assert.equal(spots[0].weight, 6);
  assert.equal(spots[0].lat, 43.1);
  assert.equal(spots[0].name, 'View');
});

test('candidate sets start with the plain route, stay ordered and within budget', () => {
  const spots = [
    { lat: 43.20, lon: 11.45, weight: 10, name: 'Near A' },
    { lat: 43.12, lon: 11.40, weight: 8, name: 'Near B' },
    { lat: 43.12, lon: 11.17, weight: 50, name: 'Far west' }, // big detour
    { lat: 43.33, lon: 11.33, weight: 9, name: 'At start' }, // too close to start
  ];
  const sets = candidateWaypointSets(SIENA, MONTALCINO, spots, 15);
  assert.deepEqual(sets[0], []);
  const names = sets.flat().map((s) => s.name);
  assert.ok(!names.includes('At start'));
  assert.ok(!names.includes('Far west'), 'a 15 min budget should not reach the far-west spot');
  for (const set of sets) {
    for (let i = 1; i < set.length; i++) assert.ok(projectT(SIENA, MONTALCINO, set[i]) > projectT(SIENA, MONTALCINO, set[i - 1]));
  }
  const big = candidateWaypointSets(SIENA, MONTALCINO, spots, 120).flat().map((s) => s.name);
  assert.ok(big.includes('Far west'), 'a 2 h budget can include the far-west spot');
});

function zigzag(a, b, n, amp) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push({ lat: a.lat + (b.lat - a.lat) * t + (i % 2 ? amp : -amp), lon: a.lon + (b.lon - a.lon) * t });
  }
  return out;
}

test('bendiness: straight road ~0, winding road high', () => {
  assert.ok(bendiness([SIENA, MONTALCINO]) < 1);
  assert.ok(bendiness(zigzag(SIENA, MONTALCINO, 120, 0.003)) > 40);
});

test('scoreRoute prefers the road past scenic places and punishes motorways', () => {
  const feats = parseFeatures({ elements: [
    { type: 'node', id: 1, lat: 43.19, lon: 11.41, tags: { tourism: 'viewpoint', name: 'Belvedere' } },
    { type: 'node', id: 2, lat: 43.15, lon: 11.43, tags: { historic: 'castle', name: 'Castello' } },
    { type: 'way', id: 3, center: { lat: 43.10, lon: 11.46 }, tags: { landuse: 'vineyard' } },
  ] });
  const scenicLine = [SIENA, { lat: 43.19, lon: 11.41 }, { lat: 43.15, lon: 11.43 }, { lat: 43.10, lon: 11.46 }, MONTALCINO];
  const plainLine = [SIENA, { lat: 43.2, lon: 11.6 }, MONTALCINO];
  const scenic = scoreRoute({ line: scenicLine, km: lineLengthKm(scenicLine), motorwayKm: 0 }, feats);
  const plain = scoreRoute({ line: plainLine, km: lineLengthKm(plainLine), motorwayKm: 0 }, feats);
  assert.ok(scenic.score > plain.score + 20, `${scenic.score} vs ${plain.score}`);
  assert.deepEqual(scenic.highlights.map((h) => h.name), ['Belvedere', 'Castello']);
  assert.match(describe(scenic), /1 viewpoint\b/);
  const mw = scoreRoute({ line: scenicLine, km: lineLengthKm(scenicLine), motorwayKm: lineLengthKm(scenicLine) }, feats);
  assert.ok(mw.score < scenic.score * 0.5);
});

test('relief adds to the score', () => {
  const line = zigzag(SIENA, MONTALCINO, 40, 0.001);
  const r = { line, km: lineLengthKm(line), motorwayKm: 0 };
  const flat = scoreRoute(r, [], reliefStats([200, 201, 200, 202]));
  const hilly = scoreRoute(r, [], reliefStats([200, 450, 300, 620, 380]));
  assert.ok(hilly.score > flat.score);
});

test('rankRoutes respects the time budget and removes near-duplicates', () => {
  const mk = (minutes, score) => ({ minutes, scored: { score } });
  const ranked = rankRoutes([mk(40, 20), mk(70, 90), mk(58, 70), mk(59, 72), mk(100, 99)], 40, 30);
  assert.deepEqual(ranked.map((r) => r.minutes), [70, 59, 40]);
});

test('parseOsrm sums motorway distance from step classes', () => {
  const r = parseOsrm({
    distance: 50000, duration: 3000,
    geometry: { coordinates: [[11.33, 43.31], [11.48, 43.05]] },
    legs: [{ steps: [
      { distance: 20000, intersections: [{ classes: ['motorway'] }] },
      { distance: 30000, intersections: [{}] },
    ] }],
  });
  assert.equal(r.km, 50);
  assert.equal(r.minutes, 50);
  assert.equal(r.motorwayKm, 20);
  assert.equal(r.line[0].lat, 43.31);
});

test('Google Maps link carries origin, destination and ordered waypoints', () => {
  const u = new URL(googleMapsUrl(SIENA, MONTALCINO, [{ lat: 43.2, lon: 11.4 }, { lat: 43.1, lon: 11.45 }]));
  assert.equal(u.searchParams.get('travelmode'), 'driving');
  assert.equal(u.searchParams.get('waypoints'), '43.200000,11.400000|43.100000,11.450000');
  assert.equal(new URL(googleMapsUrl(null, MONTALCINO, [])).searchParams.has('origin'), false);
});

test('GPX output is well formed and escapes names', () => {
  const g = toGpx([SIENA, MONTALCINO], 'A & B');
  assert.match(g, /<name>A &amp; B<\/name>/);
  assert.equal((g.match(/<trkpt/g) || []).length, 2);
});

test('sunset in Florence on 17 Nov is about 16:50 local (15:50 UTC)', () => {
  const s = sunTimes(new Date(Date.UTC(2026, 10, 17, 12)), 43.77, 11.25);
  const utcMin = s.sunset.getUTCHours() * 60 + s.sunset.getUTCMinutes();
  assert.ok(Math.abs(utcMin - (15 * 60 + 50)) <= 8, `sunset ${s.sunset.toISOString()}`);
});
