// ZTL and low-emission zone polygons from infra/data/zones/*.geojson.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { BBox, Zone } from '@scenic/core';

function zoneBBox(z: Zone): BBox {
  let s = 90, w = 180, n = -90, e = -180;
  const rings: number[][][] = z.geometry.type === 'Polygon' ? z.geometry.coordinates : z.geometry.coordinates.flat();
  for (const ring of rings) for (const [lon, lat] of ring) { s = Math.min(s, lat); n = Math.max(n, lat); w = Math.min(w, lon); e = Math.max(e, lon); }
  return [s, w, n, e];
}

export function loadZones(dir: string): { all: Zone[]; inBBox: (b: BBox) => Zone[] } {
  const all: Zone[] = [];
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.geojson')).sort()) {
      const fc = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      for (const feat of fc.features ?? []) if (feat.geometry && ['ztl', 'lez'].includes(feat.properties?.kind)) all.push(feat);
    }
  }
  const boxes = all.map(zoneBBox);
  return {
    all,
    inBBox: (b) => all.filter((_, i) => !(boxes[i][0] > b[2] || boxes[i][2] < b[0] || boxes[i][1] > b[3] || boxes[i][3] < b[1])),
  };
}
