// API client for the planner. Same contract as the iOS app (packages/core/src/contracts.ts).

import type { GeocodeResult, PlanRequestInput, PlanResponse, Trip } from '@scenic/core';

const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';
const TOKEN_KEY = 'scenic.token';

function storedToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

async function call<T>(method: string, path: string, body?: unknown, auth = false): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${await token()}`;
  let r: Response;
  try {
    r = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error('Cannot reach the Scenic Route server. Check your connection.');
  }
  if (r.status === 401 && auth) { try { localStorage.removeItem(TOKEN_KEY); } catch {} }
  if (!r.ok && r.status !== 409) {
    const msg = await r.json().then((j) => j.error as string).catch(() => null);
    throw new Error(msg || `Server error ${r.status}`);
  }
  return r.status === 204 ? (undefined as T) : r.json();
}

async function token(): Promise<string> {
  const t = storedToken();
  if (t) return t;
  const r = await call<{ token: string }>('POST', '/v1/auth/anonymous');
  try { localStorage.setItem(TOKEN_KEY, r.token); } catch {}
  return r.token;
}

export const api = {
  geocode: (q: string, near?: { lat: number; lon: number }) =>
    call<{ results: GeocodeResult[] }>('GET', `/v1/geocode?q=${encodeURIComponent(q)}${near ? `&lat=${near.lat}&lon=${near.lon}` : ''}`).then((r) => r.results),
  plan: (req: PlanRequestInput) => call<PlanResponse>('POST', '/v1/plan', req),
  trips: () => call<{ trips: Trip[] }>('GET', '/v1/trips', undefined, true).then((r) => r.trips),
  saveTrip: (t: Trip) => call<Trip>('PUT', `/v1/trips/${t.id}`, t, true),
  deleteTrip: (id: string) => call<void>('DELETE', `/v1/trips/${id}`, undefined, true),
};
