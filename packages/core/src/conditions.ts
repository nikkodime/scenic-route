// Light and weather along a timed route, turned into plain advice.

import { cumulativeKm, pointAtKm, angleDiff, type LatLon } from './geo.ts';
import { sunPosition, sunTimes } from './sun.ts';

export interface HourlyForecast {
  time: string; // ISO
  cloud: number; // %
  lowCloud: number; // %
  precipProb: number; // %
  precipMm: number;
  visibilityKm: number | null;
  fog: boolean;
}

export interface WeatherAtPoint {
  atKm: number;
  eta: string;
  cloud: number;
  lowCloud: number;
  precipProb: number;
  precipMm: number;
  visibilityKm: number | null;
  fog: boolean;
}

export type Verdict = 'great' | 'good' | 'mixed' | 'poor';

export interface Conditions {
  departure: string;
  arrival: string;
  sunrise: string | null;
  sunset: string | null;
  arrivesAfterDark: boolean;
  goldenHour: { fromKm: number; toKm: number } | null;
  glare: { fromKm: number; toKm: number }[];
  weather: WeatherAtPoint[];
  verdict: Verdict;
  notes: string[];
}

/** Points along a route at which to sample weather, with the time the driver gets there. */
export function weatherSamplePoints(line: LatLon[], km: number, minutes: number, departure: Date, n = 4): { atKm: number; point: LatLon; eta: Date }[] {
  const cum = cumulativeKm(line);
  const total = cum[cum.length - 1] || km || 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0.5 : i / (n - 1);
    const atKm = f * total;
    out.push({ atKm: Math.round(atKm), point: pointAtKm(line, atKm, cum).point, eta: new Date(departure.getTime() + f * minutes * 60000) });
  }
  return out;
}

/** The forecast hour closest to a moment, or null when the forecast does not cover it (±90 min). */
export function forecastAt(hours: HourlyForecast[], at: Date): HourlyForecast | null {
  let best: HourlyForecast | null = null, bestDt = Infinity;
  for (const h of hours) {
    const dt = Math.abs(Date.parse(h.time) - at.getTime());
    if (dt < bestDt) { bestDt = dt; best = h; }
  }
  return bestDt <= 90 * 60000 ? best : null;
}

interface StretchOpts { stepKm?: number }

/** Stretches (km ranges) where a predicate holds, scanning the timed route. */
function stretches(line: LatLon[], minutes: number, departure: Date, pred: (p: LatLon, heading: number, t: Date) => boolean, { stepKm = 1 }: StretchOpts = {}) {
  const cum = cumulativeKm(line);
  const total = cum[cum.length - 1];
  const out: { fromKm: number; toKm: number }[] = [];
  let open: number | null = null;
  for (let k = 0; k <= total; k += stepKm) {
    const { point, heading } = pointAtKm(line, k, cum);
    const t = new Date(departure.getTime() + (total ? k / total : 0) * minutes * 60000);
    const hit = pred(point, heading, t);
    if (hit && open == null) open = k;
    if (!hit && open != null) { out.push({ fromKm: Math.round(open), toKm: Math.round(k) }); open = null; }
  }
  if (open != null) out.push({ fromKm: Math.round(open), toKm: Math.round(total) });
  return out.filter((s) => s.toKm - s.fromKm >= 2);
}

/** Stretches where the driver heads into a low sun (elevation 0–15°, within 25° of heading). */
export function glareStretches(line: LatLon[], minutes: number, departure: Date) {
  return stretches(line, minutes, departure, (p, heading, t) => {
    const s = sunPosition(t, p.lat, p.lon);
    return s.elevation > 0 && s.elevation < 15 && angleDiff(s.azimuth, heading) < 25;
  });
}

export function goldenHourStretches(line: LatLon[], minutes: number, departure: Date) {
  return stretches(line, minutes, departure, (p, _h, t) => {
    const e = sunPosition(t, p.lat, p.lon).elevation;
    return e > -4 && e < 6;
  });
}

function rate(w: WeatherAtPoint[]): Verdict {
  if (!w.length) return 'good';
  const worst = (f: (x: WeatherAtPoint) => number) => Math.max(...w.map(f));
  const avg = (f: (x: WeatherAtPoint) => number) => w.reduce((s, x) => s + f(x), 0) / w.length;
  if (w.some((x) => x.fog) || worst((x) => x.precipProb) >= 70 || avg((x) => x.lowCloud) >= 80) return 'poor';
  if (worst((x) => x.precipProb) >= 40 || avg((x) => x.lowCloud) >= 50 || avg((x) => x.cloud) >= 85) return 'mixed';
  if (avg((x) => x.cloud) <= 35 && worst((x) => x.precipProb) < 15) return 'great';
  return 'good';
}

const hhmm = (d: Date, tz?: string) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz });

export interface ConditionsInput {
  line: LatLon[];
  km: number;
  minutes: number;
  departure: Date;
  /** Forecast per sample point, same order as weatherSamplePoints(). Empty when unavailable. */
  forecasts: HourlyForecast[][];
  /** Best scenic stretch, to say whether golden hour lands on it. */
  bestStretch?: { fromKm: number; toKm: number } | null;
  timeZone?: string;
}

export function assessConditions({ line, km, minutes, departure, forecasts, bestStretch = null, timeZone = 'Europe/Rome' }: ConditionsInput): Conditions {
  const end = line[line.length - 1];
  const arrival = new Date(departure.getTime() + minutes * 60000);
  const sun = sunTimes(arrival, end.lat, end.lon);
  const samples = weatherSamplePoints(line, km, minutes, departure, forecasts.length || 4);
  const weather: WeatherAtPoint[] = [];
  samples.forEach((s, i) => {
    const h = forecasts[i] ? forecastAt(forecasts[i], s.eta) : null;
    if (h) weather.push({ atKm: s.atKm, eta: s.eta.toISOString(), cloud: h.cloud, lowCloud: h.lowCloud, precipProb: h.precipProb, precipMm: h.precipMm, visibilityKm: h.visibilityKm, fog: h.fog });
  });

  const glare = glareStretches(line, minutes, departure);
  const golden = goldenHourStretches(line, minutes, departure);
  const goldenOnBest = bestStretch ? golden.find((g) => g.toKm > bestStretch.fromKm && g.fromKm < bestStretch.toKm) ?? null : null;
  const arrivesAfterDark = !!sun && (arrival > sun.sunset || arrival < sun.sunrise);
  const verdict = rate(weather);

  const notes: string[] = [];
  if (arrivesAfterDark && sun) notes.push(`You arrive after dark (sunset ${hhmm(sun.sunset, timeZone)}). Leave earlier to see the views.`);
  else if (sun && sun.sunset.getTime() - arrival.getTime() < 45 * 60000) notes.push(`Tight on light: sunset is at ${hhmm(sun.sunset, timeZone)}.`);
  if (goldenOnBest) notes.push(`Golden hour lands on the most beautiful stretch (km ${goldenOnBest.fromKm}–${goldenOnBest.toKm}).`);
  if (glare.length) notes.push(`Low sun ahead on ${glare.map((g) => `km ${g.fromKm}–${g.toKm}`).join(', ')}: sunglasses and visor.`);
  if (weather.some((w) => w.fog)) notes.push('Fog is forecast on part of the route: views will be hidden.');
  else if (verdict === 'poor') notes.push('Rain or low cloud will hide most views. Another day would be better.');
  else if (verdict === 'mixed') notes.push('Some cloud or showers: views may come and go.');
  else if (verdict === 'great') notes.push('Clear skies: a great day for this drive.');

  return {
    departure: departure.toISOString(),
    arrival: arrival.toISOString(),
    sunrise: sun ? sun.sunrise.toISOString() : null,
    sunset: sun ? sun.sunset.toISOString() : null,
    arrivesAfterDark,
    goldenHour: goldenOnBest ?? golden[0] ?? null,
    glare,
    weather,
    verdict,
    notes,
  };
}
