import { useState } from 'react';
import {LanguageSelect} from '../components/LanguageSelect';
import { HeaderLogo } from '../components/HeaderLogo';
import { Link } from 'react-router-dom';
import { localePath } from '../lib/locale-path';
import { useLanguage } from '../i18n';
import './atelier.css';
import './hero-directions.css';
import { About, Products, CTA, Blogs, Contact, Footer } from '../components';
import { Testimonials } from '../components/Testimonials';
import { BackToTop } from '../components/BackToTop';
import { SavedPiecesButton } from '../components/SavedPieces';
import { useReveal } from '../hooks/useMotion';
import { AtelierHeroMedia } from './AtelierHeroMedia';
import { HeroLoopMedia, type HeroStudy } from './HeroLoopMedia';
import { CategoryPreview } from '../components/CategoryPreview';

const copy = {
  en: { about: 'About', collection: 'Collection', journal: 'Journal', contact: 'Contact', line1: 'Diamond', line2: 'jewellery.', description: 'Natural or lab-grown diamonds.', description2: 'Choose from the collection, or create a piece with us.', discover: 'Explore jewellery', create: 'Discuss your design', imageAlt: 'A model wearing Luminore diamond rings on both hands', closing: 'Made to become ', yours: 'yours' },
  uk: { about: 'Про нас', collection: 'Колекція', journal: 'Журнал', contact: 'Контакти', line1: 'Прикраси', line2: 'з діамантами.', description: 'Природні або лабораторні діаманти.', description2: 'Оберіть прикрасу з колекції або створіть її разом із нами.', discover: 'Обрати прикрасу', create: 'Обговорити свій дизайн', imageAlt: 'Діамантові каблучки Luminore на руках моделі', closing: 'Створено, щоб стати ', yours: 'вашим' },
  ru: { about: 'О нас', collection: 'Коллекция', journal: 'Журнал', contact: 'Контакты', line1: 'Украшения', line2: 'с бриллиантами.', description: 'Натуральные или лабораторные бриллианты.', description2: 'Выберите украшение из коллекции или создайте его вместе с нами.', discover: 'Выбрать украшение', create: 'Обсудить свой дизайн', imageAlt: 'Бриллиантовые кольца Luminore на руках модели', closing: 'Создано, чтобы стать ', yours: 'вашим' },
};

export default function Atelier() {
  return (
    <>
    <AtelierHero />
    <main id="main-content" tabIndex={-1} className="atelier-content">
      <CategoryPreview />
      <About />
      <Products />
      <CTA />
      <Testimonials />
      <Blogs />
      <Contact />
    </main>
    <Footer theme="light" />
    <BackToTop />
    </>
  );
}

export type HeroDirection = 'minimal' | 'editorial' | 'cinema' | 'wide-immersive' | 'wide-caption' | 'wide-center' | 'sharp-macro' | 'sharp-triptych' | 'sharp-duo';

export function AtelierHero({ homePath = "/preview/atelier", direction }: { homePath?: string; direction?: HeroDirection }) {
  const { language } = useLanguage();
  const t = copy[language];
  const heroMotion = useReveal<HTMLElement>();
  const [menuOpen,setMenuOpen]=useState(false);
  const wide = direction?.startsWith('wide-') ?? false;
  const dark = direction === 'cinema' || direction === 'wide-immersive' || direction === 'wide-center';
  const study = direction?.startsWith('sharp-') ? direction.slice(6) as HeroStudy : undefined;
  return (
    <div id="hero" className={`atelier${direction ? ` atelier--${direction}` : ''}${wide ? ' atelier--wide' : ''}${study ? ' atelier--sharp' : ''}`} data-theme={dark ? 'dark' : 'light'}>

      <div className="atelier-header-bar">
      <header className="atelier-header">
        <details className="atelier-mobile-menu" onToggle={event=>setMenuOpen(event.currentTarget.open)} onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}}}>
          <summary aria-label={menuOpen ? (language==='en'?'Close menu':language==='ru'?'Закрыть меню':'Закрити меню') : (language==='en'?'Open menu':language==='ru'?'Открыть меню':'Відкрити меню')} aria-expanded={menuOpen}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d={menuOpen?"m6 6 12 12M6 18 18 6":"M3 6h18M3 12h18M3 18h18"} /></svg></summary>
          <nav aria-label={language==='ru'?'Мобильное меню':language==='uk'?'Мобільне меню':'Mobile navigation'} onClick={e => { const link=(e.target as HTMLElement).closest('a'); if (!link) return; const menu = e.currentTarget.closest('details'); if (menu) menu.open = false; const target=link?.hash?document.getElementById(link.hash.slice(1)):null; if(target)requestAnimationFrame(()=>{target.tabIndex=-1;target.focus({preventScroll:true});}); }}>
            <a href={direction ? `${localePath('/', language)}#about` : '#about'}>{t.about}</a>
            <Link to="/collection">{t.collection}</Link>
            <a href={direction ? `${localePath('/', language)}#blog` : '#blog'}>{t.journal}</a>
            <a href={direction ? `${localePath('/', language)}#contact` : '#contact'}>{t.contact}</a>
            <SavedPiecesButton text />
          </nav>
        </details>
        <Link className="atelier-wordmark" to={homePath} aria-label="Luminore" onClick={() => window.scrollTo({ top: 0 })}><HeaderLogo light={dark} /></Link>
        <nav className="atelier-nav" aria-label={language==='ru'?'Основная навигация':language==='uk'?'Основна навігація':'Main navigation'}>
          <a href={direction ? `${localePath('/', language)}#about` : '#about'}>{t.about}</a>
          <Link to="/collection">{t.collection}</Link>
          <a href={direction ? `${localePath('/', language)}#blog` : '#blog'}>{t.journal}</a>
          <a href={direction ? `${localePath('/', language)}#contact` : '#contact'}>{t.contact}</a>
        </nav>
        <div className="atelier-language">
          <SavedPiecesButton />
          <LanguageSelect/>
        </div>
      </header>
      </div>
      <div>
        <section ref={heroMotion.ref} data-reveal={heroMotion.phase} className="atelier-hero" aria-labelledby="atelier-title">
          <div className="atelier-story">
            {direction && <p className="hero-direction-eyebrow">{language === 'ru' ? 'Luminore · Ювелирное ателье' : language === 'uk' ? 'Luminore · Ювелірне ательє' : 'Luminore · Jewellery atelier'}</p>}
            <h1 id="atelier-title"><span className="hero-line"><span>{t.line1}</span></span><span className="hero-line"><em>{t.line2}</em></span></h1>
            <p className="atelier-description">{t.description}<br />{t.description2}</p>
            {direction === 'editorial' && <p className="hero-direction-caption">{language === 'ru' ? 'Коллекция и индивидуальный дизайн' : language === 'uk' ? 'Колекція та індивідуальний дизайн' : 'The collection & your own creation'}</p>}
          </div>
          {direction ? <HeroLoopMedia alt={t.imageAlt} wide={wide} study={study}
            pauseLabel={language === 'ru' ? 'Приостановить видео' : language === 'uk' ? 'Призупинити відео' : 'Pause video'}
            resumeLabel={language === 'ru' ? 'Продолжить видео' : language === 'uk' ? 'Продовжити відео' : 'Resume video'} />
            : <AtelierHeroMedia alt={t.imageAlt} skipLabel={language === 'ru' ? 'Пропустить видео' : language === 'uk' ? 'Пропустити відео' : 'Skip video'} />}
          <div className="atelier-actions" onClick={event => {
            const link = (event.target as HTMLElement).closest('a');
            const target = link?.hash ? document.getElementById(link.hash.slice(1)) : null;
            if (target) requestAnimationFrame(() => {
              target.tabIndex = -1;
              target.focus({ preventScroll: true });
            });
          }}>
            <Link className="atelier-action" to="/collection">
              <span>{t.discover}</span><img src="/icons/arrow-right.svg" width={32} height={32} alt="" aria-hidden="true" />
            </Link>
            <a className="atelier-action" href={direction ? localePath('/bespoke', language) : '#custom-order'}>
              <span>{t.create}</span><img src="/icons/arrow-right.svg" width={32} height={32} alt="" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
