# Restricted zones

GeoJSON `FeatureCollection`s; each feature has `properties.kind` (`ztl` or `lez`),
`name`, optional `city`, `hours`, `url`, and `approx: true` when the shape is a
hand-drawn approximation.

* `it-tuscany-ztl.geojson`: **approximate** boxes around Tuscan historic
  centres, good enough to keep scenic routes out of them during field tests.
  Before launch, replace each with the comune's official ZTL perimeter
  (most publish a PDF map; Firenze publishes open data) and check gates and hours.
* `it-centre-ztl.geojson`: **approximate** squares around the historic centres of
  Umbria, the rest of Tuscany and the larger cities nearby (Bologna, Verona, Roma...),
  sized by hand from each town's centre. Same caveat: field-test quality only.

The API sends ZTL polygons to GraphHopper as blocked `areas` and checks every
route against them (`@scenic/core/advisories`). A destination inside a ZTL is a
warning ("park outside"), not a block.
