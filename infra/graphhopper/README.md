# GraphHopper

Self-hosted routing (ADR 0002). `config.yml` + `custom_models/scenic_base.json`.

* The base model has `distance_influence: 0`. With LM preparation, request-time
  custom models may only *raise* distance influence and *lower* priority, so the
  API sends its own per request: 70 for the fastest route, 40/20/10 for scenic
  strengths 1–3, priority multipliers that push motorways/trunk/primary down,
  `0` for unpaved roads (default on, always on for rental cars) and for ZTL
  polygons passed as `areas`. See `services/api/src/providers/graphhopper.ts`.
* Path details used: `road_class`, `surface`, `toll`, `country`,
  `road_environment`, `urban_density` (values come back lower case).

## Integration test

`test/make-tiny-osm.py` writes a synthetic network near Siena (motorway, winding
secondary through a hill town inside a ZTL box, tertiary bypass, gravel
shortcut). With GraphHopper 11 running on it:

```sh
python3 infra/graphhopper/test/make-tiny-osm.py
java -Ddw.graphhopper.datareader.file=infra/graphhopper/test/tiny-tuscany.osm \
     -Ddw.graphhopper.graph.location=/tmp/gh-test \
     -Ddw.graphhopper.custom_models.directory=infra/graphhopper/custom_models \
     -Ddw.graphhopper.prepare.min_network_size=0 \
     -jar graphhopper-web-11.0.jar server infra/graphhopper/config.yml
GH_URL=http://localhost:8989 node --test services/api/test/graphhopper.int.test.ts
```

It checks: fastest uses the toll motorway (and reports km per country), scenic
avoids motorway and gravel and goes through the hill town, the ZTL box forces
the bypass, alternatives work, and the full planner on top never offers a ZTL route.

## Production

Tuscany field tests: Geofabrik `centro-latest.osm.pbf` (~400 MB), import needs
~4 GB heap. Italy: ~8 GB. Europe: ~64 GB. Re-import weekly (cron + blue/green
graph directories).
