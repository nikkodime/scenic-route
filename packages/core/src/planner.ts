// The planning pipeline: candidates → score → advisories → rank → conditions.
// Providers are injected, so the same code runs on the server, in tests with
// fixtures, and (later) on device.

import { distKm, encodePolyline, paddedBBox, resample, type LatLon } from './geo.ts';
import type { ScenicFeature } from './features.ts';
import { candidateWaypointSets, clusterSpots, corridorBBox, type Spot } from './candidates.ts';
import { bestStretch, describe, reliefStats, scoreRoute, SCORE_MODEL, type RouteGeometry, type ScoredRoute, type SegmentSample } from './score.ts';
import { rankRoutes } from './rank.ts';
import { assessConditions, weatherSamplePoints, type HourlyForecast } from './conditions.ts';
import { isBlocked, routeAdvisories, type Advisory, type Zone } from './advisories.ts';
import { appleMapsUrl, googleMapsUrl, shapingPoints } from './exports.ts';
import type { PlanRequest, PlanResponse, Preferences, RouteOption } from './contracts.ts';

export interface RoutedPath extends RouteGeometry {
  motorwayKmByCountry?: Record<string, number>;
}

export interface RouteOptions {
  profile: 'fastest' | 'scenic';
  /** 1 = gentle preference for small roads, 3 = strong. Scenic profile only. */
  strength?: number;
  avoidZones?: Zone[];
  prefs: Preferences;
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
  advisories: Advisory[];
}

export class PlanError extends Error {
  readonly status: number;
  constructor(message: string, status = 422) {
    super(message);
    this.status = status;
  }
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const out: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try { out[i] = { status: 'fulfilled', value: await fn(items[i]) }; }
      catch (reason) { out[i] = { status: 'rejected', reason }; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function labelFor(r: Evaluated, i: number, best: Evaluated, fastestMinutes: number): string {
  if (r.source === 'fastest') return 'Fastest';
  if (i === 0) return 'Most scenic';
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
  const departure = req.departAt ? new Date(req.departAt) : now;

  const area = corridorBBox(required, req.extraMinutes);
  const zones = p.zones ? await p.zones(area) : [];
  const ztl = zones.filter((z) => z.properties.kind === 'ztl');
  const base = { prefs: req.prefs, avoidZones: ztl };

  // 1. Fastest route: the budget anchor. Without it there is nothing to plan.
  let fastest: RoutedPath;
  try {
    fastest = await p.router.route(required, { ...base, profile: 'fastest' });
  } catch (e) {
    log('fastest route failed', e);
    throw new PlanError('No route found between these places.');
  }

  // 2. Scenic features in the corridor.
  let features: ScenicFeature[] = [];
  try {
    features = await p.features.features(area);
  } catch (e) {
    log('features failed', e);
    warnings.push('Scenic places could not be loaded; scores are based on roads and hills only.');
  }
  const spots = clusterSpots(features);

  // 3. Candidates.
  const jobs: { source: Candidate['source']; points: LatLon[]; stops: Spot[]; opts: RouteOptions; alt?: boolean }[] = [];
  if (p.router.supportsScenic) {
    for (const strength of [1, 2, 3]) jobs.push({ source: 'scenic_model', points: required, stops: [], opts: { ...base, profile: 'scenic', strength } });
  }
  if (p.router.alternatives) jobs.push({ source: 'alternative', points: required, stops: [], opts: { ...base, profile: p.router.supportsScenic ? 'scenic' : 'fastest', strength: 1 }, alt: true });

  // Spot detours per leg, with the time budget shared out by leg length.
  const legSets: Spot[][][] = [];
  const legLen = required.slice(1).map((b, i) => distKm(required[i], b));
  const totalDirect = legLen.reduce((a, b) => a + b, 0) || 1;
  for (let i = 1; i < required.length; i++) {
    const share = req.extraMinutes * (legLen[i - 1] / totalDirect);
    legSets.push(candidateWaypointSets(required[i - 1], required[i], spots, share, 8).slice(1));
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
  const evaluated = (await pool(candidates, opts.concurrency ?? 4, async (c): Promise<Evaluated> => {
    let relief = null;
    if (p.elevation) {
      try {
        const pts = resample(c.path.line, Math.max(0.5, c.path.km / 90)).slice(0, 100);
        relief = reliefStats(await p.elevation.elevations(pts));
      } catch (e) { log('elevation failed', e); }
    }
    let segments: SegmentSample[] | null = null;
    if (p.segments) { try { segments = await p.segments.sample(c.path.line); } catch (e) { log('segments failed', e); } }
    const scored = scoreRoute({ route: c.path, features, relief, segments });
    const advisories = routeAdvisories({
      line: c.path.line, unpavedKm: c.path.unpavedKm, tollKm: c.path.tollKm, ferryKm: c.path.ferryKm,
      motorwayKmByCountry: c.path.motorwayKmByCountry, zones, date: departure, prefs: req.prefs,
    });
    return { ...c, minutes: c.path.minutes, line: c.path.line, scored, advisories };
  })).flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  if (p.elevation && reliefMissing(evaluated)) warnings.push('Elevation was unavailable; hill scores are estimated.');

  // 5. Drop blocked routes (ZTL, gravel with a rental car, closed pass) unless nothing else is left.
  let usable = evaluated.filter((r) => !isBlocked(r.advisories));
  if (!usable.length) {
    usable = evaluated;
    warnings.push('Every route has a restriction; check the advisories before you drive.');
  }

  const fastestMinutes = fastest.minutes;
  const ranked = rankRoutes(usable, fastestMinutes, req.extraMinutes, req.maxRoutes);

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
    const handoffPts = shapingPoints(r.line, [...req.stops, ...r.stops]);
    return {
      id: `${planId}-${i + 1}`,
      rank: i + 1,
      label: labelFor(r, i, ranked[0], fastestMinutes),
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
      scenicStops: r.stops.map((s) => ({ lat: s.lat, lon: s.lon, name: s.name, types: s.types })),
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
    fastest: { km: Math.round(fastest.km * 10) / 10, minutes: Math.round(fastestMinutes) },
    routes,
    warnings,
    attribution,
  };
}

function reliefMissing(rs: Evaluated[]): boolean {
  return rs.length > 0 && rs.every((r) => r.scored.parts.relief == null);
}
