import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

const TELEGRAM_LINK = 'https://t.me/luminore_jewelry';
const WHATSAPP_LINK = 'https://wa.me/421940600708';

const inputBase: React.CSSProperties = {
  padding: '14px 16px',
  backgroundColor: 'rgba(27,13,20,0.06)',
  border: '1px solid rgba(27,13,20,0.12)',
  color: '#1B0D14',
};

const focusStyles: React.CSSProperties = {
  borderColor: '#D1642E',
  boxShadow: '0 0 0 2px rgba(209,100,46,0.2)',
  outline: 'none',
};

const blurStyles: React.CSSProperties = {
  borderColor: 'rgba(27,13,20,0.12)',
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
    <section
      ref={sectionRef}
      id="custom-order"
      className="relative py-24 lg:py-32 bg-[#C5C9C6] overflow-hidden"
    >
      <style>{`
        #custom-order input::placeholder,
        #custom-order textarea::placeholder {
          color: rgba(27, 13, 20, 0.35) !important;
          opacity: 1 !important;
          -webkit-text-fill-color: rgba(27, 13, 20, 0.35) !important;
        }
        #custom-order select,
        #custom-order input,
        #custom-order textarea {
          color-scheme: light;
        }
      `}</style>

      {/* Concrete Silver background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#C5C9C6]"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='suede'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting lighting-color='%23D1642E' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23suede)'/%3E%3C/svg%3E")`,
      }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1B0D14]/10 to-transparent"></div>
      <div
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#D1642E]/12 rounded-full blur-[140px] transition-none"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      ></div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-8">
            <svg className="w-14 h-14 animate-[diamondPulse_3s_ease-in-out_infinite]" viewBox="0 0 1469 968" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M762.182 946.541C749.855 957.83 744.82 962.605 737.476 967.692C589.551 837.284 420.916 682.949 278.415 559.16C221.27 507.438 160.958 453.017 112.947 410.612C78.5869 378.795 20.8442 332.601 2.57422 302.964C22.038 272.367 45.8098 253.785 73.6301 223.059C105.187 190.281 275.664 16.9239 287.498 1.17116C288.043 0.444512 288.9 0.0292844 289.808 0.0292844C341.296 0.0552362 1186.13 0.00333269 1186.13 0.00333269C1186.13 0.00333269 1186.83 -0.0745226 1187.32 0.522368C1226.33 50.0383 1315.68 137.029 1377.34 201.207C1404.05 229.002 1443.6 269.798 1465.73 297.748C1468.69 301.485 1468.61 307.402 1465.19 310.698C1434.46 340.36 1419.85 354.712 1394.42 378.016C1355.26 413.908 1282.54 477.23 1254.98 502.092C1092.55 649.082 917.399 803.521 762.234 946.541H762.182ZM730.988 931.982C738.28 943.894 737.008 946.671 743.185 936.29C745.469 932.449 885.504 682.923 905.28 650.017C922.901 620.639 913.195 631.487 898.714 601.409C853.35 522.152 806.429 437.991 762.285 362.004C731.169 315.784 743.496 306.831 719.647 352.194C579.404 619.134 564.3 618.304 581.246 651.262C637.51 760.857 677.164 832.302 730.962 931.982H730.988ZM734.854 298.163C740.823 302.393 756.135 291.208 770.175 281.113C786.836 269.123 828.073 241.277 849.587 227.522C877.511 208.863 936.603 170.065 952.849 159.736C970.341 148.629 991.984 133.499 992.062 132.357C992.088 131.786 989.804 130.722 987.131 129.606C979.865 126.57 973.74 134.693 966.604 138.378C957.624 145.696 787.251 258.535 776.299 260.325C821.014 219.477 918.359 169.001 974.597 125.402C890.876 86.4226 819.743 50.5054 736.905 17.8841C715.832 19.0519 679.629 42.2528 650.382 53.8532C588.175 82.1665 538.737 105.835 478.633 132.202C564.767 182.885 654.041 250.022 734.88 298.137L734.854 298.163ZM558.253 605.094C560.692 609.74 563.313 613.165 564.092 612.698C565.987 611.504 585.502 575.068 586.67 573.381C607.821 531.884 627.752 496.071 648.695 458.778C668.522 417.567 709.032 352.895 726.861 312.41C726.861 309.504 490.493 311.788 424.653 312.929C466.15 410.819 508.218 501.702 558.253 605.094ZM920.799 613.503C923.342 617.629 926.067 612.153 936.785 581.374C947.218 551.089 959.856 515.976 961.621 510.059C987.053 446.373 1012.54 379.054 1035.14 314.071C994.346 311.061 764.05 312.359 749.206 314.045C748.142 315.109 771.55 357.099 777.597 364.911C808.038 418.086 841.88 475.154 873.203 532.533C877.433 541.694 902.139 590.276 905.747 582.334C907.719 578.001 960.894 430.309 966.188 416.321C970.47 405.318 990.946 346.07 998.68 333.431C1004.88 329.305 959.648 452.368 937.59 512.031C929.622 532.403 929.155 537.153 920.02 560.405C909.821 587.239 908.082 590.613 915.167 600.838C916.595 601.461 945.764 502.948 979.034 434.825C1008.93 352.895 1011.21 346.615 1019.26 338.232C1015.6 348.431 1011.4 362.316 1004.42 387.048C934.501 552.282 920.773 613.529L920.799 613.503ZM525.683 588.355C546.808 607.975 541.748 602.084 529.68 575.795C519.04 552.983 513.823 541.383 504.04 521.114C481.436 473.026 437.733 373.708 409.731 310.49C360.111 310.646 286.876 310.542 247.948 312.904C274.029 337.973 368.987 428.778 373.425 435.811C356.011 428.83 300.5 372.177 261.235 337.428C239.384 307.739 226.097 311.71 296.322 378.12C436.487 511.772 525.683 588.355ZM940.781 604.835C993.022 564.428 1421.41 136.38 1146.68 400.153C1070.72 473.934 1031.59 511.85 971.067 563.805C956.482 568.113 1011.68 521.426 1028.32 504.427C1106.25 431.685 1168.3 366.182 1229.94 312.099H1192.75C1183.2 321.701 1090.29 402.982 1107.31 386.736C1168.02 329.097 1184.68 312.099C1174.35 312.436 1162.02 320.507C1130.36 352.662 1053.23 431.659 1018.33 457.481C1022.84 443.026 1089.67 384.141 1163.97 312.099H1112.09C1076.64 314.279 1050.87 307.064 1046.85 321.312C1010.46 423.64 982.486 492.256 940.807 604.809L940.781 604.835ZM1120.73 600.604C1224.25 509.306 1341.27 405.11 1442.04 312.748C1428.7 310.568 1398.75 326.139C1379.83 343.734 1359.85 361.2 1335.04 381.883C1291.21 413.96 1189.68 521.607 1161.94 537.023C1192.23 504.946 1276.8 418.216 1333.77 373.527C1352.58 358.604 1404.85 312.618C1390.99 310.516C1322.82 376.433 1258.59 426.027 1193.58 489.635C1179.56 491.815 1264.37 412.428 1323.83 362.705C1341.06 348.769 1380.72 310.568C1353.39 324.582C1315.27 360.577 1280.28 386.503 1234.17 429.531C1218.31 440.43C1250.28 400.594 1322.92 345.343 1352.66 312.125C1344.33 307.765 1234.11 409.133C1223.4 418.657 1221.24 420.162 1221.24 418.112C1221.24 413.7 1285.6 354.297C1313.34 329.409 1330.01 310.568C1285.68 323.699C1216.05 390.785 1289.11 311.269C1276.05 308.985 1257.76 321.883C1243.25 340.127 1214.86 400.802C1193.55 443.415 1149.15 541.876C1143.62 556.616 1129.71 584.281 1120.7 600.553L1120.73 600.604Z" fill="#D1642E"/>
            </svg>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#D1642E]"></div>
            <span className="font-cinzel text-xs text-[#564C5B]" style={{ letterSpacing: '0.2em' }}>{t.cta.eyebrow}</span>
            <div className="w-8 h-px bg-[#D1642E]"></div>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-normal text-[#1B0D14] leading-[1.15] mb-6" style={{ letterSpacing: '0.03em' }}>
            {t.cta.headline1}<br />
            <span className="text-[#D1642E]">{t.cta.headline2}</span>
          </h2>
          <p className="font-body text-lg text-[#564C5B] leading-relaxed max-w-xl mx-auto">{t.cta.description}</p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-[#D1642E]/20">
              <div
                className="h-full bg-gradient-to-r from-[#D1642E] to-[#D1642E]/60 transition-all duration-[2000ms] ease-out"
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
                <div className="w-20 h-20 mx-auto mb-4 border border-[#D1642E]/40 rounded-full flex items-center justify-center bg-[#C5C9C6] relative z-10 transition-all duration-300 group-hover:border-[#D1642E]/80 group-hover:shadow-[0_0_24px_rgba(209,100,46,0.25)] group-hover:scale-110">
                  {step.icon === 'loupe' && (
                    <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <circle cx="10" cy="10" r="6" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5L20 20" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 7l3 2.5-3 3.5-3-3.5L10 7z" opacity="0.7" />
                    </svg>
                  )}
                  {step.icon === 'sketch' && (
                    <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <rect x="3" y="3" width="14" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14c0-3 1.5-5 3-5s3 2 3 5" />
                      <circle cx="10" cy="11" r="1.5" opacity="0.7" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l2-2m-2 2l2 2m-2-2v12" />
                    </svg>
                  )}
                  {step.icon === 'setting' && (
                    <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20V10m8 10V10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l4 3-4 5-4-5 4-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h12" />
                      <line x1="12" y1="4" x2="12" y2="2" opacity="0.5" />
                      <line x1="14" y1="3" x2="15" y2="1.5" opacity="0.3" />
                      <line x1="10" y1="3" x2="9" y2="1.5" opacity="0.3" />
                    </svg>
                  )}
                  {step.icon === 'giftbox' && (
                    <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
                  className="font-cinzel text-sm text-[#1B0D14] mb-2 transition-colors duration-300 group-hover:text-[#D1642E]"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {step.title}
                </h3>
                <p className="font-body text-sm text-[#564C5B] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className={`border border-[#1B0D14]/12 overflow-hidden transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Form */}
            <div className="p-8 md:p-10 lg:p-12 bg-[#1B0D14]/6">

              {/* Form / Success */}
              {isSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-[#D1642E]/40 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-[#D1642E]/10"></div>
                    <svg className="w-9 h-9 text-[#D1642E] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-cinzel text-2xl text-[#1B0D14] mb-3" style={{ letterSpacing: '0.03em' }}>{t.cta.success}</p>
                  <p className="font-body text-[#564C5B]">{t.cta.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Contact */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-name" className="font-cinzel uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(27,13,20,0.5)' }}>
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
                      <label htmlFor="cta-contact" className="font-cinzel uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(27,13,20,0.5)' }}>
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
                      <label htmlFor="cta-pieceType" className="font-cinzel uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(27,13,20,0.5)' }}>
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
                            color: formData.pieceType ? '#1B0D14' : 'rgba(27,13,20,0.35)',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                          }}
                          onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                          onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                        >
                          <option value="" disabled style={{ backgroundColor: '#C5C9C6', color: 'rgba(27,13,20,0.4)' }}>{t.cta.pieceTypeDefault}</option>
                          <option value="rings" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.pieceTypeRings}</option>
                          <option value="earrings" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.pieceTypeEarrings}</option>
                          <option value="pendants" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.pieceTypePendants}</option>
                          <option value="bracelets" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.pieceTypeBracelets}</option>
                          <option value="other" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.pieceTypeOther}</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cta-budget" className="font-cinzel uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(27,13,20,0.5)' }}>
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
                            color: formData.budget ? '#1B0D14' : 'rgba(27,13,20,0.35)',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                          }}
                          onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                          onBlur={(e) => Object.assign(e.target.style, blurStyles)}
                        >
                          <option value="" style={{ backgroundColor: '#C5C9C6', color: 'rgba(27,13,20,0.4)' }}>{t.cta.budgetDefault}</option>
                          <option value="range1" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.budgetRange1}</option>
                          <option value="range2" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.budgetRange2}</option>
                          <option value="range3" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.budgetRange3}</option>
                          <option value="range4" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.budgetRange4}</option>
                          <option value="flexible" style={{ backgroundColor: '#C5C9C6', color: '#1B0D14' }}>{t.cta.budgetFlexible}</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label htmlFor="cta-details" className="font-cinzel uppercase block mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(27,13,20,0.5)' }}>
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
                    className="w-full flex items-center justify-center gap-3 font-cinzel text-sm bg-[#D1642E] text-white transition-all duration-300 hover:bg-[#B85420] hover:shadow-lg hover:shadow-[#D1642E]/25 active:scale-[0.99] mt-2"
                    style={{ padding: '16px 32px', letterSpacing: '0.12em' }}
                  >
                    {t.cta.submit}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  {/* Messenger buttons */}
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 h-px bg-[#1B0D14]/10"></div>
                    <span className="font-body text-xs text-[#564C5B]/60 whitespace-nowrap">{t.cta.messengerDivider}</span>
                    <div className="flex-1 h-px bg-[#1B0D14]/10"></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-5 py-3.5 border border-[#1B0D14]/15 hover:border-[#29A9EB]/50 hover:bg-[#29A9EB]/10 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-[#564C5B]/55 group-hover:text-[#29A9EB] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      <span className="font-cinzel text-xs text-[#1B0D14]/75 group-hover:text-[#1B0D14] transition-colors" style={{ letterSpacing: '0.08em' }}>Telegram</span>
                    </a>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-5 py-3.5 border border-[#1B0D14]/15 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-[#564C5B]/55 group-hover:text-[#25D366] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                      <span className="font-cinzel text-xs text-[#1B0D14]/75 group-hover:text-[#1B0D14] transition-colors" style={{ letterSpacing: '0.08em' }}>WhatsApp</span>
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
