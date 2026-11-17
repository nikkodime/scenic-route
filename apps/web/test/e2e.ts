// Browser test: the built planner against the real API app (fake providers), in Chromium.
// Usage: node apps/web/test/e2e.ts [screenshotDir]
import { createRequire } from 'node:module';
import { preview } from 'vite';
import assert from 'node:assert/strict';
import { buildApp } from '../../../services/api/src/app.ts';
import { MemoryStore } from '../../../services/api/src/store/memory.ts';
import { fakeProviders } from '../../../packages/core/test/fixtures.ts';

const { chromium } = createRequire(import.meta.url)('playwright') as typeof import('playwright');
const shots = process.argv[2];
const PLACES: Record<string, { lat: number; lon: number; label: string }> = {
  siena: { lat: 43.3188, lon: 11.3308, label: 'Siena, Toscana, Italia' },
  amiata: { lat: 42.95, lon: 11.85, label: 'Abbadia San Salvatore, Toscana, Italia' },
};
const api = await buildApp({
  config: { JWT_SECRET: 'e2e-secret-e2e-secret', CORS_ORIGINS: [], APPLE_BUNDLE_IDS: [], TIME_ZONE: 'Europe/Rome', LOG_LEVEL: 'silent' },
  providers: fakeProviders(),
  geocoder: { search: async (q) => Object.entries(PLACES).filter(([k]) => q.toLowerCase().startsWith(k.slice(0, 3))).map(([, p]) => p) },
  store: new MemoryStore(),
});

const server = await preview({ root: new URL('..', import.meta.url).pathname, preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
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
  await page.getByRole('button', { name: '+1 h' }).click();
  await page.getByRole('button', { name: 'Find scenic routes' }).click();
  await page.getByText('Most scenic').waitFor({ timeout: 20000 });
  const options = await page.locator('.route').count();
  assert.ok(options >= 2, `expected route options, got ${options}`);
  assert.equal(await page.locator('.route[aria-pressed="true"]').count(), 1);
  if (shots) await page.screenshot({ path: `${shots}/web-planner.png` });

  // Second option becomes the chosen one
  await page.locator('.route').nth(1).click();
  assert.equal(await page.locator('.route').nth(1).getAttribute('aria-pressed'), 'true');

  // Multi-day: day 2 starts at day 1's destination
  await page.getByRole('button', { name: '+ Add a day' }).click();
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

  assert.deepEqual(errors, []);
  console.log('web e2e: ok');
} finally {
  await browser.close();
  await new Promise<void>((r) => server.httpServer.close(() => r()));
  await api.close();
}
