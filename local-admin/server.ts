import { mkdir } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import index from './index.html';
import { AdminStore } from './store';
import { createAdminApi, requestMember } from './api';

if (process.env.NODE_ENV === 'production' || process.env.VERCEL) throw new Error('The invitation-only email prototype must never run in production.');
const owner = process.env.LOCAL_ADMIN_OWNER_EMAIL;
if (!owner) throw new Error('Set LOCAL_ADMIN_OWNER_EMAIL in .env.local before starting the local admin.');
const directory=resolve(process.env.LOCAL_ADMIN_DATA_DIR||'.local-admin');
await mkdir(directory,{recursive:true});
const store=new AdminStore(join(directory,'catalogue.sqlite'),owner);
const uploads=join(directory,'uploads'), api=createAdminApi(store,uploads), publicRoot=resolve('public');
const mime:Record<string,string>={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2'};
async function fileFrom(root:string,relative:string,privateFile=false) {
  try {
    const path=resolve(root,decodeURIComponent(relative));
    if(!path.startsWith(root+sep)||!mime[extname(path).toLowerCase()])return new Response('Not found',{status:404});
    const file=Bun.file(path);
    if(!await file.exists())return new Response('Not found',{status:404});
    return new Response(file,{headers:{'Content-Type':mime[extname(path).toLowerCase()]!,'Cache-Control':privateFile?'private, no-store':'public, max-age=3600','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow'}});
  } catch{return new Response('Not found',{status:404});}
}
const server=Bun.serve({
  hostname:'127.0.0.1', port:Number(process.env.LOCAL_ADMIN_PORT||3048), maxRequestBodySize:17*1024*1024,
  routes:{
    '/':()=>new Response(null,{status:302,headers:{Location:'/admin'}}),
    '/api/*':api,
    '/Products/*':req=>fileFrom(publicRoot,new URL(req.url).pathname.slice(1)),
    '/optimized/*':req=>fileFrom(publicRoot,new URL(req.url).pathname.slice(1)),
    '/fonts/*':req=>fileFrom(publicRoot,new URL(req.url).pathname.slice(1)),
    '/admin-uploads/*':req=>requestMember(store,req)?fileFrom(uploads,new URL(req.url).pathname.slice('/admin-uploads/'.length),true):new Response('Sign in first',{status:401}),
    '/admin':index,
    '/admin/*':index,
  },
  fetch:()=>new Response('Not found',{status:404}),
  development:true,
});
console.log(`Local photo catalogue: http://localhost:${server.port}/admin`);
console.log('Local email-only invitations. No emails are sent. Website source is never written.');
