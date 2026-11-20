// A scenic route against the fastest one: where it leaves the fast road, where it comes back, and what each
// detour costs in km and minutes. Drives the "vs direct" strip, the detour ribbon and the ghost line on the map.

import { cumulativeKm, distKm, resample, type LatLon } from './geo.ts';

export interface Detour {
  /** Along the scenic route, km from the start. */
  fromKm: number;
  toKm: number;
  /** Where it leaves and rejoins the fastest road (or the start / finish). */
  leave: LatLon;
  rejoin: LatLon;
  /** Km driven on the detour, and how many more than the fast road between the same two points. */
  km: number;
  extraKm: number;
  /** Extra minutes; the detours of a route add up to its extraMinutes. */
  extraMinutes: number;
  /** Best-known place on the detour ("Pienza"), when there is one. */
  name: string | null;
}

export interface Comparison {
  /** Negative when this route is shorter than the fastest road (a quieter, more direct road). */
  extraKm: number;
  extraMinutes: number;
  /** Share of the scenic route that runs on the fastest road, 0–100. */
  sharedPct: number;
  detours: Detour[];
}

export interface CompareInput {
  line: LatLon[];
  km: number;
  minutes: number;
  /** Named places along the route, by km. */
  places?: { name: string; atKm: number }[];
}

const STEP_KM = 0.1;
/** A point within this distance of the fast road is on it (parallel carriageways, junction geometry). */
const SHARED_KM = 0.15;
/** Shorter excursions off the fast road are noise; shorter stretches back on it (crossing it) don't split a detour. */
const MIN_DETOUR_KM = 1;
const MIN_REJOIN_KM = 0.6;
/** Detours closer than this (or 5% of the route) are one detour. */
const MERGE_GAP_KM = 3;
const CELL = 0.005; // degrees, ~500 m

export function compareRoutes(route: CompareInput, fastest: CompareInput): Comparison {
  const extraKm = round1(route.km - fastest.km);
  const extraMinutes = Math.max(0, Math.round(route.minutes - fastest.minutes));
  const pts = resample(route.line, STEP_KM);
  const fpts = resample(fastest.line, STEP_KM / 2);
  if (pts.length < 2 || fpts.length < 2) return { extraKm, extraMinutes, sharedPct: 0, detours: [] };
  // The line lengths measured here differ a little from the router's km: scale to the router's.
  const cum = scaled(cumulativeKm(pts), route.km);
  const fcum = scaled(cumulativeKm(fpts), fastest.km);

  // Grid index of the fast road's points.
  const grid = new Map<string, number[]>();
  const key = (lat: number, lon: number) => `${Math.floor(lat / CELL)},${Math.floor(lon / CELL)}`;
  fpts.forEach((p, i) => {
    const k = key(p.lat, p.lon);
    (grid.get(k) ?? grid.set(k, []).get(k)!).push(i);
  });
  const nearest = (p: LatLon): { d: number; i: number } => {
    let best = { d: Infinity, i: -1 };
    const cy = Math.floor(p.lat / CELL), cx = Math.floor(p.lon / CELL);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      for (const i of grid.get(`${cy + dy},${cx + dx}`) ?? []) {
        const d = distKm(p, fpts[i]);
        if (d < best.d) best = { d, i };
      }
    }
    return best;
  };

  const near = pts.map(nearest);
  const off = near.map((n) => n.d > SHARED_KM);
  // Close short gaps of "on" inside a detour (crossing the motorway on a bridge).
  smooth(off, cum, false, MIN_REJOIN_KM);
  // Drop short "off" blips (a slip road drawn a bit wide).
  smooth(off, cum, true, MIN_DETOUR_KM);

  const raw: (Omit<Detour, 'extraMinutes'> & { rawMin: number })[] = [];
  const vRoute = route.km / Math.max(route.minutes, 1e-6);
  const vFast = fastest.km / Math.max(fastest.minutes, 1e-6);
  for (let i = 0; i < pts.length;) {
    if (!off[i]) { i++; continue; }
    let j = i;
    while (j + 1 < pts.length && off[j + 1]) j++;
    const a = Math.max(0, i - 1), b = Math.min(pts.length - 1, j + 1);
    const fFrom = a === 0 ? 0 : fcum[near[a].i];
    const fTo = b === pts.length - 1 ? fastest.km : fcum[near[b].i];
    const km = cum[b] - cum[a];
    const fastKm = Math.abs(fTo - fFrom);
    // A short stretch on a parallel road that is no longer than the fast road isn't worth calling a detour.
    if (km - fastKm < 0.3 && km < 3) { i = j + 1; continue; }
    const names = (route.places ?? []).filter((p) => p.name && p.atKm >= cum[a] - 0.5 && p.atKm <= cum[b] + 0.5);
    raw.push({
      fromKm: round1(cum[a]), toKm: round1(cum[b]),
      leave: pts[a], rejoin: pts[b],
      km: round1(km), extraKm: round1(Math.max(0, km - fastKm)),
      name: names[0]?.name ?? null,
      rawMin: Math.max(0, km / vRoute - fastKm / vFast),
    });
    i = j + 1;
  }

  // Shared km: everything outside the detours.
  const sharedKm = Math.max(0, cum[cum.length - 1] - raw.reduce((s, d) => s + d.km, 0));
  // Share the route's real extra minutes out over the detours by their estimated cost, so they add up.
  const total = raw.reduce((s, d) => s + d.rawMin, 0);
  const split: Detour[] = raw.map(({ rawMin, ...d }) => ({ ...d, extraMinutes: total > 0 ? Math.round((extraMinutes * rawMin) / total) : 0 }));
  // Detours a few km apart read as one to a driver (and as a pile of labels on screen): merge them.
  const gapKm = Math.max(MERGE_GAP_KM, route.km * 0.05);
  const merged: Detour[] = [];
  for (const d of split) {
    const prev = merged[merged.length - 1];
    if (prev && d.fromKm - prev.toKm < gapKm) {
      const name = d.extraMinutes > prev.extraMinutes && d.name ? d.name : prev.name ?? d.name;
      merged[merged.length - 1] = { ...prev, toKm: d.toKm, rejoin: d.rejoin, km: round1(d.toKm - prev.fromKm), extraKm: round1(prev.extraKm + d.extraKm), extraMinutes: prev.extraMinutes + d.extraMinutes, name };
    } else merged.push(d);
  }
  // A detour that costs no time isn't one to mention (its minutes are 0, so the total still adds up).
  const detours = merged.filter((d) => d.extraMinutes >= 1);
  return { extraKm, extraMinutes, sharedPct: Math.round((100 * sharedKm) / Math.max(cum[cum.length - 1], 1e-6)), detours };
}

/** Flip runs of `value` shorter than minKm that sit between runs of the other value. */
function smooth(flags: boolean[], cum: number[], value: boolean, minKm: number) {
  for (let i = 0; i < flags.length;) {
    if (flags[i] !== value) { i++; continue; }
    let j = i;
    while (j + 1 < flags.length && flags[j + 1] === value) j++;
    // A gap back on the fast road only counts as one when it sits between two detours.
    const inside = value ? true : i > 0 && j < flags.length - 1;
    if (inside && cum[Math.min(j + 1, cum.length - 1)] - cum[Math.max(i - 1, 0)] < minKm) for (let k = i; k <= j; k++) flags[k] = !value;
    i = j + 1;
  }
}

function scaled(cum: number[], km: number): number[] {
  const last = cum[cum.length - 1];
  return last > 0 && km > 0 ? cum.map((c) => (c * km) / last) : cum;
}

const round1 = (x: number) => Math.round(x * 10) / 10;
