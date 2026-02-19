import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
const logoFullUrl = '/logo-full.png';
import { getBlogPostBySlug, blogPosts } from '../data/blogs';
import { Footer } from './Footer';
import { useLanguage } from '../i18n';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const post = slug ? getBlogPostBySlug(slug) : undefined;

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setReadProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
    setReadProgress(0);
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, handleScroll]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1B0D14] flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-white text-xl mb-4">
            {t.blog.notFound}
          </p>
          <button
            onClick={() => navigate('/#blog')}
            className="px-6 py-3 bg-[#D1642E] text-white font-cinzel text-sm"
            style={{ letterSpacing: '0.1em' }}
          >
            {t.blog.backToBlog}
          </button>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // If not enough related, add other posts
  if (relatedPosts.length < 2) {
    const otherPosts = blogPosts
      .filter(p => p.id !== post.id && !relatedPosts.find(rp => rp.id === p.id))
      .slice(0, 2 - relatedPosts.length);
    relatedPosts.push(...otherPosts);
  }

  const formatContent = (text: string) => {
    // Check if it's a heading (starts with ##)
    if (text.startsWith('## ')) {
      return (
        <h2 
          className="font-cinzel text-2xl md:text-3xl text-white mt-12 mb-6"
          style={{ letterSpacing: '0.03em' }}
        >
          {text.replace('## ', '')}
        </h2>
      );
    }
    // Check if it's a subheading (starts with ###)
    if (text.startsWith('### ')) {
      return (
        <h3 
          className="font-cinzel text-xl text-[#D1642E] mt-8 mb-4"
          style={{ letterSpacing: '0.03em' }}
        >
          {text.replace('### ', '')}
        </h3>
      );
    }
    // Check if it's bold (starts with **)
    if (text.startsWith('**') && text.endsWith('**')) {
      return (
        <p className="font-body text-[#C5C9C6] text-lg leading-relaxed mb-4 font-semibold">
          {text.replace(/\*\*/g, '')}
        </p>
      );
    }
    // Check if it's a list item
    if (text.startsWith('• ')) {
      return (
        <li className="font-body text-[#C5C9C6] text-lg leading-relaxed mb-2 ml-6">
          {text.replace('• ', '').replace(/\*\*/g, '')}
        </li>
      );
    }
    // Check if it's a table row
    if (text.startsWith('|')) {
      return null; // Tables handled separately
    }
    // Regular paragraph
    return (
      <p className="font-body text-[#C5C9C6]/90 text-lg leading-relaxed mb-6">
        {text}
      </p>
    );
  };

  const content = language === 'ru' ? post.content : post.contentEn;
  const title = language === 'ru' ? post.title : post.titleEn;
  const category = language === 'ru' ? post.category : post.categoryEn;
  const date = language === 'ru' ? post.date : post.dateEn;
  const readTime = language === 'ru' ? post.readTime : post.readTimeEn;

  return (
    <div className="min-h-screen bg-[#1B0D14]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#D1642E] to-[#D1642E]/70 transition-[width] duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-1 left-0 right-0 z-50 bg-[#1B0D14]/95 backdrop-blur-md border-b border-[#C5C9C6]/10">
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
              onClick={() => navigate('/#blog')}
              className="font-cinzel text-sm text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors"
              style={{ letterSpacing: '0.03em' }}
            >
              {t.blog.backToBlog}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: post.image ? '520px' : 'auto', paddingTop: '8rem', paddingBottom: post.image ? '0' : '6rem' }}>
        {/* Background image with dark overlay (when image exists) */}
        {post.image ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            {/* Dark overlay for legibility */}
            <div className="absolute inset-0 bg-[#1B0D14]/75" />
            {/* Bottom fade into content area */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1B0D14] to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#1B0D14]" />
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#D1642E]/10 rounded-full blur-[150px]" />
          </>
        )}

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 pb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Category & Meta */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className="font-cinzel text-sm text-[#D1642E]"
                style={{ letterSpacing: '0.15em' }}
              >
                {category}
              </span>
              <span className="w-1 h-1 bg-[#C5C9C6]/40 rounded-full"></span>
              <span className="font-body text-sm text-[#C5C9C6]/70">{date}</span>
              <span className="w-1 h-1 bg-[#C5C9C6]/40 rounded-full"></span>
              <span className="font-body text-sm text-[#C5C9C6]/70">
                {readTime} {language === 'ru' ? 'чтения' : 'read'}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-white text-center leading-tight mb-8"
              style={{ letterSpacing: '0.03em' }}
            >
              {title}
            </h1>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-[#D1642E]/50"></div>
              <div className="w-2 h-2 border border-[#D1642E] rotate-45"></div>
              <div className="w-16 h-px bg-[#D1642E]/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="relative pb-20">
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {(() => {
              const elements: React.ReactNode[] = [];
              let i = 0;
              while (i < content.length) {
                const paragraph = content[i];

                // Handle table rows: collect all consecutive |-prefixed lines
                if (paragraph.startsWith('|')) {
                  const tableStart = i;
                  const rows: string[] = [];
                  while (i < content.length && content[i].startsWith('|')) {
                    rows.push(content[i]);
                    i++;
                  }
                  if (rows.length > 0) {
                    // Determine if row index 1 is a separator row
                    const hasSeparator = rows.length > 1 && rows[1].split('|').filter(c => c.trim()).every(c => c.trim().replace(/-/g, '').length === 0);
                    elements.push(
                      <div key={tableStart} className="overflow-x-auto mb-8">
                        <table className="w-full border-collapse">
                          <thead>
                            {(() => {
                              const headerCells = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
                              return (
                                <tr className="border-b border-[#D1642E]/30">
                                  {headerCells.map((cell, cellIndex) => (
                                    <th
                                      key={cellIndex}
                                      className={`py-3 px-4 font-body text-[#C5C9C6] ${
                                        cellIndex === 0 ? 'text-left font-cinzel text-white' : 'text-right'
                                      }`}
                                    >
                                      {cell.replace(/\*\*/g, '')}
                                    </th>
                                  ))}
                                </tr>
                              );
                            })()}
                          </thead>
                          <tbody>
                            {rows.slice(hasSeparator ? 2 : 1).map((row, rowIndex) => {
                              const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
                              return (
                                <tr key={rowIndex}>
                                  {cells.map((cell, cellIndex) => (
                                    <td
                                      key={cellIndex}
                                      className={`py-3 px-4 font-body text-[#C5C9C6] ${
                                        cellIndex === 0 ? 'text-left font-cinzel text-white' : 'text-right'
                                      }`}
                                    >
                                      {cell.replace(/\*\*/g, '')}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  continue;
                }

                // Handle consecutive list items: collect and wrap in <ul>
                if (paragraph.startsWith('• ')) {
                  const listStart = i;
                  const listItems: string[] = [];
                  while (i < content.length && content[i].startsWith('• ')) {
                    listItems.push(content[i]);
                    i++;
                  }
                  elements.push(
                    <ul key={listStart} className="mb-6">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="font-body text-[#C5C9C6] text-lg leading-relaxed mb-2 ml-6">
                          {item.replace('• ', '').replace(/\*\*/g, '')}
                        </li>
                      ))}
                    </ul>
                  );
                  continue;
                }

                // All other content types
                const element = formatContent(paragraph);
                if (element) {
                  elements.push(<div key={i}>{element}</div>);
                }
                i++;
              }
              return elements;
            })()}
          </div>

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-[#C5C9C6]/10">
            <p className="font-cinzel text-sm text-[#C5C9C6]/60 mb-4 text-center" style={{ letterSpacing: '0.1em' }}>
              {t.blog.shareArticle}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`)}
                className="w-12 h-12 border border-[#C5C9C6]/20 hover:border-[#D1642E] hover:bg-[#D1642E]/10 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                className="w-12 h-12 border border-[#C5C9C6]/20 hover:border-[#D1642E] hover:bg-[#D1642E]/10 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
                className="w-12 h-12 border border-[#C5C9C6]/20 hover:border-[#D1642E] hover:bg-[#D1642E]/10 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 border-t border-[#C5C9C6]/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 
              className="font-cinzel text-2xl text-white mb-12 text-center"
              style={{ letterSpacing: '0.03em' }}
            >
              {language === 'ru' ? 'Похожие ' : 'Related '}
              <span className="text-[#D1642E]">
                {language === 'ru' ? 'статьи' : 'articles'}
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <button
                  key={relatedPost.id}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  className="group bg-[#564C5B]/20 border border-[#C5C9C6]/10 hover:border-[#D1642E]/30 transition-all text-left p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="font-cinzel text-xs text-[#D1642E]"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {language === 'ru' ? relatedPost.category : relatedPost.categoryEn}
                    </span>
                    <span className="w-1 h-1 bg-[#C5C9C6]/40 rounded-full"></span>
                    <span className="font-body text-sm text-[#C5C9C6]/70">
                      {language === 'ru' ? relatedPost.readTime : relatedPost.readTimeEn}
                    </span>
                  </div>
                  <h3 
                    className="font-cinzel text-lg text-white group-hover:text-[#D1642E] transition-colors leading-snug"
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {language === 'ru' ? relatedPost.title : relatedPost.titleEn}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
