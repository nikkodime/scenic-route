// Where each island lives on the map (kept in step with IslandRegion in apps/ios/App/Views/IslandView.swift).
export const REGION_GEO = {
  tuscany: { short: "Val d'Orcia", country: 'Italy', lat: 43.07, lon: 11.62, radiusKm: 130 },
  dolomites: { short: 'Dolomites', country: 'Italy', lat: 46.52, lon: 12.05, radiusKm: 120 },
  amalfi: { short: 'Amalfi', country: 'Italy', lat: 40.63, lon: 14.6, radiusKm: 90 },
  sardinia: { short: 'Sardinia', country: 'Italy', lat: 41.1, lon: 9.5, radiusKm: 160 },
  moselle: { short: 'Moselle', country: 'Germany', lat: 50.05, lon: 7.12, radiusKm: 120 },
  fjord: { short: 'Geiranger', country: 'Norway', lat: 62.1, lon: 7.2, radiusKm: 120 },
  bardenas: { short: 'Bardenas', country: 'Spain', lat: 42.2, lon: -1.5, radiusKm: 90 },
  highlands: { short: 'Glen Coe', country: 'Scotland', lat: 56.68, lon: -5.1, radiusKm: 120 },
};

export function kmBetween(a, b) {
  const r = 6371, p1 = (a.lat * Math.PI) / 180, p2 = (b.lat * Math.PI) / 180;
  const dp = p2 - p1, dl = ((b.lon - a.lon) * Math.PI) / 180;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** The closest island to a place. */
export function nearestRegion(p) {
  let best = 'tuscany', d = Infinity;
  for (const [k, g] of Object.entries(REGION_GEO)) { const x = kmBetween(p, g); if (x < d) { d = x; best = k; } }
  return best;
}
