import { useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';

export function ArticleShare({title,url}:{title:string;url:string}) {
 const {language:l,t}=useLanguage();
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 const [status,setStatus]=useState('');
 const [showLink,setShowLink]=useState(false);
 const input=useRef<HTMLInputElement>(null);
 const copy=async()=>{
  try {await navigator.clipboard.writeText(url);setStatus(pick('Link copied','Ссылка скопирована','Посилання скопійовано'));}
  catch {setShowLink(true);setStatus(pick('Select and copy the link below','Выделите и скопируйте ссылку ниже','Виділіть і скопіюйте посилання нижче'));requestAnimationFrame(()=>{input.current?.focus();input.current?.select();});}
 };
 const share=async()=>{
  if(!navigator.share){await copy();return;}
  try{await navigator.share({title,url});}catch(error){if((error as Error).name!=='AbortError')await copy();}
 };
 return <div className="article-share"><p>{t.blog.shareArticle}</p><div>
  <button type="button" onClick={share}>{pick('Share','Поделиться','Поділитися')} ↗</button>
  <button type="button" onClick={copy}>{pick('Copy link','Копировать ссылку','Копіювати посилання')}</button>
  <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">Telegram</a>
  <a href={`https://wa.me/?text=${encodeURIComponent(title+' '+url)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
 </div><p role="status">{status}</p>{showLink&&<input ref={input} readOnly value={url} aria-label={pick('Article link','Ссылка на статью','Посилання на статтю')}/>}</div>;
}
