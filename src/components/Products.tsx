import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { useLanguage } from '../i18n';

// Accordion Filter Component
interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface AccordionFilterProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (key: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionFilter({ label, value, options, onChange, isOpen, onToggle }: AccordionFilterProps) {
  const selectedOption = options.find(opt => opt.key === value);

  return (
    <div className="border border-silver/20 bg-graphite/10 overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 ${
          isOpen ? 'bg-graphite/30' : 'hover:bg-graphite/20'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-start">
          <span
            className="font-display text-[10px] text-silver/50 uppercase mb-1"
            style={{ letterSpacing: '0.15em' }}
          >
            {label}
          </span>
          <span className="font-body text-sm text-white">
            {selectedOption?.label}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-accent transition-transform duration-150 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content — grid-template-rows transition is GPU-accelerated, no JS measurement needed */}
      <div
        className="grid transition-[grid-template-rows] duration-150 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden border-t border-silver/10">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                onChange(option.key);
                onToggle();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 border-b border-silver/5 last:border-b-0 ${
                value === option.key
                  ? 'bg-accent/15 text-white'
                  : 'text-silver hover:bg-graphite/30 hover:text-white'
              }`}
            >
              <span className="font-body text-sm">{option.label}</span>
              {value === option.key && (
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 ml-2">
                  <div className="w-2 h-2 rounded-full bg-action"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const INITIAL_SHOW_COUNT = 6;

const getMainImage = (images: string[]): string => {
  const modelOrSide = images.find(img => img.includes('-model.') || img.includes('-side.'));
  return modelOrSide || images[0];
};

const formatUsd = (amount: number | null): string => {
  if (amount === null) return '—';
  return '$' + amount.toLocaleString('en-US');
};

export function Products() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const savedCatalog = location.state?.catalog;
  const [activeCategory, setActiveCategory] = useState(savedCatalog?.activeCategory ?? 'all');
  const [priceSort, setPriceSort] = useState(savedCatalog?.priceSort ?? 'all');
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(savedCatalog?.showAll ?? false);
  const sectionRef = useRef<HTMLElement>(null);

  // Accordion state - only one open at a time
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Category definitions with translations
  const categories = useMemo(() => [
    { key: 'all', label: t.products.all, keyRu: 'all', keyEn: 'all' },
    { key: 'Кольца', label: t.products.rings, keyRu: 'Кольца', keyEn: 'Rings' },
    { key: 'Серьги', label: t.products.earrings, keyRu: 'Серьги', keyEn: 'Earrings' },
    { key: 'Подвески', label: t.products.pendants, keyRu: 'Подвески', keyEn: 'Pendants' },
    { key: 'Браслеты', label: t.products.bracelets, keyRu: 'Браслеты', keyEn: 'Bracelets' },
  ], [t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset showAll when any filter changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory, priceSort]);

  // Filtration with price sorting
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      const categoryMapping: Record<string, string> = {
        'Кольца': 'Rings',
        'Серьги': 'Earrings',
        'Подвески': 'Pendants',
        'Браслеты': 'Bracelets',
        'Rings': 'Rings',
        'Earrings': 'Earrings',
        'Pendants': 'Pendants',
        'Bracelets': 'Bracelets',
      };
      const targetCat = categoryMapping[activeCategory];
      filtered = filtered.filter(p => p.categoryEn === targetCat);
    }

    // Price sort
    if (priceSort === 'low-to-high') {
      filtered.sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
    } else if (priceSort === 'high-to-low') {
      filtered.sort((a, b) => (b.priceUsd ?? 0) - (a.priceUsd ?? 0));
    } else {
      filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [activeCategory, priceSort]);

  // Determine which products to show
  const hasMoreProducts = filteredProducts.length > INITIAL_SHOW_COUNT;
  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, INITIAL_SHOW_COUNT);

  const handleCategoryChange = (categoryKey: string) => {
    setActiveCategory(categoryKey);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (showAll && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Helper function to get pluralized items text
  const getItemsText = (count: number) => {
    if (count === 0) return t.products.items;
    if (count === 1) return t.products.item;
    if (count >= 2 && count <= 4) return t.products.itemsFew;
    return t.products.items;
  };

  // Filter options (no counts)
  const categoryOptions: FilterOption[] = categories.map((category) => ({
    key: category.key,
    label: category.label,
  }));

  const priceSortOptions: FilterOption[] = [
    { key: 'all', label: t.products.priceSortAll },
    { key: 'low-to-high', label: t.products.priceSortLowHigh },
    { key: 'high-to-low', label: t.products.priceSortHighLow },
  ];

  const handleAccordionToggle = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  useEffect(() => {
    if (location.state?.returnToCatalog) {
      // Allow the homepage layout to settle before positioning the catalog.
      const timer = window.setTimeout(() => {
        if (!sectionRef.current) return;
        const top = sectionRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - (location.pathname === '/' ? 80 : 0), behavior: 'instant' });
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [location.key]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative pt-10 pb-24 lg:pt-14 lg:pb-32 bg-ink overflow-hidden"
    >
      {/* Black Cherry background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-ink"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Dusty Amethyst shadows for depth */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-graphite/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-graphite/25 to-transparent"></div>

      {/* Fire in Ice - Luminore Rust warm glow */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-action"></div>
            <span
              className="font-display text-xs text-silver/70"
              style={{ letterSpacing: '0.2em' }}
            >
              {t.products.eyebrow}
            </span>
            <div className="w-8 h-px bg-action"></div>
          </div>

          {/* Headline - Cinzel with 3% tracking */}
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-[1.15] mb-6"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.products.headline1}<br />
            <span className="text-accent">{t.products.headline2}</span>
          </h2>

          <p className="font-body text-silver/80 text-lg leading-relaxed">
            {t.products.description}
          </p>
        </div>

        {/* Mobile Filters - Accordions */}
        <div className={`md:hidden mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="space-y-3">
            <AccordionFilter
              label={t.products.category}
              value={activeCategory}
              options={categoryOptions}
              onChange={handleCategoryChange}
              isOpen={openAccordion === 'category'}
              onToggle={() => handleAccordionToggle('category')}
            />
            <AccordionFilter
              label={t.products.priceSort}
              value={priceSort}
              options={priceSortOptions}
              onChange={setPriceSort}
              isOpen={openAccordion === 'price'}
              onToggle={() => handleAccordionToggle('price')}
            />
          </div>
        </div>

        {/* Desktop Filters - Accordions */}
        <div className={`hidden md:block mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Category Accordion */}
            <div className="w-64">
              <AccordionFilter
                label={t.products.category}
                value={activeCategory}
                options={categoryOptions}
                onChange={handleCategoryChange}
                isOpen={openAccordion === 'category'}
                onToggle={() => handleAccordionToggle('category')}
              />
            </div>

            {/* Price Sort Accordion */}
            <div className="w-56">
              <AccordionFilter
                label={t.products.priceSort}
                value={priceSort}
                options={priceSortOptions}
                onChange={setPriceSort}
                isOpen={openAccordion === 'price'}
                onToggle={() => handleAccordionToggle('price')}
              />
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center mb-8">
            <p className="font-body text-sm text-silver/60">{t.products.noItems}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {displayedProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              state={{ catalogPath: location.pathname, catalog: { activeCategory, priceSort, showAll } }}
              className={`group bg-graphite/20 border border-silver/10 transition-all duration-700 hover:border-accent/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10 flex flex-col ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + (index % INITIAL_SHOW_COUNT) * 100}ms` }}
            >
              {/* Image Container - Product photography style */}
              <div className="relative aspect-square bg-ink overflow-hidden">
                {/* Cold environment with texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-graphite/30 via-ink/60 to-ink/80"></div>

                {/* Surface texture */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}></div>

                {/* Product Image */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getMainImage(product.images)}
                    alt={language === 'ru' ? product.name : language === 'uk' ? product.nameUk : product.nameEn}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                    loading="lazy"
                  />
                ) : (
                  /* Product placeholder */
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto mb-4 border border-accent/30 bg-accent/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-accent/5 blur-lg"></div>
                        <svg className="w-12 h-12 text-accent/60 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l9 7-9 11-9-11 9-7z" />
                        </svg>
                      </div>
                      <p
                        className="font-display text-silver/40 text-xs"
                        style={{ letterSpacing: '0.15em' }}
                      >
                        {product.category}
                      </p>
                    </div>
                  </div>
                )}

                {/* Chiaroscuro overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent z-20"></div>

                {/* Warm accent on hover */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500 z-30"></div>

              </div>

              {/* Product Info */}
              <div className="p-3 md:p-6 flex flex-col flex-1">
                <h3
                  className="font-display text-xs sm:text-sm md:text-base lg:text-lg text-white mb-1 md:mb-2 group-hover:text-accent transition-colors leading-snug line-clamp-2"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {language === 'ru' ? product.name : language === 'uk' ? product.nameUk : product.nameEn}
                </h3>
                <p className="hidden md:block font-body text-sm text-silver/70 mb-4 line-clamp-2">
                  {language === 'ru' ? product.description : language === 'uk' ? product.descriptionUk : product.descriptionEn}
                </p>
                <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-silver/10 mt-auto">
                  <span
                    className="font-display text-sm md:text-lg lg:text-xl text-white"
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {formatUsd(product.priceUsd)}
                  </span>
                  <span
                    className="px-2 py-1 md:px-4 md:py-2 font-display text-[10px] md:text-xs text-silver border border-silver/30 group-hover:bg-action group-hover:text-white group-hover:border-accent transition-all duration-300"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {t.products.details}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreProducts && (
          <div
            className={`text-center mt-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <button
              onClick={toggleShowAll}
              className="group px-10 py-4 bg-transparent border border-accent text-accent font-display text-sm hover:bg-action hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto"
              style={{ letterSpacing: '0.1em' }}
            >
              {showAll ? (
                <>
                  <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {t.products.hide}
                </>
              ) : (
                <>
                  {t.products.showMore}
                  <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
