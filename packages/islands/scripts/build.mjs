// Bundles the engine for the iOS app: apps/ios/App/Resources/Islands/{island.html,island-engine.js}.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
const here = new URL('..', import.meta.url).pathname;
const out = new URL('../../../apps/ios/App/Resources/Islands/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
await build({ entryPoints: [here + 'native/entry.js'], bundle: true, minify: true, format: 'iife', target: ['safari16'], outfile: out + 'island-engine.js', legalComments: 'none' });
copyFileSync(here + 'native/island.html', out + 'island.html');
console.log('built', out);
