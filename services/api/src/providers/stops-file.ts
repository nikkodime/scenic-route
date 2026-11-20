// Stops worth making, shipped per region in infra/data/stops/*.json (made by scripts/build-stops.ts
// from the same OpenStreetMap extract as the routing graph). No live service is asked at plan time.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { BBox, StopPlace, StopSource } from '@scenic/core';

export interface StopFile {
  region: string;
  bbox: BBox;
  fetchedAt: string;
  attribution: string;
  stops: StopPlace[];
}

const CELL = 0.1;

export class FileStops implements StopSource {
  readonly attribution = 'Stops: © OpenStreetMap contributors (ODbL)';
  readonly count: number;
  private grid = new Map<string, StopPlace[]>();
  constructor(files: StopFile[]) {
    const seen = new Set<string>();
    for (const f of files) for (const s of f.stops) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      const k = `${Math.floor(s.lat / CELL)},${Math.floor(s.lon / CELL)}`;
      const cell = this.grid.get(k);
      if (cell) cell.push(s); else this.grid.set(k, [s]);
    }
    this.count = seen.size;
  }
  static load(dir: string): FileStops {
    const files: StopFile[] = [];
    if (existsSync(dir)) for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) files.push(JSON.parse(readFileSync(join(dir, f), 'utf8')));
    return new FileStops(files);
  }
  async stops(b: BBox): Promise<StopPlace[]> {
    const out: StopPlace[] = [];
    for (let i = Math.floor(b[0] / CELL); i <= Math.floor(b[2] / CELL); i++) {
      for (let j = Math.floor(b[1] / CELL); j <= Math.floor(b[3] / CELL); j++) {
        for (const s of this.grid.get(`${i},${j}`) ?? []) if (s.lat >= b[0] && s.lat <= b[2] && s.lon >= b[1] && s.lon <= b[3]) out.push(s);
      }
    }
    return out;
  }
}
