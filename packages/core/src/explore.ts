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
export const reachKm = (minutes: number) => minutes * 0.65;

/** Places worth driving to: a named place, preferably a town, plus what's around it. */
const DESTINATION_TYPES = new Set<FeatureType>(['hilltop_village', 'village', 'viewpoint', 'lake', 'beach', 'castle', 'heritage', 'mountain_pass', 'waterfall', 'coast', 'peak']);

function nameFor(spot: Spot, features: ScenicFeature[]): string {
  // A town's name reads best ("Montalcino"); else the strongest named place in the spot.
  const town = features
    .filter((f) => (f.type === 'hilltop_village' || f.type === 'village') && f.name && distKm(f, spot) < 2.5)
    .sort((a, b) => b.weight - a.weight || distKm(a, spot) - distKm(b, spot))[0];
  return town?.name || spot.name;
}

/** Pick spread-out candidate places between minKm and maxKm from the origin, strongest first. */
export function destinationCandidates(origin: LatLon, features: ScenicFeature[], maxKm: number, max = 10): (Spot & { label: string })[] {
  const spots = clusterSpots(features, 2.5);
  const minKm = Math.max(6, maxKm * 0.15);
  const gapKm = Math.max(6, maxKm * 0.2);
  const out: (Spot & { label: string })[] = [];
  for (const s of spots) {
    const d = distKm(origin, s);
    if (d < minKm || d > maxKm) continue;
    if (!s.types.some((t) => DESTINATION_TYPES.has(t))) continue;
    const label = nameFor(s, features);
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
  // Time to get there: the whole budget one way; for a loop, a bit under half (the way back is longer).
  const outMinutes = roundTrip ? req.maxMinutes * 0.45 : req.maxMinutes;
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
  const candidates = destinationCandidates(req.origin, loved, maxKm, 10);
  if (!candidates.length) throw new PlanError('No scenic places found within that time yet. Try a longer drive.');

  const base = { prefs: { ...req.prefs, avoidUnpaved: req.prefs.avoidUnpaved || req.vehicle !== 'car' }, vehicle: req.vehicle };
  const routed = await pool(candidates, opts.concurrency ?? 4, async (c) => {
    const fastest = await p.router.route([req.origin, c], { ...base, profile: 'fastest' });
    if (fastest.minutes > outMinutes * 1.1) return null;
    let scenic: RoutedPath = fastest;
    if (p.router.supportsScenic) {
      try {
        const s = await p.router.route([req.origin, c], { ...base, profile: 'scenic', strength: 2 });
        if (s.minutes <= outMinutes * 1.25) scenic = s;
      } catch (e) { log('scenic leg failed', e); }
    }
    return { c, fastest, scenic };
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
    const value = 0.65 * s.score + 35 * Math.sqrt(r.c.weight / maxWeight);
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
