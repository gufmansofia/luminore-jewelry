import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { spotlightPieces } from '../data/spotlight';
import { useReducedMotion } from '../hooks/useMotion';
import { useLanguage } from '../i18n';
import { productName } from '../lib/product-copy';
import { ProductImage } from './ProductImage';
import '../styles/product-spotlight.css';

const pieces = spotlightPieces.map(piece => ({ ...piece, product: products.find(p => p.id === piece.productId)! }));
const slides = [pieces[pieces.length - 1]!, ...pieces, pieces[0]!];
const copy = {
  en: { title: 'Jewellery spotlight', view: 'View piece', pause: 'Pause slideshow', play: 'Play slideshow' },
  ru: { title: 'Украшения в деталях', view: 'Смотреть украшение', pause: 'Остановить слайд-шоу', play: 'Запустить слайд-шоу' },
  uk: { title: 'Прикраси в деталях', view: 'Переглянути прикрасу', pause: 'Зупинити слайд-шоу', play: 'Запустити слайд-шоу' },
};

export function ProductSpotlight() {
  const { language } = useLanguage();
  const t = copy[language];
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const currentRef = useRef(0);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current!, section = sectionRef.current!;
    const count = pieces.length;
    let timer: ReturnType<typeof setTimeout>, settleTimer: ReturnType<typeof setTimeout>, clickTimer: ReturnType<typeof setTimeout>;
    let nextAt = 0, visible = false, moving = false, focusAfterMove = false;
    let pointer: { x: number; y: number; left: number; mouse: boolean; dragged: boolean } | null = null;
    const keyboardFocused = () => section.contains(document.activeElement) && document.activeElement?.matches(':focus-visible');
    const canPlay = () => !paused && !reduced && visible && !document.hidden && !pointer && !keyboardFocused();
    const schedule = (restart = false) => {
      clearTimeout(timer);
      track.dataset.playbackState = paused ? 'paused' : reduced ? 'reduced-motion' : !visible ? 'offscreen' : document.hidden ? 'background' : pointer ? 'dragging' : keyboardFocused() ? 'keyboard' : moving ? 'settling' : 'playing';
      if (restart) nextAt = performance.now() + 2000;
      if (canPlay() && !moving) timer = setTimeout(() => advance(1), Math.max(0, nextAt - performance.now()));
    };
    const jump = (position: number) => track.scrollTo({ left: position * track.clientWidth, behavior: 'instant' });
    const advance = (delta: number) => {
      clearTimeout(timer);
      nextAt = performance.now() + 2000;
      moving = true;
      track.scrollTo({ left: (currentRef.current + 1 + delta) * track.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
    };
    const settle = () => {
      if (pointer || !track.clientWidth) return;
      const position = Math.round(track.scrollLeft / track.clientWidth);
      const index = ((position - 1) % count + count) % count;
      currentRef.current = index;
      setActive(index);
      track.dataset.activeProduct = String(pieces[index]!.productId);
      // Identical end slides let the loop wrap without an animated rewind.
      if (position === 0 || position === count + 1) jump(index + 1);
      moving = false;
      if (focusAfterMove) {
        track.querySelector<HTMLAnchorElement>(`[data-slide-index="${index + 1}"]`)?.focus({ preventScroll: true });
        focusAfterMove = false;
      }
      schedule();
    };
    const onScroll = () => {
      moving = true;
      clearTimeout(timer);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 140);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      clearTimeout(timer);
      clearTimeout(clickTimer);
      suppressClick.current = false;
      pointer = { x: event.clientX, y: event.clientY, left: track.scrollLeft, mouse: event.pointerType === 'mouse', dragged: false };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer) return;
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        pointer.dragged = true;
        suppressClick.current = true;
      }
      if (pointer.mouse && pointer.dragged) {
        track.dataset.dragging = 'true';
        track.scrollLeft = pointer.left - dx;
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointer) return;
      const ended = pointer;
      pointer = null;
      delete track.dataset.dragging;
      nextAt = performance.now() + 2000;
      if (ended.mouse && ended.dragged) {
        const dx = event.clientX - ended.x;
        const target = Math.round(ended.left / track.clientWidth) + (Math.abs(dx) > 35 ? (dx < 0 ? 1 : -1) : 0);
        track.scrollTo({ left: Math.max(0, Math.min(count + 1, target)) * track.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
      }
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 140);
      clickTimer = setTimeout(() => { suppressClick.current = false; }, 300);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      focusAfterMove = true;
      advance(event.key === 'ArrowRight' ? 1 : -1);
    };
    const onFocus = () => { if (keyboardFocused()) clearTimeout(timer); };
    const onBlur = () => schedule(true);
    const onVisibility = () => schedule(true);
    const onWheel = () => schedule(true);
    track.dataset.ready = 'true';
    jump(currentRef.current + 1);
    track.dataset.activeProduct = String(pieces[currentRef.current]!.productId);
    const resize = new ResizeObserver(() => { jump(currentRef.current + 1); schedule(true); });
    resize.observe(track);
    const observer = new IntersectionObserver(([entry]) => { visible = entry!.intersectionRatio >= 0.3; schedule(true); }, { threshold: 0.3 });
    observer.observe(section);
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('keydown', onKeyDown);
    track.addEventListener('wheel', onWheel, { passive: true });
    section.addEventListener('focusin', onFocus);
    section.addEventListener('focusout', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(timer); clearTimeout(settleTimer); clearTimeout(clickTimer);
      resize.disconnect(); observer.disconnect();
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      track.removeEventListener('keydown', onKeyDown);
      track.removeEventListener('wheel', onWheel);
      section.removeEventListener('focusin', onFocus);
      section.removeEventListener('focusout', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [paused, reduced]);

  return <section id="spotlight" className="product-spotlight" ref={sectionRef} aria-label={t.title} aria-roledescription="carousel" data-theme="light">
    <button type="button" className="spotlight-pause" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? t.play : t.pause}</button>
    <div className="spotlight-track" ref={trackRef}>
      {slides.map((piece, index) => {
        const clone = index === 0 || index === slides.length - 1;
        const name = productName(piece.product, language);
        return <Link key={`${index}-${piece.productId}`} to={`/product/${piece.productId}`}
          className={`spotlight-slide spotlight-slide--${piece.caption}${clone ? ' spotlight-slide--clone' : ''}`}
          data-wide-caption={piece.wideCaption}
          data-compact-caption={piece.productId === 47 ? 'top' : piece.wideCaption}
          data-slide-index={index} aria-hidden={clone || undefined} tabIndex={!clone && index === active + 1 ? 0 : -1}
          onDragStart={event => event.preventDefault()}
          onClick={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}>
          <ProductImage src={piece.image} alt="" loading="lazy" sizes="100vw" draggable={false} style={{ '--spotlight-position': piece.position } as CSSProperties} />
          <div className="spotlight-copy"><h3>{name}</h3><span className="spotlight-view">{t.view}</span></div>
        </Link>;
      })}
    </div>
  </section>;
}
