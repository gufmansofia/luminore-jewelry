import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';

function AnimatedCounter({ end, suffix, label, duration = 2000, isVisible }: {
  end: number; suffix: string; label: string; duration?: number; isVisible: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <div className="text-center">
      <div className="font-cinzel text-4xl md:text-5xl text-[#D1642E] mb-2" style={{ letterSpacing: '0.03em' }}>
        {count}{suffix}
      </div>
      <div className="font-body text-sm text-[#564C5B]" style={{ letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  );
}

export function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { end: 200, suffix: '+', label: t.about.stat1Label },
    { end: 18, suffix: 'K', label: t.about.stat2Label },
    { end: 100, suffix: '%', label: t.about.stat3Label },
    { end: 10, suffix: '+', label: t.about.stat4Label },
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-24 lg:py-32 bg-[#C5C9C6] overflow-hidden"
    >
      {/* Concrete Silver background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#C5C9C6]"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Soft suede texture overlay - materiality conflict */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='suede'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting lighting-color='%23D1642E' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23suede)'/%3E%3C/svg%3E")`,
      }}></div>

      {/* Shadows for depth */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1B0D14]/10 to-transparent"></div>

      {/* Luminore Rust warm accents - Fire in Ice with parallax */}
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#D1642E]/15 rounded-full blur-[120px] transition-none"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      ></div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#D1642E]"></div>
              <span
                className="font-cinzel text-xs text-[#564C5B]"
                style={{ letterSpacing: '0.2em' }}
              >
                {t.about.eyebrow}
              </span>
            </div>

            {/* Headline - dark text on light background */}
            <h2
              className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-normal text-[#1B0D14] leading-[1.15] mb-8"
              style={{ letterSpacing: '0.03em' }}
            >
              {t.about.headline1}<br />
              <span className="text-[#D1642E]">{t.about.headline2}</span>
            </h2>

            {/* Diamond source cards */}
            <div className="grid grid-cols-2 gap-4">

              {/* Natural diamonds */}
              <div className="bg-[#1B0D14]/6 border border-[#1B0D14]/12 hover:border-[#D1642E]/40 transition-all duration-300 p-5">
                <svg className="w-7 h-7 mb-4" viewBox="0 0 1469 968" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M762.182 946.541C749.855 957.83 744.82 962.605 737.476 967.692C589.551 837.284 420.916 682.949 278.415 559.16C221.27 507.438 160.958 453.017 112.947 410.612C78.5869 378.795 20.8442 332.601 2.57422 302.964C22.038 272.367 45.8098 253.785 73.6301 223.059C105.187 190.281 275.664 16.9239 287.498 1.17116C288.043 0.444512 288.9 0.0292844 289.808 0.0292844C341.296 0.0552362 1186.13 0.00333269 1186.13 0.00333269C1186.13 0.00333269 1186.83 -0.0745226 1187.32 0.522368C1226.33 50.0383 1315.68 137.029 1377.34 201.207C1404.05 229.002 1443.6 269.798 1465.73 297.748C1468.69 301.485 1468.61 307.402 1465.19 310.698C1434.46 340.36 1419.85 354.712 1394.42 378.016C1355.26 413.908 1282.54 477.23 1254.98 502.092C1092.55 649.082 917.399 803.521 762.234 946.541H762.182ZM730.988 931.982C738.28 943.894 737.008 946.671 743.185 936.29C745.469 932.449 885.504 682.923 905.28 650.017C922.901 620.639 913.195 631.487 898.714 601.409C853.35 522.152 806.429 437.991 762.285 362.004C731.169 315.784 743.496 306.831 719.647 352.194C579.404 619.134 564.3 618.304 581.246 651.262C637.51 760.857 677.164 832.302 730.962 931.982H730.988Z" fill="#D1642E"/>
                </svg>
                <h3 className="font-cinzel text-[10px] text-[#1B0D14] mb-2.5" style={{ letterSpacing: '0.18em' }}>
                  {t.about.naturalLabel}
                </h3>
                <p className="font-body text-xs text-[#564C5B] leading-relaxed mb-3">
                  {t.about.naturalDesc}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                    <span className="font-body text-[10px] text-[#564C5B]">{t.about.naturalBullet1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                    <span className="font-body text-[10px] text-[#564C5B]">{t.about.naturalBullet2}</span>
                  </div>
                </div>
              </div>

              {/* Laboratory diamonds */}
              <div className="bg-[#1B0D14]/6 border border-[#1B0D14]/12 hover:border-[#D1642E]/40 transition-all duration-300 p-5">
                <svg className="w-7 h-7 mb-4" viewBox="0 0 1469 968" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M762.182 946.541C749.855 957.83 744.82 962.605 737.476 967.692C589.551 837.284 420.916 682.949 278.415 559.16C221.27 507.438 160.958 453.017 112.947 410.612C78.5869 378.795 20.8442 332.601 2.57422 302.964C22.038 272.367 45.8098 253.785 73.6301 223.059C105.187 190.281 275.664 16.9239 287.498 1.17116C288.043 0.444512 288.9 0.0292844 289.808 0.0292844C341.296 0.0552362 1186.13 0.00333269 1186.13 0.00333269C1186.13 0.00333269 1186.83 -0.0745226 1187.32 0.522368C1226.33 50.0383 1315.68 137.029 1377.34 201.207C1404.05 229.002 1443.6 269.798 1465.73 297.748C1468.69 301.485 1468.61 307.402 1465.19 310.698C1434.46 340.36 1419.85 354.712 1394.42 378.016C1355.26 413.908 1282.54 477.23 1254.98 502.092C1092.55 649.082 917.399 803.521 762.234 946.541H762.182ZM730.988 931.982C738.28 943.894 737.008 946.671 743.185 936.29C745.469 932.449 885.504 682.923 905.28 650.017C922.901 620.639 913.195 631.487 898.714 601.409C853.35 522.152 806.429 437.991 762.285 362.004C731.169 315.784 743.496 306.831 719.647 352.194C579.404 619.134 564.3 618.304 581.246 651.262C637.51 760.857 677.164 832.302 730.962 931.982H730.988Z" fill="#D1642E"/>
                </svg>
                <h3 className="font-cinzel text-[10px] text-[#1B0D14] mb-2.5" style={{ letterSpacing: '0.18em' }}>
                  {t.about.labLabel}
                </h3>
                <p className="font-body text-xs text-[#564C5B] leading-relaxed mb-3">
                  {t.about.labDesc}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                    <span className="font-body text-[10px] text-[#564C5B]">{t.about.labBullet1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#D1642E] rounded-full flex-shrink-0" />
                    <span className="font-body text-[10px] text-[#564C5B]">{t.about.labBullet2}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bespoke statement */}
            <div className="mt-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#D1642E]/30" />
                <svg className="w-3 h-3 text-[#D1642E] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,3 21,9.5 12,21 3,9.5" />
                </svg>
                <div className="flex-1 h-px bg-[#D1642E]/30" />
              </div>
              <p className="font-cinzel text-xs text-[#1B0D14] text-center tracking-widest">
                {t.about.bespokeStatement}
              </p>
            </div>
          </div>

        {/* Animated Counters */}
        <div
          ref={countersRef}
          className={`mt-20 pt-16 border-t border-[#1B0D14]/10 transition-all duration-1000 ${
            countersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <AnimatedCounter
                key={i}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                isVisible={countersVisible}
                duration={2000 + i * 200}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
