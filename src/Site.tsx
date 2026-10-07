import { SavedPiecesProvider } from './components/SavedPieces';
import { Journal } from './components/Blogs';
import {Seo} from './components/Seo';
import {NotFound} from './components/NotFound';
import { AtelierHero } from './previews/Atelier';
import { useEffect } from 'react';
import Atelier from './previews/Atelier';
import HeroDirections from './previews/HeroDirections';
import HeroActionStudies, { WhiteHeaderHeroPreview } from './previews/HeroActionStudies';
import {InformationPage} from './components/InformationPage';
import { CollectionPage } from './components/CollectionPage';
import { BespokePage } from './components/BespokePage';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLanguage } from './i18n';
import { About, Products, Blogs, CTA, Contact, Footer } from './components';
import { ProductDetail } from './components/ProductDetail';
import { BlogPost } from './components/BlogPost';
import { BackToTop } from './components/BackToTop';
import { Testimonials } from './components/Testimonials';
import { CategoryPreview } from './components/CategoryPreview';
import { ProductSpotlight } from './components/ProductSpotlight';
import { RouteScrollRestoration, useRestoredScroll } from './hooks/useRouteScroll';

function SkipLink(){const {language}=useLanguage();return <a className="skip-link" href="#main-content">{language==='ru'?'Перейти к содержимому':language==='uk'?'Перейти до вмісту':'Skip to content'}</a>}

export function LangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language === 'uk' ? 'uk' : language === 'ru' ? 'ru' : 'en';
  }, [language]);
  return null;
}


function HomePage({ previewWhiteHero = false, previewQuietHero = false, spotlightFirst = false }: { previewWhiteHero?: boolean; previewQuietHero?: boolean; spotlightFirst?: boolean }) {
  const location = useLocation();
  const restoredScroll = useRestoredScroll();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const target = state?.scrollTo || location.hash.slice(1);
    if (target && restoredScroll === undefined && !location.state?.returnToCatalog) {
      // Small delay to let the page render before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth' });
        }
      }, 100);
      // Clear the state so it doesn't re-scroll on re-renders
      window.history.replaceState({...window.history.state, usr: {...location.state, scrollTo: undefined}}, '');
      return () => clearTimeout(timer);
    }
  }, [location.state, location.hash, restoredScroll]);

  return (
    <>
      {previewWhiteHero ? <WhiteHeaderHeroPreview /> : <AtelierHero homePath={previewQuietHero ? '/preview/hero-quiet' : '/'} film="hands" quiet mobilePhoto captureLayers={previewQuietHero && new URLSearchParams(location.search).get('capture') === 'layers'} />}
      <main id="main-content" tabIndex={-1} className={`atelier-content${spotlightFirst ? ' atelier-content--spotlight-first' : ''}`}>
        {spotlightFirst ? <><ProductSpotlight /><CategoryPreview /></> : <><CategoryPreview /><ProductSpotlight /></>}
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

export function SiteContent() {
  return (
        <SavedPiecesProvider>
        <RouteScrollRestoration />
        <Seo/>
        <SkipLink/>
        <div className="animate-page-enter">
          <Routes>
            <Route path="/" element={<HomePage spotlightFirst />} />
            <Route path="/preview/atelier" element={<Atelier />} />
            <Route path="/preview/hero" element={<HeroDirections />} />
            <Route path="/preview/hero-wide" element={<HeroDirections wide />} />
            <Route path="/preview/hero-new" element={<HeroDirections fresh />} />
            <Route path="/preview/hero-current" element={<HomePage />} />
            <Route path="/preview/hero-white" element={<HomePage previewWhiteHero />} />
            <Route path="/preview/hero-quiet" element={<HomePage previewQuietHero />} />
            <Route path="/preview/hero-actions" element={<HeroActionStudies />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/collection/*" element={<CollectionPage />} />
            <Route path="/collections/:category/*" element={<CollectionPage />} />
            <Route path="/information/:topic" element={<InformationPage/>} />
            <Route path="/bespoke" element={<BespokePage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
        </SavedPiecesProvider>
  );
}
