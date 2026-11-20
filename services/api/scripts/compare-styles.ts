// Run the route styles side by side on real Tuscan trips, with the real router, scenic places and elevation.
// Writes every style's chosen routes and the whole candidate pool, so styles can be tuned and compared.
//
//   ROUTER=graphhopper WEATHER=none PHOTOS=none OVERPASS=none node services/api/scripts/compare-styles.ts out.json
//
// Needs GraphHopper (GRAPHHOPPER_URL, default http://localhost:8989) with the Italy graph.

import { writeFileSync } from 'node:fs';
import { encodePolyline, planRoutes, PlanRequestSchema, ROUTE_STYLES, STYLES } from '@scenic/core';
import { loadConfig } from '../src/config.ts';
import { makeProviders } from '../src/wiring.ts';

const P = {
  siena: { lat: 43.3186, lon: 11.3306, label: 'Siena' },
  pienza: { lat: 43.0767, lon: 11.679, label: 'Pienza' },
  montalcino: { lat: 43.057, lon: 11.4893, label: 'Montalcino' },
  montepulciano: { lat: 43.093, lon: 11.7806, label: 'Montepulciano' },
  firenze: { lat: 43.7696, lon: 11.2558, label: 'Firenze' },
  volterra: { lat: 43.4022, lon: 10.8606, label: 'Volterra' },
  sangimignano: { lat: 43.4677, lon: 11.0436, label: 'San Gimignano' },
  arezzo: { lat: 43.4633, lon: 11.8797, label: 'Arezzo' },
};
const TRIPS: [keyof typeof P, keyof typeof P][] = [
  ['siena', 'pienza'], ['siena', 'montalcino'], ['firenze', 'siena'], ['siena', 'volterra'], ['firenze', 'sangimignano'], ['siena', 'montepulciano'], ['arezzo', 'siena'],
];

const out = process.argv[2] ?? 'compare-styles.json';
const { providers } = makeProviders(loadConfig({ ...process.env, WEATHER: 'none', PHOTOS: 'none', OVERPASS: process.env.OVERPASS ?? 'none' }));
const departAt = '2027-05-15T07:00:00Z';
const result: unknown[] = [];

for (const [a, b] of TRIPS) {
  const pool = new Map<string, unknown>();
  const collect = (tag: string) => (cs: { line: { lat: number; lon: number }[] }[]) => {
    for (const c of cs) {
      const polyline = encodePolyline(c.line, 5);
      if (!pool.has(polyline)) pool.set(polyline, { ...c, line: undefined, polyline, from: tag });
    }
  };
  const styles: Record<string, unknown> = {};
  let fastest: unknown = null;
  for (const style of ROUTE_STYLES) {
    const t0 = Date.now();
    const req = PlanRequestSchema.parse({ origin: P[a], destination: P[b], style, departAt, maxRoutes: 3 });
    const res = await planRoutes(req, providers, { onCandidates: collect(style), features: { stops: false, goldenDeparture: false } });
    fastest = res.fastest;
    styles[style] = {
      budgetMinutes: res.budgetMinutes, ms: Date.now() - t0,
      routes: res.routes.map((r) => ({ label: r.label, source: r.source, km: r.km, minutes: r.minutes, extraMinutes: r.extraMinutes, score: r.score, parts: r.parts, polyline: r.polyline, highlights: r.highlights.map((h) => h.name), sharedPct: r.vsFastest?.sharedPct })),
    };
    console.log(`${P[a].label} → ${P[b].label} · ${style}: ${res.routes.map((r) => `${r.score}/${r.extraMinutes}m`).join(', ')}`);
  }
  // A wide pass: every scenic strength and a long budget, so a retuned style can be tried on the same pool.
  const saved = { ...STYLES.most_beautiful };
  Object.assign(STYLES.most_beautiful, { share: 1.3, min: 50, max: 240, strengths: [1, 2, 3] });
  try {
    await planRoutes(PlanRequestSchema.parse({ origin: P[a], destination: P[b], style: 'most_beautiful', departAt, maxRoutes: 3 }), providers, { onCandidates: collect('wide'), features: { stops: false, goldenDeparture: false } });
  } finally { Object.assign(STYLES.most_beautiful, saved); }
  result.push({ trip: `${P[a].label} → ${P[b].label}`, origin: P[a], destination: P[b], fastest, styles, candidates: [...pool.values()] });
  writeFileSync(out, JSON.stringify(result));
}
console.log(`wrote ${out}`);
