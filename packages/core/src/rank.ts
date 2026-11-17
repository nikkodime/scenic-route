// Keep routes within the time budget, rank by score, drop near-duplicates.

import { resample, type LatLon } from './geo.ts';

/** Share of route B's cells that route A also passes through (~300 m grid). */
export function overlap(a: LatLon[], b: LatLon[]): number {
  const cells = (line: LatLon[]) => new Set(resample(line, 0.25).map((p) => `${Math.round(p.lat * 360)},${Math.round(p.lon * 260)}`));
  const ca = cells(a), cb = cells(b);
  let n = 0;
  for (const c of cb) if (ca.has(c)) n++;
  return cb.size ? n / cb.size : 1;
}

export interface Rankable {
  minutes: number;
  line: LatLon[];
  scored: { score: number };
}

/**
 * Routes over `fastestMinutes + extraMinutes` (+10% slack) are dropped. A route
 * that mostly overlaps a better one (>85% both ways) is a duplicate.
 */
export function rankRoutes<T extends Rankable>(routes: T[], fastestMinutes: number, extraMinutes: number, keep = 3, pointsPerMinute = 0): T[] {
  const limit = fastestMinutes + extraMinutes * 1.1 + 1;
  // Utility: score minus what the extra time costs this driver (0 = only beauty counts).
  const u = (r: T) => r.scored.score - pointsPerMinute * Math.max(0, r.minutes - fastestMinutes);
  const ok = routes.filter((r) => r.minutes <= limit).sort((a, b) => u(b) - u(a) || a.minutes - b.minutes);
  const picked: T[] = [];
  for (const r of ok) {
    if (picked.some((p) => overlap(p.line, r.line) > 0.85 && Math.min(overlap(r.line, p.line), 1) > 0.85)) continue;
    picked.push(r);
    if (picked.length === keep) break;
  }
  return picked;
}
