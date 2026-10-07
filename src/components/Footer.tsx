import { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import {useDialog} from '../hooks/useDialog';
import {choose} from '../lib/product-copy';
import { useLanguage } from '../i18n';

import {information} from '../data/information';
import {HeaderLogo} from './HeaderLogo';

const TELEGRAM_LINK = 'https://t.me/luminore_jewelry';
const WHATSAPP_LINK = 'https://wa.me/421940600708';

function InfoPopup({ onClose, language, infoKey }: { onClose: () => void; language: string; infoKey: string }) {
  const dialogRef = useDialog(true, onClose);
  const lang = language === 'ru' ? 'ru' : language === 'uk' ? 'uk' : 'en';
  const content = information[infoKey]?.[lang] || information.delivery[lang];

  return (
    <div
      ref={dialogRef}
      data-theme="light"
      role="dialog" aria-modal="true" aria-labelledby="info-title" tabIndex={-1}
      className="info-dialog fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm"></div>

      {/* Popup */}
      <div
        className="info-dialog-panel relative bg-white border border-silver/15 max-w-lg max-h-[85vh] overflow-y-auto w-full animate-[fadeInUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="info-dialog-heading">
        <h3 id="info-title">{content.title}</h3>
        <button
          onClick={onClose}
          className="info-dialog-close w-11 h-11 flex items-center justify-center"
          aria-label={choose(language as 'en'|'ru'|'uk', 'Close', 'Закрыть', 'Закрити')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </header>
        <div className="info-dialog-content">
        {/* Text */}
        {content.paragraphs.map(text=><p key={text} className="font-body leading-relaxed mb-5">{text}</p>)}
        <Link className="text-button" to={`/information/${infoKey}`} onClick={onClose}>{choose(lang,'Open full page','Открыть страницу','Відкрити сторінку')} →</Link>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/15"></div>
          <span className="font-body text-sm text-white/40">
            {choose(lang,'Message us','Напишите нам','Напишіть нам')}
          </span>
          <div className="flex-1 h-px bg-white/15"></div>
        </div>

        {/* Messenger buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white/20 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
          >
            <span className="font-display text-sm text-white/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
              Telegram
            </span>
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white/20 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group"
          >
            <span className="font-display text-sm text-white/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
              WhatsApp
            </span>
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

export function Footer({theme='dark'}:{theme?:'dark'|'light'}) {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [showInfoPopup, setShowInfoPopup] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      setShowInfoPopup(key);
    };
    window.addEventListener('luminore:open-info', handler);
    return () => window.removeEventListener('luminore:open-info', handler);
  }, []);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'about', label: t.nav?.about || 'О нас' },
    { id: 'products', label: t.nav?.collection || 'Коллекция' },
    { id: 'custom-order', label: t.nav?.consultation || 'Индивидуальный заказ' },
    { id: 'blog', label: t.nav?.blog || 'Блог' },
    { id: 'contact', label: t.nav?.contact || 'Контакты' },
  ];

  const infoLinks = [
    { key: 'delivery', label: t.footer.delivery },
    { key: 'warranty', label: t.footer.warranty },
    { key: 'care', label: t.footer.care },
    { key: 'privacy', label: t.footer.privacy },
  ];

  return (
    <>
      <footer
        ref={footerRef}
        data-theme={theme}
        className={`site-footer ${theme==='light'?'site-footer--light':''} relative bg-ink overflow-hidden`}
      >
        {/* Texture overlay */}
        <div className="footer-texture absolute inset-0 opacity-[0.03]" aria-hidden="true" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>

        <div className="footer-inner relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className={`footer-grid grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Brand Column */}
            <div className="footer-brand-block lg:col-span-1 space-y-6">
              <Link
                to="/" onClick={()=>window.scrollTo({top:0})}
                className="footer-brand block hover:opacity-80 transition-opacity"
                aria-label="Luminore"
              >
                <HeaderLogo light={theme==='dark'} />
              </Link>
              <p className="font-body text-silver/70 text-sm leading-relaxed">
                {t.footer.description}
              </p>
            </div>

            {/* Navigation Column */}
            <div className="footer-disclosure space-y-6" data-open={!!expanded.navigation}>
              <h2
                className="font-display text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                <span className="footer-desktop-label">{t.footer.navigation}</span>
                <button className="footer-toggle" type="button" aria-expanded={!!expanded.navigation} aria-controls="footer-navigation" onClick={()=>setExpanded(value=>({...value,navigation:!value.navigation}))}>{t.footer.navigation}<span aria-hidden="true">{expanded.navigation?'−':'+'}</span></button>
              </h2>
              <ul id="footer-navigation" className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.id==='products'?'/collection':link.id==='custom-order'?'/bespoke':link.id==='blog'?'/journal':`/#${link.id}`}
                      className={`relative font-body text-silver/70 transition-colors text-sm group ${link.id === 'blog' ? 'hover:underline focus-visible:underline decoration-1 underline-offset-4' : 'hover:text-accent'}`}
                    >
                      {link.label}
                      {link.id !== 'blog' && <span className="absolute bottom-0 left-0 w-0 h-px bg-action group-hover:w-full transition-all duration-300"></span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Column */}
            <div className="footer-disclosure space-y-6" data-open={!!expanded.information}>
              <h2
                className="font-display text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                <span className="footer-desktop-label">{t.footer.info}</span>
                <button className="footer-toggle" type="button" aria-expanded={!!expanded.information} aria-controls="footer-information" onClick={()=>setExpanded(value=>({...value,information:!value.information}))}>{t.footer.info}<span aria-hidden="true">{expanded.information?'−':'+'}</span></button>
              </h2>
              <ul id="footer-information" className="space-y-3">
                {infoLinks.map((item) => (
                  <li key={item.key}>
                    <Link
                      to={`/information/${item.key}`}
                      className="relative font-body text-silver/70 hover:text-accent transition-colors text-sm group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-action group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="footer-contact space-y-6">
              <h2
                className="font-display text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                {t.footer.contactHeading}
              </h2>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+421940600708" className="font-body text-silver/70 hover:text-accent transition-colors text-sm">
                    +421 940 600 708
                  </a>
                </li>
                <li>
                  <a href="mailto:jewelry@luminore.eu" className="font-body text-silver/70 hover:text-accent transition-colors text-sm">
                    jewelry@luminore.eu
                  </a>
                </li>
                <li>
                  <a href="https://t.me/luminore_jewelry" target="_blank" rel="noopener noreferrer" className="font-body text-silver/70 hover:text-accent transition-colors text-sm">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/421940600708" target="_blank" rel="noopener noreferrer" className="font-body text-silver/70 hover:text-accent transition-colors text-sm">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`pt-8 border-t border-silver/10 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="font-body text-silver/50 text-sm">
              {t.footer.copyright}
            </p>
            <div className="flex gap-6">
              <Link
                to="/information/terms"
                className="font-body text-silver/50 hover:text-accent transition-colors text-sm"
              >
                {information.terms[language].title}
              </Link>
              <Link
                to="/information/privacy"
                className="font-body text-silver/50 hover:text-accent transition-colors text-sm"
              >
                {t.footer.privacy}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Popup */}
      {showInfoPopup && (
        <InfoPopup
          onClose={() => setShowInfoPopup(null)}
          language={language}
          infoKey={showInfoPopup}
        />
      )}
    </>
  );
}
