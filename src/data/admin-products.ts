import type {Product} from './products';
const categoryNames:Record<string,[string,string]>={Rings:['Кольца','Каблучки'],Earrings:['Серьги','Сережки'],Bracelets:['Браслеты','Браслети'],Pendants:['Подвески','Підвіски'],Necklaces:['Колье','Кольє']};
export interface PublishedAdminProduct{
 id:number;sku:string;brand:'Luminore'|'Zoke';category:string;names:{en:string;ru:string;uk:string};descriptions:{en:string;ru:string;uk:string};price:number;totalCarat:number|null;metal:string;stoneType:string;cut:string;colour:string;clarity:string;size:string;grossWeight:number|null;goldWeight:number|null;mainStoneCarat:number|null;paveCarat:number|null;certificate:string;certificateNumber:string;chainIncluded:boolean|null;kids:boolean;images:string[];altText:string;
}
export function mergeAdminProducts(baseline:Product[],incoming:PublishedAdminProduct[]):Product[]{
 const result=[...baseline];
 for(const p of incoming){
  if(!Number.isInteger(p.id)||p.id<1||!/^P\d+$/.test(p.sku)||!categoryNames[p.category]||!p.names.en.trim()||!Number.isFinite(p.price)||p.price<=0)throw new Error('Invalid published product');
  const index=result.findIndex(row=>row.sku===p.sku),base=index<0?undefined:result[index];
  if(base&&base.id!==p.id||result.some(row=>row.id===p.id&&row.sku!==p.sku))throw new Error(`Published product identity conflict: ${p.sku}`);
  const [category,categoryUk]=categoryNames[p.category]!;
  const updated:Product={...base,id:p.id,sku:p.sku,name:p.names.ru||p.names.en,nameEn:p.names.en,nameUk:p.names.uk||p.names.en,category,categoryEn:p.category,categoryUk,productType:base?.productType||p.category,metalType:p.metal,goldWeight:p.goldWeight,gemstoneType:p.stoneType,totalCarat:p.totalCarat,mainStoneCarat:p.mainStoneCarat,paveCarat:p.paveCarat??undefined,diamondColor:p.colour,diamondClarity:p.clarity,diamondCut:p.cut,certificateType:p.certificate,certificateNumber:p.certificateNumber,chainIncluded:p.chainIncluded??undefined,price:String(p.price),priceUsd:p.price,description:p.descriptions.ru||p.descriptions.en,descriptionEn:p.descriptions.en,descriptionUk:p.descriptions.uk||p.descriptions.en,careInstructions:base?.careInstructions||'',images:p.images,altText:p.altText,seoTags:base?.seoTags||`${p.brand}, ${p.category}, ${p.stoneType}`,sourceBrand:p.brand,size:p.size,grossWeight:p.grossWeight,adminManaged:true,adminKids:p.kids,adminPhotoOverride:!base||JSON.stringify(p.images.map(src=>src.replace(/^https:\/\/www\.luminorejewelry\.com/,'')))!==JSON.stringify(base.images),listedCarat:undefined,caratBasis:'total',perEarring:undefined};
  if(index<0)result.push(updated);else result[index]=updated;
 }
 return result;
}
