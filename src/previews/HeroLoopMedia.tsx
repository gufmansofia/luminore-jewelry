import { useState } from 'react';
import { useAutoplayFilm } from '../hooks/useAutoplayFilm';

const studyAssets = {
  macro: { video: '/optimized/atelier-study-macro.mp4', animation: '/optimized/atelier-study-macro.webp', poster: '/optimized/atelier-study-macro-poster.jpg' },
  triptych: { video: '/optimized/atelier-study-triptych.mp4', animation: '/optimized/atelier-study-triptych.webp', poster: '/optimized/atelier-study-triptych-poster.jpg' },
  duo: { video: '/optimized/atelier-study-duo.mp4', animation: '/optimized/atelier-study-duo.webp', poster: '/optimized/atelier-study-duo-poster.jpg' },
};
export type HeroStudy = keyof typeof studyAssets;

export function HeroLoopMedia({ alt, pauseLabel, resumeLabel, wide = false, study, film }: { alt: string; pauseLabel: string; resumeLabel: string; wide?: boolean; study?: HeroStudy; film?: 'hands' }) {
  const assets = study ? studyAssets[study] : null;
  const hands = film === 'hands';
  const [phase, setPhase] = useState<'loading' | 'video' | 'animation' | 'photo'>('loading');
  const media = useAutoplayFilm({
    loop: true,
    mobileQuery: '(max-width: 800px)',
    mobileSrc: hands ? '/optimized/atelier-hands-720.mp4' : assets ? assets.video + '?edit=3' : '/optimized/atelier-loop-720.mp4',
    desktopSrc: hands ? '/optimized/atelier-hands-1080.mp4' : (assets ? assets.video + '?edit=3' : null) ?? (wide ? '/optimized/atelier-loop-wide.mp4' : '/optimized/atelier-loop-1080.mp4'),
    mobileFallback: hands ? '/optimized/atelier-hands-motion-mobile.webp' : assets ? assets.animation + '?edit=3' : '/optimized/atelier-loop-motion-mobile.webp',
    desktopFallback: hands ? '/optimized/atelier-hands-motion-desktop.webp' : (assets ? assets.animation + '?edit=3' : null) ?? (wide ? '/optimized/atelier-loop-motion-wide.webp' : '/optimized/atelier-loop-motion-desktop.webp'),
    onPlaying: () => setPhase('video'),
  });

  return (
    <div ref={media.containerRef} className="atelier-photo" data-phase={media.fallback && !media.animation ? 'photo' : phase}>
      <img
        className="atelier-hero-still"
        src={hands ? '/optimized/atelier-hands-portrait-poster.jpg' : (assets ? assets.poster + '?edit=3' : null) ?? '/optimized/atelier-portrait-final-780.webp'}
        srcSet={assets || hands ? undefined : '/optimized/atelier-portrait-final-480.webp 480w, /optimized/atelier-portrait-final-780.webp 780w, /optimized/atelier-portrait-final-1200.webp 1200w'}
        sizes="(max-width: 800px) 100vw, (min-width: 1600px) 770px, 55vw"
        width={hands ? 720 : assets ? 1440 : 1200}
        height={hands ? 1280 : assets ? (study === 'duo' ? 600 : study === 'triptych' ? 400 : 720) : 1800}
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
        loop
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
        onLoad={() => setPhase('animation')}
        onError={() => setPhase('photo')}
      />}
      {(media.active || media.paused) && phase !== 'photo' && (
        <button type="button" className="atelier-film-control" onClick={media.togglePause}
          aria-label={media.paused ? resumeLabel : pauseLabel} aria-pressed={media.paused}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {media.paused ? <path d="M4 2.5 13 8l-9 5.5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
          </svg>
        </button>
      )}
    </div>
  );
}
