// Light or dark: follows the system unless the visitor picks one (kept in localStorage, per browser).
// The choice lands on <html data-theme="light|dark">, which theme.css keys its dusk values off.

export type Appearance = 'auto' | 'light' | 'dark';
export type Mode = 'light' | 'dark';

const KEY = 'panoramica.appearance';
const media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
const listeners = new Set<(m: Mode) => void>();

export function appearance(): Appearance {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch { /* private mode: follow the system */ }
  return 'auto';
}

export function mode(): Mode {
  const a = appearance();
  return a === 'auto' ? (media?.matches ? 'dark' : 'light') : a;
}

function apply() {
  const m = mode();
  document.documentElement.dataset.theme = m;
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) meta.content = m === 'dark' ? '#0f181b' : '#f5f6f3';
  listeners.forEach((f) => f(m));
}

export function setAppearance(a: Appearance) {
  try {
    if (a === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, a);
  } catch { /* still applies for this visit */ }
  apply();
}

/** Called with the new mode whenever it changes (system switch or the visitor's pick). */
export function onMode(f: (m: Mode) => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

media?.addEventListener('change', () => { if (appearance() === 'auto') apply(); });
apply();
