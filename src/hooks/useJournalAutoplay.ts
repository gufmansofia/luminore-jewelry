import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ARTICLE_INTERVAL_MS = 3000;

/** Advance the mobile row, restarting its countdown after manual browsing. */
export function useJournalAutoplay(enabled: boolean, paused = false) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const firstMount = useRef(true);
  const storageKey = `luminore-journal:${location.pathname}:${location.key}`;

  useEffect(() => {
    const track = ref.current;
    if (!enabled || !track) return;

    const mobile = window.matchMedia('(max-width: 700px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let pressed = false;
    let touching = false;
    let keyboardFocused = false;
    let automaticScroll = false;
    let pauseUntil = 0;
    const positions = () => {
      const max = track.scrollWidth - track.clientWidth;
      const left = track.getBoundingClientRect().left;
      const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      return Array.from(track.children).map(card => Math.max(0, Math.min(max, card.getBoundingClientRect().left-left+track.scrollLeft-padding)));
    };
    const currentIndex = () => positions().reduce((nearest,position,index,all) => Math.abs(position-track.scrollLeft)<Math.abs(all[nearest]!-track.scrollLeft)?index:nearest,0);
    const save = () => { if(mobile.matches && track.isConnected && track.clientWidth > 0)try { sessionStorage.setItem(storageKey,String(currentIndex())); } catch {} };
    const restore = requestAnimationFrame(() => {
      if(firstMount.current && mobile.matches) {
        try {
          const stored=sessionStorage.getItem(storageKey);
          if(stored!==null) { track.scrollTo({left:positions()[Number(stored)]??0,behavior:'instant'});pauseUntil=Date.now()+8000; }
        } catch {}
      }
      firstMount.current=false;
      schedule();
    });
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settled: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      clearTimeout(timer);
      if (!paused && visible && mobile.matches && !motion.matches && !document.hidden && !pressed && !touching && !keyboardFocused) {
        timer = setTimeout(advance, Math.max(ARTICLE_INTERVAL_MS,pauseUntil-Date.now()));
      }
    };

    const advance = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const max = track.scrollWidth - track.clientWidth;
      if (cards.length < 2 || max <= 0) return;
      const targets=positions();
      const current=currentIndex();
      automaticScroll = true;
      track.scrollTo({ left: targets[(current + 1) % cards.length]!, behavior: 'smooth' });
      // Automatic motion does not restart the clock on every animation frame.
      schedule();
    };

    const interrupt = () => {
      pauseUntil=Date.now()+8000;
      if (automaticScroll) track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
      automaticScroll = false;
      clearTimeout(settled);
      schedule();
    };
    const scroll = () => {
      clearTimeout(settled);
      if (!automaticScroll) { pauseUntil=Date.now()+8000; schedule(); }
      settled = setTimeout(() => { automaticScroll = false; save(); }, 150);
    };
    const pointerDown = () => { pressed = true; keyboardFocused = false; interrupt(); };
    const pointerUp = () => { if (pressed) { pressed = false; schedule(); } };
    const touchStart = () => { touching = true; interrupt(); };
    const touchEnd = () => { if (touching) { touching = false; schedule(); } };
    const focusIn = (event: FocusEvent) => {
      keyboardFocused = (event.target as HTMLElement).matches(':focus-visible');
      schedule();
    };
    const focusOut = (event: FocusEvent) => {
      if (!track.contains(event.relatedTarget as Node | null)) {
        keyboardFocused = false;
        schedule();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.2;
      schedule();
    }, { threshold: [0, 0.2] });
    observer.observe(track);

    track.addEventListener('click', save);
    track.addEventListener('scroll', scroll, { passive: true });
    track.addEventListener('wheel', interrupt, { passive: true });
    track.addEventListener('pointerdown', pointerDown, { passive: true });
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('keydown', interrupt);
    track.addEventListener('focusin', focusIn);
    track.addEventListener('focusout', focusOut);
    window.addEventListener('pointerup', pointerUp, { passive: true });
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    window.addEventListener('touchend', touchEnd, { passive: true });
    window.addEventListener('touchcancel', touchEnd, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    mobile.addEventListener('change', schedule);
    motion.addEventListener('change', interrupt);
    return () => {
      save();
      cancelAnimationFrame(restore);
      track.removeEventListener('click',save);
      clearTimeout(timer);
      clearTimeout(settled);
      observer.disconnect();
      track.removeEventListener('scroll', scroll);
      track.removeEventListener('wheel', interrupt);
      track.removeEventListener('pointerdown', pointerDown);
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('keydown', interrupt);
      track.removeEventListener('focusin', focusIn);
      track.removeEventListener('focusout', focusOut);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchcancel', touchEnd);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      mobile.removeEventListener('change', schedule);
      motion.removeEventListener('change', interrupt);
    };
  }, [enabled, paused, storageKey]);

  return ref;
}
