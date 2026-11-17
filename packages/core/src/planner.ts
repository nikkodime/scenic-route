// The planning pipeline: candidates → score → advisories → rank → conditions.
// Providers are injected, so the same code runs on the server, in tests with
// fixtures, and (later) on device.

import { distKm, encodePolyline, paddedBBox, pointInGeometry, resample, type LatLon } from './geo.ts';
import { FEATURE_FAMILY, type ScenicFeature } from './features.ts';
import { candidateWaypointSets, clusterSpots, corridorBBox, detourProbes, type Spot } from './candidates.ts';
import { bestStretch, describe, reliefStats, scoreRoute, SCORE_MODEL, type RouteGeometry, type ScoredRoute, type SegmentSample } from './score.ts';
import { rankRoutes } from './rank.ts';
import { assessConditions, weatherSamplePoints, type HourlyForecast } from './conditions.ts';
import { isBlocked, routeAdvisories, type Advisory, type Zone } from './advisories.ts';
import { appleMapsUrl, googleMapsUrl, shapingPoints } from './exports.ts';
import type { Interest, PlanRequest, PlanResponse, Preferences, RouteOption, RouteStyle, Vehicle } from './contracts.ts';

/** What each route style means: time budget as a share of the fastest drive, and what a minute costs in ranking. */
/** Longer than this as the crow flies is not one day's scenic drive (and usually a wrong start point). */
export const MAX_DIRECT_KM = 900;

export const STYLES: Record<RouteStyle, { share: number; min: number; max: number; pointsPerMinute: number; strengths: number[] }> = {
  relaxed: { share: 0.15, min: 10, max: 30, pointsPerMinute: 0.6, strengths: [1] },
  scenic: { share: 0.4, min: 20, max: 90, pointsPerMinute: 0.15, strengths: [1, 2, 3] },
  most_beautiful: { share: 0.8, min: 40, max: 180, pointsPerMinute: 0.03, strengths: [2, 3] },
};

/** Extra-time budget for a style, optionally capped by the driver. */
export function budgetMinutes(style: RouteStyle, fastestMinutes: number, cap?: number): number {
  const s = STYLES[style];
  const b = Math.round(Math.min(s.max, Math.max(s.min, fastestMinutes * s.share)));
  return cap == null ? b : Math.min(b, cap);
}

/**
 * Interests boost the places the driver loves. Used to choose detours and to rank routes; the score shown
 * stays the plain one, so picking "Lakes & coast" never makes every route look worse.
 */
export function applyInterests(features: ScenicFeature[], interests: Interest[], boost = 2): ScenicFeature[] {
  const fams = new Set<string>(interests.filter((i) => i !== 'quiet'));
  if (!fams.size) return features;
  return features.map((f) => (fams.has(FEATURE_FAMILY[f.type] === 'roads' ? 'views' : FEATURE_FAMILY[f.type]) ? { ...f, weight: f.weight * boost } : f));
}

/** Towing and big vehicles: never gravel, and only the gentler scenic strengths. */
function vehicleRules(vehicle: Vehicle, prefs: Preferences, strengths: number[]): { prefs: Preferences; strengths: number[] } {
  if (vehicle === 'car') return { prefs, strengths };
  const maxStrength = vehicle === 'caravan' ? 1 : 2;
  const s = [...new Set(strengths.map((x) => Math.min(x, maxStrength)))];
  return { prefs: { ...prefs, avoidUnpaved: true }, strengths: s.length ? s : [1] };
}

export interface RoutedPath extends RouteGeometry {
  motorwayKmByCountry?: Record<string, number>;
}

export interface RouteOptions {
  profile: 'fastest' | 'scenic';
  /** 1 = gentle preference for small roads, 3 = strong. Scenic profile only. */
  strength?: number;
  avoidZones?: Zone[];
  prefs: Preferences;
  /** Caravans and campervans keep off narrow lanes. */
  vehicle?: Vehicle;
}

export interface Router {
  readonly name: string;
  readonly supportsScenic: boolean;
  readonly attribution?: string;
  route(points: LatLon[], opts: RouteOptions): Promise<RoutedPath>;
  alternatives?(points: LatLon[], opts: RouteOptions): Promise<RoutedPath[]>;
}

export interface FeatureSource {
  readonly attribution?: string;
  features(bbox: [number, number, number, number]): Promise<ScenicFeature[]>;
}

export interface ElevationSource {
  readonly attribution?: string;
  /** Metres for each point (null where unknown). */
  elevations(points: LatLon[]): Promise<(number | null)[]>;
}

export interface WeatherSource {
  readonly attribution?: string;
  /** Hourly forecast for each point. */
  hourly(points: LatLon[]): Promise<HourlyForecast[][]>;
}

export interface SegmentSource {
  readonly attribution?: string;
  sample(line: LatLon[]): Promise<SegmentSample[] | null>;
}

export interface Providers {
  router: Router;
  features: FeatureSource;
  elevation?: ElevationSource;
  weather?: WeatherSource;
  segments?: SegmentSource;
  zones?: (bbox: [number, number, number, number]) => Zone[] | Promise<Zone[]>;
}

export interface PlanOptions {
  now?: Date;
  id?: () => string;
  concurrency?: number;
  timeZone?: string;
  log?: (msg: string, extra?: unknown) => void;
}

interface Candidate {
  source: RouteOption['source'];
  path: RoutedPath;
  stops: Spot[];
}

interface Evaluated extends Candidate {
  minutes: number;
  line: LatLon[];
  scored: ScoredRoute;
  /** Score with the driver's interests boosted; used to choose, not shown. */
  fit: number;
  advisories: Advisory[];
}

export class PlanError extends Error {
  readonly status: number;
  constructor(message: string, status = 422) {
    super(message);
    this.status = status;
  }
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const out: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try { out[i] = { status: 'fulfilled', value: await fn(items[i], i) }; }
      catch (reason) { out[i] = { status: 'rejected', reason }; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function labelFor(r: Evaluated, best: Evaluated, fastestMinutes: number): string {
  if (r === best) return 'Most scenic';
  if (r.source === 'fastest') return 'Fastest';
  if (r.minutes - fastestMinutes < 10) return 'Scenic and quick';
  if (r.scored.score >= best.scored.score - 5) return 'Also beautiful';
  return 'Balanced';
}

export async function planRoutes(req: PlanRequest, p: Providers, opts: PlanOptions = {}): Promise<PlanResponse> {
  const now = opts.now ?? new Date();
  const log = opts.log ?? (() => {});
  const planId = opts.id?.() ?? Math.random().toString(36).slice(2, 10);
  const warnings: string[] = [];
  const required: LatLon[] = [req.origin, ...req.stops, req.destination];
  // Under 200 m end to end there is no drive to plan; say so instead of returning a 0 km "route".
  if (required.slice(1).every((pt, i) => distKm(required[i], pt) < 0.2)) throw new PlanError('Start and destination are the same place.');
  const departure = req.departAt ? new Date(req.departAt) : now;

  const style = STYLES[req.style];
  const rules = vehicleRules(req.vehicle, req.prefs, style.strengths);
  // Before the fastest route is known, estimate it from the straight line (about 1.1 min per km).
  const directKm = required.slice(1).reduce((s, b, i) => s + distKm(required[i], b), 0);
  if (directKm > MAX_DIRECT_KM) throw new PlanError("That's more than a day's drive. Plan it as a journey with several days.");
  const area = corridorBBox(required, budgetMinutes(req.style, directKm * 1.1, req.extraMinutes));
  const allZones = p.zones ? await p.zones(area) : [];
  // A ZTL around the start or destination can't be avoided: say so once, and don't flag every route.
  const endpoints = [req.origin, req.destination];
  const zones = allZones.filter((z) => !(z.properties.kind === 'ztl' && endpoints.some((e) => pointInGeometry(e, z.geometry))));
  for (const z of allZones) {
    if (zones.includes(z)) continue;
    const where = pointInGeometry(req.origin, z.geometry) ? 'You start' : 'Your destination is';
    warnings.push(`${where} inside the ${z.properties.name} ZTL (limited traffic zone): drive in only with a permit or a hotel registration, otherwise park outside.`);
  }
  const ztl = zones.filter((z) => z.properties.kind === 'ztl');
  const base = { prefs: rules.prefs, avoidZones: ztl, vehicle: req.vehicle };

  // 1. Fastest route: the budget anchor. Without it there is nothing to plan.
  let fastest: RoutedPath;
  try {
    fastest = await p.router.route(required, { ...base, profile: 'fastest' });
  } catch (e) {
    log('fastest route failed', e);
    // A self-hosted map covers only the regions imported so far; say so rather than "no route".
    if (/outside|out of bounds|cannot find point|point_not_found|not found within/i.test(String((e as Error)?.message ?? e)))
      throw new PlanError("One of these places is outside the area Panoramica covers so far. Try a trip within central Italy.");
    throw new PlanError('No route found between these places.');
  }

  const budget = budgetMinutes(req.style, fastest.minutes, req.extraMinutes);

  // 2. Scenic features in the corridor.
  let features: ScenicFeature[] = [];
  try {
    features = await p.features.features(area);
  } catch (e) {
    log('features failed', e);
    warnings.push('Scenic places could not be loaded; scores are based on roads and hills only.');
  }
  const loved = applyInterests(features, req.interests);
  const spots = clusterSpots(loved);

  // 3. Candidates.
  const jobs: { source: Candidate['source']; points: LatLon[]; stops: Spot[]; opts: RouteOptions; alt?: boolean }[] = [];
  if (p.router.supportsScenic) {
    for (const strength of rules.strengths) jobs.push({ source: 'scenic_model', points: required, stops: [], opts: { ...base, profile: 'scenic', strength } });
  }
  if (p.router.alternatives) jobs.push({ source: 'alternative', points: required, stops: [], opts: { ...base, profile: p.router.supportsScenic ? 'scenic' : 'fastest', strength: 1 }, alt: true });

  // Spot detours per leg, with the time budget shared out by leg length.
  const legSets: Spot[][][] = [];
  const legLen = required.slice(1).map((b, i) => distKm(required[i], b));
  const totalDirect = legLen.reduce((a, b) => a + b, 0) || 1;
  for (let i = 1; i < required.length; i++) {
    const share = budget * (legLen[i - 1] / totalDirect);
    const sets = candidateWaypointSets(required[i - 1], required[i], spots, share, 8).slice(1);
    // No scenic places known for this leg: still explore side roads so hills and bends can win.
    legSets.push(sets.length ? sets : detourProbes(required[i - 1], required[i], share));
  }
  const maxVia = Math.max(0, ...legSets.map((s) => s.length));
  for (let k = 0; k < Math.min(maxVia, 7); k++) {
    const points: LatLon[] = [required[0]];
    const stops: Spot[] = [];
    legSets.forEach((sets, i) => {
      const set = sets.length ? sets[Math.min(k, sets.length - 1)] : [];
      points.push(...set, required[i + 1]);
      stops.push(...set);
    });
    if (stops.length) jobs.push({ source: 'via_spots', points, stops, opts: { ...base, profile: p.router.supportsScenic ? 'scenic' : 'fastest', strength: 1 } });
  }

  const results = await pool(jobs, opts.concurrency ?? 4, async (j): Promise<Candidate[]> => {
    if (j.alt) return (await p.router.alternatives!(j.points, j.opts)).map((path) => ({ source: j.source, path, stops: [] }));
    return [{ source: j.source, path: await p.router.route(j.points, j.opts), stops: j.stops }];
  });
  const candidates: Candidate[] = [{ source: 'fastest', path: fastest, stops: [] }];
  for (const r of results) if (r.status === 'fulfilled') candidates.push(...r.value); else log('candidate failed', r.reason);

  // 4. Score every candidate (elevation + segment samples fetched per route, in parallel).
  // Elevation for every candidate in one batched request (the free service is rate-limited per call).
  const elevPts = candidates.map((c) => resample(c.path.line, Math.max(0.5, c.path.km / 90)).slice(0, 100));
  let elevs: (number | null)[][] | null = null;
  if (p.elevation) {
    try {
      const flat = await p.elevation.elevations(elevPts.flat());
      let k = 0;
      elevs = elevPts.map((pts) => { const out = flat.slice(k, k + pts.length); k += pts.length; return out; });
    } catch (e) { log('elevation failed', e); }
  }
  const evaluated = (await pool(candidates, opts.concurrency ?? 4, async (c, ci): Promise<Evaluated> => {
    const relief = elevs ? reliefStats(elevs[ci]) : null;
    let segments: SegmentSample[] | null = null;
    if (p.segments) { try { segments = await p.segments.sample(c.path.line); } catch (e) { log('segments failed', e); } }
    const quiet = req.interests.includes('quiet');
    const scored = scoreRoute({ route: c.path, features, relief, segments, quiet });
    // What this driver would think of it: the same score with their loved places counted double.
    const fit = loved === features ? scored.score : scoreRoute({ route: c.path, features: loved, relief, segments, quiet }).score;
    const advisories = routeAdvisories({
      line: c.path.line, unpavedKm: c.path.unpavedKm, tollKm: c.path.tollKm, ferryKm: c.path.ferryKm,
      motorwayKmByCountry: c.path.motorwayKmByCountry, zones, date: departure, prefs: rules.prefs,
    });
    return { ...c, minutes: c.path.minutes, line: c.path.line, scored, fit, advisories };
  })).flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  if (p.elevation && reliefMissing(evaluated)) warnings.push('Elevation was unavailable; hill scores are estimated.');

  // 5. Drop blocked routes (ZTL, gravel with a rental car, closed pass) unless nothing else is left.
  let usable = evaluated.filter((r) => !isBlocked(r.advisories));
  if (!usable.length) {
    usable = evaluated;
    warnings.push('Every route has a restriction; check the advisories before you drive.');
  }

  const fastestMinutes = fastest.minutes;
  // An explicit time limit is a promise: no slack over it. The style budget may stretch by 10%.
  const chosen = rankRoutes(usable.map((r) => ({ r, minutes: r.minutes, line: r.line, scored: { score: r.fit } })), fastestMinutes, budget, req.maxRoutes, style.pointsPerMinute, req.extraMinutes != null ? 0 : 0.1).map((x) => x.r);
  // Show them most scenic first (ties: quicker first); the ranking above only decided which to keep.
  const ranked = [...chosen].sort((a, b) => b.scored.score - a.scored.score || a.minutes - b.minutes);
  const best = ranked.reduce<Evaluated | null>((b, r) => (!b || r.scored.score > b.scored.score ? r : b), null);

  // 6. Weather and light for the chosen routes: one batched forecast call.
  const samplesPer = ranked.map((r) => weatherSamplePoints(r.line, r.path.km, r.minutes, departure, 4));
  let forecasts: HourlyForecast[][][] = ranked.map(() => []);
  if (p.weather && ranked.length) {
    try {
      const flat = await p.weather.hourly(samplesPer.flat().map((s) => s.point));
      forecasts = samplesPer.map((s, i) => flat.slice(i * 4, i * 4 + s.length));
    } catch (e) {
      log('weather failed', e);
      warnings.push('Weather is unavailable right now; light and sunset are still shown.');
    }
  }

  const routes: RouteOption[] = ranked.map((r, i) => {
    const stretch = bestStretch(r.scored.near, r.path.km);
    const conditions = assessConditions({ line: r.line, km: r.path.km, minutes: r.minutes, departure, forecasts: forecasts[i], bestStretch: stretch, timeZone: opts.timeZone });
    const handoffPts = shapingPoints(r.line, [...req.stops, ...r.stops.filter((s) => s.count > 0)]);
    return {
      id: `${planId}-${i + 1}`,
      rank: i + 1,
      label: labelFor(r, best!, fastestMinutes),
      source: r.source,
      score: r.scored.score,
      parts: r.scored.parts,
      summary: describe(r.scored),
      km: Math.round(r.path.km * 10) / 10,
      minutes: Math.round(r.minutes),
      extraMinutes: Math.max(0, Math.round(r.minutes - fastestMinutes)),
      polyline: encodePolyline(r.line, 5),
      bbox: paddedBBox(r.line, 0),
      highlights: r.scored.highlights,
      scenicStops: r.stops.filter((s) => s.count > 0).map((s) => ({ lat: s.lat, lon: s.lon, name: s.name, types: s.types })),
      bestStretch: stretch,
      conditions,
      advisories: r.advisories,
      handoff: {
        googleMaps: googleMapsUrl(req.origin, req.destination, handoffPts),
        appleMaps: appleMapsUrl(req.origin, req.destination, r.stops[0]),
      },
    };
  });

  const attribution = [...new Set([p.router.attribution, p.features.attribution, p.elevation?.attribution, p.weather?.attribution, p.segments?.attribution, '© OpenStreetMap contributors'].filter((x): x is string => !!x))];
  return {
    planId,
    modelVersion: SCORE_MODEL.version,
    budgetMinutes: budget,
    fastest: { km: Math.round(fastest.km * 10) / 10, minutes: Math.round(fastestMinutes) },
    routes,
    warnings,
    attribution,
  };
}

function reliefMissing(rs: Evaluated[]): boolean {
  return rs.length > 0 && rs.every((r) => r.scored.parts.relief == null);
}
