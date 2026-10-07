// Render two loops in the current website's exact Hero placement using a
// browser-captured UI layer. Usage: bun script <ffmpeg> <capture-directory>.
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const [ffmpeg, directory] = process.argv.slice(2);
if (!ffmpeg || !directory) throw new Error('Provide ffmpeg and capture directory');
const layout = JSON.parse(readFileSync(join(directory, 'layout.json')));
const width = layout.viewport.width;
const height = Math.ceil(layout.hero.height / 2) * 2;
const photoWidth = Math.ceil(layout.photo.width);
const photoHeight = Math.ceil(layout.photo.height);
const scaledHeight = Math.round(photoWidth * 1920 / 1080 / 2) * 2;
// The original video uses object-fit: cover and object-position: 50% 22%,
// inside an element taller than its clipping container.
const topCrop = Math.round((scaledHeight - layout.video.height) * .22);
const output = join(directory, 'hero-current-size-two-actions.mp4');
const result = spawnSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-loop', '1', '-framerate', '30', '-i', join(directory, 'ui-layer.png'),
  '-stream_loop', '1', '-i', resolve('public/optimized/atelier-hands-1080.mp4'),
  '-filter_complex', `[0:v]crop=${width}:${height}:0:0[ui];[1:v]scale=${photoWidth}:${scaledHeight},crop=${photoWidth}:${photoHeight}:0:${topCrop},setsar=1[film];[ui][film]overlay=${Math.round(layout.photo.x)}:${Math.round(layout.photo.y)}:shortest=1:format=auto,format=yuv420p[out]`,
  '-map', '[out]', '-an', '-r', '30', '-frames:v', '634',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output,
], { stdio: 'inherit' });
if (result.status !== 0) throw new Error('Failed to render Hero video');
console.log(output);
