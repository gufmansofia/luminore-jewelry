import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
const logoFullUrl = '/logo-full.png';
import { products } from '../data/products';
import { Footer } from './Footer';
import { useLanguage } from '../i18n';

// Contact links for messengers
const TELEGRAM_LINK = 'https://t.me/luminore_jewelry';
const WHATSAPP_LINK = 'https://wa.me/421940600708';

const formatUsd = (amount: number | null): string => {
  if (amount === null) return '—';
  return '$' + amount.toLocaleString('en-US');
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const catalogPath = location.state?.catalogPath === '/preview/atelier' ? '/preview/atelier' : '/';
  const catalogState = { catalogPath, catalog: location.state?.catalog };
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [diamondType, setDiamondType] = useState<'lab' | 'natural'>('lab');

  const product = products.find(p => p.id === Number(id));
  const productImages = product?.images || [];

  const goBackToCatalog = () => {
    navigate(`${catalogPath}#products`, { state: { catalog: catalogState.catalog, returnToCatalog: true } });
  };

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    setCurrentImageIndex(0);
    setDiamondType('lab');
  }, [id]);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') { setLightboxOpen(false); setZoomed(false); }
      if (e.key === 'ArrowRight') setCurrentImageIndex(prev => (prev + 1) % (productImages.length || 1));
      if (e.key === 'ArrowLeft') setCurrentImageIndex(prev => (prev - 1 + (productImages.length || 1)) % (productImages.length || 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, productImages.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [lightboxOpen]);

  // Diamond type derived values
  const isNatural = diamondType === 'natural';

  // Build messenger message based on language and diamond type
  const message = useMemo(() => {
    if (!product) return '';
    const typeSuffix = isNatural
      ? (language === 'ru' ? ' (натуральный бриллиант)' : language === 'uk' ? ' (природний діамант)' : ' (natural diamond)')
      : '';
    const priceStr = isNatural
      ? (language === 'ru' ? 'цена по запросу' : language === 'uk' ? 'ціна за запитом' : 'price on enquiry')
      : formatUsd(product.priceUsd);
    const msg = language === 'ru'
      ? `Здравствуйте! Интересует ${product.name}${typeSuffix} (${priceStr}). Хотел(а) бы узнать подробнее о наличии и условиях покупки.`
      : language === 'uk'
      ? `Добрий день! Мене цікавить ${product.nameUk}${typeSuffix} (${priceStr}). Хотів(-ла) б дізнатися більше про наявність та умови покупки.`
      : `Hello! I'm interested in ${product.nameEn}${typeSuffix} (${priceStr}). I would like to know more about availability and purchase conditions.`;
    return encodeURIComponent(msg);
  }, [product, language, isNatural]);

  const telegramUrl = `${TELEGRAM_LINK}?text=${message}`;
  const whatsappUrl = `${WHATSAPP_LINK}?text=${message}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-white text-xl mb-4">{t.product.notFound}</p>
          <button
            onClick={goBackToCatalog}
            className="px-6 py-3 bg-action text-white font-display text-sm"
            style={{ letterSpacing: '0.1em' }}
          >
            {t.product.backToCatalog}
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.priceUsd;
  const displayGemstoneType = isNatural
    ? t.product.naturalDiamond
    : product.gemstoneType;

  // Build specifications based on available data
  const specifications = [
    { label: t.product.material, value: product.metalType },
    { label: t.product.stones, value: `${displayGemstoneType}${product.totalCarat ? `, ${product.totalCarat}ct` : ''}${product.diamondColor && product.diamondColor !== 'Not Specified' ? `, ${product.diamondColor}` : ''}${product.diamondClarity && product.diamondClarity !== 'Not Specified' ? ` ${product.diamondClarity}` : ''}` },
    { label: t.product.weight, value: product.goldWeight ? `${product.goldWeight}g` : '-' },
    { label: t.product.size, value: product.certificateType && product.certificateType !== 'None' ? `${product.certificateType} ${language === 'ru' ? 'сертификат' : language === 'uk' ? 'сертифікат' : 'Certified'}` : '-' },
  ];

  // Filter related products by category
  const relatedProducts = products
    .filter(p => p.categoryEn === product.categoryEn && p.id !== product.id)
    .slice(0, 3);

  const displayName = language === 'ru' ? product.name : language === 'uk' ? product.nameUk : product.nameEn;
  const displayDescription = language === 'ru' ? product.description : language === 'uk' ? product.descriptionUk : product.descriptionEn;
  const displayCategory = language === 'ru' ? product.category : language === 'uk' ? product.categoryUk : product.categoryEn;

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-b border-silver/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={logoFullUrl}
                alt="Luminore Jewelry"
                className="h-10 w-auto brightness-0 invert"
              />
            </button>
            <button
              onClick={goBackToCatalog}
              className="font-display text-sm text-silver/70 hover:text-accent transition-colors"
              style={{ letterSpacing: '0.03em' }}
            >
              {t.product.backToCatalog}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className={`grid lg:grid-cols-2 gap-12 lg:gap-20 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Left - Product Image Carousel */}
            <div className="relative">
              <div className="relative aspect-square bg-ink border border-silver/10 overflow-hidden">
                {/* Cold environment */}
                <div className="absolute inset-0 bg-gradient-to-br from-graphite/40 via-ink/60 to-ink/80"></div>

                {/* Texture */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}></div>

                {/* Main Product Image - Click to open lightbox */}
                {productImages.length > 0 ? (
                  <img
                    src={productImages[currentImageIndex]}
                    alt={displayName}
                    className="absolute inset-0 w-full h-full object-cover z-10 cursor-zoom-in transition-transform duration-700 hover:scale-110"
                    onClick={() => setLightboxOpen(true)}
                  />
                ) : (
                  /* Product placeholder */
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center p-12">
                      <div className="w-48 h-48 mx-auto mb-8 border border-accent/30 bg-accent/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-accent/10 blur-xl"></div>
                        <svg className="w-24 h-24 text-accent/70 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l9 7-9 11-9-11 9-7z" />
                        </svg>
                      </div>
                      <p
                        className="font-display text-silver/30 text-xs"
                        style={{ letterSpacing: '0.3em' }}
                      >
                        Luminore Jewelry
                      </p>
                    </div>
                  </div>
                )}

                {/* Chiaroscuro lighting */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-ink/40 z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent z-20"></div>

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-ink/60 border border-silver/20 hover:border-accent/50 hover:bg-ink/80 transition-all flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-ink/60 border border-silver/20 hover:border-accent/50 hover:bg-ink/80 transition-all flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute top-4 right-4 z-30 px-3 py-1 bg-ink/80 border border-silver/20">
                    <span className="font-display text-xs text-silver">
                      {currentImageIndex + 1} / {productImages.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail navigation */}
              {productImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 border-2 transition-all flex-shrink-0 overflow-hidden ${
                        index === currentImageIndex ? 'border-accent' : 'border-silver/20 hover:border-accent/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${displayName} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="flex flex-col justify-center">
              {/* Category */}
              <p
                className="font-display text-xs text-silver/60 mb-4"
                style={{ letterSpacing: '0.2em' }}
              >
                {displayCategory}
              </p>

              {/* Product Name */}
              <h1
                className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6"
                style={{ letterSpacing: '0.03em' }}
              >
                {displayName}
              </h1>

              {/* Diamond Type Toggle */}
              <div className="mb-6">
                <p
                  className="font-display text-[10px] text-silver/50 mb-3 uppercase"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {t.product.stones}
                </p>
                <div className="inline-flex border border-silver/20">
                  <button
                    onClick={() => setDiamondType('lab')}
                    className={`px-5 py-3 font-display text-xs transition-all duration-300 ${
                      diamondType === 'lab'
                        ? 'bg-action text-white'
                        : 'bg-transparent text-silver/70 hover:text-white hover:bg-graphite/30'
                    }`}
                    style={{ letterSpacing: '0.08em' }}
                  >
                    {t.product.labGrownDiamond}
                  </button>
                  <button
                    onClick={() => setDiamondType('natural')}
                    className={`flex flex-col items-center justify-center px-5 py-3 font-display text-xs transition-all duration-300 border-l border-silver/20 ${
                      diamondType === 'natural'
                        ? 'bg-action text-white'
                        : 'bg-transparent text-silver/70 hover:text-white hover:bg-graphite/30'
                    }`}
                    style={{ letterSpacing: '0.08em' }}
                  >
                    <span>{t.product.naturalDiamond}</span>
                    <span
                      className={`text-[9px] mt-0.5 transition-colors duration-300 ${
                        diamondType === 'natural' ? 'text-white/70' : 'text-silver/40'
                      }`}
                      style={{ letterSpacing: '0.04em' }}
                    >
                      {t.product.priceOnEnquiry}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price */}
              {isNatural ? (
                <div className="mb-8">
                  <p
                    className="font-display text-3xl text-accent"
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {t.product.priceOnEnquiry}
                  </p>
                  <p className="font-body text-sm text-silver/50 mt-2">
                    {language === 'ru'
                      ? 'Свяжитесь с нами для уточнения стоимости'
                      : language === 'uk'
                      ? 'Зв\'яжіться з нами для уточнення вартості'
                      : 'Contact us for pricing details'}
                  </p>
                </div>
              ) : (
                <p
                  className="font-display text-3xl text-accent mb-8"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {formatUsd(displayPrice)}
                </p>
              )}

              {/* Description */}
              <p className="font-body text-lg text-silver/80 leading-relaxed mb-8">
                {displayDescription}
              </p>

              {/* Specifications */}
              <div className="border-t border-silver/10 pt-8 mb-8">
                <h3
                  className="font-display text-sm text-white mb-6"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {t.product.specifications}
                </h3>
                <div className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-body text-silver/60">{spec.label}</span>
                      <span className="font-body text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons - Telegram & WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-silver/20 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-silver/70 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="font-display text-sm text-silver/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
                    {t.product.telegram}
                  </span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-silver/20 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-silver/70 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="font-display text-sm text-silver/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
                    {t.product.whatsapp}
                  </span>
                </a>
              </div>

              {/* Additional contact info */}
              <p className="font-body text-sm text-silver/50 mt-6 text-center">
                {t.product.orCall} <a href="tel:+421940600708" className="text-accent hover:underline">+421 940 600 708</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 border-t border-silver/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className="font-display text-2xl text-white mb-12 text-center"
              style={{ letterSpacing: '0.03em' }}
            >
              {t.product.related} <span className="text-accent">{t.product.relatedSuffix}</span>
            </h2>

            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  state={catalogState}
                  className="group bg-graphite/20 border border-silver/10 hover:border-accent/30 transition-all block"
                >
                  <div className="relative aspect-square bg-ink overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-graphite/30 via-ink/60 to-ink/80"></div>
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={language === 'ru' ? relatedProduct.name : language === 'uk' ? relatedProduct.nameUk : relatedProduct.nameEn}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-10"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 border border-accent/30 bg-accent/5 flex items-center justify-center">
                          <svg className="w-8 h-8 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l9 7-9 11-9-11 9-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 md:p-4">
                    <h3
                      className="font-display text-[10px] md:text-sm text-white group-hover:text-accent transition-colors"
                      style={{ letterSpacing: '0.03em' }}
                    >
                      {language === 'ru' ? relatedProduct.name : language === 'uk' ? relatedProduct.nameUk : relatedProduct.nameEn}
                    </h3>
                    <p className="font-display text-[10px] md:text-sm text-accent mt-1 md:mt-2">{formatUsd(relatedProduct.priceUsd)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Lightbox Modal */}
      {lightboxOpen && productImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center"
          onClick={() => { setLightboxOpen(false); setZoomed(false); }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-[110] w-12 h-12 border border-silver/30 hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); setZoomed(false); }}
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          {productImages.length > 1 && (
            <div className="absolute top-6 left-6 z-[110] px-4 py-2 bg-ink/80 border border-silver/20">
              <span className="font-display text-sm text-silver">
                {currentImageIndex + 1} / {productImages.length}
              </span>
            </div>
          )}

          {/* Navigation arrows */}
          {productImages.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 border border-silver/20 hover:border-accent hover:bg-accent/10 bg-ink/60 transition-all flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); setZoomed(false); setCurrentImageIndex(prev => (prev - 1 + productImages.length) % productImages.length); }}
              >
                <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 border border-silver/20 hover:border-accent hover:bg-accent/10 bg-ink/60 transition-all flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); setZoomed(false); setCurrentImageIndex(prev => (prev + 1) % productImages.length); }}
              >
                <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main lightbox image */}
          <div
            className={`max-w-[90vw] max-h-[85vh] transition-transform duration-300 ${zoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}`}
            onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed); }}
          >
            <img
              src={productImages[currentImageIndex]}
              alt={displayName}
              className="max-w-full max-h-[85vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Thumbnail strip */}
          {productImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setZoomed(false); setCurrentImageIndex(index); }}
                  className={`w-16 h-16 border-2 transition-all overflow-hidden ${
                    index === currentImageIndex ? 'border-accent' : 'border-silver/20 hover:border-accent/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
