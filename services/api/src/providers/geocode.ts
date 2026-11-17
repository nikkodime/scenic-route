// Place search. Photon (OSM-based, self-hostable, no strict rate limit) in production; Nominatim for dev.

import type { GeocodeResult } from '@scenic/core';
import type { Http } from '../http.ts';
import { TtlCache } from '../cache.ts';

export interface Geocoder {
  search(q: string, opts: { lang?: string; near?: { lat: number; lon: number } }): Promise<GeocodeResult[]>;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: { name?: string; city?: string; county?: string; state?: string; country?: string; osm_value?: string; type?: string };
}

export function parsePhoton(json: { features?: PhotonFeature[] }): GeocodeResult[] {
  return (json.features ?? []).map((f) => {
    const p = f.properties;
    const parts = [p.name, p.city !== p.name ? p.city : undefined, p.county, p.state, p.country].filter(Boolean);
    return { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], label: [...new Set(parts)].join(', '), kind: p.osm_value ?? p.type };
  });
}

const cache = new TtlCache<GeocodeResult[]>(2000);

export class PhotonGeocoder implements Geocoder {
  private http: Http;
  private base: string;
  constructor(http: Http, base: string) {
    this.http = http;
    this.base = base.replace(/\/$/, '');
  }
  search(q: string, { lang = 'en', near }: { lang?: string; near?: { lat: number; lon: number } } = {}) {
    const u = new URL(`${this.base}/api`);
    u.searchParams.set('q', q);
    u.searchParams.set('limit', '6');
    u.searchParams.set('lang', ['en', 'de', 'fr', 'it'].includes(lang) ? lang : 'en');
    if (near) { u.searchParams.set('lat', near.lat.toFixed(3)); u.searchParams.set('lon', near.lon.toFixed(3)); }
    return cache.wrap(u.toString(), 24 * 3600_000, async () => parsePhoton(await this.http.json(u.toString())));
  }
}

export class NominatimGeocoder implements Geocoder {
  private http: Http;
  private base: string;
  constructor(http: Http, base: string) {
    this.http = http;
    this.base = base.replace(/\/$/, '');
  }
  search(q: string, { lang = 'en' }: { lang?: string } = {}) {
    const u = new URL(`${this.base}/search`);
    u.searchParams.set('q', q);
    u.searchParams.set('format', 'jsonv2');
    u.searchParams.set('limit', '6');
    return cache.wrap(u.toString() + lang, 24 * 3600_000, async () => {
      const res = await this.http.json<{ lat: string; lon: string; display_name: string; type?: string }[]>(u.toString(), { headers: { 'Accept-Language': lang } });
      return res.map((r) => ({ lat: +r.lat, lon: +r.lon, label: r.display_name, kind: r.type }));
    });
  }
}
