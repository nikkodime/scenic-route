// Download a region's elevation tiles once (1 arc-second, ~30 m; Mapzen terrain tiles on AWS Open Data, no key).
//   node services/api/scripts/fetch-dem.ts it-centro            -> $DEM_DIR (default infra/data/dem)
//   node services/api/scripts/fetch-dem.ts 41,10,45,13           (south,west,north,east)
// Tiles already present are skipped; sea-only tiles don't exist upstream and are skipped too.
// About 12 MB per 1°x1° tile gzipped; central Italy is ~16 tiles, all of Europe ~2,500 (~30 GB).

import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tileName } from '../src/providers/dem.ts';

export const DEM_REGIONS: Record<string, [number, number, number, number]> = {
  'it-centro': [41, 9, 45, 14], // Tuscany, Umbria, Marche, Lazio, Elba
  'it-north': [44, 6, 47.2, 14],
  alps: [43.5, 5, 48.5, 17],
};

export function tileList(b: [number, number, number, number]): { dir: string; name: string }[] {
  const out: { dir: string; name: string }[] = [];
  for (let la = Math.floor(b[0]); la < Math.ceil(b[2]); la++) for (let lo = Math.floor(b[1]); lo < Math.ceil(b[3]); lo++) out.push(tileName(la + 0.5, lo + 0.5));
  return out;
}

async function main() {
  const arg = process.argv[2];
  const b = arg && DEM_REGIONS[arg] ? DEM_REGIONS[arg] : (arg?.split(',').map(Number) as [number, number, number, number] | undefined);
  if (!b || b.length !== 4 || b.some(Number.isNaN)) {
    console.error(`usage: fetch-dem.ts <${Object.keys(DEM_REGIONS).join('|')}|south,west,north,east>`);
    process.exit(2);
  }
  const root = process.env.DEM_DIR ?? fileURLToPath(new URL('../../../infra/data/dem/', import.meta.url));
  const list = tileList(b);
  let got = 0, sea = 0, failed = 0;
  for (const [i, t] of list.entries()) {
    const dir = join(root, t.dir);
    const file = join(dir, `${t.name}.hgt.gz`);
    if (existsSync(file) || existsSync(join(dir, `${t.name}.hgt`))) continue;
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/skadi/${t.dir}/${t.name}.hgt.gz`;
    try {
      const res = await fetch(url);
      if (res.status === 404 || res.status === 403) { sea++; continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      got++;
      console.log(`${i + 1}/${list.length} ${t.name}`);
    } catch (e) {
      failed++;
      console.warn(`${i + 1}/${list.length} ${t.name} failed: ${(e as Error).message}`);
    }
  }
  console.log(`done: ${got} downloaded, ${sea} sea-only, ${failed} failed, in ${root}`);
  if (failed) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
