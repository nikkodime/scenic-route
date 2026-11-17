// In-memory store for development and tests. Same semantics as the Postgres store.

import { randomUUID } from 'node:crypto';
import type { Rating, Trip } from '@scenic/core';
import { clampTime, type Store, type SyncResult, type User } from './store.ts';

export class MemoryStore implements Store {
  private users = new Map<string, User>();
  private trips = new Map<string, { userId: string; trip: Trip; seq: number }>();
  private ratings = new Map<string, { userId: string; rating: Rating; seq: number }>();
  private seq = 0;

  async createUser(): Promise<User> {
    const u = { id: randomUUID(), appleSub: null, createdAt: new Date().toISOString() };
    this.users.set(u.id, u);
    return u;
  }
  async getUser(id: string) {
    return this.users.get(id) ?? null;
  }
  async linkApple(userId: string, appleSub: string): Promise<User> {
    const existing = [...this.users.values()].find((u) => u.appleSub === appleSub);
    if (existing) return existing;
    const u = this.users.get(userId);
    if (!u) throw new Error('unknown user');
    u.appleSub = appleSub;
    return u;
  }
  async deleteUser(id: string) {
    this.users.delete(id);
    for (const [k, v] of this.trips) if (v.userId === id) this.trips.delete(k);
    for (const [k, v] of this.ratings) if (v.userId === id) this.ratings.delete(k);
  }
  async listTrips(userId: string) {
    return [...this.trips.values()].filter((t) => t.userId === userId && !t.trip.deleted).map((t) => t.trip).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async getTrip(userId: string, id: string) {
    const t = this.trips.get(`${userId}/${id}`);
    return t && !t.trip.deleted ? t.trip : null;
  }
  async putTrip(userId: string, incoming: Trip) {
    const trip = clampTime(incoming);
    const key = `${userId}/${trip.id}`;
    const cur = this.trips.get(key);
    if (cur && Date.parse(cur.trip.updatedAt) >= Date.parse(trip.updatedAt)) return { applied: false, trip: cur.trip };
    this.trips.set(key, { userId, trip, seq: ++this.seq });
    return { applied: true, trip };
  }
  async addRatings(userId: string, ratings: Rating[]) {
    for (const r of ratings) if (!this.ratings.has(r.id)) this.ratings.set(r.id, { userId, rating: r, seq: ++this.seq });
  }
  async sync(userId: string, cursor: number | null, trips: Trip[], ratings: Rating[]): Promise<SyncResult> {
    const rejected: string[] = [];
    for (const t of trips) {
      const cur = this.trips.get(`${userId}/${t.id}`);
      const r = await this.putTrip(userId, t);
      if (!r.applied && cur && Date.parse(cur.trip.updatedAt) > Date.parse(t.updatedAt)) rejected.push(t.id);
    }
    await this.addRatings(userId, ratings);
    const since = cursor ?? 0;
    return {
      cursor: this.seq,
      trips: [...this.trips.values()].filter((t) => t.userId === userId && t.seq > since).map((t) => t.trip),
      ratings: [...this.ratings.values()].filter((r) => r.userId === userId && r.seq > since).map((r) => r.rating),
      rejected,
    };
  }
  async close() {}
}
