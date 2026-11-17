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

/** Europe (incl. Canaries, Iceland, Cyprus, Turkey's west): minLon, minLat, maxLon, maxLat. */
export const EUROPE_BBOX = [-25, 27, 45, 72] as const;
const inEurope = (r: { lat: number; lon: number }) => r.lon >= EUROPE_BBOX[0] && r.lon <= EUROPE_BBOX[2] && r.lat >= EUROPE_BBOX[1] && r.lat <= EUROPE_BBOX[3];
/** Places people live in. They outrank a name match, because with lang=en "Firenze" comes back labelled "Florence". */
const POPULATED = new Set(['city', 'town', 'village', 'hamlet', 'municipality']);
/** Other destinations. They rank below a town of the same name ("Pisa" the province vs the city). */
const SETTLEMENT = new Set(['suburb', 'locality', 'administrative', 'island', 'peak', 'mountain_pass']);

/**
 * Drivers type town names. "Pisa" must be the city of Pisa, not a pizzeria called Pisa
 * or a street: put European settlements whose name matches the query first.
 */
export function rankPlaces(results: GeocodeResult[], q: string): GeocodeResult[] {
  const query = q.trim().toLowerCase();
  const score = (r: GeocodeResult) => {
    const name = r.label.split(',')[0].trim().toLowerCase();
    let s = 0;
    if (inEurope(r)) s += 4;
    if (name === query) s += 3;
    else if (name.startsWith(query)) s += 1;
    if (r.kind && POPULATED.has(r.kind)) s += 4;
    else if (r.kind && SETTLEMENT.has(r.kind)) s += 1;
    return s;
  };
  const europe = results.filter(inEurope);
  return (europe.length ? europe : results).map((r, i) => ({ r, i, s: score(r) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.r);
}

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
    u.searchParams.set('lang', ['en', 'de', 'fr', 'it'].includes(lang) ? lang : 'en');
    u.searchParams.set('limit', '10');
    u.searchParams.set('bbox', EUROPE_BBOX.join(','));
    // Location bias only when the device is actually in Europe (the iOS simulator defaults to California).
    if (near && inEurope(near)) { u.searchParams.set('lat', near.lat.toFixed(3)); u.searchParams.set('lon', near.lon.toFixed(3)); u.searchParams.set('location_bias_scale', '0.3'); }
    return cache.wrap(u.toString(), 24 * 3600_000, async () => rankPlaces(parsePhoton(await this.http.json(u.toString())), q).slice(0, 6));
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
    u.searchParams.set('limit', '10');
    u.searchParams.set('viewbox', EUROPE_BBOX.join(','));
    u.searchParams.set('bounded', '1');
    return cache.wrap(u.toString() + lang, 24 * 3600_000, async () => {
      const res = await this.http.json<{ lat: string; lon: string; display_name: string; type?: string; addresstype?: string }[]>(u.toString(), { headers: { 'Accept-Language': lang } });
      return rankPlaces(res.map((r) => ({ lat: +r.lat, lon: +r.lon, label: r.display_name, kind: r.addresstype ?? r.type })), q).slice(0, 6);
    });
  }
}
