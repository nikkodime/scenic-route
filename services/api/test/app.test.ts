import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { generateKeyPair, SignJWT, exportJWK, createLocalJWKSet } from 'jose';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.ts';
import { MemoryStore } from '../src/store/memory.ts';
import { PgStore } from '../src/store/postgres.ts';
import type { Store } from '../src/store/store.ts';
import { fakeProviders, SIENA } from '../../../packages/core/test/fixtures.ts';

const config = { JWT_SECRET: 'test-secret-test-secret', CORS_ORIGINS: ['http://localhost:5173'], APPLE_BUNDLE_IDS: ['app.scenicroute.ios'], TIME_ZONE: 'Europe/Rome', LOG_LEVEL: 'silent' };
const geocoder = { search: async (q: string) => [{ lat: 43.07, lon: 11.67, label: `${q}, Toscana, Italia`, kind: 'town' }] };

const { publicKey, privateKey } = await generateKeyPair('RS256');
const jwk = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256' };
const appleKeys = createLocalJWKSet({ keys: [jwk] });
const appleToken = (sub: string, aud = 'app.scenicroute.ios') =>
  new SignJWT({}).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer('https://appleid.apple.com').setAudience(aud).setSubject(sub).setIssuedAt().setExpirationTime('10m').sign(privateKey);

// Run the same suite against the memory store and, when DATABASE_URL is set, Postgres.
const stores: [string, () => Promise<Store>][] = [['memory', async () => new MemoryStore()]];
if (process.env.DATABASE_URL) stores.push(['postgres', async () => { const s = new PgStore(process.env.DATABASE_URL!); await s.migrate(); return s; }]);

for (const [name, makeStore] of stores) {
  let app: FastifyInstance;
  let store: Store;
  before(async () => {
    store = await makeStore();
    app = await buildApp({ config, providers: fakeProviders(), geocoder, store, appleKeys });
  });
  after(async () => { await app.close(); await store.close(); });

  const anon = async () => (await app.inject({ method: 'POST', url: '/v1/auth/anonymous' })).json() as { token: string; userId: string };
  const trip = (over = {}) => ({ id: randomUUID(), name: 'Val d\'Orcia loop', days: [{ origin: SIENA, destination: { lat: 43.07, lon: 11.67, label: 'Pienza' } }], createdAt: '2026-11-17T10:00:00Z', updatedAt: '2026-11-17T10:00:00Z', ...over });

  test(`[${name}] health and regions`, async () => {
    const h = await app.inject('/healthz');
    assert.equal(h.statusCode, 200);
    assert.equal(h.json().router, 'fake');
    assert.ok((await app.inject('/v1/regions')).json().regions.some((r: { id: string }) => r.id === 'it-tuscany'));
  });

  test(`[${name}] plan returns ranked routes; bad input is a 400 with field paths`, async () => {
    const r = await app.inject({ method: 'POST', url: '/v1/plan', payload: { origin: SIENA, destination: { lat: 42.95, lon: 11.85 }, extraMinutes: 60, departAt: '2026-06-01T07:00:00Z' } });
    assert.equal(r.statusCode, 200, r.body);
    const body = r.json();
    assert.ok(body.routes.length >= 2);
    assert.equal(body.routes[0].label, 'Most scenic');
    const bad = await app.inject({ method: 'POST', url: '/v1/plan', payload: { origin: { lat: 200, lon: 0 } } });
    assert.equal(bad.statusCode, 400);
    assert.ok(bad.json().issues.some((i: { path: string }) => i.path === 'origin.lat'));
  });

  test(`[${name}] geocode validates and answers`, async () => {
    assert.equal((await app.inject('/v1/geocode?q=P')).statusCode, 400);
    const r = await app.inject('/v1/geocode?q=Pienza&lat=43.3&lon=11.3');
    assert.match(r.json().results[0].label, /Pienza/);
  });

  test(`[${name}] trips need auth; CRUD with last-writer-wins`, async () => {
    assert.equal((await app.inject('/v1/trips')).statusCode, 401);
    assert.equal((await app.inject({ url: '/v1/trips', headers: { authorization: 'Bearer nope' } })).statusCode, 401);
    const { token } = await anon();
    const h = { authorization: `Bearer ${token}` };
    const t = trip();
    assert.equal((await app.inject({ method: 'PUT', url: `/v1/trips/${t.id}`, headers: h, payload: t })).statusCode, 200);
    assert.equal((await app.inject({ method: 'PUT', url: `/v1/trips/${randomUUID()}`, headers: h, payload: t })).statusCode, 400);
    const older = await app.inject({ method: 'PUT', url: `/v1/trips/${t.id}`, headers: h, payload: { ...t, name: 'old', updatedAt: '2026-11-17T09:00:00Z' } });
    assert.equal(older.statusCode, 409);
    assert.equal(older.json().name, t.name);
    const newer = { ...t, name: 'Renamed', updatedAt: '2026-11-17T11:00:00Z' };
    assert.equal((await app.inject({ method: 'PUT', url: `/v1/trips/${t.id}`, headers: h, payload: newer })).statusCode, 200);
    assert.equal((await app.inject({ url: `/v1/trips/${t.id}`, headers: h })).json().name, 'Renamed');
    assert.equal((await app.inject({ url: '/v1/trips', headers: h })).json().trips.length, 1);
    assert.equal((await app.inject({ method: 'DELETE', url: `/v1/trips/${t.id}`, headers: h })).statusCode, 204);
    assert.equal((await app.inject({ url: `/v1/trips/${t.id}`, headers: h })).statusCode, 404);
    // Another user cannot see it
    const other = await anon();
    assert.equal((await app.inject({ url: '/v1/trips', headers: { authorization: `Bearer ${other.token}` } })).json().trips.length, 0);
  });

  test(`[${name}] sync: push, pull by cursor, reject stale, tombstones travel`, async () => {
    const { token } = await anon();
    const h = { authorization: `Bearer ${token}` };
    const a = trip({ name: 'A' }), b = trip({ name: 'B' });
    const rating = { id: randomUUID(), thumbs: 'up', modelVersion: '2026.11.1', score: 77, parts: { scenery: 80, views: null, relief: 60, bends: 50, variety: 75, motorwayPct: 0, urbanPct: 0 }, polyline: '_p~iF~ps|U', createdAt: '2026-11-17T12:00:00Z' };
    const first = (await app.inject({ method: 'POST', url: '/v1/sync', headers: h, payload: { cursor: null, changes: { trips: [a, b], ratings: [rating] } } })).json();
    assert.equal(first.changes.trips.length, 2);
    assert.equal(first.changes.ratings.length, 1);
    assert.deepEqual(first.rejected, []);
    // Second device: nothing new since cursor
    const idle = (await app.inject({ method: 'POST', url: '/v1/sync', headers: h, payload: { cursor: first.cursor } })).json();
    assert.equal(idle.changes.trips.length, 0);
    assert.equal(idle.cursor, first.cursor);
    // Stale edit is rejected; newer delete wins and syncs out
    const stale = (await app.inject({ method: 'POST', url: '/v1/sync', headers: h, payload: { cursor: first.cursor, changes: { trips: [{ ...a, name: 'stale', updatedAt: '2026-11-16T10:00:00Z' }, { ...b, deleted: true, updatedAt: '2026-11-17T12:00:00Z' }] } } })).json();
    assert.deepEqual(stale.rejected, [a.id]);
    assert.deepEqual(stale.changes.trips.map((t: { id: string; deleted: boolean }) => [t.id, t.deleted]), [[b.id, true]]);
    // Re-sending the same rating is idempotent
    const again = (await app.inject({ method: 'POST', url: '/v1/sync', headers: h, payload: { cursor: stale.cursor, changes: { ratings: [rating] } } })).json();
    assert.equal(again.changes.ratings.length, 0);
  });

  test(`[${name}] Sign in with Apple links the device account and finds it again`, async () => {
    const { token, userId } = await anon();
    const sub = `apple-${randomUUID()}`;
    const linked = await app.inject({ method: 'POST', url: '/v1/auth/apple', headers: { authorization: `Bearer ${token}` }, payload: { identityToken: await appleToken(sub) } });
    assert.equal(linked.statusCode, 200, linked.body);
    assert.equal(linked.json().userId, userId);
    // New device, same Apple account → same user
    const again = await app.inject({ method: 'POST', url: '/v1/auth/apple', payload: { identityToken: await appleToken(sub) } });
    assert.equal(again.json().userId, userId);
    const me = await app.inject({ url: '/v1/me', headers: { authorization: `Bearer ${again.json().token}` } });
    assert.equal(me.json().apple, true);
    const wrongAud = await app.inject({ method: 'POST', url: '/v1/auth/apple', payload: { identityToken: await appleToken(sub, 'com.evil') } });
    assert.equal(wrongAud.statusCode, 401);
  });

  test(`[${name}] account deletion removes everything`, async () => {
    const { token } = await anon();
    const h = { authorization: `Bearer ${token}` };
    const t = trip();
    await app.inject({ method: 'PUT', url: `/v1/trips/${t.id}`, headers: h, payload: t });
    assert.equal((await app.inject({ method: 'DELETE', url: '/v1/me', headers: h })).statusCode, 204);
    assert.equal((await app.inject({ url: '/v1/trips', headers: h })).statusCode, 401);
  });
}
