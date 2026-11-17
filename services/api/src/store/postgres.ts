// Postgres store. Schema is created/migrated on start (idempotent, versioned).

import pg from 'pg';
import type { Rating, Trip } from '@scenic/core';
import { clampTime, type Store, type SyncResult, type User } from './store.ts';

const MIGRATIONS: string[] = [
  `CREATE SEQUENCE IF NOT EXISTS sync_seq;
   CREATE TABLE IF NOT EXISTS users (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     apple_sub text UNIQUE,
     created_at timestamptz NOT NULL DEFAULT now()
   );
   CREATE TABLE IF NOT EXISTS trips (
     user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     id uuid NOT NULL,
     data jsonb NOT NULL,
     updated_at timestamptz NOT NULL,
     deleted boolean NOT NULL DEFAULT false,
     seq bigint NOT NULL DEFAULT nextval('sync_seq'),
     PRIMARY KEY (user_id, id)
   );
   CREATE INDEX IF NOT EXISTS trips_user_seq ON trips (user_id, seq);
   CREATE TABLE IF NOT EXISTS ratings (
     id uuid PRIMARY KEY,
     user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     data jsonb NOT NULL,
     model_version text NOT NULL,
     thumbs text NOT NULL,
     seq bigint NOT NULL DEFAULT nextval('sync_seq'),
     created_at timestamptz NOT NULL DEFAULT now()
   );
   CREATE INDEX IF NOT EXISTS ratings_user_seq ON ratings (user_id, seq);`,
];

const toUser = (r: any): User => ({ id: r.id, appleSub: r.apple_sub, createdAt: new Date(r.created_at).toISOString() });

export class PgStore implements Store {
  readonly pool: pg.Pool;
  constructor(url: string) {
    this.pool = new pg.Pool({ connectionString: url, max: 10 });
  }

  async migrate() {
    const c = await this.pool.connect();
    try {
      await c.query('SELECT pg_advisory_lock(424242)');
      await c.query('CREATE TABLE IF NOT EXISTS schema_version (v int NOT NULL)');
      const { rows } = await c.query('SELECT coalesce(max(v), 0) AS v FROM schema_version');
      for (let v = rows[0].v; v < MIGRATIONS.length; v++) {
        await c.query('BEGIN');
        await c.query(MIGRATIONS[v]);
        await c.query('INSERT INTO schema_version (v) VALUES ($1)', [v + 1]);
        await c.query('COMMIT');
      }
    } catch (e) {
      await c.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      await c.query('SELECT pg_advisory_unlock(424242)').catch(() => {});
      c.release();
    }
  }

  async createUser() {
    const { rows } = await this.pool.query('INSERT INTO users DEFAULT VALUES RETURNING *');
    return toUser(rows[0]);
  }
  async getUser(id: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] ? toUser(rows[0]) : null;
  }
  async linkApple(userId: string, appleSub: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE apple_sub = $1', [appleSub]);
    if (rows[0]) return toUser(rows[0]);
    const up = await this.pool.query('UPDATE users SET apple_sub = $2 WHERE id = $1 RETURNING *', [userId, appleSub]);
    if (!up.rows[0]) throw new Error('unknown user');
    return toUser(up.rows[0]);
  }
  async deleteUser(id: string) {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
  async listTrips(userId: string) {
    const { rows } = await this.pool.query('SELECT data FROM trips WHERE user_id = $1 AND NOT deleted ORDER BY updated_at DESC', [userId]);
    return rows.map((r) => r.data as Trip);
  }
  async getTrip(userId: string, id: string) {
    const { rows } = await this.pool.query('SELECT data FROM trips WHERE user_id = $1 AND id = $2 AND NOT deleted', [userId, id]);
    return (rows[0]?.data as Trip) ?? null;
  }
  async putTrip(userId: string, incoming: Trip, client: pg.Pool | pg.PoolClient = this.pool) {
    const trip = clampTime(incoming);
    // Upsert only when strictly newer: last writer wins, atomically.
    const { rows } = await client.query(
      `INSERT INTO trips (user_id, id, data, updated_at, deleted) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at, deleted = EXCLUDED.deleted, seq = nextval('sync_seq')
       WHERE trips.updated_at < EXCLUDED.updated_at
       RETURNING data`,
      [userId, trip.id, trip, trip.updatedAt, trip.deleted],
    );
    if (rows[0]) return { applied: true, trip };
    const cur = await client.query('SELECT data FROM trips WHERE user_id = $1 AND id = $2', [userId, trip.id]);
    return { applied: false, trip: cur.rows[0].data as Trip };
  }
  async addRatings(userId: string, ratings: Rating[], client: pg.Pool | pg.PoolClient = this.pool) {
    for (const r of ratings)
      await client.query('INSERT INTO ratings (id, user_id, data, model_version, thumbs) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [r.id, userId, r, r.modelVersion, r.thumbs]);
  }
  async sync(userId: string, cursor: number | null, trips: Trip[], ratings: Rating[]): Promise<SyncResult> {
    const c = await this.pool.connect();
    try {
      await c.query('BEGIN');
      const rejected: string[] = [];
      for (const t of trips) {
        const r = await this.putTrip(userId, t, c);
        if (!r.applied && Date.parse(r.trip.updatedAt) > Date.parse(t.updatedAt)) rejected.push(t.id);
      }
      await this.addRatings(userId, ratings, c);
      await c.query('COMMIT');
      const since = cursor ?? 0;
      const [tr, ra, seq] = await Promise.all([
        this.pool.query('SELECT data, seq FROM trips WHERE user_id = $1 AND seq > $2 ORDER BY seq', [userId, since]),
        this.pool.query('SELECT data, seq FROM ratings WHERE user_id = $1 AND seq > $2 ORDER BY seq', [userId, since]),
        this.pool.query(`SELECT greatest(
            coalesce((SELECT max(seq) FROM trips WHERE user_id = $1), 0),
            coalesce((SELECT max(seq) FROM ratings WHERE user_id = $1), 0), $2::bigint) AS cursor`, [userId, since]),
      ]);
      return { cursor: Number(seq.rows[0].cursor), trips: tr.rows.map((r) => r.data), ratings: ra.rows.map((r) => r.data), rejected };
    } catch (e) {
      await c.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      c.release();
    }
  }
  async close() {
    await this.pool.end();
  }
}
