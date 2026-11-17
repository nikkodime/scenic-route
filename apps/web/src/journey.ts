// Journey state: a multi-day trip where each day is planned separately. Pure functions, tested in Node.

import type { Interest, Place, PlanResponse, Preferences, RouteOption, RouteStyle, Trip, Vehicle } from '@scenic/core';

export interface DayPlan {
  origin: Place | null;
  destination: Place | null;
  /** Optional cap on extra minutes for this day; null lets the journey's style decide. */
  extraMinutes: number | null;
  /** Local date-time string from <input type="datetime-local">, or '' for "now". */
  departAt: string;
  plan: PlanResponse | null;
  chosenRouteId: string | null;
  /** A loop: out to these places and back to the start (origin = destination). */
  stops?: Place[];
}

export interface Journey {
  id: string;
  name: string;
  prefs: Preferences;
  style: RouteStyle;
  interests: Interest[];
  vehicle: Vehicle;
  days: DayPlan[];
  createdAt: string;
}

/** Time-limit choices per day; null = no limit. */
export const LIMIT_CHOICES = [null, 15, 30, 60, 120] as const;

export const STYLE_LABELS: Record<RouteStyle, string> = { relaxed: 'Relaxed', scenic: 'Scenic', most_beautiful: 'Most beautiful' };
export const STYLE_BLURBS: Record<RouteStyle, string> = {
  relaxed: 'Nicer roads, barely any extra time.',
  scenic: 'The beautiful way, within reason.',
  most_beautiful: 'Take your time; the drive is the day.',
};
export const INTEREST_LABELS: Record<Interest, string> = {
  views: 'Views', heritage: 'Hill towns', water: 'Lakes & coast', mountains: 'Mountains & passes', countryside: 'Vineyards & cypresses', quiet: 'Quiet roads',
};
export const VEHICLE_LABELS: Record<Vehicle, string> = { car: 'Car', campervan: 'Campervan', caravan: 'Car + caravan' };

export const defaultPrefs = (): Preferences => ({ rentalCar: false, avoidUnpaved: true, avoidTolls: false, avoidMotorways: true, vignettes: [] });

export function newDay(origin: Place | null = null): DayPlan {
  return { origin, destination: null, extraMinutes: null, departAt: '', plan: null, chosenRouteId: null };
}

export function newJourney(id: string, now = new Date()): Journey {
  return { id, name: '', prefs: defaultPrefs(), style: 'scenic', interests: [], vehicle: 'car', days: [newDay()], createdAt: now.toISOString() };
}

/** Fill in fields added since a draft or trip was saved. */
export function normalize(j: Journey): Journey {
  return { ...j, style: j.style ?? 'scenic', interests: j.interests ?? [], vehicle: j.vehicle ?? 'car', days: j.days.map((d) => ({ ...d, extraMinutes: d.extraMinutes ?? null })) };
}

/** Journey-wide settings (style, interests, vehicle, road prefs) invalidate every day's plan. */
export function updateJourney(j: Journey, patch: Partial<Pick<Journey, 'style' | 'interests' | 'vehicle' | 'prefs'>>): Journey {
  return { ...j, ...patch, days: j.days.map((d) => ({ ...d, plan: null, chosenRouteId: null })) };
}

export function toggleInterest(j: Journey, i: Interest): Journey {
  return updateJourney(j, { interests: j.interests.includes(i) ? j.interests.filter((x) => x !== i) : [...j.interests, i] });
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
  if ('origin' in patch || 'destination' in patch || 'extraMinutes' in patch || 'departAt' in patch || 'stops' in patch) days[i] = { ...days[i], plan: null, chosenRouteId: null };
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
  const via = j.days.length === 1 ? j.days[0].stops?.[0]?.label?.split(',')[0] : undefined;
  if (first && via) return `${first} loop via ${via}`;
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
    style: j.style,
    interests: j.interests,
    vehicle: j.vehicle,
    days: j.days.filter((d) => d.origin && d.destination).map((d) => ({
      date: d.departAt ? d.departAt.slice(0, 10) : undefined,
      origin: d.origin!,
      destination: d.destination!,
      stops: d.stops ?? [],
      extraMinutes: d.extraMinutes ?? Math.round(chosenRoute(d)?.extraMinutes ?? 0),
      route: chosenRoute(d) ?? undefined,
    })),
  };
}

export function fromTrip(t: Trip): Journey {
  return {
    id: t.id,
    name: t.name,
    prefs: defaultPrefs(),
    style: t.style ?? 'scenic',
    interests: t.interests ?? [],
    vehicle: t.vehicle ?? 'car',
    createdAt: t.createdAt,
    days: t.days.map((d) => ({
      origin: d.origin, destination: d.destination, stops: d.stops ?? [], extraMinutes: null,
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
