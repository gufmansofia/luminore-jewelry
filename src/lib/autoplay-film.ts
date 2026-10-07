type FilmPlaybackOptions = {
  loop?: boolean;
  canPlay: () => boolean;
  onPlaying: () => void;
  onFallback: () => void;
  onEnded: () => void;
};

/** A policy rejection switches to the same film encoded as an image animation. */
export function createFilmPlayback(video: HTMLVideoElement, options: FilmPlaybackOptions) {
  let disposed = false, stopped = false, fallback = false, pending = false;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let retry: ReturnType<typeof setTimeout> | undefined;
  const clearWatchdog = () => clearTimeout(watchdog);
  const useFallback = () => {
    if (disposed || stopped || fallback || !options.canPlay()) return;
    fallback = true;
    clearWatchdog();
    video.pause();
    options.onFallback();
  };
  const watch = () => {
    clearWatchdog();
    watchdog = setTimeout(useFallback, 8000);
  };
  const sync = () => {
    if (disposed || stopped || fallback || !options.canPlay()) {
      clearWatchdog();
      video.pause();
      return;
    }
    if (!video.paused || pending || video.ended) return;
    pending = true;
    watch();
    void video.play().then(() => {
      pending = false;
      if (disposed || stopped || fallback || !options.canPlay()) video.pause();
    }).catch((error: unknown) => {
      pending = false;
      if (disposed || stopped) return;
      // Source changes and visibility pauses may interrupt a valid play request.
      if (error instanceof Error && error.name === 'AbortError') return;
      useFallback();
    });
  };
  const playing = () => {
    if (disposed || stopped || fallback || !options.canPlay()) { video.pause(); return; }
    clearWatchdog();
    options.onPlaying();
  };
  const waiting = () => { if (options.canPlay() && !stopped && !fallback) watch(); };
  const paused = () => {
    clearTimeout(retry);
    if (!disposed && !stopped && !fallback && !video.ended && options.canPlay()) retry = setTimeout(sync, 150);
  };
  const stop = () => {
    stopped = true;
    clearWatchdog();
    clearTimeout(retry);
    video.pause();
  };
  const ended = () => {
    if (disposed || stopped) return;
    if (options.loop) { video.currentTime = 0; sync(); }
    else { stop(); options.onEnded(); }
  };
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  const listeners = { playing, waiting, stalled: waiting, pause: paused, ended, error: useFallback, loadeddata: sync, canplay: sync };
  for (const [name, listener] of Object.entries(listeners)) video.addEventListener(name, listener);
  return {
    sync,
    stop,
    destroy() {
      disposed = true;
      for (const [name, listener] of Object.entries(listeners)) video.removeEventListener(name, listener);
      stop();
    },
  };
}
