import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AtelierHero, type HeroDirection } from './Atelier';
import { CategoryPreview } from '../components/CategoryPreview';
import { useLanguage } from '../i18n';

const originalDirections: HeroDirection[] = ['minimal', 'editorial', 'cinema'];
const wideDirections: HeroDirection[] = ['wide-immersive', 'wide-caption', 'wide-center'];
const copy = {
  ru: {
    title: 'Три направления для первого впечатления',
    intro: 'Один фильм. Три разных настроения. Переключайте варианты и сравнивайте композицию на большом экране и телефоне.',
    names: ['Тихая роскошь', 'Обложка журнала', 'Кинематограф'],
    descriptions: [
      'Тёплый белый фон, больше воздуха и спокойная типографика. Видео остаётся главным акцентом, а компактная кнопка чётко ведёт к коллекции.',
      'Видео слева, выразительный заголовок справа. Асимметрия, тонкие линии и увеличенные поля создают ощущение ювелирного издания.',
      'Графитовый фон и крупный портрет. Текст частично перекрывает кадр, а мягкий градиент сохраняет читаемость. Самый атмосферный вариант.',
    ],
    compare: 'Варианты Hero', current: 'Текущая главная', note: 'Предпросмотр оформления · видео зациклено',
  },
  uk: {
    title: 'Три напрями для першого враження',
    intro: 'Один фільм. Три різні настрої. Порівнюйте композицію на великому екрані та телефоні.',
    names: ['Тиха розкіш', 'Обкладинка журналу', 'Кінематограф'],
    descriptions: ['Тепле біле тло, більше повітря та спокійна типографіка. Компактна кнопка веде до колекції.', 'Відео ліворуч, виразний заголовок праворуч. Асиметрія, тонкі лінії та широкі поля.', 'Графітове тло та великий портрет. Текст частково перекриває кадр, а м’який градієнт зберігає читабельність.'],
    compare: 'Варіанти Hero', current: 'Поточна головна', note: 'Попередній перегляд · відео зациклено',
  },
  en: {
    title: 'Three ways to make a first impression',
    intro: 'One film. Three different moods. Switch between directions to compare the composition on desktop and mobile.',
    names: ['Quiet luxury', 'Editorial cover', 'Cinema'],
    descriptions: ['Warm white, generous space and restrained typography. The film takes the spotlight; a compact button leads to the collection.', 'Film on the left, expressive typography on the right. Asymmetry, fine rules and generous margins evoke a jewellery publication.', 'Graphite and an expansive portrait. Type overlaps the frame; a soft gradient keeps it readable. The most atmospheric direction.'],
    compare: 'Hero directions', current: 'Current homepage', note: 'Design preview · continuous film',
  },
};

const wideCopy = {
  ru: { title: 'Видео от края до края', intro: 'Три композиции с видео на всю ширину экрана. Без боковых полей. Шапка поверх видео или сразу над ним.', names: ['Полное погружение', 'Видео + подпись', 'Текст поверх'], descriptions: ['Видео начинается от верхнего края экрана. Прозрачная шапка и текст слева оставляют украшения в центре внимания.', 'Белая шапка, затем широкое видео без отступов. Заголовок и действия вынесены в спокойный светлый блок ниже.', 'Видео на весь первый экран с заголовком в центре и лаконичной кнопкой. Мягкое затемнение объединяет композицию.'] },
  uk: { title: 'Відео від краю до краю', intro: 'Три композиції з відео на всю ширину екрана, без бічних полів.', names: ['Повне занурення', 'Відео + підпис', 'Текст поверх'], descriptions: ['Відео від верхнього краю екрана. Прозора шапка та текст ліворуч.', 'Біла шапка, широке відео та світлий блок із текстом під ним.', 'Відео на весь перший екран із заголовком у центрі та лаконічною кнопкою.'] },
  en: { title: 'Film from edge to edge', intro: 'Three compositions with film across the entire screen. No side margins. Navigation sits over the film or just above it.', names: ['Immersive', 'Film + caption', 'Type over film'], descriptions: ['Film begins at the very top of the screen. Transparent navigation and copy on the left keep the jewellery in focus.', 'White navigation, then a full-width film. The headline and actions sit in a quiet light section below.', 'An immersive first screen with a centred headline and a restrained button. Soft shading brings it together.'] },
};

export default function HeroDirections({ wide = false }: { wide?: boolean }) {
  const [params, setParams] = useSearchParams();
  const { language } = useLanguage();
  const t = wide ? { ...copy[language], ...wideCopy[language] } : copy[language];
  const directions = wide ? wideDirections : originalDirections;
  const requested = params.get('variant');
  const selected = directions.includes(requested as HeroDirection) ? requested as HeroDirection : directions[0]!;
  const index = directions.indexOf(selected);
  useEffect(() => {
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 120);
    return () => clearTimeout(timer);
  }, [selected]);
  return <>
    <AtelierHero direction={selected} homePath="/" />
    <main id="main-content" tabIndex={-1} className="hero-directions-context atelier-content" data-theme="light">
      <CategoryPreview />
      <section className="hero-directions-notes" aria-labelledby="directions-title">
        <p className="hero-direction-eyebrow">{t.note}</p>
        <h2 id="directions-title">{t.title}</h2>
        <p>{t.intro}</p>
        <div className="hero-directions-grid">{directions.map((direction, i) =>
          <button type="button" key={direction} aria-pressed={selected === direction} onClick={() => {
            setParams({ variant: direction }); window.scrollTo({ top: 0, behavior: 'instant' });
          }}>
            <span className="hero-direction-number">0{i + 1}</span>
            <h3>{t.names[i]}</h3><p>{t.descriptions[i]}</p>
          </button>
        )}</div>
        <Link to="/">{t.current} ↗</Link>
      </section>
    </main>
    <nav className="hero-direction-switcher" aria-label={t.compare}>
      {directions.map((direction, i) => <button type="button" key={direction}
        aria-pressed={index === i} onClick={() => { setParams({ variant: direction }); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
        <span>0{i + 1}</span>{t.names[i]}
      </button>)}
    </nav>
  </>;
}
