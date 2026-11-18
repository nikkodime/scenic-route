// Toll estimate for a route: km on toll roads per country × a per-km rate for the vehicle class.
//
// This is an estimate, shown as "≈ €12". Distance tolls (Italy, France, Spain, Portugal, Croatia, Greece …)
// are priced per km by class; vignette countries (Austria, Switzerland, Slovenia, Czechia, Slovakia, Hungary,
// Romania, Bulgaria) cost nothing per km here because the vignette is a one-off, flagged by the advisories.
// Fixed-price tunnels, bridges and alpine toll roads (Mont Blanc, Großglockner …) are not priced yet.
//
// Rates are euros per km for a car (incl. VAT), averaged over each country's operators; calibrate them
// against the official calculators (autostrade.it, autoroutes.fr …) before calling them more than "about".

import type { Vehicle } from './contracts.ts';
import { VIGNETTE_COUNTRIES } from './advisories.ts';

export interface TollRate {
  /** € per km for a car (class A / classe 1). */
  car: number;
  /** Multipliers for a campervan (taller 2-axle) and a car + caravan (3+ axles). */
  campervan: number;
  caravan: number;
}

export const TOLL_RATES: Record<string, TollRate> = {
  IT: { car: 0.08, campervan: 1.02, caravan: 1.36 }, // classe A / B / 3
  FR: { car: 0.11, campervan: 1.5, caravan: 1.5 }, // classe 1 / 2
  ES: { car: 0.11, campervan: 1.0, caravan: 1.7 }, // ligeros / pesados 1
  PT: { car: 0.09, campervan: 1.75, caravan: 1.75 }, // classe 1 / 2
  HR: { car: 0.065, campervan: 1.5, caravan: 1.5 },
  GR: { car: 0.07, campervan: 1.6, caravan: 1.6 },
  PL: { car: 0.06, campervan: 1.0, caravan: 1.6 },
  RS: { car: 0.05, campervan: 1.6, caravan: 1.6 },
  MK: { car: 0.04, campervan: 1.6, caravan: 1.6 },
  IE: { car: 0.06, campervan: 1.3, caravan: 1.3 },
  NO: { car: 0.08, campervan: 1.0, caravan: 1.0 },
  GB: { car: 0.1, campervan: 1.3, caravan: 1.3 },
};

const DEFAULT_RATE: TollRate = { car: 0.08, campervan: 1.3, caravan: 1.5 };

export interface TollEstimate {
  /** Km on toll roads (all countries). */
  km: number;
  /** Estimated euros, rounded to the euro; 0 when free. */
  eur: number;
  byCountry: { country: string; km: number; eur: number }[];
}

export interface TollInput {
  tollKm?: number;
  /** Toll km per ISO country code; without it all toll km are priced at the fallback country. */
  tollKmByCountry?: Record<string, number>;
}

export function estimateTolls(path: TollInput, vehicle: Vehicle = 'car', fallbackCountry = 'IT'): TollEstimate {
  const km = path.tollKm ?? 0;
  const per = path.tollKmByCountry && Object.keys(path.tollKmByCountry).length ? path.tollKmByCountry : km > 0 ? { [fallbackCountry]: km } : {};
  const byCountry = Object.entries(per)
    .filter(([, k]) => k >= 0.5)
    .map(([country, k]) => {
      // Vignette countries: the motorway is paid by the vignette (an advisory), not per km.
      if (VIGNETTE_COUNTRIES[country]) return { country, km: round1(k), eur: 0 };
      const r = TOLL_RATES[country] ?? DEFAULT_RATE;
      const mult = vehicle === 'car' ? 1 : r[vehicle];
      return { country, km: round1(k), eur: Math.round(k * r.car * mult * 10) / 10 };
    })
    .sort((a, b) => b.km - a.km);
  const eur = Math.round(byCountry.reduce((s, c) => s + c.eur, 0));
  return { km: round1(km), eur, byCountry };
}

const round1 = (x: number) => Math.round(x * 10) / 10;
