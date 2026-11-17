// Network first, cache as fallback: updates show up immediately, and the app
// shell still opens with a weak signal in the hills.
const CACHE = 'scenic-route-v1';
const SHELL = ['./', 'index.html', 'style.css', 'src/app.js', 'src/api.js', 'src/scenic.js', 'src/geo.js', 'src/sun.js', 'manifest.webmanifest', 'icons/icon.svg', 'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request)),
  );
});
