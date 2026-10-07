export function ResponsiveHomeHeroMedia({ photoAlt }: { photoAlt: string }) {
  return (
    <div className="atelier-photo atelier-photo--portrait" data-phase="photo">
      <img
        src="/optimized/atelier-mobile-portrait-1280.webp"
        srcSet="/optimized/atelier-mobile-portrait-480.webp 480w, /optimized/atelier-mobile-portrait-780.webp 780w, /optimized/atelier-mobile-portrait-1280.webp 1280w, /optimized/atelier-mobile-portrait-1600.webp 1600w"
        sizes="(max-width: 800px) 100vw, (min-width: 1600px) 770px, 55vw"
        width={3207}
        height={4810}
        alt={photoAlt}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
