import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatCarat } from '../src/lib/carat';
import { categories, emptyProduct, productIdentifier, productTitle, publicationMissing, type AdminProduct, type DraftDeletion, type Locale, type Member, type ProductData, type Revision } from './types';
import { ApiError, api, Confirm, date, Field, Icon, Loading } from './ui';
import { ProductPreview } from './preview';
import { DraftWriter, draftFingerprint, hasDraftContent } from './draft-writer';
import { Photos } from './photos';

type Props={user:Member;update:(p:AdminProduct)=>void;notify:(message:string)=>void;onDelete:(p:AdminProduct)=>Promise<DraftDeletion>;onSaved:(p:AdminProduct)=>void};
export function ProductEditor({user,update,notify,onDelete,onSaved}:Props) {
  const {id='new'}=useParams(),navigate=useNavigate();
  const [record,setRecord]=useState<AdminProduct|null>(null),[draft,setDraft]=useState<ProductData>(emptyProduct),[baseline,setBaseline]=useState('');
  const [loading,setLoading]=useState(id!=='new'),[busy,setBusy]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState(''),[autoError,setAutoError]=useState(''),[conflict,setConflict]=useState(false);
  const [preview,setPreview]=useState(false),[locale,setLocale]=useState<Locale>('en'),[revisions,setRevisions]=useState<Revision[]>([]),[leave,setLeave]=useState(''),[restore,setRestore]=useState<Revision|null>(null);
  const [deletionOpen,setDeletionOpen]=useState(false),[deletionError,setDeletionError]=useState(''),[uploadPending,setUploadPending]=useState(false),[reloadOpen,setReloadOpen]=useState(false);
  const form=useRef<HTMLFormElement>(null),previewScroll=useRef(0),writer=useRef<DraftWriter|null>(null),draftRef=useRef(draft),routeId=useRef(id),mounted=useRef(true),intent=useRef('');
  const callbacks=useRef({update,notify,onSaved});callbacks.current={update,notify,onSaved};routeId.current=id;draftRef.current=draft;
  const signature=draftFingerprint(draft),dirty=!!baseline&&signature!==baseline;
  const missing=publicationMissing(draft),isNew=!record,canPublish=user.role!=='editor';
  const alreadyPublished=!!record?.published&&!record.hasChanges&&!dirty;
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  function makeWriter(initial:AdminProduct|null) {
    const session=new DraftWriter(initial,async(current,data,draftKey)=>{
      const result=await api<{product:AdminProduct}>(current?`/products/${current.data.id}`:'/products',{
        method:current?'PUT':'POST',body:JSON.stringify({data,version:current?.version,draftKey}),
      });return result.product;
    },saved=>{
      if(!mounted.current||writer.current!==session)return;
      setRecord(saved);setBaseline(draftFingerprint(saved.data));callbacks.current.update(saved);
      setDraft(current=>({...current,id:saved.data.id,sku:saved.data.sku}));
      if(routeId.current==='new'&&intent.current!=='close'&&draftFingerprint(draftRef.current)===draftFingerprint(saved.data))navigate(`/admin/products/${saved.data.id}`,{replace:true});
    });
    writer.current=session;return session;
  }
  function hydrate(p:AdminProduct|null) {
    const data=p?structuredClone(p.data):emptyProduct();makeWriter(p);setRecord(p);setDraft(data);draftRef.current=data;setBaseline(draftFingerprint(data));setError('');setAutoError('');setConflict(false);
  }
  const loadHistory=(productId:number)=>api<{revisions:Revision[]}>(`/products/${productId}/history`).then(r=>{if(mounted.current)setRevisions(r.revisions);});
  useEffect(()=>{
    if(id!=='new'&&writer.current?.record?.data.id===Number(id))return;
    window.scrollTo(0,0);setRevisions([]);
    if(id==='new'){hydrate(null);setLoading(false);return;}
    let alive=true;setLoading(true);writer.current=null;
    api<{product:AdminProduct}>(`/products/${id}`).then(r=>{if(alive)hydrate(r.product);}).catch(e=>{if(alive)setError(e.message);}).finally(()=>{if(alive)setLoading(false);});
    return()=>{alive=false;};
  },[id]);
  async function persist() {
    const current=writer.current;if(!current)return null;
    if(!current.record&&!hasDraftContent(draftRef.current))return null;
    setSaving(true);setAutoError('');
    try{return await current.save(draftRef.current);}
    catch(e){if(mounted.current){setAutoError((e as Error).message);if((e as ApiError).status===409)setConflict(true);}throw e;}
    finally{if(mounted.current)setSaving(false);}
  }
  useEffect(()=>{
    if(!dirty||loading||saving||busy||autoError||leave||deletionOpen||restore||reloadOpen||(!record&&!hasDraftContent(draft)))return;
    const timer=setTimeout(()=>{persist().catch(()=>{});},1000);
    return()=>clearTimeout(timer);
  },[signature,baseline,loading,saving,busy,autoError,leave,deletionOpen,restore,reloadOpen]);
  useEffect(()=>{
    if(!dirty&&!uploadPending)return;
    const unload=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
    const link=(event:MouseEvent)=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=(event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement|null;
      if(!target||target.target==='_blank'||target.origin!==window.location.origin||target.pathname===window.location.pathname)return;
      event.preventDefault();setLeave(target.pathname+target.search);
    };
    window.addEventListener('beforeunload',unload);document.addEventListener('click',link,true);
    return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',link,true);};
  },[dirty,uploadPending]);
  function edit(updater:(p:ProductData)=>ProductData){setDraft(current=>{const next=updater(current);draftRef.current=next;return next;});}
  function field<K extends keyof ProductData>(key:K,value:ProductData[K]){edit(p=>({...p,[key]:value}));}
  function translated(key:'names'|'descriptions',language:Locale,value:string){edit(p=>({...p,[key]:{...p[key],[language]:value}}));}
  function goBack(){if(dirty||uploadPending)setLeave('/admin');else navigate('/admin');}
  async function submit(event:FormEvent){
    event.preventDefault();if(uploadPending||!form.current?.reportValidity())return;
    intent.current='close';setBusy('saving');setError('');
    try{const saved=await persist();if(saved)callbacks.current.onSaved(saved);}
    catch(e){setError((e as Error).message);}finally{intent.current='';if(mounted.current)setBusy('');}
  }
  async function publish(){
    setBusy('publishing');setError('');
    try{
      const current=await persist();if(!current)return;
      const result=await api<{product:AdminProduct}>(`/products/${current.data.id}/publish`,{method:'POST',body:JSON.stringify({version:current.version})});
      hydrate(result.product);update(result.product);notify(`Карточка опубликована локально · SKU ${result.product.data.sku}.`);
    }catch(e){setError((e as Error).message);}finally{setBusy('');}
  }
  async function restoreVersion(){
    if(!restore)return;setBusy('restoring');setError('');
    try{
      await writer.current?.settled();const current=writer.current?.record;if(!current)return;
      const result=await api<{product:AdminProduct}>(`/products/${current.data.id}/restore`,{method:'POST',body:JSON.stringify({revision:restore.id,version:current.version})});
      hydrate(result.product);update(result.product);setRestore(null);await loadHistory(current.data.id);notify('Версия восстановлена как черновик.');
    }catch(e){setError((e as Error).message);}finally{setBusy('');}
  }
  async function deleteCurrentDraft(){
    setBusy('deleting');setDeletionError('');
    try{
      await writer.current?.settled();const current=writer.current?.record;
      if(!current){setDeletionOpen(false);notify('Несохранённая карточка удалена.');navigate('/admin/drafts');return;}
      if(current.published&&!current.hasChanges){hydrate(current);setDeletionOpen(false);notify('Несохранённые правки отменены.');return;}
      const result=await onDelete(current);setDeletionOpen(false);
      if(result.kind==='deleted')navigate('/admin/drafts');else{hydrate(result.product);await loadHistory(current.data.id);}
    }catch(e){setDeletionError((e as Error).message);}finally{if(mounted.current)setBusy('');}
  }
  async function reloadLatest(){
    const current=writer.current?.record;
    if(!current){navigate('/admin/drafts');return;}
    setBusy('reloading');
    try{const result=await api<{product:AdminProduct}>(`/products/${current.data.id}`);hydrate(result.product);update(result.product);setReloadOpen(false);}
    catch(e){setError((e as Error).message);setReloadOpen(false);}finally{setBusy('');}
  }
  function showPreview(){previewScroll.current=window.scrollY;setPreview(true);window.scrollTo(0,0);}
  function closePreview(){setPreview(false);requestAnimationFrame(()=>window.scrollTo(0,previewScroll.current));}
  const num=(key:keyof ProductData,label:string,hint?:string)=><Field label={label} hint={hint}><input type="number" min="0" step="any" inputMode="decimal" value={(draft[key] as number|null)??''} onChange={e=>field(key,(e.target.value===''?null:Number(e.target.value)) as never)}/></Field>;
  const str=(key:keyof ProductData,label:string)=><Field label={label}><input maxLength={500} value={String(draft[key]??'')} onChange={e=>field(key,e.target.value as never)}/></Field>;
  if(loading)return <Loading/>;
  if(error&&!record&&id!=='new')return <div className="studio-empty"><h1>Не удалось открыть карточку</h1><p role="alert">{error}</p><Link className="studio-secondary" to="/admin">К каталогу</Link></div>;
  // Keep the upload queue mounted when previewing so files are never orphaned.
  const canDeleteDraft=isNew?hasDraftContent(draft)||dirty:!!record&&(!record.published||record.hasChanges||dirty);
  const deleteLabel=record?.published?'Отменить черновые изменения':'Удалить черновик';
  const disabled=!!busy||saving||uploadPending;
  const canClose=!!record||hasDraftContent(draft);
  const saveState=saving?'Сохраняется…':autoError?'Не сохранено':dirty?'Ожидает сохранения':record?'Сохранено':'Новый черновик';
  const deletionDescription=record?.published
    ?`Черновые изменения «${productTitle(record.data)}» (${productIdentifier(record)}) будут отменены. Опубликованная версия останется прежней.`
    :record?`«${productTitle(record.data)}» (${productIdentifier(record)}) будет перемещён в корзину вместе с фотографиями. Его можно восстановить.`:'Эта карточка ещё не сохранена. Введённые данные будут удалены.';
  return <>
    {preview&&<ProductPreview data={draft} locale={locale} setLocale={setLocale} onClose={closePreview}/>}
    <div className="studio-editor" hidden={preview}>
      <button className="studio-back" onClick={goBack}><Icon name="arrow"/>Каталог</button>
      <div className="studio-editor-heading"><div>{record&&<p className="studio-eyebrow">{productIdentifier(record)}</p>}<h1>{draft.names.en.trim()||'Новое украшение'}</h1><span className={`studio-save-state${autoError?' has-error':''}`} role="status">{saving&&<span className="studio-spinner"/>}{saveState}</span></div></div>
      {autoError&&<div className="studio-error" role="alert"><span>{autoError}</span>{conflict?<button type="button" className="studio-text-button" onClick={()=>setReloadOpen(true)}>Открыть актуальную версию</button>:<button type="button" className="studio-text-button" disabled={saving} onClick={()=>persist().catch(()=>{})}>Повторить сохранение</button>}</div>}
      <form ref={form} onSubmit={submit} className="studio-editor-layout">
        <fieldset className="studio-editor-main" disabled={!!busy}>
          <Photos images={draft.images} name={draft.names.en} disabled={!!busy} onPending={setUploadPending}
            onAdd={src=>edit(p=>({...p,images:[...p.images,src]}))}
            onMove={(from,to)=>edit(p=>{const images=[...p.images];const [image]=images.splice(from,1);images.splice(to,0,image!);return {...p,images};})}
            onRemove={index=>edit(p=>({...p,images:p.images.filter((_,i)=>i!==index)}))}
            onRestore={(src,index)=>edit(p=>{if(p.images.includes(src))return p;const images=[...p.images];images.splice(Math.min(index,images.length),0,src);return {...p,images};})}/>
          <section className="studio-panel"><div className="studio-fields">
            <Field label="Название украшения"><textarea className="studio-name-input" rows={2} maxLength={180} placeholder="Например, Yellow Pear Ring" value={draft.names.en} onChange={e=>translated('names','en',e.target.value)}/></Field>
            <div className="studio-two-fields">{num('price','Цена, USD')}{num('totalCarat',draft.category==='Earrings'?'Общий вес камней за пару, ct':'Общий вес камней, ct')}</div>
            <div className="studio-two-fields"><Field label="Бренд"><select value={draft.brand} onChange={e=>field('brand',e.target.value as ProductData['brand'])}><option>Luminore</option><option>Zoke</option></select></Field><Field label="Категория"><select value={draft.category} onChange={e=>field('category',e.target.value as ProductData['category'])}>{Object.entries(categories).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></Field></div>
            <label className="studio-checkbox"><input type="checkbox" checked={draft.kids} onChange={e=>field('kids',e.target.checked)}/>Детская коллекция</label>
            <div className={`studio-readiness${missing.length?'':' is-ready'}`}><Icon name={missing.length?'file':'check'}/><span>{alreadyPublished?'Опубликовано локально':missing.length?`Для публикации добавьте ${missing.join(', ')}.`:'Готово к публикации'}</span></div>
          </div></section>
          <details className="studio-panel studio-details"><summary><span>Характеристики</span><Icon name="down"/></summary><div className="studio-fields"><div className="studio-two-fields">
            {str('metal','Металл')}<Field label="Тип камня"><select value={draft.stoneType} onChange={e=>field('stoneType',e.target.value)}>{!['Lab-Grown Diamond','Natural Diamond','Diamond'].includes(draft.stoneType)&&<option value={draft.stoneType}>{draft.stoneType||'Не указан'}</option>}<option value="Lab-Grown Diamond">Lab-grown diamond</option><option value="Natural Diamond">Natural diamond</option><option value="Diamond">Diamond</option></select></Field>
            {str('cut','Огранка')}{str('colour','Цвет')}{str('clarity','Чистота')}
            {draft.category!=='Earrings'&&str('size',draft.category==='Rings'?'Размер кольца':draft.category==='Bracelets'?'Длина браслета':draft.category==='Pendants'?'Длина цепочки':'Длина колье')}
            {num('grossWeight','Вес изделия, г')}{num('goldWeight','Вес золота, г')}{draft.category!=='Earrings'&&num('mainStoneCarat','Основной камень, ct')}{num('paveCarat','Камни паве, ct')}
          </div>{draft.category==='Pendants'&&<Field label="Цепочка в комплекте"><select value={draft.chainIncluded===null?'':String(draft.chainIncluded)} onChange={e=>field('chainIncluded',e.target.value===''?null:e.target.value==='true')}><option value="">Не указано</option><option value="true">Да</option><option value="false">Нет</option></select></Field>}
          <details className="studio-details studio-subdetails"><summary><span>Сертификат и дополнительные данные</span><Icon name="down"/></summary><div className="studio-fields">{str('certificate','Сертификация')}{str('certificateNumber','Номер отчёта')}{str('altText','Описание фото для доступности')}</div></details>
          </div></details>
          <details className="studio-panel studio-details"><summary><span>Описание</span><Icon name="down"/></summary><div className="studio-fields"><Field label="Описание на английском"><textarea rows={5} maxLength={10000} value={draft.descriptions.en} onChange={e=>translated('descriptions','en',e.target.value)}/></Field>
            <details className="studio-details studio-subdetails"><summary><span>Переводы</span><Icon name="down"/></summary><div className="studio-language-tabs" role="group" aria-label="Язык перевода">{(['ru','uk'] as Locale[]).map(l=><button type="button" aria-pressed={(locale==='en'?'ru':locale)===l} key={l} onClick={()=>setLocale(l)}>{l==='ru'?'Русский':'Українська'}</button>)}</div><div className="studio-fields"><Field label={locale==='uk'?'Назва українською':'Название на русском'}><textarea rows={2} maxLength={180} value={draft.names[locale==='uk'?'uk':'ru']} onChange={e=>translated('names',locale==='uk'?'uk':'ru',e.target.value)}/></Field><Field label={locale==='uk'?'Опис українською':'Описание на русском'}><textarea rows={5} maxLength={10000} value={draft.descriptions[locale==='uk'?'uk':'ru']} onChange={e=>translated('descriptions',locale==='uk'?'uk':'ru',e.target.value)}/></Field></div></details>
          </div></details>
          {record&&<details className="studio-panel studio-details" onToggle={e=>{if(e.currentTarget.open)loadHistory(record.data.id).catch(error=>setError(error.message));}}><summary><span>История изменений</span><Icon name="down"/></summary>{revisions.length?<ol className="studio-history">{revisions.map(r=><li key={r.id}><Icon name="clock"/><div><strong>{{created:'Создан черновик',saved:'Сохранены изменения',published:'Опубликовано локально',restored:'Восстановлена версия',deleted:'Черновик перемещён в корзину',undeleted:'Черновик восстановлен из корзины',discarded:'Черновые изменения отменены'}[r.action]}</strong><span>{r.actor}</span><small>{date(r.createdAt)}</small>{user.role==='owner'&&!!r.restorable&&<button type="button" className="studio-text-button" disabled={disabled} onClick={()=>setRestore(r)}>Восстановить предыдущую версию</button>}</div></li>)}</ol>:<p className="studio-field-note">История пока пуста.</p>}</details>}
        </fieldset>
        <aside className="studio-editor-actions"><section className="studio-panel">
          {error&&<p className="studio-error" role="alert">{error}</p>}
          <button className="studio-primary studio-save-desktop" type="submit" disabled={!!busy||uploadPending||!canClose||conflict}><Icon name="check"/>{busy==='saving'?'Сохраняем…':'Сохранить и закрыть'}</button>
          <button className="studio-secondary studio-preview-desktop" type="button" onClick={showPreview} disabled={!!busy}><Icon name="eye"/>Предпросмотр</button>
          {uploadPending&&<p className="studio-field-note">Дождитесь загрузки фото. Если есть ошибка, повторите загрузку или уберите этот файл из очереди.</p>}
          {canPublish&&record&&(record.hasChanges||dirty)&&<><hr/><button type="button" className="studio-primary studio-publish" disabled={disabled||missing.length>0||conflict} onClick={publish}>{busy==='publishing'?'Публикуем…':'Опубликовать локально'}</button><p className="studio-field-note">{record.published?'SKU сохранится. Обновится только локальная копия.':'Постоянный SKU присвоится при публикации. Обновится только локальная копия.'}</p></>}
          {user.role==='editor'&&<p className="studio-field-note">Публикация доступна владельцу или редактору с правом публикации.</p>}
          {canDeleteDraft&&<button type="button" className="studio-draft-delete studio-delete-desktop" disabled={disabled} onClick={()=>{setDeletionError('');setDeletionOpen(true);}}><Icon name="trash"/>{deleteLabel}</button>}
          {record&&record.position>=0&&<a className="studio-text-button" href={`https://www.luminorejewelry.com/product/${record.data.id}`} target="_blank" rel="noopener noreferrer">Посмотреть на сайте<Icon name="external"/></a>}
        </section></aside>
      </form>
      <div className={`studio-editor-dock studio-editor-dock--simple${canDeleteDraft?' studio-editor-dock--deletable':''}`}>
        <span className="studio-dock-save-state" role="status">{saveState}</span>
        {canDeleteDraft&&<button className="studio-icon-button studio-danger" type="button" aria-label={deleteLabel} disabled={disabled} onClick={()=>{setDeletionError('');setDeletionOpen(true);}}><Icon name="trash"/></button>}
        <button className="studio-secondary" type="button" aria-label="Предпросмотр" disabled={!!busy} onClick={showPreview}><Icon name="eye"/></button>
        <button className="studio-primary" type="button" disabled={!!busy||uploadPending||!canClose||conflict} onClick={()=>form.current?.requestSubmit()}>{busy==='saving'?'Сохраняем…':'Сохранить и закрыть'}</button>
      </div>
    </div>
    {deletionOpen&&<Confirm title={record?.published?'Отменить черновые изменения?':'Удалить черновик?'} description={deletionDescription} action={record?.published?'Отменить правки':'Удалить черновик'} danger busy={!!busy} error={deletionError} onCancel={()=>setDeletionOpen(false)} onConfirm={deleteCurrentDraft}/>}
    {leave&&<Confirm title={uploadPending?'Фотографии ещё не загружены':'Есть несохранённые изменения'} description="Последние несохранённые правки и незагруженные фото будут отменены. Уже сохранённый черновик останется в каталоге." action="Выйти" onCancel={()=>setLeave('')} onConfirm={()=>navigate(leave)}/>}
    {restore&&<Confirm title="Восстановить версию?" description="Она будет сохранена как черновик. Опубликованная копия останется прежней." action="Восстановить" busy={!!busy} onCancel={()=>setRestore(null)} onConfirm={restoreVersion}/>}
    {reloadOpen&&<Confirm title="Открыть актуальную версию?" description="Будут загружены последние сохранённые данные. Ваши несохранённые правки будут отменены." action="Открыть" onCancel={()=>setReloadOpen(false)} busy={!!busy} onConfirm={reloadLatest}/>}
  </>;
}
