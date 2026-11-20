export interface IslandOptions { region?: string; air?: boolean; sea?: boolean; fit?: number; lift?: number; interactive?: boolean; fps?: number; motion?: boolean; phase?: number; mood?: 'day' | 'dusk'; onReady?: () => void }
export interface IslandController { readonly region: string; setRegion(k: string, animate?: boolean): void; setMotion(on: boolean): void; setMood(m: 'day' | 'dusk'): void; readonly mood: 'day' | 'dusk'; turn(delta: number): void; destroy(): void }
export function mountIsland(el: HTMLElement, opts?: IslandOptions): IslandController;
export const REGIONS: Record<string, { title: string; country: string }>;
export const REGION_KEYS: string[];
export const LOOP: number;
