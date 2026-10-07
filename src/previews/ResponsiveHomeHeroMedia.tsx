import { useSyncExternalStore, type ComponentProps } from 'react';
import { HeroLoopMedia } from './HeroLoopMedia';

const mobileQuery = '(max-width: 800px)';
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const isMobile = () => window.matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;

export function ResponsiveHomeHeroMedia({ photoAlt, ...filmProps }: ComponentProps<typeof HeroLoopMedia> & { photoAlt: string }) {
  const mobile = useSyncExternalStore(subscribe, isMobile, serverSnapshot);
  if (!mobile) return <HeroLoopMedia {...filmProps} />;

  return (
    <div className="atelier-photo atelier-photo--portrait" data-phase="photo">
      <img
        src="/optimized/atelier-mobile-portrait-1280.webp"
        srcSet="/optimized/atelier-mobile-portrait-480.webp 480w, /optimized/atelier-mobile-portrait-780.webp 780w, /optimized/atelier-mobile-portrait-1280.webp 1280w, /optimized/atelier-mobile-portrait-1600.webp 1600w"
        sizes="100vw"
        width={3207}
        height={4810}
        alt={photoAlt}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
