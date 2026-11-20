// Sun times and position (NOAA / Meeus approximations, accurate to ~1 minute and ~0.5°).

const rad = Math.PI / 180;

function julianDay(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

/** Sunrise and sunset for the UTC day containing `date` (null in polar day/night). */
export function sunTimes(date: Date, lat: number, lon: number): { sunrise: Date; sunset: Date } | null {
  const noon = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
  const n = Math.round(noon / 86400000 + 2440587.5 - 2451545 + 0.0008);
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360;
  const Jtransit = 2451545 + Jstar + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad;
  const toDate = (J: number) => new Date((J - 2440587.5) * 86400000);
  return { sunrise: toDate(Jtransit - H / 360), sunset: toDate(Jtransit + H / 360) };
}

/** Sun azimuth (degrees from north, clockwise) and elevation (degrees) at a moment and place. */
export function sunPosition(date: Date, lat: number, lon: number): { azimuth: number; elevation: number } {
  const d = julianDay(date) - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = q + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad);
  const e = 23.439 - 0.00000036 * d;
  const ra = Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) / rad;
  const dec = Math.asin(Math.sin(e * rad) * Math.sin(L * rad));
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  const lst = gmst * 15 + lon;
  const H = ((lst - ra) % 360) * rad;
  const phi = lat * rad;
  const elev = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const az = Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(H));
  return { azimuth: ((az / rad) + 360) % 360, elevation: elev / rad };
}

/** Golden hour: sun between -4° and +6° elevation. */
export function isGoldenHour(date: Date, lat: number, lon: number): boolean {
  const { elevation } = sunPosition(date, lat, lon);
  return elevation > -4 && elevation < 6;
}

/**
 * When the sun drops to `elevation` degrees in the evening (or rises to it in the morning) on the UTC day of `date`.
 * Golden light is strongest around +3° to +6°. Null when the sun never gets that high or low that day.
 */
export function sunAtElevation(date: Date, lat: number, lon: number, elevation: number, when: 'evening' | 'morning'): Date | null {
  const t = sunTimes(date, lat, lon);
  if (!t) return null;
  const noon = new Date((t.sunrise.getTime() + t.sunset.getTime()) / 2);
  if (sunPosition(noon, lat, lon).elevation < elevation) return null;
  // Elevation falls monotonically from noon to sunset (rises from sunrise to noon): bisect.
  let [lo, hi] = when === 'evening' ? [noon.getTime(), t.sunset.getTime()] : [t.sunrise.getTime(), noon.getTime()];
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const above = sunPosition(new Date(mid), lat, lon).elevation > elevation;
    if ((when === 'evening') === above) lo = mid; else hi = mid;
  }
  return new Date((lo + hi) / 2);
}
