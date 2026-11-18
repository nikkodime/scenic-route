// Stops worth making along a route: a viewpoint with somewhere to pull over, a coffee halfway,
// an agriturismo for lunch or a winery. Chosen per route from places near the line, so every
// suggestion is a short step off the road you are already driving.

import { cumulativeKm, distKm, paddedBBox, resample, type BBox, type LatLon } from './geo.ts';

export const STOP_KINDS = ['viewpoint', 'cafe', 'agriturismo', 'winery'] as const;
export type StopKind = (typeof STOP_KINDS)[number];

export interface StopPlace {
  id: string;
  lat: number;
  lon: number;
  kind: StopKind;
  name: string;
  /** OSM opening_hours, as written. */
  hours?: string;
  website?: string;
  /** Agriturismo or winery that serves meals. */
  food?: boolean;
}

export interface StopSource {
  readonly attribution?: string;
  stops(bbox: BBox): Promise<StopPlace[]>;
}

export interface SuggestedStop extends StopPlace {
  /** Km from the start where you leave the route for it. */
  atKm: number;
  /** When you get there, at the planned departure. */
  eta: string;
  /** Straight-line distance off the route, km. */
  offKm: number;
  /** Why it is suggested: the moment it fits. */
  reason: 'view' | 'coffee' | 'lunch' | 'wine';
}

/** How far off the route each kind is still worth it (km, straight line). */
export const STOP_REACH_KM: Record<StopKind, number> = { viewpoint: 0.25, cafe: 0.4, agriturismo: 1.5, winery: 1.5 };

export interface SuggestStopsInput {
  line: LatLon[];
  km: number;
  minutes: number;
  departure: Date;
  places: StopPlace[];
  bestStretch?: { fromKm: number; toKm: number } | null;
  /** Wine counts for more when the driver loves vineyards. */
  loveWine?: boolean;
  timeZone?: string;
  max?: number;
}

interface Near extends StopPlace { atKm: number; offKm: number }

/** Every stop place close enough to the line, with where along it you'd turn off. */
export function placesAlong(line: LatLon[], places: StopPlace[]): Near[] {
  if (line.length < 2 || !places.length) return [];
  const pts = resample(line, 0.2);
  const cum = cumulativeKm(pts);
  const box = paddedBBox(pts, 1.6);
  const out: Near[] = [];
  for (const p of places) {
    if (p.lat < box[0] || p.lat > box[2] || p.lon < box[1] || p.lon > box[3]) continue;
    const reach = STOP_REACH_KM[p.kind];
    let best = Infinity, at = 0;
    for (let i = 0; i < pts.length; i++) {
      // Cheap reject before the haversine: 0.01° lat ≈ 1.1 km.
      if (Math.abs(pts[i].lat - p.lat) > 0.02) continue;
      const d = distKm(pts[i], p);
      if (d < best) { best = d; at = cum[i]; }
    }
    if (best <= reach) out.push({ ...p, atKm: at, offKm: best });
  }
  return out;
}

const hourIn = (d: Date, tz: string) => Number(d.toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: tz }).slice(0, 2));

export function suggestStops({ line, km, minutes, departure, places, bestStretch = null, loveWine = false, timeZone = 'Europe/Rome', max = 5 }: SuggestStopsInput): SuggestedStop[] {
  const near = placesAlong(line, places);
  if (!near.length) return [];
  const total = cumulativeKm(line).at(-1) || km || 1;
  const etaAt = (k: number) => new Date(departure.getTime() + (k / total) * minutes * 60000);
  const named = (p: Near) => (p.name ? 1 : 0);
  // Nothing in the first or last few minutes: you've just set off, or you're nearly there.
  const inMiddle = (p: Near, edge: number) => p.atKm >= Math.max(3, total * edge) && p.atKm <= total - Math.max(2, total * 0.05);
  const picked: SuggestedStop[] = [];
  const take = (p: Near, reason: SuggestedStop['reason']) => {
    if (picked.some((x) => x.id === p.id)) return;
    picked.push({ ...p, atKm: Math.round(p.atKm * 10) / 10, offKm: Math.round(p.offKm * 100) / 100, eta: etaAt(p.atKm).toISOString(), reason });
  };
  const spaced = (p: Near, gapKm: number) => picked.every((x) => Math.abs(x.atKm - p.atKm) >= gapKm);

  // 1. Viewpoints with a place to pull over: on the best stretch first, then anywhere, spread out.
  const inBest = (p: Near) => (bestStretch && p.atKm >= bestStretch.fromKm - 2 && p.atKm <= bestStretch.toKm + 2 ? 1 : 0);
  const views = near.filter((p) => p.kind === 'viewpoint' && inMiddle(p, 0))
    .sort((a, b) => inBest(b) - inBest(a) || named(b) - named(a) || a.offKm - b.offKm);
  for (const v of views) {
    if (picked.length >= 2) break;
    if (spaced(v, Math.max(8, total * 0.15))) take(v, 'view');
  }

  // 2. Lunch: an agriturismo that serves food, if you pass around midday (11:30–14:30) on a drive of an hour or more.
  if (minutes >= 60) {
    const lunch = near.filter((p) => p.kind === 'agriturismo' && p.food !== false && inMiddle(p, 0.2))
      .filter((p) => { const t = etaAt(p.atKm); const h = hourIn(t, timeZone) + t.getUTCMinutes() / 60; return h >= 11.5 && h <= 14.5; })
      .sort((a, b) => named(b) - named(a) || a.offKm - b.offKm);
    if (lunch[0]) take(lunch[0], 'lunch');
  }

  // 3. A winery, on drives through wine country (always offered when the driver loves vineyards).
  const wineries = near.filter((p) => p.kind === 'winery' && p.name && inMiddle(p, 0.15) && spaced(p, 2))
    .sort((a, b) => a.offKm - b.offKm);
  if (wineries[0] && (loveWine || minutes >= 45)) take(wineries[0], 'wine');

  // 4. Coffee about halfway on drives of 50 minutes or more (lunch already is the break).
  if (minutes >= 50 && !picked.some((x) => x.reason === 'lunch')) {
    const mid = total * 0.5;
    const coffee = near.filter((p) => p.kind === 'cafe' && p.name && inMiddle(p, 0.25) && spaced(p, 3))
      .sort((a, b) => Math.abs(a.atKm - mid) - Math.abs(b.atKm - mid) || a.offKm - b.offKm);
    if (coffee[0]) take(coffee[0], 'coffee');
  }

  return picked.sort((a, b) => a.atKm - b.atKm).slice(0, max);
}
