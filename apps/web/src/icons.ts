// Line icons (24 px grid, 1.6 stroke, currentColor): pictures instead of words.
const svg = (body: string, size = 22) =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const P: Record<string, string> = {
  views: '<path d="M2 19l6-8 4 5 3-3 7 6"/><circle cx="17" cy="6" r="2"/>',
  heritage: '<path d="M4 20V10l4-3 4 3v10M12 20V8l4-4 4 4v12M2 20h20M7 14h2M15 12h2M15 16h2"/>',
  water: '<path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 19c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/>',
  mountains: '<path d="M2 20l7-12 4 6 2-3 7 9z"/><path d="M7.5 10.5l1.5 1.5 1.5-1.5"/>',
  countryside: '<path d="M12 21V9M12 3c-3 4-4 7-4 10a4 4 0 008 0c0-3-1-6-4-10z"/>',
  quiet: '<path d="M8 3L5 21M16 3l3 18M12 5v2M12 11v2M12 17v2"/>',
  roads: '<path d="M8 3L5 21M16 3l3 18M12 5v2M12 11v2M12 17v2"/>',
  car: '<path d="M3 15v-3l2-4h10l4 4h2v3h-2M3 15h2m4 0h6"/><circle cx="7" cy="15.5" r="1.8"/><circle cx="17" cy="15.5" r="1.8"/>',
  campervan: '<path d="M2 16V6h13l3 4h3v6h-1M2 16h2m4 0h7M2 10h13"/><circle cx="6" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/>',
  caravan: '<path d="M1 15v-2l1.5-3H8l2 3v2M11 15V7h9a2 2 0 012 2v6h-2M10 15h1M14 10h4"/><circle cx="4" cy="15.5" r="1.5"/><circle cx="17" cy="15.5" r="1.5"/>',
  auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 000 16z" fill="currentColor"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dist: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 000-6h-4a3 3 0 010-6h6"/>',
  sunset: '<path d="M3 18h18M6 14a6 6 0 0112 0M12 4v3M4.9 7.9l1.4 1.4M19.1 7.9l-1.4 1.4M8 21h8"/>',
  hills: '<path d="M2 18c3-6 6-6 9 0M9 18c3-8 7-8 13 0"/>',
  bends: '<path d="M7 21v-3a4 4 0 014-4h2a4 4 0 000-8h-2a3 3 0 01-3-3"/>',
  loop: '<path d="M4 12a8 8 0 0114-5l2-2v6h-6l2-2a5 5 0 10.5 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  cloud: '<path d="M7 18h10a4 4 0 00.5-8 6 6 0 00-11.4 1.5A3.3 3.3 0 007 18z"/>',
  rain: '<path d="M7 15h10a4 4 0 00.5-8 6 6 0 00-11.4 1.5A3.3 3.3 0 007 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
  fog: '<path d="M3 9h18M5 13h14M3 17h18"/>',
  coffee: '<path d="M4 9h12v5a5 5 0 01-5 5H9a5 5 0 01-5-5zM16 10h2a2 2 0 010 4h-2M8 3v3M12 3v3"/>',
  lunch: '<path d="M7 3v8M5 3v4a2 2 0 004 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"/>',
  wine: '<path d="M8 3h8l-.5 6a3.5 3.5 0 01-7 0zM12 12.5V20M8.5 21h7"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
  warn: '<path d="M12 3l10 18H2zM12 10v5M12 18v.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  swap: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
  settings: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
};

export const icon = (name: string, size?: number) => svg(P[name] ?? P.views, size);
