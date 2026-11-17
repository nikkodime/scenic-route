// What counts as scenic in OpenStreetMap, and how much each kind is worth.

import type { BBox } from './geo.ts';

export const FEATURE_TYPES = [
  'viewpoint', 'mountain_pass', 'peak', 'castle', 'hilltop_village', 'village', 'heritage',
  'beach', 'lake', 'coast', 'waterfall', 'vineyard', 'cypress', 'scenic_road', 'attraction',
] as const;
export type FeatureType = (typeof FEATURE_TYPES)[number];

export interface ScenicFeature {
  id: string;
  lat: number;
  lon: number;
  type: FeatureType;
  weight: number;
  name: string;
}

/** Tuned by hand for Tuscany; ratings from test drives adjust these (see docs/ARCHITECTURE.md §5.3). */
export const FEATURE_WEIGHTS: Record<FeatureType, number> = {
  viewpoint: 5,
  mountain_pass: 5,
  peak: 2.5,
  castle: 3,
  hilltop_village: 2,
  village: 1,
  heritage: 2,
  beach: 3,
  lake: 3,
  coast: 2.5,
  waterfall: 3,
  vineyard: 1.5,
  cypress: 3,
  scenic_road: 4,
  attraction: 1.5,
};

/** Which landscape family a feature belongs to (used for the variety score). */
export const FEATURE_FAMILY: Record<FeatureType, 'views' | 'mountains' | 'heritage' | 'water' | 'countryside' | 'roads'> = {
  viewpoint: 'views', mountain_pass: 'mountains', peak: 'mountains', castle: 'heritage',
  hilltop_village: 'heritage', village: 'heritage', heritage: 'heritage', beach: 'water', lake: 'water',
  coast: 'water', waterfall: 'water', vineyard: 'countryside', cypress: 'countryside',
  scenic_road: 'roads', attraction: 'heritage',
};

export const FEATURE_LABEL: Record<FeatureType, [one: string, many: string]> = {
  viewpoint: ['viewpoint', 'viewpoints'],
  mountain_pass: ['pass', 'passes'],
  peak: ['hill or peak', 'hills and peaks'],
  castle: ['castle', 'castles'],
  hilltop_village: ['hill town', 'hill towns'],
  village: ['village', 'villages'],
  heritage: ['abbey or old church', 'abbeys and old churches'],
  beach: ['beach', 'beaches'],
  lake: ['lake', 'lakes'],
  coast: ['stretch of coast', 'stretches of coast'],
  waterfall: ['waterfall', 'waterfalls'],
  vineyard: ['vineyard', 'vineyards'],
  cypress: ['cypress avenue', 'cypress avenues'],
  scenic_road: ['scenic road', 'scenic roads'],
  attraction: ['sight', 'sights'],
};

/** Overpass QL for scenic features inside bbox. */
export function overpassQuery(bbox: BBox): string {
  const b = bbox.map((x) => x.toFixed(5)).join(',');
  return `[out:json][timeout:40];
(
  node["tourism"="viewpoint"](${b});
  node["mountain_pass"="yes"](${b});
  node["natural"="peak"](${b});
  nwr["historic"~"^(castle|fort|tower)$"](${b});
  nwr["historic"~"^(monastery|church|abbey)$"](${b});
  node["place"~"^(village|hamlet)$"](${b});
  nwr["natural"="beach"](${b});
  way["natural"="water"]["water"~"^(lake|reservoir)$"](${b});
  way["natural"="coastline"](${b});
  node["waterway"="waterfall"](${b});
  way["landuse"="vineyard"](${b});
  way["natural"="tree_row"]["species"~"Cupressus",i](${b});
  way["natural"="tree_row"]["genus"="Cupressus"](${b});
  way["scenic"="yes"]["highway"](${b});
  node["tourism"="attraction"](${b});
);
out center tags;`;
}

export function classify(tags: Record<string, string> | undefined): FeatureType | null {
  if (!tags) return null;
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.mountain_pass === 'yes') return 'mountain_pass';
  if (tags.natural === 'peak') return 'peak';
  if (['castle', 'fort', 'tower'].includes(tags.historic)) return 'castle';
  if (['monastery', 'abbey', 'church'].includes(tags.historic)) return 'heritage';
  if (tags.natural === 'beach') return 'beach';
  if (tags.natural === 'water') return 'lake';
  if (tags.natural === 'coastline') return 'coast';
  if (tags.waterway === 'waterfall') return 'waterfall';
  if (tags.landuse === 'vineyard') return 'vineyard';
  if (tags.natural === 'tree_row') return 'cypress';
  if (tags.scenic === 'yes' && tags.highway) return 'scenic_road';
  if (tags.place === 'village' || tags.place === 'hamlet') {
    return parseFloat(tags.ele) >= 250 ? 'hilltop_village' : 'village';
  }
  if (tags.tourism === 'attraction') return 'attraction';
  return null;
}

interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Overpass JSON → scenic features. */
export function parseOverpass(json: { elements?: OsmElement[] } | null | undefined): ScenicFeature[] {
  const out: ScenicFeature[] = [];
  for (const el of json?.elements ?? []) {
    const type = classify(el.tags);
    if (!type) continue;
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    let weight = FEATURE_WEIGHTS[type];
    if (type === 'peak' && el.tags?.ele) weight += Math.min(2.5, parseFloat(el.tags.ele) / 600 || 0);
    out.push({ id: `${el.type}/${el.id}`, lat, lon, type, weight, name: el.tags?.name || '' });
  }
  return out;
}
