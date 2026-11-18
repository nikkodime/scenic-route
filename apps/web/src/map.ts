// MapLibre map: chosen route in scenic green with a white halo, alternatives in dotted lake blue, numbered stops,
// and the fastest road as a dashed grey ghost line with "+12 min" chips where the chosen route leaves it.

import maplibregl, { type LngLatBoundsLike, type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cumulativeKm, decodePolyline, pointAtKm, type RouteOption } from '@scenic/core';

const BLANK: StyleSpecification = { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#e9ece6' } }] };

/** Map style: ?mapStyle=blank for tests; VITE_MAP_STYLE in production (self-hosted PMTiles, terrain style per DESIGN.md). */
function styleUrl(): string | StyleSpecification {
  const q = new URLSearchParams(location.search).get('mapStyle');
  if (q === 'blank') return BLANK;
  return (import.meta.env.VITE_MAP_STYLE as string | undefined) ?? 'https://tiles.openfreemap.org/styles/positron';
}

export class RouteMap {
  readonly map: maplibregl.Map;
  private ready: Promise<void>;
  private markers: maplibregl.Marker[] = [];
  onPick?: (routeId: string) => void;

  constructor(el: HTMLElement) {
    this.map = new maplibregl.Map({ container: el, style: styleUrl(), center: [11.25, 43.3], zoom: 8, attributionControl: { compact: true } });
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    this.ready = new Promise((res) => this.map.on('load', () => res()));
    this.map.on('error', (e) => {
      // A failed tile style must not leave a blank, broken page.
      if (String(e.error?.message ?? '').includes('style')) this.map.setStyle(BLANK);
    });
  }

  async show(routes: RouteOption[], chosenId: string | null, fastest?: { polyline?: string }) {
    await this.ready;
    const fc = (pred: (r: RouteOption) => boolean) => ({
      type: 'FeatureCollection' as const,
      features: routes.filter(pred).map((r) => ({ type: 'Feature' as const, properties: { id: r.id }, geometry: { type: 'LineString' as const, coordinates: decodePolyline(r.polyline).map((p) => [p.lon, p.lat]) } })),
    });
    const chosen = routes.find((r) => r.id === chosenId) ?? routes[0];
    const alt = fc((r) => r !== chosen);
    const sel = fc((r) => r === chosen);
    // The ghost: only when the chosen route isn't the fastest road itself.
    const ghostLine = fastest?.polyline && chosen?.source !== 'fastest' ? decodePolyline(fastest.polyline) : [];
    const fast = { type: 'FeatureCollection' as const, features: ghostLine.length ? [{ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: ghostLine.map((p) => [p.lon, p.lat]) } }] : [] };
    for (const [id, data] of [['fast', fast], ['alt', alt], ['sel', sel]] as const) {
      const src = this.map.getSource(id) as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(data); else this.map.addSource(id, { type: 'geojson', data });
    }
    if (!this.map.getLayer('alt-line')) {
      this.map.addLayer({ id: 'fast-line', type: 'line', source: 'fast', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#7a8786', 'line-width': 3.5, 'line-opacity': 0.9, 'line-dasharray': [2, 1.6] } });
      this.map.addLayer({ id: 'alt-line', type: 'line', source: 'alt', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#2e5e8c', 'line-width': 4, 'line-opacity': 0.85, 'line-dasharray': [1, 1.6] } });
      this.map.addLayer({ id: 'sel-casing', type: 'line', source: 'sel', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': 11 } });
      this.map.addLayer({ id: 'sel-line', type: 'line', source: 'sel', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#1e6b52', 'line-width': 7 } });
      this.map.on('click', 'alt-line', (e) => { const id = e.features?.[0]?.properties?.id; if (id) this.onPick?.(String(id)); });
      this.map.on('mouseenter', 'alt-line', () => (this.map.getCanvas().style.cursor = 'pointer'));
      this.map.on('mouseleave', 'alt-line', () => (this.map.getCanvas().style.cursor = ''));
    }
    this.markers.forEach((m) => m.remove());
    this.markers = (chosen?.scenicStops ?? []).map((s, i) => {
      const el = document.createElement('div');
      el.className = 'stop-marker';
      el.textContent = String(i + 1);
      el.title = s.name || 'Scenic spot';
      return new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(this.map);
    });
    // A chip on each detour, halfway along it: what it costs.
    if (ghostLine.length && chosen?.vsFastest) {
      const line = decodePolyline(chosen.polyline);
      const cum = cumulativeKm(line);
      const scale = cum[cum.length - 1] / (chosen.km || 1);
      for (const d of chosen.vsFastest.detours) {
        if (d.extraMinutes < 1) continue;
        const el = document.createElement('div');
        el.className = 'detour-chip';
        el.textContent = `+${d.extraMinutes} min`;
        el.title = d.name ? `Detour by ${d.name}` : 'Detour';
        const { point } = pointAtKm(line, ((d.fromKm + d.toKm) / 2) * scale, cum);
        this.markers.push(new maplibregl.Marker({ element: el }).setLngLat([point.lon, point.lat]).addTo(this.map));
      }
    }
    if (chosen && chosen.bbox.some((x) => x !== 0)) this.fit(chosen);
  }

  /** Explore: the road to each place, the best one solid, the others dotted, a dot at each place. */
  async showPlaces(places: { lat: number; lon: number; name: string; polyline: string }[]) {
    const routes = places.map((p, i) => ({ id: String(i), polyline: p.polyline, scenicStops: [], bbox: [0, 0, 0, 0] })) as unknown as RouteOption[];
    await this.show(routes, '0');
    this.markers.forEach((m) => m.remove());
    this.markers = places.map((p, i) => {
      const el = document.createElement('div');
      el.className = 'stop-marker';
      el.textContent = String(i + 1);
      el.title = p.name;
      return new maplibregl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(this.map);
    });
    const pts = places.flatMap((p) => decodePolyline(p.polyline));
    if (pts.length) {
      const lats = pts.map((p) => p.lat), lons = pts.map((p) => p.lon);
      this.map.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]] as LngLatBoundsLike, { padding: 60, duration: 600 });
    }
  }

  fit(r: RouteOption) {
    const [s, w, n, e] = r.bbox;
    this.map.fitBounds([[w, s], [e, n]] as LngLatBoundsLike, { padding: 60, duration: 600 });
  }

  async clear() {
    await this.ready;
    for (const id of ['fast', 'alt', 'sel']) (this.map.getSource(id) as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: [] });
    this.markers.forEach((m) => m.remove());
  }
}
