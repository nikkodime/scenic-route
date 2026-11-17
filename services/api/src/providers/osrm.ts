// OSRM, as used by the prototype (demo server). Dev and tests only: no scenic profile, no ZTL avoidance.

import type { LatLon, RoutedPath, Router, RouteOptions } from '@scenic/core';
import type { Http } from '../http.ts';

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
  legs?: { steps?: { distance: number; intersections?: { classes?: string[] }[] }[] }[];
}

export function parseOsrmRoute(r: OsrmRoute): RoutedPath {
  let motorwayKm = 0, tollKm = 0, ferryKm = 0;
  for (const leg of r.legs ?? [])
    for (const step of leg.steps ?? []) {
      const classes = new Set((step.intersections ?? []).flatMap((x) => x.classes ?? []));
      if (classes.has('motorway')) motorwayKm += step.distance / 1000;
      if (classes.has('toll')) tollKm += step.distance / 1000;
      if (classes.has('ferry')) ferryKm += step.distance / 1000;
    }
  return { line: r.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })), km: r.distance / 1000, minutes: r.duration / 60, motorwayKm, tollKm, ferryKm };
}

export class OsrmRouter implements Router {
  readonly name = 'osrm';
  readonly supportsScenic = false;
  readonly attribution = 'Routing: OSRM';
  private http: Http;
  private base: string;
  constructor(http: Http, base: string) {
    this.http = http;
    this.base = base.replace(/\/$/, '');
  }
  private async get(points: LatLon[], alternatives: boolean): Promise<OsrmRoute[]> {
    const coords = points.map((p) => `${p.lon.toFixed(6)},${p.lat.toFixed(6)}`).join(';');
    const json = await this.http.json<{ code: string; routes?: OsrmRoute[] }>(`${this.base}/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true${alternatives ? '&alternatives=3' : ''}`, { timeoutMs: 15000 });
    if (json.code !== 'Ok' || !json.routes?.length) throw new Error('No route found');
    return json.routes;
  }
  async route(points: LatLon[], _opts: RouteOptions): Promise<RoutedPath> {
    return parseOsrmRoute((await this.get(points, false))[0]);
  }
  async alternatives(points: LatLon[], _opts: RouteOptions): Promise<RoutedPath[]> {
    if (points.length !== 2) return [];
    return (await this.get(points, true)).slice(1).map(parseOsrmRoute);
  }
}
