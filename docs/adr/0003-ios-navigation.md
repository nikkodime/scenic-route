# 0003: iOS navigation with Ferrostar, handoff first

**Decision.** M0 hands routes to Apple Maps / Google Maps (waypoints) and
exports GPX. M2 adds in-app turn-by-turn with Ferrostar (BSD-3), fed by the
GraphHopper navigation endpoint, with CarPlay.

**Why.** Handoff loses the exact scenic line (other apps re-route between
waypoints), so it is only acceptable for field tests. Ferrostar gives open
turn-by-turn with rerouting and works with our own router, which is also what
CarPlay navigation apps need. Mapbox Navigation SDK would lock us into
Mapbox pricing and data.
