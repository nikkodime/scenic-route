export interface RegionGeo { short: string; country: string; lat: number; lon: number; radiusKm: number }
export const REGION_GEO: Record<string, RegionGeo>;
export function kmBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number;
export function nearestRegion(p: { lat: number; lon: number }): string;
