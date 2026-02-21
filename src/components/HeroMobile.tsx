import { useRef, useState } from 'react';
import { useLanguage } from '../i18n';

export function HeroMobile() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Slow playback to 0.5× — plays once, holds last frame
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  };

  // Step 1: overlay + logo fade in immediately on play
  // Step 2: buttons + trust signals fade in 1200 ms later
  const handlePlay = () => {
    setOverlayVisible(true);
    setTimeout(() => setCtaVisible(true), 1200);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden md:hidden">

      {/* Crop a small slice from the top so the logo is centred in the visible frame */}
      <div className="relative w-full overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto block"
          style={{ marginTop: '-10%' }}
          autoPlay
          muted
          playsInline
          poster="/hero-bg.png"
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay — fades in when video starts (800 ms) */}
        <div
          className="absolute inset-0 bg-[#1B0D14]/55 pointer-events-none"
          style={{ opacity: overlayVisible ? 1 : 0, transition: 'opacity 1400ms ease-in' }}
        />

        {/* Logo + CTAs in a single centered column — no spacer needed */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Logo — fades in first (1400 ms) */}
          <div
            className="w-[62%] pointer-events-none"
            style={{ opacity: overlayVisible ? 1 : 0, transition: 'opacity 1400ms ease-in' }}
          >
            <img src="/logo-hero.svg" alt="Luminore" className="w-full" />
          </div>

          {/* CTAs + trust signals — fade in 1200 ms after logo (900 ms duration) */}
          <div
            className="w-[62%] flex flex-col gap-1.5 mt-6"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transition: 'opacity 900ms ease-in',
              pointerEvents: ctaVisible ? 'auto' : 'none',
            }}
          >
            <button
              onClick={() => scrollToSection('products')}
              className="w-full py-1.5 bg-[#D1642E] text-white font-cinzel text-[9px] transition-all duration-300 hover:bg-[#B85420]"
              style={{ letterSpacing: '0.1em' }}
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              onClick={() => scrollToSection('custom-order')}
              className="w-full py-1.5 border border-white/55 text-white font-cinzel text-[9px] hover:border-[#D1642E] hover:text-[#D1642E] transition-all duration-300"
              style={{ letterSpacing: '0.1em' }}
            >
              {t.hero.ctaSecondary}
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                <span className="font-body text-[8px] text-white/70" style={{ letterSpacing: '0.05em' }}>
                  {t.hero.certified}
                </span>
              </div>
              <div className="w-px h-2 bg-white/20 flex-shrink-0" />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                <span className="font-body text-[8px] text-white/70" style={{ letterSpacing: '0.05em' }}>
                  {t.hero.personalApproach}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top fade for navbar legibility — always visible */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1B0D14]/60 to-transparent pointer-events-none" />

        {/* Sentinel at logo centre — Navbar watches this to know when to appear */}
        <div id="hero-logo-sentinel" className="absolute inset-x-0 top-1/2 h-px pointer-events-none" />

      </div>

    </section>
  );
}
