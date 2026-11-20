// Hand a route to other apps: Google Maps, Apple Maps, GPX for car units and OsmAnd.

import { cumulativeKm, pointAtKm, distKm, type LatLon } from './geo.ts';

const f6 = (p: LatLon) => `${p.lat.toFixed(6)},${p.lon.toFixed(6)}`;

/**
 * Shaping points that make another app follow our line: the scenic stops plus
 * evenly spaced points, at most `max` (Google Maps allows 9 waypoints in URLs).
 */
export function shapingPoints(line: LatLon[], stops: LatLon[], max = 9, spacingKm = 20): LatLon[] {
  const cum = cumulativeKm(line);
  const total = cum[cum.length - 1];
  const along = (p: LatLon) => {
    let best = Infinity, at = 0;
    for (let i = 0; i < line.length; i++) { const d = distKm(line[i], p); if (d < best) { best = d; at = cum[i]; } }
    return at;
  };
  const pts = stops.map((p) => ({ p, at: along(p) }));
  const n = Math.max(0, Math.min(max - pts.length, Math.floor(total / spacingKm) - 1));
  for (let i = 1; i <= n; i++) {
    const at = (i * total) / (n + 1);
    if (pts.some((x) => Math.abs(x.at - at) < spacingKm / 3)) continue;
    pts.push({ p: pointAtKm(line, at, cum).point, at });
  }
  return pts.sort((a, b) => a.at - b.at).slice(0, max).map((x) => x.p);
}

export function googleMapsUrl(start: LatLon | null, end: LatLon, waypoints: LatLon[]): string {
  const u = new URL('https://www.google.com/maps/dir/');
  u.searchParams.set('api', '1');
  if (start) u.searchParams.set('origin', f6(start));
  u.searchParams.set('destination', f6(end));
  if (waypoints.length) u.searchParams.set('waypoints', waypoints.slice(0, 9).map(f6).join('|'));
  u.searchParams.set('travelmode', 'driving');
  return u.toString();
}

/** Apple Maps directions. Apple's URL scheme has no waypoints, so this goes to the first scenic stop. */
export function appleMapsUrl(start: LatLon | null, end: LatLon, firstStop?: LatLon): string {
  const u = new URL('https://maps.apple.com/');
  if (start) u.searchParams.set('saddr', f6(start));
  u.searchParams.set('daddr', f6(firstStop ?? end));
  u.searchParams.set('dirflg', 'd');
  return u.toString();
}

const esc = (s: string) => s.replace(/[<&>"]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;', '"': '&quot;' })[c]!);

/** GPX 1.1 with the exact track, the scenic stops as waypoints, and a route for units that need one. */
export function toGpx(line: LatLon[], name = 'Scenic route', stops: (LatLon & { name?: string })[] = []): string {
  const wpts = stops.map((s, i) => `<wpt lat="${s.lat.toFixed(6)}" lon="${s.lon.toFixed(6)}"><name>${esc(s.name || `Stop ${i + 1}`)}</name></wpt>`).join('');
  const trk = line.map((p) => `<trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="scenic-route" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>${esc(name)}</name></metadata>${wpts}<trk><name>${esc(name)}</name><trkseg>${trk}</trkseg></trk></gpx>`;
}
