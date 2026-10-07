import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { collectionPath } from '../data/collections';
import { products } from '../data/products';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { catalogueCategory, filterCatalogue, PAGE_SIZE } from '../lib/catalogue';
import { CatalogueCard } from './CatalogueCard';
import { Reveal } from './Reveal';
import { useReducedMotion } from '../hooks/useMotion';
import { useRestoredScroll } from '../hooks/useRouteScroll';

type CatalogState = { activeCategory?: string; priceSort?: string; visibleCount?: number; search?: string; scrollY?: number; selectedProduct?: number };

// A compact home selection; the complete collection retains every piece.
const HOME_PREVIEW_IDS = new Set([85, 103, 55, 79]);

function CatalogueFilter({ label, value, options, open, onToggle, onClose, onChange, price = false }: {
  label: string;
  value: string;
  options: string[][];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
  price?: boolean;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const selected = options.find(([key]) => key === value)?.[1];
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) onClose();
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open, onClose]);
  const focusSelected = () => requestAnimationFrame(() => {
    const buttons = panel.current?.querySelectorAll<HTMLButtonElement>('button');
    buttons?.[Math.max(0, options.findIndex(([key]) => key === value))]?.focus();
  });
  return <div ref={root} className={`catalogue-filter${price ? ' catalogue-filter--price' : ''}`}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onClose(); }}
    onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); onClose(); trigger.current?.focus(); } }}>
    <button ref={trigger} type="button" className="catalogue-filter-trigger" aria-expanded={open} aria-controls={`${id}-options`} aria-labelledby={`${id}-label ${id}-value`} onClick={onToggle}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (!open) onToggle(); focusSelected(); } }}>
      <span className="catalogue-filter-label" id={`${id}-label`}>{label}</span>
      <span className="catalogue-filter-value" id={`${id}-value`}>{selected}</span>
      <svg className="catalogue-filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>
    </button>
    <div ref={panel} id={`${id}-options`} className="catalogue-filter-options" role="group" aria-labelledby={`${id}-label`} hidden={!open}
      onKeyDown={event => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next]?.focus();
      }}>
      {options.map(([key, option]) => <button type="button" key={key} className="catalogue-filter-option" aria-pressed={value === key} onClick={() => { onChange(key); onClose(); trigger.current?.focus(); }}>
        <span>{option}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4 10-10" /></svg>
      </button>)}
    </div>
  </div>;
}

export function Products({categoryKey='all',page=1,paginated=false,title,intro}:{categoryKey?:string;page?:number;paginated?:boolean;title?:string;intro?:string}) {
  const { t, language: l } = useLanguage();
  const location = useLocation();
  const navigation = useNavigationType();
  const restoredScroll = useRestoredScroll();
  const navigate=useNavigate();
  const storageKey = `luminore-catalog:${location.pathname}`;
  const saved = useMemo(() => {
    let value: CatalogState = {};
    try { value = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch {}
    return navigation === 'PUSH' && location.state?.restoreFilters
      ? { ...value, ...location.state.catalog } as CatalogState
      : { ...location.state?.catalog, ...value } as CatalogState;
  }, [location.key]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(catalogueCategory(categoryKey));
  const [sort, setSort] = useState('all');
  const [openFilter, setOpenFilter] = useState<'category' | 'price' | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const animations = Array.from(gridRef.current?.children ?? []).map((node, index) => node.animate(
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 380, delay: Math.min(index, 5) * 35, easing: 'cubic-bezier(.2,.7,.2,1)' }
    ));
    return () => animations.forEach(animation => animation.cancel());
  }, [category, sort, search, reduced]);
  const pick = (en: string, ru: string, uk: string) => choose(l, en, ru, uk);
  const categories = [['all', t.products.all], ['Rings', t.products.rings], ['Earrings', t.products.earrings], ['Pendants', t.products.pendants], ['Bracelets', t.products.bracelets], ['Necklaces', t.products.necklaces]];
  const filtered = useMemo(() => filterCatalogue(products, search, category, sort), [search, category, sort]);
  const defaultView = !search && category === categoryKey && sort === 'all';
  const pageStart = paginated && defaultView ? (page - 1) * PAGE_SIZE : 0;
  const previewProducts = defaultView ? filtered.filter(product => HOME_PREVIEW_IDS.has(product.id)) : filtered;
  const shown = paginated ? filtered.slice(pageStart, pageStart + visibleCount) : previewProducts.slice(0, 4);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const base = collectionPath(categoryKey);
  const catalog = { activeCategory: category, priceSort: sort, visibleCount, search };
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(catalog)); } catch {}
  }, [storageKey, category, sort, visibleCount, search]);
  const savePosition = (selectedProduct: number) => { try { sessionStorage.setItem(storageKey, JSON.stringify({ ...catalog, selectedProduct, scrollY: window.scrollY })); } catch {} };
  const reset = () => { setSearch(''); setCategory(categoryKey); setSort('all'); setVisibleCount(PAGE_SIZE); searchRef.current?.focus(); };
  useEffect(() => {
    if (!location.state?.returnToCatalog && !location.state?.restoreFilters && restoredScroll === undefined) return;
    setSearch(saved.search ?? ''); setCategory(paginated ? categoryKey : catalogueCategory(saved.activeCategory ?? categoryKey)); setSort(saved.priceSort ?? 'all'); setVisibleCount(Math.max(PAGE_SIZE,saved.visibleCount ?? PAGE_SIZE));
    if (restoredScroll !== undefined || location.state?.restoreFilters) return;
    const timer = setTimeout(() => {
      const top = sectionRef.current ? sectionRef.current.getBoundingClientRect().top + window.scrollY - 96 : 0;
      window.scrollTo({ top: saved.scrollY ?? top, behavior: 'instant' });
      if (saved.selectedProduct) gridRef.current?.querySelector<HTMLAnchorElement>(`a[href$="/product/${saved.selectedProduct}"]`)?.focus({preventScroll:true});
    }, 150);
    return () => clearTimeout(timer);
  }, [location.key]);
  const loadMore = () => {
    const firstNew = shown.length;
    setVisibleCount(count => count + PAGE_SIZE);
    requestAnimationFrame(() => gridRef.current?.querySelectorAll<HTMLAnchorElement>('a')[firstNew]?.focus({ preventScroll: true }));
  };
  const pagePath = (number: number) => number === 1 ? base : `${base}/page/${number}`;
  const scrollToResults = () => requestAnimationFrame(() => {
    if (paginated && gridRef.current && gridRef.current.getBoundingClientRect().top < 140) {
      gridRef.current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
  const Heading = paginated ? 'h1' : 'h2';
  return <section id="products" ref={sectionRef} data-theme="light" className={`catalogue-section${paginated ? ' catalogue-section--full' : ''}`} aria-labelledby="catalogue-title">
    <div className="catalogue-container">
      <Reveal><header className="catalogue-heading">
        <Heading id="catalogue-title">{title || <>{t.products.headline1}<br /><span>{t.products.headline2}</span></>}</Heading>
        <p>{intro || t.products.description}</p>
      </header></Reveal>
      <div className="catalogue-tools">
        <div className="catalogue-search">
          <label className="sr-only" htmlFor="product-search">{pick('Search jewellery', 'Поиск украшений', 'Пошук прикрас')}</label>
          <input id="product-search" ref={searchRef} type="search" value={search} placeholder={paginated&&categoryKey!=='all'?pick('Search this category…','Поиск в этой категории…','Пошук у цій категорії…'):pick('Search the collection…', 'Поиск по всему каталогу…', 'Пошук у всьому каталозі…')} onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); if (e.target.value.trim()&&!paginated) setCategory('all'); }} />
          {search && <button className="text-button search-clear" onClick={reset} aria-label={pick('Clear search and filters', 'Очистить поиск и фильтры', 'Очистити пошук і фільтри')}>{pick('Clear', 'Очистить', 'Очистити')}</button>}
        </div>
      </div>
      <div className="catalogue-filter-row">
        <CatalogueFilter label={t.products.category} value={category} options={categories} open={openFilter === 'category'} onToggle={() => setOpenFilter(openFilter === 'category' ? null : 'category')} onClose={() => setOpenFilter(current => current === 'category' ? null : current)} onChange={value => { if(paginated){navigate(collectionPath(value),{state:{restoreFilters:true,catalog:{...catalog,activeCategory:value}}});return;}setCategory(value); setVisibleCount(PAGE_SIZE); }} />
        <CatalogueFilter price label={t.products.priceSort} value={sort} options={[["all", t.products.priceSortAll], ["low-to-high", t.products.priceSortLowHigh], ["high-to-low", t.products.priceSortHighLow]]} open={openFilter === 'price'} onToggle={() => setOpenFilter(openFilter === 'price' ? null : 'price')} onClose={() => setOpenFilter(current => current === 'price' ? null : current)} onChange={value => { setSort(value); setVisibleCount(PAGE_SIZE); scrollToResults(); }} />

      </div>

      {filtered.length === 0 && <div className="catalogue-empty"><p>{pick(`No matches for “${search.trim()}”${category !== 'all' ? ' in this category' : ''}.`, `По запросу «${search.trim()}»${category !== 'all' ? ' в этой категории' : ''} ничего не найдено.`, `За запитом «${search.trim()}»${category !== 'all' ? ' у цій категорії' : ''} нічого не знайдено.`)}</p><button className="outline-button" onClick={reset}>{pick('Reset search and filters', 'Сбросить поиск и фильтры', 'Скинути пошук і фільтри')}</button></div>}
      <div ref={gridRef} className={`catalogue-grid${paginated ? '' : ' catalogue-grid--preview'}`} id="catalogue-grid">{shown.map(p => <CatalogueCard key={p.id} product={p} state={{ catalogPath: location.pathname, catalog: { ...catalog, selectedProduct: p.id } }} onOpen={() => savePosition(p.id)} />)}</div>
      {paginated && filtered.length > 0 && <div className="catalogue-pagination"><p role="status" aria-atomic="true">{pick(`Showing ${pageStart+1}–${pageStart+shown.length}`, `Показано ${pageStart+1}–${pageStart+shown.length}`, `Показано ${pageStart+1}–${pageStart+shown.length}`)}</p>{!defaultView && shown.length < filtered.length && <button className="outline-button" aria-controls="catalogue-grid" onClick={loadMore}>{t.products.showMore}</button>}</div>}
      {paginated && defaultView && pageCount>1 && <nav className="catalogue-page-links" aria-label={pick('Collection pages','Страницы коллекции','Сторінки колекції')}>
        {page>1 ? <Link className="catalogue-page-mobile" to={pagePath(page-1)} rel="prev">{pick('Previous','Назад','Назад')}</Link> : <span className="catalogue-page-mobile" aria-disabled="true">{pick('Previous','Назад','Назад')}</span>}
        <span className="catalogue-page-mobile catalogue-page-current" aria-current="page" aria-label={pick(`Page ${page} of ${pageCount}`,`Страница ${page} из ${pageCount}`,`Сторінка ${page} із ${pageCount}`)}>{page} / {pageCount}</span>
        {Array.from({length:pageCount},(_,i)=><Link className="catalogue-page-number" key={i} to={pagePath(i+1)} aria-label={pick(`Page ${i+1}`,`Страница ${i+1}`,`Сторінка ${i+1}`)} aria-current={page===i+1?'page':undefined}>{i+1}</Link>)}
        {page<pageCount ? <Link className="catalogue-page-mobile" to={pagePath(page+1)} rel="next">{pick('Next','Далее','Далі')}</Link> : <span className="catalogue-page-mobile" aria-disabled="true">{pick('Next','Далее','Далі')}</span>}
      </nav>}
      {!paginated && <div className="catalogue-pagination"><Link to="/collection" className="outline-button">{pick('Complete Collection','Вся коллекция','Уся колекція')}</Link></div>}
    </div>
  </section>;
}
