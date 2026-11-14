import {writeFile} from 'node:fs/promises';
const empty={products:[],removed:[],publications:{}};
export async function syncAdminCatalogue(){
 const url=process.env.ADMIN_CATALOGUE_URL;
 if(!url){await writeFile('src/data/admin-catalogue.json',JSON.stringify(empty)+'\n');return empty;}
 if(!['https://luminore-jewelry-admin.sgufman06.chatgpt.site/catalogue.json','https://admin.luminorejewelry.com/catalogue.json'].includes(url))throw new Error('Unexpected admin catalogue destination');
 const response=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Admin catalogue unavailable; keeping the current deployment.');
 const data:any=await response.json();if(!Array.isArray(data.products)||data.products.length+(Array.isArray(data.removed)?data.removed.length:0)<1||data.products.length>1000)throw new Error('Published catalogue is empty or invalid; keeping the current deployment.');
 const ids=new Set<number>(),skus=new Set<string>();
 for(const p of data.products){
  if(!Number.isInteger(p.id)||ids.has(p.id)||!/^P\d+$/.test(p.sku)||skus.has(p.sku)||!['Luminore','Zoke'].includes(p.brand)||!['Rings','Earrings','Bracelets','Pendants','Necklaces'].includes(p.category)||typeof p.names?.en!=='string'||!p.names.en.trim()||typeof p.price!=='number'||p.price<=0||!Array.isArray(p.images)||p.images.some((src:unknown)=>typeof src!=='string'||!/^https:\/\/(www\.luminorejewelry\.com|admin\.luminorejewelry\.com|luminore-jewelry-admin\.sgufman06\.chatgpt\.site)\//.test(src)))throw new Error('Invalid published catalogue row');
  ids.add(p.id);skus.add(p.sku);
 }
 if(data.removed!==undefined&&(!Array.isArray(data.removed)||data.removed.length>1000))throw new Error('Invalid removed catalogue');
 for(const p of data.removed||[]){if(!Number.isInteger(p.id)||p.id<1||ids.has(p.id)||!/^P\d+$/.test(p.sku)||skus.has(p.sku))throw new Error('Invalid removed catalogue row');ids.add(p.id);skus.add(p.sku);}
 await writeFile('src/data/admin-catalogue.json',JSON.stringify(data)+'\n');console.log(`Loaded ${data.products.length} published admin products.`);return data;
}
