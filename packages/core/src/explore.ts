// "Where can I go from here?": scenic places within a drive time, each with a scenic road there.
// The driver then plans the chosen one (one way, or as a round trip out one road and back another).

import { distKm, encodePolyline, paddedBBox, resample, type LatLon } from './geo.ts';
import { FEATURE_FAMILY, type FeatureType, type ScenicFeature } from './features.ts';
import { clusterSpots, type Spot } from './candidates.ts';
import { describe, reliefStats, scoreRoute } from './score.ts';
import { sunTimes } from './sun.ts';
import { applyInterests, PlanError, type PlanOptions, type Providers, type RoutedPath } from './planner.ts';
import type { ExploreRequest, ExploreResponse, ExploreDestination } from './contracts.ts';

/** Straight-line km a drive of this many minutes usually covers on country roads. */
export const reachKm = (minutes: number) => minutes * 0.8;

/** Places worth driving to: a named place, preferably a town, plus what's around it. */
const DESTINATION_TYPES = new Set<FeatureType>(['hilltop_village', 'village', 'viewpoint', 'lake', 'beach', 'castle', 'heritage', 'mountain_pass', 'waterfall', 'coast', 'peak']);

function townFor(spot: Spot, features: ScenicFeature[]): ScenicFeature | undefined {
  // A town's name reads best ("Montalcino"); else the strongest named place in the spot.
  return features
    .filter((f) => (f.type === 'hilltop_village' || f.type === 'village') && f.name && distKm(f, spot) < 2.5)
    .sort((a, b) => b.weight - a.weight || distKm(a, spot) - distKm(b, spot))[0];
}

/** Pick spread-out candidate places between minKm and maxKm from the origin, strongest first. */
export function destinationCandidates(origin: LatLon, features: ScenicFeature[], maxKm: number, max = 10, prefer: Set<string> = new Set()): (Spot & { label: string })[] {
  // Places of the families the driver loves come first; within each group, the richest first.
  const loved = (s: Spot) => s.types.some((t) => prefer.has(FEATURE_FAMILY[t]));
  // Worth the trip: a famous town counts more than a big cluster of vineyards (sum of weights over-rewards
  // dense countryside), so rank by the town's own weight plus the cluster's, damped by its size.
  const ranked = clusterSpots(features, 2.5).map((s) => {
    const town = townFor(s, features);
    return { s, town, value: s.weight / Math.sqrt(s.count) + 2 * (town?.weight ?? 0) };
  });
  ranked.sort((a, b) => Number(loved(b.s)) - Number(loved(a.s)) || b.value - a.value);
  const minKm = Math.max(5, maxKm * 0.06);
  const gapKm = Math.max(5, maxKm * 0.12);
  const out: (Spot & { label: string })[] = [];
  for (const { s, town } of ranked) {
    const d = distKm(origin, s);
    if (d < minKm || d > maxKm) continue;
    if (!s.types.some((t) => DESTINATION_TYPES.has(t))) continue;
    const label = town?.name || s.name;
    if (!label || !/^[\p{Lu}\p{N}]/u.test(label)) continue;
    if (out.some((o) => distKm(o, s) < gapKm || o.label === label)) continue;
    out.push({ ...s, label });
    if (out.length === max) break;
  }
  return out;
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<(R | null)[]> {
  const out: (R | null)[] = new Array(items.length).fill(null);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try { out[i] = await fn(items[i]); } catch { out[i] = null; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export async function exploreFrom(req: ExploreRequest, p: Providers, opts: PlanOptions = {}): Promise<ExploreResponse> {
  const log = opts.log ?? (() => {});
  const now = opts.now ?? new Date();
  const departure = req.departAt ? new Date(req.departAt) : now;
  const roundTrip = req.mode === 'round_trip';
  // Time to get there: the whole budget one way; for a loop, about half.
  const outMinutes = roundTrip ? req.maxMinutes * 0.5 : req.maxMinutes;
  const maxKm = reachKm(outMinutes);
  const warnings: string[] = [];

  let features: ScenicFeature[];
  try {
    features = await p.features.features(paddedBBox([req.origin], maxKm + 2));
  } catch (e) {
    log('features failed', e);
    throw new PlanError('Scenic places could not be loaded right now. Try again in a minute.', 503);
  }
  const loved = applyInterests(features, req.interests);
  const prefer = new Set<string>(req.interests.filter((i) => i !== 'quiet'));
  const candidates = destinationCandidates(req.origin, loved, maxKm, 16, prefer);
  if (!candidates.length) throw new PlanError('No scenic places found within that time yet. Try a longer drive.');

  const base = { prefs: { ...req.prefs, avoidUnpaved: req.prefs.avoidUnpaved || req.vehicle !== 'car' }, vehicle: req.vehicle };
  const join = (a: RoutedPath, b: RoutedPath): RoutedPath => ({
    line: [...a.line, ...b.line.slice(1)], km: a.km + b.km, minutes: a.minutes + b.minutes,
    motorwayKm: (a.motorwayKm ?? 0) + (b.motorwayKm ?? 0), urbanKm: (a.urbanKm ?? 0) + (b.urbanKm ?? 0), unpavedKm: (a.unpavedKm ?? 0) + (b.unpavedKm ?? 0),
  });
  const scenicOr = async (pts: LatLon[], strength: number, fallback: RoutedPath) => {
    if (!p.router.supportsScenic) return fallback;
    try { return await p.router.route(pts, { ...base, profile: 'scenic', strength }); } catch (e) { log('scenic leg failed', e); return fallback; }
  };
  // Two passes: the quick fastest-road check for every candidate (cheap), then scenic roads for the best 8
  // (scenic searches are the expensive part).
  const reachable = (await pool(candidates, opts.concurrency ?? 6, async (c) => {
    const fastOut = await p.router.route([req.origin, c], { ...base, profile: 'fastest' });
    return fastOut.minutes > outMinutes * 0.85 ? null : { c, fastOut };
  })).filter((x): x is NonNullable<typeof x> => !!x).slice(0, 8);
  const routed = await pool(reachable, opts.concurrency ?? 4, async ({ c, fastOut }) => {
    // The drive time is a promise: the fastest way must fit with room to spare, the scenic way must fit.
    if (!roundTrip) {
      const s = await scenicOr([req.origin, c], 2, fastOut);
      return { c, fastest: fastOut, scenic: s.minutes <= req.maxMinutes ? s : fastOut };
    }
    // A loop: out by the most scenic road, back by a gentler scenic one (usually different), all within the time.
    const fastBack = await p.router.route([c, req.origin], { ...base, profile: 'fastest' });
    const fastest = join(fastOut, fastBack);
    if (fastest.minutes > req.maxMinutes * 0.85) return null;
    const out = await scenicOr([req.origin, c], 3, fastOut);
    const back = await scenicOr([c, req.origin], 1, fastBack);
    for (const loop of [join(out, back), join(out, fastBack), join(fastOut, back)]) if (loop.minutes <= req.maxMinutes) return { c, fastest, scenic: loop };
    return { c, fastest, scenic: fastest };
  });
  const ok = routed.filter((x): x is NonNullable<typeof x> => !!x);
  if (!ok.length) throw new PlanError('No scenic places can be reached within that time. Try a longer drive.');

  // Hills for every route in one batched call.
  const elevPts = ok.map((r) => resample(r.scenic.line, Math.max(0.5, r.scenic.km / 60)).slice(0, 60));
  let elevs: (number | null)[][] | null = null;
  if (p.elevation) {
    try {
      const flat = await p.elevation.elevations(elevPts.flat());
      let k = 0;
      elevs = elevPts.map((pts) => { const out = flat.slice(k, k + pts.length); k += pts.length; return out; });
    } catch (e) { log('elevation failed', e); }
  }

  const maxWeight = Math.max(...ok.map((r) => r.c.weight));
  const quiet = req.interests.includes('quiet');
  const scored = ok.map((r, i) => {
    const s = scoreRoute({ route: r.scenic, features, relief: elevs ? reliefStats(elevs[i]) : null, quiet });
    // The place matters as much as the road there: a great town at the end of a fine road leads.
    const matches = r.c.types.some((t) => prefer.has(FEATURE_FAMILY[t]));
    const value = 0.65 * s.score + 35 * Math.sqrt(r.c.weight / maxWeight) + (matches ? 15 : 0);
    return { ...r, s, value };
  });
  scored.sort((a, b) => b.value - a.value);

  const destinations: ExploreDestination[] = scored.slice(0, req.maxResults).map((r) => {
    const sun = sunTimes(departure, r.c.lat, r.c.lon);
    const families = [...new Set(r.c.types.map((t) => FEATURE_FAMILY[t]))];
    return {
      name: r.c.label,
      lat: Math.round(r.c.lat * 1e5) / 1e5,
      lon: Math.round(r.c.lon * 1e5) / 1e5,
      types: r.c.types,
      families,
      places: r.c.count,
      score: r.s.score,
      summary: describe(r.s),
      km: Math.round(r.scenic.km * 10) / 10,
      minutes: Math.round(r.scenic.minutes),
      fastestMinutes: Math.round(r.fastest.minutes),
      straightKm: Math.round(distKm(req.origin, r.c) * 10) / 10,
      highlights: r.s.highlights,
      polyline: encodePolyline(r.scenic.line, 5),
      sunset: sun ? sun.sunset.toISOString() : null,
    };
  });
  if (!p.router.supportsScenic) warnings.push('Roads there are the quickest ones; the scenic route is planned when you pick a place.');

  const attribution = [...new Set([p.router.attribution, p.features.attribution, p.elevation?.attribution, '© OpenStreetMap contributors'].filter((x): x is string => !!x))];
  return { origin: req.origin, mode: req.mode, maxMinutes: req.maxMinutes, destinations, warnings, attribution };
}
