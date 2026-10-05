import { test, expect } from 'bun:test';
import { products } from '../src/data/products';
import { filterCatalogue, matchesProduct, PAGE_SIZE } from '../src/lib/catalogue';
import { productDescription, productSpecs, productSpecGroups } from '../src/lib/product-copy';
import { enquiryMessage, whatsappEnquiryUrl } from '../src/lib/enquiry';
import { pageMetadata } from '../src/lib/seo';

test('category queries find rings in each language without matching earrings', () => {
 for(const query of ['кольцо','КОЛЬЦА','ring','rings','каблучка','каблучки']) {
  const found=filterCatalogue(products,query,'all','all');
  expect(found).toHaveLength(44);expect(found.every(p=>p.categoryEn==='Rings')).toBe(true);
 }
 expect(filterCatalogue(products,'кольцо','Earrings','all')).toHaveLength(0);
 expect(filterCatalogue(products,'','Серьги','all')).toHaveLength(26);
});
test('search supports source codes, partial names, reordered words and unknown queries',()=>{
 expect(products.filter(p=>matchesProduct(p,'RNG-016')).map(p=>p.id)).toEqual([49]);
 expect(products.filter(p=>matchesProduct(p,'rng016')).map(p=>p.id)).toEqual([49]);
 expect(products.filter(p=>matchesProduct(p,'Vine Laurel'))).toHaveLength(2);
 expect(products.filter(p=>matchesProduct(p,'Laur'))).toHaveLength(2);
 expect(products.filter(p=>matchesProduct(p,'zzzz-not-a-product'))).toHaveLength(0);
 const sorted=filterCatalogue(products,'','all','low-to-high');
 expect(sorted.slice(0,PAGE_SIZE)).toHaveLength(12);
 expect(sorted.every((p,i)=>i===0||p.priceUsd!>=sorted[i-1].priceUsd!)).toBe(true);
});
test('descriptions respect jewellery category in every language',()=>{
 const hoops=products.find(p=>p.id===88)!;
 const drops=products.find(p=>p.id===89)!;
 for(const l of ['en','ru','uk'] as const){
  expect(productDescription(hoops,l)).not.toMatch(/band design|Кольцо-дорожка|Каблучка-доріжка/);
  expect(productDescription(drops,l)).not.toMatch(/Stud earrings|Серьги-пусеты|Сережки-пусети/);
 }
 expect(productDescription(hoops,'ru')).toContain('Серьги-кольца');
});
test('grouped specifications retain every recorded fact once, including natural options',()=>{
 for(const p of products)for(const l of ['en','ru','uk'] as const)for(const natural of [true,false]){
  const grouped=productSpecGroups(p,l,natural).flatMap(g=>g.specs);
  const original=productSpecs(p,l,natural);
  expect(grouped).toHaveLength(original.length);
  expect(new Set(grouped.map(s=>s.label)).size).toBe(grouped.length);
  expect(grouped).toEqual(expect.arrayContaining(original));
 }
});
test('WhatsApp draft preserves customer details, Unicode and punctuation without sending',()=>{
 for(const l of ['en','ru','uk'] as const){
  const values={name:'  Анна & Lisa + 1  ',email:'hello+test@example.com',phone:'+421 123 456',piece:'Кольца',budget:'$2,000 – $5,000',details:'Hello!\nЗолото & діаманти?'};
  const message=enquiryMessage(values,l,true);
  const url=new URL(whatsappEnquiryUrl(message));
  expect(url.origin+url.pathname).toBe('https://wa.me/421940600708');
  expect(url.searchParams.get('text')).toBe(message);
  for(const value of Object.values(values))expect(message).toContain(value.trim());
  expect(message).not.toContain('undefined');
 }
 expect(enquiryMessage({name:'Anna',details:'A question'},'en',false)).not.toMatch(/Budget|Phone|Email|undefined/);
});
test('journal index is a real discoverable route',()=>{
 expect(pageMetadata('/journal').missing).toBe(false);
 expect(pageMetadata('/journal').robots).toBe('index, follow');
});
