import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

const TELEGRAM_LINK = 'https://t.me/luminore_jewelry';
const WHATSAPP_LINK = 'https://wa.me/421940600708';

const inputBase: React.CSSProperties = {
  padding: '14px 16px',
  backgroundColor: 'rgba(17, 17, 17,0.06)',
  border: '1px solid rgba(17, 17, 17,0.12)',
  color: 'var(--color-ink)',
};

const focusStyles: React.CSSProperties = {
  borderColor: 'var(--theme-accent)',
  boxShadow: '0 0 0 2px rgba(128,128,128,0.2)',
  outline: 'none',
};

const blurStyles: React.CSSProperties = {
  borderColor: 'rgba(17, 17, 17,0.12)',
  boxShadow: 'none',
};

export function CTA() {
  const [formData, setFormData] = useState({ name: '', contact: '', pieceType: '', budget: '', details: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStepsVisible(true); observer.unobserve(entry.target); }
      },
      { threshold: 0.2 }
    );
    if (stepsRef.current) observer.observe(stepsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.contact && formData.pieceType) {
      setIsSubmitted(true);
      setFormData({ name: '', contact: '', pieceType: '', budget: '', details: '' });
      setTimeout(() => setIsSubmitted(false), 4000);
    }
  };

  const steps = [
    { icon: 'loupe', title: t.cta.step1Title, desc: t.cta.step1Desc },
    { icon: 'sketch', title: t.cta.step2Title, desc: t.cta.step2Desc },
    { icon: 'setting', title: t.cta.step3Title, desc: t.cta.step3Desc },
    { icon: 'giftbox', title: t.cta.step4Title, desc: t.cta.step4Desc },
  ];

  return (
    <section data-theme="light"
      ref={sectionRef}
      id="custom-order"
      className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 bg-silver overflow-hidden"
    >
      <style>{`
        #custom-order input::placeholder,
        #custom-order textarea::placeholder {
          color: rgba(17, 17, 17, 0.35) !important;
          opacity: 1 !important;
          -webkit-text-fill-color: rgba(17, 17, 17, 0.35) !important;
        }
        #custom-order select,
        #custom-order input,
        #custom-order textarea {
          color-scheme: light;
        }
      `}</style>

      {/* Concrete Silver background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-silver"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='suede'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting lighting-color='%23D1642E' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23suede)'/%3E%3C/svg%3E")`,
      }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-ink/10 to-transparent"></div>
      <div
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent/12 rounded-full blur-[140px] transition-none"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      ></div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-8">
            <img src="/favicon.svg" alt="" className="w-14 h-14 animate-[diamondPulse_3s_ease-in-out_infinite]" />
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-action"></div>
            <span className="font-display text-xs text-graphite" style={{ letterSpacing: '0.2em' }}>{t.cta.eyebrow}</span>
            <div className="w-8 h-px bg-action"></div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-[1.15] mb-6" style={{ letterSpacing: '0.03em' }}>
            {t.cta.headline1}<br />
            <span className="text-accent">{t.cta.headline2}</span>
          </h2>
          <p className="font-body text-lg text-graphite leading-relaxed max-w-xl mx-auto">{t.cta.description}</p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-accent/20">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-[2000ms] ease-out"
                style={{ width: stepsVisible ? '100%' : '0%' }}
              ></div>
            </div>

            {steps.map((step, i) => (
              <div
                key={i}
                className="text-center relative group cursor-default transition-all duration-700"
                style={{
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible ? 'translateY(0)' : 'translateY(24px)',
                  transitionDelay: `${i * 200}ms`,
                }}
              >
                {/* Icon circle */}
                <div className="w-20 h-20 mx-auto mb-4 border border-accent/40 rounded-full flex items-center justify-center bg-silver relative z-10 transition-all duration-300 group-hover:border-accent/80 group-hover:shadow-[0_0_24px_rgba(128,128,128,0.25)] group-hover:scale-110">
                  {step.icon === 'loupe' && (
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <circle cx="10" cy="10" r="6" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5L20 20" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 7l3 2.5-3 3.5-3-3.5L10 7z" opacity="0.7" />
                    </svg>
                  )}
                  {step.icon === 'sketch' && (
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <rect x="3" y="3" width="14" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14c0-3 1.5-5 3-5s3 2 3 5" />
                      <circle cx="10" cy="11" r="1.5" opacity="0.7" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l2-2m-2 2l2 2m-2-2v12" />
                    </svg>
                  )}
                  {step.icon === 'setting' && (
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20V10m8 10V10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l4 3-4 5-4-5 4-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h12" />
                      <line x1="12" y1="4" x2="12" y2="2" opacity="0.5" />
                      <line x1="14" y1="3" x2="15" y2="1.5" opacity="0.3" />
                      <line x1="10" y1="3" x2="9" y2="1.5" opacity="0.3" />
                    </svg>
                  )}
                  {step.icon === 'giftbox' && (
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <rect x="3" y="10" width="18" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 14h18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v11" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c0 0-3-4-5-4s-1 2 0 3 5 1 5 1z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c0 0 3-4 5-4s1 2 0 3-5 1-5 1z" />
                      <line x1="12" y1="6" x2="12" y2="4" opacity="0.5" />
                      <line x1="13.5" y1="4.5" x2="14.5" y2="3" opacity="0.3" />
                    </svg>
                  )}
                </div>

                <h3
                  className="font-display text-sm text-ink mb-2 transition-colors duration-300 group-hover:text-accent"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {step.title}
                </h3>
                <p className="font-body text-sm text-graphite leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className={`border border-ink/12 overflow-hidden transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Form */}
            <div className="p-8 md:p-10 lg:p-12 bg-ink/6">

              {/* Form / Success */}
              {isSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-accent/40 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-accent/10"></div>
                    <svg className="w-9 h-9 text-accent relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-display text-2xl text-ink mb-3" style={{ letterSpacing: '0.03em' }}>{t.cta.success}</p>
                  <p className="font-body text-graphite">{t.cta.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Contact */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-name" className="font-display uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17, 17, 17,0.5)' }}>
                        {t.cta.nameLabel}
                      </label>
                      <input
                        id="cta-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t.cta.namePlaceholder}
                        required
                        className="w-full font-body focus:outline-none transition-all duration-200"
                        style={inputBase}
                        onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                        onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                      />
                    </div>
                    <div>
                      <label htmlFor="cta-contact" className="font-display uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17, 17, 17,0.5)' }}>
                        {t.cta.contactLabel}
                      </label>
                      <input
                        id="cta-contact"
                        type="text"
                        autoComplete="email"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder={t.cta.contactPlaceholder}
                        required
                        className="w-full font-body focus:outline-none transition-all duration-200"
                        style={inputBase}
                        onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                        onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                      />
                    </div>
                  </div>

                  {/* Piece Type + Budget */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-pieceType" className="font-display uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17, 17, 17,0.5)' }}>
                        {t.cta.pieceTypeLabel}
                      </label>
                      <div className="relative">
                        <select
                          id="cta-pieceType"
                          value={formData.pieceType}
                          onChange={(e) => setFormData(prev => ({ ...prev, pieceType: e.target.value }))}
                          required
                          className="w-full font-body focus:outline-none transition-all duration-200 cursor-pointer"
                          style={{
                            ...inputBase,
                            paddingRight: '40px',
                            color: formData.pieceType ? 'var(--color-ink)' : 'rgba(17, 17, 17,0.35)',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                          }}
                          onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                          onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                        >
                          <option value="" disabled style={{ backgroundColor: 'var(--color-silver)', color: 'rgba(17, 17, 17,0.4)' }}>{t.cta.pieceTypeDefault}</option>
                          <option value="rings" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.pieceTypeRings}</option>
                          <option value="earrings" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.pieceTypeEarrings}</option>
                          <option value="pendants" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.pieceTypePendants}</option>
                          <option value="bracelets" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.pieceTypeBracelets}</option>
                          <option value="other" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.pieceTypeOther}</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cta-budget" className="font-display uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17, 17, 17,0.5)' }}>
                        {t.cta.budgetLabel}
                      </label>
                      <div className="relative">
                        <select
                          id="cta-budget"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full font-body focus:outline-none transition-all duration-200 cursor-pointer"
                          style={{
                            ...inputBase,
                            paddingRight: '40px',
                            color: formData.budget ? 'var(--color-ink)' : 'rgba(17, 17, 17,0.35)',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                          }}
                          onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                          onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                        >
                          <option value="" style={{ backgroundColor: 'var(--color-silver)', color: 'rgba(17, 17, 17,0.4)' }}>{t.cta.budgetDefault}</option>
                          <option value="range1" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.budgetRange1}</option>
                          <option value="range2" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.budgetRange2}</option>
                          <option value="range3" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.budgetRange3}</option>
                          <option value="range4" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.budgetRange4}</option>
                          <option value="flexible" style={{ backgroundColor: 'var(--color-silver)', color: 'var(--color-ink)' }}>{t.cta.budgetFlexible}</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label htmlFor="cta-details" className="font-display uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17, 17, 17,0.5)' }}>
                      {t.cta.detailsLabel}
                    </label>
                    <textarea
                      id="cta-details"
                      value={formData.details}
                      onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                      placeholder={t.cta.detailsPlaceholder}
                      rows={3}
                      className="w-full font-body focus:outline-none transition-all duration-200 resize-none"
                      style={inputBase}
                      onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                      onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 font-display text-sm bg-action text-white transition-all duration-300 hover:bg-action-hover hover:shadow-lg hover:shadow-accent/25 active:scale-[0.99] mt-2"
                    style={{ padding: '16px 32px', letterSpacing: '0.12em' }}
                  >
                    {t.cta.submit}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  {/* Messenger buttons */}
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 h-px bg-ink/10"></div>
                    <span className="font-body text-xs text-graphite/60 whitespace-nowrap">{t.cta.messengerDivider}</span>
                    <div className="flex-1 h-px bg-ink/10"></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-5 py-3.5 border border-ink/15 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-graphite/55 group-hover:text-accent transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      <span className="font-display text-xs text-ink/75 group-hover:text-ink transition-colors" style={{ letterSpacing: '0.08em' }}>Telegram</span>
                    </a>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-5 py-3.5 border border-ink/15 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-graphite/55 group-hover:text-accent transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                      <span className="font-display text-xs text-ink/75 group-hover:text-ink transition-colors" style={{ letterSpacing: '0.08em' }}>WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
        </div>

      </div>
    </section>
  );
}
