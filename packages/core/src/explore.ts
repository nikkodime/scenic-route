// "Where can I go from here?": scenic places within a drive time, each with a scenic road there.
// The driver then plans the chosen one (one way, or as a round trip out one road and back another).

import { distKm, encodePolyline, paddedBBox, resample, type LatLon } from './geo.ts';
import { FEATURE_FAMILY, type FeatureType, type ScenicFeature } from './features.ts';
import type { Spot } from './candidates.ts';
import { describe, reliefStats, scoreRoute } from './score.ts';
import { retraced } from './rank.ts';
import { sunTimes } from './sun.ts';
import { applyInterests, PlanError, type PlanOptions, type Providers, type RoutedPath } from './planner.ts';
import type { ExploreRequest, ExploreResponse, ExploreDestination } from './contracts.ts';

/** Straight-line km a drive of this many minutes usually covers on country roads. */
export const reachKm = (minutes: number) => minutes * 0.8;

/** Places worth driving to: a named place, preferably a town, plus what's around it. */
const DESTINATION_TYPES = new Set<FeatureType>(['hilltop_village', 'village', 'viewpoint', 'lake', 'beach', 'castle', 'heritage', 'mountain_pass', 'waterfall', 'coast', 'peak']);
const TOWNS = new Set<FeatureType>(['hilltop_village', 'village']);
/** What visitors come to see: a town ringed by these is famous (Monteriggioni's walls, San Gimignano's towers). */
const SIGHTS = new Set<FeatureType>(['viewpoint', 'castle', 'heritage', 'attraction']);

export interface DestinationCandidate extends Spot {
  label: string;
  /** The family of the place itself (a lake is water; a village with a stream is not). */
  family: string;
}

/** A coarse grid so "what's near" stays fast for tens of thousands of places. */
function gridIndex(features: ScenicFeature[], cellDeg = 0.05) {
  const cells = new Map<string, ScenicFeature[]>();
  const key = (lat: number, lon: number) => `${Math.floor(lat / cellDeg)},${Math.floor(lon / cellDeg)}`;
  for (const f of features) {
    const k = key(f.lat, f.lon);
    const c = cells.get(k);
    if (c) c.push(f); else cells.set(k, [f]);
  }
  return (p: LatLon, km: number): ScenicFeature[] => {
    const dLat = km / 111, dLon = km / (111 * Math.cos((p.lat * Math.PI) / 180));
    const out: ScenicFeature[] = [];
    for (let i = Math.floor((p.lat - dLat) / cellDeg); i <= Math.floor((p.lat + dLat) / cellDeg); i++) {
      for (let j = Math.floor((p.lon - dLon) / cellDeg); j <= Math.floor((p.lon + dLon) / cellDeg); j++) {
        for (const f of cells.get(`${i},${j}`) ?? []) if (distKm(p, f) <= km) out.push(f);
      }
    }
    return out;
  };
}

/**
 * Pick spread-out places between minKm and maxKm from the origin, the most worth a trip first.
 * Fame comes from the place itself plus the sights around it, not from how many vineyards surround it.
 * Places of the families the driver loves come first.
 */
export function destinationCandidates(origin: LatLon, features: ScenicFeature[], maxKm: number, max = 10, prefer: Set<string> = new Set()): DestinationCandidate[] {
  const near = gridIndex(features);
  const minKm = Math.max(3.5, maxKm * 0.035);
  const gapKm = Math.max(5, maxKm * 0.12);
  const named = features.filter((f) => DESTINATION_TYPES.has(f.type) && f.name && /^[\p{Lu}\p{N}]/u.test(f.name) && f.weight >= 1.5);
  const ranked: (DestinationCandidate & { fame: number; loved: boolean })[] = [];
  for (const f of named) {
    const d = distKm(origin, f);
    if (d < minKm || d > maxKm) continue;
    const around = near(f, 1.5);
    const sights = around.reduce((s, g) => s + (g !== f && SIGHTS.has(g.type) ? g.weight : 0), 0);
    let fame: number;
    let at: LatLon = f;
    // A hamlet next to a villa is not a destination: sights count in proportion to the town's own standing.
    // A hamlet on the edge of a bigger town would borrow its sights: the town speaks for the spot.
    if (TOWNS.has(f.type) && around.some((g) => g !== f && TOWNS.has(g.type) && g.name && g.weight > f.weight)) continue;
    if (TOWNS.has(f.type)) fame = f.weight + 1.2 * Math.sqrt(sights) * Math.min(1, f.weight / 2.5);
    // A palace or fortress among dozens of sights is a city centre (Siena, Lucca): limited traffic zones,
    // not a scenic drive. Towns carry their own castles.
    else if (sights > 60 || (SIGHTS.has(f.type) && around.some((g) => TOWNS.has(g.type) && g.name && distKm(f, g) < 1.2))) continue;
    else if (f.type === 'lake') {
      // Drive to the best town on the shore, but call it by the lake's name. Small ponds aren't trips.
      if (f.weight < 3.5 || /cassa d|espansione|vasca|laminazione|depurat|invaso|discarica|cava\b/i.test(f.name)) continue;
      const shore = near(f, 12).filter((g) => TOWNS.has(g.type) && g.name).sort((x, y) => y.weight - x.weight || distKm(f, x) - distKm(f, y))[0];
      if (shore) at = shore;
      fame = f.weight * 1.6;
    } else if (f.type === 'beach' || f.type === 'coast') fame = f.weight * 1.1;
    else fame = f.weight * 0.8 + 0.6 * Math.sqrt(sights); // a lone castle, viewpoint, pass, peak, waterfall or abbey
    const family = FEATURE_FAMILY[f.type];
    const spot = around.length ? around : [f];
    ranked.push({
      lat: at.lat, lon: at.lon, weight: fame, count: spot.length, name: f.name, types: [...new Set([f.type, ...spot.map((g) => g.type)])],
      label: f.name, family, fame, loved: prefer.has(family),
    });
  }
  ranked.sort((a, b) => Number(b.loved) - Number(a.loved) || b.fame - a.fame);
  const out: DestinationCandidate[] = [];
  for (const { fame, loved, ...c } of ranked) {
    if (out.some((o) => distKm(o, c) < gapKm || o.label === c.label)) continue;
    out.push(c);
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
    return fastOut.minutes > outMinutes ? null : { c, fastOut };
  })).filter((x): x is NonNullable<typeof x> => !!x).slice(0, 8);
  const routed = await pool(reachable, opts.concurrency ?? 4, async ({ c, fastOut }) => {
    // The drive time is a promise: the fastest way must fit, and the scenic way is shown only when it fits too.
    if (!roundTrip) {
      const s = await scenicOr([req.origin, c], 2, fastOut);
      return { c, fastest: fastOut, scenic: s.minutes <= req.maxMinutes ? s : fastOut };
    }
    // A loop: out by the most scenic road, back by a gentler scenic one (usually different), all within the time.
    const fastBack = await p.router.route([c, req.origin], { ...base, profile: 'fastest' });
    const fastest = join(fastOut, fastBack);
    if (fastest.minutes > req.maxMinutes) return null;
    const out = await scenicOr([req.origin, c], 3, fastOut);
    const back = await scenicOr([c, req.origin], 1, fastBack);
    // Of the loops that fit, the one that shares least road between going and coming back.
    const fits = [join(out, back), join(out, fastBack), join(fastOut, back), fastest].filter((l) => l.minutes <= req.maxMinutes)
      .map((l) => ({ l, same: retraced(l.line, req.origin) }));
    fits.sort((a, b) => a.same - b.same);
    return { c, fastest, scenic: fits[0]?.l ?? fastest };
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
    const matches = prefer.has(r.c.family);
    // A loop that comes back the way it went is half a drive; one that uses little of the time is a short hop.
    const loopFactor = roundTrip ? (1 - 0.6 * retraced(r.scenic.line, req.origin)) * (0.6 + 0.4 * Math.min(1, r.scenic.minutes / (req.maxMinutes * 0.6))) : 1;
    const value = (0.65 * s.score + 35 * Math.sqrt(r.c.weight / maxWeight) + (matches ? 15 : 0)) * loopFactor;
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
