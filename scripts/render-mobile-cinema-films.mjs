// Composite the approved portrait film with glyphs captured from the actual
// mobile preview. Usage: node script <canvas-package> <ffmpeg> <output-dir>.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const [canvasPackage, ffmpeg, outputDir] = process.argv.slice(2);
if (!canvasPackage || !ffmpeg || !outputDir) throw new Error('Provide canvas package, ffmpeg and capture directory');
const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require(resolve(canvasPackage));
const inside = (x, y, rect) => x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;

for (const variant of ['transparent', 'white']) {
  const layout = JSON.parse(readFileSync(join(outputDir, `${variant}-layout.json`)));
  const { width, height } = layout.viewport;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const source = createCanvas(width, height);
  const sourceCtx = source.getContext('2d');
  sourceCtx.drawImage(await loadImage(join(outputDir, `${variant}-ui.png`)), 0, 0, width, height);
  const glyphs = sourceCtx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const alpha = 255 - (glyphs.data[i] + glyphs.data[i + 1] + glyphs.data[i + 2]) / 3;
    let color = inside(x, y, layout.primary) ? [34, 39, 31] : [255, 255, 255];
    if (variant === 'white' && inside(x, y, layout.header)) color = [23, 27, 22];
    let opacity = 1;
    const p = layout.pause;
    if (inside(x, y, p) && Math.hypot(x - p.x - p.width / 2, y - p.y - p.height / 2) > 15) opacity = .6;
    glyphs.data.set([...color, Math.round(alpha * opacity)], i);
  }
  sourceCtx.putImageData(glyphs, 0, 0);
  const m = layout.media;
  const shade = ctx.createLinearGradient(0, m.y, 0, m.y + m.height);
  shade.addColorStop(0, 'rgba(16,28,22,0.309804)');
  shade.addColorStop(.28, 'rgba(16,28,22,0)');
  shade.addColorStop(.57, 'rgba(16,28,22,0)');
  shade.addColorStop(1, 'rgba(16,28,22,0.45098)');
  ctx.fillStyle = shade;
  ctx.fillRect(m.x, m.y, m.width, m.height);
  const h = layout.header;
  if (variant === 'white') {
    ctx.fillStyle = h.background;
    ctx.fillRect(h.x, h.y, h.width, h.height);
  }
  ctx.fillStyle = h.border;
  ctx.fillRect(0, h.height - 1, width, 1);
  for (const button of [layout.primary, layout.secondary]) {
    ctx.fillStyle = button.background;
    ctx.fillRect(button.x, button.y, button.width, button.height);
  }
  const secondary = layout.secondary;
  ctx.strokeStyle = secondary.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(secondary.x + .5, secondary.y + .5, secondary.width - 1, secondary.height - 1);
  const pause = layout.pause;
  ctx.fillStyle = pause.background;
  ctx.beginPath();
  ctx.arc(pause.x + pause.width / 2, pause.y + pause.height / 2, pause.width / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(source, 0, 0);
  const overlayPath = join(outputDir, `${variant}-overlay.png`);
  writeFileSync(overlayPath, canvas.toBuffer('image/png'));
  const filmFilter = `scale=${m.width}:${m.height}:force_original_aspect_ratio=increase,crop=${m.width}:${m.height},setsar=1` + (m.y ? `,pad=${width}:${height}:0:${m.y}:color=white` : '');
  const output = join(outputDir, variant === 'white' ? 'cinema-mobile-white-header.mp4' : 'cinema-mobile-transparent.mp4');
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-stream_loop', '1', '-i', resolve('public/optimized/atelier-hands-1080.mp4'), '-loop', '1', '-framerate', '30', '-i', overlayPath, '-filter_complex', `[0:v]${filmFilter}[film];[film][1:v]overlay=0:0:shortest=1:format=auto,format=yuv420p[out]`, '-map', '[out]', '-an', '-r', '30', '-frames:v', '634', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Failed to render ${variant}`);
  console.log(output);
}
