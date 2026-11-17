// Build real providers from configuration.

import type { Providers } from '@scenic/core';
import type { Config } from './config.ts';
import { makeHttp } from './http.ts';
import { GraphHopperRouter } from './providers/graphhopper.ts';
import { OsrmRouter } from './providers/osrm.ts';
import { OverpassFeatures } from './providers/overpass.ts';
import { OpenMeteoElevation } from './providers/elevation.ts';
import { MetNoWeather, OpenMeteoWeather } from './providers/weather.ts';
import { NominatimGeocoder, PhotonGeocoder, type Geocoder } from './providers/geocode.ts';
import { loadZones } from './providers/zones.ts';
import { MemoryStore } from './store/memory.ts';
import { PgStore } from './store/postgres.ts';
import type { Store } from './store/store.ts';

export function makeProviders(c: Config): { providers: Providers; geocoder: Geocoder } {
  const http = makeHttp({ userAgent: c.USER_AGENT });
  const zones = loadZones(c.ZONES_DIR);
  return {
    providers: {
      router: c.ROUTER === 'graphhopper' ? new GraphHopperRouter(http, c.GRAPHHOPPER_URL, c.GRAPHHOPPER_PROFILE) : new OsrmRouter(http, c.OSRM_URL),
      features: new OverpassFeatures(http, c.OVERPASS_URLS),
      elevation: c.ELEVATION === 'open-meteo' ? new OpenMeteoElevation(http, c.OPEN_METEO_API_KEY) : undefined,
      weather: c.WEATHER === 'metno' ? new MetNoWeather(http) : c.WEATHER === 'open-meteo' ? new OpenMeteoWeather(http, c.OPEN_METEO_API_KEY) : undefined,
      zones: (b) => zones.inBBox(b),
    },
    geocoder: c.GEOCODER === 'photon' ? new PhotonGeocoder(http, c.PHOTON_URL) : new NominatimGeocoder(http, c.NOMINATIM_URL),
  };
}

export async function makeStore(c: Config): Promise<Store> {
  if (!c.DATABASE_URL) return new MemoryStore();
  const s = new PgStore(c.DATABASE_URL);
  await s.migrate();
  return s;
}
