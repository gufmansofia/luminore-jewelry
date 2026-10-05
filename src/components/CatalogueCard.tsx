import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useLanguage } from '../i18n';
import { choose, catalogueName, catalogueWeight, productName } from '../lib/product-copy';
import { ProductImage } from './ProductImage';
import { SavePieceButton } from './SavedPieces';
import { cataloguePhoto } from '../lib/catalogue-photo';

export function CatalogueCard({ product: p, state, onOpen }: { product: Product; state: unknown; onOpen: () => void }) {
  const { language: l, t } = useLanguage();
  const [alternate, setAlternate] = useState(false);
  const [loadAlternate, setLoadAlternate] = useState(false);
  const showAlternate = (show: boolean) => { if (show) setLoadAlternate(true); setAlternate(show); };
  const name = productName(p, l);
  const cover = cataloguePhoto(p);
  return <article className={`catalogue-card${alternate ? ' is-alternate' : ''}${!p.images.length ? ' catalogue-card--no-photo' : ''}`} onPointerEnter={e => { if (e.pointerType === 'mouse' && p.images.length > 1) showAlternate(true); }} onPointerLeave={e => { if (e.pointerType === 'mouse') showAlternate(false); }}>
    <Link to={`/product/${p.id}`} state={state} onClick={onOpen} className="catalogue-card-link" aria-label={name} aria-describedby={`product-price-${p.id}`}>
      <div className={`catalogue-photo${cover.closeUp ? ' catalogue-photo--detail' : ''}`} style={cover.style}>{p.images.length ? <><ProductImage src={cover.src} className="catalogue-cover-image" alt="" sizes={`(max-width: 700px) ${45 * cover.scale}vw, ${30 * cover.scale}vw`} loading="lazy" />{loadAlternate && cover.alternate && <ProductImage src={cover.alternate} alt="" className="catalogue-alternate-image" sizes="(max-width: 700px) 45vw, 30vw" loading="eager" />}</> : <span className="photo-unavailable">{choose(l, 'Photo on request', 'Фото по запросу', 'Фото за запитом')}</span>}</div>
      <div className="catalogue-card-info"><h3 id={`product-name-${p.id}`}>{catalogueName(p,l)}</h3>{catalogueWeight(p,l)&&<p className="catalogue-card-facts">{catalogueWeight(p,l)}</p>}<p className="catalogue-card-price" id={`product-price-${p.id}`}>{p.priceUsd === null ? t.product.priceOnEnquiry : '$' + p.priceUsd.toLocaleString('en-US')}</p></div>
    </Link>
    {!p.images.length && <a className="catalogue-request-photo" href={`https://wa.me/421940600708?text=${encodeURIComponent(choose(l,`Please send photographs of ${name} (${p.sku}).`,`Пришлите, пожалуйста, фотографии ${name} (${p.sku}).`,`Надішліть, будь ласка, фотографії ${name} (${p.sku}).`))}`} target="_blank" rel="noopener noreferrer">{choose(l,'Request photo','Запросить фото','Запитати фото')} ↗</a>}
    <SavePieceButton product={p} />
  </article>;
}
