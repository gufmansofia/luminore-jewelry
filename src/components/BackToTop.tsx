import {useLanguage} from '../i18n';
import { useState, useEffect } from 'react';

export function BackToTop() {
  const {language}=useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const top = window.scrollY;
        const blocked = !!document.querySelector('[role="dialog"]') || Array.from(document.querySelectorAll('.guided-enquiry,.enquiry-form,.enquiry-review,.service-strip')).some(el => {
          const rect = el.getBoundingClientRect();
          return rect.height > 0 && rect.top < innerHeight && rect.bottom > 0;
        });
        if (Math.abs(top - previous) > 4 || blocked || top < 500) {
          setVisible(top > 500 && top < previous && !blocked);
          previous = top;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector<HTMLAnchorElement>('.atelier-wordmark')?.focus({ preventScroll: true });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 w-12 h-12 bg-action border border-accent text-white flex items-center justify-center shadow-lg shadow-accent/25 hover:bg-action-hover transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      tabIndex={visible?0:-1} aria-hidden={!visible}
      aria-label={language==='ru'?'Наверх':language==='uk'?'Нагору':'Back to top'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
