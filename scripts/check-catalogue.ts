import {test,expect} from 'bun:test';
import {products} from '../src/data/products';
import facts from '../src/data/stock-facts.json';
import {approvedPrices} from '../src/data/approved-prices';
import {productName,productTitle,productDescription,productSpecs} from '../src/lib/product-copy';
import {formatCarat,formatCaratText,formatStoneWeights} from '../src/lib/carat';
import {matchesProduct} from '../src/lib/catalogue';
import {pageMetadata} from '../src/lib/seo';
import {blogPosts} from '../src/data/blogs';
import manifest from '../src/data/image-manifest.json';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const schemaProduct=(id:number)=>{const schema=pageMetadata(`/product/${id}`).schema;return (schema['@graph'] as Record<string,unknown>[])?.find(item=>item['@type']==='Product')??schema;};
test('stock uses recorded facts and explicitly approved selling prices',()=>{
 for(const p of products){const row=facts[p.sourceCode as keyof typeof facts];if(!row)continue;expect(p.priceUsd).toBe(approvedPrices[p.id]??row.price);expect(p.totalCarat).toBe(row.carat);expect(p.metalType).toBe(row.metal);}
 expect(products).toHaveLength(113);
 expect(products.find(p=>p.sourceCode==='BRC-002')!.nameEn).toContain('0.5 ct stones');
});
test('carat display rounds decimal ties once and keeps exact data separate',()=>{
 for(const [weight,display] of [[0.5,'0.5'],[1,'1.0'],[12,'12.0'],[1.04,'1.0'],[1.05,'1.1'],[1.049,'1.0'],[2.05,'2.1'],[9.95,'10.0'],[4.423,'4.4'],[12.31,'12.3'],[58.76,'58.8']] as const) expect(formatCarat(weight)).toBe(display);
 expect(formatStoneWeights('1.03 + 1.05')).toBe('1.0 + 1.1');
 expect(formatCaratText('18K gold, size 17, 1.768 ct')).toBe('18K gold, size 17, 1.8 ct');
 expect(formatCaratText('≈ 13.37 ct')).toBe('13.4 ct');
 const cascade=products.find(p=>p.sourceCode==='EAR-010')!;
 expect(cascade.totalCarat).toBe(3.536);
 expect(cascade.perEarring).toBe('1.768');
 expect(productSpecs(cascade,'en')).toEqual(expect.arrayContaining([
  {label:'Total stone weight · pair',value:'3.5 ct'},
  {label:'Stone weight · one earring',value:'1.8 ct'},
 ]));
});
test('approved Marquise earring weight is 0.5 ct each and 1.0 ct for the pair',()=>{
 const p=products.find(p=>p.sourceCode==='EAR-023')!;
 expect(p).toMatchObject({totalCarat:1,perEarring:'0.5',caratBasis:'pair',priceUsd:1300});
 expect(productSpecs(p,'en')).toEqual(expect.arrayContaining([
  {label:'Total stone weight · pair',value:'1.0 ct'},
  {label:'Stone weight · one earring',value:'0.5 ct'},
 ]));
 for(const l of ['en','ru','uk'] as const){
  expect(productDescription(p,l)).toContain('1.0');
  expect(productSpecs(p,l)).not.toEqual(expect.arrayContaining([{label:'Weight basis',value:expect.any(String)}]));
 }
});
test('catalogue copy uses tenths across all languages and rounded weights remain searchable',()=>{
 for(const p of products)for(const l of ['en','ru','uk'] as const){
  const copy=[productName(p,l),productDescription(p,l),...productSpecs(p,l).map(s=>s.value)].join(' ');
  const weights=[...copy.matchAll(/(\d+(?:\.\d+)?)\s*(?:ct\b|кар\.)/g)];
  expect(weights.length).toBeGreaterThan(0);
  for(const weight of weights)expect(weight[1]).toMatch(/^\d+\.\d$/);
  expect(copy).not.toContain('≈');
 }
 const laurel=products.find(p=>p.sourceCode==='RNG-016')!;
 expect(laurel.totalCarat).toBe(4.423);
 expect(matchesProduct(laurel,'кольцо 4.4')).toBe(true);
 expect(matchesProduct(laurel,'4.423')).toBe(true);
 expect(matchesProduct(products.find(p=>p.sourceCode==='EAR-023')!,'Marquise 1.0 ct')).toBe(true);
 const pear=products.find(p=>p.id===11)!;
 expect(productTitle(pear,'en')).toBe('Three-stone Pear Diamond Ring');
 expect(productTitle(pear,'ru')).toBe('Кольцо три камня груша');
 expect(productTitle(products.find(p=>p.id===46)!,'en')).toBe('Transformer halo stud earrings');
});
test('approved rounded prices are shared by catalogue data and product offers',()=>{
 expect(Object.keys(approvedPrices)).toHaveLength(19);
 for(const p of products){
  expect(p.priceUsd! % 100).toBe(0);
  expect(schemaProduct(p.id)).toMatchObject({offers:{price:p.priceUsd}});
 }
 expect(products.find(p=>p.id===49)!.priceUsd).toBe(2900);
 expect(products.find(p=>p.id===103)!.priceUsd).toBe(22700);
});
test('natural options do not inherit lab descriptions, grades or report numbers',()=>{
 for(const p of products)for(const l of ['en','ru','uk'] as const){
  expect(productDescription(p,l,true)).not.toMatch(/lab-grown|лаборатор/i);
  expect(productSpecs(p,l,true)).toHaveLength(2);
  expect(JSON.stringify(productSpecs(p,l))).not.toMatch(/772671095|781611480|LG707553522|Report number|Номер отч/);
  expect(productName(p,l)).toBeTruthy();
 }
});
test('all image originals are preserved and delivery copies exist',()=>{
 for(const [source,image]of Object.entries(manifest)){
  const hash=createHash('sha256').update(readFileSync('public'+source)).digest('hex').slice(0,16);
  for(const variant of image.variants){expect(variant.src).toContain(hash);expect(existsSync('public'+variant.src)).toBe(true);}
 }
});
test('product and journal metadata is unique, absolute and noindex on unknown pages',()=>{
 for(const p of products){const m=pageMetadata(`/product/${p.id}`);expect(m.title).toContain(productName(p,'en'));expect(m.image).toStartWith('https://luminore.eu/');expect(schemaProduct(p.id)['@type']).toBe('Product');}
 for(const p of blogPosts)expect(pageMetadata(`/blog/${p.slug}`).title).toContain(p.titleEn);
 expect(pageMetadata('/does-not-exist').robots).toContain('noindex');
});
