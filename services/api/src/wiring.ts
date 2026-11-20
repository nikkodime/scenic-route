// Build real providers from configuration.

import type { Providers } from '@scenic/core';
import type { Config } from './config.ts';
import { makeHttp } from './http.ts';
import { GraphHopperRouter } from './providers/graphhopper.ts';
import { OsrmRouter } from './providers/osrm.ts';
import { OverpassFeatures } from './providers/overpass.ts';
import { FileFeatures, LayeredFeatures } from './providers/features-file.ts';
import { OpenMeteoElevation } from './providers/elevation.ts';
import { HgtElevation } from './providers/dem.ts';
import { MetNoWeather, OpenMeteoWeather } from './providers/weather.ts';
import { FallbackGeocoder, NominatimGeocoder, PhotonGeocoder, type Geocoder } from './providers/geocode.ts';
import { loadZones } from './providers/zones.ts';
import { FileStops } from './providers/stops-file.ts';
import { CommonsPhotos, type PhotoSource } from './providers/photos.ts';
import { MemoryStore } from './store/memory.ts';
import { PgStore } from './store/postgres.ts';
import type { Store } from './store/store.ts';

export function makeProviders(c: Config): { providers: Providers; geocoder: Geocoder; photos?: PhotoSource } {
  const http = makeHttp({ userAgent: c.USER_AGENT });
  const zones = loadZones(c.ZONES_DIR);
  const shipped = FileFeatures.load(c.FEATURES_DIR);
  return {
    providers: {
      router: c.ROUTER === 'graphhopper' ? new GraphHopperRouter(http, c.GRAPHHOPPER_URL, c.GRAPHHOPPER_PROFILE) : new OsrmRouter(http, c.OSRM_URL),
      features: new LayeredFeatures(shipped, c.OVERPASS === 'live' ? new OverpassFeatures(http, c.OVERPASS_URLS) : undefined),
      elevation:
        c.ELEVATION === 'hgt' ? new HgtElevation(c.DEM_DIR, new OpenMeteoElevation(http, c.OPEN_METEO_API_KEY))
        : c.ELEVATION === 'open-meteo' ? new OpenMeteoElevation(http, c.OPEN_METEO_API_KEY) : undefined,
      weather: c.WEATHER === 'metno' ? new MetNoWeather(http) : c.WEATHER === 'open-meteo' ? new OpenMeteoWeather(http, c.OPEN_METEO_API_KEY) : undefined,
      zones: (b) => zones.inBBox(b),
      stops: FileStops.load(c.STOPS_DIR),
    },
    photos: c.PHOTOS === 'commons' ? new CommonsPhotos(http) : undefined,
    geocoder: c.GEOCODER === 'photon' ? new FallbackGeocoder(new PhotonGeocoder(http, c.PHOTON_URL), new NominatimGeocoder(http, c.NOMINATIM_URL)) : new NominatimGeocoder(http, c.NOMINATIM_URL),
  };
}

export async function makeStore(c: Config): Promise<Store> {
  if (!c.DATABASE_URL) return new MemoryStore();
  const s = new PgStore(c.DATABASE_URL);
  await s.migrate();
  return s;
}
