import { describe, expect, test } from 'bun:test';
import { videoResponse } from '../src/lib/video-response';

const file = Bun.file(new URL('../public/optimized/atelier-intro-720.mp4', import.meta.url));
const request = (range?: string, method = 'GET') => new Request('http://localhost/intro.mp4', { method, headers: range ? { Range: range } : {} });

describe('hero video streaming', () => {
  test('serves a complete MP4 and supports HEAD', async () => {
    const response = videoResponse(file, request());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('video/mp4');
    expect((await response.arrayBuffer()).byteLength).toBe(file.size);
    expect(await videoResponse(file, request(undefined, 'HEAD')).text()).toBe('');
  });
  test.each([
    ['bytes=0-1', 0, 1],
    ['bytes=10-', 10, file.size - 1],
    ['bytes=-20', file.size - 20, file.size - 1],
    [`bytes=0-${file.size + 100}`, 0, file.size - 1],
  ])('streams %s', async (range, start, end) => {
    const response = videoResponse(file, request(range));
    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Range')).toBe(`bytes ${start}-${end}/${file.size}`);
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array(await file.slice(start, end + 1).arrayBuffer()));
  });
  test.each(['bytes=-', 'bytes=-0', 'bytes=20-10', `bytes=${file.size}-`, 'bytes=0-1,4-8', 'invalid'])('rejects invalid range %s', range => {
    const response = videoResponse(file, request(range));
    expect(response.status).toBe(416);
    expect(response.headers.get('Content-Range')).toBe(`bytes */${file.size}`);
  });
});
