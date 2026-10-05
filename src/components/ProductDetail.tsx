import {useParams,useLocation,Link} from 'react-router-dom';
import {useEffect,useRef,useState} from 'react';
import {products} from '../data/products';
import {useLanguage} from '../i18n';
import {Footer} from './Footer';
import {DetailHeader} from './DetailHeader';
import {ProductImage} from './ProductImage';
import {useDialog} from '../hooks/useDialog';
import {choose,catalogueWeight,productName,productTitle,productDescription,productSpecGroups,requestDetail} from '../lib/product-copy';
import {formatCarat} from '../lib/carat';
import {NotFound} from './NotFound';
import {collectionPath,collectionRoute} from '../data/collections';
import {localePath} from '../lib/locale-path';
import {SITE} from '../lib/seo';
import {SavePieceButton,SavedPiecesButton} from './SavedPieces';
import '../styles/product-detail.css';
import {useBackNavigation} from '../hooks/useBackNavigation';
import {useRestoredScroll} from '../hooks/useRouteScroll';
const usd=(amount:number|null)=>amount===null?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:2}).format(amount);
export function ProductDetail(){
 const {id}=useParams();const location=useLocation();const {language:l,t}=useLanguage();
 const p=products.find(p=>p.id===Number(id));
 const restoredScroll=useRestoredScroll();
 const [index,setIndex]=useState(0);const [natural,setNatural]=useState(false);const [open,setOpen]=useState(false);const [zoom,setZoom]=useState(false);
 const [galleryZoom,setGalleryZoom]=useState(false);
 const [showSticky,setShowSticky]=useState(false);
 const actionRef=useRef<HTMLAnchorElement>(null);
 useEffect(()=>{const target=actionRef.current;if(!target)return;const observer=new IntersectionObserver(([entry])=>setShowSticky(!entry.isIntersecting&&entry.boundingClientRect.top<0));observer.observe(target);return()=>observer.disconnect();},[id]);
 const touchStart=useRef<{x:number;y:number}|null>(null);const swiped=useRef(false);
 const modal=useDialog(open,()=>{setOpen(false);setZoom(false);});
 const images=p?.images??[];
 const previousPath=location.state?.catalogPath;
 const catPath=previousPath==='/preview/atelier'?previousPath:typeof previousPath==='string'&&collectionRoute(previousPath)?previousPath:collectionPath(p?.categoryEn??'all');
 const catState={catalogPath:catPath,catalog:location.state?.catalog};
 const back=useBackNavigation(`${catPath}#products`,{catalog:catState.catalog,returnToCatalog:true});
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 const step=(delta:number)=>{setIndex(i=>(i+delta+images.length)%images.length);setZoom(false);setGalleryZoom(false);};
 useEffect(()=>{setIndex(0);setNatural(false);setOpen(false);setZoom(false);setGalleryZoom(false);if(restoredScroll===undefined)window.scrollTo(0,0);},[id]);
 if(!p)return <NotFound/>;
 const name=productName(p,l),description=productDescription(p,l,natural,false),allSpecGroups=productSpecGroups(p,l,natural);
 const pendingSpecs=allSpecGroups.flatMap(group=>group.specs).filter(spec=>spec.value===requestDetail(l)).map(spec=>spec.label);
 const specGroups=allSpecGroups.map(group=>({...group,specs:group.specs.filter(spec=>spec.value!==requestDetail(l))})).filter(group=>group.specs.length);
 const title=productTitle(p,l);
 const price=natural||p.priceUsd===null?t.product.priceOnEnquiry:usd(p.priceUsd);
 const message=pick(`Hello! I’m interested in ${name}.`,`Здравствуйте! Меня интересует ${name}.`,`Добрий день! Мене цікавить ${name}.`)+' '+(natural?pick('Natural diamonds. Price on request.','Натуральные бриллианты. Цена по запросу.','Природні діаманти. Ціна за запитом.'):price)+' '+`${SITE}${localePath(`/product/${p.id}`,l)}`;
 const whatsapp=`https://wa.me/421940600708?text=${encodeURIComponent(message)}`;
 const telegram=`https://t.me/luminore_jewelry?text=${encodeURIComponent(message)}`;
 const related=products.filter(other=>other.categoryEn===p.categoryEn&&other.id!==p.id).slice(0,3);
 const imageLabel=(i:number)=>pick(`View ${i+1} of ${images.length}`,`Фото ${i+1} из ${images.length}`,`Фото ${i+1} із ${images.length}`);
 return <div className="product-page" data-theme="light">
 <DetailHeader theme="light" back={pick('Back','Назад','Назад')} onBack={back}/>
 <main id="main-content" tabIndex={-1} className="product-main">
 <nav className="breadcrumbs" aria-label={pick("Breadcrumb","Навигационная цепочка","Навігаційний ланцюжок")}><Link to="/">{pick("Home","Главная","Головна")}</Link><span>/</span><Link to={collectionPath(p.categoryEn)}>{pick(p.categoryEn,p.category,p.categoryUk)}</Link><span>/</span><span aria-current="page">{name}</span></nav>
 <div className="product-layout">
 <header className="product-overview"> <p className="product-category">{pick(p.categoryEn,p.category,p.categoryUk)}</p>
 <h1 className={`product-title ${title.length>55?'product-title--long':''}`}>{title}</h1>
 {p.totalCarat!==null&&<p className="product-carat">{natural&&pick("Listed version: ","Версия в каталоге: ","Версія в каталозі: ")}{catalogueWeight(p,l)}</p>}
 <p className="product-mobile-price" aria-live="polite">{price}</p>
 </header>
 <div className="product-gallery">
 <div className={`product-gallery-stage product-photo${images.length?'':' product-gallery-stage--empty'}`}>
 {images.length?<><button type="button" className={`product-image-open${galleryZoom?' is-zoomed':''}`} aria-pressed={galleryZoom} onClick={event=>{if(swiped.current){swiped.current=false;return;}const img=event.currentTarget.querySelector('img');if(img){const rect=event.currentTarget.getBoundingClientRect();img.style.transformOrigin=event.detail===0?'50% 50%':`${(event.clientX-rect.left)/rect.width*100}% ${(event.clientY-rect.top)/rect.height*100}%`;}setGalleryZoom(value=>!value);}} onPointerMove={event=>{if(!galleryZoom||event.pointerType==='touch')return;const rect=event.currentTarget.getBoundingClientRect();const img=event.currentTarget.querySelector('img');if(img)img.style.transformOrigin=`${(event.clientX-rect.left)/rect.width*100}% ${(event.clientY-rect.top)/rect.height*100}%`;}} onPointerLeave={event=>{const img=event.currentTarget.querySelector('img');if(img)img.style.transformOrigin='50% 50%';}} onTouchStart={event=>{swiped.current=false;touchStart.current={x:event.touches[0].clientX,y:event.touches[0].clientY};}} onTouchEnd={event=>{if(!touchStart.current||galleryZoom||images.length<2)return;const dx=event.changedTouches[0].clientX-touchStart.current.x,dy=event.changedTouches[0].clientY-touchStart.current.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){swiped.current=true;step(dx<0?1:-1);}touchStart.current=null;}} aria-label={galleryZoom?pick('Zoom out','Уменьшить','Зменшити'):pick('Enlarge product photograph','Увеличить фотографию изделия','Збільшити фотографію виробу')}>
 <ProductImage key={images[index]} src={images[index]} alt={name} sizes={galleryZoom?'100vw':'(max-width: 767px) 100vw, (max-width: 1023px) 680px, 55vw'} loading="eager" className="product-main-image"/>
 </button>{images.length>1&&<><button className="gallery-arrow gallery-arrow--previous" onClick={()=>step(-1)} aria-label={pick('Previous image','Предыдущее фото','Попереднє фото')}>‹</button><button className="gallery-arrow gallery-arrow--next" onClick={()=>step(1)} aria-label={pick('Next image','Следующее фото','Наступне фото')}>›</button><span className="sr-only" aria-live="polite">{index+1} / {images.length}</span></>}</>:<div className="product-image-empty"><span className="photo-unavailable">{pick("Photographs available on request","Фотографии — по запросу","Фотографії — за запитом")}</span><a className="text-button" href={`https://wa.me/421940600708?text=${encodeURIComponent(message+' '+pick('Please send photographs.','Пришлите, пожалуйста, фотографии.','Надішліть, будь ласка, фотографії.'))}`} target="_blank" rel="noopener noreferrer">{pick("Request photos","Запросить фото","Запитати фото")} ↗</a></div>}
 </div>
 {images.length>0&&<div className="product-photo-tools"><span>{imageLabel(index)}</span><button type="button" className="text-button" onClick={()=>{setOpen(true);setZoom(false);}}>{pick('Full-screen view','На весь экран','На весь екран')} <span aria-hidden="true">↗</span></button></div>}
 {images.length>1&&<div className="product-thumbnails" role="group" aria-label={pick('Product photographs','Фотографии изделия','Фотографії виробу')}>
 {images.map((src,i)=><button key={src} className={`product-thumbnail ${index===i?'is-selected':''}`} onClick={()=>{setIndex(i);setGalleryZoom(false);}} aria-label={imageLabel(i)} aria-pressed={index===i}><ProductImage src={src} alt="" sizes="(max-width: 767px) 84px, 132px" loading="lazy" className="w-full h-full object-contain"/></button>)}
 </div>}
 </div>
 <div className="product-information">
 <div className="stone-options" role="group" aria-label={t.product.stones}>
 <button aria-pressed={natural} className={natural?'selected':''} onClick={()=>setNatural(true)}><span>{t.product.naturalDiamond}</span><small>{t.product.priceOnEnquiry}</small></button>
 <button aria-pressed={!natural} className={!natural?'selected':''} onClick={()=>setNatural(false)}>{p.gemstoneType==='Lab-Grown Diamond'?t.product.labGrownDiamond:pick('Listed version','Версия в каталоге','Версія в каталозі')}</button>
 </div>
 {!natural&&(!p.gemstoneType||p.gemstoneType==='Not Specified')&&<p className="product-order-note">{pick("This price is for the catalogued version. We’ll confirm the stone’s origin and specifications before you order.","Цена указана для версии в каталоге. Происхождение и характеристики камня уточним до заказа.","Ціна вказана для версії в каталозі. Походження та характеристики каменю уточнимо до замовлення.")}</p>}
 <div className="stone-price-region" aria-live="polite" aria-atomic="true"><p key={String(natural)} className={`product-price stone-transition ${natural?'product-price--enquiry':''}`}>{price}</p></div>
 <a ref={actionRef} href="#product-enquiry" className="product-enquire-button" onClick={()=>requestAnimationFrame(()=>document.getElementById("product-enquiry")?.focus({preventScroll:true}))}>{pick('Enquire about this piece','Узнать об этом украшении','Дізнатися про цю прикрасу')}</a>
 <section id="product-enquiry" tabIndex={-1} className="product-details-section product-enquiry" aria-labelledby="enquiry-heading">
 <h2 id="enquiry-heading" >{pick('Let’s find your piece','Подберём ваше украшение','Доберемо вашу прикрасу')}</h2>
 <div className="product-contact-links"><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="product-contact-primary">{t.product.whatsapp}</a><a href={telegram} target="_blank" rel="noopener noreferrer" className="product-contact-secondary">{t.product.telegram}</a></div>
 <p className="product-order-note">{pick("We’ll discuss availability, timing and delivery costs before you order.","До заказа обсудим наличие, сроки и стоимость доставки.","До замовлення обговоримо наявність, строки й вартість доставки.")} <Link to="/information/delivery" className="text-button">{pick("Delivery details","О доставке","Про доставку")}</Link></p>
 <p className="product-contact-phone">{t.product.orCall} <a href="tel:+421940600708" className="underline underline-offset-4">+421 940 600 708</a></p>
 </section>
 <div className="product-save-row"><SavePieceButton product={p} text /><SavedPiecesButton text /></div>
 <p key={`description-${natural}`} className="product-description stone-transition">{description}</p>
 <section className="product-details-section" aria-labelledby="spec-heading"><h2 id="spec-heading" >{t.product.specifications}</h2>
 <div className="product-spec-groups">{specGroups.map(group=><div className="product-spec-group" key={group.title}><h3>{group.title}</h3><dl className="product-specs">{group.specs.map(s=><div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl></div>)}</div>
 {!natural&&pendingSpecs.length>0&&<p className="product-spec-pending">{pick('We’ll confirm before you order:','Перед заказом уточним:','Перед замовленням уточнимо:')} {pendingSpecs.join('; ')}.</p>}
 </section>

 </div></div>
 </main>
 <section className="product-related"><h2 >{t.product.related} {t.product.relatedSuffix}</h2><div className="product-related-grid">{related.map(other=><Link key={other.id} to={`/product/${other.id}`} state={catState} className="product-related-item" aria-labelledby={`related-name-${other.id}`}><div className="product-related-photo product-photo">{other.images.length?<ProductImage src={other.images[0]} alt="" loading="lazy" className="w-full h-full object-contain"/>:<span className="flex h-full items-center justify-center text-graphite text-sm tracking-widest">LUMINORE</span>}</div><h3 id={`related-name-${other.id}`}>{productName(other,l)}</h3><p >{usd(other.priceUsd)}</p></Link>)}</div></section>
 {open&&images.length>0&&<div ref={modal} role="dialog" aria-modal="true" aria-label={pick('Product photographs','Фотографии изделия','Фотографії виробу')} tabIndex={-1} className="product-lightbox" onClick={()=>setOpen(false)} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}}}>
 <button className="product-lightbox-close" aria-label={pick('Close','Закрыть','Закрити')} onClick={()=>setOpen(false)}>×</button>
 <button className="product-lightbox-image" aria-label={zoom?pick('Zoom out','Уменьшить','Зменшити'):pick('Zoom in','Увеличить','Збільшити')} aria-pressed={zoom} onClick={e=>{e.stopPropagation();setZoom(!zoom);}}><ProductImage src={images[index]} alt={name} sizes="90vw" className={`max-h-[75vh] object-contain ${zoom?'scale-150':'scale-100'}`}/></button>
 {images.length>1&&<><button className="gallery-arrow gallery-arrow--previous" aria-label={pick('Previous image','Предыдущее фото','Попереднє фото')} onClick={e=>{e.stopPropagation();step(-1);}}>‹</button><button className="gallery-arrow gallery-arrow--next" aria-label={pick('Next image','Следующее фото','Наступне фото')} onClick={e=>{e.stopPropagation();step(1);}}>›</button><p className="product-lightbox-counter" aria-live="polite">{imageLabel(index)}</p></>}
 </div>}
 {showSticky&&<div className="mobile-product-action"><span>{price}</span><a href="#product-enquiry" onClick={()=>requestAnimationFrame(()=>document.getElementById("product-enquiry")?.focus({preventScroll:true}))}>{pick("Enquire","Написать","Написати")} →</a></div>}
 <Footer theme="light"/>
 </div>;
}
