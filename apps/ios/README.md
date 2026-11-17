# Panoramica for iOS

SwiftUI app (iOS 17+, Swift 6) plus `ScenicKit`, a Swift package with the API
models, client, polyline/GPX, formatting, theme tokens and the offline-first
`TripStore` with sync. Scoring happens on the server (`@scenic/core`), so the
app and the web planner always agree.

```sh
brew install xcodegen
cd apps/ios
(cd ScenicKit && swift test)          # unit tests, no simulator needed
xcodegen                              # writes ScenicRoute.xcodeproj from project.yml
open ScenicRoute.xcodeproj
```

The app talks to `SCENIC_API_BASE_URL` (build setting, default
`http://localhost:8787`, which the simulator reaches on your Mac). Start the API
with `npm run dev:api` at the repository root. A UI test drives Siena → Pienza:

```sh
xcodebuild test -project ScenicRoute.xcodeproj -scheme ScenicRoute \
  -destination 'platform=iOS Simulator,name=iPhone 17'
```

What is here (M0): plan with an extra-time budget, compare routes on a map,
route detail with score breakdown, sunset/glare/weather notes and advisories,
handoff to Google Maps (with scenic waypoints) or Apple Maps, GPX share, save
trips (offline, synced), thumbs up/down. Next (M2): Ferrostar turn-by-turn,
CarPlay, Sign in with Apple button, offline map packs.
