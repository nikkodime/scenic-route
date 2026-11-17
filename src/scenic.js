// Scenic logic: what counts as beautiful, where to detour, how to score a route.
// Pure functions only (no network), so they can be tested in Node.

import { distKm, detourKm, projectT, paddedBBox, resample, lineLengthKm, bearing } from './geo.js';

// How much each kind of OpenStreetMap feature adds to a road's beauty.
// Tuned by hand for Tuscany; ratings from test drives should adjust these.
export const FEATURE_WEIGHTS = {
  viewpoint: 5,
  mountain_pass: 5,
  peak: 2.5,
  castle: 3,
  hilltop_village: 2,
  village: 1,
  beach: 3,
  lake: 3,
  coast: 2.5,
  vineyard: 1.5,
  cypress: 3,
  scenic_road: 4,
  attraction: 1.5,
};

export const FEATURE_LABEL_ONE = {
  viewpoint: 'viewpoint', mountain_pass: 'pass', peak: 'hill or peak', castle: 'castle',
  hilltop_village: 'hill town', village: 'village', beach: 'beach', lake: 'lake', coast: 'stretch of coast',
  vineyard: 'vineyard', cypress: 'cypress avenue', scenic_road: 'scenic road', attraction: 'sight',
};

export const FEATURE_LABELS = {
  viewpoint: 'viewpoints',
  mountain_pass: 'passes',
  peak: 'hills and peaks',
  castle: 'castles',
  hilltop_village: 'hill towns',
  village: 'villages',
  beach: 'beaches',
  lake: 'lakes',
  coast: 'coast',
  vineyard: 'vineyards',
  cypress: 'cypress avenues',
  scenic_road: 'scenic roads',
  attraction: 'sights',
};

/** Overpass QL query for scenic features inside bbox [s,w,n,e]. */
export function overpassQuery(bbox) {
  const b = bbox.map((x) => x.toFixed(5)).join(',');
  return `[out:json][timeout:40];
(
  node["tourism"="viewpoint"](${b});
  node["mountain_pass"="yes"](${b});
  node["natural"="peak"](${b});
  nwr["historic"~"^(castle|fort|tower)$"](${b});
  node["place"~"^(village|hamlet)$"](${b});
  nwr["natural"="beach"](${b});
  way["natural"="water"]["water"~"^(lake|reservoir)$"](${b});
  way["natural"="coastline"](${b});
  way["landuse"="vineyard"](${b});
  way["natural"="tree_row"]["species"~"Cupressus",i](${b});
  way["natural"="tree_row"]["genus"="Cupressus"](${b});
  way["scenic"="yes"]["highway"](${b});
  node["tourism"="attraction"](${b});
);
out center tags;`;
}

function classify(tags) {
  if (!tags) return null;
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.mountain_pass === 'yes') return 'mountain_pass';
  if (tags.natural === 'peak') return 'peak';
  if (['castle', 'fort', 'tower'].includes(tags.historic)) return 'castle';
  if (tags.natural === 'beach') return 'beach';
  if (tags.natural === 'water') return 'lake';
  if (tags.natural === 'coastline') return 'coast';
  if (tags.landuse === 'vineyard') return 'vineyard';
  if (tags.natural === 'tree_row') return 'cypress';
  if (tags.scenic === 'yes' && tags.highway) return 'scenic_road';
  if (tags.place === 'village' || tags.place === 'hamlet') {
    const ele = parseFloat(tags.ele);
    return ele >= 250 ? 'hilltop_village' : 'village';
  }
  if (tags.tourism === 'attraction') return 'attraction';
  return null;
}

/** Turn an Overpass JSON response into a flat list of scenic features. */
export function parseFeatures(json) {
  const out = [];
  for (const el of json?.elements ?? []) {
    const type = classify(el.tags);
    if (!type) continue;
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    let weight = FEATURE_WEIGHTS[type];
    // Peaks with a height count more: a 900 m hill is a better view than a 150 m bump.
    if (type === 'peak' && el.tags.ele) weight += Math.min(2.5, parseFloat(el.tags.ele) / 600 || 0);
    out.push({ id: `${el.type}/${el.id}`, lat, lon, type, weight, name: el.tags.name || '' });
  }
  return out;
}

/**
 * Group nearby features so one detour target stands for a whole scenic area
 * (e.g. a hill town with its castle, viewpoint and vineyards).
 */
export function clusterSpots(features, radiusKm = 2) {
  // Greedy: the strongest feature starts a spot, weaker ones within radius join it.
  const sorted = [...features].sort((a, b) => b.weight - a.weight);
  const spots = [];
  for (const f of sorted) {
    const home = spots.find((s) => distKm(s, f) <= radiusKm);
    if (home) {
      home.weight += f.weight;
      home.count += 1;
      if (!home.name && f.name && f.weight >= 1) home.name = f.name;
      if (!home.types.includes(f.type)) home.types.push(f.type);
    } else {
      // Anchor on the best single feature, not a cell centre, so the route
      // goes somewhere real (a viewpoint, a pass) rather than a field.
      spots.push({ lat: f.lat, lon: f.lon, weight: f.weight, count: 1, name: f.name || '', types: [f.type] });
    }
  }
  return spots.sort((a, b) => b.weight - a.weight);
}

/** Rough extra km you can afford for an extra-time budget on country roads. */
export function budgetKm(extraMin) {
  return (extraMin / 60) * 45; // ~45 km/h average on scenic secondary roads
}

/** Search radius for the Overpass query. */
export function corridorPadKm(directKm, extraMin) {
  return Math.min(25, Math.max(4, budgetKm(extraMin) / 2.2 + directKm * 0.05));
}

export function corridorBBox(start, end, extraMin) {
  return paddedBBox([start, end], corridorPadKm(distKm(start, end), extraMin));
}

/**
 * Pick sets of 0–3 scenic spots to route through. Each set is ordered along
 * the start→end axis so the route never doubles back.
 */
export function candidateWaypointSets(start, end, spots, extraMin, maxSets = 8) {
  const budget = budgetKm(extraMin);
  const usable = spots
    .map((s) => ({ ...s, t: projectT(start, end, s), detour: detourKm(start, end, s) }))
    .filter((s) => s.t > 0.05 && s.t < 0.95 && s.detour < budget * 0.75 && distKm(s, start) > 2 && distKm(s, end) > 2)
    .map((s) => ({ ...s, value: s.weight / (1 + s.detour / 3) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const sets = [[]]; // always include the plain route as a baseline
  const key = (set) => set.map((s) => `${s.lat.toFixed(4)},${s.lon.toFixed(4)}`).join('|');
  const seen = new Set(['']);
  const add = (set) => {
    const ordered = [...set].sort((a, b) => a.t - b.t);
    // straight-line detour of the whole chain must fit the budget
    const chain = [start, ...ordered, end];
    let len = 0;
    for (let i = 1; i < chain.length; i++) len += distKm(chain[i - 1], chain[i]);
    if (len - distKm(start, end) > budget) return;
    // skip chains that zig-zag (consecutive spots too close in progress)
    for (let i = 1; i < ordered.length; i++) if (ordered[i].t - ordered[i - 1].t < 0.08) return;
    const k = key(ordered);
    if (seen.has(k)) return;
    seen.add(k);
    sets.push(ordered);
  };

  for (const s of usable.slice(0, 4)) add([s]);
  for (let i = 0; i < Math.min(6, usable.length); i++)
    for (let j = i + 1; j < Math.min(6, usable.length); j++) add([usable[i], usable[j]]);
  if (usable.length >= 3) add(usable.slice(0, 3));
  return sets.slice(0, maxSets);
}

/** Average absolute heading change in degrees per km: higher = more bends. */
export function bendiness(line) {
  const pts = resample(line, 0.1);
  let turn = 0;
  for (let i = 2; i < pts.length; i++) {
    const b1 = bearing(pts[i - 2], pts[i - 1]);
    const b2 = bearing(pts[i - 1], pts[i]);
    let d = Math.abs(b2 - b1);
    if (d > 180) d = 360 - d;
    if (d < 120) turn += d; // ignore U-turn artefacts
  }
  const km = lineLengthKm(line) || 1;
  return turn / km;
}

/** Features within reach of the route, each counted once. */
export function featuresAlong(line, features, reachKm = 1.2) {
  const pts = resample(line, 0.4);
  const hit = new Map();
  // coarse prefilter by bbox
  const bb = paddedBBox(line, reachKm + 0.5);
  for (const f of features) {
    if (f.lat < bb[0] || f.lat > bb[2] || f.lon < bb[1] || f.lon > bb[3]) continue;
    let best = Infinity;
    for (const p of pts) {
      const d = distKm(p, f);
      if (d < best) best = d;
      if (best < 0.2) break;
    }
    if (best <= reachKm) hit.set(f.id, { ...f, distKm: best });
  }
  return [...hit.values()];
}

/** Climb and relief from an elevation profile in metres. */
export function reliefStats(elevations) {
  const e = elevations.filter((x) => Number.isFinite(x));
  if (e.length < 2) return null;
  let climb = 0;
  for (let i = 1; i < e.length; i++) climb += Math.max(0, e[i] - e[i - 1]);
  return { min: Math.min(...e), max: Math.max(...e), climb };
}

/**
 * Score a route 0–100 for scenery. Inputs:
 *  route: {line, km, minutes, motorwayKm}
 *  features: scenic features in the area
 *  relief: optional {min,max,climb}
 */
export function scoreRoute(route, features, relief = null) {
  const near = featuresAlong(route.line, features);
  const raw = near.reduce((s, f) => s + f.weight * (f.distKm < 0.5 ? 1 : 0.6), 0);
  const perKm = raw / Math.max(5, route.km);

  const scenery = 100 * (1 - Math.exp(-perKm / 0.5)); // saturates; ~1 pt/km is very scenic
  const bends = Math.min(100, (bendiness(route.line) / 120) * 100); // 120°/km = proper hill road
  const hills = relief ? Math.min(100, (relief.max - relief.min) / 6 + relief.climb / Math.max(5, route.km) / 0.4) : null;
  const motorwayShare = route.km ? Math.min(1, (route.motorwayKm || 0) / route.km) : 0;

  let score = 0.55 * scenery + 0.2 * bends + (hills == null ? 0.25 * scenery : 0.25 * hills);
  score *= 1 - 0.7 * motorwayShare; // motorways are rarely the beautiful option
  const byType = {};
  for (const f of near) byType[f.type] = (byType[f.type] || 0) + 1;
  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    parts: { scenery: Math.round(scenery), bends: Math.round(bends), hills: hills == null ? null : Math.round(hills), motorwayPct: Math.round(motorwayShare * 100) },
    highlights: near.filter((f) => f.name && f.weight >= 2.5).sort((a, b) => b.weight - a.weight).slice(0, 5).map((f) => ({ name: f.name, type: f.type })),
    byType,
  };
}

/** One-line plain description of a route's character. */
export function describe(scored) {
  const parts = Object.entries(scored.byType)
    .sort((a, b) => FEATURE_WEIGHTS[b[0]] * b[1] - FEATURE_WEIGHTS[a[0]] * a[1])
    .slice(0, 3)
    .map(([t, n]) => `${n} ${n === 1 ? FEATURE_LABEL_ONE[t] : FEATURE_LABELS[t]}`);
  return parts.length ? parts.join(', ') : 'Mostly plain roads';
}

/**
 * Keep routes within the time budget, rank by score, and drop near-duplicates
 * (routes that differ by less than a few minutes and a few points).
 */
export function rankRoutes(routes, directMinutes, extraMin, keep = 3) {
  const limit = directMinutes + extraMin * 1.1;
  const ok = routes.filter((r) => r.minutes <= limit).sort((a, b) => b.scored.score - a.scored.score);
  const picked = [];
  for (const r of ok) {
    if (picked.some((p) => Math.abs(p.minutes - r.minutes) < 3 && Math.abs(p.scored.score - r.scored.score) < 4)) continue;
    picked.push(r);
    if (picked.length === keep) break;
  }
  return picked;
}

/** Google Maps directions link (driving) through the chosen scenic spots. */
export function googleMapsUrl(start, end, waypoints) {
  const f = (p) => `${p.lat.toFixed(6)},${p.lon.toFixed(6)}`;
  const u = new URL('https://www.google.com/maps/dir/');
  u.searchParams.set('api', '1');
  if (start) u.searchParams.set('origin', f(start));
  u.searchParams.set('destination', f(end));
  if (waypoints.length) u.searchParams.set('waypoints', waypoints.map(f).join('|'));
  u.searchParams.set('travelmode', 'driving');
  return u.toString();
}

/** GPX track for other navigation apps (OsmAnd, Organic Maps, car units). */
export function toGpx(line, name = 'Scenic route') {
  const esc = (s) => s.replace(/[<&>"]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;', '"': '&quot;' }[c]));
  const pts = line.map((p) => `<trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="scenic-route" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>${esc(name)}</name><trkseg>${pts}</trkseg></trk></gpx>`;
}
