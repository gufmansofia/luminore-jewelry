import assert from 'node:assert/strict';
import path from 'node:path';

const families = new Map([
  ['Cormorant Garamond', [400]],
  ['Montserrat', [400, 500, 600, 700]],
]);
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
  'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяЄєІіЇїҐґ';

/** Catch Unicode descriptor corruption before shipping fonts that fall back on Cyrillic pages. */
export async function checkFonts(outdir: string) {
  const html = await Bun.file(path.join(outdir, 'index.html')).text();
  const source = await Bun.file('src/index.html').text();
  const styles = (document: string) => document.match(/<style id="site-fonts">([\s\S]*?)<\/style>/)?.[1].trim();
  const css = styles(html);
  assert(css, 'Built HTML is missing self-hosted font declarations');
  assert.equal(css, styles(source), 'Font declarations changed during bundling');
  const faces = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(match => {
    const body = match[1];
    const family = body.match(/font-family:\s*'([^']+)'/)?.[1];
    const weight = Number(body.match(/font-weight:\s*(\d+)/)?.[1]);
    const url = body.match(/src:\s*url\(([^)]+)\)/)?.[1];
    const range = body.match(/unicode-range:\s*([^;]+);/)?.[1];
    assert(family && families.has(family), 'Unexpected font family');
    assert(families.get(family)!.includes(weight), `Unexpected ${family} weight: ${weight}`);
    assert(url && /^\/fonts\/[a-z-]+\.woff2$/.test(url), 'Font URL must reference a local WOFF2 asset');
    assert(range, `Missing Unicode descriptor: ${family} ${weight}`);
    const ranges = range.split(',').map(token => {
      const match = /^U\+([0-9A-F]{1,6})(?:-([0-9A-F]{1,6}))?$/.exec(token.trim());
      assert(match, `Invalid Unicode token: ${token}`);
      const start = parseInt(match[1], 16), end = parseInt(match[2] ?? match[1], 16);
      assert(start <= end && end <= 0x10ffff, `Invalid Unicode interval: ${token}`);
      return [start, end];
    });
    return { family, weight, url, ranges };
  });
  assert.equal(faces.length, 25, 'Expected existing five subsets for every approved font weight');
  for (const [family, weights] of families) {
    for (const weight of weights) {
      const ranges = faces.filter(face => face.family === family && face.weight === weight).flatMap(face => face.ranges);
      for (const letter of letters) {
        const codePoint = letter.codePointAt(0)!;
        assert(ranges.some(([start, end]) => start <= codePoint && codePoint <= end), `${family} ${weight} excludes ${letter}`);
      }
    }
  }
  const urls = [...new Set(faces.map(face => face.url))];
  assert.equal(urls.length, 10, 'Font weights should share their original subset files');
  for (const url of urls) {
    const file = Bun.file(path.join(outdir, url));
    assert(await file.exists(), `Font asset missing: ${url}`);
    assert.equal(await file.slice(0, 4).text(), 'wOF2', `Invalid WOFF2 header: ${url}`);
  }
  console.log('Verified exact self-hosted font declarations and English/Russian/Ukrainian coverage.');
}

if (import.meta.main) await checkFonts(path.resolve(process.argv[2] ?? 'dist'));
