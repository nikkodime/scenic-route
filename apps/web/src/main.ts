import './theme.css';
import { toGpx, decodePolyline, type GeocodeResult, type RouteOption, type Trip } from '@scenic/core';
import { api } from './api.ts';
import { RouteMap } from './map.ts';
import {
  EXTRA_CHOICES, addDay, chosenRoute, defaultName, duration, fromTrip, newJourney, removeDay, toTrip, totals, updateDay,
  type DayPlan, type Journey,
} from './journey.ts';

interface State {
  journey: Journey;
  active: number;
  busy: number | null;
  error: string | null;
  view: 'plan' | 'trips';
  trips: Trip[] | null;
}

const uuid = () => crypto.randomUUID();
const DRAFT_KEY = 'scenic.draft';
const loadDraft = (): Journey | null => { try { const s = localStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
const saveDraft = (j: Journey) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(j)); } catch {} };

const state: State = { journey: loadDraft() ?? newJourney(uuid()), active: 0, busy: null, error: null, view: 'plan', trips: null };
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
  const d = state.journey.days[state.active];
  if (d?.plan?.routes.length) map.show(d.plan.routes, d.chosenRouteId);
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
  panel.innerHTML = state.view === 'trips' ? tripsView() : planView();
}

function planView(): string {
  const j = state.journey;
  const t = totals(j);
  return `
    <header class="day-head">
      <div><div class="label">Panoramica · Journey planner</div><h1>Plan the beautiful way</h1></div>
      <button class="btn link" data-action="trips">My trips</button>
    </header>
    <div class="field">
      <label class="label" for="jname">Journey name</label>
      <input id="jname" class="input" data-action="name" placeholder="${esc(defaultName(j))}" value="${esc(j.name)}" />
    </div>
    <div class="chips" role="group" aria-label="Road preferences">
      ${chip('rentalCar', 'Rental car')}${chip('avoidUnpaved', 'No gravel')}${chip('avoidTolls', 'No tolls')}
    </div>
    ${j.days.map((d, i) => dayCard(d, i)).join('')}
    <button class="btn" data-action="add-day">+ Add a day</button>
    ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ''}
    <div class="card">
      <div class="stats">${t.days} day${t.days === 1 ? '' : 's'} · ${t.planned} planned · ${t.km} km · ${duration(t.minutes)} driving</div>
      <div class="row">
        <button class="btn primary" data-action="save" ${t.planned ? '' : 'disabled'}>Save journey</button>
      </div>
      <p class="muted small">Saved journeys open in the iPhone app after you sign in with the same Apple ID (coming with Sign in with Apple on the web).</p>
    </div>
    <p class="attribution">${esc(j.days.find((d) => d.plan)?.plan?.attribution.join(' · ') ?? '© OpenStreetMap contributors')}</p>`;
}

function chip(key: 'rentalCar' | 'avoidUnpaved' | 'avoidTolls', label: string) {
  return `<button class="chip" data-action="pref" data-key="${key}" aria-pressed="${state.journey.prefs[key]}">${label}</button>`;
}

function dayCard(d: DayPlan, i: number): string {
  const busy = state.busy === i;
  const r = chosenRoute(d);
  return `
  <section class="card" data-day="${i}" aria-label="Day ${i + 1}">
    <div class="day-head">
      <h2>Day ${i + 1}</h2>
      ${state.journey.days.length > 1 ? `<button class="btn link" data-action="remove-day" data-day="${i}">Remove</button>` : ''}
    </div>
    ${placeField(i, 'origin', 'From', d.origin?.label)}
    ${placeField(i, 'destination', 'To', d.destination?.label)}
    <div class="field">
      <span class="label">Extra time for the views</span>
      <div class="seg" role="group" aria-label="Extra time">
        ${EXTRA_CHOICES.map((m) => `<button data-action="extra" data-day="${i}" data-min="${m}" aria-pressed="${d.extraMinutes === m}">${m === 0 ? '0' : m === 240 ? 'Day' : m >= 60 ? `+${m / 60} h` : `+${m}`}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <label class="label" for="dep${i}">Leaving</label>
      <input id="dep${i}" class="input" type="datetime-local" data-action="depart" data-day="${i}" value="${esc(d.departAt)}" />
    </div>
    <button class="btn primary" data-action="plan" data-day="${i}" ${d.origin && d.destination && !busy ? '' : 'disabled'}>${busy ? 'Finding beautiful roads…' : d.plan ? 'Plan again' : 'Find scenic routes'}</button>
    ${d.plan ? results(d, i) : ''}
    ${r ? detail(r) : ''}
  </section>`;
}

function placeField(i: number, field: 'origin' | 'destination', label: string, value?: string) {
  return `<div class="field">
    <label class="label" for="${field}${i}">${label}</label>
    <input id="${field}${i}" class="input" autocomplete="off" data-action="place" data-day="${i}" data-field="${field}" value="${esc(value)}" placeholder="${field === 'origin' ? 'Start: town or address' : 'Where to?'}" />
    <div class="suggest" hidden data-suggest="${field}${i}" role="listbox"></div>
  </div>`;
}

function bars(r: RouteOption) {
  const light = r.conditions ? { great: 100, good: 75, mixed: 45, poor: 15 }[r.conditions.verdict] : 60;
  const quiet = Math.max(0, 100 - r.parts.motorwayPct - r.parts.urbanPct);
  const items: [string, number][] = [['Views', r.parts.views ?? r.parts.scenery], ['Bends', r.parts.bends], ['Hills', r.parts.relief ?? 0], ['Light', light], ['Quiet', quiet]];
  return `<div class="bars">${items.map(([k, v]) => `<div class="bar"><i style="--v:${Math.round(v)}%"></i><span>${k}</span></div>`).join('')}</div>`;
}

function results(d: DayPlan, i: number) {
  const routes = d.plan!.routes;
  if (!routes.length) return `<p class="muted">No route fits that time. Try more extra time.</p>`;
  return `<div class="field" role="group" aria-label="Route options">
    ${routes.map((r) => `
      <button class="route" data-action="choose" data-day="${i}" data-route="${esc(r.id)}" aria-pressed="${r.id === (d.chosenRouteId ?? routes[0].id)}">
        <div class="plate"><b>${Math.round(r.score)}</b><span>SCENIC</span></div>
        <div>
          <div style="font:600 18px var(--font-ui)">${esc(r.label)}</div>
          <div class="muted small">${esc(r.summary)}</div>
          <div class="stats">${duration(r.minutes)} · ${Math.round(r.km)} km · ${r.extraMinutes < 1 ? 'no extra' : `+${duration(r.extraMinutes)}`}</div>
          ${bars(r)}
        </div>
      </button>`).join('')}
    ${d.plan!.warnings.map((w) => `<p class="note muted small">ⓘ ${esc(w)}</p>`).join('')}
    <p class="stats">Fastest: ${duration(d.plan!.fastest.minutes)} · ${Math.round(d.plan!.fastest.km)} km</p>
  </div>`;
}

function detail(r: RouteOption) {
  const c = r.conditions;
  const time = (iso?: string | null) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '–');
  return `<div class="field">
    ${c ? `<div class="stats">Arrive ${time(c.arrival)} · Sunset ${time(c.sunset)}</div>` : ''}
    ${(c?.notes ?? []).map((n) => `<p class="note ${/fog|rain|dark|hidden|Low sun/i.test(n) ? 'warn' : /Clear|Golden/.test(n) ? 'good' : 'weather'}">${esc(n)}</p>`).join('')}
    ${r.advisories.map((a) => `<p class="note ${a.severity === 'info' ? 'weather' : 'warn'}"><b>${esc(a.title)}.</b> ${esc(a.detail)}</p>`).join('')}
    ${r.highlights.length ? `<div class="label">Along the way</div><ul class="small" style="margin:0;padding-left:18px">${r.highlights.map((h) => `<li>km ${Math.round(h.atKm)}: ${esc(h.name)}</li>`).join('')}</ul>` : ''}
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
      <div><div class="label">Panoramica</div><h1>My trips</h1></div>
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
      origin: d.origin, destination: d.destination, extraMinutes: d.extraMinutes,
      departAt: d.departAt ? new Date(d.departAt).toISOString() : undefined, prefs: state.journey.prefs,
    });
    set({ busy: null, journey: updateDay(state.journey, i, { plan: res, chosenRouteId: res.routes[0]?.id ?? null }) });
  } catch (e) {
    set({ busy: null, error: (e as Error).message });
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
  const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!el) return;
  const i = Number(el.dataset.day ?? state.active);
  const j = state.journey;
  switch (el.dataset.action) {
    case 'pref': {
      const k = el.dataset.key as 'rentalCar' | 'avoidUnpaved' | 'avoidTolls';
      return set({ journey: { ...j, prefs: { ...j.prefs, [k]: !j.prefs[k] }, days: j.days.map((d) => ({ ...d, plan: null, chosenRouteId: null })) } });
    }
    case 'extra': return set({ journey: updateDay(j, i, { extraMinutes: Number(el.dataset.min) }), active: i });
    case 'plan': return void plan(i);
    case 'choose': return set({ journey: { ...j, days: j.days.map((d, k) => (k === i ? { ...d, chosenRouteId: el.dataset.route! } : d)) }, active: i });
    case 'add-day': return set({ journey: addDay(j), active: j.days.length });
    case 'remove-day': return set({ journey: removeDay(j, i), active: 0 });
    case 'save': return void save();
    case 'trips': return void openTrips();
    case 'back': return set({ view: 'plan', error: null });
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
    const near = day.origin ?? undefined;
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
  const i = Number(b.dataset.day);
  set({ journey: updateDay(state.journey, i, { [b.dataset.field as 'origin' | 'destination']: { lat: r.lat, lon: r.lon, label: r.label } }), active: i });
});

panel.addEventListener('focusout', (ev) => {
  const el = ev.target as HTMLElement;
  if (el.dataset.action === 'place') setTimeout(() => panel.querySelector<HTMLElement>(`[data-suggest="${el.dataset.field}${el.dataset.day}"]`)?.setAttribute('hidden', ''), 150);
});

render();
syncMap();
