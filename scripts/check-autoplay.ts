import { expect, test } from 'bun:test';
import { createFilmPlayback } from '../src/lib/autoplay-film';

class Film extends EventTarget {
  paused = true;
  ended = false;
  private time = 0;
  get currentTime() { return this.time; }
  set currentTime(value: number) { this.time = value; this.ended = false; }
  muted = false;
  defaultMuted = false;
  playsInline = false;
  calls = 0;
  attributes = new Map<string, string>();
  failure: Error | null = null;
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  async play() {
    this.calls++;
    if (this.failure) throw this.failure;
    this.paused = false;
    this.dispatchEvent(new Event('playing'));
  }
  pause() {
    if (!this.paused) { this.paused = true; this.dispatchEvent(new Event('pause')); }
  }
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
function fixture(loop = false) {
  const video = new Film();
  const state = { allowed: true, playing: 0, fallback: 0, ended: 0 };
  const playback = createFilmPlayback(video as unknown as HTMLVideoElement, {
    loop,
    canPlay: () => state.allowed,
    onPlaying: () => state.playing++, onFallback: () => state.fallback++, onEnded: () => state.ended++,
  });
  return { video, state, playback };
}

test('a looping hero restarts at the boundary and still respects visibility pauses', async () => {
  const { video, state, playback } = fixture(true);
  playback.sync(); await settle();
  video.currentTime = 7.2;
  video.paused = true; video.ended = true;
  video.dispatchEvent(new Event('ended')); await settle();
  expect(video.currentTime).toBe(0);
  expect(video.paused).toBe(false);
  expect(state.ended).toBe(0);
  state.allowed = false; playback.sync();
  expect(video.paused).toBe(true);
  state.allowed = true; playback.sync(); await settle();
  expect(video.paused).toBe(false);
  playback.destroy();
});

test('a visible film starts silently and resumes after the page becomes visible again', async () => {
  const { video, state, playback } = fixture();
  playback.sync(); await settle();
  expect(video.muted && video.defaultMuted && video.playsInline).toBe(true);
  expect(video.attributes.has('muted')).toBe(true);
  expect(state.playing).toBe(1);
  state.allowed = false; playback.sync();
  expect(video.paused).toBe(true);
  state.allowed = true; playback.sync(); await settle();
  expect(state.playing).toBe(2);
  expect(state.fallback).toBe(0);
  playback.destroy();
});

test('autoplay denied by browser policy selects motion fallback without a play-button interaction', async () => {
  const { video, state, playback } = fixture();
  video.failure = Object.assign(new Error('Autoplay denied'), { name: 'NotAllowedError' });
  playback.sync(); await settle();
  expect(state.fallback).toBe(1);
  expect(video.paused).toBe(true);
  video.dispatchEvent(new Event('canplay')); playback.sync(); await settle();
  expect(video.calls).toBe(1);
  expect(state.fallback).toBe(1);
  playback.destroy();
});

test('opening the page in a background tab does not permanently skip the intro', async () => {
  const { video, state, playback } = fixture();
  state.allowed = false; playback.sync();
  expect(video.calls).toBe(0);
  state.allowed = true; playback.sync(); await settle();
  expect(state.playing).toBe(1);
  playback.destroy();
});

test('an interrupted load remains retryable instead of permanently ending the film', async () => {
  const { video, state, playback } = fixture();
  video.failure = Object.assign(new Error('Interrupted'), { name: 'AbortError' });
  playback.sync(); await settle();
  expect(state.fallback).toBe(0);
  video.failure = null;
  video.dispatchEvent(new Event('canplay')); await settle();
  expect(state.playing).toBe(1);
  playback.destroy();
});

test('finished or skipped intros do not restart on visibility or readiness events', async () => {
  for (const completed of [true, false]) {
    const { video, state, playback } = fixture();
    playback.sync(); await settle();
    if (completed) { video.ended = true; video.dispatchEvent(new Event('ended')); }
    else playback.stop();
    playback.sync(); video.dispatchEvent(new Event('canplay')); await settle();
    expect(video.calls).toBe(1);
    expect(state.ended).toBe(completed ? 1 : 0);
    playback.destroy();
  }
});

test('a rejected play promise after unmount cannot replace the next page with fallback', async () => {
  const { video, state, playback } = fixture();
  video.failure = Object.assign(new Error('Autoplay denied'), { name: 'NotAllowedError' });
  playback.sync(); playback.destroy(); await settle();
  expect(state.fallback).toBe(0);
});
