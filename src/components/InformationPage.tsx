import { useRestoredScroll } from '../hooks/useRouteScroll';
import { useBackNavigation } from '../hooks/useBackNavigation';
import {useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {information} from '../data/information';
import {useLanguage} from '../i18n';
import {choose} from '../lib/product-copy';
import {DetailHeader} from './DetailHeader';
import {Footer} from './Footer';
import {NotFound} from './NotFound';
export function InformationPage(){
 const goBack=useBackNavigation('/#contact');
 const {topic}=useParams(),{language:l}=useLanguage();
 const restoredScroll=useRestoredScroll();
 useEffect(()=>{if(restoredScroll===undefined)window.scrollTo(0,0);},[topic,restoredScroll]);
 const content=information[topic??'']?.[l];
 if(!content)return <NotFound/>;
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 return <div className="information-page" data-theme="light"><DetailHeader theme="light" back={pick("Back","Назад","Назад")} onBack={goBack}/><main id="main-content" tabIndex={-1} className="editorial-container"><nav className="breadcrumbs" aria-label={pick('Breadcrumb','Навигационная цепочка','Навігаційний ланцюжок')}><Link to="/">{pick('Home','Главная','Головна')}</Link><span>/</span><span aria-current="page">{content.title}</span></nav><article className="information-body"><h1>{content.title}</h1>{content.paragraphs.map(text=><p key={text}>{text}</p>)}{topic==='care'&&<Link to="/blog/diamond-care-guide" className="text-button">{pick('Read the care guide','Читать об уходе','Читати про догляд')} →</Link>}<div className="information-contact"><a href="https://t.me/luminore_jewelry" target="_blank" rel="noopener noreferrer">Telegram</a><a href="mailto:jewelry@luminore.eu">jewelry@luminore.eu</a></div></article></main><Footer theme="light"/></div>;
}
