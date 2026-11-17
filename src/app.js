import { searchPlace, overpass, osrmRoute, elevations, weather } from './api.js';
import {
  corridorBBox, overpassQuery, parseFeatures, clusterSpots, candidateWaypointSets,
  scoreRoute, rankRoutes, describe, reliefStats, googleMapsUrl, toGpx, FEATURE_LABELS,
} from './scenic.js';
import { resample, distKm } from './geo.js';
import { sunTimes } from './sun.js';

const $ = (id) => document.getElementById(id);
const COLORS = ['var(--route-1)', 'var(--route-2)', 'var(--route-3)'];
const HEX = ['#1f5f4a', '#c98a1b', '#6b5ca5'];
const TUSCANY = [43.35, 11.2];

// ---------- map ----------
const map = L.map('map', { zoomControl: false }).setView(TUSCANY, 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors',
}).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);
let layers = L.layerGroup().addTo(map);

// ---------- places ----------
const picked = { from: null, to: null };

function bindSearch(inputId) {
  const input = $(inputId);
  const list = $('suggest');
  let timer;
  input.addEventListener('input', () => {
    picked[inputId] = null;
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 3) { list.hidden = true; return; }
    timer = setTimeout(async () => {
      try {
        const res = await searchPlace(q);
        list.innerHTML = '';
        for (const r of res) {
          const li = document.createElement('li');
          li.tabIndex = 0;
          li.textContent = r.label;
          const choose = () => { picked[inputId] = r; input.value = r.label.split(',').slice(0, 2).join(','); list.hidden = true; };
          li.addEventListener('click', choose);
          li.addEventListener('keydown', (e) => e.key === 'Enter' && (e.preventDefault(), choose()));
          list.appendChild(li);
        }
        list.hidden = !res.length;
      } catch { list.hidden = true; }
    }, 600);
  });
}
bindSearch('from');
bindSearch('to');

function myLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is not available on this device'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, label: 'My location' }),
      () => reject(new Error('Allow location access, or type a starting place')),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });
}
$('locate').addEventListener('click', async () => {
  try { picked.from = await myLocation(); $('from').value = 'My location'; } catch (e) { status(e.message); }
});

async function resolvePlace(key) {
  if (picked[key]) return picked[key];
  const text = $(key).value.trim();
  if (key === 'from' && (!text || text === 'My location')) return myLocation();
  const res = await searchPlace(text);
  if (!res.length) throw new Error(`Couldn't find "${text}"`);
  return (picked[key] = res[0]);
}

// ---------- planning ----------
function status(msg) { $('status').textContent = msg; }

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const k = i++;
      try { out[k] = await fn(items[k], k); } catch { out[k] = null; }
    }
  });
  await Promise.all(workers);
  return out;
}

async function plan(start, end, extraMin) {
  status('Looking for viewpoints, hill towns, lakes and coast along the way…');
  const bbox = corridorBBox(start, end, extraMin);
  const [osm, direct] = await Promise.all([overpass(overpassQuery(bbox)), osrmRoute([start, end])]);
  const features = parseFeatures(osm);
  const spots = clusterSpots(features);

  const sets = candidateWaypointSets(start, end, spots, extraMin);
  status(`Found ${features.length} scenic places. Trying ${sets.length} routes…`);
  const routes = await mapLimit(sets, 2, async (wps, k) => {
    const r = k === 0 ? direct : await osrmRoute([start, ...wps, end]);
    return { ...r, waypoints: wps };
  });
  let valid = routes.filter(Boolean);
  for (const r of valid) r.scored = scoreRoute(r, features);

  // Add hills from the elevation model for the most promising few.
  status('Checking hills and views from the terrain model…');
  const top = [...valid].sort((a, b) => b.scored.score - a.scored.score).slice(0, 5);
  await mapLimit(top, 2, async (r) => {
    const pts = resample(r.line, Math.max(0.5, r.km / 90)).slice(0, 100);
    const relief = reliefStats(await elevations(pts));
    if (relief) { r.relief = relief; r.scored = scoreRoute(r, features, relief); }
  });

  const best = rankRoutes(valid, direct.minutes, extraMin);
  return { direct, best, features, spotsCount: spots.length };
}

// ---------- conditions ----------
async function conditions(route, start) {
  const notes = [];
  const now = new Date();
  const arrive = new Date(now.getTime() + route.minutes * 60000);
  const sun = sunTimes(now, start.lat, start.lon);
  if (sun && arrive > sun.sunset && now < sun.sunset) notes.push(`You'd arrive after sunset (${fmtTime(sun.sunset)}). Leave earlier for the views.`);
  else if (sun && now > sun.sunset) notes.push('It will be dark: start tomorrow morning to enjoy the views.');
  else if (sun && sun.sunset - arrive < 75 * 60000) notes.push(`Golden hour on the way: sunset at ${fmtTime(sun.sunset)}.`);

  // Weather at the highest part of the route, where cloud matters most.
  try {
    const mid = route.line[Math.floor(route.line.length / 2)];
    const w = await weather(mid);
    const hour = new Date(now.getTime() + (route.minutes / 2) * 60000).getHours();
    const idx = w.hourly.time.findIndex((t) => new Date(t).getHours() === hour && new Date(t) >= new Date(now.toDateString()));
    if (idx >= 0) {
      const cloud = w.hourly.cloud_cover[idx], low = w.hourly.cloud_cover_low[idx], rain = w.hourly.precipitation_probability[idx], vis = w.hourly.visibility[idx];
      if (vis != null && vis < 2000) notes.push('Fog likely: views will be limited.');
      else if (rain >= 60) notes.push(`Rain likely (${rain}%) mid-route.`);
      else if (low >= 70) notes.push('Low cloud mid-route: hilltop views may be hidden.');
      else if (cloud <= 30) notes.push('Clear skies expected mid-route.');
    }
  } catch { /* weather is a nice-to-have */ }
  return notes;
}
const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${Math.round(m % 60)} min` : `${Math.round(m)} min`);

// ---------- rendering ----------
function draw(start, end, direct, best, selected = 0) {
  layers.clearLayers();
  const plain = L.polyline(direct.line.map((p) => [p.lat, p.lon]), { color: '#8a8f8c', weight: 4, opacity: 0.6, dashArray: '6 8' });
  layers.addLayer(plain);
  best.forEach((r, i) => {
    if (i === selected) return;
    layers.addLayer(L.polyline(r.line.map((p) => [p.lat, p.lon]), { color: HEX[i], weight: 4, opacity: 0.55 }));
  });
  const sel = best[selected];
  if (sel) {
    layers.addLayer(L.polyline(sel.line.map((p) => [p.lat, p.lon]), { color: HEX[selected], weight: 7, opacity: 0.95 }));
    for (const w of sel.waypoints) layers.addLayer(L.circleMarker([w.lat, w.lon], { radius: 7, color: '#fff', weight: 2, fillColor: HEX[selected], fillOpacity: 1 }).bindTooltip(w.name || w.types.map((t) => FEATURE_LABELS[t]).join(', ')));
  }
  layers.addLayer(L.circleMarker([start.lat, start.lon], { radius: 6, color: '#1d2420', fillColor: '#fff', fillOpacity: 1 }));
  layers.addLayer(L.marker([end.lat, end.lon]));
  map.fitBounds(L.latLngBounds((sel || direct).line.map((p) => [p.lat, p.lon])).pad(0.1));
}

function render(ctx) {
  const { start, end, extra, direct, best } = ctx;
  const box = $('results');
  box.innerHTML = '';
  if (!best.length || (best.length === 1 && !best[0].waypoints.length)) {
    status(`No scenic detour fits within +${extra} min here. Try a bigger time budget.`);
  } else {
    status(`Fastest route: ${fmtMin(direct.minutes)}. Here are the most scenic options:`);
  }
  best.forEach((r, i) => {
    const el = document.createElement('article');
    el.className = 'route' + (i === 0 ? ' selected' : '');
    el.style.setProperty('--c', COLORS[i]);
    const plus = Math.max(0, Math.round(r.minutes - direct.minutes));
    const via = r.waypoints.map((w) => w.name).filter(Boolean);
    const p = r.scored.parts;
    el.innerHTML = `
      <h3><span>${r.waypoints.length ? (i === 0 ? 'Most scenic' : `Option ${i + 1}`) : 'Fastest way'}</span><span class="score">${r.scored.score}/100</span></h3>
      <p class="meta">${fmtMin(r.minutes)} · ${r.km.toFixed(0)} km · ${plus ? `+${plus} min` : 'no extra time'}${p.motorwayPct ? ` · ${p.motorwayPct}% motorway` : ''}</p>
      <p class="what">${describe(r.scored)}</p>
      ${via.length ? `<p class="via">Via ${via.join(' → ')}</p>` : ''}
      <p class="warn" hidden></p>
      <div class="actions">
        <a class="nav" target="_blank" rel="noopener" href="${googleMapsUrl(start.label === 'My location' ? null : start, end, r.waypoints)}">Drive it in Google Maps</a>
        <button type="button" class="gpx">GPX</button>
      </div>
      <div class="rate"><span style="align-self:center;font-size:14px">How was it?</span><button type="button" data-v="1">👍 Beautiful</button><button type="button" data-v="-1">👎 Meh</button></div>`;
    el.addEventListener('click', (e) => {
      if (e.target.closest('a,button')) return;
      document.querySelectorAll('.route').forEach((x) => x.classList.remove('selected'));
      el.classList.add('selected');
      draw(start, end, direct, best, i);
    });
    el.querySelector('.nav').addEventListener('click', () => { el.classList.add('driven'); });
    el.querySelector('.gpx').addEventListener('click', () => download(`scenic-${slug(end.label)}.gpx`, toGpx(r.line, `Scenic route to ${end.label.split(',')[0]}`)));
    el.querySelectorAll('.rate button').forEach((b) => b.addEventListener('click', () => {
      el.querySelectorAll('.rate button').forEach((x) => x.classList.toggle('on', x === b));
      saveRating({ when: new Date().toISOString(), from: [start.lat, start.lon], to: [end.lat, end.lon], toName: end.label.split(',')[0], extra, rating: +b.dataset.v, score: r.scored.score, parts: r.scored.parts, byType: r.scored.byType, minutes: Math.round(r.minutes), km: Math.round(r.km), via: r.waypoints.map((w) => ({ lat: +w.lat.toFixed(5), lon: +w.lon.toFixed(5), name: w.name })) });
    }));
    box.appendChild(el);
    if (i === 0) conditions(r, start).then((notes) => {
      if (!notes.length) return;
      const w = el.querySelector('.warn');
      w.textContent = notes.join(' ');
      w.hidden = false;
    });
  });
  draw(start, end, direct, best, 0);
}

const slug = (s) => s.split(',')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/gpx+xml' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- ratings (kept on the phone) ----------
const KEY = 'scenic-route-ratings';
function loadRatings() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
function saveRating(r) {
  const all = loadRatings();
  all.push(r);
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* private mode */ }
  $('ratingCount').textContent = all.length;
}
$('ratingCount').textContent = loadRatings().length;
$('copyRatings').addEventListener('click', async () => {
  const text = JSON.stringify(loadRatings(), null, 1);
  try { await navigator.clipboard.writeText(text); $('copyRatings').textContent = 'Copied ✓'; }
  catch { download('scenic-ratings.json', text); }
});

// ---------- go ----------
$('plan').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('suggest').hidden = true;
  const btn = $('go');
  btn.disabled = true;
  $('results').innerHTML = '';
  try {
    status('Finding places…');
    const [start, end] = await Promise.all([resolvePlace('from'), resolvePlace('to')]);
    if (distKm(start, end) < 3) throw new Error('Start and destination are very close together.');
    if (distKm(start, end) > 400) throw new Error('This prototype works best for drives under about 400 km.');
    const extra = +document.querySelector('input[name=extra]:checked').value;
    const res = await plan(start, end, extra);
    render({ start, end, extra, ...res });
  } catch (err) {
    console.error(err);
    status(`Sorry: ${err.message}. Please try again in a moment.`);
  } finally {
    btn.disabled = false;
  }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
