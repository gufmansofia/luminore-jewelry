import {test,expect} from 'bun:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {existsSync,readFileSync} from 'node:fs';
import {publicRoutes,pageMetadata,SITE,SITE_NAME} from '../src/lib/seo';
import {LanguageProvider} from '../src/i18n';
import {LanguageSelect} from '../src/components/LanguageSelect';
import {languages,localePath} from '../src/lib/locale-path';
import {products} from '../src/data/products';
import {filterCatalogue,PAGE_SIZE} from '../src/lib/catalogue';
import {collectionRoute} from '../src/data/collections';
import {productName,productDescription,productSpecs,requestDetail} from '../src/lib/product-copy';
import {blogPosts} from '../src/data/blogs';
const file=(route:string)=>`dist/${route==='/'?'index':route.slice(1)}.html`;
test('language links expose localized destinations with the current path, query and section',()=>{
 for(const language of languages)for(const route of ['/','/collection/page/2','/product/85']){
  const html=renderToStaticMarkup(createElement(LanguageProvider,{defaultLanguage:language},
   createElement(StaticRouter,{basename:language==='en'?'/':`/${language}`,location:localePath(route,language)+'?sort=price&lang=ru&view=grid#details'},
    createElement(LanguageSelect))));
  const links=[...html.matchAll(/<a\b[^>]*class="language-option"[^>]*>/g)].map(match=>match[0]);
  expect(links).toHaveLength(3);
  for(const destination of languages){
   const link=links.find(tag=>tag.includes(`lang="${destination}"`))!;
   expect(link).toContain(`href="${localePath(route,destination)}?sort=price&amp;view=grid#details"`);
   expect(link).toMatch(new RegExp(`hrefLang="${destination}"`,'i'));
   expect(link).toContain(`aria-checked="${destination===language}"`);
  }
 }
});
test('preferred site name identifies Luminore Jewelry without changing the organization identity',()=>{
 expect(SITE_NAME).toBe('Luminore Jewelry');
 for(const language of languages)for(const route of ['/','/collection','/product/85']){
  const meta=pageMetadata(route,language);
  expect(meta.siteName).toBe('Luminore Jewelry');
  const graph=meta.schema['@graph'] as Record<string,any>[];
  expect(graph.find(item=>item['@type']==='WebSite')).toMatchObject({name:'Luminore Jewelry',alternateName:['Luminore','Luminore Fine Jewelry'],url:SITE+'/'});
  expect(graph.find(item=>item['@type']==='Organization')).toMatchObject({name:'Luminore',alternateName:['Luminore Jewelry','Luminore Fine Jewelry']});
 }
});
test('all public language pages contain content, reciprocal alternates and one canonical before JavaScript',()=>{
 const routes=publicRoutes();
 for(const l of languages)for(const route of routes){
  const local=localePath(route,l),meta=pageMetadata(route,l),html=readFileSync(file(local),'utf8');
  expect(meta.missing).toBe(false);
  expect(html).toContain(`<html lang="${l}"`);
  expect(html).toContain('data-prerendered="true"');
  expect(html).toContain('<main');
  expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  expect(html.match(/rel="canonical"/g)).toHaveLength(1);
  expect(html).toContain(`rel="canonical" href="https://www.luminorejewelry.com${local}"`);
  expect(html).not.toContain('https://luminore.eu/');
  expect(meta.alternates).toHaveLength(4);
  for(const alternate of meta.alternates)expect(html).toContain(`hreflang="${alternate.language}" href="${alternate.url}"`);
  const schema=JSON.parse(html.match(/id="page-schema"[^>]*>([\s\S]*?)<\/script>/)![1]);
  expect(schema['@context']).toBe('https://schema.org');
  expect(schema['@graph'].find((entity:any)=>entity['@type']==='WebSite')).toMatchObject({name:SITE_NAME,alternateName:['Luminore','Luminore Fine Jewelry']});
  expect(html).toContain(`<meta property="og:site_name" content="${SITE_NAME}">`);
  const languageLinks=[...html.matchAll(/<a\b[^>]*class="language-option"[^>]*>/g)].map(match=>match[0]);
  expect(languageLinks).toHaveLength(3);
  for(const language of languages)expect(languageLinks.some(tag=>tag.includes(`href="${localePath(route,language)}"`))).toBe(true);
  for(const match of html.matchAll(/href="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)){
   const href=match[1].replaceAll('&amp;','&');
   expect(existsSync(file(href))||existsSync('dist'+href)).toBe(true);
  }
 }
});
test('sitemap and robots use the production domain',()=>{
 const origin='https://www.luminorejewelry.com';
 expect(SITE).toBe(origin);
 const sitemap=readFileSync('dist/sitemap.xml','utf8');
 for(const match of sitemap.matchAll(/(?:<loc>|href=")(https?:\/\/[^<"]+)/g))expect(new URL(match[1]).origin).toBe(origin);
 expect(readFileSync('dist/robots.txt','utf8')).toContain(`Sitemap: ${origin}/sitemap.xml`);
});
test('alternative sitemap index covers every public URL once across language sitemaps',()=>{
 const index=readFileSync('dist/sitemap-index.xml','utf8');
 expect(index).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
 expect([...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1])).toEqual(languages.map(language=>`${SITE}/sitemap-${language}.xml`));
 const allUrls:string[]=[];
 for(const language of languages){
  const sitemap=readFileSync(`dist/sitemap-${language}.xml`,'utf8');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
  expect(urls).toEqual(publicRoutes().map(route=>SITE+localePath(route,language)));
  expect((sitemap.match(/<xhtml:link /g)||[]).length).toBe(urls.length*4);
  allUrls.push(...urls);
 }
 const original=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
 expect(allUrls).toEqual(original);
 expect(new Set(allUrls).size).toBe(allUrls.length);
});
test('search titles and descriptions distinguish public pages within each language',()=>{
 for(const language of languages){
  const pages=publicRoutes().map(route=>pageMetadata(route,language));
  expect(new Set(pages.map(page=>page.title)).size).toBe(pages.length);
  expect(new Set(pages.map(page=>page.description)).size).toBe(pages.length);
  for(const page of pages){expect(page.description.length).toBeGreaterThan(50);expect(page.description.length).toBeLessThanOrEqual(170);}
 }
});
test('structured data matches visible products, catalogue order and article dates',()=>{
 for(const language of languages){
  const home=pageMetadata('/',language).schema['@graph'] as Record<string,any>[];
  expect(home.find(item=>item['@type']==='WebSite')).toMatchObject({name:SITE_NAME,url:SITE+'/'});
  expect(home.find(item=>item['@type']==='Organization')).toMatchObject({telephone:'+421940600708',email:'jewelry@luminore.eu'});
  for(const product of products){
   const meta=pageMetadata(`/product/${product.id}`,language);
   const graph=meta.schema['@graph'] as Record<string,any>[];
   const entity=graph.find(item=>item['@type']==='Product')!;
   expect(entity.name).toBe(productName(product,language));
   expect(entity.description).toBe(productDescription(product,language));
   expect(entity.additionalProperty.map((spec:any)=>({label:spec.name,value:spec.value}))).toEqual(productSpecs(product,language).filter(spec=>spec.value!==requestDetail(language)));
   expect(entity.aggregateRating).toBeUndefined();
   if(product.priceUsd===null)expect(entity.offers).toBeUndefined();
   else {expect(entity.offers.price).toBe(product.priceUsd);expect(entity.offers.priceCurrency).toBe('USD');expect(entity.offers.availability).toBeUndefined();}
   const html=readFileSync(file(localePath(`/product/${product.id}`,language)),'utf8');
   expect(html).toContain('max-image-preview:large');
   for(const image of html.matchAll(/<img\b[^>]*class="[^"]*(?:product-main-image|object-contain)[^"]*"[^>]*>/g))expect(image[0]).not.toContain('alt=""');
  }
  for(const route of publicRoutes()){
   const collection=collectionRoute(route);if(!collection)continue;
   const graph=pageMetadata(route,language).schema['@graph'] as Record<string,any>[];
   const list=graph.find(item=>item['@type']==='CollectionPage')!.mainEntity.itemListElement;
   const expected=filterCatalogue(products,'',collection.collection?.category??'all','all').slice((collection.page-1)*PAGE_SIZE,collection.page*PAGE_SIZE);
   expect(list.map((item:any)=>item.url)).toEqual(expected.map(product=>SITE+localePath(`/product/${product.id}`,language)));
   expect(list.map((item:any)=>item.position)).toEqual(expected.map((_,i)=>i+1));
   const html=readFileSync(file(localePath(route,language)),'utf8');
   for(const image of html.matchAll(/<img\b[^>]*class="catalogue-cover-image"[^>]*>/g))expect(image[0]).not.toContain('alt=""');
  }
  for(const post of blogPosts){
   const graph=pageMetadata(`/blog/${post.slug}`,language).schema['@graph'] as Record<string,any>[];
   expect(graph.find(item=>item['@type']==='Article')).toMatchObject({dateModified:post.updatedAt,inLanguage:language});
   const sitemap=readFileSync('dist/sitemap.xml','utf8');
   expect(sitemap).toContain(`<loc>${SITE+localePath(`/blog/${post.slug}`,language)}</loc><lastmod>${post.updatedAt}</lastmod>`);
  }
 }
});
test('pagination exposes all 113 products as crawlable links and preserves the approved first 12',()=>{
 expect(filterCatalogue(products,'','all','all').slice(0,12).map(p=>p.id)).toEqual([85,103,55,112,79,99,6,108,89,71,13,86]);
 for(const l of languages){
  const catalogue=publicRoutes().filter(route=>/^\/collection(?:\/page\/\d+)?$/.test(route)).map(route=>readFileSync(file(localePath(route,l)),'utf8')).join('');
  for(const p of products)expect(catalogue).toContain(`href="${localePath(`/product/${p.id}`,l)}"`);
 }
});
test('unknown routes are noindex and previews are excluded from the sitemap',()=>{
 for(const route of ['/not-found','/product/999','/collections/nope','/collections/rings/page/99'])expect(pageMetadata(route).robots).toContain('noindex');
 const sitemap=readFileSync('dist/sitemap.xml','utf8');expect(sitemap).not.toContain('/preview/');expect(sitemap).not.toContain('/404');expect(sitemap).not.toContain('?lang=');
 expect((sitemap.match(/<url>/g)||[]).length).toBe(publicRoutes().length*3);
});
test('article sources, revision dates and reading time agree with published text',()=>{
 for(const post of blogPosts){expect(post.sources.length).toBeGreaterThan(0);expect(post.updatedAt).toBe('2026-10-04');for(const [content,time]of [[post.contentEn,post.readTimeEn],[post.content,post.readTime],[post.contentUk,post.readTimeUk]] as [string[],string][]){expect(parseInt(time)).toBe(Math.max(1,Math.ceil(content.join(' ').split(/\s+/).length/200)));expect(content.join(' ')).not.toMatch(/ethically flawless|wise investment|minimal environmental footprint|complimentary annual/);}}
});
