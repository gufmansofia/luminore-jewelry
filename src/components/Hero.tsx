import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n';
import heroBg from '../../public/hero-bg.png';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden hidden md:block">

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full grayscale object-cover object-left md:object-center"
        />
        {/* Mobile: uniform dark overlay so cream bg doesn't bleed through */}
        <div className="absolute inset-0 bg-ink/88 md:hidden" />
        {/* Desktop: directional fade — dark left (text), transparent right (jewelry) */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-ink/92 via-ink/72 to-ink/20" />
        {/* Top & bottom fade — always */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/60" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex items-center pt-28 pb-24">
        <div
          className={`w-full lg:max-w-[54%] space-y-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-action"></div>
            <span
              className="font-display text-xs text-white/70"
              style={{ letterSpacing: '0.2em' }}
            >
              {t.hero.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.2]"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.hero.headline1}<br />
            <span className="text-accent">{t.hero.headline2}</span>
          </h1>

          {/* Trust signals */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 bg-action rounded-full flex-shrink-0"></div>
              <span className="font-body text-sm text-white/80">{t.hero.certified}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 bg-action rounded-full flex-shrink-0"></div>
              <span className="font-body text-sm text-white/80">{t.hero.personalApproach}</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection('products')}
              className="px-8 py-4 bg-action text-white font-display text-sm transition-all duration-300 hover:bg-action-hover hover:shadow-lg hover:shadow-accent/30"
              style={{ letterSpacing: '0.1em' }}
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              onClick={() => scrollToSection('custom-order')}
              className="px-8 py-4 border border-white/35 text-white font-display text-sm hover:border-accent hover:text-accent transition-all duration-300"
              style={{ letterSpacing: '0.1em' }}
            >
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span
          className="font-display text-[10px] text-white/40"
          style={{ letterSpacing: '0.2em' }}
        >
          {t.hero.scroll}
        </span>
        <svg
          className="w-5 h-5 text-accent/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
