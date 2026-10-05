import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useLanguage} from '../i18n';
import {pageMetadata} from '../lib/seo';
export function Seo(){
 const {pathname}=useLocation();const {language}=useLanguage();
 useEffect(()=>{
  const meta=pageMetadata(pathname,language);document.title=meta.title;
  const set=(selector:string,attrs:Record<string,string>,value:string)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);document.head.append(el);}el.setAttribute('content',value);};
  set('meta[name="description"]',{name:'description'},meta.description);set('meta[name="robots"]',{name:'robots'},meta.robots);
  for(const [key,value]of Object.entries({'og:title':meta.title,'og:description':meta.description,'og:image':meta.image,'og:url':meta.canonical,'og:type':meta.type,'og:site_name':'Luminore'}))set(`meta[property="${key}"]`,{property:key},value);
  for(const [key,value]of Object.entries({'twitter:title':meta.title,'twitter:description':meta.description,'twitter:image':meta.image}))set(`meta[name="${key}"]`,{name:key},value);
  let canonical=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=meta.canonical;
  document.head.querySelectorAll('link[hreflang]').forEach(el=>el.remove());
  for(const alternate of meta.alternates){const link=document.createElement('link');link.rel='alternate';link.hreflang=alternate.language;link.href=alternate.url;document.head.append(link);}
  let schema=document.getElementById('page-schema');if(!schema){schema=document.createElement('script');schema.id='page-schema';schema.setAttribute('type','application/ld+json');document.head.append(schema);}schema.textContent=JSON.stringify(meta.schema).replace(/</g,'\\u003c');
 },[pathname,language]);return null;
}
