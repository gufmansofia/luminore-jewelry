import { useEffect, useRef, useState } from 'react';

type Phase = 'photo' | 'loading' | 'video' | 'dissolving';

export function AtelierHeroMedia({ alt, skipLabel }: { alt: string; skipLabel: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [phase, setPhase] = useState<Phase>('photo');

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // The server-rendered photo remains usable without JavaScript or video playback.
    if (!video || motion.matches || connection?.saveData || document.hidden) return;

    let finished = false;
    let watchdog: ReturnType<typeof setTimeout>;
    const finish = (immediate = false) => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      video.pause();
      setPhase(immediate ? 'photo' : 'dissolving');
    };
    const playing = () => {
      if (finished) return;
      clearTimeout(watchdog);
      setPhase('video');
    };
    const ended = () => finish();
    const failed = () => finish(true);
    const waiting = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(() => finish(), 4000);
    };
    const motionChanged = () => { if (motion.matches) failed(); };
    const visibilityChanged = () => { if (document.hidden) failed(); };
    skipRef.current = failed;
    video.addEventListener('playing', playing);
    video.addEventListener('ended', ended);
    video.addEventListener('error', failed);
    video.addEventListener('waiting', waiting);
    motion.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);

    setPhase('loading');
    video.muted = true;
    video.src = window.matchMedia('(max-width: 800px)').matches
      ? '/optimized/atelier-intro-720.mp4'
      : '/optimized/atelier-intro-1080.mp4';
    watchdog = setTimeout(failed, 8000);
    void video.play().catch(failed);

    return () => {
      finished = true;
      clearTimeout(watchdog);
      video.removeEventListener('playing', playing);
      video.removeEventListener('ended', ended);
      video.removeEventListener('error', failed);
      video.removeEventListener('waiting', waiting);
      motion.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      video.pause();
      video.removeAttribute('src');
      video.load();
      skipRef.current = () => {};
    };
  }, []);

  return (
    <div className="atelier-photo" data-phase={phase}>
      <img
        className="atelier-hero-still"
        src="/optimized/atelier-portrait-final-780.webp"
        srcSet="/optimized/atelier-portrait-final-480.webp 480w, /optimized/atelier-portrait-final-780.webp 780w, /optimized/atelier-portrait-final-1200.webp 1200w"
        sizes="(max-width: 620px) calc(100vw - 36px), (max-width: 800px) 584px, (min-width: 1600px) 770px, 48vw"
        width={1200}
        height={1800}
        alt={alt}
        fetchPriority="high"
        decoding="async"
      />
      <video
        ref={videoRef}
        className="atelier-hero-film"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onTransitionEnd={event => {
          if (event.propertyName === 'opacity' && phase === 'dissolving') setPhase('photo');
        }}
      />
      {(phase === 'loading' || phase === 'video') && (
        <button type="button" className="atelier-film-skip" onClick={() => skipRef.current()}>{skipLabel}</button>
      )}
    </div>
  );
}
