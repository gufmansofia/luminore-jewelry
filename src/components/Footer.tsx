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
            <svg className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
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
            <svg className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
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
