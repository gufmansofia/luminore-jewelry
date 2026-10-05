import { ArticleShare } from './ArticleShare';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getBlogPostBySlug, blogPosts } from '../data/blogs';
import { DetailHeader } from './DetailHeader';
import { ProductImage } from './ProductImage';
import { NotFound } from './NotFound';
import { Footer } from './Footer';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import {localePath} from '../lib/locale-path';
import { SITE } from '../lib/seo';
import { articleChapters } from '../lib/article-chapters';
import { Reveal } from './Reveal';
import { useRestoredScroll } from '../hooks/useRouteScroll';

export function BlogPost() {
  const { slug } = useParams();
  const goBack = useBackNavigation('/journal');
  const location = useLocation();
  const restoredScroll = useRestoredScroll();
  const { language:l, t } = useLanguage();
  const [progress,setProgress]=useState(0);
  const [activeChapter,setActiveChapter]=useState(0);
  const articleRef=useRef<HTMLElement>(null);
  const [tocOpen,setTocOpen]=useState(false);
  useEffect(()=>{setTocOpen(window.matchMedia("(min-width:701px)").matches);},[slug]);
  const post=slug?getBlogPostBySlug(slug):undefined;
  const content=post?(l==='ru'?post.content:l==='uk'?post.contentUk:post.contentEn):[];
  const chapters=articleChapters(content);
  const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
  useEffect(()=>{
    if(restoredScroll===undefined)window.scrollTo(0,0);
    let frame=0;
    const update=()=>{frame=0;const article=articleRef.current;if(!article)return;const top=article.getBoundingClientRect().top;const offset=window.innerWidth<=700?130:110;const distance=article.offsetHeight-window.innerHeight+offset;setProgress(Math.max(0,Math.min(100,(offset-top)/Math.max(1,distance)*100)));const headings=Array.from(article.querySelectorAll<HTMLElement>('.article-chapter-heading'));let current=0;headings.forEach((heading,index)=>{if(heading.getBoundingClientRect().top<=offset+90)current=index;});setActiveChapter(current);};
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);const observer=new ResizeObserver(scroll);if(articleRef.current)observer.observe(articleRef.current);return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
  },[slug,l,restoredScroll]);
  if(!post)return <NotFound/>;
  const title=pick(post.titleEn,post.title,post.titleUk);
  const shareUrl=`${SITE}${localePath(`/blog/${post.slug}`,l)}`;
  const related=blogPosts.filter(p=>p.id!==post.id).slice(0,2);
  const goToChapter=(id:string,details:HTMLDetailsElement|null)=>{
    const mobile=window.matchMedia('(max-width:700px)').matches;
    if(mobile&&details)details.open=false;
    requestAnimationFrame(()=>{
      const heading=document.getElementById(id);if(!heading)return;
      const header=document.querySelector('.detail-header')?.getBoundingClientRect().height??90;
      const toc=mobile?(document.querySelector('.article-toc summary')?.getBoundingClientRect().height??50):0;
      heading.focus({preventScroll:true});
      window.history.replaceState(window.history.state,'',`${window.location.pathname}${location.search}#${id}`);
      window.scrollTo({top:window.scrollY+heading.getBoundingClientRect().top-header-toc-24,behavior:'instant'});
    });
  };
  const elements:ReactNode[]=[];
  for(let i=0;i<content.length;){
    const text=content[i];const key=i;
    if(text.startsWith('|')){
      const rows:string[][]=[];
      while(i<content.length&&content[i].startsWith('|')){const cells=content[i++].split('|').filter(c=>c.trim()).map(c=>c.trim().replace(/\*\*/g,''));if(!cells.every(c=>/^[:\-\s]+$/.test(c)))rows.push(cells);}
      elements.push(<div className="article-table" key={key} role="region" tabIndex={0} aria-label={pick('Comparison table','Таблица сравнения','Таблиця порівняння')}><table><thead><tr>{rows[0]?.map((cell,j)=><th key={j} scope="col">{cell}</th>)}</tr></thead><tbody>{rows.slice(1).map((row,j)=><tr key={j}>{row.map((cell,k)=>k===0?<th scope="row" key={k}>{cell}</th>:<td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>);continue;
    }
    if(text.startsWith('• ')){
      const items:string[]=[];while(i<content.length&&content[i].startsWith('• '))items.push(content[i++].slice(2).replace(/\*\*/g,''));elements.push(<ul key={key}>{items.map((item,j)=><li key={j}>{item}</li>)}</ul>);continue;
    }
    if(text.startsWith('### '))elements.push(<h3 key={key}>{text.slice(4)}</h3>);
    else if(text.startsWith('## '))elements.push(<Reveal key={key}><h2 id={`article-chapter-${key}`} tabIndex={-1} className="article-chapter-heading">{text.slice(3)}</h2></Reveal>);
    else if(text.startsWith('**')&&text.endsWith('**'))elements.push(<p key={key}><strong>{text.replace(/\*\*/g,'')}</strong></p>);
    else elements.push(<p key={key}>{text.replace(/\*\*/g,'')}</p>);
    i++;
  }
  return <div className="article-page" data-theme="light">
    <DetailHeader theme="light" back={pick('Back','Назад','Назад')} backFirst onBack={goBack}/>
    <div className="article-progress" aria-hidden="true"><div style={{width:`${progress}%`}}/></div>
    <main id="main-content" tabIndex={-1}>
      <header className="article-hero editorial-container"><nav className="breadcrumbs" aria-label={pick("Breadcrumb","Навигационная цепочка","Навігаційний ланцюжок")}><Link to="/">{pick("Home","Главная","Головна")}</Link><span>/</span><Link to="/journal">{pick("Journal","Журнал","Журнал")}</Link><span>/</span><span aria-current="page">{title}</span></nav><div className="article-meta"><span>{pick(post.categoryEn,post.category,post.categoryUk)}</span><span>{pick(post.dateEn,post.date,post.dateUk)}</span><span>{pick(post.readTimeEn,post.readTime,post.readTimeUk)} {t.blog.readTime}</span></div><h1>{title}</h1><ProductImage src={post.image} className={post.imageClassName} alt={pick(post.imageAlt ?? '',post.imageAltRu ?? post.imageAlt ?? '',post.imageAltUk ?? post.imageAlt ?? '')} sizes="(max-width: 700px) 100vw, 1200px" loading="eager" /></header>
      <div className="article-reading-layout editorial-container">
      {chapters.length>0&&<nav className="article-toc" aria-label={pick('Article chapters','Главы статьи','Розділи статті')}><details open={tocOpen} onToggle={e=>setTocOpen(e.currentTarget.open)}><summary><span>{pick('In this article','В этой статье','У цій статті')}</span><span>{String(activeChapter+1).padStart(2,'0')} / {String(chapters.length).padStart(2,'0')}</span><svg className="article-toc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg></summary><ol>{chapters.map((chapter,i)=><li key={chapter.id}><a href={`#${chapter.id}`} aria-current={activeChapter===i?'location':undefined} onClick={event=>{event.preventDefault();goToChapter(chapter.id,event.currentTarget.closest('details'));}}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span>{chapter.title}</a></li>)}</ol></details></nav>}
      <article ref={articleRef} className="article-body">{elements}<p className="article-byline">{pick("By Luminore · Updated 4 October 2026","Luminore · Обновлено 4 октября 2026","Luminore · Оновлено 4 жовтня 2026")}</p><section className="article-sources"><h2>{pick("Sources","Источники","Джерела")}</h2><ul>{post.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}</ul></section><p><Link to={post.collectionPath} className="text-button">{pick("Explore the collection","Смотреть коллекцию","Переглянути колекцію")} →</Link></p><ArticleShare title={title} url={shareUrl}/></article></div>
      <section className="article-related editorial-container" aria-labelledby="related-articles"><header className="section-heading section-heading--split"><h2 id="related-articles">{pick('Continue reading','Читайте также','Читайте також')}</h2><Link to="/journal" className="text-button">{pick('All articles','Все статьи','Усі статті')}</Link></header><div>{related.map(item=><Link to={`/blog/${item.slug}`} key={item.id} state={{fromJournal:true}} aria-labelledby={`related-article-${item.id}`}><p className="section-eyebrow">{pick(item.categoryEn,item.category,item.categoryUk)}</p><h3 id={`related-article-${item.id}`}>{pick(item.titleEn,item.title,item.titleUk)}</h3>{item.image && <div className="journal-card-image article-related-image"><ProductImage src={item.image} className={item.imageClassName} alt="" loading="lazy" sizes="(max-width:700px) 100vw, 50vw" /></div>}</Link>)}</div></section>
    </main><Footer theme="light"/>
  </div>;
}
