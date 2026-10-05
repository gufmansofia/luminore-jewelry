import {expect,test} from 'bun:test';
import {filterCatalogue,withinBudget} from '../src/lib/catalogue';
import {products} from '../src/data/products';
import {catalogueName,catalogueWeight} from '../src/lib/product-copy';
import {validateEnquiry} from '../src/lib/enquiry-validation';
import type {Enquiry} from '../src/lib/enquiry';

test('budget bands have no gaps or double-counted boundaries and exclude unpriced pieces',()=>{
 const bands=['under-2000','2000-5000','5000-15000','15000-plus'];
 for(const value of [0,1999,2000,4999,5000,14999,15000,100000])expect(bands.filter(b=>withinBudget(value,b))).toHaveLength(1);
 for(const band of bands)expect(withinBudget(null,band)).toBe(false);
 expect(withinBudget(null,'all')).toBe(true);
 const filtered=filterCatalogue(products,'','Rings','low-to-high','under-2000');
 expect(filtered.length).toBeGreaterThan(0);
 expect(filtered.every(p=>p.categoryEn==='Rings'&&p.priceUsd!==null&&p.priceUsd<2000)).toBe(true);
 expect(filtered.map(p=>p.priceUsd)).toEqual(filtered.map(p=>p.priceUsd).sort((a,b)=>a!-b!));
});
test('card weights are separate from names and do not invent an unconfirmed pair basis',()=>{
 for(const l of ['en','ru','uk'] as const) for(const p of products){
  expect(catalogueName(p,l)).not.toMatch(/\d+(?:[.,]\d+)?\s*(?:ct\b|кар\.)/i);
  if(p.totalCarat===null)expect(catalogueWeight(p,l)).toBe('');
  if(p.caratBasis==='unconfirmed')expect(catalogueWeight(p,l)).not.toMatch(/pair|пара/);
 }
});
test('localized enquiry validation catches whitespace, malformed email and consent without losing draft data',()=>{
 const draft:Enquiry={name:' ',email:'not-an-address',phone:'',piece:'',details:' '};
 for(const l of ['en','ru','uk'] as const){
  expect(Object.keys(validateEnquiry(draft,false,l,false))).toEqual(['name','email','details','consent']);
  expect(validateEnquiry({...draft,name:'Анна',email:'anna@example.com',details:'Кольцо & серьги'},true,l,false)).toEqual({});
  expect(validateEnquiry({...draft,name:'Анна',email:''},true,l,true)).toHaveProperty('piece');
  expect(validateEnquiry({...draft,name:'Анна',email:''},true,l,true,true)).toEqual({});
 }
 expect(draft.name).toBe(' ');
});
