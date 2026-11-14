import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { AdminError, type AdminStore } from './store';

export const sessionCookie = 'luminore_local_admin';
const cookieValue = (req: Request) => req.headers.get('cookie')?.split(';').map(p => p.trim()).find(p => p.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1);
export function imageExtension(bytes: Uint8Array) {
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n)) return 'png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0,4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8,12)) === 'WEBP') return 'webp';
  return null;
}
function localRequest(req: Request) {
  const url = new URL(req.url);
  if (!['localhost','127.0.0.1','[::1]'].includes(url.hostname)) throw new AdminError(403, 'Прототип доступен только на localhost.');
  const origin = req.headers.get('origin');
  if (req.method !== 'GET' && req.method !== 'HEAD' && origin && origin !== url.origin) throw new AdminError(403, 'Запрос с другого сайта отклонён.');
  if (req.headers.get('sec-fetch-site') === 'cross-site') throw new AdminError(403, 'Запрос с другого сайта отклонён.');
}
const json = (value: unknown, status=200, headers: Record<string,string>={}) => Response.json(value, {status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow',...headers}});
async function body(req: Request) {
  if (!req.headers.get('content-type')?.startsWith('application/json')) throw new AdminError(415, 'Ожидаются данные карточки.');
  const raw = await req.text();
  if (raw.length > 200_000) throw new AdminError(413, 'Слишком много данных. Фотографии загружаются отдельно.');
  try { return JSON.parse(raw); } catch { throw new AdminError(400, 'Не удалось прочитать данные.'); }
}
export function createAdminApi(store: AdminStore, uploadDirectory: string) {
  return async (req: Request) => {
    try {
      localRequest(req);
      const { pathname } = new URL(req.url), method = req.method;
      if (pathname === '/api/login' && method === 'POST') {
        const {email} = await body(req);
        const {token,user} = store.login(email);
        return json({user,localOnly:true},200,{'Set-Cookie':`${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200`});
      }
      const token = cookieValue(req), actor = store.session(token);
      if (!actor) throw new AdminError(401, 'Войдите по приглашённой почте.');
      if (pathname === '/api/session' && method === 'GET') return json({user:actor,localOnly:true});
      if (pathname === '/api/logout' && method === 'POST') {
        store.logout(token); return json({ok:true},200,{'Set-Cookie':`${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`});
      }
      if (pathname === '/api/products') {
        if (method === 'GET') return json({products:store.list(),trash:store.trash()});
        if (method === 'POST') return json({product:store.create(actor,(await body(req)).data)},201);
      }
      const product = pathname.match(/^\/api\/products\/(\d+)(?:\/(history|publish|restore|restore-draft))?$/);
      if (product) {
        const id = Number(product[1]), action = product[2];
        if (!action && method === 'GET') return json({product:store.product(id)});
        if (!action && method === 'PUT') { const p=await body(req); return json({product:store.save(actor,id,p.data,p.version)}); }
        if (!action && method === 'DELETE') return json(store.deleteDraft(actor,id,(await body(req)).version));
        if (action === 'history' && method === 'GET') return json({revisions:store.history(id)});
        if (action === 'publish' && method === 'POST') return json({product:store.publish(actor,id,(await body(req)).version)});
        if (action === 'restore' && method === 'POST') { const p=await body(req); return json({product:store.restore(actor,id,Number(p.revision),p.version)}); }
        if (action === 'restore-draft' && method === 'POST') return json({product:store.restoreDraft(actor,id,(await body(req)).version)});
      }
      if (pathname === '/api/members') {
        if (method === 'GET') return json({members:store.members(actor)});
        if (method === 'POST') { const p=await body(req); return json({member:store.invite(actor,p.email,p.role)},201); }
        if (method === 'DELETE') { store.revoke(actor,(await body(req)).email); return json({ok:true}); }
      }
      if (pathname === '/api/uploads' && method === 'POST') {
        const form = await req.formData(), file = form.get('photo');
        if (!(file instanceof File) || !file.size) throw new AdminError(400, 'Выберите фотографию.');
        if (file.size > 15 * 1024 * 1024) throw new AdminError(413, 'Размер фотографии должен быть не больше 15 МБ.');
        const bytes = new Uint8Array(await file.arrayBuffer()), ext=imageExtension(bytes);
        if (!ext) throw new AdminError(415, 'Поддерживаются фотографии JPG, PNG и WebP.');
        await mkdir(uploadDirectory,{recursive:true});
        const name=`${randomUUID()}.${ext}`;
        await Bun.write(join(uploadDirectory,name),bytes);
        return json({src:`/admin-uploads/${name}`},201);
      }
      return json({error:'Адрес не найден.'},404);
    } catch(error) {
      if(error instanceof AdminError) return json({error:error.message},error.status);
      console.error('Local admin request failed:',error instanceof Error?error.message:error);
      return json({error:'Не удалось сохранить изменения. Попробуйте ещё раз.'},500);
    }
  };
}
export function requestMember(store: AdminStore, req: Request) { return store.session(cookieValue(req)); }
