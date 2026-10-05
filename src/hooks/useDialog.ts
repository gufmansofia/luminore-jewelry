import {useEffect,useRef} from 'react';
export function useDialog(open:boolean,onClose:()=>void) {
 const ref=useRef<HTMLDivElement>(null);
 const close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  if(!open||!ref.current)return;
  const dialog=ref.current;
  const previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;
  const focusable=()=>Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const inerted:HTMLElement[]=[];
  let child:HTMLElement=dialog;
  while(child.parentElement){
   for(const sibling of Array.from(child.parentElement.children))if(sibling!==child&&sibling instanceof HTMLElement&&!sibling.inert){sibling.inert=true;inerted.push(sibling);}
   child=child.parentElement;
   if(child===document.body)break;
  }
  document.body.style.overflow='hidden';
  (focusable()[0]??dialog).focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close.current();}
   if(e.key==='Tab'){
    const nodes=focusable(),first=nodes[0],last=nodes[nodes.length-1];
    if(!first){e.preventDefault();dialog.focus();return;}
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
  };
  dialog.addEventListener('keydown',key);
  return ()=>{dialog.removeEventListener('keydown',key);document.body.style.overflow=overflow;inerted.forEach(el=>el.inert=false);if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[open]);
 return ref;
}
