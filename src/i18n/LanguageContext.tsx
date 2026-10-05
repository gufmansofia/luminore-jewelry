import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language, Translations } from './translations';
import { translations } from './translations';
import { localePath } from '../lib/locale-path';
import { rememberLanguagePosition } from '../hooks/useRouteScroll';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

const LANGUAGE_CYCLE: Language[] = ['en', 'uk', 'ru'];

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((lang: Language) => {
    if (typeof window === 'undefined') { setLanguageState(lang); return; }
    try { localStorage.setItem('luminore-language', lang); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    const destination = localePath(url.pathname, lang) + url.search + url.hash;
    rememberLanguagePosition(destination);
    window.location.assign(destination);
  }, []);

  const toggleLanguage = useCallback(() => {
    const currentIndex = LANGUAGE_CYCLE.indexOf(language);
    const nextIndex = (currentIndex + 1) % LANGUAGE_CYCLE.length;
    setLanguage(LANGUAGE_CYCLE[nextIndex]);
  }, [language, setLanguage]);

  // The URL is authoritative, so shared links and pre-rendered HTML use the same language.
  React.useEffect(() => { document.documentElement.lang = language; }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
