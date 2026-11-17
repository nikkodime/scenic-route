// Build a region's scenic places from an OpenStreetMap extract (the same Geofabrik .osm.pbf GraphHopper is built
// from), without any live query service. Scales to all of Europe: osmium filters the extract in minutes.
//   brew install osmium-tool   |   apt install osmium-tool
//   curl -LO https://download.geofabrik.de/europe/italy/centro-latest.osm.pbf
//   node services/api/scripts/build-features.ts centro-latest.osm.pbf it-centro
//   node services/api/scripts/build-features.ts europe-latest.osm.pbf europe
// Writes infra/data/features/<region>.json in the format FileFeatures reads.

import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { classify, FEATURE_WEIGHTS, type BBox, type ScenicFeature } from '@scenic/core';

/** osmium tags-filter expressions matching the Overpass query in @scenic/core overpassQuery. */
export const OSMIUM_FILTERS = [
  'n/tourism=viewpoint', 'n/mountain_pass=yes', 'n/natural=peak',
  'nwr/historic=castle,fort,tower,monastery,church,abbey',
  'n/place=village,hamlet', 'nwr/natural=beach', 'wr/natural=water', 'w/natural=coastline',
  'n/waterway=waterfall', 'w/landuse=vineyard', 'w/natural=tree_row', 'w/scenic=yes', 'n/tourism=attraction',
];

interface GeoFeature {
  type: 'Feature';
  id?: string;
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, string>;
}

/** Midpoint of the geometry's bounding box (what Overpass "out center" gives). */
export function center(coords: unknown): { lat: number; lon: number } | null {
  let s = 90, w = 180, n = -90, e = -180, any = false;
  const walk = (c: unknown): void => {
    if (!Array.isArray(c)) return;
    if (typeof c[0] === 'number' && typeof c[1] === 'number') {
      any = true;
      w = Math.min(w, c[0]); e = Math.max(e, c[0]); s = Math.min(s, c[1]); n = Math.max(n, c[1]);
      return;
    }
    for (const x of c) walk(x);
  };
  walk(coords);
  return any ? { lat: (s + n) / 2, lon: (w + e) / 2 } : null;
}

/** Area in km² of a (Multi)Polygon's outer rings; 0 for other geometry. */
export function areaKm2(g: { type: string; coordinates: unknown }): number {
  const polys = g.type === 'Polygon' ? [g.coordinates as number[][][]] : g.type === 'MultiPolygon' ? (g.coordinates as number[][][][]) : [];
  let total = 0;
  for (const poly of polys) {
    const ring = poly[0] ?? [];
    const lat0 = ((ring[0]?.[1] ?? 0) * Math.PI) / 180;
    let a = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
      a += x1 * y2 - x2 * y1;
    }
    total += (Math.abs(a) / 2) * 111.32 * 111.32 * Math.cos(lat0);
  }
  return total;
}

/** Lakes smaller than this (farm ponds, irrigation basins) are not scenery. */
export const MIN_LAKE_KM2 = 0.1;

/** One osmium GeoJSON feature to a scenic place, applying the same extra conditions as the Overpass query. */
export function toScenicFeature(f: GeoFeature): ScenicFeature | null {
  const tags = f.properties ?? {};
  if (tags.natural === 'water' && !['lake', 'reservoir'].includes(tags.water)) return null;
  if (tags.natural === 'water' && areaKm2(f.geometry) < MIN_LAKE_KM2) return null;
  if (tags.natural === 'tree_row' && !/cupressus/i.test(tags.species ?? '') && tags.genus !== 'Cupressus') return null;
  if (tags.scenic === 'yes' && !tags.highway) return null;
  const type = classify(tags);
  if (!type) return null;
  const c = center(f.geometry?.coordinates);
  if (!c) return null;
  // osmium --add-unique-id=type_id gives n123 / w123 / a246 (areas: way id * 2, relation id * 2 + 1).
  const raw = f.id ?? '';
  let id = raw;
  const m = /^([nwa])(\d+)$/.exec(raw);
  if (m) {
    const num = Number(m[2]);
    id = m[1] === 'n' ? `node/${num}` : m[1] === 'w' ? `way/${num}` : num % 2 ? `relation/${(num - 1) / 2}` : `way/${num / 2}`;
  }
  let weight = FEATURE_WEIGHTS[type];
  if (type === 'peak' && tags.ele) weight += Math.min(2.5, parseFloat(tags.ele) / 600 || 0);
  return { id, lat: Math.round(c.lat * 1e5) / 1e5, lon: Math.round(c.lon * 1e5) / 1e5, type, weight, name: tags.name || '' };
}

async function main() {
  const [pbf, region, bboxArg] = process.argv.slice(2);
  if (!pbf || !region) {
    console.error('usage: build-features.ts <extract.osm.pbf> <region> [south,west,north,east]');
    process.exit(2);
  }
  const tmp = mkdtempSync(join(tmpdir(), 'scenic-features-'));
  try {
    const filtered = join(tmp, 'scenic.osm.pbf');
    console.log('filtering', pbf);
    execFileSync('osmium', ['tags-filter', pbf, ...OSMIUM_FILTERS, '-o', filtered, '--overwrite'], { stdio: 'inherit' });
    const exp = spawn('osmium', ['export', filtered, '-f', 'geojsonseq', '--add-unique-id=type_id', '-x', 'print_record_separator=false', '-o', '-'], { stdio: ['ignore', 'pipe', 'inherit'] });
    const byId = new Map<string, ScenicFeature>();
    let s = 90, w = 180, n = -90, e = -180;
    for await (const line of createInterface({ input: exp.stdout })) {
      if (!line.trim()) continue;
      const f = toScenicFeature(JSON.parse(line));
      if (!f) continue;
      byId.set(f.id, f);
      s = Math.min(s, f.lat); n = Math.max(n, f.lat); w = Math.min(w, f.lon); e = Math.max(e, f.lon);
    }
    const code = await new Promise<number>((r) => exp.on('close', (c) => r(c ?? 1)));
    if (code !== 0) throw new Error(`osmium export exited with ${code}`);
    // Coverage: the given bbox, else the data's extent shrunk by 0.05° so plans at the very edge still ask Overpass.
    const bbox = (bboxArg ? bboxArg.split(',').map(Number) : [s + 0.05, w + 0.05, n - 0.05, e - 0.05].map((x) => Math.round(x * 1000) / 1000)) as BBox;
    const features = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
    const outDir = fileURLToPath(new URL('../../../infra/data/features/', import.meta.url));
    writeFileSync(join(outDir, `${region}.json`), JSON.stringify({
      region, bbox, fetchedAt: new Date().toISOString(),
      attribution: '© OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)',
      features,
    }) + '\n');
    const counts: Record<string, number> = {};
    for (const f of features) counts[f.type] = (counts[f.type] ?? 0) + 1;
    console.log(`wrote ${region}.json: ${features.length} places, bbox ${bbox.join(',')}`, counts);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
