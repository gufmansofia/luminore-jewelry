import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';

const partners = [
  {
    id: 'gufman-matyash',
    name: 'Gufman & Matyash Wine House',
  },
];

export function Partners() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="relative py-24 lg:py-32 bg-[#1B0D14] overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#1B0D14]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Warm accent glow */}
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-[#D1642E]/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#D1642E]"></div>
            <span
              className="font-cinzel text-xs text-[#C5C9C6]/70"
              style={{ letterSpacing: '0.2em' }}
            >
              {t.partners.eyebrow}
            </span>
            <div className="w-8 h-px bg-[#D1642E]"></div>
          </div>

          {/* Headline */}
          <h2
            className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-[1.15] mb-6"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.partners.headline1}<br />
            <span className="text-[#D1642E]">{t.partners.headline2}</span>
          </h2>

          <p className="font-body text-lg text-[#C5C9C6]/80 leading-relaxed">
            {t.partners.description}
          </p>
        </div>

        {/* Partners */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group relative bg-white/5 border border-[#C5C9C6]/10 p-10 md:p-14 max-w-lg w-full text-center hover:border-[#D1642E]/30 transition-all duration-500"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#D1642E]/20 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#D1642E]/20 pointer-events-none"></div>

              {/* Wine glass icon placeholder */}
              <div className="w-16 h-16 mx-auto mb-8 bg-[#D1642E]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v3.75m0 0L6 12a6 6 0 006 6m-2.25-8.25h4.5M14.25 3v3.75m0 0L18 12a6 6 0 01-6 6m0 0v3m0-3h-3m3 0h3" />
                </svg>
              </div>

              {/* Partner name */}
              <h3
                className="font-cinzel text-xl md:text-2xl text-white mb-4"
                style={{ letterSpacing: '0.05em' }}
              >
                {partner.name}
              </h3>

              {/* Description */}
              <p className="font-body text-[#C5C9C6]/70 leading-relaxed">
                {t.partners.partnerDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
