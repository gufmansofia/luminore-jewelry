import './index.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './i18n';
import { Navbar, Hero, HeroMobile, About, Products, Blogs, CTA, Contact, Footer } from './components';
import { ProductDetail } from './components/ProductDetail';
import { BlogPost } from './components/BlogPost';
import { BackToTop } from './components/BackToTop';
import { Testimonials } from './components/Testimonials';

function LangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language === 'uk' ? 'uk' : language === 'ru' ? 'ru' : 'en';
  }, [language]);
  return null;
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-1 bg-[#1B0D14]">
      <div className="w-16 h-px bg-[#C5C9C6]/10"></div>
      <div className="mx-4 w-2 h-2 border border-[#D1642E]/30 rotate-45"></div>
      <div className="w-16 h-px bg-[#C5C9C6]/10"></div>
    </div>
  );
}

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Small delay to let the page render before scrolling
      setTimeout(() => {
        const el = document.getElementById(state.scrollTo!);
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      // Clear the state so it doesn't re-scroll on re-renders
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HeroMobile />
        <About />
        <Products />
        <CTA />
        <SectionDivider />
        <Testimonials />
        <Blogs />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <LangSync />
      <BrowserRouter>
        <div className="animate-page-enter">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
