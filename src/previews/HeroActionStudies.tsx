import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeaderLogo } from '../components/HeaderLogo';
import { LanguageSelect } from '../components/LanguageSelect';
import { SavedPiecesButton } from '../components/SavedPieces';
import { useLanguage } from '../i18n';
import { localePath } from '../lib/locale-path';
import { useAutoplayFilm } from '../hooks/useAutoplayFilm';
import './hero-action-studies.css';

const variants = ['cinema', 'showcase', 'gallery', 'frame', 'graphite'] as const;
type Variant = typeof variants[number];
const copy = {
  ru: { names: ['Кино', 'Витрина', 'Галерея', 'Два действия', 'Графит'], collection: 'Коллекция', about: 'О нас', contact: 'Контакты', choose: 'Выбрать украшение', connect: 'Связаться с нами', title: 'Ювелирные украшения Luminore', alt: 'Крупные планы рук с кольцами и браслетом Luminore', pause: 'Приостановить видео', resume: 'Продолжить видео', compare: 'Пять вариантов Hero', preview: 'Предпросмотр', current: 'Главная' },
  uk: { names: ['Кіно', 'Вітрина', 'Галерея', 'Дві дії', 'Графіт'], collection: 'Колекція', about: 'Про нас', contact: 'Контакти', choose: 'Обрати прикрасу', connect: "Зв’язатися з нами", title: 'Ювелірні прикраси Luminore', alt: 'Крупні плани рук із каблучками та браслетом Luminore', pause: 'Призупинити відео', resume: 'Продовжити відео', compare: 'П’ять варіантів Hero', preview: 'Перегляд', current: 'Головна' },
  en: { names: ['Cinema', 'Showcase', 'Gallery', 'Two actions', 'Graphite'], collection: 'Collection', about: 'About', contact: 'Contact', choose: 'Explore jewellery', connect: 'Contact us', title: 'Luminore jewellery', alt: 'Close-ups of hands wearing Luminore rings and a bracelet', pause: 'Pause video', resume: 'Resume video', compare: 'Five hero directions', preview: 'Preview', current: 'Homepage' },
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    {diagonal ? <path d="M7 25 25 7M7 7h18v18" /> : <path d="M3 16h25M18 6l10 10-10 10" />}
  </svg>;
}

function Study({ variant, whiteHeader = false, homePath = '/' }: { variant: Variant; whiteHeader?: boolean; homePath?: string }) {
  const { language } = useLanguage();
  const t = copy[language];
  const portrait = variant === 'gallery';
  const dark = variant === 'cinema' || variant === 'graphite';
  const [playing, setPlaying] = useState(false);
  const media = useAutoplayFilm({
    loop: true,
    mobileQuery: '(max-width: 760px)',
    mobileSrc: '/optimized/atelier-hands-720.mp4',
    desktopSrc: portrait ? '/optimized/atelier-hands-1080.mp4' : '/optimized/atelier-hands-loop.mp4',
    mobileFallback: '/optimized/atelier-hands-motion-mobile.webp',
    desktopFallback: portrait ? '/optimized/atelier-hands-motion-desktop.webp' : '/optimized/atelier-hands-motion-landscape.webp',
    onPlaying: () => setPlaying(true),
  });
  const contact = `${localePath(homePath, language)}#contact`;
  return <section className={`ha-stage ha-${variant}${whiteHeader && variant === 'cinema' ? ' ha-cinema-white' : ''}`} aria-labelledby="ha-title" data-theme={dark ? 'dark' : 'light'}>
    <h1 id="ha-title" className="ha-sr">{t.title}</h1>
    <header className="ha-header">
      <Link to="/" className="ha-logo" aria-label="Luminore"><HeaderLogo light={dark && !(whiteHeader && variant === 'cinema')} /></Link>
      <nav className="ha-navigation" aria-label={t.collection}>
        <Link to="/collection">{t.collection}</Link>
        <a href={`${localePath(homePath, language)}#about`}>{t.about}</a>
        <a href={contact}>{t.contact}</a>
      </nav>
      <div className="ha-utilities"><SavedPiecesButton /><LanguageSelect /></div>
    </header>
    <div className="ha-content">
      <div className="ha-media" ref={media.containerRef} data-playing={playing && !media.fallback}>
        <picture className="ha-poster">
          <source media="(max-width: 760px)" srcSet="/optimized/atelier-hands-portrait-poster.jpg" />
          <img src={portrait ? '/optimized/atelier-hands-portrait-poster.jpg' : '/optimized/atelier-hands-poster.jpg'}
            alt={t.alt} width={portrait ? 720 : 1440} height={portrait ? 1280 : 810} fetchPriority="high" />
        </picture>
        <video ref={media.videoRef} autoPlay muted loop playsInline preload="auto" hidden={media.fallback} aria-hidden="true" tabIndex={-1} />
        {media.animation && <img className="ha-animation" src={media.animation} alt="" aria-hidden="true" />}
        <div className="ha-shade" aria-hidden="true" />
        {(media.active || media.paused) && (!media.fallback || media.animation || media.paused) && <button className="ha-pause" type="button"
          onClick={media.togglePause} aria-label={media.paused ? t.resume : t.pause} aria-pressed={media.paused}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {media.paused ? <path d="M4 2.5 13 8l-9 5.5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
          </svg>
        </button>}
      </div>
      <div className="ha-actions">
        <Link to="/collection" className="ha-action ha-primary"><span>{t.choose}</span><Arrow /></Link>
        <a href={contact} className="ha-action ha-secondary"><span>{t.connect}</span><Arrow diagonal /></a>
      </div>
    </div>
  </section>;
}

export function WhiteHeaderHeroPreview() {
  return <div className="hero-action-studies ha-film-capture">
    <Study variant="cinema" whiteHeader homePath="/preview/hero-white" />
  </div>;
}

export default function HeroActionStudies() {
  const [params, setParams] = useSearchParams();
  const { language } = useLanguage();
  const t = copy[language];
  const requested = params.get('variant') as Variant;
  const variant = variants.includes(requested) ? requested : variants[0];
  const whiteHeader = params.get('header') === 'white';
  const capture = params.get('capture');
  const filmOnly = capture === 'film' || capture === 'layers';
  return <main id="main-content" tabIndex={-1} className={`hero-action-studies${filmOnly ? ' ha-film-capture' : ''}${capture === 'layers' ? ' ha-layer-capture' : ''}`}>
    <Study key={`${variant}-${whiteHeader}`} variant={variant} whiteHeader={whiteHeader} />
    <nav className="ha-selector" aria-label={t.compare}>
      <span className="ha-preview-label">{t.preview}</span>
      <div className="ha-options">{variants.map((option, index) => <button type="button" key={option}
        aria-pressed={variant === option} onClick={() => { setParams({ variant: option }); window.scrollTo({ top: 0 }); }}>
        <span>{String(index + 1).padStart(2, '0')}</span>{t.names[index]}
      </button>)}</div>
      <Link to="/" className="ha-home">{t.current} ↗</Link>
    </nav>
  </main>;
}
