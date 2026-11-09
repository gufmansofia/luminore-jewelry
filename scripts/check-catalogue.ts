import {test,expect} from 'bun:test';
import {products} from '../src/data/products';
import {luminoreProducts,luminoreCatalogue} from '../src/data/luminore-products';
import facts from '../src/data/stock-facts.json';
import {approvedPrices} from '../src/data/approved-prices';
import {productName,productTitle,productDescription,productSpecs,catalogueWeight,totalStoneWeightLabel} from '../src/lib/product-copy';
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
 expect(products).toHaveLength(107);
 expect(luminoreProducts).toHaveLength(41);
 expect(products.filter(p=>p.sourceBrand!=='Luminore')).toHaveLength(66);
 expect(new Set(products.map(p=>p.id)).size).toBe(products.length);
});
test('current Luminore catalogue retains filled SELL COST rows and owner-confirmed additions',()=>{
 expect(products.filter(p=>p.sourceBrand==='Luminore')).toEqual(luminoreProducts);
 for(const row of luminoreCatalogue.products){
  const p=products.find(p=>p.sourceSheetRow===row.row)!;
  expect(p).toMatchObject({priceUsd:row.price,nameEn:row.nameEn,metalType:row.metal,certificateNumber:row.certificateNumber});
  expect(p.priceUsd).toBeGreaterThan(0);
  expect(p.images).toEqual(row.images);
 }
 expect(luminoreProducts.some(p=>[21,23,25,26,52,71,72,77].includes(p.sourceSheetRow!))).toBe(false);
 expect(luminoreProducts.filter(p=>p.sourceName==='Solitaire Ring')).toHaveLength(1);
 expect(products.find(p=>p.id===12)).toBeUndefined();
 expect(products.find(p=>p.id===37)).toMatchObject({totalCarat:10.09,priceUsd:5990});
 expect(products.find(p=>p.id===19)).toMatchObject({certificateNumber:'LG747596117',totalCarat:1.05});
});
test('Kite Cross keeps report carats distinct from the owner-confirmed jewellery weight',()=>{
 const p=products.find(p=>p.id===135)!;
 expect(p).toMatchObject({sourceBrand:'Luminore',priceUsd:2300,totalCarat:2.35,grossWeight:4.25,goldWeight:null,stoneCount:4,chainIncluded:true,certificateNumber:'J09261400114'});
 expect(p.sourceSheetRow).toBeUndefined();
 expect(p.images).toHaveLength(3);
 expect(productSpecs(p,'en')).toEqual(expect.arrayContaining([
  {label:'Total stone weight',value:'2.35 ct'},
  {label:'Total jewellery weight',value:'4.25 g'},
  {label:'Number of stones',value:'4'},
  {label:'Chain included',value:'Yes'},
  {label:'Report number',value:'J09261400114'},
 ]));
 for(const l of ['en','ru','uk'] as const){
  expect(catalogueWeight(p,l)).toContain('2.35');
  expect(productDescription(p,l)).toContain('2.35');
  expect(productName(p,l)).toContain('Kite');
 }
 expect(schemaProduct(p.id)).toMatchObject({offers:{price:2300,priceCurrency:'USD'}});
 expect(luminoreCatalogue.products.some(row=>row.id===135)).toBe(false);
});
test('the separate pave pear drop ring retains main, pave and gold weights without borrowing P116 facts',()=>{
 const p=products.find(p=>p.id===136)!;
 expect(p).toMatchObject({priceUsd:3800,totalCarat:2.8,mainStoneCarat:1,paveCarat:1.8,goldWeight:9,grossWeight:null,metalType:'Gold',gemstoneType:'Diamond'});
 expect(p.totalCarat).toBe(p.mainStoneCarat!+p.paveCarat!);
 expect(p.sourceSheetRow).toBeUndefined();
 expect(p.images).toHaveLength(3);
 expect(productSpecs(p,'en')).toEqual(expect.arrayContaining([
  {label:'Main stone',value:'1 ct'},
  {label:'Pavé stone weight',value:'1.8 ct'},
  {label:'Total stone weight',value:'2.8 ct'},
  {label:'Gold weight',value:'9 g'},
 ]));
 expect(productSpecs(p,'en').some(s=>s.label==='Total jewellery weight')).toBe(false);
 expect(productSpecs(p,'en').some(s=>s.label==='Report number')).toBe(false);
 expect(products.find(p=>p.id===116)).toMatchObject({priceUsd:1400,totalCarat:1.01});
 expect(schemaProduct(p.id)).toMatchObject({offers:{price:3800,priceCurrency:'USD'}});
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
 for(const p of products.filter(p=>p.sourceBrand!=='Luminore'))for(const l of ['en','ru','uk'] as const){
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
 expect(productTitle(products.find(p=>p.id===46)!,'en')).toBe('Convertible Halo Stud Earrings');
});
test('Luminore displays exact weights, earring totals and report numbers',()=>{
 const cushion=products.find(p=>p.sourceSheetRow===10)!;
 expect(productSpecs(cushion,'en')).toContainEqual({label:'Listed carat weight',value:'3.05 ct'});
 const studs=products.find(p=>p.sourceSheetRow===31)!;
 expect(productSpecs(studs,'en')).toContainEqual({label:'Total stone weight',value:'2 ct'});
 const emerald=products.find(p=>p.sourceSheetRow===24)!;
 expect(emerald.totalCarat).toBeNull();
 expect(productSpecs(emerald,'en')).toContainEqual({label:'Listed carat weight',value:'5.00*0.46 ct'});
 for(const p of luminoreProducts)if(p.certificateNumber)expect(productSpecs(p,'en')).toContainEqual({label:'Report number',value:p.certificateNumber.replace(/\n/g,'; ')});
 expect(products.find(p=>p.sourceSheetRow===17)).toMatchObject({gemstoneType:'Natural Diamond',allowNaturalOption:false});
});
test('latest Luminore one-carat studs retain one $1700 pair without changing Zoke',()=>{
 const retained=luminoreProducts.filter(p=>p.categoryEn==='Earrings'&&p.priceUsd===1700);
 expect(retained).toHaveLength(1);
 expect(retained[0]).toMatchObject({id:1,totalCarat:2,listedCarat:'1ct 1ct',perEarring:'1 + 1',priceUsd:1700});
 for(const id of [119,120,121,123])expect(products.find(p=>p.id===id)).toBeUndefined();
 for(const id of [93,94,95,96])expect(products.find(p=>p.id===id)).toMatchObject({sourceBrand:'Zoke',priceUsd:1700,totalCarat:1});
 expect(products.find(p=>p.id===126)).toMatchObject({totalCarat:10.05,perEarring:'5.02 + 5.03'});
 for(const l of ['en','ru','uk'] as const)for(const p of luminoreProducts.filter(p=>p.categoryEn==='Earrings'&&p.totalCarat!==null)){
  expect(catalogueWeight(p,l)).toStartWith(totalStoneWeightLabel(l)+': ');
  expect(catalogueWeight(p,l)).not.toMatch(/\/\s*(?:pair|пара)|\d\s*\+\s*\d/);
  expect(productSpecs(p,l).some(s=>/Individual stone weights|one earring|отдельных камней|одна серьга|окремих каменів|одна сережка/.test(s.label))).toBe(false);
 }
 expect(catalogueWeight(retained[0]!,'en')).toBe('Total stone weight: 2 ct');
});
test('approved selling prices preserve cents and match product offers',()=>{
 for(const p of products){
  expect(Math.round(p.priceUsd! * 100) / 100).toBe(p.priceUsd);
  expect(schemaProduct(p.id)).toMatchObject({offers:{price:p.priceUsd}});
 }
 expect(products.find(p=>p.id===49)!.priceUsd).toBe(2900);
 expect(products.find(p=>p.id===103)!.priceUsd).toBe(22700);
});
test('natural options do not inherit lab descriptions, grades or report numbers',()=>{
 for(const p of products)for(const l of ['en','ru','uk'] as const){
  expect(productDescription(p,l,true)).not.toMatch(/lab-grown|лаборатор/i);
  expect(productSpecs(p,l,true)).toHaveLength(2);
  expect(JSON.stringify(productSpecs(p,l,true))).not.toMatch(/772671095|781611480|LG707553522|Report number|Номер отч/);
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
 for(const p of products){const m=pageMetadata(`/product/${p.id}`);expect(m.title).toContain(productName(p,'en'));expect(m.image).toStartWith('https://www.luminorejewelry.com/');expect(schemaProduct(p.id)['@type']).toBe('Product');}
 for(const p of blogPosts)expect(pageMetadata(`/blog/${p.slug}`).title).toContain(p.titleEn);
 expect(pageMetadata('/does-not-exist').robots).toContain('noindex');
});
