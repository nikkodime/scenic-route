// Scoring a route for beauty, 0–100. One model, used by the API, the web planner and ratings analysis.

import { bearing, distKm, lineLengthKm, paddedBBox, resample, angleDiff, type LatLon } from './geo.ts';
import { FEATURE_FAMILY, FEATURE_LABEL, FEATURE_WEIGHTS, type FeatureType, type ScenicFeature } from './features.ts';

export const SCORE_MODEL = {
  version: '2026.11.2',
  weights: { scenery: 0.45, views: 0.15, relief: 0.15, bends: 0.15, variety: 0.1 },
  /** Feature reach from the road, km. Closer features count fully, farther ones partly. */
  reachKm: 1.2,
  nearKm: 0.5,
  farFactor: 0.6,
  /** Scenery is judged per stretch of this length, then averaged, so long routes aren't favoured. */
  windowKm: 5,
  /** Within a stretch, the n-th feature of one type adds less: a type saturates near this many. */
  typeCap: 2,
  /** Stretch value (weighted, capped points) at which a stretch is ~63% scenic. */
  sceneryScale: 14,
  /** Heading change (°/km) that counts as a proper hill road. */
  bendsFull: 120,
  /** Above this, bends stop adding and start to tire (hairpin stacks). */
  bendsTiring: 320,
  motorwayPenalty: 0.7,
  urbanPenalty: 0.3,
} as const;

export interface RouteStats {
  motorwayKm?: number;
  unpavedKm?: number;
  tollKm?: number;
  urbanKm?: number;
  ferryKm?: number;
}

export interface RouteGeometry extends RouteStats {
  line: LatLon[];
  km: number;
  minutes: number;
}

/** Optional pipeline data sampled along the route (0..1 each), ~1 sample per km. */
export interface SegmentSample {
  beauty: number;
  view: number;
}

export interface Relief {
  min: number;
  max: number;
  climb: number;
}

export interface NearFeature extends ScenicFeature {
  distKm: number;
  /** Position along the route, km from start. */
  atKm: number;
}

export interface ScoreParts {
  scenery: number;
  views: number | null;
  relief: number | null;
  bends: number;
  variety: number;
  motorwayPct: number;
  urbanPct: number;
}

export interface ScoredRoute {
  score: number;
  parts: ScoreParts;
  highlights: { name: string; type: FeatureType; atKm: number; lat: number; lon: number }[];
  byType: Partial<Record<FeatureType, number>>;
  near: NearFeature[];
  modelVersion: string;
}

/** Average absolute heading change in degrees per km. */
export function bendiness(line: LatLon[]): number {
  const pts = resample(line, 0.1);
  let turn = 0;
  for (let i = 2; i < pts.length; i++) {
    const d = angleDiff(bearing(pts[i - 2], pts[i - 1]), bearing(pts[i - 1], pts[i]));
    if (d < 120) turn += d; // ignore U-turn artefacts
  }
  return turn / (lineLengthKm(line) || 1);
}

/** Features within reach of the route, each counted once, with their position along it. */
export function featuresAlong(line: LatLon[], features: ScenicFeature[], reachKm: number = SCORE_MODEL.reachKm): NearFeature[] {
  const step = 0.4;
  const pts = resample(line, step);
  const bb = paddedBBox(line, reachKm + 0.5);
  const out: NearFeature[] = [];
  for (const f of features) {
    if (f.lat < bb[0] || f.lat > bb[2] || f.lon < bb[1] || f.lon > bb[3]) continue;
    let best = Infinity, idx = 0;
    for (let i = 0; i < pts.length; i++) {
      const d = distKm(pts[i], f);
      if (d < best) { best = d; idx = i; }
    }
    if (best <= reachKm) out.push({ ...f, distKm: best, atKm: idx * step });
  }
  const seen = new Set<string>();
  return out.filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)));
}

export function reliefStats(elevations: (number | null)[]): Relief | null {
  const e = elevations.filter((x): x is number => Number.isFinite(x));
  if (e.length < 2) return null;
  let climb = 0;
  for (let i = 1; i < e.length; i++) climb += Math.max(0, e[i] - e[i - 1]);
  return { min: Math.min(...e), max: Math.max(...e), climb };
}

const clamp = (x: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/**
 * Scenery from features, 0..1. Each 5 km stretch gets a value where every feature type saturates (twenty
 * vineyards or village towers are not twenty times one), and stretches are averaged. Dense OSM areas no
 * longer max out every route; a stretch needs several kinds of beauty to score high.
 */
export function windowScenery(near: NearFeature[], km: number): number {
  const M = SCORE_MODEL;
  const n = Math.max(1, Math.round(km / M.windowKm));
  const per: Map<FeatureType, { count: number; weight: number }>[] = Array.from({ length: n }, () => new Map());
  for (const f of near) {
    const w = Math.min(n - 1, Math.floor((f.atKm / Math.max(km, 0.1)) * n));
    const add = f.distKm < M.nearKm ? 1 : M.farFactor;
    const cell = per[w].get(f.type) ?? { count: 0, weight: 0 };
    cell.count += add;
    cell.weight = Math.max(cell.weight, f.weight); // the best of a type sets its value (peak height, interests)
    per[w].set(f.type, cell);
  }
  let sum = 0;
  for (const types of per) {
    let v = 0;
    for (const { count, weight } of types.values()) v += weight * M.typeCap * (1 - Math.exp(-count / M.typeCap));
    sum += 1 - Math.exp(-v / M.sceneryScale);
  }
  return sum / n;
}

export interface ScoreInput {
  route: RouteGeometry;
  features: ScenicFeature[];
  relief?: Relief | null;
  segments?: SegmentSample[] | null;
  /** The driver asked for quiet roads: motorways and towns cost more. */
  quiet?: boolean;
}

export function scoreRoute({ route, features, relief = null, segments = null, quiet = false }: ScoreInput): ScoredRoute {
  const M = SCORE_MODEL;
  const km = Math.max(route.km, 0.1);
  const near = featuresAlong(route.line, features);

  const featureScenery = 100 * windowScenery(near, km);
  const hasSeg = !!segments && segments.length > 0;
  const scenery = hasSeg ? 0.6 * featureScenery + 0.4 * 100 * mean(segments!.map((s) => s.beauty)) : featureScenery;

  const views = hasSeg ? 100 * mean(segments!.map((s) => s.view)) : null;
  const reliefScore = relief ? clamp((relief.max - relief.min) / 6 + relief.climb / Math.max(5, km) / 0.4) : null;

  const b = bendiness(route.line);
  let bends = clamp((b / M.bendsFull) * 100);
  if (b > M.bendsTiring) bends = clamp(100 - (b - M.bendsTiring) / 4, 60);

  // Variety: how many landscape families a typical 5 km stretch offers (not the whole route, which in
  // dense OSM areas always touches every family).
  const nWin = Math.max(1, Math.round(km / M.windowKm));
  const fam: Set<string>[] = Array.from({ length: nWin }, () => new Set());
  for (const f of near) if (f.weight >= 1.5) fam[Math.min(nWin - 1, Math.floor((f.atKm / km) * nWin))].add(FEATURE_FAMILY[f.type]);
  const variety = clamp((mean(fam.map((s) => s.size)) / 3) * 100);

  // Missing parts hand their weight to scenery, so scores stay comparable with and without pipeline data.
  const w = M.weights;
  let sceneryW = w.scenery;
  let total = w.bends * bends + w.variety * variety;
  if (views == null) sceneryW += w.views; else total += w.views * views;
  if (reliefScore == null) sceneryW += w.relief; else total += w.relief * reliefScore;
  total += sceneryW * scenery;

  const motorwayShare = Math.min(1, (route.motorwayKm ?? 0) / km);
  const urbanShare = Math.min(1, (route.urbanKm ?? 0) / km);
  total *= (1 - (quiet ? 0.9 : M.motorwayPenalty) * motorwayShare) * (1 - (quiet ? 0.6 : M.urbanPenalty) * urbanShare);

  const byType: Partial<Record<FeatureType, number>> = {};
  for (const f of near) byType[f.type] = (byType[f.type] ?? 0) + 1;

  return {
    score: Math.round(clamp(total)),
    parts: {
      scenery: Math.round(scenery),
      views: views == null ? null : Math.round(views),
      relief: reliefScore == null ? null : Math.round(reliefScore),
      bends: Math.round(bends),
      variety: Math.round(variety),
      motorwayPct: Math.round(motorwayShare * 100),
      urbanPct: Math.round(urbanShare * 100),
    },
    // Highlights are places along the way: not the start or finish town, and only real names
    // (OSM sometimes has notes like "view from cafe terrace" in the name tag).
    highlights: spreadAlong(near
      // The start and finish towns: 1.5 km along the road, and 2.5 km as the crow flies (a ring road can pass the
      // old-town gate several km in).
      .filter((f) => f.name && f.weight >= 2.5 && /^[\p{Lu}\p{N}]/u.test(f.name) && f.atKm > 1.5 && f.atKm < km - 1.5)
      .filter((f) => distKm(f, route.line[0]) > 2.5 && distKm(f, route.line[route.line.length - 1]) > 2.5)
      // Motorway infrastructure that OSM tags like a pass ("Valico autostradale", "Casello") is not a sight.
      .filter((f) => !/autostrad|motorway|autobahn|autoroute|casello|svincolo|area di servizio/i.test(f.name))
      .sort((a, b) => b.weight - a.weight)
      .filter((f, k, all) => all.findIndex((o) => o.name === f.name) === k), km)
      .map((f) => ({ name: f.name, type: f.type, atKm: Math.round(f.atKm * 10) / 10, lat: Math.round(f.lat * 1e5) / 1e5, lon: Math.round(f.lon * 1e5) / 1e5 })),
    byType,
    near,
    modelVersion: M.version,
  };
}

/**
 * Up to six highlights spread along the drive (the best place in each stretch, not six around one town),
 * topped up to three when the scenery is all in one place. Input best first; output in driving order.
 */
export function spreadAlong<T extends { atKm: number }>(best: T[], km: number): T[] {
  const gap = Math.max(2, km / 15);
  const spread: T[] = [];
  for (const f of best) if (spread.length < 6 && !spread.some((o) => Math.abs(o.atKm - f.atKm) < gap)) spread.push(f);
  for (const f of best) if (spread.length < 3 && !spread.includes(f)) spread.push(f);
  return spread.sort((a, b) => a.atKm - b.atKm);
}

/** One plain line about a route's character, e.g. "3 hill towns, 2 viewpoints, cypress avenue". */
export function describe(scored: Pick<ScoredRoute, 'byType'>): string {
  const parts = (Object.entries(scored.byType) as [FeatureType, number][])
    .sort((a, b) => FEATURE_WEIGHTS[b[0]] * b[1] - FEATURE_WEIGHTS[a[0]] * a[1])
    .slice(0, 3)
    .map(([t, n]) => (n === 1 ? `a ${FEATURE_LABEL[t][0]}` : `${n} ${FEATURE_LABEL[t][1]}`));
  if (!parts.length) return 'Mostly plain roads';
  const s = parts.join(', ');
  return s[0].toUpperCase() + s.slice(1);
}

/** Where along the route the beauty is concentrated: the best `windowKm` stretch. */
export function bestStretch(near: NearFeature[], routeKm: number, windowKm = 15): { fromKm: number; toKm: number } | null {
  if (!near.length) return null;
  const sorted = [...near].sort((a, b) => a.atKm - b.atKm);
  let best = -1, from = 0;
  for (const f of sorted) {
    const start = Math.max(0, Math.min(f.atKm, routeKm - windowKm));
    const sum = sorted.filter((g) => g.atKm >= start && g.atKm <= start + windowKm).reduce((s, g) => s + g.weight, 0);
    if (sum > best) { best = sum; from = start; }
  }
  return { fromKm: Math.round(from), toKm: Math.round(Math.min(routeKm, from + windowKm)) };
}
