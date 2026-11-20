// Network calls. All free public services, fine for a personal prototype.
// Before any public launch: host our own router and Overpass, and use a
// commercial weather plan (Open-Meteo's free tier is non-commercial).

const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const OSRM = 'https://router.project-osrm.org/route/v1/driving/';
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const ELEVATION = 'https://api.open-meteo.com/v1/elevation';
const FORECAST = 'https://api.open-meteo.com/v1/forecast';

async function getJson(url, opts = {}, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...opts, signal: ctrl.signal });
    if (!r.ok) throw new Error(`${new URL(url).host} answered ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

export async function searchPlace(q) {
  const u = new URL(NOMINATIM);
  u.searchParams.set('q', q);
  u.searchParams.set('format', 'jsonv2');
  u.searchParams.set('limit', '5');
  u.searchParams.set('countrycodes', 'it,sm,va,fr,ch,at,si,hr');
  const res = await getJson(u.toString(), { headers: { 'Accept-Language': navigator.language || 'en' } });
  return res.map((r) => ({ lat: +r.lat, lon: +r.lon, label: r.display_name }));
}

export async function overpass(query) {
  let lastErr;
  for (const url of OVERPASS) {
    try {
      return await getJson(url, { method: 'POST', body: 'data=' + encodeURIComponent(query), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 25000);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Route through points. Returns {line, km, minutes, motorwayKm}. */
export async function osrmRoute(points) {
  const coords = points.map((p) => `${p.lon.toFixed(6)},${p.lat.toFixed(6)}`).join(';');
  const json = await getJson(`${OSRM}${coords}?overview=full&geometries=geojson&steps=true`);
  if (json.code !== 'Ok' || !json.routes?.length) throw new Error('No route found');
  return parseOsrm(json.routes[0]);
}

export function parseOsrm(r) {
  let motorwayKm = 0;
  for (const leg of r.legs || [])
    for (const step of leg.steps || [])
      if ((step.intersections || []).some((x) => (x.classes || []).includes('motorway'))) motorwayKm += step.distance / 1000;
  return {
    line: r.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })),
    km: r.distance / 1000,
    minutes: r.duration / 60,
    motorwayKm,
  };
}

/** Elevation in metres for up to 100 points (Copernicus DEM via Open-Meteo). */
export async function elevations(points) {
  const u = new URL(ELEVATION);
  u.searchParams.set('latitude', points.map((p) => p.lat.toFixed(4)).join(','));
  u.searchParams.set('longitude', points.map((p) => p.lon.toFixed(4)).join(','));
  const json = await getJson(u.toString());
  return json.elevation;
}

/** Hourly cloud cover, rain and visibility for one point, today and tomorrow. */
export async function weather(p) {
  const u = new URL(FORECAST);
  u.searchParams.set('latitude', p.lat.toFixed(3));
  u.searchParams.set('longitude', p.lon.toFixed(3));
  u.searchParams.set('hourly', 'cloud_cover,cloud_cover_low,precipitation_probability,visibility');
  u.searchParams.set('forecast_days', '2');
  u.searchParams.set('timezone', 'auto');
  return getJson(u.toString());
}
