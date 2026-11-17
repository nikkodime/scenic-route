# 0002: Self-hosted GraphHopper as the routing engine

**Decision.** GraphHopper (Apache 2.0) on our own server, OSM data from
Geofabrik, `scenic_car` custom model. OSRM stays as a test/prototype adapter.

**Why.** Custom models change weights per request (road classes, surfaces,
blocked areas such as ZTLs) without re-importing; path details return
`surface`, `road_class`, `toll`, `max_speed` for advisories; the navigation
endpoint feeds Ferrostar. Hosted GraphHopper's free tier is not for
commercial use, and the OSRM demo server is not for production.

**Rejected.** Valhalla: strong too (dynamic costing, mobile tiles), but
custom per-edge values (our scenic score) are easier in GraphHopper. Kept as
the M3 option for on-device rerouting.
