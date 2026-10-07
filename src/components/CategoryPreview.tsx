import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { products } from '../data/products';
import { collectionPath } from '../data/collections';
import { cataloguePhoto } from '../lib/catalogue-photo';
import { ProductImage } from './ProductImage';
import '../styles/category-preview.css';

const categories = [
  { category: 'Rings', productId: 49, names: { en: 'Rings', ru: 'Кольца', uk: 'Каблучки' } },
  { category: 'Necklaces', productId: 100, names: { en: 'Necklaces', ru: 'Колье', uk: 'Кольє' } },
  { category: 'Pendants', productId: 113, names: { en: 'Pendants', ru: 'Подвески', uk: 'Підвіски' } },
  { category: 'Bracelets', productId: 71, names: { en: 'Bracelets', ru: 'Браслеты', uk: 'Браслети' } },
  { category: 'Earrings', productId: 85, names: { en: 'Earrings', ru: 'Серьги', uk: 'Сережки' } },
].map(item => ({
  ...item,
  cover: cataloguePhoto(products.find(product => product.id === item.productId)!),
}));

const copy = {
  en: { title: 'Explore by category', intro: 'Natural or lab-grown diamonds.', browse: 'Browse the Complete Collection', categories: 'Jewellery categories', previous: 'Previous categories', next: 'Next categories' },
  ru: { title: 'Украшения по категориям', intro: 'Натуральные или лабораторные бриллианты.', browse: 'Смотреть всю коллекцию', categories: 'Категории украшений', previous: 'Предыдущие категории', next: 'Следующие категории' },
  uk: { title: 'Прикраси за категоріями', intro: 'Природні або лабораторні діаманти.', browse: 'Переглянути всю колекцію', categories: 'Категорії прикрас', previous: 'Попередні категорії', next: 'Наступні категорії' },
};

export function CategoryPreview() {
  const { language } = useLanguage();
  const t = copy[language];
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const track = list.current;
    if (!track) return;
    const update = () => setEdges({ start: track.scrollLeft <= 1, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 });
    update();
    const resize = new ResizeObserver(update);
    resize.observe(track);
    track.addEventListener('scroll', update, { passive: true });
    return () => { resize.disconnect(); track.removeEventListener('scroll', update); };
  }, []);
  const browse = (direction: number) => {
    const track = list.current;
    if (!track || !track.firstElementChild) return;
    const step = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return <section id="categories" className="category-preview" data-theme="light" aria-labelledby="category-preview-title">
    <div className="category-preview-inner">
      <header className="category-preview-heading">
        <h2 id="category-preview-title">{t.title}</h2>
        <p>{t.intro}</p>
      </header>
      <div className="category-preview-carousel">
      <button type="button" className="category-arrow category-arrow--previous" aria-label={t.previous} aria-controls="category-preview-list" disabled={edges.start} onClick={() => browse(-1)}><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M7 1 1 6l6 5Z" fill="currentColor" /></svg></button>
      <ul ref={list} id="category-preview-list" className="category-preview-list" aria-label={t.categories}>
        {categories.map(item => <li key={item.category}>
          <Link className="category-preview-card" to={collectionPath(item.category)}>
            <div className="category-preview-photo" style={item.cover.style}>
              <ProductImage src={item.cover.src} alt="" loading="lazy" sizes={`(max-width: 700px) ${50 * item.cover.scale}vw, (min-width: 1280px) ${225 * item.cover.scale}px, ${18 * item.cover.scale}vw`} />
            </div>
            <h3>{item.names[language]}</h3>
          </Link>
        </li>)}
      </ul>
      <button type="button" className="category-arrow category-arrow--next" aria-label={t.next} aria-controls="category-preview-list" disabled={edges.end} onClick={() => browse(1)}><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="m1 1 6 5-6 5Z" fill="currentColor" /></svg></button>
      </div>
      <div className="category-preview-browse"><Link to="/collection">{t.browse}</Link></div>
    </div>
  </section>;
}
