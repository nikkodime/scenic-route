// Sunrise/sunset from the standard NOAA approximation. Accurate to a couple of
// minutes, which is plenty for "will I arrive before dark?".

const rad = Math.PI / 180;

/** Returns {sunrise: Date, sunset: Date} for the given day and place (null in polar day/night). */
export function sunTimes(date, lat, lon) {
  const noon = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
  const n = Math.round(noon / 86400000 + 2440587.5 - 2451545 + 0.0008); // days since J2000
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360;
  const Jtransit = 2451545 + Jstar + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad;
  const toDate = (J) => new Date((J - 2440587.5) * 86400000);
  return { sunrise: toDate(Jtransit - H / 360), sunset: toDate(Jtransit + H / 360) };
}
