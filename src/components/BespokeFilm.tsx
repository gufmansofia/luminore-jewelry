import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';

export function BespokeFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mobile = window.matchMedia('(max-width: 700px)');
    const nearViewport = () => {
      const bounds = video.getBoundingClientRect();
      return bounds.bottom > -250 && bounds.top < window.innerHeight + 250;
    };
    const syncPlayback = () => {
      if (!document.hidden && nearViewport()) void video.play().catch(() => {});
      else video.pause();
    };
    const selectSource = () => {
      video.muted = true;
      video.src = mobile.matches
        ? '/optimized/bespoke-film-mobile.mp4'
        : '/optimized/bespoke-film-desktop.mp4';
      syncPlayback();
    };
    const observer = new IntersectionObserver(syncPlayback, { rootMargin: '250px 0px' });
    observer.observe(video);
    mobile.addEventListener('change', selectSource);
    document.addEventListener('visibilitychange', syncPlayback);
    // The autoplay attribute can start playback after loading; keep it scoped to the section.
    const guardPlayback = () => {
      if (document.hidden || !nearViewport()) video.pause();
    };
    video.addEventListener('play', guardPlayback);
    selectSource();

    return () => {
      observer.disconnect();
      video.removeEventListener('play', guardPlayback);
      mobile.removeEventListener('change', selectSource);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  return <div className="bespoke-film-media"><video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    loop
    preload="metadata"
    poster="/optimized/bespoke-film-poster.jpg"
    aria-label={choose(language, 'Jewellery being crafted in the atelier', 'Изготовление украшения в мастерской', 'Виготовлення прикраси в майстерні')}
  /></div>;
}
