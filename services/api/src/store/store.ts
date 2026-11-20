// Persistence for accounts, trips and ratings, with delta sync (ADR 0005).

import type { Rating, Trip } from '@scenic/core';

export interface User {
  id: string;
  appleSub: string | null;
  createdAt: string;
}

export interface SyncResult {
  cursor: number;
  trips: Trip[];
  ratings: Rating[];
  rejected: string[];
}

export interface Store {
  createUser(): Promise<User>;
  getUser(id: string): Promise<User | null>;
  /** Link an Apple account. If that Apple account already has a user, returns that user instead. */
  linkApple(userId: string, appleSub: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
  listTrips(userId: string): Promise<Trip[]>;
  getTrip(userId: string, id: string): Promise<Trip | null>;
  /** Last writer wins on updatedAt. Returns whether the write was applied and the stored version. */
  putTrip(userId: string, trip: Trip): Promise<{ applied: boolean; trip: Trip }>;
  addRatings(userId: string, ratings: Rating[]): Promise<void>;
  /** Apply client changes, then return everything with seq > cursor. */
  sync(userId: string, cursor: number | null, trips: Trip[], ratings: Rating[]): Promise<SyncResult>;
  close(): Promise<void>;
}

/** Clients' clocks drift: never accept an updatedAt more than 5 minutes in the future. */
export function clampTime(trip: Trip, now = new Date()): Trip {
  const max = now.getTime() + 5 * 60_000;
  return Date.parse(trip.updatedAt) > max ? { ...trip, updatedAt: now.toISOString() } : trip;
}
