import React, { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Icon, Photo } from './ui';
import { uploadPhoto } from './photo-upload';

type Upload={id:string;file:File;state:'queued'|'uploading'|'failed';progress:number;error:string};
type Props={images:string[];name:string;disabled:boolean;onAdd:(src:string)=>void;onMove:(from:number,to:number)=>void;onRemove:(index:number)=>void;onRestore:(src:string,index:number)=>void;onPending:(pending:boolean)=>void};
export function Photos({images,name,disabled,onAdd,onMove,onRemove,onRestore,onPending}:Props) {
  const [queue,setQueue]=useState<Upload[]>([]),[done,setDone]=useState(0),[removed,setRemoved]=useState<{src:string;index:number}|null>(null);
  const [dragFrom,setDragFrom]=useState<number|null>(null),[dragTo,setDragTo]=useState<number|null>(null),[announcement,setAnnouncement]=useState('');
  const processing=useRef(false),callbacks=useRef({onAdd,onPending}),touch=useRef<{from:number;to:number;active:boolean;timer:ReturnType<typeof setTimeout>}|null>(null);
  callbacks.current={onAdd,onPending};
  useEffect(()=>{callbacks.current.onPending(queue.length>0);},[queue]);
  useEffect(()=>{
    if(processing.current)return;
    const next=queue.find(item=>item.state==='queued');if(!next)return;
    processing.current=true;
    const patch=(values:Partial<Upload>)=>setQueue(current=>current.map(item=>item.id===next.id?{...item,...values}:item));
    patch({state:'uploading',progress:0,error:''});
    uploadPhoto(next.file,progress=>patch({progress})).then(src=>{
      callbacks.current.onAdd(src);setDone(current=>current+1);setQueue(current=>current.filter(item=>item.id!==next.id));
    }).catch(error=>patch({state:'failed',error:error.message})).finally(()=>{processing.current=false;setQueue(current=>[...current]);});
  },[queue]);
  useEffect(()=>()=>{if(touch.current)clearTimeout(touch.current.timer);},[]);
  const waiting=queue;
  function enqueue(files:FileList|null) {
    if(!files?.length)return;
    setQueue(current=>[...current,...Array.from(files).map(file=>({id:crypto.randomUUID(),file,state:file.size>15*1024*1024?'failed' as const:'queued' as const,progress:0,error:file.size>15*1024*1024?'Фото больше 15 МБ. Выберите уменьшенную копию.':''}))]);
  }
  function move(from:number,to:number) {if(from!==to){onMove(from,to);setAnnouncement(`Фото ${from+1} перемещено на позицию ${to+1}.`);}setDragFrom(null);setDragTo(null);}
  function touchStart(event:PointerEvent<HTMLButtonElement>,index:number) {
    if(event.pointerType==='mouse'||disabled)return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const value={from:index,to:index,active:false,timer:setTimeout(()=>{value.active=true;setDragFrom(index);setDragTo(index);},350)};
    touch.current=value;
  }
  function touchMove(event:PointerEvent<HTMLButtonElement>) {
    const value=touch.current;if(!value?.active)return;
    const tile=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-photo-index]');
    if(tile){value.to=Number(tile.dataset.photoIndex);setDragTo(value.to);}
  }
  function touchEnd(){const value=touch.current;if(!value)return;clearTimeout(value.timer);if(value.active)move(value.from,value.to);touch.current=null;}
  return <section className="studio-panel studio-photo-panel">
    <div className="studio-panel-heading"><h2>Фотографии</h2><span>{images.length} фото</span></div>
    <div className="studio-sr-only" role="status">{announcement}</div>
    <div className="studio-photo-editor-grid">
      {images.map((src,index)=><div key={src} data-photo-index={index} className={`studio-edit-photo${dragFrom===index?' is-dragging':''}${dragTo===index&&dragFrom!==index?' is-drop-target':''}`} draggable={!disabled}
        onDragStart={event=>{if(disabled){event.preventDefault();return;}event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',String(index));setDragFrom(index);}}
        onDragOver={event=>{if(dragFrom!==null){event.preventDefault();setDragTo(index);}}}
        onDrop={event=>{event.preventDefault();if(dragFrom!==null)move(dragFrom,index);}}
        onDragEnd={()=>{setDragFrom(null);setDragTo(null);}}>
        <div className="studio-edit-photo-image">
          <Photo src={src} name={`${name||'Украшение'}, фото ${index+1}`}/>
          <button type="button" className="studio-photo-drag" aria-label={`Перетащить фото ${index+1}. Удерживайте для перемещения.`} disabled={disabled}
            onPointerDown={event=>touchStart(event,index)} onPointerMove={touchMove} onPointerUp={touchEnd} onPointerCancel={()=>{if(touch.current)clearTimeout(touch.current.timer);touch.current=null;setDragFrom(null);setDragTo(null);}}><Icon name="grip"/></button>
          <span className="studio-photo-caption">{`Фото ${index+1}`}</span>
        </div>
        <button type="button" className="studio-photo-primary" disabled={disabled||index===0} onClick={()=>move(index,0)}>{index===0?<><Icon name="check"/>Главное</>:'Сделать главным'}</button>
        <div className="studio-photo-toolbar">
          <button type="button" className="studio-icon-button" disabled={disabled||index===0} aria-label={`Переместить фото ${index+1} назад`} onClick={()=>move(index,index-1)}><Icon name="arrow"/></button>
          <button type="button" className="studio-icon-button" disabled={disabled||index===images.length-1} aria-label={`Переместить фото ${index+1} вперёд`} onClick={()=>move(index,index+1)}><Icon name="next"/></button>
          <button type="button" className="studio-icon-button" disabled={disabled} aria-label={`Убрать фото ${index+1}`} onClick={()=>{setRemoved({src,index});onRemove(index);setAnnouncement(`Фото ${index+1} убрано. Можно отменить.`);}}><Icon name="trash"/></button>
        </div>
      </div>)}
      <label className={`studio-upload ${!images.length?'studio-upload--empty':''}`}>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" aria-label="Добавить фотографии" disabled={disabled} onChange={event=>{enqueue(event.target.files);event.target.value='';}}/>
        <Icon name="upload"/><strong>Добавить фото</strong><span>Можно выбрать сразу несколько<br/>JPG, PNG, WebP, HEIC · до 15 МБ</span>
      </label>
    </div>
    {removed&&<div className="studio-photo-undo" role="status"><span>Фото убрано</span><button type="button" disabled={disabled} onClick={()=>{onRestore(removed.src,removed.index);setRemoved(null);}}>Отменить</button><button type="button" className="studio-icon-button" aria-label="Закрыть отмену удаления фото" onClick={()=>setRemoved(null)}><Icon name="close"/></button></div>}
    {(queue.length>0||done>0)&&<div className="studio-upload-queue"><p aria-live="polite">Загружено {done} из {done+queue.length}{waiting.some(item=>item.state==='uploading')?' · загружаем…':''}</p>
      {waiting.map(item=><div className={`studio-upload-item${item.state==='failed'?' has-error':''}`} key={item.id}>
        <div><strong>{item.file.name}</strong>{item.state==='uploading'?<><progress max={100} value={item.progress} aria-label={`Загрузка ${item.file.name}`}/><small>{item.progress<100?`${item.progress}%`:'Обрабатываем фото…'}</small></>:<small>{item.state==='failed'?item.error:'В очереди'}</small>}</div>
        {item.state==='failed'&&<><button type="button" className="studio-text-button" onClick={()=>setQueue(current=>current.map(value=>value.id===item.id?{...value,state:'queued',error:''}:value))}>Повторить</button><button type="button" className="studio-icon-button" aria-label={`Убрать из очереди ${item.file.name}`} onClick={()=>setQueue(current=>current.filter(value=>value.id!==item.id))}><Icon name="close"/></button></>}
      </div>)}
    </div>}
  </section>;
}
