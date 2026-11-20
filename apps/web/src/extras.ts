// Route extras for the planner: golden-hour departure, weather along the way, stops worth making,
// and the share card + share link. Kept apart from main.ts so each can be gated per plan later.

import { decodePolyline, type Place, type RouteOption, type RouteStyle, type Interest, type Vehicle } from '@scenic/core';
import { icon } from './icons.ts';
import { nearestRegion } from '@scenic/islands/regions';
import { duration } from './journey.ts';

type Stop = NonNullable<RouteOption['suggestedStops']>[number];
type Conditions = NonNullable<RouteOption['conditions']>;

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const hhmm = (iso?: string | null) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

/** The value an <input type="datetime-local"> holds, in the browser's time zone. */
export function localInputValue(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** "Leave 15:40 · golden light at Pienza": one tap re-plans with that departure. */
export function goldenChip(c: Conditions, day: number): string {
  const g = c.goldenDeparture;
  if (!g) return '';
  if (g.onTime) return `<p class="note good">${icon('sunset', 16)}<span>Golden light ${g.place ? `at ${esc(g.place)} ` : ''}around ${hhmm(g.reachAt)}</span></p>`;
  const tomorrow = new Date(g.leaveAt).toDateString() !== new Date(c.departure).toDateString();
  return `<button class="golden" data-action="golden" data-day="${day}" data-at="${esc(g.leaveAt)}">
    ${icon('sunset', 18)}<span><b>Leave ${tomorrow ? 'tomorrow ' : ''}${hhmm(g.leaveAt)}</b><small>Golden light${g.place ? ` at ${esc(g.place)}` : ''} · ${hhmm(g.reachAt)}</small></span>${icon('chevron', 14)}
  </button>`;
}

function weatherIcon(w: Conditions['weather'][number]): string {
  if (w.fog) return 'fog';
  if (w.precipProb >= 50) return 'rain';
  if (w.cloud >= 60) return 'cloud';
  return 'sun';
}

/** Weather where you'll be, when you'll be there: time, icon, cloud. */
export function weatherStrip(c: Conditions): string {
  if (!c.weather.length) return '';
  return `<div class="wx" role="list" aria-label="Weather along the route">${c.weather.map((w) => `
    <div role="listitem" aria-label="km ${w.atKm} at ${hhmm(w.eta)}: ${w.cloud}% cloud, ${w.precipProb}% rain">
      <small>${hhmm(w.eta)}</small>${icon(weatherIcon(w), 20)}<b>${Math.round(w.precipProb >= 30 ? w.precipProb : w.cloud)}%</b><small>km ${w.atKm}</small>
    </div>`).join('')}</div>`;
}

export const STOP_ICON: Record<Stop['kind'], string> = { viewpoint: 'views', cafe: 'coffee', agriturismo: 'lunch', winery: 'wine' };
const REASON: Record<Stop['reason'], string> = { view: 'Pull over', coffee: 'Coffee', lunch: 'Lunch', wine: 'Wine' };

/** Stops worth making: photo for viewpoints, icon for the rest; one tap adds it to the drive. */
export function stopsStrip(r: RouteOption, day: number, photoSlot: (lat: number, lon: number, name: string, fallback: string, cls?: string) => string): string {
  const stops = r.suggestedStops ?? [];
  if (!stops.length) return '';
  return `<span class="label">Worth a stop</span>
  <div class="strip">${stops.map((s) => `
    <div class="hl stop">
      ${s.kind === 'viewpoint' ? photoSlot(s.lat, s.lon, s.name, 'views', 'hl-photo') : `<div class="hl-photo icon-only">${icon(STOP_ICON[s.kind], 34)}</div>`}
      <span class="badge k">${icon(STOP_ICON[s.kind], 13)}</span>
      <b>${esc(s.name || 'Viewpoint')}</b>
      <small class="muted">${REASON[s.reason]} · ${hhmm(s.eta)} · km ${Math.round(s.atKm)}</small>
      <button class="btn link small" data-action="add-stop" data-day="${day}" data-lat="${s.lat}" data-lon="${s.lon}" data-name="${esc(s.name || 'Viewpoint')}">${icon('plus', 13)} Add</button>
    </div>`).join('')}</div>`;
}

// ---------- share link ----------

export interface SharedPlan {
  origin: Place;
  destination: Place;
  stops: Place[];
  style?: RouteStyle;
  interests?: Interest[];
  vehicle?: Vehicle;
}

const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));
const pl = (p: Place) => [Math.round(p.lat * 1e5) / 1e5, Math.round(p.lon * 1e5) / 1e5, p.label ?? ''];
const unpl = (a: unknown): Place | null => (Array.isArray(a) && typeof a[0] === 'number' && typeof a[1] === 'number' ? { lat: a[0], lon: a[1], label: typeof a[2] === 'string' && a[2] ? a[2] : undefined } : null);

/** A link that opens the planner on the same trip (places and preferences, not the routes themselves). */
export function shareHash(p: SharedPlan): string {
  return `#r=${b64(JSON.stringify({ o: pl(p.origin), d: pl(p.destination), s: p.stops.map(pl), st: p.style, i: p.interests, v: p.vehicle }))}`;
}

export function parseShareHash(hash: string): SharedPlan | null {
  const m = /[#&]r=([\w-]+)/.exec(hash);
  if (!m) return null;
  try {
    const j = JSON.parse(unb64(m[1]));
    const origin = unpl(j.o), destination = unpl(j.d);
    if (!origin || !destination) return null;
    return { origin, destination, stops: (Array.isArray(j.s) ? j.s : []).map(unpl).filter((x: Place | null): x is Place => !!x).slice(0, 8), style: j.st, interests: j.i, vehicle: j.v };
  } catch {
    return null;
  }
}

// ---------- share card ----------
export interface CardInput {
  route: RouteOption;
  title: string;
  photo?: { url: string; credit: string } | null;
  wordmarkUrl: string;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** 1080 × 1350 (4:5, the size social apps show without cropping): photo on top, the route drawn on paper below. */
export async function drawShareCard(canvas: HTMLCanvasElement, { route, title, photo, wordmarkUrl }: CardInput): Promise<void> {
  const W = 1080, H = 1350, PH = 760;
  canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d')!;
  try { await Promise.all(['700 64px "Sofia Sans"', '500 30px "Sofia Sans"', '600 40px "Sofia Sans"'].map((f) => document.fonts.load(f))); } catch {}
  const ink = '#17262a', ink3 = '#7a8786', green = '#1e6b52', paper = '#f5f6f3';
  g.fillStyle = paper; g.fillRect(0, 0, W, H);

  // Photo, cover-fit; a soft green landscape when there is none (or it can't be drawn).
  const img = photo ? await loadImage(photo.url) : null;
  if (img) {
    const s = Math.max(W / img.width, PH / img.height);
    g.drawImage(img, (W - img.width * s) / 2, (PH - img.height * s) / 2, img.width * s, img.height * s);
  } else {
    // No photo along the way: the region's island floats on the morning sky instead.
    const grad = g.createLinearGradient(0, 0, 0, PH);
    grad.addColorStop(0, '#dde8ec'); grad.addColorStop(1, paper);
    g.fillStyle = grad; g.fillRect(0, 0, W, PH);
    const end = decodePolyline(route.polyline).at(-1);
    const isl = end ? await loadImage(`${import.meta.env.BASE_URL}islands/poster-${nearestRegion(end)}.webp`) : null;
    if (isl) g.drawImage(isl, (W - 820) / 2 - 60, PH - 820 + 40, 820, 820);
  }
  if (img && photo?.credit) {
    g.font = '500 20px "Sofia Sans", sans-serif'; g.textAlign = 'right';
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillText(photo.credit.slice(0, 70), W - 26, PH - 22);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillText(photo.credit.slice(0, 70), W - 27, PH - 23);
  }

  // Score stamp on the photo.
  g.save();
  g.translate(W - 130, 130); g.rotate(-0.12);
  g.fillStyle = 'rgba(255,255,255,.82)'; g.beginPath(); g.arc(0, 0, 86, 0, Math.PI * 2); g.fill();
  g.strokeStyle = green; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 74, 0, Math.PI * 2); g.stroke();
  g.fillStyle = green; g.textAlign = 'center';
  g.font = '700 64px "Sofia Sans", sans-serif'; g.fillText(String(Math.round(route.score)), 0, 18);
  g.font = '700 18px "Sofia Sans", sans-serif'; g.fillText('S C E N I C', 0, 48);
  g.restore();

  // The route line, drawn on paper at the right.
  const line = decodePolyline(route.polyline);
  const box = { x: W - 64 - 330, y: PH + 70, w: 330, h: 330 };
  if (line.length > 1) {
    const lats = line.map((p) => p.lat), lons = line.map((p) => p.lon);
    const cos = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
    const spanX = (Math.max(...lons) - Math.min(...lons)) * cos || 1e-6, spanY = Math.max(...lats) - Math.min(...lats) || 1e-6;
    const s = Math.min(box.w / spanX, box.h / spanY);
    const ox = box.x + (box.w - spanX * s) / 2, oy = box.y + (box.h - spanY * s) / 2;
    const X = (p: { lon: number }) => ox + (p.lon - Math.min(...lons)) * cos * s;
    const Y = (p: { lat: number }) => oy + (Math.max(...lats) - p.lat) * s;
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [color, width] of [['#ffffff', 16], [green, 8]] as const) {
      g.strokeStyle = color; g.lineWidth = width; g.beginPath();
      line.forEach((p, i) => (i ? g.lineTo(X(p), Y(p)) : g.moveTo(X(p), Y(p))));
      g.stroke();
    }
    for (const [p, fill] of [[line[0], ink], [line[line.length - 1], green]] as const) {
      g.fillStyle = '#fff'; g.beginPath(); g.arc(X(p), Y(p), 13, 0, Math.PI * 2); g.fill();
      g.fillStyle = fill; g.beginPath(); g.arc(X(p), Y(p), 8, 0, Math.PI * 2); g.fill();
    }
  }

  // Words: the trip, three numbers, the best places.
  const left = 64, textW = box.x - left - 40;
  g.textAlign = 'left'; g.fillStyle = ink;
  let size = 64;
  g.font = `700 ${size}px "Sofia Sans", sans-serif`;
  while (g.measureText(title).width > textW && size > 38) { size -= 2; g.font = `700 ${size}px "Sofia Sans", sans-serif`; }
  g.fillText(title, left, PH + 120);
  g.font = '600 40px "Sofia Sans", sans-serif'; g.fillStyle = green;
  g.fillText(`${duration(route.minutes)}  ·  ${Math.round(route.km)} km`, left, PH + 190);
  const names = [...new Set(route.highlights.map((h) => h.name).filter(Boolean))].slice(0, 4);
  g.font = '500 30px "Sofia Sans", sans-serif'; g.fillStyle = ink3;
  let y = PH + 260;
  for (const n of names) { g.fillText(`·  ${n}`.slice(0, 34), left, y); y += 44; }

  // Footer: wordmark and date.
  g.fillStyle = '#dde2de'; g.fillRect(left, H - 128, W - 2 * left, 2);
  const wm = await loadImage(wordmarkUrl);
  if (wm) g.drawImage(wm, left, H - 92, 260, (260 * wm.height) / wm.width || 38);
  else { g.font = '700 40px "Sofia Sans", sans-serif'; g.fillStyle = ink; g.fillText('Panoramica', left, H - 56); }
  g.font = '500 26px "Sofia Sans", sans-serif'; g.fillStyle = ink3; g.textAlign = 'right';
  g.fillText(new Date().toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }), W - left, H - 58);
}

/** Share the card (and link) with the system sheet; download the PNG and copy the link where that isn't possible. */
export async function shareCard(canvas: HTMLCanvasElement, title: string, url: string): Promise<'shared' | 'downloaded'> {
  let blob: Blob | null = null;
  try { blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png')); } catch { blob = null; }
  const file = blob ? new File([blob], 'panoramica-drive.png', { type: 'image/png' }) : null;
  const text = `${title}: a scenic drive on Panoramica`;
  if (file && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title, text, url }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'shared'; }
  }
  if (blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'panoramica-drive.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  try { await navigator.clipboard.writeText(url); } catch {}
  return 'downloaded';
}

export const shareTitle = (origin?: Place | null, destination?: Place | null, via?: Place | null) => {
  const s = (p?: Place | null) => (p?.label ?? '').split(',')[0];
  return via ? `${s(origin)} loop via ${s(via)}` : `${s(origin)} → ${s(destination)}`;
};
