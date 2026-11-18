// Self-hosted GraphHopper (ADR 0002). Scenic routing through per-request custom models.

import type { LatLon, RoutedPath, Router, RouteOptions, Zone } from '@scenic/core';
import type { Http } from '../http.ts';
import { distKm } from '@scenic/core';

/** A posted limit of 100–130 km/h means a dual carriageway or motorway (missing limits come back as null or Infinity). */
export const isFastLimit = (v: unknown) => typeof v === 'number' && v >= 100 && v <= 140;

const UNPAVED = ['UNPAVED', 'COMPACTED', 'FINE_GRAVEL', 'GRAVEL', 'GROUND', 'DIRT', 'GRASS', 'SAND'];

/** Priority multipliers per scenic strength (custom models with LM can only lower priority, so we push big roads down). */
const STRENGTH: Record<number, Record<string, number>> = {
  1: { MOTORWAY: 0.4, TRUNK: 0.6, PRIMARY: 0.9 },
  2: { MOTORWAY: 0.15, TRUNK: 0.3, PRIMARY: 0.6, RESIDENTIAL: 0.7 },
  3: { MOTORWAY: 0.05, TRUNK: 0.12, PRIMARY: 0.4, SECONDARY: 0.85, RESIDENTIAL: 0.5 },
};

export interface CustomModel {
  priority: { if?: string; else_if?: string; else?: null; multiply_by: string }[];
  distance_influence?: number;
  areas?: { type: 'FeatureCollection'; features: unknown[] };
}

export const FASTEST_DISTANCE_INFLUENCE = 70;

export function customModel(opts: RouteOptions): CustomModel {
  const priority: CustomModel['priority'] = [];
  const areas: unknown[] = [];
  const zones: Zone[] = opts.avoidZones ?? [];
  zones.forEach((z, i) => {
    const id = `ztl${i}`;
    areas.push({ type: 'Feature', id, properties: {}, geometry: z.geometry });
    priority.push({ if: `in_${id}`, multiply_by: '0' });
  });
  if (opts.prefs.avoidUnpaved || opts.prefs.rentalCar) {
    priority.push({ if: `road_class == TRACK || ${UNPAVED.map((s) => `surface == ${s}`).join(' || ')}`, multiply_by: '0' });
  }
  // Narrow lanes: in Italy these are mostly unclassified, residential and service roads.
  if (opts.vehicle === 'caravan') priority.push(
    { if: 'road_class == SERVICE || road_class == TRACK', multiply_by: '0' },
    { if: 'road_class == UNCLASSIFIED', multiply_by: '0.2' },
    { if: 'road_class == RESIDENTIAL', multiply_by: '0.4' },
  );
  if (opts.vehicle === 'campervan') priority.push(
    { if: 'road_class == SERVICE', multiply_by: '0.2' },
    { if: 'road_class == UNCLASSIFIED', multiply_by: '0.5' },
  );
  if (opts.prefs.avoidTolls) priority.push({ if: 'toll == ALL', multiply_by: '0.2' });
  // The server profile has distance_influence 0 (infra/graphhopper/custom_models/scenic_base.json);
  // with LM a request may only raise it, so every request sets its own.
  let distance_influence = FASTEST_DISTANCE_INFLUENCE;
  if (opts.profile === 'scenic') {
    const strength = Math.max(1, Math.min(3, opts.strength ?? 1));
    for (const [cls, m] of Object.entries(STRENGTH[strength])) priority.push({ if: `road_class == ${cls}`, multiply_by: String(m) });
    // Superstrade tagged as primary: as unwelcome as a trunk road at this strength.
    priority.push({ if: 'max_speed >= 100 && max_speed <= 140 && road_class != MOTORWAY && road_class != TRUNK', multiply_by: String(STRENGTH[strength].TRUNK) });
    distance_influence = [0, 40, 20, 10][strength];
  }
  return { priority, distance_influence, ...(areas.length ? { areas: { type: 'FeatureCollection', features: areas } } : {}) };
}

const ALPHA3: Record<string, string> = { AUT: 'AT', CHE: 'CH', CZE: 'CZ', SVK: 'SK', SVN: 'SI', HUN: 'HU', ROU: 'RO', BGR: 'BG', ITA: 'IT', FRA: 'FR', DEU: 'DE', HRV: 'HR', SMR: 'SM', VAT: 'VA', ESP: 'ES', PRT: 'PT', GRC: 'GR', GBR: 'GB' };

type Interval = [number, number, string | boolean | number];

interface GhPath {
  distance: number;
  time: number;
  points: { coordinates: [number, number, number?][] };
  details?: Record<string, Interval[]>;
  instructions?: { text: string; distance: number; sign: number; interval: [number, number]; street_name?: string }[];
}

/** Turn a GraphHopper path into our route shape, summing km per detail value. */
export function parseGhPath(path: GhPath): RoutedPath {
  const line: LatLon[] = path.points.coordinates.map(([lon, lat]) => ({ lat, lon }));
  const segKm = (from: number, to: number) => {
    let s = 0;
    for (let i = from + 1; i <= to && i < line.length; i++) s += distKm(line[i - 1], line[i]);
    return s;
  };
  // GraphHopper returns enum values in lower case (e.g. "motorway"); compare in upper case.
  const up = (v: unknown) => String(v).toUpperCase();
  const sumWhere = (key: string, pred: (v: string) => boolean) =>
    (path.details?.[key] ?? []).reduce((s, [a, b, v]) => (pred(up(v)) ? s + segKm(a, b) : s), 0);

  // Fast roads: motorways and trunks, plus Italian superstrade and other dual carriageways that OSM often tags
  // as primary with a 100–130 km/h limit (Firenze–Siena, FI-PI-LI, E45). They are never the scenic road.
  const fastKm = (from: number, to: number) => {
    // Union of the two interval sets, so a trunk with a 110 limit isn't counted twice.
    const marks = new Uint8Array(Math.max(0, to - from));
    for (const [a, b, v] of path.details?.road_class ?? []) if (up(v) === 'MOTORWAY' || up(v) === 'TRUNK') for (let i = Math.max(a, from); i < Math.min(b, to); i++) marks[i - from] = 1;
    for (const [a, b, v] of path.details?.max_speed ?? []) if (isFastLimit(v)) for (let i = Math.max(a, from); i < Math.min(b, to); i++) marks[i - from] = 1;
    let s = 0;
    for (let i = 0; i < marks.length; i++) if (marks[i]) s += distKm(line[from + i], line[from + i + 1]);
    return s;
  };
  const motorwayKm = fastKm(0, line.length - 1);
  const unpavedKm = sumWhere('surface', (v) => UNPAVED.includes(v)) + sumWhere('road_class', (v) => v === 'TRACK');
  const tollKm = sumWhere('toll', (v) => v === 'ALL');
  const ferryKm = sumWhere('road_environment', (v) => v === 'FERRY');
  const urbanKm = sumWhere('urban_density', (v) => v === 'CITY');

  // Motorway km per country: intersect road_class and country intervals.
  const motorwayKmByCountry: Record<string, number> = {};
  const countries = path.details?.country ?? [];
  for (const [a, b, cls] of path.details?.road_class ?? []) {
    if (up(cls) !== 'MOTORWAY') continue;
    for (const [ca, cb, cc] of countries) {
      const lo = Math.max(a, ca), hi = Math.min(b, cb);
      if (hi <= lo) continue;
      const code = ALPHA3[up(cc)] ?? up(cc).slice(0, 2);
      motorwayKmByCountry[code] = (motorwayKmByCountry[code] ?? 0) + segKm(lo, hi);
    }
  }

  // Turn-by-turn: where each manoeuvre happens, in km from the start (GraphHopper sign codes kept as-is).
  let at = 0;
  const steps = (path.instructions ?? []).map((ins) => {
    const step = { atKm: Math.round(at * 100) / 100, text: ins.text, sign: ins.sign, street: ins.street_name ?? '', lat: line[ins.interval[0]]?.lat ?? 0, lon: line[ins.interval[0]]?.lon ?? 0 };
    at += ins.distance / 1000;
    return step;
  });

  return { line, km: path.distance / 1000, minutes: path.time / 60000, motorwayKm, unpavedKm, tollKm, ferryKm, urbanKm, motorwayKmByCountry, ...(steps.length ? { steps } : {}) };
}

export class GraphHopperRouter implements Router {
  readonly name = 'graphhopper';
  readonly supportsScenic = true;
  readonly attribution = 'Routing: GraphHopper';
  private http: Http;
  private base: string;
  private profile: string;
  constructor(http: Http, base: string, profile = 'car') {
    this.http = http;
    this.base = base.replace(/\/$/, '');
    this.profile = profile;
  }

  body(points: LatLon[], opts: RouteOptions, alternatives = false) {
    const cm = customModel(opts);
    return {
      points: points.map((p) => [p.lon, p.lat]),
      profile: this.profile,
      points_encoded: false,
      instructions: true,
      locale: 'en',
      calc_points: true,
      details: ['road_class', 'surface', 'toll', 'country', 'road_environment', 'urban_density', 'max_speed'],
      custom_model: cm,
      'ch.disable': true,
      ...(alternatives ? { algorithm: 'alternative_route', 'alternative_route.max_paths': 3, 'alternative_route.max_weight_factor': 1.6, 'alternative_route.max_share_factor': 0.7, 'ch.disable': true } : {}),
    };
  }

  private async post(body: unknown): Promise<GhPath[]> {
    const json = await this.http.json<{ paths?: GhPath[]; message?: string }>(`${this.base}/route`, {
      method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, timeoutMs: 15000, retries: 0,
    });
    if (!json.paths?.length) throw new Error(json.message || 'No route found');
    return json.paths;
  }

  async route(points: LatLon[], opts: RouteOptions): Promise<RoutedPath> {
    return parseGhPath((await this.post(this.body(points, opts)))[0]);
  }

  async alternatives(points: LatLon[], opts: RouteOptions): Promise<RoutedPath[]> {
    if (points.length !== 2) return []; // GraphHopper alternatives need exactly two points
    return (await this.post(this.body(points, opts, true))).map(parseGhPath);
  }
}
