// Rules of the road that can spoil a scenic drive: ZTLs, emission zones, gravel, vignettes, closed passes.

import { distKm, pointInGeometry, resample, cumulativeKm, type LatLon } from './geo.ts';

export type AdvisoryKind = 'ztl' | 'lez' | 'unpaved' | 'vignette' | 'toll' | 'pass_closed' | 'pass_seasonal' | 'ferry';
export type Severity = 'info' | 'warning' | 'block';

export interface Advisory {
  kind: AdvisoryKind;
  severity: Severity;
  title: string;
  detail: string;
  atKm?: number;
}

export interface Zone {
  type: 'Feature';
  properties: { kind: 'ztl' | 'lez'; name: string; city?: string; hours?: string; url?: string };
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: any };
}

export interface MountainPass {
  name: string;
  lat: number;
  lon: number;
  /** Typical closure, inclusive, as MM-DD. */
  closedFrom: string;
  closedTo: string;
}

/** Countries where motorways need a vignette (sticker or e-vignette) for cars. */
export const VIGNETTE_COUNTRIES: Record<string, string> = {
  AT: 'Austria', CH: 'Switzerland', CZ: 'Czechia', SK: 'Slovakia', SI: 'Slovenia', HU: 'Hungary', RO: 'Romania', BG: 'Bulgaria',
};

/** Curated seasonal passes (typical dates; the router also honours OSM :conditional tags). */
export const SEASONAL_PASSES: MountainPass[] = [
  { name: 'Passo dello Stelvio', lat: 46.5286, lon: 10.4533, closedFrom: '11-01', closedTo: '05-25' },
  { name: 'Passo di Gavia', lat: 46.3436, lon: 10.4875, closedFrom: '10-15', closedTo: '06-10' },
  { name: 'Grossglockner Hochalpenstrasse', lat: 47.0745, lon: 12.8418, closedFrom: '11-03', closedTo: '04-30' },
  { name: 'Col du Galibier', lat: 45.0641, lon: 6.4078, closedFrom: '10-25', closedTo: '06-05' },
  { name: 'Col de l\'Iseran', lat: 45.4170, lon: 7.0306, closedFrom: '10-10', closedTo: '06-20' },
  { name: 'Furkapass', lat: 46.5725, lon: 8.4150, closedFrom: '10-20', closedTo: '06-05' },
  { name: 'Transfăgărășan', lat: 45.6026, lon: 24.6166, closedFrom: '11-01', closedTo: '06-30' },
  { name: 'Passo Giau', lat: 46.4831, lon: 12.0533, closedFrom: '12-20', closedTo: '03-31' },
];

export interface AdvisoryPrefs {
  rentalCar?: boolean;
  avoidUnpaved?: boolean;
  avoidTolls?: boolean;
  /** Countries the driver already has a vignette for. */
  vignettes?: string[];
}

export interface AdvisoryInput {
  line: LatLon[];
  unpavedKm?: number;
  tollKm?: number;
  ferryKm?: number;
  /** ISO country codes with motorway km, from router path details. */
  motorwayKmByCountry?: Record<string, number>;
  zones?: Zone[];
  passes?: MountainPass[];
  date?: Date;
  prefs?: AdvisoryPrefs;
}

function inSeason(date: Date, from: string, to: string): boolean {
  const md = `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  return from <= to ? md >= from && md <= to : md >= from || md <= to;
}

export function routeAdvisories(input: AdvisoryInput): Advisory[] {
  const { line, zones = [], passes = SEASONAL_PASSES, date = new Date(), prefs = {} } = input;
  const out: Advisory[] = [];
  const pts = resample(line, 0.2);
  const cum = cumulativeKm(pts);
  const end = line[line.length - 1];

  for (const z of zones) {
    // Coarse bbox prefilter, then point-in-polygon on the resampled line.
    const hitIdx = pts.findIndex((p) => pointInGeometry(p, z.geometry));
    const destInside = pointInGeometry(end, z.geometry);
    if (hitIdx < 0 && !destInside) continue;
    const { kind, name, hours } = z.properties;
    if (kind === 'ztl') {
      if (destInside)
        out.push({ kind, severity: 'warning', title: `Destination is inside the ${name} ZTL`, detail: `Park outside the limited traffic zone${hours ? ` (active ${hours})` : ''}; entering without a permit means a fine by camera.`, atKm: Math.round(cum[cum.length - 1]) });
      else
        out.push({ kind, severity: 'block', title: `Crosses the ${name} ZTL`, detail: 'This route enters a limited traffic zone. Camera fines apply to unregistered cars.', atKm: Math.round(cum[hitIdx]) });
    } else {
      out.push({ kind, severity: 'warning', title: `${name} low-emission zone`, detail: 'Check that your car meets the emission rules or has the required sticker.', atKm: Math.round(cum[Math.max(0, hitIdx)]) });
    }
  }

  const unpaved = input.unpavedKm ?? 0;
  if (unpaved >= 0.3) {
    const block = prefs.rentalCar || prefs.avoidUnpaved;
    out.push({ kind: 'unpaved', severity: block ? 'block' : 'warning', title: `${unpaved.toFixed(1)} km of gravel or dirt road`, detail: prefs.rentalCar ? 'Most rental contracts exclude unpaved roads from cover.' : 'Fine in dry weather with care; slow and dusty.' });
  }

  for (const [cc, kmOnMotorway] of Object.entries(input.motorwayKmByCountry ?? {})) {
    if (kmOnMotorway < 0.5 || !VIGNETTE_COUNTRIES[cc] || prefs.vignettes?.includes(cc)) continue;
    out.push({ kind: 'vignette', severity: 'warning', title: `Vignette needed in ${VIGNETTE_COUNTRIES[cc]}`, detail: `${kmOnMotorway.toFixed(0)} km on motorways there. Buy the official e-vignette before you go.` });
  }

  if ((input.tollKm ?? 0) >= 1)
    out.push({ kind: 'toll', severity: prefs.avoidTolls ? 'warning' : 'info', title: `${input.tollKm!.toFixed(0)} km on toll roads`, detail: 'Tolls are paid at the barrier or by transponder.' });
  if ((input.ferryKm ?? 0) > 0)
    out.push({ kind: 'ferry', severity: 'info', title: 'Includes a ferry', detail: 'Check sailing times before you set off.' });

  for (const p of passes) {
    let hit = -1;
    for (let i = 0; i < pts.length; i += 2) if (distKm(pts[i], p) < 0.6) { hit = i; break; }
    if (hit < 0) continue;
    const closed = inSeason(date, p.closedFrom, p.closedTo);
    out.push({
      kind: closed ? 'pass_closed' : 'pass_seasonal',
      severity: closed ? 'block' : 'info',
      title: closed ? `${p.name} is usually closed now` : `${p.name} is a seasonal pass`,
      detail: closed ? `Typically closed ${p.closedFrom.replace('-', '/')} to ${p.closedTo.replace('-', '/')} (MM/DD). Check before you go.` : 'Open in season; check for snow or events before you go.',
      atKm: Math.round(cum[hit]),
    });
  }
  return out;
}

export const isBlocked = (a: Advisory[]) => a.some((x) => x.severity === 'block');
