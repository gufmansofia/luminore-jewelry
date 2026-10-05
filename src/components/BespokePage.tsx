import { useRestoredScroll } from '../hooks/useRouteScroll';
import { useBackNavigation } from '../hooks/useBackNavigation';
import {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { DetailHeader } from './DetailHeader';
import { CTA } from './CTA';
import { Footer } from './Footer';
export function BespokePage() {
  const restoredScroll=useRestoredScroll();
  useEffect(()=>{if(restoredScroll===undefined)window.scrollTo(0,0);},[restoredScroll]);
 const {language:l}=useLanguage(); const goBack=useBackNavigation('/#custom-order');
  return <div className="collection-page" data-theme="light"><DetailHeader theme="light" back={choose(l,'Back','Назад','Назад')} onBack={goBack} /><main id="main-content" tabIndex={-1}><nav className="site-breadcrumbs editorial-container" aria-label={choose(l,'Breadcrumb','Навигационная цепочка','Навігаційний ланцюжок')}><Link to="/">{choose(l,'Home','Главная','Головна')}</Link><span aria-hidden="true">/</span><span aria-current="page">{choose(l,'Custom jewellery','Индивидуальный заказ','Індивідуальне замовлення')}</span></nav><CTA standalone /></main><Footer theme="light" /></div>;
}
