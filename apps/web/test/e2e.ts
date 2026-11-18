// Browser test: the built planner against the real API app (fake providers), in Chromium.
// Usage: node apps/web/test/e2e.ts [screenshotDir]
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import assert from 'node:assert/strict';
import { buildApp } from '../../../services/api/src/app.ts';
import { MemoryStore } from '../../../services/api/src/store/memory.ts';
import { fakeProviders, FakeRouter, forecast, wigglyLine } from '../../../packages/core/test/fixtures.ts';
import type { StopPlace } from '@scenic/core';

const { chromium } = createRequire(import.meta.url)('playwright') as typeof import('playwright');
const shots = process.argv[2];
const PLACES: Record<string, { lat: number; lon: number; label: string }> = {
  siena: { lat: 43.3188, lon: 11.3308, label: 'Siena, Toscana, Italia' },
  amiata: { lat: 42.95, lon: 11.85, label: 'Abbadia San Salvatore, Toscana, Italia' },
};
const api = await buildApp({
  config: { JWT_SECRET: 'e2e-secret-e2e-secret', CORS_ORIGINS: [], APPLE_BUNDLE_IDS: [], TIME_ZONE: 'Europe/Rome', LOG_LEVEL: 'silent' },
  providers: fakeProviders({
    router: new FakeRouter(true),
    // Forecast from now, so the weather strip shows; a few stops along the Siena → Amiata line.
    weather: { hourly: async (pts) => pts.map(() => forecast(new Date(Date.now() - 3600000), 30, { cloud: 25 })) },
    stops: { attribution: 'Stops: test', stops: async (): Promise<StopPlace[]> => {
      const line = wigglyLine([{ lat: 43.3188, lon: 11.3308 }, { lat: 42.95, lon: 11.85 }]);
      const at = (f: number) => line[Math.round(f * (line.length - 1))];
      return [
        { id: 's1', kind: 'viewpoint', name: 'Belvedere di Siena', ...at(0.4) },
        { id: 's2', kind: 'winery', name: 'Cantina del Colle', ...at(0.6) },
        { id: 's3', kind: 'cafe', name: 'Bar Centrale', ...at(0.5) },
      ];
    } },
  }),
  // Photos from the app's own style images, so cards render with real pictures and credits offline.
  photos: { near: async (lat: number) => { const f = ['relaxed', 'scenic', 'most_beautiful'][Math.abs(Math.round(lat * 100)) % 3]; return [{ url: `http://localhost:4179/styles/${f}.jpg`, width: 800, height: 450, title: 'View', author: 'Test Author', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/' }]; } },
  geocoder: { search: async (q) => Object.entries(PLACES).filter(([k]) => q.toLowerCase().startsWith(k.slice(0, 3))).map(([, p]) => p) },
  store: new MemoryStore(),
});

const server = await preview({ root: fileURLToPath(new URL('..', import.meta.url)), preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Route API calls to the in-process app; block external tiles/fonts.
  await page.route('**/*', async (route) => {
    const u = new URL(route.request().url());
    if (u.port === '4179' && (u.pathname.startsWith('/v1/') || u.pathname === '/healthz')) {
      const r = await api.inject({ method: route.request().method() as 'GET', url: u.pathname + u.search, payload: route.request().postData() ?? undefined, headers: route.request().headers() });
      return route.fulfill({ status: r.statusCode, body: r.body, headers: { 'content-type': 'application/json' } });
    }
    if (u.port === '4179') return route.continue();
    return route.abort();
  });

  await page.goto('http://localhost:4179/?mapStyle=blank');
  await page.getByLabel('From', { exact: true }).fill('Siena');
  await page.getByRole('option', { name: /Siena/ }).click();
  if (shots) await page.screenshot({ path: `${shots}/web-debug.png` });
  await page.getByLabel('To', { exact: true }).fill('Amiata');
  await page.getByRole('option', { name: /Abbadia/ }).click();
  await page.getByRole('button', { name: 'Most beautiful' }).click();
  await page.getByRole('button', { name: 'Lakes & coast' }).click();
  assert.equal(await page.getByRole('button', { name: 'Lakes & coast' }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: '+1 h' }).click();
  await page.getByRole('button', { name: 'Show routes' }).click();
  await page.getByText('Most scenic').waitFor({ timeout: 20000 });
  const options = await page.locator('.route').count();
  assert.ok(options >= 2, `expected route options, got ${options}`);
  assert.equal(await page.locator('.route[aria-pressed="true"]').count(), 1);
  // Every scenic option says what it costs against the fastest road, and the detail shows where it turns off.
  assert.ok(await page.locator('.route .vs').count() >= 2);
  await page.locator('.ribbon').first().waitFor();
  if (shots) { await page.locator('.ribbon').first().scrollIntoViewIfNeeded(); await page.screenshot({ path: `${shots}/web-compare.png` }); }
  assert.ok(await page.evaluate(() => document.querySelectorAll('.detour-chip').length) >= 1, 'detour chips on the map');
  if (shots) await page.screenshot({ path: `${shots}/web-planner.png` });

  // Golden hour, weather along the way, stops worth making, share.
  await page.locator('.golden').waitFor();
  assert.match(await page.locator('.golden').innerText(), /Leave .*\d\d:\d\d/);
  assert.ok(await page.locator('.wx > div').count() >= 3, 'weather strip');
  assert.ok(await page.locator('.hl.stop').count() >= 1, 'stops strip');
  assert.ok(await page.evaluate(() => document.querySelectorAll('.poi-pin').length) >= 1, 'stop pins on the map');
  if (shots) { await page.locator('.golden').scrollIntoViewIfNeeded(); await page.screenshot({ path: `${shots}/web-extras.png` }); }
  const [card] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Share this drive' }).first().click()]);
  if (shots) await card.saveAs(`${shots}/web-share-card.png`);
  await page.getByRole('status').waitFor();
  // Add a stop: the day re-plans through it.
  await page.locator('.hl.stop button').first().click();
  await page.getByText('Most scenic').first().waitFor({ timeout: 20000 });
  assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('scenic.draft')!).days[0].stops.length)), 1);
  if (shots) { await page.locator('.routes').scrollIntoViewIfNeeded(); await page.screenshot({ path: `${shots}/web-routes.png` }); }

  // Second option becomes the chosen one
  await page.locator('.route').nth(1).click();
  assert.equal(await page.locator('.route').nth(1).getAttribute('aria-pressed'), 'true');

  // Multi-day: day 2 starts at day 1's destination
  await page.getByRole('button', { name: 'Add a day' }).click();
  assert.match(await page.locator('#origin1').inputValue(), /Abbadia/);

  // Save and see it in My trips
  await page.getByRole('button', { name: 'Save journey' }).click();
  await page.getByRole('status').waitFor();
  await page.getByRole('button', { name: 'My trips' }).click();
  await page.getByText('Siena to Abbadia San Salvatore').waitFor();
  if (shots) await page.screenshot({ path: `${shots}/web-trips.png` });

  // Phone width still works
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Back to planner' }).click();
  await page.getByText('Most scenic').first().waitFor();
  if (shots) await page.screenshot({ path: `${shots}/web-phone.png`, fullPage: false });

  // Explore nearby: places within a drive, then plan a loop through one
  await page.getByRole('button', { name: 'Explore nearby' }).click();
  await page.getByLabel('From', { exact: true }).fill('Siena');
  await page.getByRole('option', { name: /Siena/ }).click();
  await page.getByRole('button', { name: '2 h' }).click();
  await page.getByRole('button', { name: /Loop/ }).click();
  await page.getByRole('button', { name: 'Find places' }).click();
  await page.locator('.place').first().waitFor({ timeout: 20000 });
  if (shots) await page.screenshot({ path: `${shots}/web-explore.png`, fullPage: false });
  await page.locator('.place').first().click();
  await page.locator('.route').first().waitFor({ timeout: 20000 });
  assert.match(await page.locator('#jname').getAttribute('placeholder') ?? '', /loop via/);

  // A shared link opens the same trip and plans it.
  const link = 'http://localhost:4179/?mapStyle=blank#r=' + Buffer.from(JSON.stringify({ o: [43.3188, 11.3308, 'Siena'], d: [42.95, 11.85, 'Abbadia San Salvatore'], s: [], st: 'scenic' })).toString('base64url');
  await page.goto(link);
  await page.locator('.route').first().waitFor({ timeout: 20000 });
  assert.match(await page.locator('#origin0').inputValue(), /Siena/);

  assert.deepEqual(errors, []);
  console.log('web e2e: ok');
} finally {
  await browser.close();
  await new Promise<void>((r) => server.httpServer.close(() => r()));
  await api.close();
}
