import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const storageKey = 'luminore-route-scroll-v2';
const localeKey = 'luminore-language-position';
const positions = new Map<string, number>();
const visitedEntries = new Set<string>();
let loaded = false;

function localePosition() {
  if (typeof window === 'undefined') return;
  try {
    const value = JSON.parse(sessionStorage.getItem(localeKey) || 'null');
    if (value?.path === window.location.pathname + window.location.search && Date.now() - value.time < 60000) return value as { path:string; top:number; anchor?:string; ratio:number; time:number };
  } catch {}
}

export function rememberLanguagePosition(path: string) {
  const header = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
  const anchor = Array.from(document.querySelectorAll<HTMLElement>('#hero, main section[id], .article-chapter-heading'))
    .filter(el => el.getBoundingClientRect().top <= header + 24)
    .sort((a,b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
  const rect = anchor?.getBoundingClientRect();
  try { sessionStorage.setItem(localeKey, JSON.stringify({ path:path.split('#')[0], top:window.scrollY, anchor:window.scrollY < 80 ? undefined : anchor?.id, ratio:rect ? -rect.top / Math.max(1,rect.height) : 0, time:Date.now() })); } catch {}
}

function entryKey(key: string) {
  return typeof window === 'undefined' ? key : `${window.location.pathname}${window.location.search}:${key}`;
}

function savedPosition(key: string) {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
      for (const [entry, top] of Object.entries(saved)) {
        if (typeof top === 'number' && Number.isFinite(top) && top >= 0) positions.set(entry, top);
      }
    } catch {}
  }
  return positions.get(key);
}

export function useRestoredScroll() {
  const { key } = useLocation();
  const navigation = useNavigationType();
  return useMemo(() => {
    const translated = localePosition();
    if (translated) return translated.top;
    const loadType = typeof performance !== 'undefined' ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type : undefined;
    return navigation === 'POP' && (key !== 'default' || visitedEntries.has(entryKey(key)) || loadType === 'reload' || loadType === 'back_forward') ? savedPosition(entryKey(key)) : undefined;
  }, [key, navigation]);
}

// Browser history restores the actual entry, including its hash, rather than
// sending every collection visit to the same section of the homepage.
export function RouteScrollRestoration() {
  const { key } = useLocation();
  const positionKey = entryKey(key);
  const restored = useRestoredScroll();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    visitedEntries.add(positionKey);
    let top = restored ?? window.scrollY;
    const record = () => { top = window.scrollY; };
    const save = () => {
      positions.set(positionKey, top);
      if (positions.size > 100) positions.delete(positions.keys().next().value!);
      try { sessionStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(positions))); } catch {}
    };
    window.addEventListener('scroll', record, { passive: true });
    window.addEventListener('pagehide', save);
    return () => {
      window.removeEventListener('scroll', record);
      window.removeEventListener('pagehide', save);
      save();
    };
  }, [positionKey, restored]);

  useEffect(() => {
    const translated = localePosition();
    if (restored === undefined) { window.scrollTo({ top:0, behavior:'instant' }); return; }
    // Let route effects restore catalogue filters before restoring the position.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const anchor = translated?.anchor ? document.getElementById(translated.anchor) : null;
        const top = anchor && translated ? window.scrollY + anchor.getBoundingClientRect().top + translated.ratio * anchor.getBoundingClientRect().height : restored;
        window.scrollTo({ top:Math.max(0,top), behavior:'instant' });
        if (translated) try { sessionStorage.removeItem(localeKey); } catch {}
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [key, restored]);
  return null;
}
