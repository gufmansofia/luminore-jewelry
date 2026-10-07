import {useCallback, useEffect, useRef, useState} from 'react';
import type {PointerEvent} from 'react';
import {useLanguage} from '../i18n';
import {choose} from '../lib/product-copy';
import {ProductImage} from './ProductImage';

export function ProductGallery({images, name}: {images: string[]; name: string}) {
  const {language} = useLanguage();
  const pick = (en: string, ru: string, uk: string) => choose(language, en, ru, uk);
  const track = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const moved = useRef(false);
  const drag = useRef<{pointer: number; x: number; left: number; index: number; moved: boolean} | null>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const show = useCallback((next: number, smooth = true) => {
    const gallery = track.current;
    if (!gallery) return;
    const destination = Math.max(0, Math.min(images.length - 1, next));
    activeIndex.current = destination;
    setZoom(false);
    gallery.scrollTo({left: destination * gallery.clientWidth, behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'});
  }, [images.length]);

  const step = (delta: number) => show((activeIndex.current + delta + images.length) % images.length);

  useEffect(() => {
    const gallery = track.current;
    if (gallery?.contains(document.activeElement)) {
      gallery.children[index]?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll: true});
    }
  }, [index]);

  useEffect(() => {
    const gallery = track.current;
    if (!gallery) return;
    let width = gallery.clientWidth;
    const resize = new ResizeObserver(() => {
      if (gallery.clientWidth === width) return;
      width = gallery.clientWidth;
      show(activeIndex.current, false);
    });
    resize.observe(gallery);

    // Horizontal trackpad gestures stay native. A vertical wheel gesture advances
    // one photograph, and releases page scrolling at either end of the gallery.
    let lastWheel = 0, total = 0, direction = 0, locked = false;
    const wheel = (event: WheelEvent) => {
      if (images.length < 2 || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? gallery.clientWidth : 1);
      const nextDirection = Math.sign(delta);
      const now = performance.now();
      if (now - lastWheel > 180 || nextDirection !== direction) {total = 0; locked = false;}
      lastWheel = now;
      direction = nextDirection;
      const next = activeIndex.current + direction;
      if (next < 0 || next >= images.length) return;
      event.preventDefault();
      if (locked) return;
      total += delta;
      if (Math.abs(total) < 35) return;
      locked = true;
      show(next);
    };
    gallery.addEventListener('wheel', wheel, {passive: false});
    return () => {resize.disconnect(); gallery.removeEventListener('wheel', wheel);};
  }, [images.length, show]);

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    drag.current = null;
    const gallery = event.currentTarget;
    delete gallery.dataset.dragging;
    if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
    if (!current.moved) return;
    const distance = gallery.scrollLeft - current.left;
    const next = cancelled || Math.abs(distance) < Math.min(50, gallery.clientWidth * .15)
      ? Math.round(gallery.scrollLeft / gallery.clientWidth)
      : current.index + Math.sign(distance);
    show(next);
  };

  return <div className="product-gallery-stage product-photo">
    <div ref={track} className={`product-gallery-track${images.length > 1 ? ' product-gallery-track--scrollable' : ''}`}
      role="region" aria-label={pick('Product photographs', 'Фотографии украшения', 'Фотографії прикраси')}
      onScroll={event => {
        const gallery = event.currentTarget;
        const next = Math.max(0, Math.min(images.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
        moved.current = true;
        if (activeIndex.current !== next) setZoom(false);
        activeIndex.current = next;
        setIndex(next);
      }}
      onPointerDown={event => {
        moved.current = false;
        if (event.pointerType !== 'mouse' || event.button !== 0 || images.length < 2) return;
        drag.current = {pointer: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, index: activeIndex.current, moved: false};
      }}
      onPointerMove={event => {
        const current = drag.current;
        if (!current || current.pointer !== event.pointerId) return;
        const dx = event.clientX - current.x;
        if (!current.moved && Math.abs(dx) < 6) return;
        if (!current.moved) {
          current.moved = true;
          moved.current = true;
          event.currentTarget.dataset.dragging = 'true';
          event.currentTarget.setPointerCapture(event.pointerId);
          setZoom(false);
        }
        event.preventDefault();
        event.currentTarget.scrollLeft = current.left - dx;
      }}
      onPointerUp={event => finishDrag(event)}
      onPointerCancel={event => finishDrag(event, true)}
      onLostPointerCapture={event => finishDrag(event, true)}
      onClickCapture={event => {if (moved.current && event.detail > 0) {event.preventDefault(); event.stopPropagation();}}}
      onKeyDown={event => {
        if (images.length < 2) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);}
      }}>
      {images.map((src, photoIndex) => <div key={src} className="product-gallery-slide" aria-hidden={photoIndex !== index}>
        <button type="button" className={`product-image-open${zoom && photoIndex === index ? ' is-zoomed' : ''}`}
          tabIndex={photoIndex === index ? 0 : -1} aria-pressed={zoom && photoIndex === index}
          aria-label={zoom && photoIndex === index ? pick('Zoom out', 'Уменьшить', 'Зменшити') : pick('Enlarge product photograph', 'Увеличить фотографию изделия', 'Збільшити фотографію виробу')}
          onDragStart={event => event.preventDefault()}
          onClick={event => {
            const img = event.currentTarget.querySelector('img');
            const rect = event.currentTarget.getBoundingClientRect();
            if (img) img.style.transformOrigin = event.detail === 0 ? '50% 50%' : `${(event.clientX - rect.left) / rect.width * 100}% ${(event.clientY - rect.top) / rect.height * 100}%`;
            setZoom(value => !value);
          }}
          onPointerMove={event => {
            if (!zoom || event.pointerType === 'touch') return;
            const rect = event.currentTarget.getBoundingClientRect();
            const img = event.currentTarget.querySelector('img');
            if (img) img.style.transformOrigin = `${(event.clientX - rect.left) / rect.width * 100}% ${(event.clientY - rect.top) / rect.height * 100}%`;
          }}
          onPointerLeave={event => {const img = event.currentTarget.querySelector('img'); if (img) img.style.transformOrigin = '50% 50%';}}>
          <ProductImage src={src} alt={name} draggable={false} sizes={zoom && photoIndex === index ? '100vw' : '(max-width: 767px) 100vw, (max-width: 1023px) 680px, 55vw'} loading={photoIndex < 2 ? 'eager' : 'lazy'} className="product-main-image" />
        </button>
      </div>)}
    </div>
    {images.length > 1 && <>
      <button type="button" className="gallery-arrow gallery-arrow--previous" onClick={() => step(-1)} aria-label={pick('Previous image', 'Предыдущее фото', 'Попереднє фото')}><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M7 1 1 6l6 5Z" fill="currentColor" /></svg></button>
      <button type="button" className="gallery-arrow gallery-arrow--next" onClick={() => step(1)} aria-label={pick('Next image', 'Следующее фото', 'Наступне фото')}><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="m1 1 6 5-6 5Z" fill="currentColor" /></svg></button>
      <span className="sr-only" aria-live="polite">{index + 1} / {images.length}</span>
    </>}
  </div>;
}
