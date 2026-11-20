// Elevation for route relief. Open-Meteo serves Copernicus GLO-90; fine for development.
// Production: self-hosted Copernicus GLO-30 tiles (pipeline, M1).

import type { ElevationSource, LatLon } from '@scenic/core';
import type { Http } from '../http.ts';
import { TtlCache } from '../cache.ts';

export class OpenMeteoElevation implements ElevationSource {
  readonly attribution = 'Elevation: Copernicus DEM via Open-Meteo';
  private cache = new TtlCache<number | null>(200_000);
  private http: Http;
  private apiKey?: string;
  constructor(http: Http, apiKey?: string) {
    this.http = http;
    this.apiKey = apiKey;
  }
  async elevations(points: LatLon[]): Promise<(number | null)[]> {
    // ~500 m grid: plenty for relief, and nearby plans share cache entries (the free tier is rate-limited).
    const key = (p: LatLon) => `${(Math.round(p.lat * 200) / 200).toFixed(3)},${(Math.round(p.lon * 200) / 200).toFixed(3)}`;
    const missing = [...new Set(points.map(key).filter((k) => this.cache.get(k) === undefined))];
    for (let i = 0; i < missing.length; i += 100) {
      const chunk = missing.slice(i, i + 100);
      const u = new URL(this.apiKey ? 'https://customer-api.open-meteo.com/v1/elevation' : 'https://api.open-meteo.com/v1/elevation');
      u.searchParams.set('latitude', chunk.map((k) => k.split(',')[0]).join(','));
      u.searchParams.set('longitude', chunk.map((k) => k.split(',')[1]).join(','));
      if (this.apiKey) u.searchParams.set('apikey', this.apiKey);
      const json = await this.http.json<{ elevation: number[] }>(u.toString());
      chunk.forEach((k, j) => this.cache.set(k, Number.isFinite(json.elevation[j]) ? json.elevation[j] : null, 365 * 86400_000));
    }
    return points.map((p) => this.cache.get(key(p)) ?? null);
  }
}
