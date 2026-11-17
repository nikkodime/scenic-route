// Where to detour: group scenic features into spots, then pick sets of spots to route through.

import { distKm, detourKm, projectT, paddedBBox, type LatLon, type BBox } from './geo.ts';
import type { FeatureType, ScenicFeature } from './features.ts';

export interface Spot extends LatLon {
  weight: number;
  count: number;
  name: string;
  types: FeatureType[];
}

/** Greedy clustering: the strongest feature anchors a spot, weaker ones within radius join it. */
export function clusterSpots(features: ScenicFeature[], radiusKm = 2): Spot[] {
  const sorted = [...features].sort((a, b) => b.weight - a.weight);
  const spots: Spot[] = [];
  for (const f of sorted) {
    const home = spots.find((s) => distKm(s, f) <= radiusKm);
    if (home) {
      home.weight += f.weight;
      home.count += 1;
      if (!home.name && f.name && f.weight >= 1) home.name = f.name;
      if (!home.types.includes(f.type)) home.types.push(f.type);
    } else {
      spots.push({ lat: f.lat, lon: f.lon, weight: f.weight, count: 1, name: f.name || '', types: [f.type] });
    }
  }
  return spots.sort((a, b) => b.weight - a.weight);
}

/** Rough extra km affordable for an extra-time budget on country roads (~45 km/h). */
export function budgetKm(extraMin: number): number {
  return (extraMin / 60) * 45;
}

export function corridorPadKm(directKm: number, extraMin: number): number {
  return Math.min(25, Math.max(4, budgetKm(extraMin) / 2.2 + directKm * 0.05));
}

export function corridorBBox(points: LatLon[], extraMin: number): BBox {
  let direct = 0;
  for (let i = 1; i < points.length; i++) direct += distKm(points[i - 1], points[i]);
  return paddedBBox(points, corridorPadKm(direct, extraMin));
}

interface ScoredSpot extends Spot {
  t: number;
  detour: number;
  value: number;
}

/**
 * Sets of 0–3 spots to route through between start and end, ordered along the
 * axis so the route never doubles back. The empty set (plain route) is always first.
 */
export function candidateWaypointSets(start: LatLon, end: LatLon, spots: Spot[], extraMin: number, maxSets = 8): Spot[][] {
  const budget = budgetKm(extraMin);
  const usable: ScoredSpot[] = spots
    .map((s) => ({ ...s, t: projectT(start, end, s), detour: detourKm(start, end, s), value: 0 }))
    .filter((s) => s.t > 0.05 && s.t < 0.95 && s.detour < budget * 0.75 && distKm(s, start) > 2 && distKm(s, end) > 2)
    .map((s) => ({ ...s, value: s.weight / (1 + s.detour / 3) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const sets: ScoredSpot[][] = [[]];
  const seen = new Set(['']);
  const key = (set: ScoredSpot[]) => set.map((s) => `${s.lat.toFixed(4)},${s.lon.toFixed(4)}`).join('|');
  const add = (set: ScoredSpot[]) => {
    const ordered = [...set].sort((a, b) => a.t - b.t);
    const chain: LatLon[] = [start, ...ordered, end];
    let len = 0;
    for (let i = 1; i < chain.length; i++) len += distKm(chain[i - 1], chain[i]);
    if (len - distKm(start, end) > budget) return;
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
  return sets.slice(0, maxSets).map((set) => set.map(({ t, detour, value, ...s }) => s));
}
