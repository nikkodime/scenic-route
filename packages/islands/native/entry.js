// The iOS bundle: exposes the engine to island.html as a classic script (WKWebView + file URLs, no modules).
import { mountIsland, REGIONS, REGION_KEYS } from '../src/engine.js';
globalThis.PanoramicaIslands = { mountIsland, REGIONS, REGION_KEYS };
