# Shipped scenic places

One JSON file per region: viewpoints, passes, peaks, castles, abbeys, villages, lakes, coast, waterfalls,
vineyards, cypress rows and `scenic=yes` roads, already classified and weighted (`@scenic/core` `classify`).
The API answers any plan whose corridor lies inside a shipped region from these files (`FEATURES_DIR`),
so a slow or down Overpass mirror no longer turns scenic routes into plain ones. Outside them it asks
Overpass live, and falls back to whatever the files hold.

## Build (the normal way, scales to all of Europe)

From the same Geofabrik OpenStreetMap extract GraphHopper is built from. No live query service is involved.

    brew install osmium-tool        # or: apt install osmium-tool
    curl -LO https://download.geofabrik.de/europe/italy/centro-latest.osm.pbf
    node services/api/scripts/build-features.ts centro-latest.osm.pbf it-centro

For Europe use `europe-latest.osm.pbf` (about 30 GB); the output is a few hundred MB, so in production
it lives on the server's `FEATURES_DIR` volume and is rebuilt monthly with the routing graph, not
committed here. Small regions for field tests can be committed.

## Quick fallback

`services/api/scripts/fetch-features.ts <region>` asks public Overpass tile by tile. Slow and hard on a
volunteer service; only for a small region when no extract is at hand.

Data © OpenStreetMap contributors, ODbL 1.0. The files are a derived database: keep the attribution
and publish them under ODbL.
