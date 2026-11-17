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
  // A bigger time budget means a detour costs less: "Most beautiful" reaches for the richest places
  // further off the line instead of the nearest pretty village.
  const reach = Math.max(3, budget * 0.3);
  const usable: ScoredSpot[] = spots
    .map((s) => ({ ...s, t: projectT(start, end, s), detour: detourKm(start, end, s), value: 0 }))
    .filter((s) => s.t > 0.05 && s.t < 0.95 && s.detour < budget * 0.75 && distKm(s, start) > 2 && distKm(s, end) > 2)
    .map((s) => ({ ...s, value: s.weight / (1 + s.detour / reach) }))
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
  // The richest places within budget, however far: what a long, beautiful day would go through.
  const richest = [...usable].sort((a, b) => b.weight - a.weight);
  if (richest.length >= 2) add(richest.slice(0, 2));
  if (richest.length >= 3) add(richest.slice(0, 3));
  for (let i = 0; i < Math.min(6, usable.length); i++)
    for (let j = i + 1; j < Math.min(6, usable.length); j++) add([usable[i], usable[j]]);
  if (usable.length >= 3) add(usable.slice(0, 3));
  return sets.slice(0, maxSets).map((set) => set.map(({ t, detour, value, ...s }) => s));
}

/**
 * Fallback when no scenic places are known (map data server down, empty area):
 * probe detours to either side of the direct line, so relief and bends can still
 * pick a more interesting road than the fastest one. Returns pseudo-spots.
 */
export function detourProbes(start: LatLon, end: LatLon, extraMin: number): Spot[][] {
  const direct = distKm(start, end);
  const offsetKm = Math.min(15, budgetKm(extraMin) * 0.3, direct * 0.25);
  if (offsetKm < 2) return [];
  const kx = Math.cos(((start.lat + end.lat) / 2) * Math.PI / 180);
  // Unit vector along the axis in km space, and its perpendicular.
  const ax = (end.lon - start.lon) * 111 * kx, ay = (end.lat - start.lat) * 111;
  const len = Math.hypot(ax, ay) || 1;
  const px = -ay / len, py = ax / len;
  const at = (t: number, side: number, k = 1): Spot => ({
    lat: start.lat + (end.lat - start.lat) * t + (py * side * offsetKm * k) / 111,
    lon: start.lon + (end.lon - start.lon) * t + (px * side * offsetKm * k) / (111 * kx),
    weight: 0, count: 0, name: '', types: [],
  });
  return [[at(0.5, 1)], [at(0.5, -1)], [at(0.33, 1, 0.8), at(0.66, 1, 0.8)], [at(0.33, -1, 0.8), at(0.66, -1, 0.8)]];
}
