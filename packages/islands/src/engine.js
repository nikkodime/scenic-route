// Panoramica islands, live: one floating island rendered in real time over the page's own background.
// Shared by the web planner (imported) and the iOS app (bundled into dist/island-engine.js, run in a WKWebView).
import * as THREE from 'three';
import { buildIsland, buildEnvironment, makeStage, REGIONS, REGION_KEYS, LOOP } from './islands.js';

export { REGIONS, REGION_KEYS, LOOP };

/** The haze colour at dusk: the dark theme's sky (Theme.sky / --sky after dark). */
const DUSK_FOG = '#16283a';

/**
 * Mount a live island into `el` (it fills the element).
 * opts.region      region key (default 'tuscany')
 * opts.air         clouds and distant islands drifting around it (default true)
 * opts.sea         with air: the sea of clouds below too (default false: the island floats over paper)
 * opts.fit         1 = the island spans the frame; smaller leaves more air around it (default 0.9)
 * opts.lift        shifts the island up (+) or down (-) as a fraction of the frame height (default 0)
 * opts.interactive drag to turn (default true)
 * opts.fps         frame cap, to spare the battery (default 30)
 * opts.motion      false renders one still frame (Reduce Motion); dragging still turns it
 * opts.phase       start phase in [0, 1) of the 36 s loop
 * opts.mood        'day' (morning light, for light mode) or 'dusk' (low warm sun and blue hour, for dark mode)
 * opts.onReady     called after the first frame is on screen
 */
export function mountIsland(el, opts = {}) {
  const o = { region: 'tuscany', air: true, sea: false, fit: 0.9, lift: 0, interactive: true, fps: 30, motion: true, phase: 0.1, mood: 'day', ...opts };
  if (!REGIONS[o.region]) o.region = 'tuscany';
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motion = o.motion && !reduce;

  let W = Math.max(1, el.clientWidth), H = Math.max(1, el.clientHeight);
  const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
  const st = makeStage(W, H, { transparent: true, dpr, shadow: 2048 });
  st.renderer.setClearColor(0x000000, 0);
  const cv = st.renderer.domElement;
  Object.assign(cv.style, { width: '100%', height: '100%', display: 'block', touchAction: o.interactive ? 'pan-y' : 'auto' });
  el.appendChild(cv);

  // Orthographic framing: fit the island to the narrower side, then nudge it vertically.
  const frame = () => {
    const a = W / H, z = (10.6 / Math.min(a, 1)) / o.fit;
    st.setView(W, H, z);
    st.cam.position.set(30, 25, 30);
    st.cam.lookAt(0, -1.8, 0);
    st.cam.translateY(-o.lift * 2 * z);
    st.cam.updateProjectionMatrix();
  };
  frame();

  let region = o.region, isl = null, env = null, yaw = 0, vel = 0, drag = null;
  let phase = o.phase, last = 0, t0 = performance.now() - phase * LOOP * 1000;
  let swap = null; // { t, to } while one island sinks away and the next one rises
  let visible = true, alive = true, raf = 0, readyFired = false;

  function build(k) {
    if (isl) { st.scene.remove(isl.root); dispose(isl.root); }
    const C = REGIONS[k];
    isl = buildIsland(k, { seed: 7 }); st.scene.add(isl.root);
    region = k;
    air();
    light();
  }

  // Clouds and distant islands; their haze is baked in, so they are rebuilt when the mood changes.
  function air() {
    if (env) { st.scene.remove(env.env); dispose(env.env); env = null; }
    if (!o.air) return;
    const C = REGIONS[region];
    env = buildEnvironment(mood === 'dusk' ? { ...C, fog: DUSK_FOG } : C, 3, { sea: o.sea });
    st.scene.add(env.env);
  }

  // Day: the design's morning light. Dusk: the sun low and warm from the side, a blue-hour sky light,
  // haze that fades into the dark page, and the car's lamps and the lighthouse glowing.
  function light() {
    const C = REGIONS[region], L = st.lights, dusk = mood === 'dusk';
    const set = (l, c, i) => { l.color.set(c); l.intensity = i; };
    if (dusk) {
      set(L.hemi, '#a9bcdc', 0.8); L.hemi.groundColor.set('#3a2f3a');
      set(L.sun, '#ffbb88', 2.9); L.sun.position.set(16, 12, 8);
      set(L.rim, '#86a6e0', 1.15);
      set(L.fill, '#d4927c', 0.3);
      st.renderer.toneMappingExposure = 0.98;
      st.scene.fog = new THREE.Fog(DUSK_FOG, 40, 88);
    } else {
      set(L.hemi, '#eef4fb', 0.9); L.hemi.groundColor.set('#7d6a58');
      set(L.sun, '#fff3dc', 3.1); L.sun.position.set(4, 20, 14);
      set(L.rim, '#bcd3ee', 0.8);
      set(L.fill, '#ffe2c4', 0.35);
      st.renderer.toneMappingExposure = 1.05;
      st.scene.fog = new THREE.Fog(C.fog, 46, 92);
    }
    st.scene.traverse((n) => {
      const m = n.material; if (!m || !m.emissive) return;
      for (const x of Array.isArray(m) ? m : [m]) {
        if (x.userData.glow === undefined) x.userData.glow = x.emissiveIntensity;
        if (x.userData.glow > 0) x.emissiveIntensity = dusk ? x.userData.glow * 3.2 : x.userData.glow;
      }
    });
  }
  let mood = o.mood === 'dusk' ? 'dusk' : 'day';
  build(region);

  function render(now) {
    if (motion) phase = ((now - t0) / (LOOP * 1000)) % 1;
    if (!drag && Math.abs(vel) > 1e-4) { yaw += vel; vel *= 0.93; }
    let y = 0, s = 1;
    if (swap) {
      const k = Math.min(1, (now - swap.t) / 900);
      if (k < 0.5) { const e = k / 0.5; y = -e * e * 6; s = 1 - e * 0.12; }
      else {
        if (swap.to) { build(swap.to); swap.to = null; }
        const e = 1 - (k - 0.5) / 0.5; y = -e * e * 6; s = 1 - e * 0.12;
      }
      if (k >= 1) swap = null;
    }
    isl.root.rotation.y = yaw; isl.root.position.y = y; isl.root.scale.setScalar(s);
    isl.update(phase); env && env.update(phase);
    st.renderer.render(st.scene, st.cam);
    if (!readyFired) { readyFired = true; o.onReady && o.onReady(); }
  }

  function loop(now) {
    raf = 0;
    if (!alive) return;
    if (now - last >= 1000 / o.fps - 2) { last = now; render(now); }
    if (visible && (motion || swap || drag || Math.abs(vel) > 1e-4)) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf && alive && visible) raf = requestAnimationFrame(loop); };
  render(performance.now()); kick();

  // Drag to turn, with a little inertia.
  const down = (e) => { drag = { x: e.clientX, yaw, t: performance.now() }; vel = 0; cv.setPointerCapture?.(e.pointerId); kick(); };
  const move = (e) => {
    if (!drag) return;
    const ny = drag.yaw + (e.clientX - drag.x) * 0.008;
    vel = ny - yaw; yaw = ny; kick();
  };
  const up = () => { drag = null; kick(); };
  if (o.interactive) {
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  }

  // Sleep when off screen or in a background tab.
  const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) { t0 = performance.now() - phase * LOOP * 1000; kick(); } }) : null;
  io && io.observe(el);
  const vis = () => { visible = !document.hidden; if (visible) { t0 = performance.now() - phase * LOOP * 1000; kick(); } };
  document.addEventListener('visibilitychange', vis);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
    if (w === W && h === H) return; W = w; H = h; st.renderer.setSize(W, H, false); frame(); render(performance.now());
  }) : null;
  ro && ro.observe(el);

  return {
    get region() { return region; },
    /** Change region: the island sinks away and the new one rises. */
    setRegion(k, animate = true) {
      if (!REGIONS[k] || k === region && !swap) return;
      if (!animate || !motion) { build(k); render(performance.now()); return; }
      swap = { t: performance.now(), to: k }; kick();
    },
    /** 'day' or 'dusk': follow the page's light or dark mode. */
    setMood(m) { const n = m === 'dusk' ? 'dusk' : 'day'; if (n === mood) return; mood = n; air(); light(); render(performance.now()); },
    get mood() { return mood; },
    setMotion(on) { motion = !!on && !reduce; t0 = performance.now() - phase * LOOP * 1000; kick(); },
    turn(delta) { yaw += delta; render(performance.now()); },
    destroy() {
      alive = false; cancelAnimationFrame(raf); io && io.disconnect(); ro && ro.disconnect();
      document.removeEventListener('visibilitychange', vis);
      dispose(st.scene); st.renderer.dispose(); st.renderer.forceContextLoss?.(); cv.remove();
    },
  };
}

function dispose(root) {
  root.traverse((n) => {
    n.geometry && n.geometry.dispose();
    const m = n.material; if (!m) return;
    for (const x of Array.isArray(m) ? m : [m]) { x.map && x.map.dispose(); x.alphaMap && x.alphaMap.dispose(); x.dispose(); }
  });
}
