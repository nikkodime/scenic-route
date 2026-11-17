// HTTP API. Everything external is injected, so tests run the real app with fake providers.

import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { ZodError, z } from 'zod';
import type { JWTVerifyGetKey } from 'jose';
import {
  PlanError, PlanRequestSchema, ExploreRequestSchema, exploreFrom, RatingSchema, SyncRequestSchema, TripSchema, planRoutes, type Providers,
} from '@scenic/core';
import type { Config } from './config.ts';
import type { Geocoder } from './providers/geocode.ts';
import type { Store } from './store/store.ts';
import { signToken, verifyAppleToken, verifyToken } from './auth.ts';

export interface AppDeps {
  config: Pick<Config, 'JWT_SECRET' | 'CORS_ORIGINS' | 'APPLE_BUNDLE_IDS' | 'TIME_ZONE' | 'LOG_LEVEL'>;
  providers: Providers;
  geocoder: Geocoder;
  store: Store;
  appleKeys?: JWTVerifyGetKey;
  logger?: boolean;
}

class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const REGIONS = [
  { id: 'it-tuscany', name: 'Tuscany', bbox: [42.24, 9.68, 44.47, 12.37], status: 'field-test', packs: [] as string[] },
  { id: 'it', name: 'Italy', bbox: [35.49, 6.62, 47.09, 18.52], status: 'planned', packs: [] as string[] },
];

export async function buildApp(deps: AppDeps): Promise<FastifyInstance> {
  const { config, providers, geocoder, store } = deps;
  const app = Fastify({ logger: deps.logger ? { level: config.LOG_LEVEL } : false, bodyLimit: 2 * 1024 * 1024, trustProxy: true });

  await app.register(cors, { origin: config.CORS_ORIGINS, methods: ['GET', 'POST', 'PUT', 'DELETE'] });
  await app.register(rateLimit, { max: 300, timeWindow: '1 minute' });

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) return reply.status(400).send({ error: 'invalid_request', issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) });
    if (err instanceof HttpError) return reply.status(err.status).send({ error: err.message });
    if (err instanceof PlanError) return reply.status(err.status).send({ error: err.message });
    const status = (err as { statusCode?: number }).statusCode;
    if (status && status < 500) return reply.status(status).send({ error: (err as Error).message });
    req.log.error(err);
    return reply.status(500).send({ error: 'Something went wrong. Please try again.' });
  });

  const userId = (req: FastifyRequest, required = true): string | null => {
    const h = req.headers.authorization;
    const sub = h?.startsWith('Bearer ') ? verifyToken(h.slice(7), config.JWT_SECRET) : null;
    if (!sub && required) throw new HttpError(401, 'Sign in required');
    return sub;
  };
  const requireUser = async (req: FastifyRequest) => {
    const id = userId(req)!;
    const user = await store.getUser(id);
    if (!user) throw new HttpError(401, 'Unknown account');
    return user;
  };

  app.get('/healthz', async () => ({ ok: true, router: providers.router.name, scenic: providers.router.supportsScenic, weather: !!providers.weather, time: new Date().toISOString() }));

  app.get('/v1/geocode', async (req) => {
    const q = z.object({ q: z.string().trim().min(2).max(200), lang: z.string().max(5).optional(), lat: z.coerce.number().optional(), lon: z.coerce.number().optional() }).parse(req.query);
    const near = q.lat != null && q.lon != null ? { lat: q.lat, lon: q.lon } : undefined;
    return { results: await geocoder.search(q.q, { lang: q.lang ?? req.headers['accept-language']?.slice(0, 2), near }) };
  });

  app.post('/v1/plan', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (req) => {
    const body = PlanRequestSchema.parse(req.body);
    return planRoutes(body, providers, { timeZone: config.TIME_ZONE, log: (msg, extra) => req.log.warn({ extra: String(extra) }, msg) });
  });

  app.post('/v1/explore', { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, async (req) => {
    const body = ExploreRequestSchema.parse(req.body);
    return exploreFrom(body, providers, { log: (msg, extra) => req.log.warn({ extra: String(extra) }, msg) });
  });

  app.get('/v1/regions', async () => ({ regions: REGIONS }));

  // Accounts
  app.post('/v1/auth/anonymous', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async () => {
    const user = await store.createUser();
    return { userId: user.id, token: signToken(user.id, config.JWT_SECRET) };
  });

  app.post('/v1/auth/apple', async (req) => {
    const { identityToken } = z.object({ identityToken: z.string().min(20) }).parse(req.body);
    let sub: string;
    try {
      sub = await verifyAppleToken(identityToken, config.APPLE_BUNDLE_IDS, deps.appleKeys);
    } catch {
      throw new HttpError(401, 'Apple sign-in could not be verified');
    }
    const current = userId(req, false);
    const base = current && (await store.getUser(current)) ? current : (await store.createUser()).id;
    const user = await store.linkApple(base, sub);
    return { userId: user.id, token: signToken(user.id, config.JWT_SECRET), linked: true };
  });

  app.get('/v1/me', async (req) => {
    const u = await requireUser(req);
    return { userId: u.id, apple: !!u.appleSub, createdAt: u.createdAt };
  });

  app.delete('/v1/me', async (req, reply) => {
    const u = await requireUser(req);
    await store.deleteUser(u.id);
    return reply.status(204).send();
  });

  // Trips
  app.get('/v1/trips', async (req) => ({ trips: await store.listTrips((await requireUser(req)).id) }));

  app.get('/v1/trips/:id', async (req) => {
    const u = await requireUser(req);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const t = await store.getTrip(u.id, id);
    if (!t) throw new HttpError(404, 'Trip not found');
    return t;
  });

  app.put('/v1/trips/:id', async (req, reply) => {
    const u = await requireUser(req);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const trip = TripSchema.parse(req.body);
    if (trip.id !== id) throw new HttpError(400, 'Trip id does not match the URL');
    const r = await store.putTrip(u.id, trip);
    return reply.status(r.applied ? 200 : 409).send(r.trip);
  });

  app.delete('/v1/trips/:id', async (req, reply) => {
    const u = await requireUser(req);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const t = await store.getTrip(u.id, id);
    if (!t) throw new HttpError(404, 'Trip not found');
    await store.putTrip(u.id, { ...t, deleted: true, updatedAt: new Date(Math.max(Date.now(), Date.parse(t.updatedAt) + 1)).toISOString() });
    return reply.status(204).send();
  });

  // Sync and ratings
  app.post('/v1/sync', async (req) => {
    const u = await requireUser(req);
    const body = SyncRequestSchema.parse(req.body);
    const r = await store.sync(u.id, body.cursor, body.changes.trips, body.changes.ratings);
    return { cursor: r.cursor, changes: { trips: r.trips, ratings: r.ratings }, rejected: r.rejected };
  });

  app.post('/v1/ratings', async (req, reply) => {
    const u = await requireUser(req);
    const { ratings } = z.object({ ratings: z.array(RatingSchema).min(1).max(100) }).parse(req.body);
    await store.addRatings(u.id, ratings);
    return reply.status(201).send({ stored: ratings.length });
  });

  return app;
}
