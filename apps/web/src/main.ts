import './theme.css';
import { toGpx, decodePolyline, INTERESTS, ROUTE_STYLES, VEHICLES, type GeocodeResult, type Interest, type RouteOption, type RouteStyle, type Trip, type Vehicle } from '@scenic/core';
import { api } from './api.ts';
import type { ExploreDestination, ExploreResponse, Place } from '@scenic/core';
import { RouteMap } from './map.ts';
import { icon } from './icons.ts';
import {
  INTEREST_LABELS, LIMIT_CHOICES, STYLE_BLURBS, STYLE_LABELS, VEHICLE_LABELS, addDay, normalize, toggleInterest, updateJourney, chosenRoute, defaultName, duration, fromTrip, newJourney, removeDay, toTrip, totals, updateDay,
  type DayPlan, type Journey,
} from './journey.ts';

interface State {
  journey: Journey;
  active: number;
  busy: number | null;
  error: string | null;
  view: 'plan' | 'explore' | 'trips';
  trips: Trip[] | null;
  explore: { origin: Place | null; minutes: number; roundTrip: boolean; result: ExploreResponse | null; busy: boolean };
}

/** Drive-time choices for Explore. */
const EXPLORE_TIMES: [number, string][] = [[60, '1 h'], [120, '2 h'], [240, 'Half day']];

const uuid = () => crypto.randomUUID();
const DRAFT_KEY = 'scenic.draft';
const loadDraft = (): Journey | null => { try { const s = localStorage.getItem(DRAFT_KEY); return s ? normalize(JSON.parse(s)) : null; } catch { return null; } };
const saveDraft = (j: Journey) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(j)); } catch {} };

const state: State = { journey: loadDraft() ?? newJourney(uuid()), active: 0, busy: null, error: null, view: 'plan', trips: null, explore: { origin: null, minutes: 120, roundTrip: false, result: null, busy: false } };
const panel = document.getElementById('panel')!;
const map = new RouteMap(document.getElementById('map')!);
map.onPick = (id) => { const d = state.journey.days[state.active]; if (d) set({ journey: updateDay(state.journey, state.active, { chosenRouteId: id }) }); };

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const short = (label?: string | null) => (label ?? '').split(',')[0];

function set(patch: Partial<State>) {
  Object.assign(state, patch);
  saveDraft(state.journey);
  render();
  syncMap();
}

function syncMap() {
  if (state.view === 'explore') {
    const res = state.explore.result;
    if (res?.destinations.length) map.showPlaces(res.destinations);
    else map.clear();
    return;
  }
  const d = state.journey.days[state.active];
  if (d?.plan?.routes.length) map.show(d.plan.routes, d.chosenRouteId, d.plan.fastest);
  else map.clear();
}

function toast(msg: string) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

// ---------- rendering ----------

function render() {
  const open = panel.querySelector('details.prefs')?.hasAttribute('open');
  panel.innerHTML = state.view === 'trips' ? tripsView() : state.view === 'explore' ? exploreView() : planView();
  if (open) panel.querySelector('details.prefs')?.setAttribute('open', '');
  loadPhotos();
}

function modeSwitch(): string {
  return `<div class="seg" role="group" aria-label="Mode">
    <button data-action="mode" data-v="plan" aria-pressed="${state.view === 'plan'}">Go somewhere</button>
    <button data-action="mode" data-v="explore" aria-pressed="${state.view === 'explore'}">Explore nearby</button>
  </div>`;
}

const SHORT_INTEREST: Record<Interest, string> = { views: 'Views', heritage: 'Villages', water: 'Water', mountains: 'Mountains', countryside: 'Vineyards', quiet: 'Quiet roads' };
const STYLE_CREDIT: Record<RouteStyle, string> = { relaxed: '© Repuli · CC BY-SA 4.0', scenic: '© Costaetrusca · CC BY-SA 4.0', most_beautiful: '© kuhnmi · CC BY 2.0' };
const VEHICLE_ICON: Record<Vehicle, string> = { car: 'car', campervan: 'campervan', caravan: 'caravan' };
const hhmm = (iso?: string | null) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

function header(title: string): string {
  return `<header class="day-head">
      <div><img class="wordmark" src="${import.meta.env.BASE_URL}wordmark.svg" alt="Panoramica" width="150" height="22" /><h1>${title}</h1></div>
      <button class="btn link" data-action="trips">My trips</button>
    </header>`;
}

function styleTiles(): string {
  const j = state.journey;
  return `<div class="cap" id="style-l">Style</div>
    <div class="styles" role="group" aria-labelledby="style-l">
      ${ROUTE_STYLES.map((s) => `<button class="style-tile" data-action="style" data-v="${s}" aria-pressed="${j.style === s}" aria-label="${STYLE_LABELS[s]}" title="${esc(STYLE_BLURBS[s])}">
        <img src="${import.meta.env.BASE_URL}styles/${s}.jpg" alt="" />
        <span class="name">${STYLE_LABELS[s]}</span><span class="credit">${STYLE_CREDIT[s]}</span>
        ${j.style === s ? `<span class="tick">${icon('check', 13)}</span>` : ''}
      </button>`).join('')}
    </div>`;
}

function interestTiles(): string {
  const j = state.journey;
  return `<div class="cap" id="love-l">I'd love</div>
    <div class="tiles" role="group" aria-labelledby="love-l">
      ${INTERESTS.map((x) => `<button class="tile" data-action="interest" data-v="${x}" aria-pressed="${j.interests.includes(x)}" aria-label="${INTEREST_LABELS[x]}">${icon(x)}<span>${SHORT_INTEREST[x]}</span></button>`).join('')}
    </div>`;
}

function vehicleRow(): string {
  const j = state.journey;
  return `<div class="vrow" role="group" aria-label="Vehicle and roads">
      ${VEHICLES.map((v) => `<button class="vbtn" data-action="vehicle" data-v="${v}" aria-pressed="${j.vehicle === v}" aria-label="${VEHICLE_LABELS[v]}" title="${VEHICLE_LABELS[v]}">${icon(VEHICLE_ICON[v], 24)}</button>`).join('')}
      <details class="prefs"><summary class="vbtn" aria-label="Road preferences" title="Road preferences">${icon('settings')}</summary>
        <div class="prefs-pop">${chip('rentalCar', 'Rental car')}${chip('avoidUnpaved', 'No gravel')}${chip('avoidTolls', 'No tolls')}</div>
      </details>
    </div>`;
}

function exploreView(): string {
  const x = state.explore;
  const res = x.result;
  return `
    ${header('Nearby')}
    ${modeSwitch()}
    <div class="places-box">
      <div class="prow">
        <span class="pdot"></span>
        <label class="sr" for="explore-1">From</label>
        <input id="explore-1" class="pinput" autocomplete="off" data-action="place" data-day="-1" data-field="explore" value="${esc(x.origin?.label)}" placeholder="Start" />
        <div class="suggest" hidden data-suggest="explore-1" role="listbox"></div>
      </div>
    </div>
    <div class="tiles four" role="group" aria-label="Drive">
      ${EXPLORE_TIMES.map(([m, t]) => `<button class="tile" data-action="explore-time" data-v="${m}" aria-pressed="${x.minutes === m}">${icon('clock')}<span>${t}</span></button>`).join('')}
      <button class="tile" data-action="explore-loop" aria-pressed="${x.roundTrip}" aria-label="Loop: come back to the start">${icon('loop')}<span>Loop</span></button>
    </div>
    ${interestTiles()}
    ${vehicleRow()}
    <button class="btn primary" data-action="explore" ${x.origin && !x.busy ? '' : 'disabled'}>${x.busy ? '<span class="spin"></span>' : `Find places ${icon('chevron', 16)}`}</button>
    ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ''}
    ${res ? `<div class="places">${res.destinations.map((d, k) => placeCard(d, k)).join('')}</div>
      <p class="attribution">${esc([...res.attribution, 'Photos: Wikimedia Commons'].join(' · '))}</p>` : ''}`;
}

function photoSlot(lat: number, lon: number, name: string, fallback: string, cls = 'photo'): string {
  return `<div class="${cls}" data-photo="${lat},${lon}" data-name="${esc(name)}"><span class="ph-icon">${icon(fallback, 36)}</span></div>`;
}

function placeCard(d: ExploreDestination, k: number): string {
  const sunset = hhmm(d.sunset);
  return `<button class="place" data-action="pick-place" data-k="${k}" aria-label="${esc(d.name)}, ${duration(d.minutes)}, score ${Math.round(d.score)}">
    <div class="ph-wrap">
      ${photoSlot(d.lat, d.lon, d.name, d.families[0] ?? 'views')}
      <span class="glass chip-n"><b>${k + 1}</b>${d.families.slice(0, 3).map((f) => icon(f, 14)).join('')}</span>
      <span class="stamp"><b>${Math.round(d.score)}</b><i>SCENIC</i></span>
    </div>
    <div class="body">
      <h3>${esc(d.name)}</h3>
      <div class="statrow"><span>${icon('clock', 15)}${duration(d.minutes)}</span><span>${icon('dist', 15)}${Math.round(d.km)} km</span>${sunset ? `<span class="sun">${icon('sunset', 15)}${sunset}</span>` : ''}</div>
    </div>
  </button>`;
}

/** Fill photo slots lazily; each photo carries its credit, bottom-right, linked to its source. */
function loadPhotos() {
  panel.querySelectorAll<HTMLElement>('[data-photo]:not([data-loaded])').forEach((el) => {
    el.dataset.loaded = '1';
    const [lat, lon] = el.dataset.photo!.split(',').map(Number);
    api.photos(lat, lon, el.dataset.name).then((ps) => {
      const p = ps[0];
      if (!p) return;
      // Inside a card (a button) the credit can't be a link, so it opens its source on click instead.
      el.innerHTML = `<img src="${esc(p.url)}" alt="${esc(p.title)}" loading="lazy" /><span class="credit" role="link" tabindex="0" data-src="${esc(p.source)}">© ${esc(p.author)} · ${esc(p.license)}</span>`;
    }).catch(() => {});
  });
}

function planView(): string {
  const j = state.journey;
  const t = totals(j);
  return `
    ${header('Where to?')}
    ${modeSwitch()}
    ${styleTiles()}
    ${interestTiles()}
    ${vehicleRow()}
    ${j.days.map((d, i) => dayCard(d, i)).join('')}
    <button class="btn ghost" data-action="add-day">${icon('plus', 16)} Add a day</button>
    ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ''}
    <div class="card totals">
      <input id="jname" class="input" aria-label="Journey name" data-action="name" placeholder="${esc(defaultName(j))}" value="${esc(j.name)}" />
      <div class="statrow"><span>${t.days} ${t.days === 1 ? 'day' : 'days'}</span><span>${icon('dist', 15)}${t.km} km</span><span>${icon('clock', 15)}${duration(t.minutes)}</span></div>
      <button class="btn primary" data-action="save" ${t.planned ? '' : 'disabled'}>Save journey</button>
    </div>
    <p class="attribution">${esc(j.days.find((d) => d.plan)?.plan?.attribution.join(' · ') ?? '© OpenStreetMap contributors')} · Suggestions only: road signs and local rules come first.</p>`;
}

function chip(key: 'rentalCar' | 'avoidUnpaved' | 'avoidTolls', label: string) {
  return `<button class="chip" data-action="pref" data-key="${key}" aria-pressed="${state.journey.prefs[key]}">${label}</button>`;
}

function dayCard(d: DayPlan, i: number): string {
  const busy = state.busy === i;
  const r = chosenRoute(d);
  const many = state.journey.days.length > 1;
  return `
  <section class="day" data-day="${i}" aria-label="Day ${i + 1}">
    ${many ? `<div class="day-head"><div class="cap">Day ${i + 1}</div><button class="btn link" data-action="remove-day" data-day="${i}">Remove</button></div>` : ''}
    <div class="places-box">
      ${placeField(i, 'origin', 'From', d.origin?.label)}
      ${placeField(i, 'destination', 'To', d.destination?.label)}
    </div>
    <div class="when">
      <label class="when-item">${icon('clock', 16)}<span class="sr">Leaving</span><input id="dep${i}" class="input bare" type="datetime-local" data-action="depart" data-day="${i}" value="${esc(d.departAt)}" /></label>
      <div class="seg small" role="group" aria-label="Time limit">
        ${LIMIT_CHOICES.map((m) => `<button data-action="extra" data-day="${i}" data-min="${m ?? ''}" aria-pressed="${d.extraMinutes === m}" ${m == null ? 'aria-label="No limit"' : ''}>${m == null ? 'Any' : m >= 60 ? `+${m / 60} h` : `+${m}`}</button>`).join('')}
      </div>
    </div>
    <button class="btn primary" data-action="plan" data-day="${i}" ${d.origin && d.destination && !busy ? '' : 'disabled'}>${busy ? '<span class="spin"></span>' : `${d.plan ? 'Plan again' : 'Show routes'} ${icon('chevron', 16)}`}</button>
    ${d.plan ? results(d, i) : ''}
    ${r ? detail(r, d.plan?.fastest) : ''}
  </section>`;
}

function placeField(i: number, field: 'origin' | 'destination', label: string, value?: string) {
  return `<div class="prow">
    <span class="pdot ${field === 'destination' ? 'to' : ''}"></span>
    <label class="sr" for="${field}${i}">${label}</label>
    <input id="${field}${i}" class="pinput" autocomplete="off" data-action="place" data-day="${i}" data-field="${field}" value="${esc(value)}" placeholder="${field === 'origin' ? 'Start' : 'Where to?'}" />
    <div class="suggest" hidden data-suggest="${field}${i}" role="listbox"></div>
  </div>`;
}

/** Views, hills, bends, light: icon + number, never adjectives. */
function scoreRow(r: RouteOption) {
  const light = r.conditions ? { great: 100, good: 75, mixed: 45, poor: 15 }[r.conditions.verdict] : null;
  const items: [string, string, number | null][] = [['views', 'Views', r.parts.views ?? r.parts.scenery], ['hills', 'Hills', r.parts.relief ?? 0], ['bends', 'Bends', r.parts.bends], ['sunset', 'Light', light]];
  return `<div class="scores">${items.filter(([, , v]) => v != null).map(([ic, k, v]) => `<span class="${ic === 'sunset' ? 'sun' : ''}" title="${k}" aria-label="${k} ${Math.round(v!)}">${icon(ic, 16)}<b>${Math.round(v!)}</b></span>`).join('')}</div>`;
}

function routePhotoAt(r: RouteOption): { lat: number; lon: number; name: string } {
  const s = r.scenicStops[0];
  if (s) return { lat: s.lat, lon: s.lon, name: s.name };
  const line = decodePolyline(r.polyline);
  const m = line[Math.floor(line.length / 2)] ?? { lat: 0, lon: 0 };
  return { lat: m.lat, lon: m.lon, name: '' };
}

function results(d: DayPlan, i: number) {
  const routes = d.plan!.routes;
  if (!routes.length) return `<p class="muted">No route fits that time. Try “Any”.</p>`;
  return `<div class="routes" role="group" aria-label="Route options">
    ${routes.map((r, k) => {
      const at = routePhotoAt(r);
      return `
      <button class="route" data-action="choose" data-day="${i}" data-route="${esc(r.id)}" aria-pressed="${r.id === (d.chosenRouteId ?? routes[0].id)}">
        <div class="ph-wrap">
          ${photoSlot(at.lat, at.lon, at.name, 'views')}
          <span class="glass chip-n"><i class="swatch s${k % 3}"></i><b>${k + 1}</b></span>
          <span class="stamp"><b>${Math.round(r.score)}</b><i>SCENIC</i></span>
          ${r.scenicStops.length > 1 ? `<span class="thumbs">${r.scenicStops.slice(0, 3).map((s) => photoSlot(s.lat, s.lon, s.name, 'views', 'thumb')).join('')}</span>` : ''}
        </div>
        <div class="body">
          <h3>${esc(r.label)}</h3>
          <div class="statrow"><span>${icon('clock', 15)}${duration(r.minutes)}</span><span>${icon('dist', 15)}${Math.round(r.km)} km</span></div>
          ${vsStrip(r)}
          ${scoreRow(r)}
        </div>
      </button>`;
    }).join('')}
    ${d.plan!.warnings.map((w) => `<p class="note muted small">ⓘ ${esc(w)}</p>`).join('')}
  </div>`;
}

const km = (x: number) => (Math.abs(x) < 1 ? '' : `<span>${x > 0 ? '+' : '−'}${Math.round(Math.abs(x))} km</span>`);

/** "+38 min · +13 km · −€8": what this route costs against the fastest road. */
function vsStrip(r: RouteOption) {
  const v = r.vsFastest;
  if (!v || r.source === 'fastest') return r.source === 'fastest' ? `<div class="vs"><span>Fastest road</span>${r.tolls?.eur ? `<span>≈ €${r.tolls.eur} tolls</span>` : ''}</div>` : '';
  const toll = v.tollSavedEur > 0 ? `<span class="save" title="Tolls compared with the fastest road (estimate)">−€${v.tollSavedEur}</span>` : v.tollSavedEur < 0 ? `<span title="More tolls than the fastest road (estimate)">+€${-v.tollSavedEur}</span>` : '';
  return `<div class="vs" aria-label="Compared with the fastest road"><span>+${duration(v.extraMinutes)}</span>${km(v.extraKm)}${toll}</div>`;
}

/** Time and toll bars against the fastest road, and a ribbon of where the route turns off. */
function compare(r: RouteOption, fastest: { minutes: number; tolls?: { eur: number } }) {
  const v = r.vsFastest;
  if (!v || r.source === 'fastest') return '';
  const maxMin = Math.max(r.minutes, fastest.minutes, 1);
  const tf = fastest.tolls?.eur ?? 0, tr = r.tolls?.eur ?? 0, maxEur = Math.max(tf, tr, 1);
  const bars = (rows: [string, number, number, string][]) => `<div class="cmp">${rows.map(([k, x, max, txt], n) => `<div class="${n === 0 ? 'direct' : ''}"><span>${k}</span><i style="--w:${Math.max(2, (100 * x) / max)}%"></i><b>${txt}</b></div>`).join('')}</div>`;
  return `
    <span class="label">Against the fastest road</span>
    ${bars([['Fastest', fastest.minutes, maxMin, duration(fastest.minutes)], ['This', r.minutes, maxMin, duration(r.minutes)]])}
    ${v.sharedPct < 15 ? `<p class="note">A different road from start to finish.</p>` : v.detours.length ? `<span class="label">Where you turn off</span>${ribbon(r)}` : ''}
    ${tf || tr ? `<span class="label">Tolls, about</span>${bars([['Fastest', tf, maxEur, `€${tf}`], ['This', tr, maxEur, `€${tr}`]])}` : ''}`;
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function ribbon(r: RouteOption) {
  const W = 300, x0 = 8, x1 = W - 8, y = 58, km = r.km || 1;
  const X = (k: number) => x0 + ((x1 - x0) * Math.min(km, Math.max(0, k))) / km;
  const maxMin = Math.max(...r.vsFastest!.detours.map((d) => d.extraMinutes), 1);
  let path = `M${x0} ${y}`;
  const labels: string[] = [];
  // Label the costliest detours first; skip a label that would sit on top of one already placed.
  const placed: number[] = [];
  const labelled = new Set([...r.vsFastest!.detours].sort((a, b) => b.extraMinutes - a.extraMinutes).filter((d) => {
    const cx = (X(d.fromKm) + X(d.toKm)) / 2;
    if (placed.some((p) => Math.abs(p - cx) < 74)) return false;
    placed.push(cx);
    return true;
  }));
  for (const d of r.vsFastest!.detours) {
    const a = X(d.fromKm), b = X(d.toKm), h = 14 + 34 * (d.extraMinutes / maxMin);
    path += ` L${a.toFixed(1)} ${y} Q${((a + b) / 2).toFixed(1)} ${(y - 2 * h).toFixed(1)} ${b.toFixed(1)} ${y}`;
    const cx = Math.min(x1 - 30, Math.max(x0 + 30, (a + b) / 2));
    if (labelled.has(d)) labels.push(`<text x="${cx.toFixed(1)}" y="${y + 18}">${esc(clip(d.name ?? '', 18))}</text><text class="m" x="${cx.toFixed(1)}" y="${y + 32}">+${d.extraMinutes} min</text>`);
  }
  path += ` L${x1} ${y}`;
  return `<svg class="ribbon" viewBox="0 0 ${W} ${y + 38}" role="img" aria-label="Where this route leaves the fastest road">
    <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="g"/><path d="${path}" class="s"/>
    <circle cx="${x0}" cy="${y}" r="4.5" class="a"/><circle cx="${x1}" cy="${y}" r="4.5" class="b"/>${labels.join('')}</svg>`;
}

function detail(r: RouteOption, fastest?: { minutes: number; tolls?: { eur: number } }) {
  const c = r.conditions;
  return `<div class="field">
    ${fastest ? compare(r, fastest) : ''}
    ${c ? `<div class="statrow"><span>${icon('clock', 15)}${hhmm(c.arrival)}</span><span class="sun">${icon('sunset', 15)}${hhmm(c.sunset)}</span></div>` : ''}
    ${(c?.notes ?? []).map((n) => `<p class="note ${/fog|rain|dark|hidden|Low sun/i.test(n) ? 'warn' : /Clear|Golden/.test(n) ? 'good' : 'weather'}">${esc(n)}</p>`).join('')}
    ${r.advisories.map((a) => `<p class="note ${a.severity === 'info' ? 'weather' : 'warn'}"><b>${esc(a.title)}.</b> ${esc(a.detail)}</p>`).join('')}
    ${r.scenicStops.length ? `<div class="strip">${r.scenicStops.map((s, k) => `<div class="hl">${photoSlot(s.lat, s.lon, s.name, 'views', 'hl-photo')}<span class="badge">${k + 1}</span><b>${esc(s.name)}</b></div>`).join('')}</div>` : ''}
    <div class="row">
      <a class="btn" style="display:grid;place-content:center;text-decoration:none" href="${esc(r.handoff.googleMaps)}" target="_blank" rel="noopener">Google Maps</a>
      <button class="btn" data-action="gpx" data-route="${esc(r.id)}">GPX</button>
    </div>
  </div>`;
}

function tripsView(): string {
  const list = state.trips;
  return `
    <header class="day-head">
      <div><img class="wordmark" src="${import.meta.env.BASE_URL}wordmark.svg" alt="Panoramica" width="150" height="22" /><h1>My trips</h1></div>
      <button class="btn link" data-action="back">Back to planner</button>
    </header>
    ${list == null ? '<p class="muted">Loading…</p>' : list.length === 0 ? '<p class="muted">No saved journeys yet.</p>' : list.map((t) => `
      <div class="card">
        <div class="day-head"><h2>${esc(t.name)}</h2><button class="btn link" data-action="delete-trip" data-id="${esc(t.id)}">Delete</button></div>
        <div class="stats">${t.days.length} day${t.days.length === 1 ? '' : 's'} · ${t.days.map((d) => esc(short(d.destination.label))).join(' → ')}</div>
        <button class="btn" data-action="open-trip" data-id="${esc(t.id)}">Open</button>
      </div>`).join('')}
    ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ''}`;
}

// ---------- actions ----------

async function plan(i: number) {
  const d = state.journey.days[i];
  if (!d.origin || !d.destination) return;
  set({ busy: i, error: null, active: i });
  try {
    const res = await api.plan({
      origin: d.origin, destination: d.destination, stops: d.stops ?? [], extraMinutes: d.extraMinutes ?? undefined,
      style: state.journey.style, interests: state.journey.interests, vehicle: state.journey.vehicle,
      departAt: d.departAt ? new Date(d.departAt).toISOString() : undefined, prefs: state.journey.prefs,
    });
    set({ busy: null, journey: updateDay(state.journey, i, { plan: res, chosenRouteId: res.routes[0]?.id ?? null }) });
  } catch (e) {
    set({ busy: null, error: (e as Error).message });
  }
}

async function runExplore() {
  const x = state.explore;
  if (!x.origin) return;
  set({ explore: { ...x, busy: true, result: null }, error: null });
  try {
    const result = await api.explore({ origin: x.origin, maxMinutes: x.minutes, mode: x.roundTrip ? 'round_trip' : 'one_way', interests: state.journey.interests, vehicle: state.journey.vehicle, prefs: state.journey.prefs });
    set({ explore: { ...state.explore, busy: false, result } });
  } catch (e) {
    set({ explore: { ...state.explore, busy: false }, error: (e as Error).message });
  }
}

async function save() {
  try {
    const trip = toTrip(state.journey);
    await api.saveTrip(trip);
    toast('Journey saved');
  } catch (e) {
    set({ error: (e as Error).message });
  }
}

async function openTrips() {
  set({ view: 'trips', trips: null, error: null });
  try { set({ trips: await api.trips() }); } catch (e) { set({ trips: [], error: (e as Error).message }); }
}

function download(name: string, text: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/gpx+xml' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

panel.addEventListener('click', (ev) => {
  const credit = (ev.target as HTMLElement).closest<HTMLElement>('.credit[data-src]');
  if (credit) { ev.stopPropagation(); window.open(credit.dataset.src, '_blank', 'noopener'); return; }
  const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!el) return;
  const i = Number(el.dataset.day ?? state.active);
  const j = state.journey;
  switch (el.dataset.action) {
    case 'pref': {
      const k = el.dataset.key as 'rentalCar' | 'avoidUnpaved' | 'avoidTolls';
      return set({ journey: updateJourney(j, { prefs: { ...j.prefs, [k]: !j.prefs[k] } }) });
    }
    case 'style': return set({ journey: updateJourney(j, { style: el.dataset.v as RouteStyle }) });
    case 'vehicle': return set({ journey: updateJourney(j, { vehicle: el.dataset.v as Vehicle }) });
    case 'interest': return set({ journey: toggleInterest(j, el.dataset.v as Interest) });
    case 'extra': return set({ journey: updateDay(j, i, { extraMinutes: el.dataset.min ? Number(el.dataset.min) : null }), active: i });
    case 'plan': return void plan(i);
    case 'choose': return set({ journey: { ...j, days: j.days.map((d, k) => (k === i ? { ...d, chosenRouteId: el.dataset.route! } : d)) }, active: i });
    case 'add-day': return set({ journey: addDay(j), active: j.days.length });
    case 'remove-day': return set({ journey: removeDay(j, i), active: 0 });
    case 'save': return void save();
    case 'trips': return void openTrips();
    case 'back': return set({ view: 'plan', error: null });
    case 'mode': return set({ view: el.dataset.v as 'plan' | 'explore', error: null });
    case 'explore-time': return set({ explore: { ...state.explore, minutes: Number(el.dataset.v), result: null } });
    case 'explore-loop': return set({ explore: { ...state.explore, roundTrip: !state.explore.roundTrip, result: null } });
    case 'explore': return void runExplore();
    case 'pick-place': {
      const d = state.explore.result?.destinations[Number(el.dataset.k)];
      const from = state.explore.origin;
      if (!d || !from) return;
      const place = { lat: d.lat, lon: d.lon, label: d.name };
      const loop = state.explore.roundTrip;
      const journey = { ...newJourney(uuid()), style: j.style, interests: j.interests, vehicle: j.vehicle, prefs: j.prefs };
      journey.days = [{ ...journey.days[0], origin: from, destination: loop ? from : place, stops: loop ? [place] : [] }];
      set({ journey, view: 'plan', active: 0 });
      return void plan(0);
    }
    case 'gpx': {
      const r = j.days.flatMap((d) => d.plan?.routes ?? []).find((x) => x.id === el.dataset.route);
      if (r) download(`${(j.name || defaultName(j)).replace(/[^\w-]+/g, '-')}.gpx`, toGpx(decodePolyline(r.polyline), r.summary, r.scenicStops));
      return;
    }
    case 'open-trip': {
      const t = state.trips?.find((x) => x.id === el.dataset.id);
      if (t) set({ journey: fromTrip(t), view: 'plan', active: 0 });
      return;
    }
    case 'delete-trip': {
      const id = el.dataset.id!;
      api.deleteTrip(id).then(() => set({ trips: (state.trips ?? []).filter((t) => t.id !== id) })).catch((e) => set({ error: e.message }));
      return;
    }
    case 'place': return; // handled by input events
  }
});

panel.addEventListener('change', (ev) => {
  const el = ev.target as HTMLInputElement;
  if (el.dataset.action === 'depart') set({ journey: updateDay(state.journey, Number(el.dataset.day), { departAt: el.value }) });
  if (el.dataset.action === 'name') { state.journey = { ...state.journey, name: el.value }; saveDraft(state.journey); }
});

// Place autocomplete: only the suggestion box re-renders while typing, so focus stays in the input.
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let lastResults: GeocodeResult[] = [];
panel.addEventListener('input', (ev) => {
  const el = ev.target as HTMLInputElement;
  if (el.dataset.action !== 'place') return;
  const box = panel.querySelector<HTMLElement>(`[data-suggest="${el.dataset.field}${el.dataset.day}"]`)!;
  clearTimeout(searchTimer);
  if (el.value.trim().length < 2) { box.hidden = true; return; }
  searchTimer = setTimeout(async () => {
    const day = state.journey.days[Number(el.dataset.day)];
    const near = (el.dataset.field === 'explore' ? state.explore.origin : day?.origin) ?? undefined;
    try { lastResults = await api.geocode(el.value.trim(), near ? { lat: near.lat, lon: near.lon } : undefined); } catch { lastResults = []; }
    box.innerHTML = lastResults.length
      ? lastResults.map((r, k) => `<button role="option" data-pick="${k}" data-day="${el.dataset.day}" data-field="${el.dataset.field}"><b>${esc(short(r.label))}</b><br><span class="muted small">${esc(r.label)}</span></button>`).join('')
      : '<div class="muted small" style="padding:10px 12px">No places found</div>';
    box.hidden = false;
  }, 250);
});

panel.addEventListener('mousedown', (ev) => {
  const b = (ev.target as HTMLElement).closest<HTMLElement>('[data-pick]');
  if (!b) return;
  ev.preventDefault();
  const r = lastResults[Number(b.dataset.pick)];
  if (!r) return;
  if (b.dataset.field === 'explore') return set({ explore: { ...state.explore, origin: { lat: r.lat, lon: r.lon, label: r.label }, result: null } });
  const i = Number(b.dataset.day);
  set({ journey: updateDay(state.journey, i, { [b.dataset.field as 'origin' | 'destination']: { lat: r.lat, lon: r.lon, label: r.label } }), active: i });
});

panel.addEventListener('focusout', (ev) => {
  const el = ev.target as HTMLElement;
  if (el.dataset.action === 'place') setTimeout(() => panel.querySelector<HTMLElement>(`[data-suggest="${el.dataset.field}${el.dataset.day}"]`)?.setAttribute('hidden', ''), 150);
});

render();
syncMap();
