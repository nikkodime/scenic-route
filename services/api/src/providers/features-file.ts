// Scenic features shipped with the server (infra/data/features/*.json), so plans never depend on a
// public Overpass mirror at drive time. Files are made by scripts/fetch-features.ts.
// A plan whose corridor is covered by a file is answered from it; elsewhere we ask Overpass and,
// if Overpass fails, still return whatever the files hold for that corridor.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { BBox, FeatureSource, ScenicFeature } from '@scenic/core';

export interface FeatureFile {
  region: string;
  /** [south, west, north, east] fully covered by this file */
  bbox: BBox;
  fetchedAt: string;
  attribution: string;
  features: ScenicFeature[];
}

const CELL = 0.1;
const key = (lat: number, lon: number) => `${Math.floor(lat / CELL)},${Math.floor(lon / CELL)}`;
const contains = (outer: BBox, b: BBox) => b[0] >= outer[0] && b[1] >= outer[1] && b[2] <= outer[2] && b[3] <= outer[3];

export class FileFeatures {
  readonly regions: { region: string; bbox: BBox; count: number; fetchedAt: string }[] = [];
  private grid = new Map<string, ScenicFeature[]>();
  constructor(files: FeatureFile[]) {
    const seen = new Set<string>();
    for (const f of files) {
      this.regions.push({ region: f.region, bbox: f.bbox, count: f.features.length, fetchedAt: f.fetchedAt });
      for (const x of f.features) {
        if (seen.has(x.id)) continue;
        seen.add(x.id);
        const k = key(x.lat, x.lon);
        let cell = this.grid.get(k);
        if (!cell) this.grid.set(k, (cell = []));
        cell.push(x);
      }
    }
  }
  static load(dir: string): FileFeatures {
    const files: FeatureFile[] = [];
    if (existsSync(dir)) {
      for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) files.push(JSON.parse(readFileSync(join(dir, f), 'utf8')));
    }
    return new FileFeatures(files);
  }
  /** True when one shipped region covers the whole bbox. */
  covers(b: BBox): boolean {
    return this.regions.some((r) => contains(r.bbox, b));
  }
  /** Share of the bbox's area inside shipped regions (0..1, regions assumed not to overlap). */
  coverage(b: BBox): number {
    const area = (x: BBox) => Math.max(0, x[2] - x[0]) * Math.max(0, x[3] - x[1]);
    const total = area(b) || 1;
    let inside = 0;
    for (const r of this.regions) inside += area([Math.max(b[0], r.bbox[0]), Math.max(b[1], r.bbox[1]), Math.min(b[2], r.bbox[2]), Math.min(b[3], r.bbox[3])]);
    return Math.min(1, inside / total);
  }
  inBBox(b: BBox): ScenicFeature[] {
    const out: ScenicFeature[] = [];
    for (let i = Math.floor(b[0] / CELL); i <= Math.floor(b[2] / CELL); i++) {
      for (let j = Math.floor(b[1] / CELL); j <= Math.floor(b[3] / CELL); j++) {
        for (const x of this.grid.get(`${i},${j}`) ?? []) {
          if (x.lat >= b[0] && x.lat <= b[2] && x.lon >= b[1] && x.lon <= b[3]) out.push(x);
        }
      }
    }
    return out;
  }
}

export class LayeredFeatures implements FeatureSource {
  readonly attribution = 'Scenic places: © OpenStreetMap contributors (ODbL)';
  private local: FileFeatures;
  private remote?: FeatureSource;
  constructor(local: FileFeatures, remote?: FeatureSource) {
    this.local = local;
    this.remote = remote;
  }
  async features(b: BBox): Promise<ScenicFeature[]> {
    // Mostly inside a shipped region: answer locally rather than wait up to 30 s on a public mirror
    // for the last edge of the corridor.
    if (this.local.coverage(b) >= 0.6 || !this.remote) return this.local.inBBox(b);
    try {
      return await this.remote.features(b);
    } catch (e) {
      const partial = this.local.inBBox(b);
      if (partial.length) return partial;
      throw e;
    }
  }
}
