import path from 'node:path';
import { videoResponse } from '../src/lib/video-response';
const root=path.resolve('dist');
const server=Bun.serve({hostname:'127.0.0.1',port:Number(process.env.PREVIEW_PORT||3030),async fetch(request){
 const url=new URL(request.url);
 let pathname:string;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
 if(pathname.split('/').includes('..'))return new Response('Not found',{status:404});
 const language=url.searchParams.get('lang');
 if(['en','ru','uk'].includes(language??'')){url.pathname=(language==='en'?'':`/${language}`)+(pathname.replace(/^\/(?:ru|uk)(?=\/|$)/,'')||'/');url.searchParams.delete('lang');return Response.redirect(url.href,308);}
 if(pathname.endsWith('.html')||pathname.length>1&&pathname.endsWith('/')){url.pathname=pathname.replace(/\.html$|\/$/,'')||'/';return Response.redirect(url.href,308);}
 const candidate=path.join(root,pathname==='/'?'index.html':path.extname(pathname)?pathname:pathname+'.html');
 if(candidate!==root&&!candidate.startsWith(root+path.sep))return new Response('Not found',{status:404});
 let file=Bun.file(candidate);if(await file.exists())return pathname.endsWith('.mp4')?videoResponse(file,request):new Response(file,{status:/\/404$/.test(pathname)?404:200});
 file=Bun.file(path.join(root,/^\/(ru|uk)\b/.exec(pathname)?.[1]??'','404.html'));
 return new Response(file,{status:404,headers:{'Content-Type':'text/html; charset=utf-8'}});
}});
console.log(`Built site preview: ${server.url}`);
