// Elevation from our own SRTM-derived HGT tiles (the Mapzen "skadi" set on AWS Open Data), so hill
// scores never depend on a rate-limited public API. Tiles are fetched once per region by scripts/fetch-dem.ts.
// Layout: <DEM_DIR>/N43/N43E011.hgt(.gz). A .gz tile is unpacked to .hgt beside it on first use, then read
// with positioned reads (4 values per point), so memory stays flat even for all of Europe.
// Points on tiles we don't have are passed to the fallback source, if any.

import { closeSync, existsSync, openSync, readSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import type { ElevationSource, LatLon } from '@scenic/core';

export function tileName(lat: number, lon: number): { dir: string; name: string } {
  const la = Math.floor(lat), lo = Math.floor(lon);
  const ns = la >= 0 ? `N${String(la).padStart(2, '0')}` : `S${String(-la).padStart(2, '0')}`;
  const ew = lo >= 0 ? `E${String(lo).padStart(3, '0')}` : `W${String(-lo).padStart(3, '0')}`;
  return { dir: ns, name: `${ns}${ew}` };
}

interface Tile {
  fd: number;
  size: number; // samples per side: 3601 (1") or 1201 (3")
}

const VOID = -32768;

export class HgtElevation implements ElevationSource {
  readonly attribution = 'Elevation: SRTM and other open sources via Mapzen terrain tiles (AWS Open Data)';
  private tiles = new Map<string, Tile | null>();
  private buf = Buffer.alloc(4);
  private dir: string;
  private fallback?: ElevationSource;
  constructor(dir: string, fallback?: ElevationSource) {
    this.dir = dir;
    this.fallback = fallback;
  }

  private tile(lat: number, lon: number): Tile | null {
    const { dir, name } = tileName(lat, lon);
    const cached = this.tiles.get(name);
    if (cached !== undefined) return cached;
    const raw = join(this.dir, dir, `${name}.hgt`);
    const gz = raw + '.gz';
    let t: Tile | null = null;
    try {
      if (!existsSync(raw) && existsSync(gz)) writeFileSync(raw, gunzipSync(readFileSync(gz)));
      if (existsSync(raw)) {
        const size = Math.round(Math.sqrt(statSync(raw).size / 2));
        if (size === 3601 || size === 1201) t = { fd: openSync(raw, 'r'), size };
      }
    } catch {
      t = null;
    }
    this.tiles.set(name, t);
    return t;
  }

  private sample(t: Tile, row: number, col: number): number | null {
    readSync(t.fd, this.buf, 0, 2, (row * t.size + col) * 2);
    const v = this.buf.readInt16BE(0);
    return v === VOID ? null : v;
  }

  /** Bilinear elevation in metres, or null (no tile, or void). Row 0 is the tile's north edge. */
  at(p: LatLon): number | null {
    const t = this.tile(p.lat, p.lon);
    if (!t) return null;
    const n = t.size - 1;
    const y = (Math.floor(p.lat) + 1 - p.lat) * n;
    const x = (p.lon - Math.floor(p.lon)) * n;
    const r0 = Math.min(n - 1, Math.max(0, Math.floor(y))), c0 = Math.min(n - 1, Math.max(0, Math.floor(x)));
    const fy = Math.min(1, Math.max(0, y - r0)), fx = Math.min(1, Math.max(0, x - c0));
    const v = [this.sample(t, r0, c0), this.sample(t, r0, c0 + 1), this.sample(t, r0 + 1, c0), this.sample(t, r0 + 1, c0 + 1)];
    const w = [(1 - fy) * (1 - fx), (1 - fy) * fx, fy * (1 - fx), fy * fx];
    let sum = 0, wsum = 0;
    v.forEach((x, i) => { if (x != null) { sum += x * w[i]; wsum += w[i]; } });
    if (wsum < 1e-9) {
      // Sitting on a void sample: use whichever neighbours are valid.
      const ok = v.filter((x): x is number => x != null);
      if (!ok.length) return null;
      sum = ok.reduce((a, b) => a + b, 0);
      wsum = ok.length;
    }
    return Math.round((sum / wsum) * 10) / 10;
  }

  async elevations(points: LatLon[]): Promise<(number | null)[]> {
    const out = points.map((p) => this.at(p));
    const missing = out.flatMap((v, i) => (v == null && !this.tile(points[i].lat, points[i].lon) ? [i] : []));
    if (missing.length && this.fallback) {
      try {
        const extra = await this.fallback.elevations(missing.map((i) => points[i]));
        missing.forEach((i, j) => (out[i] = extra[j]));
      } catch {
        // Keep what we have; relief is scored from the known points.
      }
    }
    return out;
  }

  close() {
    for (const t of this.tiles.values()) if (t) closeSync(t.fd);
    this.tiles.clear();
  }
}
