# Restricted zones

GeoJSON `FeatureCollection`s; each feature has `properties.kind` (`ztl` or `lez`),
`name`, optional `city`, `hours`, `url`, and `approx: true` when the shape is a
hand-drawn approximation.

* `it-tuscany-ztl.geojson`: **approximate** boxes around Tuscan historic
  centres, good enough to keep scenic routes out of them during field tests.
  Before launch, replace each with the comune's official ZTL perimeter
  (most publish a PDF map; Firenze publishes open data) and check gates and hours.

The API sends ZTL polygons to GraphHopper as blocked `areas` and checks every
route against them (`@scenic/core/advisories`). A destination inside a ZTL is a
warning ("park outside"), not a block.
