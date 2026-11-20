# 0004: Data sources chosen for commercial use

| Need | Source | Licence / terms |
|---|---|---|
| Roads, places | OpenStreetMap (Geofabrik extracts) | ODbL, attribution, share-alike for derived databases |
| Elevation | Copernicus DEM GLO-30 (self-hosted tiles) | free, attribution |
| Land cover | ESA WorldCover 10 m | CC BY 4.0 |
| Weather | MET Norway Locationforecast | CC BY 4.0, User-Agent required |
| Weather (alt) | Open-Meteo | free tier non-commercial; paid plan for production |
| Geocoding | Photon (self-hosted, OSM) | Apache 2.0 + ODbL data |
| Photo density | Wikimedia Commons coordinates | metadata only |

Dev and tests may use public demo services (OSRM demo, Overpass, Nominatim,
Open-Meteo) at low volume; production must not.
