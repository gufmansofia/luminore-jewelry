import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products, type Product } from '../data/products';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [options]);

  return (
    <div className="border border-[#C5C9C6]/20 bg-[#564C5B]/10 overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-300 ${
          isOpen ? 'bg-[#564C5B]/30' : 'hover:bg-[#564C5B]/20'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-start">
          <span 
            className="font-cinzel text-[10px] text-[#C5C9C6]/50 uppercase mb-1"
            style={{ letterSpacing: '0.15em' }}
          >
            {label}
          </span>
          <span className="font-body text-sm text-white">
            {selectedOption?.label}
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-[#D1642E] transition-transform duration-300 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: isOpen ? contentHeight : 0 }}
      >
        <div ref={contentRef} className="border-t border-[#C5C9C6]/10">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                onChange(option.key);
                onToggle();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 border-b border-[#C5C9C6]/5 last:border-b-0 ${
                value === option.key
                  ? 'bg-[#D1642E]/15 text-white'
                  : 'text-[#C5C9C6] hover:bg-[#564C5B]/30 hover:text-white'
              }`}
            >
              <span className="font-body text-sm">{option.label}</span>
              {value === option.key && (
                <div className="w-5 h-5 rounded-full bg-[#D1642E]/20 flex items-center justify-center flex-shrink-0 ml-2">
                  <div className="w-2 h-2 rounded-full bg-[#D1642E]"></div>
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
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceSort, setPriceSort] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [qvImageIndex, setQvImageIndex] = useState(0);
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

  const openQuickView = useCallback((e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setQvImageIndex(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
    setQvImageIndex(0);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!quickViewProduct) return;
      if (e.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [quickViewProduct, closeQuickView]);

  return (
    <section 
      ref={sectionRef}
      id="products" 
      className="relative py-24 lg:py-32 bg-[#1B0D14] overflow-hidden"
    >
      {/* Black Cherry background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#1B0D14]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Dusty Amethyst shadows for depth */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#564C5B]/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#564C5B]/25 to-transparent"></div>

      {/* Fire in Ice - Luminore Rust warm glow */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-[#D1642E]/10 rounded-full blur-[120px]"></div>

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
              {t.products.eyebrow}
            </span>
            <div className="w-8 h-px bg-[#D1642E]"></div>
          </div>

          {/* Headline - Cinzel with 3% tracking */}
          <h2 
            className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-[1.15] mb-6"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.products.headline1}<br />
            <span className="text-[#D1642E]">{t.products.headline2}</span>
          </h2>

          <p className="font-body text-[#C5C9C6]/80 text-lg leading-relaxed">
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
            <p className="font-body text-sm text-[#C5C9C6]/60">{t.products.noItems}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {displayedProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`group bg-[#564C5B]/20 border border-[#C5C9C6]/10 transition-all duration-700 hover:border-[#D1642E]/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D1642E]/10 flex flex-col ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + (index % INITIAL_SHOW_COUNT) * 100}ms` }}
            >
              {/* Image Container - Product photography style */}
              <div className="relative aspect-square bg-[#1B0D14] overflow-hidden">
                {/* Cold environment with texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#564C5B]/30 via-[#1B0D14]/60 to-[#1B0D14]/80"></div>
                
                {/* Surface texture */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}></div>

                {/* Product Image */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getMainImage(product.images)}
                    alt={language === 'ru' ? product.name : product.nameEn}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                  />
                ) : (
                  /* Product placeholder */
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto mb-4 border border-[#D1642E]/30 bg-[#D1642E]/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#D1642E]/5 blur-lg"></div>
                        <svg className="w-12 h-12 text-[#D1642E]/60 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l9 7-9 11-9-11 9-7z" />
                        </svg>
                      </div>
                      <p 
                        className="font-cinzel text-[#C5C9C6]/40 text-xs"
                        style={{ letterSpacing: '0.15em' }}
                      >
                        {product.category}
                      </p>
                    </div>
                  </div>
                )}

                {/* Chiaroscuro overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B0D14]/60 via-transparent to-transparent z-20"></div>

                {/* Warm accent on hover */}
                <div className="absolute inset-0 bg-[#D1642E]/0 group-hover:bg-[#D1642E]/10 transition-all duration-500 z-30"></div>

                {/* Quick View button overlay */}
                <button
                  onClick={(e) => openQuickView(e, product)}
                  aria-label={t.products.quickView}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2 bg-[#1B0D14]/90 border border-[#C5C9C6]/30 text-[#C5C9C6] font-cinzel text-xs opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#D1642E] hover:text-white hover:border-[#D1642E]"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {t.products.quickView}
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-3 md:p-6 flex flex-col flex-1">
                <h3
                  className="font-cinzel text-xs md:text-lg text-white mb-1 md:mb-2 group-hover:text-[#D1642E] transition-colors leading-snug line-clamp-2"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {language === 'ru' ? product.name : product.nameEn}
                </h3>
                <p className="hidden md:block font-body text-sm text-[#C5C9C6]/70 mb-4 line-clamp-2">
                  {language === 'ru' ? product.description : product.descriptionEn}
                </p>
                <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-[#C5C9C6]/10 mt-auto">
                  <span
                    className="font-cinzel text-sm md:text-xl text-white"
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {formatUsd(product.priceUsd)}
                  </span>
                  <span
                    className="px-2 py-1 md:px-4 md:py-2 font-cinzel text-[10px] md:text-xs text-[#C5C9C6] border border-[#C5C9C6]/30 group-hover:bg-[#D1642E] group-hover:text-white group-hover:border-[#D1642E] transition-all duration-300"
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
              className="group px-10 py-4 bg-transparent border border-[#D1642E] text-[#D1642E] font-cinzel text-sm hover:bg-[#D1642E] hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto"
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[100] bg-[#1B0D14]/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeQuickView}
        >
          <div
            className="relative bg-[#1B0D14] border border-[#C5C9C6]/15 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 w-10 h-10 border border-[#C5C9C6]/30 hover:border-[#D1642E] hover:bg-[#D1642E]/10 transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-[#C5C9C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative">
                <div className="aspect-square bg-[#1B0D14] overflow-hidden">
                  {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                    <img
                      src={quickViewProduct.images[qvImageIndex]}
                      alt={language === 'ru' ? quickViewProduct.name : quickViewProduct.nameEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#564C5B]/20 flex items-center justify-center">
                      <svg className="w-16 h-16 text-[#D1642E]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l9 7-9 11-9-11 9-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Image nav dots — outside overflow-hidden so they're never clipped */}
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {quickViewProduct.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setQvImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === qvImageIndex ? 'bg-[#D1642E] scale-125' : 'bg-[#C5C9C6]/40 hover:bg-[#C5C9C6]/60'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-center">
                <p className="font-cinzel text-xs text-[#C5C9C6]/50 mb-3" style={{ letterSpacing: '0.2em' }}>
                  {language === 'ru' ? quickViewProduct.category : quickViewProduct.categoryEn}
                </p>
                <h3 className="font-cinzel text-2xl text-white mb-4" style={{ letterSpacing: '0.03em' }}>
                  {language === 'ru' ? quickViewProduct.name : quickViewProduct.nameEn}
                </h3>
                <p className="font-cinzel text-2xl text-[#D1642E] mb-6" style={{ letterSpacing: '0.03em' }}>
                  {formatUsd(quickViewProduct.priceUsd)}
                </p>
                <p className="font-body text-[#C5C9C6]/70 text-sm leading-relaxed mb-8">
                  {language === 'ru' ? quickViewProduct.description : quickViewProduct.descriptionEn}
                </p>

                {/* Quick specs */}
                <div className="space-y-3 mb-8 border-t border-[#C5C9C6]/10 pt-6">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-[#C5C9C6]/50">{t.product.material}</span>
                    <span className="font-body text-sm text-white">{quickViewProduct.metalType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-[#C5C9C6]/50">{t.product.stones}</span>
                    <span className="font-body text-sm text-white">{quickViewProduct.gemstoneType}{quickViewProduct.totalCarat ? `, ${quickViewProduct.totalCarat}ct` : ''}</span>
                  </div>
                </div>

                <button
                  onClick={() => { closeQuickView(); navigate(`/product/${quickViewProduct.id}`); }}
                  className="w-full px-8 py-4 bg-[#D1642E] text-white font-cinzel text-sm hover:bg-[#B85420] transition-all duration-300"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {language === 'ru' ? 'Смотреть подробнее' : 'View Full Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
