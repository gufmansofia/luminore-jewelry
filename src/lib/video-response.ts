import type { BunFile } from 'bun';

/** Single byte ranges keep MP4 playback reliable on mobile browsers. */
export function videoResponse(file: BunFile, request: Request): Response {
  const size = file.size;
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600',
  });
  const range = request.headers.get('range');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const suffix = match && !match[1] ? Number(match[2]) : null;
    const start = suffix !== null ? Math.max(0, size - suffix) : Number(match?.[1]);
    const end = suffix !== null || !match?.[2] ? size - 1 : Math.min(Number(match[2]), size - 1);
    if (!match || (!match[1] && !match[2]) || suffix === 0 || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) {
      headers.set('Content-Range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(request.method === 'HEAD' ? null : file.slice(start, end + 1), { status: 206, headers });
  }
  headers.set('Content-Length', String(size));
  return new Response(request.method === 'HEAD' ? null : file, { headers });
}
