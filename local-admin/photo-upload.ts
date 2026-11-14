import { ApiError } from './ui';

export function uploadPhoto(file:File,onProgress:(percent:number)=>void):Promise<string> {
  return new Promise((resolve,reject)=>{
    const request=new XMLHttpRequest();
    request.open('POST','/api/uploads');request.withCredentials=true;request.timeout=90_000;
    request.upload.onprogress=event=>{if(event.lengthComputable)onProgress(Math.round(event.loaded/event.total*100));};
    request.onerror=()=>reject(new ApiError(0,'Нет соединения. Повторите загрузку.'));
    request.ontimeout=()=>reject(new ApiError(0,'Загрузка заняла слишком долго. Повторите попытку.'));
    request.onload=()=>{
      let result:{src?:string;error?:string};
      try{result=JSON.parse(request.responseText);}catch{reject(new ApiError(request.status,'Не удалось загрузить фотографию.'));return;}
      if(request.status===401)window.dispatchEvent(new Event('studio-session-ended'));
      if(request.status<200||request.status>=300||!result.src){reject(new ApiError(request.status,result.error||'Не удалось загрузить фотографию.'));return;}
      resolve(result.src);
    };
    const body=new FormData();body.append('photo',file);request.send(body);
  });
}
