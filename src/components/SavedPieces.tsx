import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { products, type Product } from '../data/products';
import { useLanguage } from '../i18n';
import { choose, localizeSpec, productName, requestDetail } from '../lib/product-copy';
import { formatCarat } from '../lib/carat';
import { readSavedPieces, SAVED_PIECES_KEY, toggleSavedPiece } from '../lib/saved-pieces';
import { useDialog } from '../hooks/useDialog';
import { ProductImage } from './ProductImage';

const validIds = new Set(products.map(p => p.id));
type SavedContext = { ids: number[]; toggle: (id: number) => void; open: () => void };
const Context = createContext<SavedContext | null>(null);
const useSaved = () => { const value = useContext(Context); if (!value) throw new Error('SavedPiecesProvider is required'); return value; };

export function HeartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
}

export function SavedPiecesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => { try { setIds(readSavedPieces(localStorage.getItem(SAVED_PIECES_KEY), validIds)); } catch {} }, []);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = (e: StorageEvent) => { if (e.key === SAVED_PIECES_KEY || e.key === null) setIds(readSavedPieces(e.newValue, validIds)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggle = (id: number) => {
    if (!validIds.has(id)) return;
    setIds(previous => {
      const next = toggleSavedPiece(previous, id);
      try { localStorage.setItem(SAVED_PIECES_KEY, JSON.stringify(next)); } catch { /* The current session still works if storage is unavailable. */ }
      return next;
    });
  };
  return <Context.Provider value={{ ids, toggle, open: () => setOpen(true) }}>{children}{open && <SavedPanel close={() => setOpen(false)} />}</Context.Provider>;
}

export function SavePieceButton({ product, text = false, onRemove }: { product: Product; text?: boolean; onRemove?: () => void }) {
  const { ids, toggle } = useSaved();
  const { language: l } = useLanguage();
  const saved = ids.includes(product.id);
  const label = choose(l, saved ? 'Remove from saved pieces' : 'Save this piece', saved ? 'Удалить из избранного' : 'Сохранить украшение', saved ? 'Видалити з обраного' : 'Зберегти прикрасу');
  return <button type="button" className={`save-piece-button${text ? ' save-piece-button--text' : ''}`} aria-pressed={saved} aria-label={`${label}: ${productName(product, l)}`} onClick={() => { toggle(product.id); if (saved) onRemove?.(); }}><HeartIcon />{text && <span>{choose(l, saved ? 'Saved to your pieces' : 'Save this piece', saved ? 'В избранном' : 'Сохранить украшение', saved ? 'В обраному' : 'Зберегти прикрасу')}</span>}</button>;
}

export function SavedPiecesButton({ text = false }: { text?: boolean }) {
  const { ids, open } = useSaved();
  const { language: l } = useLanguage();
  const label = choose(l, 'Saved pieces', 'Избранное', 'Обране');
  return <button type="button" className={`saved-trigger${text ? ' saved-trigger--text' : ''}`} aria-label={`${label} (${ids.length})`} aria-haspopup="dialog" onClick={open}><HeartIcon />{text && <span>{label}</span>}<span className="saved-count">{ids.length}</span></button>;
}

function SavedPanel({ close }: { close: () => void }) {
  const { ids } = useSaved();
  const { language: l, t } = useLanguage();
  const pick = (en: string, ru: string, uk: string) => choose(l, en, ru, uk);
  const selectedProducts = ids.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const [comparison, setComparison] = useState<number[]>(ids.slice(0, 2));
  const [comparing, setComparing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useDialog(true, close);
  const titleId = useId();
  const pair = comparison.filter(id => ids.includes(id));
  const compared = pair.map(id => products.find(p => p.id === id)!);
  const price = (p: Product) => p.priceUsd === null ? t.product.priceOnEnquiry : '$' + p.priceUsd.toLocaleString('en-US');
  useEffect(() => { if (pair.length !== 2) setComparing(false); }, [pair.length]);
  const compare = () => { setComparing(value => !value); requestAnimationFrame(() => heading.current?.focus()); };
  return createPortal(<div className="saved-overlay" data-theme="light" onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="saved-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panel} tabIndex={-1}>
      <header className="saved-heading"><div><p className="section-eyebrow">LUMINORE</p><h2 ref={heading} tabIndex={-1} id={titleId}>{comparing ? pick('Compare pieces', 'Сравнение украшений', 'Порівняння прикрас') : pick('Your saved pieces', 'Ваше избранное', 'Ваше обране')}</h2></div><button type="button" className="saved-close" onClick={close} aria-label={pick('Close saved pieces', 'Закрыть избранное', 'Закрити обране')}>×</button></header>
      {!ids.length ? <div className="saved-empty"><p>{pick('Save pieces with the heart to return to them here.', 'Нажмите на сердечко у украшения, чтобы вернуться к нему здесь.', 'Натисніть на сердечко біля прикраси, щоб повернутися до неї тут.')}</p><Link className="text-button" to="/#products" onClick={close}>{pick('Explore the collection', 'Перейти к коллекции', 'Перейти до колекції')}</Link></div> : <>
        <div className="saved-toolbar"><p role="status">{comparing ? pick('Prices and details from the catalogue', 'Цены и характеристики из каталога', 'Ціни та характеристики з каталогу') : pick(`${ids.length} saved · Select two to compare`, `В избранном: ${ids.length} · Выберите два для сравнения`, `В обраному: ${ids.length} · Оберіть два для порівняння`)}</p><button className="text-button" type="button" disabled={pair.length !== 2} onClick={compare}>{comparing && <span aria-hidden="true">←</span>}{comparing ? pick('Back to saved pieces', 'Вернуться к избранному', 'Повернутися до обраного') : pick('Compare', 'Сравнить', 'Порівняти')} {!comparing && <span aria-hidden="true">→</span>}</button></div>
        {!comparing&&<p id={`${titleId}-hint`} className="saved-help">{pick("Select up to two pieces. Deselect one to choose another.","Можно сравнить два украшения. Снимите отметку, чтобы выбрать другое.","Можна порівняти дві прикраси. Зніміть позначку, щоб обрати іншу.")}</p>}
        {comparing ? <div className="saved-comparison"><table><caption className="sr-only">{pick('Comparison of two saved pieces', 'Сравнение двух выбранных украшений', 'Порівняння двох обраних прикрас')}</caption><thead><tr>{compared.map(p => <th key={p.id} scope="col"><Link to={`/product/${p.id}`} onClick={close}>{p.images[0] && <ProductImage src={p.images[0]} alt="" sizes="(max-width:700px) 40vw, 320px" />}<span>{productName(p, l)}</span></Link></th>)}</tr></thead><tbody>
          <tr>{compared.map(p => <td key={p.id}><span>{pick('Catalogue price', 'Цена в каталоге', 'Ціна в каталозі')}</span>{price(p)}</td>)}</tr>
          <tr>{compared.map(p => <td key={p.id}><span>{t.product.naturalDiamond}</span>{t.product.priceOnEnquiry}</td>)}</tr>
          <tr>{compared.map(p => <td key={p.id}><span>{p.caratBasis === 'unconfirmed' ? pick('Listed stone weight', 'Указанный вес камней', 'Зазначена вага каменів') : p.categoryEn === 'Earrings' ? pick('Total stone weight · pair', 'Общий вес камней · пара', 'Загальна вага каменів · пара') : pick('Total stone weight', 'Общий вес камней', 'Загальна вага каменів')}</span>{p.totalCarat === null ? requestDetail(l) : `${formatCarat(p.totalCarat)} ${pick('ct','кар.','кар.')}`}</td>)}</tr>
          <tr>{compared.map(p => <td key={p.id}><span>{pick('Metal', 'Металл', 'Метал')}</span>{localizeSpec(p.metalType, l)}</td>)}</tr>
          <tr>{compared.map(p => <td key={p.id}><Link to={`/product/${p.id}`} onClick={close} className="text-button">{pick('View piece', 'Открыть украшение', 'Відкрити прикрасу')} →</Link></td>)}</tr>
        </tbody></table></div> : <div className="saved-grid">{selectedProducts.map(p => <article key={p.id} className="saved-card"><div className="saved-photo">{p.images[0] && <ProductImage src={p.images[0]} alt={productName(p, l)} sizes="(max-width:700px) 40vw, 320px" loading="lazy" />}<SavePieceButton product={p} onRemove={() => requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))} /></div><Link to={`/product/${p.id}`} onClick={close}>{productName(p, l)}</Link><p>{price(p)}</p><label className="saved-compare-check"><input type="checkbox" aria-label={`${pick("Compare","Сравнить","Порівняти")}: ${productName(p,l)}`} aria-describedby={`${titleId}-hint`} checked={pair.includes(p.id)} disabled={!pair.includes(p.id) && pair.length >= 2} onChange={() => setComparison(pair.includes(p.id) ? pair.filter(id => id !== p.id) : [...pair, p.id])} />{pick('Compare', 'Сравнить', 'Порівняти')}</label></article>)}</div>}
      </>}
    </div>
  </div>, document.body);
}
