import { useEffect, useRef, useState } from 'react';
import { createFilmPlayback } from '../lib/autoplay-film';

type FilmOptions = {
  loop?: boolean;
  mobileQuery: string;
  mobileSrc: string;
  desktopSrc: string;
  mobileFallback: string;
  desktopFallback: string;
  onPlaying?: () => void;
  onEnded?: () => void;
};

export function useAutoplayFilm(options: FilmOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<ReturnType<typeof createFilmPlayback> | null>(null);
  const complete = useRef(false);
  const userPaused = useRef(false);
  const syncRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  const callbacks = useRef(options);
  callbacks.current = options;
  const [animation, setAnimation] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current!, container = containerRef.current!;
    const mobile = window.matchMedia(options.mobileQuery);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let allowed = false;
    const sync = () => {
      const bounds = container.getBoundingClientRect();
      allowed = !complete.current && !userPaused.current && !motion.matches && !document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight;
      setActive(allowed);
      playbackRef.current?.sync();
    };
    syncRef.current = sync;
    const selectSource = () => {
      if (complete.current) return;
      playbackRef.current?.destroy();
      setFallback(false);
      setAnimation(null);
      playbackRef.current = createFilmPlayback(video, {
        loop: options.loop,
        canPlay: () => allowed && !complete.current,
        onPlaying: () => callbacks.current.onPlaying?.(),
        onFallback: () => {
          setFallback(true);
          setAnimation(mobile.matches ? options.mobileFallback : options.desktopFallback);
        },
        onEnded: () => { if (!options.loop) complete.current = true; callbacks.current.onEnded?.(); },
      });
      video.src = mobile.matches ? options.mobileSrc : options.desktopSrc;
      sync();
    };
    const motionChanged = () => {
      if (motion.matches) {
        playbackRef.current?.stop();
        setActive(false);
        setFallback(true);
        setAnimation(null);
      } else if (!complete.current) selectSource();
    };
    // Observe the stable container: a blocked video is hidden beneath its image fallback.
    const observer = new IntersectionObserver(sync);
    observer.observe(container);
    mobile.addEventListener('change', selectSource);
    motion.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);
    selectSource();
    if (motion.matches) motionChanged();
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', selectSource);
      motion.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pageshow', sync);
      playbackRef.current?.destroy();
      playbackRef.current = null;
      syncRef.current = null;
      video.removeAttribute('src');
      video.load();
    };
  }, [options.loop, options.mobileQuery, options.mobileSrc, options.desktopSrc, options.mobileFallback, options.desktopFallback]);

  return { containerRef, videoRef, animation: active ? animation : null, fallback, active, paused, togglePause: () => {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    syncRef.current?.();
  }, stop: () => {
    complete.current = true;
    playbackRef.current?.stop();
  } };
}
