import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogs';
import { useLanguage } from '../i18n';

export function Blogs() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section data-theme="light"
      ref={sectionRef}
      id="blog"
      className="relative py-24 lg:py-32 bg-silver overflow-hidden"
    >
      {/* Concrete Silver background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-silver"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Luminore Rust warm accent */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]"></div>

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
              className="font-display text-xs text-graphite"
              style={{ letterSpacing: '0.2em' }}
            >
              {t.blog.eyebrow}
            </span>
            <div className="w-8 h-px bg-action"></div>
          </div>

          {/* Headline - Cinzel with 3% tracking */}
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-[1.15] mb-6"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.blog.headline1}<br />
            <span className="text-accent">{t.blog.headline2}</span>
          </h2>

          <p className="font-body text-graphite text-lg leading-relaxed">
            {t.blog.description}
          </p>
        </div>

        {/* Blog Grid - Dark cards for luxury feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((article, index) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className={`group bg-ink border border-silver/10 transition-all duration-700 hover:border-accent/30 block ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-video bg-ink overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.imageAlt || ''}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <>
                    {/* Cold environment */}
                    <div className="absolute inset-0 bg-gradient-to-br from-graphite/30 via-ink to-ink"></div>

                    {/* Texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}></div>

                    {/* Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-3 border border-accent/30 bg-accent/5 flex items-center justify-center">
                          <svg className="w-8 h-8 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Featured badge */}
                {article.image && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-action text-white font-display text-[10px]" style={{ letterSpacing: '0.1em' }}>
                    {t.blog.featured}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"></div>

                {/* Warm accent on hover */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500"></div>
              </div>

              {/* Article Content - White text on dark */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-display text-xs text-accent"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    {language === 'ru' ? article.category : language === 'uk' ? article.categoryUk : article.categoryEn}
                  </span>
                  <span className="w-1 h-1 bg-silver/40 rounded-full"></span>
                  <span className="font-body text-sm text-silver/70">
                    {language === 'ru' ? article.date : language === 'uk' ? article.dateUk : article.dateEn}
                  </span>
                </div>

                <h3
                  className="font-display text-lg text-white mb-3 group-hover:text-accent transition-colors leading-snug"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {language === 'ru' ? article.title : language === 'uk' ? article.titleUk : article.titleEn}
                </h3>

                <p className="font-body text-silver/80 text-sm leading-relaxed mb-4 line-clamp-2">
                  {language === 'ru' ? article.excerpt : language === 'uk' ? article.excerptUk : article.excerptEn}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-silver/10">
                  <span className="font-body text-sm text-silver/60">
                    {language === 'ru' ? article.readTime : language === 'uk' ? article.readTimeUk : article.readTimeEn} {t.blog.readTime}
                  </span>
                  <span
                    className="font-display text-xs text-white group-hover:text-accent transition-colors"
                    style={{ letterSpacing: '0.08em' }}
                  >
                    {t.blog.read}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
