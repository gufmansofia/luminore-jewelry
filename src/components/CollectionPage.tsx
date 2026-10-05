import { useBackNavigation } from '../hooks/useBackNavigation';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { collectionRoute, collectionText } from '../data/collections';
import { products } from '../data/products';
import { PAGE_SIZE } from '../lib/catalogue';
import { DetailHeader } from './DetailHeader';
import { Products } from './Products';
import { Footer } from './Footer';
import { NotFound } from './NotFound';
import { useRestoredScroll } from '../hooks/useRouteScroll';

export function CollectionPage() {
  const { pathname } = useLocation();
  const goBack = useBackNavigation('/#products');
  const { language: l } = useLanguage();
  const route = collectionRoute(pathname);
  const restoredScroll = useRestoredScroll();
  useEffect(() => { if (restoredScroll === undefined) window.scrollTo({top:0,behavior:'instant'}); }, [pathname, restoredScroll]);
  if (!route) return <NotFound />;
  const count = products.filter(p => !route.collection || p.categoryEn === route.collection.category).length;
  if (route.page > Math.ceil(count / PAGE_SIZE)) return <NotFound />;
  const title = route.collection ? collectionText(route.collection.name,l) : choose(l,'Jewellery collection','Коллекция украшений','Колекція прикрас');
  return <div className="collection-page" data-theme="light">
    <DetailHeader theme="light" back={choose(l,'Back','Назад','Назад')} backFirst onBack={goBack} />
    <main id="main-content" tabIndex={-1}>
      <nav className="site-breadcrumbs editorial-container" aria-label={choose(l,'Breadcrumb','Навигационная цепочка','Навігаційний ланцюжок')}><Link to="/">{choose(l,'Home','Главная','Головна')}</Link><span aria-hidden="true">/</span>{route.collection ? <><Link to="/collection">{choose(l,'Collection','Коллекция','Колекція')}</Link><span aria-hidden="true">/</span></> : null}<span aria-current="page">{title}</span></nav>
      <Products key={pathname} categoryKey={route.collection?.category} page={route.page} paginated title={title} intro={route.collection ? collectionText(route.collection.description,l) : undefined} />
    </main><Footer theme="light" />
  </div>;
}
