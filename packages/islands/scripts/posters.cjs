// Transparent stills of every island (Reduce Motion, carousels, collection, share cards, App Store art).
// node scripts/posters.cjs [size=1024] -> apps/ios/App/Resources/Islands/poster-<region>.webp (day) and
// poster-<region>-dusk.webp (dark mode), copied to apps/web/public/islands/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const size = +(process.argv[2] || 1024);
const iosDir = path.join(__dirname, '../../../apps/ios/App/Resources/Islands');
const webDir = path.join(__dirname, '../../../apps/web/public/islands');
fs.mkdirSync(webDir, { recursive: true });
const regions = ['tuscany', 'dolomites', 'amalfi', 'sardinia', 'moselle', 'fjord', 'bardenas', 'highlands'];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: size / 2, height: size / 2 }, deviceScaleFactor: 2 });
  pg.on('pageerror', (e) => console.log('ERR', e.message));
  for (const r of regions) for (const mood of ['day', 'dusk']) {
    await pg.goto('file://' + path.join(iosDir, 'island.html') + `?region=${r}&motion=0&air=0&fit=0.86&phase=0.1&mood=${mood}`);
    await pg.waitForTimeout(400);
    const name = mood === 'day' ? `poster-${r}` : `poster-${r}-dusk`;
    const png = path.join(require('os').tmpdir(), `${name}.png`), out = path.join(iosDir, `${name}.webp`);
    await pg.screenshot({ path: png, omitBackground: true });
    // WebP keeps the alpha edge and is a fifth of the PNG (iOS 14+ and every browser decode it).
    require('child_process').execFileSync('python3', ['-c', `from PIL import Image; Image.open('${png}').save('${out}', 'WEBP', quality=86, method=6)`]);
    fs.copyFileSync(out, path.join(webDir, `${name}.webp`));
    console.log('poster', name);
  }
  await b.close();
})();
