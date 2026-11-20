// The island stage: when the map has nothing to show (or roads are being found), a big live 3D island
// of the area floats over it, with the eight regions to jump to. The engine loads lazily, after first paint.
// In dark mode the island sits in evening light (the engine's dusk mood) on a night sky.
import { REGION_GEO, nearestRegion } from '@scenic/islands/regions';
import type { IslandController } from '@scenic/islands';
import { mode, onMode, type Mode } from './appearance.ts';

export interface StageState { show: boolean; busy: boolean; near: { lat: number; lon: number } | null }

const TITLES: Record<string, string> = {
  tuscany: 'Val d’Orcia, Tuscany', dolomites: 'Passo Giau, Dolomites', amalfi: 'Costiera Amalfitana', sardinia: 'Costa Smeralda, Sardinia',
  moselle: 'Moselle valley', fjord: 'Geirangerfjord', bardenas: 'Bardenas Reales', highlands: 'Glen Coe, Scottish Highlands',
};

export class IslandStage {
  onPickRegion: (key: string, place: { lat: number; lon: number; label: string }) => void = () => {};
  private el: HTMLElement;
  private live: HTMLElement;
  private poster: HTMLImageElement;
  private caption: HTMLElement;
  private chips: HTMLElement;
  private ctl: IslandController | null = null;
  private loading = false;
  private region = 'tuscany';

  constructor(host: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'island-stage';
    this.el.hidden = true;
    this.el.innerHTML = `<div class="island-live" aria-hidden="true"><img class="island-poster" alt="" /></div>
      <div class="island-foot">
        <p class="island-caption" aria-live="polite"></p>
        <div class="island-chips" role="group" aria-label="Explore a region"></div>
      </div>`;
    host.append(this.el);
    this.live = this.el.querySelector('.island-live')!;
    this.poster = this.el.querySelector('.island-poster')!;
    this.caption = this.el.querySelector('.island-caption')!;
    this.chips = this.el.querySelector('.island-chips')!;
    this.chips.innerHTML = Object.entries(REGION_GEO).map(([k, g]) => `<button class="chip" data-region="${k}">${g.short}</button>`).join('');
    this.chips.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-region]');
      if (!b) return;
      const k = b.dataset.region!, g = REGION_GEO[k];
      this.setRegion(k);
      this.onPickRegion(k, { lat: g.lat, lon: g.lon, label: TITLES[k] });
    });
    this.paintPoster();
    onMode((m) => { this.ctl?.setMood(mood(m)); this.paintPoster(); });
  }

  sync(s: StageState) {
    this.el.hidden = !s.show;
    this.el.classList.toggle('busy', s.busy);
    if (s.near) this.setRegion(nearestRegion(s.near));
    this.caption.textContent = s.busy ? 'Finding beautiful roads' : TITLES[this.region];
    if (s.show) this.ensureLive();
  }

  private setRegion(k: string) {
    if (k === this.region) return;
    this.region = k;
    this.ctl?.setRegion(k);
    if (!this.ctl) this.paintPoster();
    for (const b of this.chips.querySelectorAll<HTMLButtonElement>('button')) b.setAttribute('aria-pressed', String(b.dataset.region === k));
  }

  private paintPoster() {
    this.poster.src = `${import.meta.env.BASE_URL}islands/poster-${this.region}${mode() === 'dark' ? '-dusk' : ''}.webp`;
    for (const b of this.chips.querySelectorAll<HTMLButtonElement>('button')) b.setAttribute('aria-pressed', String(b.dataset.region === this.region));
  }

  private async ensureLive() {
    if (this.ctl || this.loading) return;
    this.loading = true;
    try {
      const { mountIsland } = await import('@scenic/islands');
      const wide = () => this.live.clientWidth > this.live.clientHeight;
      this.ctl = mountIsland(this.live, {
        region: this.region, fit: wide() ? 0.8 : 1.05, lift: 0.06, mood: mood(mode()),
        onReady: () => this.el.classList.add('ready'),
      });
    } catch {
      // No WebGL: the still stays.
    } finally {
      this.loading = false;
    }
  }
}

const mood = (m: Mode): 'day' | 'dusk' => (m === 'dark' ? 'dusk' : 'day');
