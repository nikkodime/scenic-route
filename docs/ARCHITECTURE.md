# Scenic Route: architecture

Status: v1, November 2026. Owner: Niko. This document is the map for everything
in this repository. Decisions with real trade-offs have their own short record
in [`docs/adr/`](adr/).

## 1. What we are building

A driver enters a destination and how much extra time they are happy to spend.
We return the two or three most beautiful routes that fit, explain why each is
beautiful (views, hill towns, cypress avenues, coast, bends), warn about what
could spoil it (rain, low cloud, arriving after sunset, sun in the eyes, a ZTL,
a gravel road a rental contract bans), and then drive it with turn-by-turn
navigation on iPhone and CarPlay.

* **iOS app first** (SwiftUI): plan, preview, drive, rate.
* **Web planner**: plan routes and multi-day journeys on a big screen, save them,
  and have them appear on the phone.
* **Europe**, starting with field tests in Tuscany.

The thing competitors do not do, and the core of this system, is a
**view-based beauty score** for every road segment, rather than "bendy road =
good road".

## 2. System overview

```
                 ┌───────────────────────────── clients ─────────────────────────────┐
                 │  iOS app (SwiftUI)          Web planner (Vite+TS)    Prototype PWA │
                 │  MapLibre/MapKit map        MapLibre GL JS           (root, frozen)│
                 │  Ferrostar turn-by-turn     shares @scenic/core                    │
                 │  CarPlay, offline packs                                            │
                 └──────────────┬──────────────────────────┬──────────────────────────┘
                                │ HTTPS JSON (OpenAPI 3.1, /v1)                     
                 ┌──────────────▼──────────────────────────▼──────────────┐
                 │  API service  (Node 22 + TypeScript + Fastify)         │
                 │  plan · conditions · geocode · trips · sync · ratings  │
                 │  uses @scenic/core for all scoring (single source)     │
                 └──┬──────────┬───────────┬────────────┬───────────┬─────┘
                    │          │           │            │           │
             GraphHopper   Scenic store  Weather     Geocoder   Postgres+PostGIS
             (self-host,   (PostGIS +    (MET Norway (Photon,   users, trips,
             custom scenic  PMTiles)      primary)    self-host) ratings, sync log
             model)            ▲
                               │ nightly / per region
                 ┌─────────────┴──────────────────────────────────────────┐
                 │  Scenic pipeline (batch)                               │
                 │  OSM PBF + Copernicus DEM GLO-30 + ESA WorldCover +    │
                 │  Wikimedia Commons photo density + driver ratings      │
                 │  → beauty score per road segment                       │
                 └────────────────────────────────────────────────────────┘
```

## 3. Repository layout

npm workspaces, one repository. TypeScript everywhere except the iOS app.

| Path | What | Status |
|---|---|---|
| `/` (`index.html`, `src/`) | The phone prototype used for Tuscany test drives. Frozen; served by GitHub Pages so the test link keeps working. | live |
| `packages/core` | `@scenic/core`: geometry, sun, OSM feature classes, candidate generation, scoring, ranking, conditions, advisories, exports, API contracts (zod), and the `planRoutes` orchestrator with injectable providers. Pure, no I/O. | this PR |
| `services/api` | Fastify API. Provider adapters (GraphHopper, OSRM, Overpass, elevation, MET Norway, Open-Meteo, Photon/Nominatim), caching, auth, trips, sync, ratings, Postgres store. | this PR |
| `apps/web` | Web route and journey planner (Vite, TypeScript, MapLibre GL JS). | this PR |
| `apps/ios` | iOS app: XcodeGen project + `ScenicKit` Swift package (models, API client, polyline, offline store) + SwiftUI app. | this PR (plan + preview + handoff) |
| `infra` | docker-compose for local stack (API, Postgres/PostGIS, GraphHopper, Photon); GraphHopper config and custom models; ZTL/LEZ data. | this PR |
| `services/pipeline` | Scenic segment scoring batch jobs. | M1 |
| `docs` | This file, ADRs, API spec. | this PR |

## 4. Routing engine

**GraphHopper, self-hosted** ([ADR 0002](adr/0002-graphhopper.md)). Apache 2.0,
runs on one machine for Italy + neighbours (about 8 GB RAM for import), and its
*custom models* let us change edge weights per request without re-importing:

* `scenic_car` profile: prefers `secondary`/`tertiary`/`unclassified` roads,
  strongly avoids motorways and trunk roads, blocks `surface` unpaved and
  `track` roads by default (rental contracts), and blocks ZTL polygons sent as
  request `areas`.
* Time budget: we do **not** ask the router for "the most scenic route under
  N minutes" (that is a resource-constrained shortest path and no open router
  does it well). Instead the API generates **candidates** and checks the
  budget itself:
  1. fastest route (baseline and budget anchor),
  2. the `scenic_car` route at 2–3 strengths of the road-class preference,
  3. via-routes through the best scenic *spots* in the corridor (prototype
     logic, now in `@scenic/core`),
  4. GraphHopper alternative routes.
  All candidates are scored on the same scale and ranked within
  `fastest_minutes + extra_minutes`.
* M1: the pipeline writes a per-edge `scenic` value into a GraphHopper
  encoded value, so the `scenic_car` model can reward beautiful edges
  directly (`priority *= 1 + 0.8 * scenic`). Candidate generation stays as
  the safety net for the budget.
* The router is behind a `Router` interface; an OSRM adapter exists for the
  prototype's demo server and for tests.

Turn-by-turn on iOS needs maneuver instructions. GraphHopper's navigation
endpoint returns the Mapbox/OSRM directions format, which is exactly what
**Ferrostar** (BSD-3, Rust core with Swift UI) consumes. That gives us a real
in-app navigation stack, voice guidance, rerouting and **CarPlay**, without a
proprietary SDK ([ADR 0003](adr/0003-ios-navigation.md)).

## 5. Scenic scoring

### 5.1 Runtime score (this PR)

`@scenic/core/score` scores any route line 0–100 from five parts:

| Part | Source | Weight |
|---|---|---|
| Scenery | OSM scenic features within reach (viewpoints, passes, peaks, castles, hill towns, villages, coast, lakes, vineyards, cypress avenues, `scenic=yes`), distance-decayed; plus segment beauty when the pipeline has data | 0.45 |
| Views | segment `view` value from the pipeline (horizon openness from DEM). Falls back to relief when absent | 0.15 |
| Relief | elevation range and climb per km (Copernicus DEM) | 0.15 |
| Bends | heading change per km, capped so hairpin hell is not "more beautiful" | 0.15 |
| Variety | number of distinct landscape types passed | 0.10 |

Multiplied by penalties: motorway share, urban share, and **hard** advisories
(unpaved when the user has a rental car, ZTL entry) which drop the route.

All weights live in one exported `SCORE_MODEL` object with a version string;
every plan response carries `model_version` so ratings can be tied to the
model that produced the route.

### 5.2 Segment beauty (pipeline, M1)

For every OSM road way, split at 200 m:

* **View openness**: from points at eye height 1.2 m every 200 m, cast 36 rays
  over the Copernicus GLO-30 DEM to 15 km; the fraction of sky-line visible
  beyond 1 km, weighted to the sides of the road (where the passenger and
  driver actually look). This is the "you can see the Val d'Orcia" signal.
* **Landscape**: ESA WorldCover 10 m classes in a 1 km buffer (vineyard/
  cropland mosaics, forest edge, water, coast score high; dense urban,
  industrial score low).
* **Attention**: density of geotagged photos (Wikimedia Commons, CC-licensed
  metadata only) and OSM `tourism=viewpoint` nearby.
* **Driver feedback**: Bayesian average of thumbs up/down from drives that
  covered the segment (prior = model score; needs ~20 ratings to move much).

Output: `scenic_segments(way_id, seg_idx, geom, view, landscape, attention,
feedback, beauty, model_version)` in PostGIS; a GraphHopper encoded-value CSV;
and a PMTiles layer so both apps can draw a "beauty heatmap".

### 5.3 Learning from drives

Ratings are stored with the full route geometry, the score parts and the
model version. A notebook job fits the part weights against ratings
(logistic regression, per region) and proposes a new `SCORE_MODEL`.
The prototype's "Copy ratings" export is compatible.

## 6. Conditions and light

`@scenic/core/conditions` turns a forecast and the route timing into plain
advice:

* **Sunset and golden hour**: computed locally (NOAA). Flags "arrive after
  dark" and "golden hour on the best stretch" (we know when you reach each
  segment).
* **Sun glare**: sun azimuth/elevation vs. road heading along the timed
  route; flags stretches heading into a low sun (< 15° elevation, within 25°
  of heading).
* **Weather**: cloud, low cloud (kills views), precipitation, fog/visibility,
  sampled at 3–5 points along the route at the time you will be there.

Weather provider: **MET Norway Locationforecast** as primary (free for
commercial use under CC BY 4.0 with attribution and an identifying
User-Agent; Europe-wide). Open-Meteo stays as an adapter, used only with a
paid plan ([ADR 0004](adr/0004-data-licences.md)).

## 7. Advisories (regulation layer)

`@scenic/core/advisories` checks a route against:

| Advisory | Data | Effect |
|---|---|---|
| ZTL (Italian limited traffic zones) | curated GeoJSON in `infra/data/ztl/` (OSM coverage is patchy), starting with Tuscany | blocked in routing (`areas`), warning if destination inside |
| Low-emission zones | OSM `boundary=low_emission_zone` + curated | warning |
| Unpaved / gravel | OSM `surface`, `tracktype` from router path details | blocked if "rental car" on; otherwise warning with km |
| Vignette countries | country polygons + motorway use (AT, CH, CZ, SK, SI, HU, RO, BG) | warning |
| Toll motorways | router `toll` details | info |
| Seasonal pass closures | OSM `*:conditional` + curated pass list with typical dates | warning, blocked when closed by date |

## 8. API

OpenAPI 3.1 at `docs/api/openapi.yaml`; zod schemas in `@scenic/core/contracts`
are the source of truth and the spec is generated from them in CI. The iOS
client is generated with `swift-openapi-generator`, so all three clients share
one contract.

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/plan` | origin, destination, optional stops, extra minutes, departure time, preferences → ranked routes with score parts, highlights, conditions, advisories, handoff links, GPX |
| GET | `/v1/geocode?q=` | place search (Photon self-hosted; Nominatim adapter for dev) |
| POST | `/v1/conditions` | conditions for a saved route at a new departure time |
| POST | `/v1/navigation` | maneuver-level route for Ferrostar (GraphHopper navigation format) |
| POST | `/v1/auth/anonymous` | device account (no PII); upgraded by Sign in with Apple |
| POST | `/v1/auth/apple` | verify Apple identity token, link to account |
| GET/PUT/DELETE | `/v1/trips[/:id]` | saved routes and multi-day journeys |
| POST | `/v1/sync` | delta sync for offline-first clients |
| POST | `/v1/ratings` | thumbs up/down + optional segment-level feedback |
| GET | `/v1/regions` | offline pack manifest (map tiles, scenic layer) |
| GET | `/healthz` | liveness + provider health |

Plan latency target: p50 < 3 s, p95 < 6 s for routes under 300 km. The
planner runs candidate routing in parallel with a concurrency cap and caches
provider results (feature corridors 24 h, elevation forever, weather 30 min).

## 9. Data, accounts and sync

* **Postgres 16 + PostGIS** for accounts, trips, ratings and the sync log;
  scenic segments in the same database (separate schema).
* **Accounts**: anonymous device account on first launch (nothing to sign up
  for before the first drive); Sign in with Apple to sync between phone and
  web; email magic link for web-only users (M2).
* **Sync** ([ADR 0005](adr/0005-offline-sync.md)): clients are offline-first.
  Every record has a client-generated UUID, `updated_at` and `deleted`.
  `POST /v1/sync {cursor, changes[]}` applies changes (last writer wins per
  record, server time breaks ties) and returns everything newer than the
  cursor. Ratings are append-only. Trips store the full route (geometry,
  steps, score) so they can be driven offline.
* **Privacy (GDPR)**: we never store live location traces on the server.
  Ratings store the planned route, not the GPS track. Data stays in the EU
  (Hetzner, Germany/Finland). Account deletion deletes everything.

## 10. Clients

### iOS (`apps/ios`)

* SwiftUI, iOS 17+, Swift 6. XcodeGen `project.yml` so the project file is
  reviewable text.
* `ScenicKit` Swift package: Codable models generated from the contract,
  `APIClient`, polyline decoding, `TripStore` (SwiftData, offline-first) and
  `SyncEngine`. Unit-tested with `swift test`, no simulator needed.
* Map: MapKit for M0 (free, native, good enough to preview routes);
  MapLibre Native with our own PMTiles style in M2 for offline maps and the
  beauty heatmap.
* Navigation: M0 hands off to Apple Maps / Google Maps with waypoints, plus
  GPX share. M2: Ferrostar in-app navigation and CarPlay
  (`com.apple.developer.carplay-maps` entitlement, needs an Apple request).
* Design system tokens from the design thread go into `ScenicKit/Theme`.

### Web planner (`apps/web`)

* Vite + TypeScript, no framework lock-in beyond small view modules;
  MapLibre GL JS with an OpenFreeMap / Protomaps style (self-hosted PMTiles
  for production).
* Plan a route, compare candidates on the map, build a multi-day journey
  (day legs with overnight stops), save to account, open on phone.
* Uses `@scenic/core` directly for formatting, GPX and handoff links, so it
  behaves exactly like the server and the phone.
* Design tokens are CSS custom properties in `src/theme.css`, ready for the
  design thread's system.

## 11. Offline

1. **M0**: saved trips hold the full route, so a trip can be opened and
   handed to Apple/Google Maps without signal.
2. **M2**: region packs (`/v1/regions`): PMTiles map extract + scenic layer
   per region (Tuscany ≈ 150 MB). Ferrostar keeps guiding on the stored route
   and only needs the network to reroute.
3. **M3**: on-device rerouting for downloaded regions (Valhalla mobile tiles
   or GraphHopper's Android/iOS-capable builds), evaluated when needed.

## 12. Hosting and cost (first year)

| Item | Choice | Est. €/month |
|---|---|---|
| API + Postgres | Hetzner CCX23 (4 vCPU, 16 GB) | 30 |
| GraphHopper Italy + neighbours | Hetzner CCX33 (8 vCPU, 32 GB) | 60 |
| Photon geocoder | same box as GraphHopper | 0 |
| Tiles | PMTiles on Cloudflare R2 (no egress fees) | 5–20 |
| Weather | MET Norway | 0 (attribution) |
| Backups, monitoring | Hetzner snapshots, Grafana Cloud free tier | 5 |

Europe-wide GraphHopper needs ~64 GB RAM for import (≈ €120/month) when we
expand beyond Italy.

## 13. Licences and attribution

* OSM data: ODbL. Attribution "© OpenStreetMap contributors" on every map;
  the derived scenic segment database is a Derivative Database, so we publish
  it (or the method) under ODbL if we distribute it. Score values shown to
  users are a Produced Work (attribution only).
* Copernicus DEM GLO-30 and ESA WorldCover: free with attribution.
* MET Norway: CC BY 4.0, attribution + User-Agent.
* Open-Meteo free tier: **non-commercial only**: dev use or paid plan.
* GraphHopper, Ferrostar, MapLibre, Photon: Apache 2.0 / BSD.
* Wikimedia Commons: we only use photo locations and counts, not images.

## 14. Quality

* `npm test` runs core + API tests (Node test runner), offline, with recorded
  fixtures for every external provider.
* `npm run typecheck` across packages.
* `apps/ios`: `swift test` for ScenicKit; `xcodebuild` for the app on the Mac.
* CI (GitHub Actions): typecheck, tests, web build; macOS job builds ScenicKit.
* Field tests: Niko's Tuscany drives, rated in-app, feed §5.3.

## 15. Milestones

| | Scope |
|---|---|
| **M0** (this PR) | monorepo, `@scenic/core`, API with providers, web planner, iOS app (plan, compare, preview, hand off, save), local stack, CI |
| **M1** | scenic pipeline for Tuscany (view openness, landscape, photos), GraphHopper scenic encoded value, beauty heatmap layer, deploy to Hetzner |
| **M2** | Ferrostar turn-by-turn + CarPlay, Sign in with Apple, sync live, offline region packs, TestFlight |
| **M3** | Italy-wide then Alps + Croatia + Provence, ratings-trained model, App Store |
