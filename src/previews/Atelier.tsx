import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import './atelier.css';
import { About, Products, CTA, Blogs, Contact, Footer } from '../components';
import { Testimonials } from '../components/Testimonials';
import { BackToTop } from '../components/BackToTop';

const copy = {
  en: { about: 'About', collection: 'Collection', journal: 'Journal', contact: 'Contact', eyebrow: 'THE LUMINORE ATELIER', line1: 'A piece of you.', line2: 'For ', emphasis: 'a lifetime.', description: 'Fine diamonds, thoughtfully chosen.', description2: 'Jewelry made personal.', discover: 'Discover the collection', create: 'Create your own', closing: 'Made to become ', yours: 'yours' },
  uk: { about: 'Про нас', collection: 'Колекція', journal: 'Журнал', contact: 'Контакти', eyebrow: 'АТЕЛЬЄ LUMINORE', line1: 'Частинка вас.', line2: 'На ', emphasis: 'все життя.', description: 'Виняткові діаманти, обрані з турботою.', description2: 'Прикраси з вашим характером.', discover: 'Відкрити колекцію', create: 'Створити свою прикрасу', closing: 'Створено, щоб стати ', yours: 'вашим' },
  ru: { about: 'О нас', collection: 'Коллекция', journal: 'Журнал', contact: 'Контакты', eyebrow: 'АТЕЛЬЕ LUMINORE', line1: 'Частичка вас.', line2: 'На ', emphasis: 'всю жизнь.', description: 'Исключительные бриллианты, выбранные с заботой.', description2: 'Украшения с вашим характером.', discover: 'Открыть коллекцию', create: 'Создать своё украшение', closing: 'Создано, чтобы стать ', yours: 'вашим' },
};

export default function Atelier() {
  const { language, setLanguage } = useLanguage();
  const t = copy[language];
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Luminore — The Atelier';
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => { document.title = previousTitle; robots.remove(); };
  }, []);
  return (
    <>
    <div className="atelier" data-theme="light">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500&display=swap" />
      <header className="atelier-header">
        <details className="atelier-mobile-menu">
          <summary aria-label={language === 'en' ? 'Menu' : 'Меню'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg></summary>
          <nav aria-label="Mobile navigation" onClick={e => { const menu = e.currentTarget.closest('details'); if (menu) menu.open = false; }}>
            <a href="#about">{t.about}</a>
            <a href="#products">{t.collection}</a>
            <a href="#blog">{t.journal}</a>
            <a href="#contact">{t.contact}</a>
          </nav>
        </details>
        <nav className="atelier-nav atelier-nav-left" aria-label="Collection navigation">
          <a href="#about">{t.about}</a>
          <a href="#products">{t.collection}</a>
        </nav>
        <Link className="atelier-wordmark" to="/preview/atelier" aria-label="Luminore atelier home">LUMINORE</Link>
        <nav className="atelier-nav atelier-nav-right" aria-label="Information navigation">
          <a href="#blog">{t.journal}</a>
          <a href="#contact">{t.contact}</a>
          <select aria-label="Language" value={language} onChange={e => setLanguage(e.target.value as 'en' | 'uk' | 'ru')}>
            <option value="en">EN</option><option value="uk">UA</option><option value="ru">RU</option>
          </select>
        </nav>
      </header>
      <div>
        <section className="atelier-hero" aria-labelledby="atelier-title">
          <div className="atelier-photo"><img src="/atelier-hero.png" alt="A solitaire diamond ring on textured Luminore stationery" fetchPriority="high" /></div>
          <div className="atelier-story">
            <p className="atelier-eyebrow">{t.eyebrow}</p>
            <h1 id="atelier-title">{t.line1}<br />{t.line2}<em>{t.emphasis}</em></h1>
            <p className="atelier-description">{t.description}<br />{t.description2}</p>
            <a className="atelier-primary" href="#products">{t.discover}</a>
            <a className="atelier-bespoke" href="#custom-order">{t.create}</a>
          </div>
        </section>
        <div className="atelier-closing"><h2>{t.closing}<em>{t.yours}</em></h2></div>
      </div>
    </div>
    <main>
      <About />
      <Products />
      <CTA />
      <Testimonials />
      <Blogs />
      <Contact />
    </main>
    <Footer />
    <BackToTop />
    </>
  );
}
