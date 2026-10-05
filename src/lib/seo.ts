import {information} from '../data/information';
import {products} from '../data/products';
import {blogPosts} from '../data/blogs';
import {collections,collectionRoute,collectionText,collectionPath} from '../data/collections';
import {choose,productName,productDescription} from './product-copy';
import type {Language} from '../i18n/translations';
import {imageSources} from './images';
import {basePath,localePath,languages} from './locale-path';
import {PAGE_SIZE} from './catalogue';
export const SITE='https://luminore.eu';
export const organization={'@type':'Organization',name:'Luminore',url:SITE,telephone:'+421940600708',email:'jewelry@luminore.eu',sameAs:['https://www.instagram.com/luminore_jewelry/']};
export function publicRoutes() {
 const categoryRoutes=['all',...collections.map(c=>c.category)].flatMap(category=>{
  const count=products.filter(p=>category==='all'||p.categoryEn===category).length;
  const path=collectionPath(category);
  return Array.from({length:Math.ceil(count/PAGE_SIZE)},(_,i)=>i===0?path:`${path}/page/${i+1}`);
 });
 return ['/',...categoryRoutes,'/bespoke','/journal',...Object.keys(information).map(key=>`/information/${key}`),...products.map(p=>`/product/${p.id}`),...blogPosts.map(p=>`/blog/${p.slug}`)];
}
export const alternateUrls=(path:string)=>[...languages,'x-default'].map(l=>({language:l,url:SITE+localePath(path,l==='x-default'?'en':l as Language)}));
export function pageMetadata(path:string,l:Language='en'){
 path=basePath(path).replace(/\/$/,'')||'/';
 const product=products.find(p=>path===`/product/${p.id}`);
 const post=blogPosts.find(p=>path===`/blog/${p.slug}`);
 const home=path==='/'||path==='/preview/atelier',journal=path==='/journal',bespoke=path==='/bespoke';
 const info=path.startsWith('/information/')?information[path.split('/')[2]]?.[l]:undefined;
 const collection=collectionRoute(path);
 const validCollection=collection && collection.page<=Math.ceil(products.filter(p=>!collection.collection||p.categoryEn===collection.collection.category).length/PAGE_SIZE);
 const missing=!product&&!post&&!home&&!journal&&!bespoke&&!info&&!validCollection;
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 let title=info?info.title:product?productName(product,l):post?pick(post.titleEn,post.title,post.titleUk):journal?pick('Jewellery guides and care','Журнал об украшениях','Журнал про прикраси'):bespoke?pick('Custom diamond jewellery','Украшения с бриллиантами на заказ','Прикраси з діамантами на замовлення'):validCollection?(collection.collection?collectionText(collection.collection.name,l):pick('Jewellery collection','Коллекция украшений','Колекція прикрас')):missing?pick('Page not found','Страница не найдена','Сторінку не знайдено'):pick('Natural & lab-grown diamond jewellery','Украшения с натуральными и лабораторными бриллиантами','Прикраси з природними та лабораторними діамантами');
 if(validCollection && collection.page>1)title+=pick(` — Page ${collection.page}`,` — Страница ${collection.page}`,` — Сторінка ${collection.page}`);
 const fullDescription=info?info.paragraphs[0]:product?productDescription(product,l):post?pick(post.excerptEn,post.excerpt,post.excerptUk):validCollection&&collection.collection?collectionText(collection.collection.description,l):bespoke?pick('Discuss your design, stones and budget with Luminore. Explore a custom ring, earrings, bracelet, pendant or necklace, then prepare an enquiry in Telegram.','Обсудите с Luminore дизайн, камни и бюджет украшения на заказ. Выберите основные детали и подготовьте заявку в Telegram.','Обговоріть із Luminore дизайн, камені та бюджет прикраси на замовлення. Оберіть основні деталі й підготуйте заявку в Telegram.'):journal?pick('Practical guides to choosing stones, understanding settings and caring for diamond jewellery.','Как выбрать камни и оправу, разобраться в характеристиках и ухаживать за украшениями.','Як обрати камені й оправу, розібратися в характеристиках і доглядати за прикрасами.'):pick('Explore Luminore rings, earrings, bracelets, pendants and necklaces. Choose natural or lab-grown diamonds, from the collection or in a custom design.','Кольца, серьги, браслеты, подвески и колье Luminore. Натуральные или лабораторные бриллианты, украшения из коллекции или на заказ.','Каблучки, сережки, браслети, підвіски та кольє Luminore. Природні або лабораторні діаманти, прикраси з колекції або на замовлення.');
 const description=fullDescription.length>170?fullDescription.slice(0,167).replace(/\s+\S*$/,'')+'…':fullDescription;
 const image=product?.images[0]||post?.image||'/optimized/atelier-desktop-1200.webp';
 const canonical=SITE+localePath(path,l),imageUrl=new URL(imageSources(image,1600).src,SITE).href;
 let schema:Record<string,unknown>=product?{'@context':'https://schema.org','@type':'Product',name:title,description,sku:product.sku,brand:{'@type':'Brand',name:'Luminore'},url:canonical,...(product.images.length?{image:product.images.map(src=>new URL(imageSources(src,1600).src,SITE).href)}:{}),...(product.priceUsd!==null?{offers:{'@type':'Offer',url:canonical,priceCurrency:'USD',price:product.priceUsd}}:{})}:post?{'@context':'https://schema.org','@type':'Article',headline:title,description,image:imageUrl,inLanguage:l,mainEntityOfPage:canonical,publisher:organization,author:organization,dateModified:post.updatedAt,citation:post.sources.map(source=>source.url)}:validCollection?{'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url:canonical,inLanguage:l}:{'@context':'https://schema.org',...organization};
 const crumbs: {name:string;path:string}[]=[{name:pick('Home','Главная','Головна'),path:'/'}];
 if(product){const category=collections.find(c=>c.category===product.categoryEn);crumbs.push({name:category?collectionText(category.name,l):product.categoryEn,path:collectionPath(product.categoryEn)},{name:title,path});}
 else if(post)crumbs.push({name:pick('Journal','Журнал','Журнал'),path:'/journal'},{name:title,path});
 else if(validCollection){crumbs.push({name:pick('Collection','Коллекция','Колекція'),path:'/collection'});if(path!=='/collection')crumbs.push({name:title,path});}
 else if(bespoke||info)crumbs.push({name:title,path});
 if(crumbs.length>1){const {'@context':context,...entity}=schema;schema={'@context':context,'@graph':[entity,{'@type':'BreadcrumbList',itemListElement:crumbs.map((crumb,i)=>({'@type':'ListItem',position:i+1,name:crumb.name,item:SITE+localePath(crumb.path,l)}))}]};}
 return {title:`${title} | Luminore`,description,canonical,image:imageUrl,type:post?'article':'website',robots:missing||path.startsWith('/preview/')?'noindex, follow':'index, follow',schema,missing,alternates:missing||path.startsWith('/preview/')?[]:alternateUrls(path)};
}
