import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n';

interface Testimonial {
  name: string;
  nameEn: string;
  nameUk: string;
  role: string;
  roleEn: string;
  roleUk: string;
  text: string;
  textEn: string;
  textUk: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Анна К.',
    nameEn: 'Anna K.',
    nameUk: 'Анна К.',
    role: 'Обручальное кольцо',
    roleEn: 'Engagement Ring',
    roleUk: 'Заручинна каблучка',
    text: 'Кольцо превзошло все ожидания. Бриллиант играет невероятно, а качество исполнения безупречно. Luminore создали именно то, о чем я мечтала.',
    textEn: 'The ring exceeded all expectations. The diamond sparkles incredibly, and the craftsmanship is flawless. Luminore created exactly what I dreamed of.',
    textUk: 'Каблучка перевершила всі очікування. Діамант грає неймовірно, а якість виконання бездоганна. Luminore створили саме те, про що я мріяла.',
    rating: 5,
  },
  {
    name: 'Михаил Д.',
    nameEn: 'Michael D.',
    nameUk: 'Михайло Д.',
    role: 'Подарок на юбилей',
    roleEn: 'Anniversary Gift',
    roleUk: 'Подарунок на річницю',
    text: 'Заказывал серьги для жены. Индивидуальный подход, прозрачность на каждом этапе и потрясающий результат. Жена была в восторге.',
    textEn: 'Ordered earrings for my wife. Personal approach, transparency at every stage, and a stunning result. My wife was thrilled.',
    textUk: 'Замовляв сережки для дружини. Індивідуальний підхід, прозорість на кожному етапі та приголомшливий результат. Дружина була в захваті.',
    rating: 5,
  },
  {
    name: 'Елена С.',
    nameEn: 'Elena S.',
    nameUk: 'Олена С.',
    role: 'Коллекция украшений',
    roleEn: 'Jewelry Collection',
    roleUk: 'Колекція прикрас',
    text: 'Уже третье украшение от Luminore. Каждый раз — идеальное сочетание дизайна и качества. Лабораторные бриллианты ничем не уступают натуральным.',
    textEn: 'This is my third piece from Luminore. Every time — a perfect blend of design and quality. Lab-grown diamonds are every bit as beautiful as natural ones.',
    textUk: 'Вже третя прикраса від Luminore. Щоразу — ідеальне поєднання дизайну та якості. Лабораторні діаманти жодним чином не поступаються природним.',
    rating: 5,
  },
  {
    name: 'Дарья Л.',
    nameEn: 'Daria L.',
    nameUk: 'Дар\'я Л.',
    role: 'Кольцо на заказ',
    roleEn: 'Custom Ring',
    roleUk: 'Каблучка на замовлення',
    text: 'Сделали кольцо по моему эскизу. Команда была невероятно внимательна к деталям. Результат — произведение искусства, которым я горжусь каждый день.',
    textEn: 'They made a ring from my sketch. The team was incredibly attentive to detail. The result is a work of art I am proud to wear every day.',
    textUk: 'Зробили каблучку за моїм ескізом. Команда була неймовірно уважна до деталей. Результат — витвір мистецтва, яким я пишаюся щодня.',
    rating: 5,
  },
];

function TrustIcon({ type }: { type: string }) {
  const cls = "block w-7 h-7 flex-shrink-0";
  switch (type) {
    case 'certified':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'sustainable':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'warranty':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'conflict-free':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 7-9 11-9-11 9-7z" />
        </svg>
      );
    default:
      return null;
  }
}

const trustSignals = [
  { icon: 'certified', labelRu: 'Сертифицированные камни', labelUk: 'Сертифіковані камені', labelEn: 'Certified Stones' },
  { icon: 'sustainable', labelRu: 'Устойчивая роскошь', labelUk: 'Стала розкіш', labelEn: 'Sustainable Luxury' },
  { icon: 'warranty', labelRu: 'Пожизненная гарантия', labelUk: 'Довічна гарантія', labelEn: 'Lifetime Warranty' },
  { icon: 'conflict-free', labelRu: 'Бесконфликтные бриллианты', labelUk: 'Безконфліктні діаманти', labelEn: 'Conflict-Free Diamonds' },
];

export function Testimonials() {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const isPaused = useRef(false);

  const startAutoRotate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isPaused.current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000);
  };

  // Auto-rotate
  useEffect(() => {
    startAutoRotate();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
    startAutoRotate();
  };

  const goNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
    startAutoRotate();
  }, []);

  const goPrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
    startAutoRotate();
  }, []);

  const handleMouseEnter = () => { isPaused.current = true; };
  const handleMouseLeave = () => { isPaused.current = false; };
  const handleTouchStart = () => { isPaused.current = true; };
  const handleTouchEnd = () => { isPaused.current = false; };

  // Keyboard navigation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    section.addEventListener('keydown', handleKeyDown);
    return () => section.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const current = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      aria-label={language === 'ru' ? 'Отзывы клиентов' : language === 'uk' ? 'Відгуки клієнтів' : 'Client testimonials'}
      className="relative py-24 lg:py-32 bg-ink overflow-hidden outline-none"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-ink"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[180px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-action"></div>
            <span className="font-display text-xs text-silver/70" style={{ letterSpacing: '0.2em' }}>
              {t.testimonials.eyebrow}
            </span>
            <div className="w-8 h-px bg-action"></div>
          </div>
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-[1.15]"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.testimonials.headline1}
            <span className="text-accent">{t.testimonials.headline2}</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Prev/Next Arrows + Card wrapper */}
          <div className="relative flex items-center">
            {/* Previous arrow */}
            <button
              onClick={goPrev}
              aria-label={language === 'ru' ? 'Предыдущий отзыв' : language === 'uk' ? 'Попередній відгук' : 'Previous testimonial'}
              className="hidden md:flex items-center justify-center w-11 h-11 rounded-full border border-silver/20 text-silver/50 hover:border-accent hover:text-accent transition-all duration-300 flex-shrink-0 -ml-14 absolute left-0"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

          <div className="w-full">
          <div
            className="relative bg-graphite/10 border border-silver/10 p-6 md:p-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Quote mark */}
            <div className="absolute top-6 left-8 font-display text-4xl md:text-6xl text-accent/20 leading-none">"</div>

            {/* Content with fade transition */}
            <div aria-live="polite" className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              {/* Stars */}
              <div className="flex gap-1 mb-6 justify-center">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="font-body text-xl md:text-2xl text-silver/90 leading-relaxed text-center mb-8 italic">
                {language === 'ru' ? current.text : language === 'uk' ? current.textUk : current.textEn}
              </blockquote>

              {/* Author */}
              <div className="text-center">
                <p className="font-display text-white text-sm mb-1" style={{ letterSpacing: '0.1em' }}>
                  {language === 'ru' ? current.name : language === 'uk' ? current.nameUk : current.nameEn}
                </p>
                <p className="font-body text-accent text-sm">
                  {language === 'ru' ? current.role : language === 'uk' ? current.roleUk : current.roleEn}
                </p>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label={language === 'ru' ? 'Навигация по отзывам' : language === 'uk' ? 'Навігація по відгуках' : 'Testimonial navigation'}>
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? 'w-8 h-2 bg-action'
                      : 'w-2 h-2 bg-silver/30 hover:bg-silver/50'
                  }`}
                  aria-label={`${language === 'ru' ? 'Показать отзыв от' : language === 'uk' ? 'Показати відгук від' : 'Show testimonial from'} ${language === 'ru' ? t.name : language === 'uk' ? t.nameUk : t.nameEn}`}
                />
              ))}
            </div>
          </div>
          </div>

            {/* Next arrow */}
            <button
              onClick={goNext}
              aria-label={language === 'ru' ? 'Следующий отзыв' : language === 'uk' ? 'Наступний відгук' : 'Next testimonial'}
              className="hidden md:flex items-center justify-center w-11 h-11 rounded-full border border-silver/20 text-silver/50 hover:border-accent hover:text-accent transition-all duration-300 flex-shrink-0 -mr-14 absolute right-0"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Trust Signals Row */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {trustSignals.map((signal, i) => (
            <div
              key={i}
              className="text-center py-6 border border-silver/10 hover:border-accent/30 transition-all duration-500 group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-center text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                <TrustIcon type={signal.icon} />
              </div>
              <div className="font-body text-sm text-silver/70" style={{ letterSpacing: '0.03em' }}>
                {language === 'ru' ? signal.labelRu : language === 'uk' ? signal.labelUk : signal.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
