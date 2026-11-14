import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { imageSources } from '../src/lib/images';
import { productStatus, statusLabels, type AdminProduct } from './types';

const paths: Record<string,string> = {
  grip:'M8 5h.01M16 5h.01M8 12h.01M16 12h.01M8 19h.01M16 19h.01', plus:'M12 5v14M5 12h14', search:'m21 21-4.4-4.4M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
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
export function Icon({name,...props}:{name:string;className?:string}) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]||paths.gem}/></svg>; }
export const usd=(value:number|null)=>value===null?'Цена не указана':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
export const date=(value:string)=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value));
export class ApiError extends Error { constructor(public status:number,message:string){super(message);} }
export async function api<T>(path:string,options:RequestInit={}):Promise<T> {
  let response:Response;
  try { response=await fetch(`/api${path}`,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers},credentials:'same-origin'}); }
  catch { throw new ApiError(0,'Не удалось подключиться к локальной панели. Убедитесь, что она запущена, и повторите попытку.'); }
  let result:any;
  try { result=await response.json(); }
  catch { throw new ApiError(response.status,response.status===413?'Размер фотографии должен быть не больше 15 МБ.':'Сервер не ответил. Попробуйте ещё раз.'); }
  if(!response.ok){if(response.status===401&&path!=='/session')window.dispatchEvent(new Event('studio-session-ended'));throw new ApiError(response.status,result.error||'Не удалось выполнить запрос.');}
  return result;
}
export function Photo({src,name,className='',eager=false}:{src?:string;name:string;className?:string;eager?:boolean}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  return src&&!failed?<img className={className} src={imageSources(src,480).src} alt={name} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>:<div className={`studio-photo-empty ${className}`}><Icon name="gem"/><span>Фото не добавлено</span></div>;
}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}) {return <label className="studio-field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>;}
export function Status({product}:{product:AdminProduct}){const status=productStatus(product);return <span className={`studio-status studio-status--${status}`}>{statusLabels[status]}</span>;}
export function Loading(){return <div className="studio-loading" role="status"><span className="studio-wordmark">LUMINORE</span><span className="studio-spinner"/>Открываем панель…</div>;}
export function Confirm({title,description,action,onCancel,onConfirm,busy=false,danger=false,error=''}:{title:string;description:string;action:string;onCancel:()=>void;onConfirm:()=>void;busy?:boolean;danger?:boolean;error?:string}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{ref.current?.showModal();return()=>ref.current?.close();},[]);
  return <dialog className="studio-dialog" ref={ref} onCancel={e=>{e.preventDefault();if(!busy)onCancel();}}><h2>{title}</h2><p>{description}</p>{error&&<p className="studio-error" role="alert">{error}</p>}<div><button className="studio-secondary" disabled={busy} onClick={onCancel}>Отмена</button><button className={`studio-primary${danger?' studio-danger-button':''}`} disabled={busy} onClick={onConfirm}>{busy?'Подождите…':action}</button></div></dialog>;
}
