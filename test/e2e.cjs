// Drives the app in a phone-sized browser with all map services mocked.
// Run: python3 -m http.server 8765 & node test/e2e.cjs
const { chromium, devices } = require('playwright');

const places = {
  siena: { lat: '43.3188', lon: '11.3308', display_name: 'Siena, Toscana, Italia' },
  montalcino: { lat: '43.0586', lon: '11.4893', display_name: 'Montalcino, Siena, Toscana, Italia' },
};
const features = [
  { type: 'node', id: 1, lat: 43.205, lon: 11.475, tags: { tourism: 'viewpoint', name: 'Belvedere delle Crete' } },
  { type: 'node', id: 2, lat: 43.206, lon: 11.478, tags: { place: 'village', ele: '320', name: 'Asciano' } },
  { type: 'node', id: 3, lat: 43.152, lon: 11.552, tags: { historic: 'castle', name: 'Castello di Montisi' } },
  { type: 'node', id: 4, lat: 43.120, lon: 11.395, tags: { place: 'village', ele: '150', name: 'Buonconvento' } },
  { type: 'way', id: 5, center: { lat: 43.07, lon: 11.47 }, tags: { landuse: 'vineyard' } },
  { type: 'node', id: 6, lat: 43.175, lon: 11.515, tags: { tourism: 'viewpoint', name: 'Cipressi di San Quirico' } },
  { type: 'way', id: 7, center: { lat: 43.16, lon: 11.50 }, tags: { natural: 'tree_row', genus: 'Cupressus' } },
];

function fakeRoute(coords) {
  const pts = coords.split(';').map((c) => c.split(',').map(Number));
  const line = [];
  let km = 0;
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]];
    for (let k = 0; k < 40; k++) {
      const t = k / 40;
      line.push([a[0] + (b[0] - a[0]) * t + Math.sin(k) * 0.002 * (pts.length > 2), a[1] + (b[1] - a[1]) * t]);
    }
    km += Math.hypot((b[0] - a[0]) * 81, (b[1] - a[1]) * 111) * 1.25;
  }
  line.push(pts[pts.length - 1]);
  const direct = pts.length === 2;
  const minutes = direct ? km / 75 * 60 : km / 52 * 60;
  return { code: 'Ok', routes: [{ distance: km * 1000, duration: minutes * 60, geometry: { coordinates: line },
    legs: [{ steps: [{ distance: direct ? km * 700 : 0, intersections: [{ classes: direct ? ['motorway'] : [] }] }] }] }] };
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], geolocation: { latitude: 43.3188, longitude: 11.3308 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/tile\.openstreetmap\.org/, (r) => r.fulfill({ status: 204 }));
  await page.route(/nominatim/, (r) => {
    const q = new URL(r.request().url()).searchParams.get('q').toLowerCase();
    r.fulfill({ json: Object.entries(places).filter(([k]) => q.includes(k.slice(0, 4))).map(([, v]) => v) });
  });
  await page.route(/overpass/, (r) => r.fulfill({ json: { elements: features } }));
  await page.route(/router\.project-osrm/, (r) => r.fulfill({ json: fakeRoute(new URL(r.request().url()).pathname.split('/driving/')[1]) }));
  await page.route(/open-meteo\.com\/v1\/elevation/, (r) => {
    const n = new URL(r.request().url()).searchParams.get('latitude').split(',').length;
    r.fulfill({ json: { elevation: Array.from({ length: n }, (_, i) => 250 + 180 * Math.sin(i / 4)) } });
  });
  await page.route(/open-meteo\.com\/v1\/forecast/, (r) => {
    const time = Array.from({ length: 48 }, (_, i) => new Date(Date.now() - 3600e3 * 2 + i * 3600e3).toISOString().slice(0, 13) + ':00');
    r.fulfill({ json: { hourly: { time, cloud_cover: time.map(() => 15), cloud_cover_low: time.map(() => 5), precipitation_probability: time.map(() => 0), visibility: time.map(() => 30000) } } });
  });

  await page.goto('http://localhost:8765/');
  await page.screenshot({ path: process.argv[2] + '/1-start.png' });
  await page.fill('#to', 'Montalcino');
  await page.waitForSelector('#suggest li');
  await page.click('#suggest li');
  await page.click('label:has-text("+1 h")');
  await page.click('#go');
  await page.waitForSelector('.route', { timeout: 20000 });
  await page.waitForTimeout(800);
  const cards = await page.$$eval('.route', (els) => els.map((e) => e.innerText.replace(/\n+/g, ' | ')));
  console.log('STATUS:', await page.textContent('#status'));
  cards.forEach((c) => console.log('CARD:', c));
  console.log('NAV:', await page.getAttribute('.route .nav', 'href'));
  await page.screenshot({ path: process.argv[2] + '/2-results.png' });
  await page.screenshot({ path: process.argv[2] + '/3-full.png', fullPage: true });
  // rate flow
  const [popup] = await Promise.all([ctx.waitForEvent('page').catch(() => null), page.click('.route .nav')]);
  if (popup) await popup.close();
  await page.click('.route .rate button[data-v="1"]');
  console.log('RATINGS:', await page.textContent('#ratingCount'));
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
})();
