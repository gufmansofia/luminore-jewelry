import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { products } from '../data/products';
import { collectionPath } from '../data/collections';
import { cataloguePhoto } from '../lib/catalogue-photo';
import { ProductImage } from './ProductImage';
import '../styles/category-preview.css';

const categories = [
  { category: 'Rings', productId: 49, names: { en: 'Rings', ru: 'Кольца', uk: 'Каблучки' } },
  { category: 'Necklaces', productId: 100, names: { en: 'Necklaces', ru: 'Колье', uk: 'Кольє' } },
  { category: 'Pendants', productId: 112, names: { en: 'Pendants', ru: 'Подвески', uk: 'Підвіски' } },
  { category: 'Bracelets', productId: 71, names: { en: 'Bracelets', ru: 'Браслеты', uk: 'Браслети' } },
  { category: 'Earrings', productId: 85, names: { en: 'Earrings', ru: 'Серьги', uk: 'Сережки' } },
].map(item => ({
  ...item,
  cover: cataloguePhoto(products.find(product => product.id === item.productId)!),
}));

const copy = {
  en: { title: 'Explore by category', intro: 'Natural or lab-grown diamonds.', browse: 'Browse the Complete Collection', categories: 'Jewellery categories', swipe: 'Swipe to explore' },
  ru: { title: 'Украшения по категориям', intro: 'Натуральные или лабораторные бриллианты.', browse: 'Смотреть всю коллекцию', categories: 'Категории украшений', swipe: 'Листайте, чтобы увидеть ещё' },
  uk: { title: 'Прикраси за категоріями', intro: 'Природні або лабораторні діаманти.', browse: 'Переглянути всю колекцію', categories: 'Категорії прикрас', swipe: 'Гортайте, щоб побачити ще' },
};

export function CategoryPreview() {
  const { language } = useLanguage();
  const t = copy[language];

  return <section id="categories" className="category-preview" data-theme="light" aria-labelledby="category-preview-title">
    <div className="category-preview-inner">
      <header className="category-preview-heading">
        <h2 id="category-preview-title">{t.title}</h2>
        <p>{t.intro}</p>
      </header>
      <p className="category-swipe-hint" id="category-swipe-hint">{t.swipe}</p>
      <ul className="category-preview-list" aria-label={t.categories} aria-describedby="category-swipe-hint">
        {categories.map(item => <li key={item.category}>
          <Link className="category-preview-card" to={collectionPath(item.category)}>
            <div className="category-preview-photo" style={item.cover.style}>
              <ProductImage src={item.cover.src} alt="" loading="lazy" sizes={`(max-width: 700px) ${50 * item.cover.scale}vw, (min-width: 1280px) ${225 * item.cover.scale}px, ${18 * item.cover.scale}vw`} />
            </div>
            <h3>{item.names[language]}</h3>
          </Link>
        </li>)}
      </ul>
      <div className="category-preview-browse"><Link to="/collection">{t.browse}</Link></div>
    </div>
  </section>;
}
