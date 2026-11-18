# Stops worth making

One JSON file per region: viewpoints that have a mapped car park or rest area within 150 m, named
cafés, agriturismi and wineries, with opening hours and website when OpenStreetMap has them.
The planner picks a few along each route (`@scenic/core` `suggestStops`).

    node services/api/scripts/build-stops.ts italy-latest.osm.pbf italy

Built from the same Geofabrik extract as the routing graph and `infra/data/features`. Data
© OpenStreetMap contributors, ODbL 1.0: keep the attribution and publish the files under ODbL.
