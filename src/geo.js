// Small geometry helpers. Coordinates are {lat, lon} in degrees.

const R = 6371; // Earth radius, km
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

export function distKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearing(a, b) {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Position of p along the a→b axis: 0 at a, 1 at b (can be outside 0..1). */
export function projectT(a, b, p) {
  const kx = Math.cos(rad((a.lat + b.lat) / 2));
  const bx = (b.lon - a.lon) * kx, by = b.lat - a.lat;
  const px = (p.lon - a.lon) * kx, py = p.lat - a.lat;
  const len2 = bx * bx + by * by || 1e-12;
  return (px * bx + py * by) / len2;
}

/** Extra km to go a → p → b instead of a → b, straight-line. */
export function detourKm(a, b, p) {
  return distKm(a, p) + distKm(p, b) - distKm(a, b);
}

/** Bounding box around a and b, padded by padKm. Returns [south, west, north, east]. */
export function paddedBBox(points, padKm) {
  let s = 90, w = 180, n = -90, e = -180;
  for (const p of points) {
    s = Math.min(s, p.lat); n = Math.max(n, p.lat);
    w = Math.min(w, p.lon); e = Math.max(e, p.lon);
  }
  const dLat = padKm / 111;
  const dLon = padKm / (111 * Math.cos(rad((s + n) / 2)));
  return [s - dLat, w - dLon, n + dLat, e + dLon];
}

/** Resample a polyline ([{lat,lon}]) at roughly every stepKm. */
export function resample(line, stepKm) {
  if (line.length < 2) return line.slice();
  const out = [line[0]];
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

export function lineLengthKm(line) {
  let s = 0;
  for (let i = 1; i < line.length; i++) s += distKm(line[i - 1], line[i]);
  return s;
}
