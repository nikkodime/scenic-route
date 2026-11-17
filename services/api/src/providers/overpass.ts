// Scenic features from Overpass. Bboxes are snapped to a 0.1° grid so nearby plans share cache entries.

import { overpassQuery, parseOverpass, type BBox, type FeatureSource, type ScenicFeature } from '@scenic/core';
import type { Http } from '../http.ts';
import { TtlCache } from '../cache.ts';

export function snapBBox(b: BBox, step = 0.1): BBox {
  const down = (x: number) => Math.floor(x / step + 1e-9) * step;
  const up = (x: number) => Math.ceil(x / step - 1e-9) * step;
  return [down(b[0]), down(b[1]), up(b[2]), up(b[3])].map((x) => Math.round(x * 1000) / 1000) as BBox;
}

export class OverpassFeatures implements FeatureSource {
  readonly attribution = 'Scenic places: © OpenStreetMap contributors (ODbL)';
  private cache = new TtlCache<ScenicFeature[]>(200);
  private http: Http;
  private urls: string[];
  constructor(http: Http, urls: string[]) {
    this.http = http;
    this.urls = urls;
  }
  features(bbox: BBox): Promise<ScenicFeature[]> {
    const b = snapBBox(bbox);
    return this.cache.wrap(b.join(','), 24 * 3600_000, async () => {
      let last: unknown;
      // All mirrors together get 30 s, so a plan still fits inside the iOS client's 45 s timeout.
      const deadline = Date.now() + 30_000;
      for (const url of this.urls) {
        const timeoutMs = Math.min(25_000, deadline - Date.now());
        if (timeoutMs < 3_000) break;
        try {
          const json = await this.http.json(url, {
            method: 'POST', body: 'data=' + encodeURIComponent(overpassQuery(b)),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeoutMs, retries: 0,
          });
          return parseOverpass(json);
        } catch (e) { last = e; }
      }
      throw last;
    });
  }
}
