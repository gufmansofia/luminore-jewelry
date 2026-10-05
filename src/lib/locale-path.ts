import type { Language } from '../i18n/translations';

export const languages: Language[] = ['en', 'ru', 'uk'];
export function pathLanguage(path: string): Language {
  return /^\/ru(?:\/|$)/.test(path) ? 'ru' : /^\/uk(?:\/|$)/.test(path) ? 'uk' : 'en';
}
export function basePath(path: string) {
  return path.replace(/^\/(?:ru|uk)(?=\/|$)/, '') || '/';
}
export function localePath(path: string, language: Language) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const clean = basePath(path);
  return language === 'en' ? clean : `/${language}${clean === '/' ? '' : clean}`;
}
export function initialLanguage(): Language {
  return typeof window === 'undefined' ? 'en' : pathLanguage(window.location.pathname);
}
