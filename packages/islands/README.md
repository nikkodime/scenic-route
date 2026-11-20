# @scenic/islands

The Panoramica floating islands: eight procedural low-poly regions (Tuscany, Dolomites, Amalfi, Sardinia,
Moselle, Geiranger, Bardenas, Glen Coe), rendered live with three.js on a transparent background.

- `src/islands.js` builds an island, its weather and its animation (a seamless 36 s loop). Design source of truth.
- `src/engine.js` mounts one live island into an element: drag to turn, region swaps (sink and rise), 30 fps cap,
  sleeps off screen, a still frame under Reduce Motion.
- `src/regions.js` where each island sits on the map (mirrors `IslandRegion` in the iOS app).

Web: `import { mountIsland } from '@scenic/islands'` (the planner loads it lazily, see `apps/web/src/stage.ts`).

iOS: `npm run build -w packages/islands` bundles the engine into `apps/ios/App/Resources/Islands/`
(`island.html` + `island-engine.js`, run in a transparent WKWebView by `IslandView`).
`npm run posters -w packages/islands` renders the transparent WebP stills used for cards, the logbook collection
and Reduce Motion (needs Playwright's Chromium). Run both after changing `islands.js`.
