// Rules of the road that can spoil a scenic drive: ZTLs, emission zones, gravel, vignettes, closed passes.

import { distKm, pointAtKm, pointInGeometry, resample, cumulativeKm, type LatLon } from './geo.ts';

export type AdvisoryKind = 'ztl' | 'lez' | 'unpaved' | 'vignette' | 'toll' | 'pass_closed' | 'pass_seasonal' | 'ferry';
export type Severity = 'info' | 'warning' | 'block';

export interface Advisory {
  kind: AdvisoryKind;
  severity: Severity;
  title: string;
  detail: string;
  atKm?: number;
  /** Where on the map, when the advisory is about one place. */
  lat?: number;
  lon?: number;
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

/**
 * Curated seasonal passes with their typical winter closure (the router also honours OSM :conditional tags).
 * Dates are typical, not official: snow can close a pass earlier or open it later. Italian summits are
 * taken from OpenStreetMap; the others are the road summit to within about a kilometre.
 */
export const SEASONAL_PASSES: MountainPass[] = [
  // Italy
  { name: 'Passo dello Stelvio', lat: 46.5286, lon: 10.4532, closedFrom: '11-01', closedTo: '05-25' },
  { name: 'Passo di Gavia', lat: 46.3435, lon: 10.4873, closedFrom: '10-15', closedTo: '06-10' },
  { name: 'Passo del Rombo (Timmelsjoch)', lat: 46.9054, lon: 11.0973, closedFrom: '11-01', closedTo: '05-20' },
  { name: 'Passo Giau', lat: 46.4825, lon: 12.0537, closedFrom: '12-20', closedTo: '03-31' },
  { name: 'Passo Manghen', lat: 46.1733, lon: 11.4415, closedFrom: '11-15', closedTo: '05-15' },
  { name: 'Passo del Mortirolo', lat: 46.2524, lon: 10.3043, closedFrom: '11-15', closedTo: '04-30' },
  { name: 'Passo di Monte Giovo (Jaufenpass)', lat: 46.8396, lon: 11.3215, closedFrom: '11-15', closedTo: '04-30' },
  { name: 'Passo di Pennes (Penser Joch)', lat: 46.8188, lon: 11.4413, closedFrom: '11-15', closedTo: '04-30' },
  { name: 'Passo dello Spluga', lat: 46.5056, lon: 9.3303, closedFrom: '11-01', closedTo: '05-15' },
  { name: 'Colle del Nivolet', lat: 45.4792, lon: 7.1423, closedFrom: '10-15', closedTo: '06-25' },
  { name: "Colle dell'Agnello", lat: 44.6839, lon: 6.9796, closedFrom: '10-25', closedTo: '06-01' },
  { name: 'Colle della Lombarda', lat: 44.2027, lon: 7.1501, closedFrom: '11-01', closedTo: '05-31' },
  { name: 'Colle Fauniera', lat: 44.3857, lon: 7.1218, closedFrom: '10-15', closedTo: '06-15' },
  { name: 'Colle di Sampeyre', lat: 44.5510, lon: 7.1196, closedFrom: '11-01', closedTo: '05-31' },
  { name: 'Colle del Piccolo San Bernardo', lat: 45.6800, lon: 6.8840, closedFrom: '11-01', closedTo: '05-31' },
  { name: 'Colle del Gran San Bernardo', lat: 45.8686, lon: 7.1706, closedFrom: '10-15', closedTo: '06-10' },
  // Austria and Switzerland
  { name: 'Grossglockner Hochalpenstrasse', lat: 47.0745, lon: 12.8418, closedFrom: '11-03', closedTo: '04-30' },
  { name: 'Silvretta Hochalpenstrasse', lat: 46.9183, lon: 10.0928, closedFrom: '11-01', closedTo: '05-31' },
  { name: 'Furkapass', lat: 46.5725, lon: 8.4150, closedFrom: '10-20', closedTo: '06-05' },
  { name: 'Grimselpass', lat: 46.5614, lon: 8.3378, closedFrom: '10-25', closedTo: '06-01' },
  { name: 'Sustenpass', lat: 46.7297, lon: 8.4469, closedFrom: '10-25', closedTo: '06-10' },
  { name: 'Nufenenpass', lat: 46.4775, lon: 8.3872, closedFrom: '10-20', closedTo: '06-10' },
  { name: 'Gotthardpass (old road)', lat: 46.5594, lon: 8.5617, closedFrom: '10-25', closedTo: '06-01' },
  { name: 'Klausenpass', lat: 46.8686, lon: 8.8556, closedFrom: '10-25', closedTo: '06-01' },
  // France and the Pyrenees
  { name: 'Col du Galibier', lat: 45.0641, lon: 6.4078, closedFrom: '10-25', closedTo: '06-05' },
  { name: "Col de l'Iseran", lat: 45.4170, lon: 7.0306, closedFrom: '10-10', closedTo: '06-20' },
  { name: 'Col de la Bonette', lat: 44.3213, lon: 6.8071, closedFrom: '10-25', closedTo: '06-10' },
  { name: "Col d'Izoard", lat: 44.8203, lon: 6.7350, closedFrom: '11-01', closedTo: '05-31' },
  { name: 'Col de la Croix de Fer', lat: 45.2269, lon: 6.2006, closedFrom: '11-01', closedTo: '06-01' },
  { name: 'Col du Tourmalet', lat: 42.9086, lon: 0.1453, closedFrom: '11-01', closedTo: '05-31' },
  // Further afield
  { name: 'Transfăgărășan', lat: 45.6026, lon: 24.6166, closedFrom: '11-01', closedTo: '06-30' },
  { name: 'Trollstigen', lat: 62.4536, lon: 7.6656, closedFrom: '10-20', closedTo: '05-20' },
];

/** A route within this distance of a pass summit is taken to cross it (mountain roads rarely pass that close otherwise). */
export const PASS_MATCH_KM = 1.2;

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
  /** Where the first unpaved stretch starts, when the router says. */
  unpavedAtKm?: number;
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
  const at = (km: number) => { const p = pointAtKm(pts, km, cum).point; return { atKm: Math.round(km), lat: Math.round(p.lat * 1e5) / 1e5, lon: Math.round(p.lon * 1e5) / 1e5 }; };

  for (const z of zones) {
    // Coarse bbox prefilter, then point-in-polygon on the resampled line.
    const hitIdx = pts.findIndex((p) => pointInGeometry(p, z.geometry));
    const destInside = pointInGeometry(end, z.geometry);
    if (hitIdx < 0 && !destInside) continue;
    const { kind, name, hours } = z.properties;
    if (kind === 'ztl') {
      if (destInside)
        out.push({ kind, severity: 'warning', title: `Destination is inside the ${name} ZTL`, detail: `Park outside the limited traffic zone${hours ? ` (active ${hours})` : ''}; entering without a permit means a fine by camera.`, ...at(cum[cum.length - 1]) });
      else
        out.push({ kind, severity: 'block', title: `Crosses the ${name} ZTL`, detail: 'This route enters a limited traffic zone. Camera fines apply to unregistered cars.', ...at(cum[hitIdx]) });
    } else {
      out.push({ kind, severity: 'warning', title: `${name} low-emission zone`, detail: 'Check that your car meets the emission rules or has the required sticker.', ...at(cum[Math.max(0, hitIdx)]) });
    }
  }

  const unpaved = input.unpavedKm ?? 0;
  if (unpaved >= 0.3) {
    const block = prefs.rentalCar || prefs.avoidUnpaved;
    out.push({ kind: 'unpaved', severity: block ? 'block' : 'warning', title: `${unpaved.toFixed(1)} km of gravel or dirt road`, detail: prefs.rentalCar ? 'Most rental contracts exclude unpaved roads from cover.' : 'Fine in dry weather with care; slow and dusty.', ...(input.unpavedAtKm != null ? at(input.unpavedAtKm) : {}) });
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
    let bestD = PASS_MATCH_KM;
    for (let i = 0; i < pts.length; i++) { const d = distKm(pts[i], p); if (d < bestD) { bestD = d; hit = i; } }
    if (hit < 0) continue;
    const closed = inSeason(date, p.closedFrom, p.closedTo);
    out.push({
      kind: closed ? 'pass_closed' : 'pass_seasonal',
      severity: closed ? 'block' : 'info',
      title: closed ? `${p.name} is usually closed now` : `${p.name} is a seasonal pass`,
      detail: closed ? `Typically closed ${p.closedFrom.replace('-', '/')} to ${p.closedTo.replace('-', '/')} (MM/DD). Check before you go.` : 'Open in season; check for snow or events before you go.',
      atKm: Math.round(cum[hit]), lat: p.lat, lon: p.lon,
    });
  }
  return out;
}

export const isBlocked = (a: Advisory[]) => a.some((x) => x.severity === 'block');
