// Scenic Route — low-poly floating islands (v3)
// Procedural, deterministic and seamlessly looping: every animation is a function of phase p = t / LOOP in [0, 1).
import * as THREE from 'three';

export const LOOP = 36; // seconds per seamless loop (the car laps 3 times, everything else moves once: calm)

// ---------------------------------------------------------------- helpers
const TAU = Math.PI * 2;
const sm = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a + (b - a) * t;
const gauss = (x, z, cx, cz, r) => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));

function makeRng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s & 0xfffffff) / 0xfffffff; };
}
function makeNoise(seed) {
  const hash = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7 + seed * 17.13) * 43758.5453; return v - Math.floor(v); };
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    const u = sm(xf), v = sm(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.03, y * 2.03) * 0.27 + noise(x * 4.1, y * 4.1) * 0.12 + noise(x * 8.3, y * 8.3) * 0.06;
  const ridged = (x, y) => { const n = 1 - Math.abs(noise(x, y) * 2 - 1); const m = 1 - Math.abs(noise(x * 2.1, y * 2.1) * 2 - 1); return n * n * 0.7 + m * m * 0.3; };
  return { noise, fbm, ridged };
}

// ---------------------------------------------------------------- regions
// Camera sits at +x +z looking towards the origin, so "back" of an island is -x -z.
export const REGIONS = {
  tuscany: {
    title: 'Val d’Orcia, Tuscany', country: 'Italy', vehicle: 'city', carColor: '#2f6fd0', carColor2: '#f4f1ea',
    sky: ['#9fc4e3', '#e9e4d6'], fog: '#e3e0d4',
    grass: ['#a7b257', '#b6bb5d', '#97a64f', '#c3c06a'], field: ['#d9b55b', '#cfa64c', '#e3c272'], rock: '#b99a6c', sand: '#d8c49a', snow: null,
    strata: ['#a8714a', '#93603d', '#7c5034', '#6a432c', '#55362a'], foliage: ['#6e8f3e', '#7d9c45', '#5f8136'], conifer: ['#3f5f37', '#355230', '#4a6b40'], trunk: '#5a3b28',
    water: '#5fb7c9', amp: 1.5,
    height(x, z, n) { return (n.fbm(x * 0.2 + 3, z * 0.2 + 9) - 0.45) * 2.6 + 2.2 * gauss(x, z, -3.4, -3.4, 2.6) + 1.2 * gauss(x, z, 4.2, -2.8, 2.2); },
    waterMask(x, z) { return 0; },
    river: [[-1.2, 0.4], [0.4, 1.6], [0.2, 3.4], [1.0, 5.2], [1.4, 8.5]], riverW: 0.75,
    pond: [-1.2, 0.4, 1.0],
    road: { cx: 0.3, cz: 0.2, rx: 4.9, rz: 4.1, wob: 0.9, rot: 0.4 },
    trees: { n: 20, conifer: 0.45, kind: 'cypress' },
    props: ['hilltown', 'vineyard', 'cypressAvenue', 'haybales', 'farmhouse'],
  },
  dolomites: {
    title: 'Passo Giau, Dolomites', country: 'Italy', vehicle: 'van', carColor: '#e4572e', carColor2: '#f4f1ea',
    sky: ['#86b3dc', '#e3ecf0'], fog: '#dfe7ec',
    grass: ['#86ad55', '#94b95d', '#78a04c', '#a2c066'], field: ['#a9c56b'], rock: '#d6ccbd', rock2: '#b9ada0', sand: '#cfc3a8', snow: '#f6f7f9',
    strata: ['#c9bfb1', '#b3a899', '#9d9284', '#857b70', '#6d655c'], foliage: ['#5d8a45'], conifer: ['#2f5a3c', '#376644', '#295035', '#3d6f4a'], trunk: '#4a3426',
    water: '#46c1c9', amp: 1.2,
    height(x, z, n) {
      let h = (n.fbm(x * 0.22 + 1, z * 0.22 + 4) - 0.45) * 1.8;
      const ridge = n.ridged(x * 0.33 + 7, z * 0.33 + 2);
      const back = clamp01((-(x + z) - 1.0) / 6);
      h += Math.pow(ridge, 2.2) * 6.8 * back + 5.2 * gauss(x, z, -3.6, -4.0, 1.7) * (0.6 + 0.4 * ridge) + 4.0 * gauss(x, z, -5.6, -0.6, 1.4) * ridge + 3.4 * gauss(x, z, 0.4, -5.6, 1.4) * ridge;
      return h;
    },
    waterMask(x, z) { return clamp01((1 - Math.hypot((x - 3.0) / 1.6, (z - 2.6) / 1.1)) * 3); },
    river: [[3.0, 2.6], [4.4, 3.4], [5.8, 4.4], [7.0, 6.2]], riverW: 0.55,
    road: { cx: 0.6, cz: 0.6, rx: 4.6, rz: 3.6, wob: 1.25, rot: 0.9, hair: 6 },
    trees: { n: 46, conifer: 1, kind: 'pine' },
    props: ['hut', 'cows'],
  },
  amalfi: {
    title: 'Costiera Amalfitana', country: 'Italy', vehicle: 'roadster', carColor: '#d93a2b', carColor2: '#efe7d8',
    sky: ['#7fb8e8', '#f1e6d2'], fog: '#ece4d4',
    grass: ['#8aa04a', '#7f9744', '#99ab55', '#6f8b3c'], field: ['#a7b45a'], rock: '#c9b394', rock2: '#ad987c', sand: '#e9dcc0', snow: null,
    strata: ['#c7ae8c', '#b39878', '#9b8165', '#836b54', '#6b5745'], foliage: ['#4f7d34', '#5d8c3a', '#447030'], conifer: ['#3b5f33', '#456b3a'], trunk: '#5a3b28',
    water: '#1f9bc4', amp: 1.0,
    height(x, z, n) {
      const s = (-(x + z)) / 2;
      let h = 1.2 + s * 0.55 + (n.fbm(x * 0.25, z * 0.25 + 5) - 0.45) * 2.2 + 2.6 * gauss(x, z, -3.8, -3.2, 2.8);
      return h;
    },
    waterMask(x, z) { return clamp01(((x + z) - 3.2) / 1.6); },
    road: { cx: -1.0, cz: -1.2, rx: 4.6, rz: 3.2, wob: 0.8, rot: 0.75 },
    trees: { n: 24, conifer: 0.25, kind: 'lemon' },
    props: ['pastelTown', 'boats', 'lighthouse', 'terraces'],
  },
  sardinia: {
    title: 'Costa Smeralda, Sardinia', country: 'Italy', vehicle: 'tent4x4', carColor: '#f2efe6', carColor2: '#e88b1f',
    sky: ['#79b9ea', '#f2ebdc'], fog: '#ebe6d8',
    grass: ['#8e9b52', '#7e8d47', '#9fa85c', '#a99f62'], field: ['#b8ad73'], rock: '#c9b7a4', rock2: '#b4a08c', sand: '#f1e7cf', snow: null,
    strata: ['#c2ad97', '#a9937e', '#917c69', '#7a6756', '#645446'], foliage: ['#5c7a3a', '#6b8a43', '#4f6b33'], conifer: ['#466b3c', '#3c5e35'], trunk: '#5a3b28',
    water: '#29c3c9', water2: '#1689b4', amp: 1.1,
    height(x, z, n) { return 0.2 + (n.fbm(x * 0.24 + 11, z * 0.24 + 2) - 0.45) * 2.4 + 1.6 * gauss(x, z, -3.6, -2.6, 2.6); },
    waterMask(x, z) { return clamp01((1.3 - Math.hypot((x - 3.6) / 2.6, (z - 2.8) / 2.1)) * 2.4); },
    beach: true,
    road: { cx: -1.0, cz: -0.6, rx: 4.3, rz: 3.5, wob: 0.8, rot: 0.2 },
    trees: { n: 22, conifer: 0.15, kind: 'shrub' },
    props: ['granite', 'nuraghe', 'boats', 'umbrellas'],
  },
  moselle: {
    title: 'Moselle valley', country: 'Germany', vehicle: 'caravan', carColor: '#5b6770', carColor2: '#f4f1ea',
    sky: ['#9bbbd9', '#e6e6de'], fog: '#e2e3dc',
    grass: ['#7fa24b', '#8cad52', '#729645', '#97b35c'], field: ['#9db75c'], rock: '#8f8a80', rock2: '#7a756c', sand: '#cbbd9c', snow: null,
    strata: ['#7a6f66', '#6a605a', '#5b524d', '#4d4541', '#3f3936'], foliage: ['#5b8a3c', '#6a9944', '#4e7a34'], conifer: ['#36593a', '#2f5034'], trunk: '#4e3626',
    water: '#4f9fb6', amp: 1.0,
    height(x, z, n) {
      const d = Math.abs(this._rd(x, z));
      return 0.2 + Math.min(d, 4.2) * 0.6 + (n.fbm(x * 0.25 + 5, z * 0.25 + 1) - 0.45) * 1.4 + 1.6 * gauss(x, z, 3.6, -3.2, 1.6);
    },
    _rd(x, z) { return (x - z * 0.15 + 0.6 * Math.sin(z * 0.5)) ; },
    waterMask(x, z) { return clamp01((0.95 - Math.abs(this._rd(x, z))) * 2.4); },
    road: { cx: 0.0, cz: 0.0, rx: 4.9, rz: 4.0, wob: 0.7, rot: 0.1, bridge: true },
    trees: { n: 26, conifer: 0.35, kind: 'broadleaf' },
    props: ['castle', 'vineRows', 'village', 'barge'],
  },
  fjord: {
    title: 'Geirangerfjord', country: 'Norway', vehicle: 'motorhome', carColor: '#f2f0ea', carColor2: '#2e6fb0',
    sky: ['#8fb2d2', '#e1e7ea'], fog: '#dde4e8',
    grass: ['#5f9a4c', '#6aa553', '#558d45', '#78b05e'], field: ['#7fb064'], rock: '#7d8288', rock2: '#686d73', sand: '#b9b2a2', snow: '#f5f7f9',
    strata: ['#6c7178', '#5c6168', '#4e5359', '#41454b', '#34383d'], foliage: ['#4f8a46'], conifer: ['#264a35', '#2c543c', '#203f2d'], trunk: '#3e2c22',
    water: '#2c7f9c', amp: 2.0, snowLine: 5.4,
    height(x, z, n) {
      const f = this._fd(x, z);
      return 1.0 + Math.min(f, 3.6) * 0.85 + (n.fbm(x * 0.22 + 3, z * 0.22 + 8) - 0.45) * 2.0 + 2.2 * gauss(x, z, -4.6, -3.0, 2.0) + 1.6 * gauss(x, z, 1.4, -5.4, 1.6);
    },
    _fd(x, z) { // distance to fjord centre line, entering from the front edge and bending into the centre
      const c = new THREE.Vector2(x, z); let best = 99;
      for (let i = 0; i <= 30; i++) { const t = i / 30; const px = mix(6.8, -0.8, t) + Math.sin(t * 3.4) * 0.9, pz = mix(6.6, -0.6, t) - Math.sin(t * 3.4) * 0.9; best = Math.min(best, c.distanceTo(new THREE.Vector2(px, pz)) - (1.7 - t * 0.7)); }
      return Math.max(0, best);
    },
    waterMask(x, z) { return clamp01((0.35 - this._fd(x, z)) * 3); },
    road: { cx: -0.8, cz: -0.6, rx: 4.6, rz: 3.9, wob: 0.9, rot: 0.6, bridge: true },
    trees: { n: 40, conifer: 0.95, kind: 'spruce' },
    props: ['redHouses', 'ferry'],
  },
  bardenas: {
    title: 'Bardenas Reales', country: 'Spain', vehicle: 'tent4x4', carColor: '#e9e4d8', carColor2: '#2f6b4a',
    sky: ['#8fbde6', '#f3e7d2'], fog: '#efe4d1',
    grass: ['#cdb48a', '#d6be93', '#c3a87f', '#dcc69c'], field: ['#b9a274'], rock: '#d7b98d', rock2: '#c4a279', sand: '#e5d3ad', snow: null,
    strata: ['#d9b98c', '#c79f73', '#e3c69b', '#b88c63', '#9c7452', '#7f5d42'], foliage: ['#8c9a5a', '#7d8c50'], conifer: ['#6f8048'], trunk: '#6a4a32',
    water: '#59b3c4', amp: 1.0, terraces: 0.55,
    height(x, z, n) {
      let h = 0.4 + (n.fbm(x * 0.2 + 2, z * 0.2 + 13) - 0.4) * 3.0 + 3.0 * gauss(x, z, -3.8, -3.0, 2.2) + 2.2 * gauss(x, z, 3.2, -4.4, 1.5) + 2.0 * gauss(x, z, -4.8, 2.4, 1.3);
      return h;
    },
    waterMask(x, z) { return 0; },
    road: { cx: 0.5, cz: 0.5, rx: 4.4, rz: 3.6, wob: 1.0, rot: 1.1, dirt: true },
    trees: { n: 14, conifer: 0, kind: 'shrub' },
    props: ['chimney', 'agave', 'mesaStripes'],
  },
  highlands: {
    title: 'Glen Coe, Scottish Highlands', country: 'Scotland', vehicle: 'estate', carColor: '#2d5d46', carColor2: '#efe9dc',
    sky: ['#9fb6c9', '#e4e5e1'], fog: '#dfe1de',
    grass: ['#8b9a52', '#7c8c49', '#96a25a', '#a39a5a'], field: ['#8d6a86', '#9a7591', '#7f5f7a'], rock: '#8e8a83', rock2: '#7a766f', sand: '#c3b799', snow: null,
    strata: ['#77716a', '#68625c', '#5a554f', '#4c4843', '#3e3b37'], foliage: ['#5e7d3e'], conifer: ['#2f4f36', '#36583c'], trunk: '#4a3426',
    water: '#3d7f98', amp: 1.6,
    height(x, z, n) { return 0.35 + (n.fbm(x * 0.2 + 9, z * 0.2 + 3) - 0.45) * 2.8 + 4.2 * gauss(x, z, -3.6, -3.8, 2.4) * (0.7 + 0.3 * n.ridged(x * 0.4, z * 0.4)) + 2.2 * gauss(x, z, 2.4, -5.0, 1.8); },
    waterMask(x, z) { return clamp01((1.25 - Math.hypot((x - 2.9) / 3.0, (z - 2.9) / 2.0)) * 2.6); },
    road: { cx: -1.5, cz: -1.3, rx: 3.9, rz: 3.2, wob: 0.8, rot: 0.35 },
    trees: { n: 16, conifer: 0.85, kind: 'pine' },
    props: ['islandCastle', 'sheep', 'stoneWall'],
  },
};
export const REGION_KEYS = Object.keys(REGIONS);

// ---------------------------------------------------------------- build
export function buildIsland(regionKey, opts = {}) {
  const C = REGIONS[regionKey];
  const seed = opts.seed ?? 7;
  const rnd = makeRng(seed + regionKey.length * 31);
  const rr = (a, b) => a + rnd() * (b - a);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const N = makeNoise(seed);
  const anim = []; // functions (p) => void

  const root = new THREE.Group();
  const world = new THREE.Group(); root.add(world);

  const mat = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9, metalness: 0, ...extra });
  const shadowAll = (o, cast = true, recv = true) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); return o; };

  // ---- island outline
  const R = 7.4;
  const outline = (a) => {
    const k = 1 + 0.13 * Math.sin(a * 3 + seed) + 0.08 * Math.sin(a * 5 + 1.7 * seed) + 0.05 * Math.sin(a * 11 + 0.3) + 0.03 * Math.sin(a * 17);
    return { x: Math.cos(a) * R * k * 1.1, z: Math.sin(a) * R * k * 0.9 };
  };
  const radiusAt = (x, z) => { const a = Math.atan2(z / 0.9, x / 1.1); const o = outline(a); return Math.hypot(o.x, o.z); };
  const inside = (x, z, m = 0) => Math.hypot(x, z) < radiusAt(x, z) - m;

  // ---- road: closed loop
  const RD = C.road;
  const roadCtrl = [];
  const RN = RD.hair ? 14 : 10;
  for (let i = 0; i < RN; i++) {
    const a = (i / RN) * TAU;
    let rx = RD.rx, rz = RD.rz;
    const w = 1 + (RD.wob * 0.18) * Math.sin(a * 3 + seed * 0.7) + (RD.hair && i % 2 ? -0.22 : 0);
    const x0 = Math.cos(a) * rx * w, z0 = Math.sin(a) * rz * w;
    const x = RD.cx + x0 * Math.cos(RD.rot) - z0 * Math.sin(RD.rot), z = RD.cz + x0 * Math.sin(RD.rot) + z0 * Math.cos(RD.rot);
    roadCtrl.push(new THREE.Vector3(x, 0, z));
  }
  const roadCurve = new THREE.CatmullRomCurve3(roadCtrl, true, 'centripetal');
  const RS = 360; const roadSamples = roadCurve.getSpacedPoints(RS);
  const distRoad = (x, z) => { let d = 1e9, idx = 0; for (let i = 0; i < roadSamples.length; i++) { const p = roadSamples[i]; const q = (p.x - x) ** 2 + (p.z - z) ** 2; if (q < d) { d = q; idx = i; } } return [Math.sqrt(d), idx]; };

  // ---- river (optional), as a spline used both to carve terrain and as a flowing ribbon
  let riverCurve = null, riverSamples = [];
  if (C.river) { riverCurve = new THREE.CatmullRomCurve3(C.river.map(([x, z]) => new THREE.Vector3(x, 0, z))); riverSamples = riverCurve.getSpacedPoints(90); }
  const distRiver = (x, z) => { if (!riverCurve) return 99; let d = 1e9; for (const p of riverSamples) d = Math.min(d, (p.x - x) ** 2 + (p.z - z) ** 2); return Math.sqrt(d); };

  const WL = -0.35; // water level
  const baseH = (x, z) => {
    let h = C.height(x, z, N);
    if (C.terraces) { const k = C.terraces; const q = Math.floor(h / k) * k; const f = (h - q) / k; h = q + k * Math.pow(f, 4.0); }
    return h;
  };
  const waterAt = (x, z) => {
    let m = C.waterMask(x, z);
    if (riverCurve) m = Math.max(m, clamp01((C.riverW - distRiver(x, z)) / 0.35));
    if (C.pond) m = Math.max(m, clamp01((C.pond[2] - Math.hypot(x - C.pond[0], z - C.pond[1])) * 2));
    return m;
  };
  // smoothed road height profile (ignores water so roads bridge over it)
  const roadProfile = roadSamples.map((p) => baseH(p.x, p.z));
  for (let pass = 0; pass < 40; pass++) for (let i = 0; i < roadProfile.length; i++) {
    const a = roadProfile[(i - 1 + RS + 1) % (RS + 1)], b = roadProfile[(i + 1) % (RS + 1)];
    roadProfile[i] = roadProfile[i] * 0.5 + (a + b) * 0.25;
  }
  // limit the grade so the road (and the car on it) climbs like a real mountain road, max ~13 degrees
  {
    const n = RS, g = 0.23 * roadCurve.getLength() / RS;
    for (let pass = 0; pass < 80; pass++) {
      for (let i = 1; i <= n * 2; i++) { const k = i % n, j = (i - 1) % n; roadProfile[k] = Math.min(Math.max(roadProfile[k], roadProfile[j] - g), roadProfile[j] + g); }
      for (let i = n * 2; i >= 1; i--) { const k = (i - 1) % n, j = i % n; roadProfile[k] = Math.min(Math.max(roadProfile[k], roadProfile[j] - g), roadProfile[j] + g); }
    }
    for (let pass = 0; pass < 25; pass++) for (let i = 0; i < n; i++) roadProfile[i] = roadProfile[i] * 0.5 + (roadProfile[(i - 1 + n) % n] + roadProfile[(i + 1) % n]) * 0.25;
    roadProfile[n] = roadProfile[0];
  }
  for (let i = 0; i < roadProfile.length; i++) roadProfile[i] = Math.max(roadProfile[i], 0.15);
  const roadHAt = (idx) => roadProfile[idx] + 0.02;

  const height = (x, z) => {
    let h = baseH(x, z);
    const [d, idx] = distRoad(x, z);
    const rh = roadProfile[idx];
    const t = clamp01((d - 0.55) / 1.5);
    h = rh + (h - rh) * sm(t);
    if (d < 0.6) h = Math.min(h, rh - 0.02);
    const w = waterAt(x, z);
    const minLand = 0.08;
    h = Math.max(h, minLand);
    if (w > 0) h = mix(h, WL - 0.45, w);
    return h;
  };

  // ---- top surface
  const GN = 72, span = 19, cell = span / GN;
  const gp = [];
  for (let i = 0; i <= GN; i++) { gp.push([]); for (let j = 0; j <= GN; j++) {
    gp[i].push(new THREE.Vector3(-span / 2 + i * cell + rr(-0.28, 0.28) * cell, 0, -span / 2 + j * cell + rr(-0.28, 0.28) * cell));
  } }
  for (let i = 0; i <= GN; i++) for (let j = 0; j <= GN; j++) {
    const p = gp[i][j]; const r = radiusAt(p.x, p.z), d = Math.hypot(p.x, p.z);
    if (d > r - cell * 0.6 && d < r + cell * 1.1) { const k = r / d; p.x *= k; p.z *= k; p.edge = true; }
    p.in = d <= r + 1e-3 || p.edge;
    p.y = p.in ? height(p.x, p.z) : 0;
  }
  const cG = C.grass.map((c) => new THREE.Color(c)), cF = C.field.map((c) => new THREE.Color(c));
  const cRock = new THREE.Color(C.rock), cRock2 = new THREE.Color(C.rock2 || C.rock), cSand = new THREE.Color(C.sand), cSnow = C.snow ? new THREE.Color(C.snow) : null;
  const cRoadside = new THREE.Color(C.grass[0]).offsetHSL(0, -0.05, -0.05);
  const pos = [], col = [];
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), nrm = new THREE.Vector3();
  function tri(a, b, c) {
    if (!(a.in && b.in && c.in)) return;
    tmpA.subVectors(b, a); tmpB.subVectors(c, a); nrm.crossVectors(tmpA, tmpB).normalize(); if (nrm.y < 0) nrm.negate();
    const cx = (a.x + b.x + c.x) / 3, cy = (a.y + b.y + c.y) / 3, cz = (a.z + b.z + c.z) / 3;
    const slope = 1 - nrm.y;
    let color = pick(cG).clone();
    const fieldN = N.fbm(cx * 0.32 + 40, cz * 0.32 + 7);
    if (fieldN > 0.56) color = pick(cF).clone();
    if (slope > 0.32) color = (rnd() > 0.5 ? cRock : cRock2).clone().offsetHSL(0, 0, rr(-0.03, 0.03));
    if (cSnow && cy > (C.snowLine || 4.3) + N.noise(cx, cz) * 0.8 && slope < 0.55) color = cSnow.clone();
    if (cy < WL + 0.55) color = (C.beach ? cSand : cSand.clone().lerp(cRock, 0.4)).clone().offsetHSL(0, 0, rr(-0.02, 0.02));
    if (C.terraces) { const band = Math.floor((cy + 2) / C.terraces) % C.strata.length; if (slope > 0.22) color = new THREE.Color(C.strata[band]).offsetHSL(0, 0, rr(-0.02, 0.02)); }
    color.offsetHSL(0, 0, rr(-0.025, 0.025));
    for (const p of [a, b, c]) { pos.push(p.x, p.y, p.z); col.push(color.r, color.g, color.b); }
  }
  for (let i = 0; i < GN; i++) for (let j = 0; j < GN; j++) {
    const a = gp[i][j], b = gp[i + 1][j], c = gp[i + 1][j + 1], d = gp[i][j + 1];
    if ((i + j) % 2) { tri(a, d, b); tri(b, d, c); } else { tri(a, d, c); tri(a, c, b); }
  }
  const topGeo = new THREE.BufferGeometry();
  topGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  topGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  topGeo.computeVertexNormals();
  const top = new THREE.Mesh(topGeo, mat('#ffffff', { vertexColors: true, side: THREE.DoubleSide })); top.receiveShadow = true; world.add(top);

  // ---- underside: stratified rock, tapering to a ragged keel
  const SEG = 64; const rings = [0, -0.7, -1.6, -2.7, -3.9, -5.1, -6.3, -7.4, -8.3];
  const scale = [1, 0.985, 0.94, 0.86, 0.74, 0.58, 0.4, 0.22, 0.08];
  const ringPts = rings.map((y, ri) => {
    const arr = [];
    for (let k = 0; k < SEG; k++) {
      const a = (k / SEG) * TAU; const o = outline(a);
      const sc = scale[ri] * (ri === 0 ? 1 : rr(0.9, 1.07));
      const jy = ri === 0 ? 0 : rr(-0.35, 0.35);
      const yy = ri === 0 ? height(o.x * 0.995, o.z * 0.995) : y + jy + (ri > 1 ? Math.sin(a * 2 + 1) * 0.6 : 0);
      arr.push(new THREE.Vector3(o.x * sc + (ri > 3 ? 0.5 : 0), Math.min(yy, ri === 0 ? 99 : yy), o.z * sc));
    }
    return arr;
  });
  const upos = [], ucol = [];
  const strata = C.strata.map((c) => new THREE.Color(c));
  for (let ri = 0; ri < rings.length - 1; ri++) for (let k = 0; k < SEG; k++) {
    const a = ringPts[ri][k], b = ringPts[ri][(k + 1) % SEG], c = ringPts[ri + 1][(k + 1) % SEG], d = ringPts[ri + 1][k];
    const base = strata[Math.min(strata.length - 1, Math.floor(ri * strata.length / (rings.length - 1)))];
    for (const t of [[a, b, c], [a, c, d]]) { const cc = base.clone().offsetHSL(0, 0, rr(-0.035, 0.035)); for (const p of t) { upos.push(p.x, p.y, p.z); ucol.push(cc.r, cc.g, cc.b); } }
  }
  const tip = new THREE.Vector3(0.8, -9.6, 0.1); const last = ringPts[rings.length - 1];
  for (let k = 0; k < SEG; k++) { const a = last[k], b = last[(k + 1) % SEG]; const cc = strata[strata.length - 1].clone().offsetHSL(0, 0, -0.04); for (const p of [a, b, tip]) { upos.push(p.x, p.y, p.z); ucol.push(cc.r, cc.g, cc.b); } }
  const uGeo = new THREE.BufferGeometry();
  uGeo.setAttribute('position', new THREE.Float32BufferAttribute(upos, 3));
  uGeo.setAttribute('color', new THREE.Float32BufferAttribute(ucol, 3));
  uGeo.computeVertexNormals();
  world.add(shadowAll(new THREE.Mesh(uGeo, mat('#ffffff', { vertexColors: true, side: THREE.DoubleSide })), true, true));
  // turf lip
  {
    const lp = [], lc = [];
    for (let k = 0; k < SEG; k++) {
      const a = ringPts[0][k], b = ringPts[0][(k + 1) % SEG];
      const a2 = a.clone().multiplyScalar(0.992); a2.y = a.y - rr(0.22, 0.42); const b2 = b.clone().multiplyScalar(0.992); b2.y = b.y - rr(0.22, 0.42);
      const lowA = a.y < WL + 0.2;
      const cc = (lowA ? new THREE.Color(C.sand) : new THREE.Color(C.grass[0])).offsetHSL(0, 0, -0.08);
      for (const p of [a, b, b2, a, b2, a2]) { lp.push(p.x * 1.003, p.y + 0.01, p.z * 1.003); lc.push(cc.r, cc.g, cc.b); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(lc, 3)); g.computeVertexNormals();
    world.add(shadowAll(new THREE.Mesh(g, mat('#ffffff', { vertexColors: true, side: THREE.DoubleSide })), false, true));
  }
  // hanging root/rock spikes under the rim
  const spikes = [];
  for (let k = 0; k < 12; k++) {
    const a = rr(0, TAU); const o = outline(a); const s = rr(0.18, 0.42);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(s, s * rr(2.5, 4.5), 5), mat(pick(C.strata)));
    sp.rotation.x = Math.PI; sp.position.set(o.x * rr(0.55, 0.85), rr(-6.5, -3.5), o.z * rr(0.55, 0.85)); world.add(shadowAll(sp)); spikes.push([sp, Math.atan2(o.z, o.x)]);
  }

  // ---- water: flat sheet at WL clipped to the outline, with a scrolling ripple texture
  const rippleTex = (() => {
    const S = 256; const cv = document.createElement('canvas'); cv.width = S; cv.height = S; const g = cv.getContext('2d');
    const base = new THREE.Color(C.water);
    g.fillStyle = '#' + base.getHexString(); g.fillRect(0, 0, S, S);
    const r2 = makeRng(5);
    for (let i = 0; i < 70; i++) { const y = r2() * S, x = r2() * S, w = 24 + r2() * 70; g.fillStyle = `rgba(255,255,255,${0.14 + r2() * 0.2})`; for (const dx of [0, -S, S]) { g.beginPath(); g.ellipse(x + dx, y, w / 2, 1.6, 0, 0, TAU); g.fill(); } }
    for (let i = 0; i < 30; i++) { const y = r2() * S, x = r2() * S, w = 40 + r2() * 80; g.fillStyle = `rgba(10,40,60,${0.06 + r2() * 0.06})`; for (const dx of [0, -S, S]) { g.beginPath(); g.ellipse(x + dx, y, w / 2, 2.2, 0, 0, TAU); g.fill(); } }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const fallTex = (() => {
    const S = 128; const cv = document.createElement('canvas'); cv.width = S; cv.height = S; const g = cv.getContext('2d');
    const base = new THREE.Color(C.water).lerp(new THREE.Color('#ffffff'), 0.25);
    g.fillStyle = '#' + base.getHexString(); g.fillRect(0, 0, S, S);
    const r3 = makeRng(11);
    for (let i = 0; i < 46; i++) { const x = r3() * S, w = 1 + r3() * 3, h = 20 + r3() * 60, y = r3() * S; g.fillStyle = `rgba(255,255,255,${0.25 + r3() * 0.45})`; for (const dy of [0, -S, S]) g.fillRect(x, y + dy, w, h); }
    for (let i = 0; i < 18; i++) { const x = r3() * S, w = 2 + r3() * 4, h = 30 + r3() * 50, y = r3() * S; g.fillStyle = `rgba(20,60,80,${0.08 + r3() * 0.08})`; for (const dy of [0, -S, S]) g.fillRect(x, y + dy, w, h); }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const fallAlpha = (() => {
    const cv = document.createElement('canvas'); cv.width = 4; cv.height = 128; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, '#000'); gr.addColorStop(0.42, '#eee'); gr.addColorStop(1, '#eee');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 128);
    const t = new THREE.CanvasTexture(cv); t.repeat.set(1, 0.5); return t;
  })();
  const fallDirs = [];
  const hasWater = (() => { for (let i = 0; i <= GN; i += 2) for (let j = 0; j <= GN; j += 2) { const p = gp[i][j]; if (p.in && waterAt(p.x, p.z) > 0.5) return true; } return false; })();
  if (hasWater) {
    // water only over cells that actually hold water, so the sheet never pokes out of the cliffs
    const wp = [], wu = [];
    const wv = (p) => { wp.push(p.x, 0, p.z); wu.push(p.x * 0.16, -p.z * 0.16); };
    for (let i = 0; i < GN; i++) for (let j = 0; j < GN; j++) {
      const a = gp[i][j], b = gp[i + 1][j], c = gp[i + 1][j + 1], d = gp[i][j + 1];
      if (!(a.in && b.in && c.in && d.in)) continue;
      if (Math.min(a.y, b.y, c.y, d.y) > WL + 0.02) continue;
      for (const p of [a, d, c, a, c, b]) wv(p);
    }
    const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3)); wg.setAttribute('uv', new THREE.Float32BufferAttribute(wu, 2)); wg.computeVertexNormals();
    const wtex = rippleTex.clone(); wtex.needsUpdate = true; wtex.repeat.set(1, 1);
    const wm = new THREE.MeshStandardMaterial({ color: '#ffffff', map: wtex, roughness: 0.25, metalness: 0.0, transparent: true, opacity: 0.94 });
    wm.side = THREE.DoubleSide; const water = new THREE.Mesh(wg, wm); water.position.y = WL; water.receiveShadow = true; world.add(water);
    const flowDir = C.river ? new THREE.Vector2(0.4, 1) : new THREE.Vector2(1, 0.4);
    anim.push((p) => { wtex.offset.set(flowDir.x * p * 3, flowDir.y * p * 3); });
    // waterfalls where the water meets the rim
    const falls = [];
    for (let k = 0; k < 160; k++) {
      const a = (k / 160) * TAU; const o = outline(a);
      if (waterAt(o.x * 0.97, o.z * 0.97) > 0.6) falls.push(a);
    }
    // group contiguous angles into falls
    const groups = []; let cur = [];
    for (let i = 0; i < falls.length; i++) { if (cur.length && falls[i] - cur[cur.length - 1] > 0.06) { groups.push(cur); cur = []; } cur.push(falls[i]); }
    if (cur.length) groups.push(cur);
    for (const g of groups) {
      const am = (g[0] + g[g.length - 1]) / 2, hw = Math.min(0.09, (g[g.length - 1] - g[0]) / 2 + 0.02);
      const a0 = am - hw, a1 = am + hw; fallDirs.push(am);
      const n = Math.max(3, Math.round((a1 - a0) / 0.03));
      const NJ = 10, len = 6.5;
      const fp = [], fu = [], idx = [];
      for (let i = 0; i <= n; i++) {
        const a = mix(a0, a1, i / n); const o = outline(a); const out = new THREE.Vector2(o.x, o.z).normalize();
        for (let j = 0; j <= NJ; j++) { const t = j / NJ; const push = Math.sin(t * Math.PI * 0.5) * 0.9 + t * 0.35; const spread = 1 + t * 0.25; const cx = o.x * 1.004, cz = o.z * 1.004;
          const mid = outline((a0 + a1) / 2); const lx = mix(mid.x, cx, spread), lz = mix(mid.z, cz, spread);
          fp.push(lx + out.x * push, WL + 0.02 - Math.pow(t, 1.25) * len, lz + out.y * push); fu.push(i / n, t * 2); }
      }
      for (let i = 0; i < n; i++) for (let j = 0; j < NJ; j++) { const A = i * (NJ + 1) + j, B = (i + 1) * (NJ + 1) + j; idx.push(A, B, A + 1, B, B + 1, A + 1); }
      const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fg.setAttribute('uv', new THREE.Float32BufferAttribute(fu, 2)); fg.setIndex(idx); fg.computeVertexNormals();
      const ft = fallTex.clone(); ft.needsUpdate = true; ft.repeat.set(Math.max(1, Math.round((a1 - a0) * 8)), 1);
      const fa = fallAlpha;
      const fm = new THREE.MeshStandardMaterial({ map: ft, alphaMap: fa, transparent: true, side: THREE.DoubleSide, roughness: 0.35, depthWrite: false });
      const fall = new THREE.Mesh(fg, fm); fall.renderOrder = 2; world.add(fall);
      anim.push((p) => { ft.offset.set(0, p * 18); });
      // foam at the lip, spray drifting out, and mist where the curtain fades
      const mid = outline((a0 + a1) / 2); const out = new THREE.Vector2(mid.x, mid.z).normalize(); const tan = new THREE.Vector2(-out.y, out.x);
      const wFall = Math.hypot(outline(a1).x - outline(a0).x, outline(a1).z - outline(a0).z);
      const foamMat = mat('#ffffff', { transparent: true, opacity: 0.95, roughness: 1 });
      // foam hugs the rim along the whole opening, at a fixed spacing so the density never changes with width
      {
        const g0 = g[0] - 0.012, g1 = g[g.length - 1] + 0.012;
        let arc = 0; const N = 80; const pts = [];
        for (let i = 0; i <= N; i++) { const o = outline(mix(g0, g1, i / N)); if (i) arc += Math.hypot(o.x - pts[i - 1].x, o.z - pts[i - 1].z); const wet = waterAt(o.x * 0.96, o.z * 0.96) > 0.45 && height(o.x * 0.97, o.z * 0.97) < WL + 0.05; pts.push({ x: o.x, z: o.z, s: arc, wet }); }
        // a soft white band just inside the lip, then two staggered rows of froth on top of it
        {
          const BP = []; const inset = 0.2;
          for (let i = 0; i < N; i++) {
            const A = pts[i], B = pts[i + 1]; if (!A.wet || !B.wet) continue; const oa = new THREE.Vector2(A.x, A.z).normalize(), ob = new THREE.Vector2(B.x, B.z).normalize();
            const a0 = [A.x + oa.x * 0.02, WL + 0.012, A.z + oa.y * 0.02], a1 = [A.x - oa.x * inset, WL + 0.012, A.z - oa.y * inset];
            const b0 = [B.x + ob.x * 0.02, WL + 0.012, B.z + ob.y * 0.02], b1 = [B.x - ob.x * inset, WL + 0.012, B.z - ob.y * inset];
            BP.push(...a0, ...b0, ...b1, ...a0, ...b1, ...a1);
          }
          const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(BP, 3)); bg.computeVertexNormals();
          const band = new THREE.Mesh(bg, mat('#ffffff', { transparent: true, opacity: 0.55, roughness: 1, side: THREE.DoubleSide, depthWrite: false }));
          band.renderOrder = 1; world.add(band);
        }
        const step = 0.07; const count = Math.max(2, Math.round(arc / step));
        for (let row = 0; row < 2; row++) for (let k = 0; k <= count; k++) {
          const target = Math.min(arc, ((k + row * 0.5) / count) * arc); let i = 1; while (i < N && pts[i].s < target) i++;
          const A = pts[i - 1], B = pts[i]; if (!A.wet || !B.wet) continue; const f = (target - A.s) / Math.max(1e-6, B.s - A.s);
          const x = mix(A.x, B.x, f), z = mix(A.z, B.z, f); const o = new THREE.Vector2(x, z).normalize();
          const r = row ? rr(0.06, 0.08) : rr(0.075, 0.1); const inn = row ? 0.11 : 0.02;
          const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), foamMat); world.add(puff);
          const bx = x - o.x * inn, bz = z - o.y * inn;
          const ph = rnd() * TAU; anim.push((p) => { const q = 1 + Math.sin(p * TAU * 6 + ph) * 0.15; puff.scale.set(q, q * 0.5, q); puff.position.set(bx, WL + 0.02, bz); });
        }
      }
      const sprayMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false });
      for (let k = 0; k < 14; k++) {
        const d = new THREE.Mesh(new THREE.IcosahedronGeometry(rr(0.035, 0.07), 0), sprayMat.clone()); d.renderOrder = 3; world.add(d);
        const s0 = rr(-0.45, 0.45) * wFall, ph = k / 14, vo = rr(0.5, 0.9), vu = rr(0.15, 0.4);
        anim.push((p) => { const q = (p * 6 + ph) % 1; const tt = q * 0.9;
          d.position.set(mid.x + tan.x * s0 + out.x * (0.15 + vo * tt), WL + 0.05 + vu * tt - 1.6 * tt * tt, mid.z + tan.y * s0 + out.y * (0.15 + vo * tt));
          d.material.opacity = 0.85 * (1 - q); });
      }
      const mistMat = mat('#ffffff', { transparent: true, opacity: 0.35, roughness: 1, depthWrite: false });
      for (let k = 0; k < 5; k++) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(rr(0.35, 0.55), 1), mistMat); world.add(m);
        const s0 = (k / 4 - 0.5) * wFall * 1.1, ph = rnd() * TAU, bx = mid.x + tan.x * s0 + out.x * 1.3, bz = mid.z + tan.y * s0 + out.y * 1.3;
        anim.push((p) => { const q = 1 + Math.sin(p * TAU * 2 + ph) * 0.12; m.scale.setScalar(q); m.position.set(bx, WL - len * 0.82 + Math.sin(p * TAU + ph) * 0.1, bz); });
      }
    }
  }

  for (const [sp, sa] of spikes) for (const fa of fallDirs) { const fo = outline(fa); const fang = Math.atan2(fo.z, fo.x); if (Math.abs(Math.atan2(Math.sin(sa - fang), Math.cos(sa - fang))) < 0.6) sp.visible = false; }
  // ---- road ribbon with edge lines and centre dashes
  function ribbonAlong(samples, hFn, width, yOff, color, filter = () => true) {
    const P = []; const n = samples.length - 1;
    const L = [], Rr = [];
    for (let i = 0; i <= n; i++) {
      const a = samples[(i - 1 + n) % n], b = samples[(i + 1) % n];
      const t = new THREE.Vector3().subVectors(b, a).setY(0).normalize(); const nn = new THREE.Vector3(-t.z, 0, t.x);
      const h = hFn(i) + yOff;
      const l = samples[i].clone().addScaledVector(nn, width / 2); l.y = h; const r = samples[i].clone().addScaledVector(nn, -width / 2); r.y = h;
      L.push(l); Rr.push(r);
    }
    for (let i = 0; i < n; i++) { if (!filter(i)) continue; for (const v of [L[i], L[i + 1], Rr[i + 1], L[i], Rr[i + 1], Rr[i]]) P.push(v.x, v.y, v.z); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat(color, { side: THREE.DoubleSide, roughness: 0.95 })); m.receiveShadow = true; return m;
  }
  const roadColor = RD.dirt ? '#b8946a' : '#4a4d52';
  world.add(ribbonAlong(roadSamples, roadHAt, 0.62, 0.03, roadColor));
  if (!RD.dirt) {
    const paint = mat('#f2efe7', { side: THREE.DoubleSide, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const strip = (off, w, filter) => {
      const P = []; const n = RS;
      const pt = (k, o) => { const t = roadCurve.getTangentAt((k % n) / n); const nn = new THREE.Vector3(-t.z, 0, t.x); const q = roadSamples[k % n]; return [q.x + nn.x * o, roadHAt(k % n) + 0.034, q.z + nn.z * o]; };
      for (let k = 0; k < n; k++) { if (!filter(k)) continue; const a = pt(k, off - w / 2), b = pt(k + 1, off - w / 2), c = pt(k + 1, off + w / 2), d = pt(k, off + w / 2); P.push(...a, ...b, ...c, ...a, ...c, ...d); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals();
      const m = new THREE.Mesh(g, paint); m.receiveShadow = true; return m;
    };
    world.add(strip(0.255, 0.03, () => true)); world.add(strip(-0.255, 0.03, () => true));
    const dashLen = 4, gap = 4; // samples (about 0.33 units each)
    world.add(strip(0, 0.03, (k) => k % (dashLen + gap) < dashLen));
  }
  // bridges: a clean deck with continuous low parapets and a few slim piers
  const onBridge = (k) => { const kk = ((k % RS) + RS) % RS; const q = roadSamples[kk]; return waterAt(q.x, q.z) > 0.3 && height(q.x, q.z) < Math.min(roadHAt(kk) - 0.3, WL + 0.15); };
  {
    const wallP = [], skirtP = [];
    const edge = (k, off) => { const t = roadCurve.getTangentAt((k % RS) / RS); const nn = new THREE.Vector3(-t.z, 0, t.x); const p = roadSamples[k % RS]; return [p.x + nn.x * off, p.z + nn.z * off]; };
    for (let k = 0; k < RS; k++) {
      if (!(onBridge(k) || onBridge(k + 1))) continue;
      const h0 = roadHAt(k % RS), h1 = roadHAt((k + 1) % RS);
      for (const s of [-1, 1]) {
        const [ax, az] = edge(k, 0.4 * s), [bx, bz] = edge(k + 1, 0.4 * s);
        wallP.push(ax, h0, az, bx, h1, bz, bx, h1 + 0.13, bz, ax, h0, az, bx, h1 + 0.13, bz, ax, h0 + 0.13, az);
        skirtP.push(ax, h0 - 0.03, az, bx, h1 - 0.03, bz, bx, h1 - 0.24, bz, ax, h0 - 0.03, az, bx, h1 - 0.24, bz, ax, h0 - 0.24, az);
      }
    }
    for (const [P, c] of [[wallP, '#ece7dc'], [skirtP, '#d6cfc0']]) { if (!P.length) continue; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals(); world.add(shadowAll(new THREE.Mesh(g, mat(c, { side: THREE.DoubleSide })))); }
    // find each continuous span and give it evenly spaced, symmetric piers
    const spans = []; let st = -1;
    for (let k = 0; k <= RS; k++) { const b = k < RS && onBridge(k); if (b && st < 0) st = k; if (!b && st >= 0) { spans.push([st, k - 1]); st = -1; } }
    for (const [a, b] of spans) {
      const L = b - a; const np = Math.max(1, Math.round(L / 12) - 1);
      for (let q = 1; q <= np; q++) {
        const k = Math.round(a + (L * q) / (np + 1)); const p = roadSamples[k];
        if (!inside(p.x, p.z, 0.9)) continue;
        const t = roadCurve.getTangentAt(k / RS); const top = roadHAt(k) - 0.22, gy = height(p.x, p.z), bot = (waterAt(p.x, p.z) > 0.5 ? Math.min(WL, gy) : gy) - 0.25, hgt = top - bot; if (hgt < 0.35) continue;
        const pier = new THREE.Mesh(new THREE.BoxGeometry(0.16, hgt, 0.66), mat('#d6cfc0'));
        pier.position.set(p.x, bot + hgt / 2, p.z); pier.rotation.y = Math.atan2(-t.z, t.x); world.add(shadowAll(pier));
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.78), mat('#e4ded2')); cap.position.set(p.x, top - 0.03, p.z); cap.rotation.y = pier.rotation.y; world.add(shadowAll(cap));
      }
    }
  }
  // deck under bridge spans so the road never floats
  world.add(shadowAll(ribbonAlong(roadSamples, roadHAt, 0.84, -0.03, '#d6cfc0', (i) => onBridge(i) || onBridge(i + 1))));

  // ---- placement helpers
  const occupied = [];
  const free = (x, z, r = 0.6, m = 0.7) => {
    if (!inside(x, z, m)) return false;
    if (distRoad(x, z)[0] < 0.75 + r * 0.5) return false;
    if (waterAt(x, z) > 0.02) return false;
    for (const o of occupied) if (Math.hypot(o[0] - x, o[1] - z) < o[2] + r) return false;
    return true;
  };
  const occupy = (x, z, r) => occupied.push([x, z, r]);
  const groundY = (x, z) => height(x, z);

  function blob(radius, colors, detail = 1, squash = 1, jitter = 0.15) {
    const g = new THREE.IcosahedronGeometry(radius, detail).toNonIndexed();
    const p = g.attributes.position, seen = new Map();
    for (let i = 0; i < p.count; i++) {
      const key = [p.getX(i), p.getY(i), p.getZ(i)].map((v) => v.toFixed(3)).join(',');
      if (!seen.has(key)) seen.set(key, 1 + rr(-jitter, jitter));
      const k = seen.get(key); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * squash, p.getZ(i) * k);
    }
    const c = []; for (let i = 0; i < p.count; i += 3) { const cc = new THREE.Color(pick(colors)).offsetHSL(0, 0, rr(-0.03, 0.03)); for (let k = 0; k < 3; k++) c.push(cc.r, cc.g, cc.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.computeVertexNormals();
    return new THREE.Mesh(g, mat('#ffffff', { vertexColors: true }));
  }
  const swayers = [];
  function sway(g, amt = 0.035) { const ph = rnd() * TAU; const ax = rr(-1, 1), az = rr(-1, 1); swayers.push((p) => { const s = Math.sin(p * TAU * 4 + ph) * amt; g.rotation.x = s * ax; g.rotation.z = s * az; }); }

  // ---- trees
  function tree(kind, x, z, sc = 1) {
    const y = groundY(x, z); const g = new THREE.Group(); const inner = new THREE.Group(); g.add(inner);
    const trunkM = mat(C.trunk);
    if (kind === 'cypress') {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * sc, 0.07 * sc, 0.3 * sc, 5), trunkM); t.position.y = 0.15 * sc; inner.add(t);
      const c = blob(0.3 * sc, C.conifer, 1, 4.2, 0.12); c.position.y = 1.35 * sc; inner.add(c);
    } else if (kind === 'pine' || kind === 'spruce') {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * sc, 0.08 * sc, 0.45 * sc, 5), trunkM); t.position.y = 0.22 * sc; inner.add(t);
      const tiers = kind === 'spruce' ? 4 : 3;
      for (let k = 0; k < tiers; k++) { const r = (0.55 - k * 0.11) * sc; const c = new THREE.Mesh(new THREE.ConeGeometry(r, 0.75 * sc, 7), mat(pick(C.conifer))); c.position.y = (0.6 + k * 0.38) * sc; c.rotation.y = rr(0, 1); inner.add(c); }
    } else if (kind === 'shrub') {
      const b = blob(0.36 * sc, C.foliage, 1, 0.7); b.position.y = 0.2 * sc; inner.add(b);
      if (rnd() > 0.5) { const b2 = blob(0.26 * sc, C.foliage, 0, 0.8); b2.position.set(0.3 * sc, 0.15 * sc, 0.1); inner.add(b2); }
    } else { // broadleaf / lemon / olive
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * sc, 0.1 * sc, 0.7 * sc, 5), trunkM); t.position.y = 0.35 * sc; inner.add(t);
      const b1 = blob(0.5 * sc, C.foliage, 1, 0.95); b1.position.y = 0.95 * sc; inner.add(b1);
      const b2 = blob(0.34 * sc, C.foliage, 1, 1); b2.position.set(rr(-0.3, 0.3) * sc, 0.8 * sc, rr(-0.3, 0.3) * sc); inner.add(b2);
      if (kind === 'lemon') for (let k = 0; k < 6; k++) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.06 * sc, 0), mat('#f2cf2e')); const a = rr(0, TAU), e = rr(-0.4, 0.6); f.position.set(Math.cos(a) * 0.48 * sc, 0.95 * sc + e * 0.4 * sc, Math.sin(a) * 0.48 * sc); inner.add(f); }
    }
    g.position.set(x, y - 0.03, z); g.rotation.y = rr(0, TAU); sway(inner, kind === 'cypress' ? 0.018 : 0.012);
    world.add(shadowAll(g)); return g;
  }
  const ZONES = { hilltown: [[-3.4, -3.4, 1.9]], farmhouse: [[4.2, -2.8, 1.2]], vineyard: [[4.0, 1.6, 1.5]], haybales: [[-0.6, -5.2, 1.3]], hut: [[3.8, -1.6, 1.0]], cows: [[2.6, 0, 1.4]], pastelTown: [[1.2, 1.0, 2.4]], terraces: [[-4.8, -1.6, 1.3]], nuraghe: [[-3.6, -2.6, 1.2]], castle: [[3.6, -3.2, 1.2]], vineRows: [[-3.2, 1.6, 1.6], [2.6, -2.0, 1.5]], village: [[-3.4, -2.6, 1.6]], redHouses: [[-1.2, -1.0, 1.6]], chimney: [[-3.4, -2.8, 0.8], [3.0, -4.2, 0.8]] };
  const zones = C.props.flatMap((k) => ZONES[k] || []);
  const inZone = (x, z) => zones.some(([zx, zz, zr]) => Math.hypot(x - zx, z - zz) < zr);
  let placed = 0, tries = 0;
  while (placed < C.trees.n && tries++ < 6000) {
    const x = rr(-8.5, 8.5), z = rr(-7.5, 7.5);
    if (!free(x, z, 0.45) || inZone(x, z)) continue;
    const h = groundY(x, z); if (C.snow && h > 3.8) continue;
    if (N.fbm(x * 0.28 + 70, z * 0.28 + 11) < 0.43) continue;
    const kind = rnd() < C.trees.conifer ? (C.trees.kind === 'cypress' ? 'cypress' : C.trees.kind === 'spruce' ? 'spruce' : 'pine') : (['lemon', 'shrub'].includes(C.trees.kind) ? C.trees.kind : 'broadleaf');
    tree(kind, x, z, rr(0.75, 1.2)); occupy(x, z, 0.45); placed++;
  }
  // grass tufts and pebbles for texture
  for (let k = 0; k < 70; k++) {
    const x = rr(-8, 8), z = rr(-7, 7); if (!free(x, z, 0.05, 0.4)) continue;
    const y = groundY(x, z); if (C.snow && y > 4) continue;
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.05, rr(0.18, 0.3), 3), mat(new THREE.Color(pick(C.grass)).offsetHSL(0, 0.05, -0.12)));
    tuft.position.set(x, y + 0.1, z); tuft.rotation.set(rr(-0.3, 0.3), rr(0, 3), rr(-0.3, 0.3)); world.add(tuft);
  }
  for (let k = 0; k < 16; k++) { const x = rr(-8, 8), z = rr(-7, 7); if (!free(x, z, 0.3)) continue; const r = blob(rr(0.12, 0.3), [C.rock, C.rock2 || C.rock], 0, 0.7, 0.25); r.position.set(x, groundY(x, z) + 0.05, z); world.add(shadowAll(r)); occupy(x, z, 0.3); }

  // ---- buildings and props
  const box = (w, h, d, c) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
  const roof = (w, d, h, c) => { const m = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) * 0.56, h, 4), mat(c)); m.rotation.y = Math.PI / 4; m.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); return m; };
  function house(x, z, w, h, d, wall, roofC, rot = 0, flat = false) {
    const y = groundY(x, z); const g = new THREE.Group();
    const b = box(w, h + 0.5, d, wall); b.position.y = (h + 0.5) / 2 - 0.5; g.add(b);
    if (!flat) { const r = roof(w * 1.08, d * 1.08, Math.min(w, d) * 0.55, roofC); r.position.y = h + Math.min(w, d) * 0.27; g.add(r); }
    else { const r = box(w * 1.02, 0.06, d * 1.02, roofC); r.position.y = h + 0.03; g.add(r); }
    // windows on the two faces visible to the camera
    for (let k = 0; k < Math.max(1, Math.floor(w / 0.32)); k++) { const win = box(0.09, 0.12, 0.02, '#3b4048'); win.position.set(-w / 2 + 0.18 + k * 0.3, h * 0.6, d / 2 + 0.005); if (win.position.x < w / 2 - 0.1) g.add(win); }
    for (let k = 0; k < Math.max(1, Math.floor(d / 0.32)); k++) { const win = box(0.02, 0.12, 0.09, '#3b4048'); win.position.set(w / 2 + 0.005, h * 0.6, -d / 2 + 0.18 + k * 0.3); if (win.position.z < d / 2 - 0.1) g.add(win); }
    g.position.set(x, y, z); g.rotation.y = rot; world.add(shadowAll(g)); occupy(x, z, Math.max(w, d) * 0.7); return g;
  }
  function findSpot(cx, cz, r, spread = 1.5, tries = 80) { for (let i = 0; i < tries; i++) { const x = cx + rr(-spread, spread), z = cz + rr(-spread, spread); if (free(x, z, r)) return [x, z]; } return null; }
  const flatAt = (x, z, r = 0.32) => { const hs = [[r, 0], [-r, 0], [0, r], [0, -r], [0, 0]].map(([dx, dz]) => groundY(x + dx, z + dz)); return Math.max(...hs) - Math.min(...hs) < 0.32 && inside(x, z, 1.1); };
  function cluster(cx, cz, n, spread, make) { let k = 0; for (let i = 0; i < n * 12 && k < n; i++) { const s = findSpot(cx, cz, 0.35, spread, 1); if (s && flatAt(s[0], s[1])) { make(s[0], s[1], k); k++; } } }
  const rows = (cx, cz, w, d, ang, color, step = 0.28) => {
    for (let i = -w / 2; i <= w / 2; i += step) for (let j = -d / 2; j <= d / 2; j += 0.2) {
      const x = cx + i * Math.cos(ang) - j * Math.sin(ang), z = cz + i * Math.sin(ang) + j * Math.cos(ang);
      if (!free(x, z, 0.05, 0.6)) continue; const v = box(0.09, 0.2, 0.15, color); v.position.set(x, groundY(x, z) + 0.08, z); v.rotation.y = -ang; world.add(shadowAll(v));
    }
  };

  const P = new Set(C.props);
  if (P.has('hilltown')) {
    const cx = -3.4, cz = -3.4;
    const walls = ['#ecdcc0', '#e3cfae', '#f1e5cf', '#d9c09a'];
    cluster(cx, cz, 14, 1.4, (x, z, k) => house(x, z, rr(0.38, 0.6), rr(0.35, 0.6), rr(0.38, 0.55), pick(walls), '#b5562f', rr(0, 0.4)));
    const s = findSpot(cx, cz, 0.3, 0.8); if (s) { const t = house(s[0], s[1], 0.32, 1.7, 0.32, '#e3cfae', '#b5562f', 0, true); }
    const ch = findSpot(cx, cz, 0.4, 1.0); if (ch) house(ch[0], ch[1], 0.5, 0.75, 0.9, '#efe3cb', '#b5562f', 0.3);
  }
  if (P.has('farmhouse')) { const s = findSpot(4.2, -2.8, 0.6, 1.2); if (s) { house(s[0], s[1], 0.8, 0.55, 0.6, '#e9d6b4', '#b5562f', 0.2); for (let k = 0; k < 4; k++) tree('cypress', s[0] + 0.9, s[1] - 0.6 + k * 0.35, 0.8); } }
  if (P.has('cypressAvenue')) {
    for (let i = 20; i < 110; i += 11) { const p = roadSamples[i]; const t = roadCurve.getTangentAt(i / RS); const nn = new THREE.Vector3(-t.z, 0, t.x);
      for (const sgn of [-1, 1]) { const x = p.x + nn.x * 0.62 * sgn, z = p.z + nn.z * 0.62 * sgn; if (inside(x, z, 0.5) && waterAt(x, z) < 0.05) tree('cypress', x, z, rr(0.8, 0.95)); } }
  }
  if (P.has('vineyard')) rows(4.0, 1.6, 2.4, 1.8, 0.5, '#5f7f2f');
  if (P.has('haybales')) for (let k = 0; k < 7; k++) { const s = findSpot(-0.6, -5.2, 0.2, 1.6); if (!s) continue; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 8), mat('#d9b866')); b.rotation.z = Math.PI / 2; b.rotation.y = rr(0, 3); b.position.set(s[0], groundY(...s) + 0.16, s[1]); world.add(shadowAll(b)); occupy(s[0], s[1], 0.2); }
  if (P.has('hut')) { const s = findSpot(3.8, -1.6, 0.6, 1.2); if (s) { const g = house(s[0], s[1], 0.7, 0.4, 0.55, '#8a5a3a', '#4b3a32', 0.5); } }
  if (P.has('cows')) for (let k = 0; k < 5; k++) { const s = findSpot(2.6, 0.0, 0.2, 1.8); if (!s) continue; const c = new THREE.Group(); const b = box(0.28, 0.14, 0.12, k % 2 ? '#7a5238' : '#efe9df'); b.position.y = 0.16; c.add(b); const h = box(0.09, 0.09, 0.09, '#3a2a22'); h.position.set(0.17, 0.2, 0); c.add(h); for (const [dx, dz] of [[0.1, 0.04], [0.1, -0.04], [-0.1, 0.04], [-0.1, -0.04]]) { const l = box(0.03, 0.1, 0.03, '#3a2a22'); l.position.set(dx, 0.05, dz); c.add(l); } c.position.set(s[0], groundY(...s), s[1]); c.rotation.y = rr(0, TAU); world.add(shadowAll(c)); occupy(s[0], s[1], 0.25); }
  if (P.has('pastelTown')) {
    const walls = ['#f2c7b4', '#f5dfa5', '#e9a98f', '#f7efe2', '#bcd6d9', '#f0b8a0', '#f6e3c1'];
    cluster(1.2, 1.0, 22, 2.4, (x, z) => house(x, z, rr(0.36, 0.55), rr(0.4, 0.75), rr(0.36, 0.5), pick(walls), '#d6cbb8', rr(-0.3, 0.3), true));
    const s = findSpot(0.4, 0.4, 0.4, 1.4); if (s) { const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 4, 0, TAU, 0, Math.PI / 2), mat('#3f8f6a')); const b = house(s[0], s[1], 0.6, 0.7, 0.6, '#f7efe2', '#f7efe2', 0, true); dome.position.set(0, 0.74, 0); b.add(dome); }
  }
  if (P.has('terraces')) rows(-4.8, -1.6, 2.2, 1.4, 0.9, '#6f8b3a', 0.35);
  if (P.has('lighthouse')) { const s = findSpot(-1.0, 5.4, 0.3, 1.5) || findSpot(5.4, -0.8, 0.3, 1.5); if (s) { const g = new THREE.Group(); for (let k = 0; k < 4; k++) { const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.17 - k * 0.012, 0.19 - k * 0.012, 0.3, 8), mat(k % 2 ? '#c8402e' : '#f5f2ea')); seg.position.y = 0.15 + k * 0.3; g.add(seg); } const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 8), mat('#fff3b0', { emissive: '#ffe27a', emissiveIntensity: 0.6 })); lamp.position.y = 1.3; g.add(lamp); const cap = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.18, 8), mat('#3a3f45')); cap.position.y = 1.47; g.add(cap); g.position.set(s[0], groundY(...s), s[1]); world.add(shadowAll(g)); occupy(s[0], s[1], 0.3); } }
  if (P.has('boats') || P.has('barge') || P.has('ferry')) {
    // find water spots
    const spots = []; for (let k = 0; k < 600 && spots.length < (P.has('boats') ? 3 : 1); k++) { const x = rr(-8, 8), z = rr(-7, 7); if (inside(x, z, 1.0) && waterAt(x, z) > 0.98 && waterAt(x + 0.6, z) > 0.98 && waterAt(x - 0.6, z) > 0.98 && distRoad(x, z)[0] > 1.4 && spots.every((s) => Math.hypot(s[0] - x, s[1] - z) > 1.6)) spots.push([x, z]); }
    spots.forEach(([x, z], i) => {
      const g = new THREE.Group();
      if (P.has('barge')) { const hull = box(1.3, 0.14, 0.32, '#2f3b46'); hull.position.y = 0.07; g.add(hull); const cab = box(0.22, 0.18, 0.26, '#f2efe8'); cab.position.set(-0.5, 0.22, 0); g.add(cab); const load = box(0.8, 0.08, 0.26, '#8a6a4a'); load.position.set(0.15, 0.16, 0); g.add(load); }
      else if (P.has('ferry')) { const hull = box(1.0, 0.16, 0.36, '#e9e7e2'); hull.position.y = 0.08; g.add(hull); const stripe = box(1.02, 0.05, 0.37, '#b8352b'); stripe.position.y = 0.12; g.add(stripe); const cab = box(0.4, 0.2, 0.3, '#f5f3ee'); cab.position.set(0.1, 0.26, 0); g.add(cab); }
      else {
        const sh = new THREE.Shape(); sh.moveTo(-0.34, 0.12); sh.lineTo(0.42, 0.12); sh.quadraticCurveTo(0.3, -0.02, 0.18, -0.06); sh.lineTo(-0.3, -0.06); sh.lineTo(-0.34, 0.12);
        const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false }); hg.translate(0, 0, -0.1);
        const hull = new THREE.Mesh(hg, mat(i % 2 ? '#f5f2ea' : '#2f5f8f')); g.add(hull);
        const deck = box(0.5, 0.03, 0.16, '#c9a77c'); deck.position.set(0, 0.125, 0); g.add(deck);
        const mast = box(0.025, 0.78, 0.025, '#e8e6e0'); mast.position.set(0.04, 0.52, 0); g.add(mast);
        const sg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.02, 0.18, 0), new THREE.Vector3(0.02, 0.88, 0), new THREE.Vector3(-0.3, 0.18, 0)]); sg.computeVertexNormals();
        const sail = new THREE.Mesh(sg, mat('#fbfaf5', { side: THREE.DoubleSide })); g.add(sail);
        const jg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.06, 0.2, 0), new THREE.Vector3(0.06, 0.8, 0), new THREE.Vector3(0.36, 0.16, 0)]); jg.computeVertexNormals();
        const jib = new THREE.Mesh(jg, mat('#f1efe8', { side: THREE.DoubleSide })); g.add(jib);
      }
      g.position.set(x, WL + 0.02, z); g.rotation.y = (P.has('boats') ? Math.PI / 4 + (rnd() > 0.5 ? Math.PI : 0) : rr(0, TAU)) + rr(-0.2, 0.2); world.add(shadowAll(g));
      const ph = rnd() * TAU, y0 = g.rotation.y; anim.push((p) => { g.position.y = WL + 0.02 + Math.sin(p * TAU * 2 + ph) * 0.025; g.rotation.z = Math.sin(p * TAU * 2 + ph) * 0.04; g.rotation.y = y0 + Math.sin(p * TAU + ph) * 0.12; });
    });
  }
  if (P.has('umbrellas')) for (let k = 0; k < 5; k++) { let s = null; for (let i = 0; i < 300 && !s; i++) { const x = rr(-8, 8), z = rr(-7, 7); const w = waterAt(x, z); if (w === 0 && waterAt(x + 0.5, z + 0.5) > 0.1 && free(x, z, 0.2)) s = [x, z]; } if (!s) continue; const g = new THREE.Group(); const pole = box(0.02, 0.32, 0.02, '#ddd'); pole.position.y = 0.16; g.add(pole); const top2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.08, 8), mat(k % 2 ? '#e4572e' : '#2f6fa8')); top2.position.y = 0.34; g.add(top2); g.position.set(s[0], groundY(...s), s[1]); world.add(shadowAll(g)); occupy(s[0], s[1], 0.2); }
  if (P.has('granite')) for (let k = 0; k < 12; k++) { const s = findSpot(rr(-5, 5), rr(-5, 5), 0.6, 0.5); if (!s) continue; const r = blob(rr(0.35, 0.8), ['#d2bfae', '#c4b09e', '#b9a593'], 1, 0.75, 0.22); r.position.set(s[0], groundY(...s) + 0.15, s[1]); world.add(shadowAll(r)); occupy(s[0], s[1], 0.6); }
  if (P.has('nuraghe')) { const s = findSpot(-3.6, -2.6, 0.7, 1.4); if (s) { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 1.0, 10), mat('#b7a48e')); c.position.y = 0.5; g.add(c); const d = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.05), mat('#2c2622')); d.position.set(0, 0.13, 0.6); g.add(d); for (let i = 0; i < 3; i++) { const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.62 - i * 0.07, 0.62 - i * 0.07, 0.02, 10), mat('#9e8c77')); ring.position.y = 0.25 + i * 0.3; ring.scale.setScalar(0.98 - i * 0.07); g.add(ring); } g.position.set(s[0], groundY(...s), s[1]); world.add(shadowAll(g)); occupy(s[0], s[1], 0.8); } }
  if (P.has('castle') || P.has('islandCastle')) {
    let s;
    if (P.has('islandCastle')) { // on a small islet in the loch, with a footbridge
      s = null; for (let i = 0; i < 400 && !s; i++) { const x = rr(-8, 8), z = rr(-7, 7); if (inside(x, z, 1.5) && waterAt(x, z) > 0.9 && waterAt(x + 1, z) > 0.9 && waterAt(x, z + 1) > 0.9 && waterAt(x - 1, z) > 0.9) s = [x, z]; }
      if (s) { const islet = blob(0.9, [C.grass[0], C.rock], 1, 0.35, 0.1); islet.position.set(s[0], WL + 0.05, s[1]); world.add(shadowAll(islet)); }
    } else s = findSpot(3.6, -3.2, 0.9, 0.8);
    if (s) {
      const y = P.has('islandCastle') ? WL + 0.3 : groundY(...s);
      const g = new THREE.Group(); const stone = P.has('islandCastle') ? '#a49c8e' : '#d9d2c4';
      const keep = box(0.7, 0.9, 0.6, stone); keep.position.y = 0.45; g.add(keep);
      const kr = roof(0.75, 0.65, 0.4, '#4a4f57'); kr.position.y = 1.1; g.add(kr);
      for (const [dx, dz] of [[-0.45, 0.4], [0.45, 0.4], [0.45, -0.4], [-0.45, -0.4]]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.15, 8), mat(stone)); t.position.set(dx, 0.57, dz); g.add(t); const c = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.36, 8), mat('#4a4f57')); c.position.set(dx, 1.32, dz); g.add(c); }
      const wall = box(1.0, 0.4, 0.1, stone); wall.position.set(0, 0.2, 0.42); g.add(wall);
      g.position.set(s[0], y, s[1]); g.rotation.y = 0.5; world.add(shadowAll(g)); occupy(s[0], s[1], 1.0);
      if (P.has('castle')) { const flag = box(0.18, 0.1, 0.01, '#c8402e'); flag.position.set(s[0] + 0.1, y + 1.7, s[1]); world.add(flag); const pole = box(0.015, 0.4, 0.015, '#ddd'); pole.position.set(s[0], y + 1.6, s[1]); world.add(pole); anim.push((p) => { flag.rotation.y = Math.sin(p * TAU * 6) * 0.3; }); }
    }
  }
  if (P.has('vineRows')) { rows(-3.2, 1.6, 2.6, 2.2, -0.15, '#5f8a33'); rows(2.6, -2.0, 2.4, 2.0, -0.15, '#5f8a33'); }
  if (P.has('village')) { cluster(-3.4, -2.6, 10, 1.2, (x, z) => { const h = house(x, z, rr(0.4, 0.55), rr(0.45, 0.65), rr(0.4, 0.5), '#f4f0e6', '#3d4148', rr(0, 0.5)); }); const s = findSpot(-3.2, -2.4, 0.3, 1.0); if (s) { const t = house(s[0], s[1], 0.3, 1.2, 0.3, '#f4f0e6', '#3d4148', 0); const sp = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 4), mat('#3d4148')); sp.position.y = 1.55; sp.rotation.y = Math.PI / 4; t.add(sp); } }
  if (P.has('redHouses')) cluster(-1.2, -1.0, 7, 1.6, (x, z) => house(x, z, rr(0.45, 0.6), rr(0.3, 0.45), rr(0.35, 0.45), pick(['#a8322a', '#b8412f', '#f1ede4', '#c9a24a']), '#3a3d40', rr(0, 1)));
  if (P.has('sheep')) for (let k = 0; k < 9; k++) { const s = findSpot(rr(-3, 3), rr(-3, 3), 0.15, 2.5); if (!s) continue; const g = new THREE.Group(); const b = blob(0.12, ['#f4f2ec', '#ecebe5'], 0, 0.8); b.position.y = 0.13; g.add(b); const h = box(0.06, 0.07, 0.06, '#2d2a28'); h.position.set(0.12, 0.15, 0); g.add(h); g.position.set(s[0], groundY(...s), s[1]); g.rotation.y = rr(0, TAU); world.add(shadowAll(g)); occupy(s[0], s[1], 0.15); const ph = rnd() * TAU; anim.push((p) => { h.rotation.z = Math.max(0, Math.sin(p * TAU * 2 + ph)) * 0.5; }); }
  if (P.has('stoneWall')) { // a continuous dry-stone wall following the road
    const wp = (i) => { const p = roadSamples[i % RS]; const t = roadCurve.getTangentAt((i % RS) / RS); const nn = new THREE.Vector3(-t.z, 0, t.x); const x = p.x + nn.x * 0.8, z = p.z + nn.z * 0.8; return [x, z]; };
    for (let i = 200; i < 300; i += 2) { const [x0, z0] = wp(i), [x1, z1] = wp(i + 2); if (!inside(x0, z0, 0.4) || !inside(x1, z1, 0.4) || waterAt(x0, z0) > 0 || waterAt(x1, z1) > 0) continue;
      const y0 = groundY(x0, z0), y1 = groundY(x1, z1); const L = Math.hypot(x1 - x0, z1 - z0) + 0.04;
      const w = box(0.12, 0.17, L, '#8e8a83'); w.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.06, (z0 + z1) / 2); w.lookAt(x1, y1 + 0.06, z1); world.add(shadowAll(w)); } }
  if (P.has('chimney')) for (const [cx, cz, h] of [[-3.4, -2.8, 2.6], [3.0, -4.2, 1.8]]) { const s = findSpot(cx, cz, 0.5, 0.8); if (!s) continue; const g = new THREE.Group(); const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.42, h, 7), mat('#cfa77a')); col2.position.y = h / 2; g.add(col2); const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.32, 7), mat('#9c7452')); cap.position.y = h + 0.12; g.add(cap); g.position.set(s[0], groundY(...s), s[1]); world.add(shadowAll(g)); occupy(s[0], s[1], 0.5); }
  if (P.has('agave')) for (let k = 0; k < 16; k++) { const s = findSpot(rr(-5, 5), rr(-5, 5), 0.15, 0.4); if (!s) continue; const g = new THREE.Group(); for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.36, 3), mat('#7f9a6a')); l.position.y = 0.14; l.rotation.set(0.6, (i / 6) * TAU, 0, 'YXZ'); g.add(l); } g.position.set(s[0], groundY(...s), s[1]); world.add(shadowAll(g)); occupy(s[0], s[1], 0.15); }
  if (P.has('cliffFalls')) {
    // thin ribbon falls down the fjord walls (Seven Sisters style)
    for (let k = 0; k < 3; k++) {
      let s = null; for (let i = 0; i < 400 && !s; i++) { const x = rr(-6, 6), z = rr(-6, 6); if (inside(x, z, 1) && waterAt(x, z) > 0.9) { const xx = x - 1.3, zz = z - 1.3; if (groundY(xx, zz) > 2.5) s = [x, z, xx, zz]; } }
      if (!s) continue; const [wx, wz, cx, cz] = s; const topY = groundY(cx, cz);
      const fall = new THREE.Mesh(new THREE.PlaneGeometry(0.16, topY - WL), new THREE.MeshStandardMaterial({ map: (() => { const t = rippleTex.clone(); t.needsUpdate = true; t.rotation = Math.PI / 2; t.center.set(0.5, 0.5); anim.push((p) => { t.offset.set(p * 8, 0); }); return t; })(), transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
      fall.position.set((wx + cx) / 2 + 0.35, (topY + WL) / 2, (wz + cz) / 2 + 0.35); fall.lookAt(30, fall.position.y, 30); world.add(fall);
    }
  }

  // ---- vehicle, driving the loop
  const car = buildVehicle(C.vehicle, C.carColor, C.carColor2, mat, box);
  world.add(shadowAll(car));
  const u0 = opts.carStart ?? 0.08;
  const laps = 3;
  const roadLen = roadCurve.getLength();
  const hAtU = (u) => { const f = (((u % 1) + 1) % 1) * RS; const k = Math.floor(f), t = f - k; return mix(roadProfile[k % RS], roadProfile[(k + 1) % RS], t) + 0.02; };
  const fwd = new THREE.Vector3(), up = new THREE.Vector3(), side = new THREE.Vector3(), basis = new THREE.Matrix4(), WUP = new THREE.Vector3(0, 1, 0);
  const carAt = (p) => {
    const u = (u0 + p * laps) % 1;
    const pt = roadCurve.getPointAt(u), tg = roadCurve.getTangentAt(u);
    const du = 0.35 / roadLen; // half a car length
    const hF = hAtU(u + du), hB = hAtU(u - du);
    fwd.set(tg.x, 0, tg.z).normalize().multiplyScalar(0.7).setY(hF - hB).normalize();
    side.crossVectors(fwd, WUP).normalize(); up.crossVectors(side, fwd).normalize();
    basis.makeBasis(fwd, up, side); car.quaternion.setFromRotationMatrix(basis);
    const nn = new THREE.Vector3(-tg.z, 0, tg.x);
    car.position.set(pt.x - nn.x * 0.14, (hF + hB) / 2 + 0.03, pt.z - nn.z * 0.14);
  };
  anim.push(carAt);
  // a small flock gliding slowly above the road loop, once round per loop
  {
    const birdMat = mat('#33393f', { side: THREE.DoubleSide });
    const form = [[0, 0, 0], [-0.24, 0.17, 0.04], [-0.24, -0.18, -0.03], [-0.48, 0.33, 0.06], [-0.5, -0.15, 0.07]];
    form.forEach(([back, lat, dy], bi) => {
      const b = new THREE.Group();
      const wingGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.08, 0, 0.28), new THREE.Vector3(0.1, 0, 0.05)]); wingGeo.computeVertexNormals();
      const L = new THREE.Mesh(wingGeo, birdMat), Rw = new THREE.Mesh(wingGeo, birdMat); Rw.scale.z = -1; b.add(L); b.add(Rw);
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 4), birdMat); body.rotation.z = -Math.PI / 2; b.add(body);
      b.scale.setScalar(0.6); world.add(b);
      const flapPh = rnd() * TAU, wob = rnd() * TAU;
      anim.push((p) => {
        const u = (u0 + 0.5 + p - back / roadLen + 1) % 1;
        const pt = roadCurve.getPointAt(u), tg = roadCurve.getTangentAt(u); const nn = new THREE.Vector3(-tg.z, 0, tg.x);
        const l = lat + Math.sin(p * TAU * 3 + wob) * 0.04;
        const bx = pt.x + nn.x * l, bz = pt.z + nn.z * l; let gmax = -9; for (const [ox, oz] of [[0, 0], [0.9, 0], [-0.9, 0], [0, 0.9], [0, -0.9]]) gmax = Math.max(gmax, height(bx + ox, bz + oz));
        b.position.set(bx, Math.max(hAtU(u) + 1.8, gmax + 1.9) + dy + Math.sin(p * TAU * 4 + wob) * 0.06, bz);
        b.rotation.y = Math.atan2(-tg.z, tg.x);
        const gate = Math.max(0, Math.sin(p * TAU * 5 + flapPh)) ** 2; const f = Math.sin(p * TAU * 140 + flapPh) * 0.6 * gate + 0.1;
        L.rotation.x = -f; Rw.rotation.x = f;
      });
    });
  }
  // destination marker: a slim post with a pennant
  {
    const i = Math.round(((u0 + 0.62) % 1) * RS); const p = roadSamples[i]; const t = roadCurve.getTangentAt(i / RS); const nn = new THREE.Vector3(-t.z, 0, t.x);
    const x = p.x + nn.x * 0.62, z = p.z + nn.z * 0.62; const y = Math.max(groundY(x, z), roadHAt(i));
    const g = new THREE.Group(); const pole = box(0.04, 1.1, 0.04, '#2b2f33'); pole.position.y = 0.55; g.add(pole);
    const flag = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.48, -0.13, 0), new THREE.Vector3(0, -0.28, 0)]), mat(opts.markerColor || '#1e6b52', { side: THREE.DoubleSide }));
    flag.geometry.computeVertexNormals(); flag.position.y = 1.08; g.add(flag);
    g.position.set(x, y, z); world.add(shadowAll(g)); anim.push((p) => { flag.rotation.y = Math.sin(p * TAU * 5) * 0.25; flag.scale.x = 1 + Math.sin(p * TAU * 7) * 0.06; });
  }

  // ---- floating debris (drifting, looping)
  for (let i = 0; i < 9; i++) {
    let a = rr(-0.9, 2.5); const d = rr(1.5, 7);
    for (const fa0 of fallDirs) { const fo = outline(fa0); const fa = Math.atan2(fo.z / 0.8, fo.x); let da = Math.atan2(Math.sin(a - fa), Math.cos(a - fa)); if (Math.abs(da) < 0.55) a = fa + (da >= 0 ? 0.55 : -0.55); }
    const r = blob(rr(0.1, 0.38), C.strata.slice(1), rnd() > 0.5 ? 1 : 0, 0.85, 0.25);
    const bx = Math.cos(a) * d, bz = Math.sin(a) * d * 0.8, by = rr(-12.2, -8.5) + (i < 4 ? 3 : 0);
    if (rnd() > 0.6) { const moss = blob(r.geometry.parameters?.radius || 0.2, C.grass, 0, 0.3); }
    root.add(shadowAll(r, true, false));
    const ph = rnd() * TAU, amp = rr(0.08, 0.2), rx0 = rr(0, 3), ry0 = rr(0, 3), rz0 = rr(0, 3);
    anim.push((p) => { r.position.set(bx, by + Math.sin(p * TAU + ph) * amp, bz); r.rotation.set(rx0 + Math.sin(p * TAU + ph) * 0.08, ry0 + Math.sin(p * TAU + ph) * 0.25, rz0); });
  }
  // the island itself breathes up and down
  anim.push((p) => { world.position.y = Math.sin(p * TAU) * 0.18; world.rotation.y = Math.sin(p * TAU) * 0.01; });
  anim.push((p) => swayers.forEach((f) => f(p)));

  root.userData = { title: C.title, country: C.country, region: regionKey };
  return { root, car, update: (p) => anim.forEach((f) => f(p)), config: C };
}

// ---------------------------------------------------------------- vehicles (generic, unbranded)
export function buildVehicle(kind, c1, c2, mat, box) {
  const g = new THREE.Group();
  const dark = mat('#1d2024', { roughness: 0.7 }), glass = mat('#2c3a46', { roughness: 0.2 }), chrome = mat('#c9ccd0', { roughness: 0.4 });
  const body = mat(c1, { roughness: 0.5 }), body2 = mat(c2, { roughness: 0.55 });
  const lamp = mat('#fff6c8', { emissive: '#ffe58a', emissiveIntensity: 0.8 });
  const B = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g.add(o); return o; };
  const wheel = (x, z, r = 0.12, w = 0.09) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 10), dark); t.rotation.x = Math.PI / 2; t.position.set(x, r, z); g.add(t); const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.45, w + 0.01, 6), chrome); h.rotation.x = Math.PI / 2; h.position.set(x, r, z); g.add(h); };
  const lights = (x, y, zs) => zs.forEach((z) => B(0.02, 0.04, 0.07, lamp, x, y, z));
  if (kind === 'tent4x4') {
    B(0.86, 0.2, 0.4, body, 0, 0.24, 0); B(0.52, 0.2, 0.37, body, -0.12, 0.43, 0); B(0.5, 0.11, 0.38, glass, -0.12, 0.45, 0);
    B(0.04, 0.15, 0.33, glass, 0.15, 0.43, 0); B(0.04, 0.12, 0.42, dark, 0.44, 0.2, 0); B(0.56, 0.03, 0.38, dark, -0.12, 0.545, 0); B(0.48, 0.1, 0.35, body2, -0.14, 0.61, 0);
    B(0.06, 0.24, 0.24, dark, -0.47, 0.32, 0); lights(0.445, 0.28, [0.13, -0.13]);
    [[0.27, 0.2], [0.27, -0.2], [-0.27, 0.2], [-0.27, -0.2]].forEach(([x, z]) => wheel(x, z, 0.13, 0.1));
  } else if (kind === 'van') { // classic split-window style camper, generic
    B(0.82, 0.26, 0.4, body, 0, 0.27, 0); B(0.82, 0.22, 0.4, body2, 0, 0.51, 0); B(0.7, 0.1, 0.405, glass, -0.04, 0.53, 0); B(0.03, 0.14, 0.34, glass, 0.41, 0.52, 0);
    B(0.84, 0.03, 0.42, body2, 0, 0.635, 0); B(0.04, 0.04, 0.42, chrome, 0.42, 0.16, 0); lights(0.415, 0.3, [0.14, -0.14]);
    [[0.27, 0.2], [0.27, -0.2], [-0.25, 0.2], [-0.25, -0.2]].forEach(([x, z]) => wheel(x, z, 0.11));
  } else if (kind === 'motorhome') {
    B(1.2, 0.5, 0.44, body, -0.1, 0.4, 0); B(0.3, 0.26, 0.42, body, 0.58, 0.28, 0); B(0.03, 0.14, 0.38, glass, 0.735, 0.34, 0);
    B(0.42, 0.14, 0.45, body, 0.5, 0.58, 0); B(1.22, 0.05, 0.445, body2, -0.1, 0.3, 0); B(0.3, 0.1, 0.445, glass, -0.3, 0.5, 0); B(0.16, 0.1, 0.445, glass, 0.15, 0.5, 0);
    lights(0.735, 0.24, [0.15, -0.15]);
    [[0.48, 0.21], [0.48, -0.21], [-0.45, 0.21], [-0.45, -0.21]].forEach(([x, z]) => wheel(x, z, 0.11));
  } else if (kind === 'caravan') { // estate car towing a round-cornered caravan
    B(0.7, 0.16, 0.36, body, 0.42, 0.19, 0); B(0.44, 0.15, 0.34, body, 0.36, 0.34, 0); B(0.42, 0.09, 0.345, glass, 0.36, 0.35, 0); B(0.03, 0.11, 0.3, glass, 0.59, 0.33, 0);
    lights(0.775, 0.2, [0.12, -0.12]); [[0.62, 0.17], [0.62, -0.17], [0.22, 0.17], [0.22, -0.17]].forEach(([x, z]) => wheel(x, z, 0.1, 0.08));
    B(0.12, 0.03, 0.04, dark, 0.02, 0.14, 0);
    const cv = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.42, 3, 8), body2); cv.rotation.z = Math.PI / 2; cv.scale.set(1.15, 1, 0.92); cv.position.set(-0.42, 0.36, 0); g.add(cv);
    B(0.6, 0.04, 0.42, mat(c1 === '#5b6770' ? '#7aa6c2' : c1), -0.42, 0.34, 0); B(0.24, 0.08, 0.425, glass, -0.36, 0.44, 0);
    wheel(-0.42, 0.2, 0.1, 0.07); wheel(-0.42, -0.2, 0.1, 0.07);
  } else if (kind === 'roadster') {
    B(0.8, 0.13, 0.36, body, 0, 0.17, 0); B(0.34, 0.06, 0.36, body, 0.2, 0.25, 0); B(0.03, 0.1, 0.3, glass, 0.03, 0.29, 0);
    B(0.2, 0.06, 0.28, mat('#5a3b2c'), -0.1, 0.24, 0); B(0.1, 0.1, 0.03, mat('#5a3b2c'), -0.16, 0.3, 0.07); B(0.1, 0.1, 0.03, mat('#5a3b2c'), -0.16, 0.3, -0.07);
    B(0.04, 0.05, 0.38, chrome, 0.41, 0.14, 0); lights(0.405, 0.2, [0.12, -0.12]);
    [[0.26, 0.18], [0.26, -0.18], [-0.26, 0.18], [-0.26, -0.18]].forEach(([x, z]) => wheel(x, z, 0.1, 0.08));
  } else if (kind === 'estate') {
    B(0.86, 0.17, 0.38, body, 0, 0.2, 0); B(0.6, 0.16, 0.36, body, -0.1, 0.36, 0); B(0.58, 0.1, 0.365, glass, -0.1, 0.37, 0); B(0.03, 0.12, 0.32, glass, 0.2, 0.36, 0);
    B(0.5, 0.025, 0.3, chrome, -0.12, 0.45, 0); B(0.36, 0.07, 0.26, body2, -0.12, 0.49, 0);
    lights(0.435, 0.22, [0.13, -0.13]); [[0.27, 0.18], [0.27, -0.18], [-0.27, 0.18], [-0.27, -0.18]].forEach(([x, z]) => wheel(x, z, 0.11, 0.08));
  } else { // city: small rounded hatch, generic
    B(0.66, 0.17, 0.36, body, 0, 0.19, 0); B(0.42, 0.13, 0.33, body, -0.06, 0.335, 0); B(0.4, 0.085, 0.335, glass, -0.06, 0.34, 0); B(0.03, 0.1, 0.29, glass, 0.155, 0.335, 0);
    B(0.4, 0.025, 0.31, body2, -0.06, 0.41, 0); B(0.03, 0.03, 0.37, chrome, 0.335, 0.13, 0); lights(0.335, 0.21, [0.11, -0.11]);
    [[0.21, 0.17], [0.21, -0.17], [-0.21, 0.17], [-0.21, -0.17]].forEach(([x, z]) => wheel(x, z, 0.1, 0.08));
  }
  g.scale.setScalar(1.08);
  return g;
}

// ---------------------------------------------------------------- environment around the island
export function buildEnvironment(C, seed = 3, o = {}) {
  const rnd = makeRng(seed); const rr = (a, b) => a + rnd() * (b - a);
  const env = new THREE.Group(); const anim = [];
  const mat = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.95, ...extra });
  function cloud(sc, op = 1) {
    const g = new THREE.Group();
    const n = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(rr(0.5, 0.9), 1), mat(['#ffffff', '#f6f8fa', '#eef2f5'][i % 3], { transparent: op < 1, opacity: op })); b.position.set((i - n / 2) * 0.75 + rr(-0.2, 0.2), rr(-0.1, 0.35), rr(-0.3, 0.3)); b.scale.y = 0.7; g.add(b); }
    g.scale.setScalar(sc); return g;
  }
  // sea of clouds far below (left out when the island floats over the app's own paper)
  if (o.sea !== false) for (let i = 0; i < 46; i++) { const a = rr(0, TAU), d = rr(4, 34); const c = cloud(rr(1.4, 2.8)); c.position.set(Math.cos(a) * d - 4, rr(-17, -14.5), Math.sin(a) * d - 4); c.rotation.y = rr(0, TAU); env.add(c); const ph = rnd() * TAU, x0 = c.position.x; anim.push((p) => { c.position.x = x0 + Math.sin(p * TAU + ph) * 0.6; }); }
  // a few clouds at island height
  for (const [x, y, z, s] of [[-12, 3.5, 2, 1.1], [4, 6.5, -12, 0.8], [-6, 8.5, -9, 1.0], [12, -1.5, -5, 0.8]]) { const c = cloud(s); c.position.set(x, y, z); env.add(c); const ph = rnd() * TAU; anim.push((p) => { c.position.x = x + Math.sin(p * TAU + ph) * 0.8; c.position.y = y + Math.sin(p * TAU * 2 + ph) * 0.08; }); }
  // distant small islands, lost in the haze
  const haze = (c, k = 0.35) => new THREE.Color(c).lerp(new THREE.Color(C.fog), k);
  const isl = (x, y, z, s, col) => {
    const g = new THREE.Group(); col = haze(col);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.9, 0.3, 11), mat(col)); g.add(top);
    const bot = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.4, 11, 3), mat(haze(C.strata[1]))); bot.rotation.x = Math.PI; bot.position.y = -1.35; g.add(bot);
    for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.6, 6), mat(haze(C.conifer[0]))); t.position.set(rr(-0.5, 0.5), 0.45, rr(-0.5, 0.5)); g.add(t); }
    g.position.set(x, y, z); g.scale.setScalar(s); env.add(g); const ph = rnd() * TAU; anim.push((p) => { g.position.y = y + Math.sin(p * TAU + ph) * 0.25; });
  };
  isl(-20, -6, -4, 1.5, C.grass[1]); isl(-4, -4, -20, 1.2, C.grass[2]); isl(-10, -12, 4, 0.9, C.grass[0]);
  return { env, update: (p) => anim.forEach((f) => f(p)) };
}

// ---------------------------------------------------------------- scene, lights, camera
export function makeStage(canvasW, canvasH, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !!opts.transparent, preserveDrawingBuffer: !!opts.preserve });
  renderer.setSize(canvasW, canvasH, false); renderer.setPixelRatio(opts.dpr || 1);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
  const setView = (w, h, zoom = 14) => { const a = w / h; cam.left = -zoom * a; cam.right = zoom * a; cam.top = zoom; cam.bottom = -zoom; cam.updateProjectionMatrix(); };
  setView(canvasW, canvasH, opts.zoom);
  cam.position.set(30, 25, 30); cam.lookAt(0, -1.8, 0);
  const hemi = new THREE.HemisphereLight('#eef4fb', '#7d6a58', 0.9); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff3dc', 3.1); sun.position.set(4, 20, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(opts.shadow || 2048, opts.shadow || 2048);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 70 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#bcd3ee', 0.8); rim.position.set(-14, 6, -10); scene.add(rim);
  const fill = new THREE.DirectionalLight('#ffe2c4', 0.35); fill.position.set(16, 2, 4); scene.add(fill);
  return { renderer, scene, cam, setView };
}

export function skyTexture(C) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, C.sky[0]); gr.addColorStop(0.62, C.sky[1]); gr.addColorStop(1, C.fog);
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
