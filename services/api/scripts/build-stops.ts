// Build a region's stops worth making from an OpenStreetMap extract: viewpoints with somewhere to pull over,
// cafés, agriturismi and wineries. Same extract and tooling as build-features.ts.
//   node services/api/scripts/build-stops.ts italy-latest.osm.pbf italy
// Writes infra/data/stops/<region>.json in the format FileStops reads.

import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { distKm, type BBox, type StopPlace } from '@scenic/core';
import { center } from './build-features.ts';

export const OSMIUM_STOP_FILTERS = [
  'n/tourism=viewpoint', 'nwr/amenity=parking', 'nw/highway=rest_area',
  'nwr/amenity=cafe', 'nwr/craft=winery', 'nwr/tourism=wine_cellar',
  'nwr/tourism=guest_house,farm', 'nwr/agriturismo', 'nwr/amenity=restaurant',
];

/** A viewpoint needs a mapped car park or lay-by this close to count as somewhere you can stop. */
export const PULL_OFF_KM = 0.15;

type Tags = Record<string, string>;
const AGRI = /agri ?turismo|agritourism|fattoria didattica/i;

/** What a tagged OSM element is as a stop, or null. Parking is returned separately to pair with viewpoints. */
export function classifyStop(tags: Tags): StopPlace['kind'] | 'parking' | null {
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.amenity === 'parking' || tags.highway === 'rest_area') return tags.access === 'private' ? null : 'parking';
  if (tags.craft === 'winery' || tags.tourism === 'wine_cellar') return tags.name ? 'winery' : null;
  if (tags.agriturismo === 'yes' || tags.guest_house === 'agritourism' || tags.guest_house === 'farm' || tags.tourism === 'farm' || AGRI.test(tags.name ?? ''))
    return tags.name && (tags.tourism || tags.amenity === 'restaurant' || tags.agriturismo) ? 'agriturismo' : null;
  if (tags.amenity === 'cafe') return tags.name ? 'cafe' : null;
  return null;
}

/** Agriturismo or winery that serves meals: a restaurant, or tagged with food or a cuisine. */
export const servesFood = (t: Tags) => t.amenity === 'restaurant' || t.restaurant === 'yes' || t.food === 'yes' || !!t.cuisine;

export function osmId(raw: string): string {
  const m = /^([nwa])(\d+)$/.exec(raw);
  if (!m) return raw;
  const num = Number(m[2]);
  return m[1] === 'n' ? `node/${num}` : m[1] === 'w' ? `way/${num}` : num % 2 ? `relation/${(num - 1) / 2}` : `way/${num / 2}`;
}

/** Keep viewpoints that have a car park or rest area within PULL_OFF_KM. */
export function withPullOff(views: StopPlace[], parking: { lat: number; lon: number }[]): StopPlace[] {
  const cell = 0.01;
  const grid = new Map<string, { lat: number; lon: number }[]>();
  for (const p of parking) {
    const k = `${Math.floor(p.lat / cell)},${Math.floor(p.lon / cell)}`;
    const c = grid.get(k);
    if (c) c.push(p); else grid.set(k, [p]);
  }
  return views.filter((v) => {
    const i0 = Math.floor(v.lat / cell), j0 = Math.floor(v.lon / cell);
    for (let i = i0 - 1; i <= i0 + 1; i++) for (let j = j0 - 1; j <= j0 + 1; j++) {
      for (const p of grid.get(`${i},${j}`) ?? []) if (distKm(v, p) <= PULL_OFF_KM) return true;
    }
    return false;
  });
}

async function main() {
  const [pbf, region] = process.argv.slice(2);
  if (!pbf || !region) {
    console.error('usage: build-stops.ts <extract.osm.pbf> <region>');
    process.exit(2);
  }
  const tmp = mkdtempSync(join(tmpdir(), 'scenic-stops-'));
  try {
    const filtered = join(tmp, 'stops.osm.pbf');
    execFileSync('osmium', ['tags-filter', pbf, ...OSMIUM_STOP_FILTERS, '-o', filtered, '--overwrite'], { stdio: 'inherit' });
    const exp = spawn('osmium', ['export', filtered, '-f', 'geojsonseq', '--add-unique-id=type_id', '-x', 'print_record_separator=false', '-o', '-'], { stdio: ['ignore', 'pipe', 'inherit'] });
    const byId = new Map<string, StopPlace>();
    const views: StopPlace[] = [];
    const parking: { lat: number; lon: number }[] = [];
    let s = 90, w = 180, n = -90, e = -180;
    for await (const line of createInterface({ input: exp.stdout })) {
      if (!line.trim()) continue;
      const f = JSON.parse(line) as { id?: string; geometry: { coordinates: unknown }; properties: Tags };
      const tags = f.properties ?? {};
      const kind = classifyStop(tags);
      if (!kind) continue;
      const c = center(f.geometry?.coordinates);
      if (!c) continue;
      const lat = Math.round(c.lat * 1e5) / 1e5, lon = Math.round(c.lon * 1e5) / 1e5;
      if (kind === 'parking') { parking.push({ lat, lon }); continue; }
      const stop: StopPlace = { id: osmId(f.id ?? ''), lat, lon, kind, name: tags.name ?? '' };
      if (tags.opening_hours) stop.hours = tags.opening_hours;
      if (tags.website || tags['contact:website']) stop.website = tags.website || tags['contact:website'];
      if (kind === 'agriturismo' || kind === 'winery') stop.food = servesFood(tags);
      if (kind === 'viewpoint') views.push(stop); else byId.set(stop.id, stop);
      s = Math.min(s, lat); n = Math.max(n, lat); w = Math.min(w, lon); e = Math.max(e, lon);
    }
    const code = await new Promise<number>((r) => exp.on('close', (x) => r(x ?? 1)));
    if (code !== 0) throw new Error(`osmium export exited with ${code}`);
    for (const v of withPullOff(views, parking)) byId.set(v.id, v);
    const stops = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
    const bbox = [s, w, n, e].map((x) => Math.round(x * 1000) / 1000) as BBox;
    const outDir = fileURLToPath(new URL('../../../infra/data/stops/', import.meta.url));
    writeFileSync(join(outDir, `${region}.json`), JSON.stringify({
      region, bbox, fetchedAt: new Date().toISOString(),
      attribution: '© OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)',
      stops,
    }) + '\n');
    const counts: Record<string, number> = {};
    for (const x of stops) counts[x.kind] = (counts[x.kind] ?? 0) + 1;
    console.log(`wrote ${region}.json: ${stops.length} stops (${views.length} viewpoints before the pull-off check, ${parking.length} car parks)`, counts);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
