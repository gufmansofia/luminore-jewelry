import React, { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { imageSources } from '../src/lib/images';
import { formatCarat } from '../src/lib/carat';
import { categories, emptyProduct, productStatus, roleLabels, statusLabels, type AdminProduct, type Locale, type Member, type ProductData, type Revision } from './types';
import './studio.css';

const paths: Record<string,string> = {
  plus:'M12 5v14M5 12h14', search:'m21 21-4.4-4.4M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  arrow:'m15 18-6-6 6-6', next:'m9 18 6-6-6-6', check:'m5 12 4 4L19 6', close:'m6 6 12 12M6 18 18 6',
  gem:'m3 8 4-5h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18', users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3a4 4 0 0 1 0 8M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h6',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m-8 5h13',
  filter:'M4 6h16M7 12h10M10 18h4', upload:'M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7', up:'m6 14 6-6 6 6', down:'m6 10 6 6 6-6',
  copy:'M9 9h11v12H9V9ZM5 16H3V3h11v2', mail:'M3 5h18v14H3V5Zm0 0 9 8 9-8', clock:'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  lock:'M5 10h14v11H5V10Zm3 0V6a4 4 0 0 1 8 0v4', external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
};
function Icon({name,...props}:{name:string;className?:string}) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]||paths.gem}/></svg>; }
const usd=(value:number|null)=>value===null?'Цена не указана':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
const date=(value:string)=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value));
class ApiError extends Error { constructor(public status:number,message:string){super(message);} }
async function api<T>(path:string,options:RequestInit={}):Promise<T> {
  let response:Response;
  try { response=await fetch(`/api${path}`,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers},credentials:'same-origin'}); }
  catch { throw new ApiError(0,'Не удалось подключиться к локальной панели. Убедитесь, что она запущена, и повторите попытку.'); }
  let result:any;
  try { result=await response.json(); }
  catch { throw new ApiError(response.status,response.status===413?'Размер фотографии должен быть не больше 15 МБ.':'Сервер не ответил. Попробуйте ещё раз.'); }
  if(!response.ok){if(response.status===401&&path!=='/session')window.dispatchEvent(new Event('studio-session-ended'));throw new ApiError(response.status,result.error||'Не удалось выполнить запрос.');}
  return result;
}
function Photo({src,name,className='',eager=false}:{src?:string;name:string;className?:string;eager?:boolean}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  return src&&!failed?<img className={className} src={imageSources(src,480).src} alt={name} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>:<div className={`studio-photo-empty ${className}`}><Icon name="gem"/><span>Фото не добавлено</span></div>;
}
function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}) {return <label className="studio-field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>;}
function Status({product}:{product:AdminProduct}){const status=productStatus(product);return <span className={`studio-status studio-status--${status}`}>{statusLabels[status]}</span>;}
function Loading(){return <div className="studio-loading" role="status"><span className="studio-wordmark">LUMINORE</span><span className="studio-spinner"/>Открываем студию…</div>;}
function Login({onLogin}:{onLogin:(user:Member)=>void}) {
  const [email,setEmail]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError('');try{const result=await api<{user:Member}>('/login',{method:'POST',body:JSON.stringify({email})});onLogin(result.user);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <div className="studio-login"><header className="studio-login-header"><span className="studio-wordmark">LUMINORE</span><span className="studio-local-badge">Локальный прототип</span></header><main className="studio-login-main"><section className="studio-login-form"><div className="studio-access-label"><Icon name="lock"/>Только по приглашению</div><h1>Ваша коллекция.<br/><em>В одном месте.</em></h1><p className="studio-login-intro">Украшения, фотографии и цены —<br/>всё для работы вашей команды.</p><form onSubmit={submit}><Field label="Ваша почта"><input type="email" required autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></Field>{error&&<p className="studio-error" role="alert">{error}</p>}<button className="studio-primary" disabled={busy}>{busy?'Открываем…':<>Войти в каталог<Icon name="next"/></>}</button><p className="studio-login-help">Введите email, который владелец добавил в список приглашённых.</p></form><p className="studio-prototype-note">На localhost вход без пароля и подтверждения почты. Письма не отправляются.</p></section><div className="studio-login-jewel"><Photo src="/Products/Rings/Yellow Pear Ring (P024)/yellow-pear-front-v1.png" name="Yellow Pear Ring" eager/><div><span>THE STUDIO</span><p>Меньше таблиц.<br/>Больше внимания к деталям.</p></div></div></main><footer className="studio-login-footer">LUMINORE STUDIO <span>Только локальная копия каталога</span></footer></div>;
}
type StudioProps={user:Member;onLogout:()=>void};
type CatalogueFilters={query:string;brand:string;category:string;stone:string;kids:boolean;sort:string};
const defaultFilters:CatalogueFilters={query:'',brand:'',category:'',stone:'',kids:false,sort:'recent'};
function Studio({user,onLogout}:StudioProps) {
  const [products,setProducts]=useState<AdminProduct[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[toast,setToast]=useState(''),[accountOpen,setAccountOpen]=useState(false);
  const [filters,setFilters]=useState(defaultFilters),scroll=useRef(0),location=useLocation();
  useEffect(()=>{api<{products:AdminProduct[]}>('/products').then(r=>setProducts(r.products)).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),6500);return()=>clearTimeout(timer);},[toast]);
  useEffect(()=>{setAccountOpen(false);},[location.pathname]);
  const update=(p:AdminProduct)=>setProducts(current=>[p,...current.filter(other=>other.data.id!==p.data.id)]);
  const draftCount=products.filter(p=>p.hasChanges||!p.published).length;
  const logout=async()=>{try{await api('/logout',{method:'POST'});onLogout();}catch(e){setToast((e as Error).message);}};
  const nav=[{path:'/admin',name:'Каталог',icon:'gem',active:location.pathname==='/admin'}, {path:'/admin/drafts',name:'Черновики',icon:'file',active:location.pathname==='/admin/drafts'},...(user.role==='owner'?[{path:'/admin/invitations',name:'Приглашения',icon:'users',active:location.pathname==='/admin/invitations'}]:[])];
  return <div className={`studio-app${location.pathname.startsWith('/admin/products/')||location.pathname==='/admin/new'?' studio-app--editor':''}`}><div className="studio-local-strip"><span className="studio-local-dot"/>Локальная копия<span className="studio-local-extra"> · изменения сохраняются только здесь</span></div><header className="studio-header"><Link to="/admin" className="studio-brand"><span className="studio-wordmark">LUMINORE</span><span>STUDIO</span></Link><nav className="studio-desktop-nav" aria-label="Основные разделы">{nav.map(n=><Link to={n.path} key={n.path} aria-current={n.active?'page':undefined}>{n.name}{n.icon==='file'&&draftCount>0&&<span className="studio-nav-count">{draftCount}</span>}</Link>)}</nav><div className="studio-account"><button className="studio-avatar" aria-label="Мой аккаунт" aria-expanded={accountOpen} onClick={()=>setAccountOpen(v=>!v)}>{user.email.slice(0,1).toUpperCase()}</button>{accountOpen&&<div className="studio-account-menu"><strong>{user.email}</strong><small>{roleLabels[user.role]}</small><button onClick={logout}><Icon name="logout"/>Выйти</button></div>}</div></header>{toast&&<div className="studio-toast" role="status"><Icon name="check"/><span>{toast}</span><button aria-label="Закрыть уведомление" onClick={()=>setToast('')}><Icon name="close"/></button></div>}<main className="studio-content" id="main-content">{error?<div className="studio-empty"><p role="alert">{error}</p><button className="studio-secondary" onClick={()=>window.location.reload()}>Попробовать снова</button></div>:loading?<Loading/>:<Routes><Route path="/admin" element={<Catalogue products={products} filters={filters} setFilters={setFilters} scroll={scroll}/>}/><Route path="/admin/drafts" element={<Catalogue products={products} filters={filters} setFilters={setFilters} drafts scroll={scroll}/>}/><Route path="/admin/new" element={<ProductEditor user={user} update={update} notify={setToast}/>}/><Route path="/admin/products/:id" element={<ProductEditor key={location.pathname} user={user} update={update} notify={setToast}/>}/><Route path="/admin/invitations" element={user.role==='owner'?<Invitations user={user} notify={setToast}/>:<Navigate to="/admin" replace/>}/><Route path="*" element={<Navigate to="/admin" replace/>}/></Routes>}</main><nav className="studio-mobile-nav" aria-label="Разделы админ-панели">{nav.map(n=><Link to={n.path} key={n.path} aria-current={n.active?'page':undefined}><span className="studio-mobile-nav-icon"><Icon name={n.icon}/>{n.icon==='file'&&draftCount>0&&<span>{draftCount}</span>}</span>{n.name}</Link>)}</nav></div>;
}
function Catalogue({products,filters,setFilters,drafts=false,scroll}:{products:AdminProduct[];filters:CatalogueFilters;setFilters:React.Dispatch<React.SetStateAction<CatalogueFilters>>;drafts?:boolean;scroll:React.MutableRefObject<number>}) {
  const [extra,setExtra]=useState(false),[limit,setLimit]=useState(24);
  useEffect(()=>{const frame=requestAnimationFrame(()=>window.scrollTo(0,scroll.current));return()=>{cancelAnimationFrame(frame);scroll.current=window.scrollY;};},[]);
  useEffect(()=>setLimit(24),[filters,drafts]);
  const change=(key:keyof CatalogueFilters,value:string|boolean)=>setFilters(v=>({...v,[key]:value}));
  const items=useMemo(()=>{
    const q=filters.query.trim().toLowerCase();
    const preferred=[24,1,132,135,130,50];
    return products.filter(p=>(!drafts||p.hasChanges||!p.published)&&(!filters.brand||p.data.brand===filters.brand)&&(!filters.category||p.data.category===filters.category)&&(!filters.stone||p.data.stoneType===filters.stone)&&(!filters.kids||p.data.kids)&&(!q||[p.data.sku,...Object.values(p.data.names),p.data.brand,p.data.totalCarat,p.data.certificateNumber].join(' ').toLowerCase().includes(q))).sort((a,b)=>{
      if(filters.sort==='price-up')return (a.data.price??Infinity)-(b.data.price??Infinity);
      if(filters.sort==='price-down')return (b.data.price??-1)-(a.data.price??-1);
      if(filters.sort==='name')return a.data.names.en.localeCompare(b.data.names.en);
      if(a.hasChanges!==b.hasChanges)return a.hasChanges?-1:1;
      const time=b.updatedAt.localeCompare(a.updatedAt);if(time&&Math.abs(Date.parse(a.updatedAt)-Date.parse(b.updatedAt))>1000)return time;
      const ar=preferred.indexOf(a.data.id),br=preferred.indexOf(b.data.id);
      if(ar>=0||br>=0)return (ar<0?1000:ar)-(br<0?1000:br);
      return a.position-b.position;
    });
  },[products,filters,drafts]);
  const active=filters.query||filters.brand||filters.category||filters.stone||filters.kids;
  return <><div className="studio-page-heading"><div><p className="studio-eyebrow">ВАША КОЛЛЕКЦИЯ</p><h1>{drafts?'Черновики':'Украшения'}<span>{drafts?products.filter(p=>p.hasChanges||!p.published).length:products.length}</span></h1><p>{drafts?'Новые изделия и изменения, которые ждут публикации.':'Фотографии, цены и детали каждого изделия.'}</p></div><Link className="studio-primary" to="/admin/new"><Icon name="plus"/><span>Добавить<span className="studio-button-desktop"> украшение</span></span></Link></div><div className="studio-catalogue-tools"><label className="studio-search"><Icon name="search"/><input type="search" placeholder="Название или SKU" aria-label="Найти украшение" value={filters.query} onChange={e=>change('query',e.target.value)}/></label><div className="studio-basic-filters"><select aria-label="Фильтр по бренду" value={filters.brand} onChange={e=>change('brand',e.target.value)}><option value="">Все бренды</option><option>Luminore</option><option>Zoke</option></select><select aria-label="Фильтр по категории" value={filters.category} onChange={e=>change('category',e.target.value)}><option value="">Все категории</option>{Object.entries(categories).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select><button className={`studio-filter-button ${extra?'is-active':''}`} aria-label="Дополнительные фильтры" aria-expanded={extra} onClick={()=>setExtra(v=>!v)}><Icon name="filter"/>{(filters.stone||filters.kids)&&<span className="studio-filter-dot"/>}</button></div>{extra&&<div className="studio-extra-filters"><Field label="Тип камня"><select value={filters.stone} onChange={e=>change('stone',e.target.value)}><option value="">Все типы</option><option value="Lab-Grown Diamond">Lab-grown diamond</option><option value="Natural Diamond">Natural diamond</option><option value="Diamond">Diamond</option></select></Field><Field label="Сортировка"><select value={filters.sort} onChange={e=>change('sort',e.target.value)}><option value="recent">Сначала изменённые</option><option value="name">По названию</option><option value="price-up">Цена: по возрастанию</option><option value="price-down">Цена: по убыванию</option></select></Field><label className="studio-checkbox"><input type="checkbox" checked={filters.kids} onChange={e=>change('kids',e.target.checked)}/>Только Kids Collection</label></div>}</div><div className="studio-results-line"><span aria-live="polite">{active?`Найдено: ${items.length}`:`${drafts?'На проверке':'Все изделия'} · ${items.length}`}</span>{active?<button onClick={()=>setFilters(defaultFilters)}>Сбросить фильтры</button>:<span>USD</span>}</div>{items.length?<><div className="studio-product-grid">{items.slice(0,limit).map((p,index)=><Link to={`/admin/products/${p.data.id}`} className="studio-product-card" key={p.data.id} aria-label={`Редактировать ${p.data.names.en}, ${p.data.sku}`}><div className="studio-card-photo"><Photo src={p.data.images[0]} name={p.data.names.en} eager={index<4}/>{p.hasChanges&&<span className="studio-photo-status">{!p.published?'Черновик':'Изменения'}</span>}{p.data.kids&&<span className="studio-kids-mark">KIDS</span>}</div><div className="studio-card-copy"><span className="studio-sku">{p.data.sku}</span><h2>{p.data.names.en}</h2><p>{p.data.brand}{p.data.totalCarat!==null&&<> · {formatCarat(p.data.totalCarat)} ct</>}</p><strong>{usd(p.data.price)}</strong></div></Link>)}</div>{items.length>limit&&<div className="studio-load-more"><button className="studio-secondary" onClick={()=>setLimit(v=>v+24)}>Показать ещё {Math.min(24,items.length-limit)}</button><small>Показано {Math.min(limit,items.length)} из {items.length}</small></div>}</>:<div className="studio-empty"><Icon name={drafts?'file':'search'}/><h2>{drafts&&!active?'Пока всё опубликовано':'Ничего не найдено'}</h2><p>{drafts&&!active?'Здесь появятся новые украшения и сохранённые изменения.':'Попробуйте изменить запрос или фильтры.'}</p>{drafts&&!active?<Link className="studio-primary" to="/admin/new"><Icon name="plus"/>Добавить украшение</Link>:<button className="studio-secondary" onClick={()=>setFilters(defaultFilters)}>Сбросить фильтры</button>}</div>}</>;
}

function ProductEditor({user,update,notify}:{user:Member;update:(p:AdminProduct)=>void;notify:(message:string)=>void}) {
  const {id}=useParams(), navigate=useNavigate(), isNew=!id;
  const [record,setRecord]=useState<AdminProduct|null>(null),[draft,setDraft]=useState<ProductData>(emptyProduct),[baseline,setBaseline]=useState('');
  const [loading,setLoading]=useState(!isNew),[busy,setBusy]=useState(''),[error,setError]=useState(''),[preview,setPreview]=useState(false),[locale,setLocale]=useState<Locale>('en');
  const [revisions,setRevisions]=useState<Revision[]>([]),[leave,setLeave]=useState(''),[restore,setRestore]=useState<Revision|null>(null);
  const form=useRef<HTMLFormElement>(null),previewScroll=useRef(0);
  const dirty=JSON.stringify(draft)!==baseline&&!!baseline;
  const canPublish=user.role!=='editor';
  const accept=(p:AdminProduct)=>{setRecord(p);setDraft(structuredClone(p.data));setBaseline(JSON.stringify(p.data));update(p);};
  const loadHistory=(productId:number)=>api<{revisions:Revision[]}>(`/products/${productId}/history`).then(r=>setRevisions(r.revisions));
  useEffect(()=>{
    window.scrollTo(0,0);
    if(isNew){const p=emptyProduct();setDraft(p);setBaseline(JSON.stringify(p));return;}
    let alive=true;
    api<{product:AdminProduct}>(`/products/${id}`).then(r=>{if(alive){setRecord(r.product);setDraft(structuredClone(r.product.data));setBaseline(JSON.stringify(r.product.data));}}).catch(e=>setError(e.message)).finally(()=>{if(alive)setLoading(false);});
    loadHistory(Number(id)).catch(()=>{});
    return()=>{alive=false;};
  },[id]);
  useEffect(()=>{
    if(!dirty)return;
    const unload=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
    const link=(event:MouseEvent)=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=(event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement|null;
      if(!target||target.target==='_blank'||target.origin!==window.location.origin||target.pathname===window.location.pathname)return;
      event.preventDefault();setLeave(target.pathname+target.search);
    };
    window.addEventListener('beforeunload',unload);document.addEventListener('click',link,true);
    return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',link,true);};
  },[dirty]);
  function field<K extends keyof ProductData>(key:K,value:ProductData[K]){setDraft(p=>({...p,[key]:value}));}
  function translated(key:'names'|'descriptions',language:Locale,value:string){setDraft(p=>({...p,[key]:{...p[key],[language]:value}}));}
  function number(key:keyof ProductData,value:string){field(key,(value===''?null:Number(value)) as never);}
  function goBack(){if(dirty)setLeave('/admin');else navigate('/admin');}
  async function save(showMessage=true) {
    if(!form.current?.reportValidity())return null;
    const saved=await api<{product:AdminProduct}>(isNew?'/products':`/products/${record!.data.id}`,{
      method:isNew?'POST':'PUT',body:JSON.stringify({data:draft,version:record?.version}),
    });
    accept(saved.product);
    if(showMessage)notify('Черновик сохранён в локальном каталоге.');
    if(isNew)navigate(`/admin/products/${saved.product.data.id}`,{replace:true});
    else await loadHistory(saved.product.data.id);
    return saved.product;
  }
  async function submit(event:FormEvent){event.preventDefault();setBusy('saving');setError('');try{await save();}catch(e){setError((e as Error).message);}finally{setBusy('');}}
  async function publish(){
    setBusy('publishing');setError('');
    try{
      const current=dirty?await save(false):record;if(!current)return;
      const result=await api<{product:AdminProduct}>(`/products/${current.data.id}/publish`,{method:'POST',body:JSON.stringify({version:current.version})});
      accept(result.product);await loadHistory(current.data.id);notify('Карточка опубликована в локальном прототипе.');
    }catch(e){setError((e as Error).message);}finally{setBusy('');}
  }
  async function upload(files:FileList|null){
    if(!files?.length)return;
    if(draft.images.length+files.length>16){setError('В галерее может быть до 16 фотографий.');return;}
    if(Array.from(files).some(file=>file.size>15*1024*1024)){setError('Размер каждой фотографии должен быть не больше 15 МБ.');return;}
    setBusy('uploading');setError('');
    try{
      for(const file of Array.from(files)){
        const body=new FormData();body.append('photo',file);
        const result=await api<{src:string}>('/uploads',{method:'POST',body});
        setDraft(p=>({...p,images:[...p.images,result.src]}));
      }
      notify('Фотографии добавлены. Сохраните карточку, чтобы оставить их в галерее.');
    }catch(e){setError((e as Error).message);}finally{setBusy('');}
  }
  function movePhoto(from:number,to:number){const images=[...draft.images];const [photo]=images.splice(from,1);images.splice(to,0,photo!);field('images',images);}
  async function restoreVersion(){
    if(!restore||!record)return;setBusy('restoring');setError('');
    try{
      const result=await api<{product:AdminProduct}>(`/products/${record.data.id}/restore`,{method:'POST',body:JSON.stringify({revision:restore.id,version:record.version})});
      accept(result.product);setRestore(null);await loadHistory(record.data.id);notify('Версия восстановлена как черновик.');
    }catch(e){setError((e as Error).message);}finally{setBusy('');}
  }
  function showPreview(){previewScroll.current=window.scrollY;setPreview(true);window.scrollTo(0,0);}
  function closePreview(){setPreview(false);requestAnimationFrame(()=>window.scrollTo(0,previewScroll.current));}
  const num=(key:keyof ProductData,label:string,hint?:string)=><Field label={label} hint={hint}><input type="number" min="0" step="any" inputMode="decimal" value={(draft[key] as number|null)??''} onChange={e=>number(key,e.target.value)}/></Field>;
  const str=(key:keyof ProductData,label:string)=><Field label={label}><input value={String(draft[key]??'')} onChange={e=>field(key,e.target.value as never)}/></Field>;
  if(loading)return <Loading/>;
  if(error&&!isNew&&!record)return <div className="studio-empty"><h1>Не удалось открыть карточку</h1><p role="alert">{error}</p><Link className="studio-secondary" to="/admin">К каталогу</Link></div>;
  if(preview)return <ProductPreview data={draft} locale={locale} setLocale={setLocale} onClose={closePreview}/>;
  const publicationMissing=[!draft.images.length?'фотографию':'',!draft.price?'цену':''].filter(Boolean);
  return <div className="studio-editor"><button className="studio-back" onClick={goBack}><Icon name="arrow"/>Каталог</button><div className="studio-editor-heading"><div><p className="studio-eyebrow">{isNew?'НОВОЕ УКРАШЕНИЕ':draft.sku}</p><h1>{isNew?'Создать карточку':'Карточка украшения'}</h1></div>{record&&<Status product={record}/>}</div><form ref={form} onSubmit={submit} className="studio-editor-layout"><div className="studio-editor-main"><section className="studio-panel studio-photo-panel"><div className="studio-panel-heading"><h2>Фотографии</h2><span>{draft.images.length} / 16</span></div><p className="studio-field-note">Первое фото — главное. Измените номер, чтобы поменять порядок.</p><div className="studio-photo-editor-grid">{draft.images.map((src,index)=><div className="studio-edit-photo" key={`${src}-${index}`}><div className="studio-edit-photo-image"><Photo src={src} name={`${draft.names.en||'Украшение'}, ракурс ${index+1}`}/>{index===0&&<span>Главное фото</span>}</div><div className="studio-photo-controls"><label><span className="studio-sr-only">Позиция фотографии {index+1}</span><select value={index} aria-label={`Позиция фотографии ${index+1}`} onChange={e=>movePhoto(index,Number(e.target.value))} disabled={!!busy}>{draft.images.map((_,position)=><option key={position} value={position}>Фото {position+1}</option>)}</select></label><button type="button" className="studio-icon-button" aria-label={`Убрать фотографию ${index+1}`} disabled={!!busy} onClick={()=>field('images',draft.images.filter((_,i)=>i!==index))}><Icon name="trash"/></button></div></div>)}{draft.images.length<16&&<label className={`studio-upload ${!draft.images.length?'studio-upload--empty':''}`}><input type="file" multiple accept="image/jpeg,image/png,image/webp" aria-label="Добавить фотографии" disabled={!!busy} onChange={e=>{upload(e.target.files);e.target.value='';}}/><Icon name="upload"/><strong>{busy==='uploading'?'Загружаем…':'Добавить фото'}</strong><span>JPG, PNG, WebP<br/>до 15 МБ за фото</span></label>}</div></section><section className="studio-panel"><div className="studio-panel-heading"><h2>Основное</h2>{dirty&&<span className="studio-unsaved">Не сохранено</span>}</div><div className="studio-fields"><Field label="Название украшения — EN *"><textarea className="studio-name-input" rows={2} required maxLength={180} placeholder="Например, Yellow Pear Ring" value={draft.names.en} onChange={e=>translated('names','en',e.target.value)}/></Field><div className="studio-two-fields">{num('price','Цена, USD')}{num('totalCarat','Общий вес камней, ct',draft.category==='Earrings'?'Общий вес за пару':undefined)}</div><div className="studio-two-fields"><Field label="Бренд"><select value={draft.brand} onChange={e=>field('brand',e.target.value as ProductData['brand'])}><option>Luminore</option><option>Zoke</option></select></Field><Field label="Категория"><select value={draft.category} onChange={e=>field('category',e.target.value as ProductData['category'])}>{Object.entries(categories).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></Field></div>{isNew&&<p className="studio-field-note">SKU присвоится автоматически после сохранения.</p>}<label className="studio-checkbox"><input type="checkbox" checked={draft.kids} onChange={e=>field('kids',e.target.checked)}/>Kids Collection</label></div></section><details className="studio-panel studio-details"><summary><span>Характеристики</span><Icon name="down"/></summary><div className="studio-fields"><div className="studio-two-fields">{str('metal','Металл')}<Field label="Тип камня"><input list="studio-stones" value={draft.stoneType} onChange={e=>field('stoneType',e.target.value)}/><datalist id="studio-stones"><option value="Lab-Grown Diamond"/><option value="Natural Diamond"/><option value="Diamond"/></datalist></Field>{str('cut','Огранка')}{str('colour','Цвет')}{str('clarity','Чистота')}{str('size','Размер / длина')}{num('grossWeight','Общий вес изделия, г')}{num('goldWeight','Вес золота, г')}{num('mainStoneCarat','Основной камень, ct')}{num('paveCarat','Камни паве, ct')}{str('certificate','Сертификация')}{str('certificateNumber','Номер отчёта')}</div>{draft.category==='Pendants'&&<Field label="Цепочка в комплекте"><select value={draft.chainIncluded===null?'':String(draft.chainIncluded)} onChange={e=>field('chainIncluded',e.target.value===''?null:e.target.value==='true')}><option value="">Не указано</option><option value="true">Да</option><option value="false">Нет</option></select></Field>}{str('altText','Описание фото для доступности')}</div></details><details className="studio-panel studio-details"><summary><span>Описание и переводы</span><Icon name="down"/></summary><div className="studio-language-tabs" role="group" aria-label="Язык описания">{(['en','ru','uk'] as Locale[]).map(l=><button type="button" aria-pressed={locale===l} key={l} onClick={()=>setLocale(l)}>{l==='en'?'English':l==='ru'?'Русский':'Українська'}</button>)}</div><div className="studio-fields">{locale!=='en'&&<Field label={locale==='ru'?'Название на русском':'Назва українською'}><textarea rows={2} value={draft.names[locale]} onChange={e=>translated('names',locale,e.target.value)}/></Field>}<Field label={locale==='en'?'Description':locale==='ru'?'Описание':'Опис'}><textarea rows={5} value={draft.descriptions[locale]} onChange={e=>translated('descriptions',locale,e.target.value)}/></Field></div></details>{record&&<details className="studio-panel studio-details"><summary><span>История изменений <small>{revisions.length}</small></span><Icon name="down"/></summary>{revisions.length?<ol className="studio-history">{revisions.map(r=><li key={r.id}><Icon name="clock"/><div><strong>{{created:'Создан черновик',saved:'Сохранены изменения',published:'Опубликовано локально',restored:'Восстановлена версия'}[r.action]}</strong><span>{r.actor}</span><small>{date(r.createdAt)}</small>{user.role==='owner'&&!!r.restorable&&<button type="button" className="studio-text-button" disabled={!!busy} onClick={()=>setRestore(r)}>Восстановить предыдущую версию</button>}</div></li>)}</ol>:<p className="studio-field-note">Здесь появятся сохранённые изменения этой карточки.</p>}</details>}</div><aside className="studio-editor-actions"><section className="studio-panel"><h2>Карточка изделия</h2><p>{record?`${record.data.sku} · ${draft.brand}`:'Новое украшение'}{draft.totalCarat!==null&&<> · {formatCarat(draft.totalCarat)} ct</>}</p>{error&&<p className="studio-error" role="alert">{error}</p>}<button className="studio-primary studio-save-desktop" type="submit" disabled={!!busy||(!isNew&&!dirty)}><Icon name="check"/>{busy==='saving'?'Сохраняем…':'Сохранить черновик'}</button><button className="studio-secondary studio-preview-desktop" type="button" onClick={showPreview} disabled={!!busy}><Icon name="eye"/>Предпросмотр карточки</button>{canPublish&&!isNew&&(record?.hasChanges||dirty)&&<><hr/><p className="studio-field-note">Публикация обновляет только локальную копию. Основной сайт останется без изменений.</p><button type="button" className="studio-primary studio-publish" disabled={!!busy||publicationMissing.length>0} onClick={publish}>{busy==='publishing'?'Публикуем…':'Опубликовать локально'}</button>{publicationMissing.length>0&&<small>Для публикации добавьте {publicationMissing.join(' и ')}.</small>}</>}{user.role==='editor'&&<p className="studio-field-note">Черновик сможет опубликовать владелец или редактор с правом публикации.</p>}{record&&<small className="studio-last-edited">{date(record.updatedAt)}<br/>{record.updatedBy}</small>}{record&&record.position>=0&&<a className="studio-text-button" href={`https://www.luminorejewelry.com/product/${record.data.id}`} target="_blank" rel="noopener noreferrer">Карточка на основном сайте<Icon name="external"/></a>}</section></aside></form><div className="studio-editor-dock"><button className="studio-secondary" type="button" disabled={!!busy} onClick={showPreview}><Icon name="eye"/>Предпросмотр</button><button className="studio-primary" type="button" disabled={!!busy||(!isNew&&!dirty)} onClick={()=>form.current?.requestSubmit()}><Icon name="check"/>{busy==='saving'?'Сохраняем…':'Сохранить'}</button></div>{leave&&<Confirm title="Есть несохранённые изменения" description="Выйти из карточки и отменить несохранённые правки?" action="Выйти без сохранения" onCancel={()=>setLeave('')} onConfirm={()=>navigate(leave)}/>} {restore&&<Confirm title="Восстановить версию?" description="Текущие данные будут заменены предыдущей версией и сохранены как черновик. Опубликованная копия останется прежней." action="Восстановить" busy={!!busy} onCancel={()=>setRestore(null)} onConfirm={restoreVersion}/>}</div>;
}
function ProductPreview({data:p,locale,setLocale,onClose}:{data:ProductData;locale:Locale;setLocale:(l:Locale)=>void;onClose:()=>void}){
  const [image,setImage]=useState(0);
  return <div className="studio-preview"><button className="studio-back" onClick={onClose}><Icon name="arrow"/>К редактированию</button><div className="studio-preview-title"><p className="studio-eyebrow">ПРЕДПРОСМОТР КАРТОЧКИ</p><div className="studio-language-tabs" role="group" aria-label="Язык предпросмотра">{(['en','ru','uk'] as Locale[]).map(l=><button key={l} aria-pressed={l===locale} onClick={()=>setLocale(l)}>{l.toUpperCase()}</button>)}</div></div><div className="studio-preview-layout"><div><div className="studio-preview-image"><Photo src={p.images[image]||p.images[0]} name={p.names[locale]||p.names.en} eager/></div>{p.images.length>1&&<div className="studio-preview-thumbs">{p.images.map((src,i)=><button key={src} aria-label={`Ракурс ${i+1}`} aria-pressed={i===image} onClick={()=>setImage(i)}><Photo src={src} name={`Ракурс ${i+1}`}/></button>)}</div>}</div><div className="studio-preview-copy"><p className="studio-eyebrow">{p.brand} · {categories[p.category]}</p><h1>{p.names[locale]||p.names.en||'Название украшения'}</h1>{p.totalCarat!==null&&<p className="studio-preview-weight">{p.category==='Earrings'?'Total stone weight: ':''}{formatCarat(p.totalCarat)} ct</p>}<p className="studio-preview-price">{usd(p.price)}</p><p className="studio-preview-description">{p.descriptions[locale]||p.descriptions.en}</p><dl>{[['SKU',p.sku],['Металл',p.metal],['Тип камня',p.stoneType],['Огранка',p.cut],['Цвет',p.colour],['Чистота',p.clarity],['Коллекция',p.kids?'Kids Collection':'']].filter(([,v])=>v).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><button className="studio-secondary" onClick={onClose}>Продолжить редактирование</button></div></div></div>;
}

function Invitations({user,notify}:{user:Member;notify:(s:string)=>void}) {
  const [members,setMembers]=useState<Member[]>([]),[email,setEmail]=useState(''),[role,setRole]=useState('editor'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[revoke,setRevoke]=useState<Member|null>(null);
  const load=()=>api<{members:Member[]}>('/members').then(r=>setMembers(r.members));
  useEffect(()=>{window.scrollTo(0,0);load().catch(e=>setError(e.message));},[]);
  async function invite(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{await api('/members',{method:'POST',body:JSON.stringify({email,role})});await load();setEmail('');notify('Адрес добавлен. Сотрудник может войти по своей почте.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  async function remove(){if(!revoke)return;setBusy(true);try{await api('/members',{method:'DELETE',body:JSON.stringify({email:revoke.email})});await load();setRevoke(null);notify('Доступ отключён, активные сеансы завершены.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  async function copy(){try{await navigator.clipboard.writeText(`${window.location.origin}/admin`);notify('Ссылка на локальную панель скопирована.');}catch{notify(`Адрес панели: ${window.location.origin}/admin`);}}
  return <><div className="studio-page-heading"><div><p className="studio-eyebrow">ВАША КОМАНДА</p><h1>Приглашения</h1><p>Доступ только у тех, кого вы добавили.</p></div></div><div className="studio-team-layout"><section className="studio-panel"><div className="studio-panel-heading"><Icon name="mail"/><h2>Пригласить сотрудника</h2></div><form className="studio-fields" onSubmit={invite}><Field label="Email сотрудника"><input type="email" required autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Права доступа"><select value={role} onChange={e=>setRole(e.target.value)}><option value="editor">Редактор</option><option value="publisher">Редактор с публикацией</option></select></Field><p className="studio-field-note">Редактор добавляет украшения и сохраняет правки на проверку. Право публикации разрешает обновлять опубликованную локальную копию.</p>{error&&<p className="studio-error" role="alert">{error}</p>}<button className="studio-primary" disabled={busy}><Icon name="plus"/>{busy?'Добавляем…':'Добавить доступ'}</button></form><div className="studio-team-link"><button className="studio-text-button" onClick={copy}><Icon name="copy"/>Скопировать ссылку на панель</button><p>Письма в прототипе не отправляются. После добавления адреса сотрудник вводит свою почту на странице входа. Ссылка localhost работает на этом компьютере.</p></div></section><section className="studio-panel studio-members"><div className="studio-panel-heading"><Icon name="users"/><h2>Участники <span>{members.filter(m=>m.status!=='revoked').length}</span></h2></div>{members.map(m=><div className={`studio-member ${m.status==='revoked'?'is-revoked':''}`} key={m.email}><span className="studio-member-avatar">{m.email[0]?.toUpperCase()}</span><div className="studio-member-copy"><strong>{m.email}{m.email===user.email&&<small>Это вы</small>}</strong><span>{roleLabels[m.role]}</span><small>{m.status==='revoked'?'Доступ отключён':m.status==='invited'?'Приглашён · ещё не входил':m.lastLoginAt?`Последний вход: ${date(m.lastLoginAt)}`:'Доступ активен'}</small></div>{m.role!=='owner'&&m.status!=='revoked'&&<button className="studio-icon-button studio-danger" aria-label={`Отключить доступ ${m.email}`} onClick={()=>setRevoke(m)}><Icon name="close"/></button>}</div>)}</section></div>{revoke&&<Confirm title="Отключить доступ?" description={`${revoke.email} больше не сможет войти в панель. Активные сеансы будут завершены.`} action="Отключить доступ" busy={busy} onCancel={()=>setRevoke(null)} onConfirm={remove}/>}</>;
}
function Confirm({title,description,action,onCancel,onConfirm,busy=false}:{title:string;description:string;action:string;onCancel:()=>void;onConfirm:()=>void;busy?:boolean}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{ref.current?.showModal();return()=>ref.current?.close();},[]);
  return <dialog className="studio-dialog" ref={ref} onCancel={e=>{e.preventDefault();onCancel();}}><h2>{title}</h2><p>{description}</p><div><button className="studio-secondary" disabled={busy} onClick={onCancel}>Отмена</button><button className="studio-primary" disabled={busy} onClick={onConfirm}>{busy?'Подождите…':action}</button></div></dialog>;
}

function App(){
  const [user,setUser]=useState<Member|null>(null),[loading,setLoading]=useState(true);
  useEffect(()=>{api<{user:Member}>('/session').then(r=>setUser(r.user)).catch(()=>{}).finally(()=>setLoading(false));const expired=()=>setUser(null);window.addEventListener('studio-session-ended',expired);return()=>window.removeEventListener('studio-session-ended',expired);},[]);
  if(loading)return <Loading/>;
  if(!user)return <Login onLogin={user=>{window.history.replaceState({},'','/admin');setUser(user);}}/>;
  return <BrowserRouter><Studio user={user} onLogout={()=>setUser(null)}/></BrowserRouter>;
}
createRoot(document.getElementById('admin-root')!).render(<App/>);
