import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { blogPosts } from '../data/blogs';
import { useLanguage } from '../i18n';
import atelierWorkshop from '../../public/hero-bg.png';

export default function AtelierSections() {
  const { language } = useLanguage();
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const tr = (en: string, uk: string, ru: string) => language === 'uk' ? uk : language === 'ru' ? ru : en;
  const categories = [ ['All', tr('All pieces', 'Усі прикраси', 'Все украшения')], ['Rings', tr('Rings', 'Каблучки', 'Кольца')], ['Earrings', tr('Earrings', 'Сережки', 'Серьги')], ['Pendants', tr('Pendants', 'Підвіски', 'Подвески')], ['Bracelets', tr('Bracelets', 'Браслети', 'Браслеты')] ];
  const selection = [...products].sort((a,b) => ([5,7,3,13].indexOf(a.id) < 0 ? 100+a.id : [5,7,3,13].indexOf(a.id)) - ([5,7,3,13].indexOf(b.id) < 0 ? 100+b.id : [5,7,3,13].indexOf(b.id)));
  const filtered = selection.filter(p => category === 'All' || p.categoryEn === category);
  const shown = expanded ? filtered : filtered.slice(0,4);
  return <>
    <section id="atelier-collection" className="atelier-section atelier-collection" aria-labelledby="collection-heading">
      <div className="atelier-section-heading"><div><p className="atelier-eyebrow">{tr('THE COLLECTION','КОЛЕКЦІЯ','КОЛЛЕКЦИЯ')}</p><h2 id="collection-heading">{tr('Objects of ', 'Предмети ', 'Предметы ')}<em>{tr('affection.','захоплення.','восхищения.')}</em></h2></div><p className="atelier-note">{tr('For everyday rituals. For extraordinary moments.', 'Для щоденних ритуалів. Для виняткових митей.', 'Для повседневных ритуалов. Для особенных мгновений.')}</p></div>
      <div className="atelier-filters" aria-label={tr('Filter collection','Фільтр колекції','Фильтр коллекции')}>{categories.map(([key,label])=><button key={key} aria-pressed={category===key} onClick={()=>{setCategory(key);setExpanded(false)}}>{label}</button>)}</div>
      <div className="atelier-product-grid">{shown.map(p=><Link to={`/product/${p.id}`} className="atelier-product" key={p.id}>
        <div className="atelier-product-photo"><img src={p.images[0]} alt={tr(p.nameEn,p.nameUk,p.name)} loading="lazy" /></div>
        <p className="atelier-product-category">{tr(p.categoryEn,p.categoryUk,p.category)}</p><h3>{tr(p.nameEn,p.nameUk,p.name)}</h3><p className="atelier-price">{p.priceUsd === null ? tr('Price on request','Ціна за запитом','Цена по запросу') : new Intl.NumberFormat(language==='en'?'en-US':language==='uk'?'uk-UA':'ru-RU',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p.priceUsd)}</p>
      </Link>)}</div>
      {filtered.length>4 && <button className="atelier-text-button" onClick={()=>setExpanded(!expanded)}>{expanded ? tr('Show fewer pieces','Показати менше','Показать меньше') : tr('Explore all pieces','Переглянути всі прикраси','Смотреть все украшения')}</button>}
    </section>
    <section id="atelier-about" className="atelier-philosophy" aria-labelledby="philosophy-heading">
      <p className="atelier-eyebrow">{tr('OUR PHILOSOPHY','НАША ФІЛОСОФІЯ','НАША ФИЛОСОФИЯ')}</p>
      <h2 id="philosophy-heading">{tr('Not simply worn.', 'Не просто прикраса.', 'Не просто украшение.')}<br/><em>{tr('Deeply felt.','Глибоке відчуття.','Глубокое чувство.')}</em></h2>
      <p className="atelier-philosophy-copy">{tr('We believe the most meaningful jewelry reflects the person who wears it. From the first stone to the final setting, we help you find a piece that feels entirely your own.', 'Ми віримо, що найцінніші прикраси відображають того, хто їх носить. Від першого каменю до завершеної оправи ми допомагаємо знайти прикрасу, яка буде по-справжньому вашою.', 'Мы верим, что самые ценные украшения отражают того, кто их носит. От первого камня до готовой оправы мы помогаем найти украшение, которое будет по-настоящему вашим.')}</p>
      <div className="atelier-values">{[
        [tr('Your stone','Ваш камінь','Ваш камень'),tr('Natural or lab-grown diamonds, chosen around your preferences.', 'Природні або лабораторні діаманти, обрані за вашими побажаннями.', 'Природные или лабораторные бриллианты, выбранные по вашим пожеланиям.')],
        [tr('Your setting','Ваша оправа','Ваша оправа'),tr('Considered proportions. Thoughtful details. An expression of you.', 'Вивірені пропорції. Продумані деталі. Відображення вас.', 'Выверенные пропорции. Продуманные детали. Отражение вас.')],
        [tr('Your story','Ваша історія','Ваша история'),tr('Personal guidance, from the first question to your final choice.', 'Персональна підтримка від першого питання до остаточного вибору.', 'Персональное сопровождение от первого вопроса до окончательного выбора.')]
      ].map(([title,description])=><div key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>
    </section>
    <section id="atelier-bespoke" className="atelier-bespoke-section" aria-labelledby="bespoke-heading">
      <div className="atelier-workshop"><img src={atelierWorkshop} alt={tr('Jewelry sketches and loose gemstones','Ескізи прикрас та дорогоцінні камені','Эскизы украшений и драгоценные камни')} loading="lazy" /></div>
      <div className="atelier-bespoke-story"><p className="atelier-eyebrow">{tr('BESPOKE BY LUMINORE','ІНДИВІДУАЛЬНО ВІД LUMINORE','ИНДИВИДУАЛЬНО ОТ LUMINORE')}</p><h2 id="bespoke-heading">{tr('Only you.', 'Тільки ви.', 'Только вы.')}<br/><em>{tr('Only yours.','Тільки ваше.','Только ваше.')}</em></h2><p>{tr('An idea. A memory. A stone you cannot stop thinking about. Together, we turn it into something you can hold.', 'Ідея. Спогад. Камінь, про який неможливо перестати думати. Разом ми перетворимо це на щось відчутне.', 'Идея. Воспоминание. Камень, о котором невозможно перестать думать. Вместе мы превратим это во что-то осязаемое.')}</p>
      <ol className="atelier-steps">{[tr('Share your vision','Поділіться баченням','Поделитесь идеей'),tr('Choose your stone & setting','Оберіть камінь та оправу','Выберите камень и оправу'),tr('Make it yours','Зробіть її своєю','Сделайте его своим')].map((step,i)=><li key={step}><span>0{i+1}</span>{step}</li>)}</ol><a href="#atelier-contact" className="atelier-primary">{tr('Begin a conversation','Почати розмову','Начать разговор')}</a></div>
    </section>
    <section id="atelier-journal" className="atelier-section atelier-journal" aria-labelledby="journal-heading"><div className="atelier-section-heading"><div><p className="atelier-eyebrow">{tr('THE JOURNAL','ЖУРНАЛ','ЖУРНАЛ')}</p><h2 id="journal-heading">{tr('A closer ', 'Погляд ', 'Взгляд ')}<em>{tr('look.','зблизька.','вблизи.')}</em></h2></div><p className="atelier-note">{tr('On diamonds, design, and the things we treasure.', 'Про діаманти, дизайн і речі, які ми цінуємо.', 'О бриллиантах, дизайне и том, что нам дорого.')}</p></div>
      <div className="atelier-journal-grid">{blogPosts.slice(0,3).map(post=><Link to={`/blog/${post.slug}`} key={post.id} className="atelier-article"><div className="atelier-article-photo"><img src={post.image} alt={post.imageAlt || tr(post.titleEn,post.titleUk,post.title)} loading="lazy" /></div><p className="atelier-product-category">{tr(post.categoryEn,post.categoryUk,post.category)} · {tr(post.readTimeEn,post.readTimeUk,post.readTime)}</p><h3>{tr(post.titleEn,post.titleUk,post.title)}</h3><span className="atelier-read">{tr('Read the story','Читати історію','Читать историю')}</span></Link>)}</div>
    </section>
    <footer id="atelier-contact" className="atelier-footer"><p className="atelier-eyebrow">{tr('PERSONAL, FROM THE BEGINNING','ОСОБИСТО, ВІД САМОГО ПОЧАТКУ','ЛИЧНО, С САМОГО НАЧАЛА')}</p><h2>{tr('Let’s find your ', 'Знайдімо вашу ', 'Найдём вашу ')}<em>{tr('forever.','вічність.','вечность.')}</em></h2><a className="atelier-email" href="mailto:jewelry@luminore.eu">jewelry@luminore.eu</a><div className="atelier-contact-links"><a href="https://wa.me/421940600708" target="_blank" rel="noreferrer">WhatsApp</a><a href="https://t.me/luminore_jewelry" target="_blank" rel="noreferrer">Telegram</a><a href="tel:+421940600708">+421 940 600 708</a></div><div className="atelier-footer-bottom"><a href="#" className="atelier-wordmark">LUMINORE</a><span>© {new Date().getFullYear()} Luminore Jewelry</span><a href="#atelier-collection">{tr('The collection','Колекція','Коллекция')}</a></div></footer>
  </>;
}
