// Transparent stills of every island (Reduce Motion, carousels, collection, share cards, App Store art).
// node scripts/posters.cjs [size=1024] -> apps/ios/App/Resources/Islands/poster-<region>.webp and apps/web/public/islands/
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
  for (const r of regions) {
    await pg.goto('file://' + path.join(iosDir, `island.html?region=${r}&motion=0&air=0&fit=0.86&phase=0.1`).replace('?', '%3F').replace(/%3F/, '?'));
    await pg.waitForTimeout(400);
    const png = path.join(require('os').tmpdir(), `poster-${r}.png`), out = path.join(iosDir, `poster-${r}.webp`);
    await pg.screenshot({ path: png, omitBackground: true });
    // WebP keeps the alpha edge and is a fifth of the PNG (iOS 14+ and every browser decode it).
    require('child_process').execFileSync('python3', ['-c', `from PIL import Image; Image.open('${png}').save('${out}', 'WEBP', quality=86, method=6)`]);
    fs.copyFileSync(out, path.join(webDir, `poster-${r}.webp`));
    console.log('poster', r);
  }
  await b.close();
})();
