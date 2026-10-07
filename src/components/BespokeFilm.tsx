import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { useAutoplayFilm } from '../hooks/useAutoplayFilm';

export function BespokeFilm() {
  const { language } = useLanguage();
  const label = choose(language, 'Jewellery being crafted in the atelier', 'Изготовление украшения в мастерской', 'Виготовлення прикраси в майстерні');
  const media = useAutoplayFilm({
    mobileQuery: '(max-width: 700px)',
    mobileSrc: '/optimized/bespoke-film-mobile.mp4',
    desktopSrc: '/optimized/bespoke-film-desktop.mp4',
    mobileFallback: '/optimized/bespoke-film-motion-mobile.webp',
    desktopFallback: '/optimized/bespoke-film-motion-desktop.webp',
  });

  return <div ref={media.containerRef} className="bespoke-film-media" data-playback={media.fallback ? (media.animation ? 'animation' : 'poster') : 'video'}>
    <video
      ref={media.videoRef}
      hidden={media.fallback}
      autoPlay
      muted
      playsInline
      loop
      preload="metadata"
      disablePictureInPicture
      poster="/optimized/bespoke-film-poster.jpg"
      aria-label={label}
    />
    {media.fallback && <img src={media.animation || '/optimized/bespoke-film-poster.jpg'} alt={label}
      onError={event => { if (event.currentTarget.getAttribute('src') !== '/optimized/bespoke-film-poster.jpg') event.currentTarget.src = '/optimized/bespoke-film-poster.jpg'; }} />}
  </div>;
}
