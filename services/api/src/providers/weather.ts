// Hourly forecasts for points along a route.
// MET Norway (CC BY 4.0, commercial use allowed with attribution) is the production default.

import type { HourlyForecast, LatLon, WeatherSource } from '@scenic/core';
import type { Http } from '../http.ts';
import { TtlCache } from '../cache.ts';

const round = (p: LatLon, d = 2) => ({ lat: +p.lat.toFixed(d), lon: +p.lon.toFixed(d) });

interface MetTimestep {
  time: string;
  data: {
    instant: { details: Record<string, number> };
    next_1_hours?: { details?: Record<string, number> };
    next_6_hours?: { details?: Record<string, number> };
  };
}

export function parseMetNo(json: { properties?: { timeseries?: MetTimestep[] } }): HourlyForecast[] {
  return (json.properties?.timeseries ?? []).map((t) => {
    const d = t.data.instant.details;
    const next = t.data.next_1_hours?.details ?? t.data.next_6_hours?.details ?? {};
    const fogFrac = d.fog_area_fraction ?? 0;
    return {
      time: t.time,
      cloud: d.cloud_area_fraction ?? 0,
      lowCloud: d.cloud_area_fraction_low ?? 0,
      precipProb: next.probability_of_precipitation ?? ((next.precipitation_amount ?? 0) > 0.2 ? 60 : 0),
      precipMm: next.precipitation_amount ?? 0,
      visibilityKm: null,
      fog: fogFrac >= 50,
    };
  });
}

export class MetNoWeather implements WeatherSource {
  readonly attribution = 'Weather: MET Norway (CC BY 4.0)';
  private cache = new TtlCache<HourlyForecast[]>(5000);
  private http: Http;
  constructor(http: Http) {
    this.http = http;
  }
  private one(p: LatLon): Promise<HourlyForecast[]> {
    const r = round(p);
    return this.cache.wrap(`${r.lat},${r.lon}`, 30 * 60_000, async () =>
      parseMetNo(await this.http.json(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${r.lat}&lon=${r.lon}`)),
    );
  }
  hourly(points: LatLon[]): Promise<HourlyForecast[][]> {
    return Promise.all(points.map((p) => this.one(p)));
  }
}

interface OmHourly {
  time: string[];
  cloud_cover: number[];
  cloud_cover_low: number[];
  precipitation_probability: number[];
  precipitation: number[];
  visibility: number[];
}

export function parseOpenMeteo(h: OmHourly): HourlyForecast[] {
  return h.time.map((t, i) => ({
    time: t.length === 16 ? `${t}:00Z` : t,
    cloud: h.cloud_cover[i] ?? 0,
    lowCloud: h.cloud_cover_low[i] ?? 0,
    precipProb: h.precipitation_probability[i] ?? 0,
    precipMm: h.precipitation[i] ?? 0,
    visibilityKm: h.visibility[i] != null ? h.visibility[i] / 1000 : null,
    fog: h.visibility[i] != null && h.visibility[i] < 1000,
  }));
}

/** Open-Meteo: multiple points in one call. Free tier is non-commercial; pass an API key in production. */
export class OpenMeteoWeather implements WeatherSource {
  readonly attribution = 'Weather: Open-Meteo (CC BY 4.0)';
  private http: Http;
  private apiKey?: string;
  constructor(http: Http, apiKey?: string) {
    this.http = http;
    this.apiKey = apiKey;
  }
  async hourly(points: LatLon[]): Promise<HourlyForecast[][]> {
    const u = new URL(this.apiKey ? 'https://customer-api.open-meteo.com/v1/forecast' : 'https://api.open-meteo.com/v1/forecast');
    u.searchParams.set('latitude', points.map((p) => p.lat.toFixed(3)).join(','));
    u.searchParams.set('longitude', points.map((p) => p.lon.toFixed(3)).join(','));
    u.searchParams.set('hourly', 'cloud_cover,cloud_cover_low,precipitation_probability,precipitation,visibility');
    u.searchParams.set('forecast_days', '3');
    u.searchParams.set('timezone', 'GMT');
    if (this.apiKey) u.searchParams.set('apikey', this.apiKey);
    const json = await this.http.json<any>(u.toString());
    const arr = Array.isArray(json) ? json : [json];
    return arr.map((x: { hourly: OmHourly }) => parseOpenMeteo(x.hourly));
  }
}
