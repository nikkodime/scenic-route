// Synthetic Tuscany fixtures and fake providers for offline tests.
import { lineLengthKm, resample, type LatLon } from '../src/geo.ts';
import type { ScenicFeature } from '../src/features.ts';
import type { Providers, RoutedPath, RouteOptions, Router } from '../src/planner.ts';
import type { HourlyForecast } from '../src/conditions.ts';
import type { Zone } from '../src/advisories.ts';

export const SIENA = { lat: 43.3188, lon: 11.3308 };
export const MONTALCINO = { lat: 43.0586, lon: 11.4893 };
export const PIENZA = { lat: 43.0766, lon: 11.6787 };
export const SAN_QUIRICO = { lat: 43.0583, lon: 11.6050 };

/** Straight line between points, with gentle wiggles so bends > 0 on "scenic" roads. */
export function wigglyLine(points: LatLon[], wiggleKm = 0): LatLon[] {
  const out: LatLon[] = [];
  for (let i = 1; i < points.length; i++) {
    const seg = resample([points[i - 1], points[i]], 0.2);
    seg.forEach((p, j) => {
      if (i > 1 && j === 0) return;
      const w = wiggleKm && j > 0 && j < seg.length - 1 ? Math.sin(j * 0.9) * (wiggleKm / 111) : 0;
      out.push({ lat: p.lat + w, lon: p.lon + w });
    });
  }
  return out;
}

export class FakeRouter implements Router {
  readonly name = 'fake';
  readonly supportsScenic: boolean;
  readonly attribution = 'Fake router';
  calls: { points: LatLon[]; opts: RouteOptions }[] = [];
  readonly extra: (points: LatLon[], opts: RouteOptions) => Partial<RoutedPath>;
  constructor(supportsScenic = true, extra: (points: LatLon[], opts: RouteOptions) => Partial<RoutedPath> = () => ({})) {
    this.supportsScenic = supportsScenic;
    this.extra = extra;
  }
  async route(points: LatLon[], opts: RouteOptions): Promise<RoutedPath> {
    this.calls.push({ points, opts });
    const scenic = opts.profile === 'scenic';
    const line = wigglyLine(points, scenic ? 0.05 : 0);
    const km = lineLengthKm(line) * 1.2;
    const speed = scenic ? 55 : 75;
    return { line, km, minutes: (km / speed) * 60, motorwayKm: scenic ? 0 : km * 0.3, ...this.extra(points, opts) };
  }
}

export const VAL_D_ORCIA_FEATURES: ScenicFeature[] = [
  { id: 'n/1', lat: 43.0766, lon: 11.6787, type: 'hilltop_village', weight: 2, name: 'Pienza' },
  { id: 'n/2', lat: 43.0700, lon: 11.6600, type: 'viewpoint', weight: 5, name: 'Belvedere Val d\'Orcia' },
  { id: 'n/3', lat: 43.0583, lon: 11.6050, type: 'hilltop_village', weight: 2, name: 'San Quirico d\'Orcia' },
  { id: 'n/4', lat: 43.0650, lon: 11.6300, type: 'cypress', weight: 3, name: 'Cipressi di San Quirico' },
  { id: 'n/5', lat: 43.0900, lon: 11.6500, type: 'vineyard', weight: 1.5, name: '' },
  { id: 'n/6', lat: 43.0620, lon: 11.6400, type: 'castle', weight: 3, name: 'Torre' },
];

export function forecast(start: Date, hours: number, f: Partial<HourlyForecast> = {}): HourlyForecast[] {
  return Array.from({ length: hours }, (_, i) => ({
    time: new Date(start.getTime() + i * 3600000).toISOString(),
    cloud: 10, lowCloud: 5, precipProb: 0, precipMm: 0, visibilityKm: 30, fog: false, ...f,
  }));
}

export function squareZone(center: LatLon, halfKm: number, props: Zone['properties']): Zone {
  const dLat = halfKm / 111, dLon = halfKm / (111 * Math.cos((center.lat * Math.PI) / 180));
  const ring = [
    [center.lon - dLon, center.lat - dLat], [center.lon + dLon, center.lat - dLat],
    [center.lon + dLon, center.lat + dLat], [center.lon - dLon, center.lat + dLat], [center.lon - dLon, center.lat - dLat],
  ];
  return { type: 'Feature', properties: props, geometry: { type: 'Polygon', coordinates: [ring] } };
}

export function fakeProviders(over: Partial<Providers> = {}): Providers & { router: FakeRouter } {
  return {
    router: new FakeRouter(),
    features: { features: async () => VAL_D_ORCIA_FEATURES, attribution: 'Fake features' },
    elevation: { elevations: async (pts) => pts.map((_, i) => 300 + 150 * Math.sin(i / 8)) },
    weather: { hourly: async (pts) => pts.map(() => forecast(new Date('2026-06-01T05:00:00Z'), 30)) },
    ...over,
  } as Providers & { router: FakeRouter };
}
