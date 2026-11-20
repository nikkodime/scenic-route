// Download a region's scenic places from Overpass once, tile by tile, into infra/data/features/<region>.json.
//   node services/api/scripts/fetch-features.ts it-tuscany
//   node services/api/scripts/fetch-features.ts my-region 45.0,6.5,46.5,8.0
// Tiles already fetched are kept in a cache folder, so a rerun resumes after a failure.
// Be polite: one request at a time, a pause between tiles, the app's User-Agent.

import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { overpassQuery, parseOverpass, type BBox, type ScenicFeature } from '@scenic/core';
import { makeHttp } from '../src/http.ts';
import { loadConfig } from '../src/config.ts';

export const REGIONS: Record<string, BBox> = {
  // Mainland Tuscany plus Elba, Capraia, Giglio and Giannutri.
  'it-tuscany': [42.2, 9.6, 44.5, 12.4],
};

const TILE = 0.25;

export function tiles(b: BBox, step = TILE): BBox[] {
  const out: BBox[] = [];
  const r = (x: number) => Math.round(x * 1000) / 1000;
  for (let s = b[0]; s < b[2] - 1e-9; s += step) {
    for (let w = b[1]; w < b[3] - 1e-9; w += step) out.push([r(s), r(w), r(Math.min(s + step, b[2])), r(Math.min(w + step, b[3]))]);
  }
  return out;
}

async function main() {
  const [region, bboxArg] = process.argv.slice(2);
  const bbox = (bboxArg ? bboxArg.split(',').map(Number) : REGIONS[region]) as BBox | undefined;
  if (!region || !bbox || bbox.length !== 4 || bbox.some(Number.isNaN)) {
    console.error('usage: fetch-features.ts <region> [south,west,north,east]');
    process.exit(2);
  }
  const c = loadConfig();
  const http = makeHttp({ userAgent: c.USER_AGENT });
  const outDir = fileURLToPath(new URL('../../../infra/data/features/', import.meta.url));
  const cacheDir = join(outDir, '.cache', region);
  mkdirSync(cacheDir, { recursive: true });

  const all = tiles(bbox);
  let failed = 0;
  for (const [i, t] of all.entries()) {
    const file = join(cacheDir, t.join('_') + '.json');
    if (existsSync(file)) continue;
    let done = false;
    for (let attempt = 0; attempt < 3 * c.OVERPASS_URLS.length && !done; attempt++) {
      const url = c.OVERPASS_URLS[attempt % c.OVERPASS_URLS.length];
      try {
        const json = await http.json(url, {
          method: 'POST', body: 'data=' + encodeURIComponent(overpassQuery(t)),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeoutMs: 90_000, retries: 0,
        });
        const features = parseOverpass(json);
        writeFileSync(file, JSON.stringify(features));
        console.log(`${i + 1}/${all.length} ${t.join(',')}: ${features.length} places (${new URL(url).host})`);
        done = true;
      } catch (e) {
        console.warn(`${i + 1}/${all.length} ${t.join(',')}: ${new URL(url).host} failed: ${(e as Error).message}`);
        await new Promise((r) => setTimeout(r, 5_000 * (attempt + 1)));
      }
    }
    if (!done) failed++;
    await new Promise((r) => setTimeout(r, 1_500));
  }
  if (failed) {
    console.error(`${failed} tiles failed. Run again to retry only those.`);
    process.exit(1);
  }

  const byId = new Map<string, ScenicFeature>();
  for (const t of all) for (const f of JSON.parse(readFileSync(join(cacheDir, t.join('_') + '.json'), 'utf8')) as ScenicFeature[]) byId.set(f.id, f);
  const features = [...byId.values()]
    .map((f) => ({ ...f, lat: Math.round(f.lat * 1e5) / 1e5, lon: Math.round(f.lon * 1e5) / 1e5 }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const out = {
    region, bbox, fetchedAt: new Date().toISOString(),
    attribution: '© OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)',
    features,
  };
  writeFileSync(join(outDir, `${region}.json`), JSON.stringify(out) + '\n');
  const counts: Record<string, number> = {};
  for (const f of features) counts[f.type] = (counts[f.type] ?? 0) + 1;
  console.log(`wrote ${region}.json: ${features.length} places`, counts);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
