# Route extras and how to gate them

Each extra is computed by its own function and arrives as an optional field, so a plan tier can switch it
off in one place without touching the clients (they hide a section when the field is missing).

| Extra | Where it is made | Response field | Switch |
|---|---|---|---|
| Golden-hour departure: "Leave 15:40 to reach Pienza in golden light" | `@scenic/core` `goldenDeparture` (conditions.ts) | `routes[].conditions.goldenDeparture` | `PlanOptions.features.goldenDeparture` |
| Weather along the route (4 points, at the time you get there) | `assessConditions` | `routes[].conditions.weather` | always on |
| Road warnings: ZTL, gravel (blocked with a rental car), closed or seasonal passes, vignettes, LEZ | `routeAdvisories` (advisories.ts), zones in `infra/data/zones/` | `routes[].advisories` (now with `lat`/`lon` for map pins) | always on (safety) |
| Stops worth making: viewpoint with a pull-off, coffee halfway, agriturismo lunch, winery | `suggestStops` (stops.ts), data in `infra/data/stops/` | `routes[].suggestedStops` | `PlanOptions.features.stops` |
| Loops from where you are | `exploreFrom` with `mode: round_trip`, then `planRoutes` through the chosen place | `ExploreResponse` | — |
| Share a drive: 4:5 card + link that re-plans the same trip | clients only (`apps/web/src/extras.ts`, `apps/ios/App/Views/RouteExtras.swift`) | — | client |

Pricing is still being decided; nothing is gated yet. When it is, the API decides the `features` set from the
account's plan and passes it to `planRoutes`.

## Data

* Seasonal passes: `SEASONAL_PASSES` in advisories.ts, typical closure dates (not official). A route within
  1.2 km of a summit counts as crossing it.
* ZTL: approximate squares for field tests (`it-tuscany-ztl.geojson`, `it-centre-ztl.geojson`). Replace with
  official perimeters before launch.
* Stops: `node services/api/scripts/build-stops.ts <extract.osm.pbf> <region>` from the same Geofabrik extract as
  the routing graph. Viewpoints count only with a mapped car park or rest area within 150 m.
