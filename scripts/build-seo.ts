import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pageMetadata,publicRoutes,SITE} from '../src/lib/seo';
import {languages,localePath} from '../src/lib/locale-path';
import {renderPage} from './prerender';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export async function buildSeo(outdir:string){
 const template=await readFile(path.join(outdir,'index.html'),'utf8');
 const publicPaths=publicRoutes(),routes=[...publicPaths,'/preview/atelier','/preview/hero','/preview/hero-wide','/preview/hero-new','/preview/hero-current','/404'];
 for(const language of languages)for(const route of routes){
  const m=pageMetadata(route,language),localized=localePath(route,language);
  let html=template.replace(/<html\s+lang=["'][^"']+["']/,`<html lang="${language}"`).replace(/<title>.*?<\/title>/s,`<title>${escape(m.title)}</title>`).replace(/<meta\s+(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/g,'').replace(/<link[^>]+rel=["'](?:canonical|alternate)["'][^>]*>/g,'');
  const tags=`<meta name="description" content="${escape(m.description)}"><meta name="robots" content="${m.robots}"><link rel="canonical" href="${escape(m.canonical)}">${m.alternates.map(a=>`<link rel="alternate" hreflang="${a.language}" href="${escape(a.url)}">`).join('')}<meta property="og:title" content="${escape(m.title)}"><meta property="og:description" content="${escape(m.description)}"><meta property="og:image" content="${escape(m.image)}"><meta property="og:url" content="${escape(m.canonical)}"><meta property="og:type" content="${m.type}"><meta property="og:site_name" content="Luminore"><meta property="og:locale" content="${language==='en'?'en_GB':language==='ru'?'ru_RU':'uk_UA'}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(m.title)}"><meta name="twitter:description" content="${escape(m.description)}"><meta name="twitter:image" content="${escape(m.image)}"><script id="page-schema" type="application/ld+json">${JSON.stringify(m.schema).replace(/</g,'\\u003c')}</script>`;
  html=html.replace('</head>',tags+'</head>').replace(/<div id=["']root["']><\/div>/,`<div id="root" data-prerendered="true">${renderPage(route,language)}</div>`);
  const file=localized==='/'?'index.html':localized.slice(1)+'.html';
  await mkdir(path.dirname(path.join(outdir,file)),{recursive:true});await writeFile(path.join(outdir,file),html);
 }
 const entries=languages.flatMap(language=>publicPaths.map(route=>({url:SITE+localePath(route,language),alternates:pageMetadata(route,language).alternates})));
 await writeFile(path.join(outdir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+entries.map(entry=>`<url><loc>${escape(entry.url)}</loc>${entry.alternates.map(a=>`<xhtml:link rel="alternate" hreflang="${a.language}" href="${escape(a.url)}"/>`).join('')}</url>`).join('')+'</urlset>');
 await writeFile(path.join(outdir,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
 console.log(`Pre-rendered ${routes.length*languages.length} complete pages; ${entries.length} localized sitemap URLs.`);
}
