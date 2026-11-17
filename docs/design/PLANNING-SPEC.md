# Panoramica: planning screens spec (photo-led)

Screens: **02 Plan**, **03 Route options**, **04 Route detail**.
Mockups: `screens-planning/` (PNG per screen, `planning-preview.png` side by side, and the source `.dc.html`).
Live canvas: https://claude.ai/artifact/VsHtXsJa7cdsf1U78pTMb9 (the iOS row, boards 02 to 04).

## Principle

Show, don't tell. Every place that used to explain *why a route is scenic* in words now shows it as a photo, a ring, or an icon. The rules:

- No sentence copy on these screens. Labels are one or two words. Numbers carry the meaning.
- Each route and each highlight leads with a real photo.
- Any score is shown as a number with an icon, never as an adjective.
- Every photo carries its credit (`© Author · Licence`) in its bottom-right corner. This is a licence requirement, not optional.

## Tokens (unchanged from DESIGN.md)

| Token | Value |
|---|---|
| Type | Sofia Sans (UI), IBM Plex Mono (`.a-num` data) |
| Paper | `#F5F6F3` background, `#FFFFFF` cards |
| Ink | `#17262A` text, `#4B5A5C` secondary, `#7A8786` tertiary |
| Scenic green | `#1E6B52` primary / selected / main route |
| Alt route blue | `#2E5E8C` |
| Light / sunset | terracotta `#C0583A` |
| Glass | `rgba(255,255,255,0.82)` + `backdrop-filter: blur(12px)` |
| Radii | route card 20, sheet 24, photo tiles 16, highlight photos 14, pills 999 |

## Components

### Photo + credit
- `object-fit: cover`. Show a landscape gradient while loading.
- Credit: 10 px (8.5 px on thumbnails up to 128 px), white at 88% with a 2 px text shadow, bottom-right 8/6 px inset, one line with an ellipsis, max 70% of the width.
- Tapping the credit opens the source page (`source` in `credits.json`).

### Style tile (Plan)
- Three tiles in a row, 112 px tall, radius 16, with a photo and the label bottom-left in white.
- Selected: 2 px green border plus a 22 px green check badge top-right.
- Values: `relaxed` | `scenic` | `most_beautiful`.

### Interest tile (Plan)
- A 4 × 2 grid. Each tile is 60 px tall, radius 14, with a 22 px line icon over an 11 px label.
- Off: white with a hairline. On: solid green with white contents. Multi-select.
- Values: `views, hills, bends, villages, lakes, forest, sunset, no_motorway`.

### Vehicle and time cap (Plan)
- Icon-only buttons with accessible labels: car, van, camper (each `vehicle`).
- The last button cycles the time cap: none → +30 → +45 → +1 h → +2 h. This is the old "extra time" slider, now demoted to a small control.

### Mode switch (Plan)
- "Go somewhere": start and destination fields, CTA **Show routes**.
- "Explore nearby": span tiles (1 h, 2 h, Half day) plus a loop toggle, CTA **Find places**.

### Route card (Route options)
- 300 px wide in a horizontal snap carousel below a 470 px map. The map highlights the route of the centred card.
- Photo 178 px, then:
  - top-left: a glass chip with the route's line swatch and its number;
  - top-right: the scenic stamp (66 px) on a white 72% glass disc;
  - bottom-left: up to three 30 px circular highlight thumbnails, overlapping by 8 px;
  - bottom-right: the credit.
- Body: the title (17/600, one line), a stat row (clock time · `+N min` extra in green · distance), a hairline, then the score row: four icon + number pairs.
- Selected: 2 px green border.

### Score rings (Route detail)
- Four 52 px rings with a 3.5 px stroke on an `#E4E9E5` track, an icon in the centre, the number below (15/700 mono) and the label below that (11 px).
- Order: Views, Hills, Bends, Light. Light uses terracotta, the rest green.

### Highlight strip (Route detail)
- Horizontal snap with `scroll-padding: 0 20px`.
- Each card has a 128 × 118 photo (radius 14) with a white 22 px number badge top-left, then the name (13.5/600, one line) and `km N` (12 px mono, tertiary).
- Tapping a card centres the map on that point (later: opens a photo viewer).

### Hero (Route detail)
- A 310 px photo with a top and bottom scrim, page dots (swipe through the highlight photos), and the credit.
- Glass buttons: back, save, share.
- The sheet starts at y = 268. The 96 px stamp overlaps the sheet's top-right edge.
- Below the sheet: the elevation profile (34 px, with min/max labels and the sunset time on the right).
- Actions: **Start drive** (primary), Open in Maps, Download offline.

## Data the build needs

```
PlanRequest {
  mode: "go" | "explore"
  start, destination?            // go
  span?: 60 | 120 | 240 (min), loop: bool   // explore
  style: "relaxed" | "scenic" | "most_beautiful"
  interests: Set<views|hills|bends|villages|lakes|forest|sunset|no_motorway>
  vehicle: "car" | "van" | "camper"
  timeCapMin?: 30 | 45 | 60 | 120 | null
}

RouteOption {
  id, title, lineStyle
  durationMin, extraMin, distanceKm
  scenicScore (0–100)                         // the stamp
  parts: { views, hills, bends, light }       // 0–100 each, the rings and icon row
  heroPhoto: Photo
  highlights: [{ n, name, km, lat, lon, photo: Photo }]
  elevation: [m], sunsetLocal: "HH:MM"
  advisories?: [...]                          // icon chips, not shown in these mocks
}

Photo { url, author, license, licenseUrl, source, width, height }
```

`Photo` maps 1:1 onto `photos/credits.json`. The credit string is `© ${author} · ${license}`.

## Photos used in the mocks

| Key | File | Credit |
|---|---|---|
| hero, route 1 | crete-senesi-asciano.jpg | Anna.Massini · CC BY-SA 4.0 |
| route 2, highlight 1 | crete-from-monte-oliveto.jpg | Anna.Massini · CC BY-SA 4.0 |
| route 3 | sp438-lauretana.jpg | Giorgio Galeotti · CC BY 4.0 |
| Relaxed | crete-senesi-autumn.jpg | Repuli · CC BY-SA 4.0 |
| Scenic, cypress bend | vitaleta-chapel.jpg | Costaetrusca · CC BY-SA 4.0 |
| Most beautiful | val-dorcia-sunset.jpg | kuhnmi · CC BY 2.0 |
| Asciano | asciano.jpg | LigaDue · CC BY 3.0 |
| Abbey | monte-oliveto-maggiore.jpg | Sailko · CC BY 3.0 |
| Montalcino | montalcino.jpg | Bjørn Christian Tørrissen · CC BY-SA 3.0 |

For production, highlight photos come from Wikimedia Commons by geosearch near each highlight, keeping the same credit fields. The style-tile photos are static app assets.
