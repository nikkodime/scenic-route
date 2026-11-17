// Journey state: a multi-day trip where each day is planned separately. Pure functions, tested in Node.

import type { Place, PlanResponse, Preferences, RouteOption, Trip } from '@scenic/core';

export interface DayPlan {
  origin: Place | null;
  destination: Place | null;
  extraMinutes: number;
  /** Local date-time string from <input type="datetime-local">, or '' for "now". */
  departAt: string;
  plan: PlanResponse | null;
  chosenRouteId: string | null;
}

export interface Journey {
  id: string;
  name: string;
  prefs: Preferences;
  days: DayPlan[];
  createdAt: string;
}

export const EXTRA_CHOICES = [0, 15, 30, 60, 120, 240] as const;

export const defaultPrefs = (): Preferences => ({ rentalCar: false, avoidUnpaved: true, avoidTolls: false, avoidMotorways: true, vignettes: [] });

export function newDay(origin: Place | null = null): DayPlan {
  return { origin, destination: null, extraMinutes: 60, departAt: '', plan: null, chosenRouteId: null };
}

export function newJourney(id: string, now = new Date()): Journey {
  return { id, name: '', prefs: defaultPrefs(), days: [newDay()], createdAt: now.toISOString() };
}

/** Next day starts where the previous one ended. */
export function addDay(j: Journey): Journey {
  const last = j.days[j.days.length - 1];
  return { ...j, days: [...j.days, newDay(last?.destination ?? null)] };
}

export function removeDay(j: Journey, i: number): Journey {
  if (j.days.length === 1) return { ...j, days: [newDay()] };
  return { ...j, days: j.days.filter((_, k) => k !== i) };
}

export function updateDay(j: Journey, i: number, patch: Partial<DayPlan>): Journey {
  const days = j.days.map((d, k) => (k === i ? { ...d, ...patch } : d));
  // Changing where or when invalidates that day's plan.
  if ('origin' in patch || 'destination' in patch || 'extraMinutes' in patch || 'departAt' in patch) days[i] = { ...days[i], plan: null, chosenRouteId: null };
  // Keep the chain connected: a new destination becomes the next day's start if it was linked.
  if ('destination' in patch && days[i + 1] && (days[i + 1].origin == null || samePlace(days[i + 1].origin, j.days[i].destination)))
    days[i + 1] = { ...days[i + 1], origin: patch.destination ?? null, plan: null, chosenRouteId: null };
  return { ...j, days };
}

export function samePlace(a: Place | null | undefined, b: Place | null | undefined): boolean {
  return !!a && !!b && Math.abs(a.lat - b.lat) < 1e-5 && Math.abs(a.lon - b.lon) < 1e-5;
}

export function chosenRoute(d: DayPlan): RouteOption | null {
  return d.plan?.routes.find((r) => r.id === d.chosenRouteId) ?? d.plan?.routes[0] ?? null;
}

export function totals(j: Journey): { km: number; minutes: number; days: number; planned: number } {
  let km = 0, minutes = 0, planned = 0;
  for (const d of j.days) {
    const r = chosenRoute(d);
    if (r) { km += r.km; minutes += r.minutes; planned++; }
  }
  return { km: Math.round(km), minutes: Math.round(minutes), days: j.days.length, planned };
}

export function defaultName(j: Journey): string {
  const first = j.days[0]?.origin?.label?.split(',')[0];
  const last = [...j.days].reverse().find((d) => d.destination)?.destination?.label?.split(',')[0];
  return first && last ? `${first} to ${last}` : 'Scenic journey';
}

/** Journey → API Trip (each day stores its chosen route so the phone can drive it offline). */
export function toTrip(j: Journey, now = new Date()): Trip {
  return {
    id: j.id,
    name: j.name || defaultName(j),
    notes: '',
    createdAt: j.createdAt,
    updatedAt: now.toISOString(),
    deleted: false,
    days: j.days.filter((d) => d.origin && d.destination).map((d) => ({
      date: d.departAt ? d.departAt.slice(0, 10) : undefined,
      origin: d.origin!,
      destination: d.destination!,
      stops: [],
      extraMinutes: d.extraMinutes,
      route: chosenRoute(d) ?? undefined,
    })),
  };
}

export function fromTrip(t: Trip): Journey {
  return {
    id: t.id,
    name: t.name,
    prefs: defaultPrefs(),
    createdAt: t.createdAt,
    days: t.days.map((d) => ({
      origin: d.origin, destination: d.destination, extraMinutes: d.extraMinutes,
      departAt: d.date ? `${d.date}T09:00` : '',
      plan: d.route ? { planId: 'saved', modelVersion: '', fastest: { km: d.route.km, minutes: d.route.minutes - d.route.extraMinutes }, routes: [d.route], warnings: [], attribution: [] } : null,
      chosenRouteId: d.route?.id ?? null,
    })),
  };
}

/** "1 h 35 min" */
export function duration(min: number): string {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  return m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`;
}
