import {test,expect} from 'bun:test';
import {existsSync,readFileSync} from 'node:fs';
import {publicRoutes,pageMetadata,SITE} from '../src/lib/seo';
import {languages,localePath} from '../src/lib/locale-path';
import {products} from '../src/data/products';
import {filterCatalogue} from '../src/lib/catalogue';
import {blogPosts} from '../src/data/blogs';
const file=(route:string)=>`dist/${route==='/'?'index':route.slice(1)}.html`;
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
  expect(html).toContain(`href="${SITE+local}"`);
  expect(meta.alternates).toHaveLength(4);
  for(const alternate of meta.alternates)expect(html).toContain(`hreflang="${alternate.language}" href="${alternate.url}"`);
  const schema=JSON.parse(html.match(/id="page-schema"[^>]*>([\s\S]*?)<\/script>/)![1]);
  expect(schema['@context']).toBe('https://schema.org');
  for(const match of html.matchAll(/href="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)){
   const href=match[1].replaceAll('&amp;','&');
   expect(existsSync(file(href))||existsSync('dist'+href)).toBe(true);
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
