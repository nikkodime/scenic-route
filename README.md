# Scenic Route

Pick a destination and how much extra time you're happy to spend. The app finds
the most beautiful drive there and opens it in Google Maps.

**Prototype for test drives in Tuscany.** Open it on your phone at
https://nikkodime.github.io/scenic-route/ and use "Add to Home Screen" to
install it like an app.

## How it works

1. **Scenic places** along the way come from OpenStreetMap (Overpass API):
   viewpoints, passes, peaks, castles, hill towns, villages, lakes, beaches,
   coast, vineyards, cypress avenues and roads tagged `scenic=yes`.
2. Nearby places are grouped into **scenic spots**. The best spots that fit the
   time budget become waypoints for up to 8 **candidate routes** (OSRM).
3. Each route gets a **0–100 score**: scenic places within ~1 km of the road
   (55%), bends per km (20%), hills from the Copernicus elevation model via
   Open-Meteo (25%), with a penalty for motorway share.
4. The best 2–3 routes within the budget are shown, with a **sunset and
   weather** check (cloud, low cloud, rain, fog) for the top one.
5. **Drive it in Google Maps** passes the scenic spots as waypoints. **GPX**
   exports the exact line for OsmAnd, Organic Maps or a car unit.
6. After a drive, rate it 👍 / 👎. Ratings stay on the phone; "Copy ratings"
   exports them so the weights in `src/scenic.js` can be tuned.

Tuning knobs live at the top of `src/scenic.js` (`FEATURE_WEIGHTS`) and in
`scoreRoute`.

## Run locally

```sh
python3 -m http.server 8765   # then open http://localhost:8765
npm test                      # logic tests (Node 20+)
node test/e2e.cjs <outdir>    # phone-sized UI test with mocked map services
```

No build step and no dependencies: plain HTML, CSS and ES modules, with
Leaflet 1.9.4 vendored in `vendor/leaflet`.

## Before any public launch

The free public services used here are fine for personal testing but not for
an app with users:

- **OSRM demo server** and **Overpass**: host our own (or GraphHopper with a
  custom scenic model, which also handles the time budget better).
- **Open-Meteo** free tier is non-commercial: switch to a paid plan.
- **Nominatim** has a 1 request/second policy: host our own or use a paid geocoder.
- **OpenStreetMap tiles**: use a tile provider.
- Data licences: OSM is ODbL (attribution, share-alike on derived databases).
