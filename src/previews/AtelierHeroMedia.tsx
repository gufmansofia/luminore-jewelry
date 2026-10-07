import { useEffect, useRef, useState } from 'react';
import { useAutoplayFilm } from '../hooks/useAutoplayFilm';

type Phase = 'photo' | 'loading' | 'video' | 'animation' | 'dissolving';

export function AtelierHeroMedia({ alt, skipLabel }: { alt: string; skipLabel: string }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const finished = useRef(false);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finish = (immediate = false) => {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(animationTimer.current);
    media.stop();
    setPhase(immediate ? 'photo' : 'dissolving');
  };
  const media = useAutoplayFilm({
    mobileQuery: '(max-width: 800px)',
    mobileSrc: '/optimized/atelier-intro-720.mp4',
    desktopSrc: '/optimized/atelier-intro-1080.mp4',
    mobileFallback: '/optimized/atelier-intro-motion-mobile.webp',
    desktopFallback: '/optimized/atelier-intro-motion-desktop.webp',
    onPlaying: () => { if (!finished.current) setPhase('video'); },
    onEnded: () => finish(),
  });
  useEffect(() => {
    if (!media.active) clearTimeout(animationTimer.current);
    return () => clearTimeout(animationTimer.current);
  }, [media.active]);
  const animationLoaded = () => {
    if (finished.current) return;
    setPhase('animation');
    clearTimeout(animationTimer.current);
    // The image copy contains the complete 5.65-second intro, played once.
    animationTimer.current = setTimeout(() => finish(), 5650);
  };

  return (
    <div ref={media.containerRef} className="atelier-photo" data-phase={phase}
      onTransitionEnd={event => {
        if (event.propertyName === 'opacity' && phase === 'dissolving') setPhase('photo');
      }}>
      <img
        className="atelier-hero-still"
        src="/optimized/atelier-portrait-final-780.webp"
        srcSet="/optimized/atelier-portrait-final-480.webp 480w, /optimized/atelier-portrait-final-780.webp 780w, /optimized/atelier-portrait-final-1200.webp 1200w"
        sizes="(max-width: 800px) 100vw, (min-width: 1600px) 770px, 48vw"
        width={1200}
        height={1800}
        alt={alt}
        fetchPriority="high"
        decoding="async"
      />
      <video
        ref={media.videoRef}
        className="atelier-hero-film"
        hidden={media.fallback}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      {media.animation && phase !== 'photo' && <img
        className="atelier-hero-film atelier-hero-animation"
        src={media.animation}
        alt=""
        aria-hidden="true"
        onLoad={animationLoaded}
        onError={() => finish(true)}
      />}
      {phase !== 'photo' && phase !== 'dissolving' && media.active && (
        <button type="button" className="atelier-film-skip" onClick={() => finish(true)}>{skipLabel}</button>
      )}
    </div>
  );
}
