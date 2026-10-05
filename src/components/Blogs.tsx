import { useBackNavigation } from '../hooks/useBackNavigation';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ProductImage } from './ProductImage';
import { blogPosts } from '../data/blogs';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { DetailHeader } from './DetailHeader';
import { Footer } from './Footer';
import { Reveal } from './Reveal';
import { useRestoredScroll } from '../hooks/useRouteScroll';
import { useJournalAutoplay } from '../hooks/useJournalAutoplay';
export function Blogs({ all = false }: { all?: boolean }) {
  const { t, language:l } = useLanguage();
  const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
  const Heading=all?'h1':'h2';
  const CardHeading=all?'h2':'h3';
  const location=useLocation();
  const pauseKey=`luminore-journal-pause:${location.pathname}:${location.key}`;
  const [paused,setPaused]=useState(()=>{try{return sessionStorage.getItem(pauseKey)==='true';}catch{return false;}});
  useEffect(()=>{if(!all)try{sessionStorage.setItem(pauseKey,String(paused));}catch{}},[all,paused,pauseKey]);
  const carousel = useJournalAutoplay(!all,paused);
  return <section id="blog" data-theme="light" className={`editorial-section journal-section${all ? '' : ' journal-section--preview'}`} aria-labelledby="journal-title"><div className="editorial-container">
    <Reveal><header className="section-heading section-heading--split"><div>{all && <p className="section-eyebrow">{t.blog.eyebrow}</p>}<Heading id="journal-title">{t.blog.headline1} {t.blog.headline2}</Heading></div>{all?<p>{t.blog.description}</p>:<Link className="text-button" to="/journal">{pick('Explore the journal','Все статьи журнала','Усі статті журналу')}</Link>}</header></Reveal>
    {!all && <div className="journal-carousel-controls"><span>{pick('Swipe to explore','Листайте статьи','Гортайте статті')}</span><button type="button" className="text-button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?pick('Resume autoplay','Продолжить автопрокрутку','Продовжити автопрокрутку'):pick('Pause autoplay','Остановить автопрокрутку','Зупинити автопрокрутку')}</button></div>}
    <div ref={carousel} className="journal-grid">{blogPosts.map((article,index)=><Link key={article.id} className={`journal-card${!all && index >= 3 ? ' journal-card--mobile-extra' : ''}`} to={`/blog/${article.slug}`} state={{fromJournal:all}} aria-labelledby={`article-title-${article.id}`}>
      <div className="journal-card-image"><ProductImage src={article.image} className={article.imageClassName} alt="" loading="lazy" sizes="(max-width: 700px) 100vw, 33vw" /></div>
      <div className="journal-card-meta"><span>{pick(article.categoryEn,article.category,article.categoryUk)}</span><span>{pick(article.readTimeEn,article.readTime,article.readTimeUk)} {t.blog.readTime}</span></div>
      <CardHeading className="journal-card-title" id={`article-title-${article.id}`}>{pick(article.titleEn,article.title,article.titleUk)}</CardHeading><p>{pick(article.excerptEn,article.excerpt,article.excerptUk)}</p><span className="journal-card-read" aria-hidden="true">{t.blog.read}</span>
    </Link>)}</div>
  </div></section>;
}
export function Journal() {
  const { language:l } = useLanguage();
  const goBack=useBackNavigation('/#blog');
  const main=useRef<HTMLElement>(null);
  const restoredScroll=useRestoredScroll();
  useEffect(()=>{if(restoredScroll===undefined){window.scrollTo({top:0,behavior:'instant'});main.current?.focus({preventScroll:true});}},[restoredScroll]);
  return <div className="journal-page" data-theme="light"><DetailHeader theme="light" back={choose(l,'Back','Назад','Назад')} backFirst onBack={goBack} /><main ref={main} id="main-content" tabIndex={-1}><Blogs all /></main><Footer theme="light" /></div>;
}
