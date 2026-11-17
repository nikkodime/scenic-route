// All runtime configuration comes from the environment. Defaults are for local development.

import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const list = z.string().transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean));

const Env = z.object({
  PORT: z.coerce.number().default(8787),
  HOST: z.string().default('0.0.0.0'),
  /** graphhopper (production) | osrm (prototype demo server, dev only) */
  ROUTER: z.enum(['graphhopper', 'osrm']).default('osrm'),
  GRAPHHOPPER_URL: z.string().default('http://localhost:8989'),
  GRAPHHOPPER_PROFILE: z.string().default('car'),
  OSRM_URL: z.string().default('https://router.project-osrm.org'),
  OVERPASS_URLS: list.default('https://overpass-api.de/api/interpreter,https://overpass.private.coffee/api/interpreter,https://maps.mail.ru/osm/tools/overpass/api/interpreter,https://overpass.kumi.systems/api/interpreter'),
  /** open-meteo (dev only: free tier is non-commercial) | none */
  ELEVATION: z.enum(['open-meteo', 'none']).default('open-meteo'),
  /** metno (production, CC BY 4.0) | open-meteo (paid plan for production) | none */
  WEATHER: z.enum(['metno', 'open-meteo', 'none']).default('metno'),
  OPEN_METEO_API_KEY: z.string().optional(),
  /** photon (self-hosted in production) | nominatim (dev only, 1 req/s) */
  GEOCODER: z.enum(['photon', 'nominatim']).default('photon'),
  PHOTON_URL: z.string().default('https://photon.komoot.io'),
  NOMINATIM_URL: z.string().default('https://nominatim.openstreetmap.org'),
  ZONES_DIR: z.string().default(fileURLToPath(new URL('../../../infra/data/zones/', import.meta.url))),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default('dev-only-secret-change-me-please'),
  APPLE_BUNDLE_IDS: list.default('app.scenicroute.ios'),
  CORS_ORIGINS: list.default('http://localhost:5173,https://nikkodime.github.io'),
  USER_AGENT: z.string().default('scenic-route/0.1 (+https://github.com/nikkodime/scenic-route)'),
  TIME_ZONE: z.string().default('Europe/Rome'),
  LOG_LEVEL: z.string().default('info'),
});

export type Config = z.infer<typeof Env>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const c = Env.parse(env);
  if (env.NODE_ENV === 'production' && c.JWT_SECRET.startsWith('dev-only')) throw new Error('Set JWT_SECRET in production');
  return c;
}
