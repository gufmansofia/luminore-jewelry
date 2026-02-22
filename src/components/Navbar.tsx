import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
const logoFullUrl = '/logo-full.png';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product');
  const isHomePage = location.pathname === '/';
  const { t, language, setLanguage } = useLanguage();

  // Mobile nav always visible — hamburger accessible from page load
  const [mobileNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    if (isProductPage) return;
    const sectionIds = ['about', 'products', 'blog', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isProductPage]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'about', label: t.nav.about },
    { id: 'products', label: t.nav.collection },
    { id: 'blog', label: t.nav.blog },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isProductPage
            ? 'bg-[#1B0D14]/95 backdrop-blur-[20px]'
            : 'bg-transparent'
        } ${
          isHomePage && !mobileNavVisible && !isMenuOpen
            ? '-translate-y-full md:translate-y-0'
            : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-24">
            {/* Logo — only visible when dark navbar background is active */}
            <Link
              to="/"
              className={`relative z-50 transition-opacity duration-500 hover:opacity-100 ${
                isScrolled || isProductPage || !isHomePage
                  ? 'opacity-90'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={logoFullUrl}
                alt="Luminore Jewelry"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative font-cinzel text-sm transition-colors duration-300 tracking-[0.15em] group ${
                    activeSection === link.id ? 'text-[#D1642E]' : 'text-[#C5C9C6]/80 hover:text-[#D1642E]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-[-4px] left-0 h-px bg-[#D1642E] transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Right Side: Language Switcher + CTA */}
            <div className="hidden md:flex items-center gap-6">
              {/* Language Switcher */}
              <div className="flex items-center gap-1.5" aria-label="Select language">
                {(['en', 'uk', 'ru'] as const).map((lang, i) => (
                  <span key={lang} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#C5C9C6]/30 text-xs">|</span>}
                    <button
                      onClick={() => setLanguage(lang)}
                      className={`font-cinzel text-xs tracking-[0.12em] px-1 py-1 transition-colors duration-300 ${language === lang ? 'text-[#D1642E]' : 'text-[#C5C9C6]/60 hover:text-[#C5C9C6]'}`}
                      aria-label={`Switch to ${lang === 'en' ? 'English' : lang === 'uk' ? 'Ukrainian' : 'Russian'}`}
                      aria-pressed={language === lang}
                    >
                      {lang === 'en' ? 'EN' : lang === 'uk' ? 'UA' : 'RU'}
                    </button>
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => scrollToSection('custom-order')}
                className="px-6 py-3 border border-[#D1642E] text-[#D1642E] font-cinzel text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#D1642E] hover:text-white"
              >
                {t.nav.consultation}
              </button>
            </div>

            {/* Mobile Menu Button - HIGHER z-index */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-50 p-2 text-[#C5C9C6]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span 
                  className={`block h-px bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`} 
                  style={{ width: '24px' }}
                ></span>
                <span 
                  className={`block h-px bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`} 
                  style={{ width: '18px' }}
                ></span>
                <span 
                  className={`block h-px bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`} 
                  style={{ width: isMenuOpen ? '24px' : '14px' }}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - SEPARATE from navbar, full screen overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-[#1B0D14] transition-all duration-500 ${
          isMenuOpen 
            ? 'opacity-100 visible pointer-events-auto' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-24 pb-20">
          {/* Mobile Language Switcher */}
          <div
            className="flex items-center gap-4 mb-4"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s ease'
            }}
          >
            {(['en', 'uk', 'ru'] as const).map((lang, i) => (
              <span key={lang} className="flex items-center gap-4">
                {i > 0 && <span className="text-[#C5C9C6]/30">|</span>}
                <button
                  onClick={() => { setLanguage(lang); setIsMenuOpen(false); }}
                  className={`font-cinzel text-xl ${language === lang ? 'text-[#D1642E]' : 'text-[#C5C9C6]'}`}
                  aria-pressed={language === lang}
                >
                  {lang === 'en' ? 'EN' : lang === 'uk' ? 'UA' : 'RU'}
                </button>
              </span>
            ))}
          </div>

          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="font-cinzel text-2xl text-[#C5C9C6] hover:text-[#D1642E] transition-colors tracking-[0.1em]"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.4s ease ${(index + 1) * 0.1}s`
              }}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('custom-order')}
            className="mt-8 px-8 py-4 bg-[#D1642E] text-white font-cinzel text-sm tracking-[0.15em]"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s ease 0.4s'
            }}
          >
            {t.nav.consultation}
          </button>
        </div>
      </div>
    </>
  );
}
