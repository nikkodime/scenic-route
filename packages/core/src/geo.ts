// Geometry helpers. Coordinates are {lat, lon} in degrees, distances in km.

export interface LatLon {
  lat: number;
  lon: number;
}

/** [south, west, north, east] */
export type BBox = [number, number, number, number];

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function distKm(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing a→b in degrees 0..360 (0 = north). */
export function bearing(a: LatLon, b: LatLon): number {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Smallest absolute difference between two bearings, 0..180. */
export function angleDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Position of p along the a→b axis: 0 at a, 1 at b. */
export function projectT(a: LatLon, b: LatLon, p: LatLon): number {
  const kx = Math.cos(rad((a.lat + b.lat) / 2));
  const bx = (b.lon - a.lon) * kx, by = b.lat - a.lat;
  const px = (p.lon - a.lon) * kx, py = p.lat - a.lat;
  const len2 = bx * bx + by * by || 1e-12;
  return (px * bx + py * by) / len2;
}

/** Extra straight-line km to go a → p → b instead of a → b. */
export function detourKm(a: LatLon, b: LatLon, p: LatLon): number {
  return distKm(a, p) + distKm(p, b) - distKm(a, b);
}

export function paddedBBox(points: LatLon[], padKm: number): BBox {
  let s = 90, w = 180, n = -90, e = -180;
  for (const p of points) {
    s = Math.min(s, p.lat); n = Math.max(n, p.lat);
    w = Math.min(w, p.lon); e = Math.max(e, p.lon);
  }
  const dLat = padKm / 111;
  const dLon = padKm / (111 * Math.cos(rad((s + n) / 2)));
  return [s - dLat, w - dLon, n + dLat, e + dLon];
}

export function inBBox(p: LatLon, b: BBox): boolean {
  return p.lat >= b[0] && p.lat <= b[2] && p.lon >= b[1] && p.lon <= b[3];
}

/** Resample a polyline at roughly every stepKm, keeping both ends. */
export function resample(line: LatLon[], stepKm: number): LatLon[] {
  if (line.length < 2) return line.slice();
  const out: LatLon[] = [line[0]];
  let carry = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i];
    const d = distKm(a, b);
    if (d === 0) continue;
    let t = (stepKm - carry) / d;
    while (t <= 1) {
      out.push({ lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t });
      t += stepKm / d;
    }
    carry = (carry + d) % stepKm;
  }
  const last = line[line.length - 1];
  if (distKm(out[out.length - 1], last) > stepKm / 4) out.push(last);
  return out;
}

export function lineLengthKm(line: LatLon[]): number {
  let s = 0;
  for (let i = 1; i < line.length; i++) s += distKm(line[i - 1], line[i]);
  return s;
}

/** Cumulative km at each vertex. */
export function cumulativeKm(line: LatLon[]): number[] {
  const out = [0];
  for (let i = 1; i < line.length; i++) out.push(out[i - 1] + distKm(line[i - 1], line[i]));
  return out;
}

/** Point at a given km along the line, with the local heading. */
export function pointAtKm(line: LatLon[], km: number, cum = cumulativeKm(line)): { point: LatLon; heading: number } {
  if (line.length === 1) return { point: line[0], heading: 0 };
  let i = 1;
  while (i < line.length - 1 && cum[i] < km) i++;
  const a = line[i - 1], b = line[i];
  const seg = cum[i] - cum[i - 1] || 1e-9;
  const t = Math.max(0, Math.min(1, (km - cum[i - 1]) / seg));
  return { point: { lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t }, heading: bearing(a, b) };
}

/** Ray-casting point-in-polygon on a single ring ([lon, lat] pairs, GeoJSON order). */
export function pointInRing(p: LatLon, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > p.lat !== yj > p.lat && p.lon < ((xj - xi) * (p.lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Point in a GeoJSON Polygon or MultiPolygon geometry (holes respected). */
export function pointInGeometry(p: LatLon, g: { type: string; coordinates: any }): boolean {
  const polys: number[][][][] = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  for (const poly of polys) {
    if (!pointInRing(p, poly[0])) continue;
    if (poly.slice(1).some((hole) => pointInRing(p, hole))) continue;
    return true;
  }
  return false;
}

/** Google encoded polyline (precision 5 or 6). Used by GraphHopper and in compact API payloads. */
export function encodePolyline(line: LatLon[], precision = 5): string {
  const f = 10 ** precision;
  let out = '', plat = 0, plon = 0;
  const enc = (v: number) => {
    v = v < 0 ? ~(v << 1) : v << 1;
    let s = '';
    while (v >= 0x20) { s += String.fromCharCode((0x20 | (v & 0x1f)) + 63); v >>= 5; }
    return s + String.fromCharCode(v + 63);
  };
  for (const p of line) {
    const lat = Math.round(p.lat * f), lon = Math.round(p.lon * f);
    out += enc(lat - plat) + enc(lon - plon);
    plat = lat; plon = lon;
  }
  return out;
}

export function decodePolyline(s: string, precision = 5): LatLon[] {
  const f = 10 ** precision;
  const out: LatLon[] = [];
  let i = 0, lat = 0, lon = 0;
  const next = () => {
    let shift = 0, result = 0, b: number;
    do { b = s.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };
  while (i < s.length) {
    lat += next(); lon += next();
    out.push({ lat: lat / f, lon: lon / f });
  }
  return out;
}

/** Douglas–Peucker simplification (tolerance in km), for compact payloads. */
export function simplify(line: LatLon[], tolKm: number): LatLon[] {
  if (line.length < 3) return line.slice();
  const keep = new Uint8Array(line.length);
  keep[0] = keep[line.length - 1] = 1;
  const stack: [number, number][] = [[0, line.length - 1]];
  const kx = Math.cos(rad(line[0].lat)) * 111, ky = 111;
  const perp = (p: LatLon, a: LatLon, b: LatLon) => {
    const ax = a.lon * kx, ay = a.lat * ky, bx = b.lon * kx, by = b.lat * ky, px = p.lon * kx, py = p.lat * ky;
    const dx = bx - ax, dy = by - ay;
    const l2 = dx * dx + dy * dy;
    const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  };
  while (stack.length) {
    const [s, e] = stack.pop()!;
    let best = 0, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perp(line[i], line[s], line[e]);
      if (d > best) { best = d; idx = i; }
    }
    if (best > tolKm && idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return line.filter((_, i) => keep[i]);
}
