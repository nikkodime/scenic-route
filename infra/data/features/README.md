# Shipped scenic places

One JSON file per region: viewpoints, passes, peaks, castles, abbeys, villages, lakes, coast, waterfalls,
vineyards, cypress rows and `scenic=yes` roads, already classified and weighted (`@scenic/core` `parseOverpass`).
The API answers any plan whose corridor lies inside a shipped region from these files, so a slow or
down Overpass mirror no longer turns scenic routes into plain ones. Outside them it asks Overpass live,
and falls back to whatever the files hold.

Make or refresh a region (resumable; tiles cache in `.cache/`, which is git-ignored):

    node services/api/scripts/fetch-features.ts it-tuscany
    node services/api/scripts/fetch-features.ts <name> south,west,north,east

Data © OpenStreetMap contributors, ODbL 1.0. The files are a derived database: keep the attribution,
and publish them under ODbL (they are, in this repository). Refresh monthly.
