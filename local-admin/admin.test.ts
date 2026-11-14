import { afterEach, describe, expect, test } from 'bun:test';
import { AdminStore, seedProduct } from './store';
import { createAdminApi, imageExtension, sessionCookie } from './api';
import { products } from '../src/data/products';
import { emptyProduct, publicationMissing, productStatus } from './types';
import { DraftWriter, draftFingerprint, hasDraftContent } from './draft-writer';
import { convertHeic, isHeic } from './heic';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { Database } from 'bun:sqlite';

const stores:AdminStore[]=[];
const folders:string[]=[];
afterEach(async()=>{stores.splice(0).forEach(s=>s.close());for(const path of folders.splice(0))await rm(path,{recursive:true,force:true});});
function setup(){const store=new AdminStore(':memory:','owner@example.com',products.map(seedProduct));stores.push(store);return store;}
function request(path:string,method='GET',value?:unknown,cookie?:string,extra:Record<string,string>={}){
  return new Request(`http://localhost:3048/api${path}`,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...extra},...(value===undefined?{}:{body:JSON.stringify(value)})});
}
function session(token:string){return `${sessionCookie}=${token}`;}
describe('local invitation-only prototype',()=>{
  test('only an invited address can sign in; invitation matching is normalized',async()=>{
    const store=setup(),api=createAdminApi(store,'/tmp/unused-studio-uploads');
    const denied=await api(request('/login','POST',{email:'stranger@example.com'}));
    expect(denied.status).toBe(403);expect(store.member('stranger@example.com')).toBeNull();
    const owner=store.login('owner@example.com').user;
    store.invite(owner,'  Editor@Example.com  ','editor');
    const response=await api(request('/login','POST',{email:'EDITOR@example.com'}));
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('HttpOnly; SameSite=Strict');
    expect((await response.json()).user).toMatchObject({email:'editor@example.com',role:'editor',status:'active'});
  });
  test('catalogue, new products, and invitations cannot be reached without a session',async()=>{
    const api=createAdminApi(setup(),'/tmp/unused-studio-uploads');
    for(const [path,method] of [['/products','GET'],['/products','POST'],['/members','GET'],['/uploads','POST']] as const){
      expect((await api(request(path,method,method==='POST'?{}:undefined))).status).toBe(401);
    }
  });
  test('editors cannot invite people, revoke access, restore versions, or publish',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    store.invite(owner,'editor@example.com','editor');
    const cookie=session(store.login('editor@example.com').token),api=createAdminApi(store,'/tmp/unused-studio-uploads');
    expect((await api(request('/members','POST',{email:'other@example.com',role:'publisher'},cookie))).status).toBe(403);
    expect((await api(request('/members','DELETE',{email:owner.email},cookie))).status).toBe(403);
    expect((await api(request('/products/50/publish','POST',{version:1},cookie))).status).toBe(403);
    expect((await api(request('/products/50/restore','POST',{version:1,revision:1},cookie))).status).toBe(403);
  });
  test('revocation invalidates existing sessions as well as subsequent sign-ins',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    store.invite(owner,'editor@example.com','editor');
    const token=store.login('editor@example.com').token;
    expect(store.session(token)?.email).toBe('editor@example.com');
    store.revoke(owner,'editor@example.com');
    expect(store.session(token)).toBeNull();
    expect(()=>store.login('editor@example.com')).toThrow();
    expect(()=>store.revoke(owner,'owner@example.com')).toThrow();
  });
  test('all 108 existing products keep their IDs, exact carats, brands and approved prices',()=>{
    const store=setup();expect(store.list()).toHaveLength(108);
    expect(store.product(50).data).toMatchObject({sku:'P050',brand:'Zoke',price:2400,totalCarat:4.27});
    expect(store.product(1).data).toMatchObject({sku:'P001',price:1700,totalCarat:2});
    expect(store.product(133).data.totalCarat).toBe(11.85);
    expect(store.product(117).data.stoneType).toBe('Natural Diamond');
  });
  test('draft edits never replace the published copy or modify website source',async()=>{
    const sourcePath=join(import.meta.dir,'../src/data/approved-prices.ts');
    const hash=(data:Buffer)=>createHash('sha256').update(data).digest('hex');
    const before=hash(await readFile(sourcePath));
    const store=setup(),owner=store.login('owner@example.com').user,original=store.product(50);
    const edited=store.save(owner,50,{...original.data,price:2450},original.version);
    expect(edited.data.price).toBe(2450);expect(edited.published!.price).toBe(2400);expect(edited.hasChanges).toBe(true);
    const published=store.publish(owner,50,edited.version);
    expect(published.published!.price).toBe(2450);expect(published.hasChanges).toBe(false);
    expect(products.find(p=>p.id===50)?.priceUsd).toBe(2400);
    expect(hash(await readFile(sourcePath))).toBe(before);
  });
  test('concurrent stale edits are rejected and existing SKUs cannot be replaced',()=>{
    const store=setup(),owner=store.login('owner@example.com').user,p=store.product(24);
    const updated=store.save(owner,24,{...p.data,sku:'P999',id:999,price:4100},p.version);
    expect(updated.data.sku).toBe('P024');expect(updated.data.id).toBe(24);
    expect(()=>store.save(owner,24,p.data,p.version)).toThrow('Карточку уже изменили');
  });
  test('new products get unique automatic SKUs and remain drafts until complete',()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    const data={...emptyProduct(),names:{en:'New ring',ru:'',uk:''}};
    const a=store.create(owner,data),b=store.create(owner,data);
    expect(a.data.sku).toBe('P138');expect(b.data.sku).toBe('P139');expect(a.published).toBeNull();
    expect(()=>store.publish(owner,a.data.id,a.version)).toThrow('добавьте цену');
    const edited=store.save(owner,a.data.id,{...a.data,price:1100,images:[store.product(24).data.images[0]]},a.version);
    expect(store.publish(owner,a.data.id,edited.version).published?.price).toBe(1100);
  });
  test('restoring a saved revision creates a draft without changing the published version',()=>{
    const store=setup(),owner=store.login('owner@example.com').user,p=store.product(24);
    const changed=store.save(owner,24,{...p.data,price:4300},p.version);
    const revision=store.history(24)[0]!;
    const restored=store.restore(owner,24,revision.id,changed.version);
    expect(restored.data.price).toBe(4050);expect(restored.published?.price).toBe(4050);expect(restored.hasChanges).toBe(true);
  });
  test('non-local hosts, cross-site requests and unsupported image formats are rejected',async()=>{
    const store=setup(),api=createAdminApi(store,'/tmp/unused-studio-uploads');
    const cross=await api(request('/login','POST',{email:'owner@example.com'},undefined,{Origin:'https://example.com'}));expect(cross.status).toBe(403);
    const remote=await api(new Request('https://www.luminorejewelry.com/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}));expect(remote.status).toBe(403);
    expect(imageExtension(new TextEncoder().encode('<svg onload="alert(1)"></svg>'))).toBeNull();
    expect(imageExtension(new Uint8Array([137,80,78,71,13,10,26,10]))).toBe('png');
  });
  test('uploads are authenticated, named by the server, and reject SVG disguised as a photo',async()=>{
    const folder=await mkdtemp(join(tmpdir(),'luminore-admin-test-'));folders.push(folder);
    const store=setup(),cookie=session(store.login('owner@example.com').token),api=createAdminApi(store,folder);
    const bad=new FormData();bad.append('photo',new File(['<svg/>'],'photo.png',{type:'image/png'}));
    expect((await api(new Request('http://localhost:3048/api/uploads',{method:'POST',headers:{Cookie:cookie},body:bad}))).status).toBe(415);
    const good=new FormData();good.append('photo',new File([new Uint8Array([137,80,78,71,13,10,26,10,0,0])],'../../unsafe.png',{type:'image/png'}));
    const response=await api(new Request('http://localhost:3048/api/uploads',{method:'POST',headers:{Cookie:cookie},body:good}));
    expect(response.status).toBe(201);expect((await response.json()).src).toMatch(/^\/admin-uploads\/[a-f0-9-]+\.png$/);
  });
  test('catalogue changes and invitations survive a server restart',async()=>{
    const directory=await mkdtemp(join(tmpdir(),'luminore-admin-store-'));folders.push(directory);
    const file=join(directory,'catalogue.sqlite');
    const first=new AdminStore(file,'owner@example.com'),owner=first.login('owner@example.com').user;
    first.invite(owner,'editor@example.com','editor');const p=first.product(50);first.save(owner,50,{...p.data,price:2500},p.version);first.close();
    const second=new AdminStore(file,'owner@example.com');stores.push(second);
    expect(second.member('editor@example.com')?.status).toBe('invited');expect(second.product(50).data.price).toBe(2500);expect(second.product(50).published?.price).toBe(2400);
  });
  test('deleting an unpublished draft preserves its data, SKU, photos and history in recoverable trash',()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    const draft=store.create(owner,{...emptyProduct(),names:{en:'Draft to remove',ru:'',uk:''},price:1100,images:[store.product(24).data.images[0]]});
    const result=store.deleteDraft(owner,draft.data.id,draft.version);
    expect(result.kind).toBe('deleted');expect(result.product.deletedBy).toBe(owner.email);expect(result.product.deletedAt).not.toBeNull();
    expect(store.list()).toHaveLength(108);expect(store.trash()).toHaveLength(1);expect(store.trash()[0]!.data).toEqual(draft.data);
    expect(()=>store.product(draft.data.id)).toThrow('Украшение не найдено');
    expect(()=>store.save(owner,draft.data.id,draft.data,result.product.version)).toThrow();
    expect(()=>store.publish(owner,draft.data.id,result.product.version)).toThrow();
    const next=store.create(owner,{...emptyProduct(),names:{en:'Another draft',ru:'',uk:''}});
    expect(next.data.sku).toBe('P139');
    const restored=store.restoreDraft(owner,draft.data.id,result.product.version);
    expect(restored.data).toEqual(draft.data);expect(restored.data.sku).toBe('P138');expect(restored.published).toBeNull();
    expect(restored.deletedAt).toBeNull();expect(store.trash()).toHaveLength(0);
    expect(store.history(draft.data.id).map(r=>r.action)).toEqual(['undeleted','deleted','created']);
  });
  test('discarding an existing product draft keeps the published piece and allows historical recovery',()=>{
    const store=setup(),owner=store.login('owner@example.com').user,original=store.product(50);
    const edited=store.save(owner,50,{...original.data,price:2450,names:{...original.data.names,en:'Wrong edited ring'}},original.version);
    const result=store.deleteDraft(owner,50,edited.version);
    expect(result.kind).toBe('discarded');expect(result.product.data).toEqual(original.data);expect(result.product.published).toEqual(original.published);
    expect(result.product.hasChanges).toBe(false);expect(result.product.deletedAt).toBeNull();expect(store.trash()).toHaveLength(0);
    const revision=store.history(50)[0]!;expect(revision.action).toBe('discarded');
    const recovered=store.restore(owner,50,revision.id,result.product.version);
    expect(recovered.data.price).toBe(2450);expect(recovered.published?.price).toBe(2400);
  });
  test('a published product without draft changes cannot be removed',()=>{
    const store=setup(),owner=store.login('owner@example.com').user,original=store.product(24);
    expect(()=>store.deleteDraft(owner,24,original.version)).toThrow('Удалить её этой кнопкой нельзя');
    expect(store.product(24)).toEqual(original);expect(store.trash()).toHaveLength(0);expect(store.list()).toHaveLength(108);
  });
  test('delete and restore require authentication and reject stale versions',async()=>{
    const store=setup(),owner=store.login('owner@example.com'),api=createAdminApi(store,'/tmp/unused-studio-uploads');
    const p=store.create(owner.user,{...emptyProduct(),names:{en:'Versioned draft',ru:'',uk:''}}),cookie=session(owner.token);
    expect((await api(request(`/products/${p.data.id}`,'DELETE',{version:p.version}))).status).toBe(401);
    const changed=store.save(owner.user,p.data.id,{...p.data,price:1100},p.version);
    expect((await api(request(`/products/${p.data.id}`,'DELETE',{version:p.version},cookie))).status).toBe(409);
    expect(store.trash()).toHaveLength(0);
    const response=await api(request(`/products/${p.data.id}`,'DELETE',{version:changed.version},cookie));
    expect(response.status).toBe(200);const deleted=await response.json();
    expect((await api(request(`/products/${p.data.id}/restore-draft`,'POST',{version:deleted.product.version}))).status).toBe(401);
    expect((await api(request(`/products/${p.data.id}/restore-draft`,'POST',{version:changed.version},cookie))).status).toBe(409);
    const restored=await api(request(`/products/${p.data.id}/restore-draft`,'POST',{version:deleted.product.version},cookie));
    expect(restored.status).toBe(200);expect((await restored.json()).product.data.price).toBe(1100);
  });
  test('an invited editor can delete and restore shared drafts without gaining publication rights',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    store.invite(owner,'editor@example.com','editor');const cookie=session(store.login('editor@example.com').token);
    const api=createAdminApi(store,'/tmp/unused-studio-uploads');
    const p=store.create(owner,{...emptyProduct(),names:{en:'Team draft',ru:'',uk:''}});
    const response=await api(request(`/products/${p.data.id}`,'DELETE',{version:p.version},cookie));expect(response.status).toBe(200);
    const deleted=await response.json();
    expect(deleted.product.deletedBy).toBe('editor@example.com');
    expect((await api(request(`/products/${p.data.id}/restore-draft`,'POST',{version:deleted.product.version},cookie))).status).toBe(200);
    expect((await api(request('/products/50','DELETE',{version:1},cookie))).status).toBe(400);
    expect((await api(request('/products/50/publish','POST',{version:1},cookie))).status).toBe(403);
  });
  test('upgrading an existing local database preserves products, invitations and deleted drafts across restarts',async()=>{
    const directory=await mkdtemp(join(tmpdir(),'luminore-admin-upgrade-'));folders.push(directory);const file=join(directory,'old.sqlite');
    const old=new Database(file,{create:true});
    old.exec('CREATE TABLE products(id INTEGER PRIMARY KEY,sku TEXT UNIQUE NOT NULL,data TEXT NOT NULL,published TEXT,hasChanges INTEGER NOT NULL,version INTEGER NOT NULL,updatedAt TEXT NOT NULL,updatedBy TEXT NOT NULL,position INTEGER NOT NULL); CREATE TABLE members(email TEXT PRIMARY KEY,role TEXT NOT NULL,status TEXT NOT NULL,invitedAt TEXT NOT NULL,lastLoginAt TEXT);');
    const published=seedProduct(products.find(p=>p.id===24)!);
    const draft={...emptyProduct(),id:138,sku:'P138',names:{en:'Existing local draft',ru:'',uk:''},images:[published.images[0]]};
    const timestamp=new Date().toISOString();
    old.query('INSERT INTO products VALUES(?,?,?,?,?,?,?,?,?)').run(24,'P024',JSON.stringify(published),JSON.stringify(published),0,1,timestamp,'owner@example.com',0);
    old.query('INSERT INTO products VALUES(?,?,?,?,?,?,?,?,?)').run(138,'P138',JSON.stringify(draft),null,1,1,timestamp,'owner@example.com',-1);
    old.query("INSERT INTO members VALUES(?,'editor','invited',?,NULL)").run('existing@example.com',timestamp);old.close();
    const upgraded=new AdminStore(file,'owner@example.com');
    expect(upgraded.product(24).data).toEqual(published);expect(upgraded.product(138).data).toEqual(draft);expect(upgraded.member('existing@example.com')?.role).toBe('editor');
    const deleted=upgraded.deleteDraft(upgraded.login('owner@example.com').user,138,1);upgraded.close();
    const reopened=new AdminStore(file,'owner@example.com');stores.push(reopened);
    expect(reopened.list()).toHaveLength(1);expect(reopened.trash()[0]!.data).toEqual(draft);
    expect(reopened.restoreDraft(reopened.login('owner@example.com').user,138,deleted.product.version).data).toEqual(draft);
    expect(reopened.product(24).published).toEqual(published);
  });
});


describe('simpler draft editing and photos',()=>{
  test('the gallery accepts more than 16 photos and preserves the whole order',()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    const images=Array.from({length:120},(_,i)=>`/Products/photo-${i}.jpg`);
    const draft=store.create(owner,{...emptyProduct(),names:{en:'Large gallery',ru:'',uk:''},images});
    expect(draft.data.images).toEqual(images);
    const reordered=[images[119]!,...images.slice(0,119)];
    expect(store.save(owner,draft.data.id,{...draft.data,images:reordered},draft.version).data.images).toEqual(reordered);
  });
  test('empty forms cannot create products, while photo-only drafts can be saved but not published',()=>{
    const store=setup(),owner=store.login('owner@example.com').user;
    expect(hasDraftContent(emptyProduct())).toBe(false);
    expect(()=>store.create(owner,emptyProduct())).toThrow('название или фотографию');
    const draft=store.create(owner,{...emptyProduct(),images:[store.product(24).data.images[0]!],price:1200});
    expect(hasDraftContent(draft.data)).toBe(true);
    expect(publicationMissing(draft.data)).toEqual(['название']);expect(productStatus(draft)).toBe('draft');
    expect(()=>store.publish(owner,draft.data.id,draft.version)).toThrow('название');
    const complete=store.save(owner,draft.data.id,{...draft.data,names:{en:'Photo-first ring',ru:'',uk:''}},draft.version);
    expect(productStatus(complete)).toBe('ready');
    expect(productStatus(store.publish(owner,complete.data.id,complete.version))).toBe('published');
  });
  test('queued saves create one draft and serialize edits against the latest version',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user,calls:(number|null)[]=[];
    let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});
    const writer=new DraftWriter(null,async(record,data,key)=>{calls.push(record?.version??null);if(!record)await gate;return record?store.save(owner,record.data.id,data,record.version):store.create(owner,data,key);},()=>{});
    const first={...emptyProduct(),names:{en:'First name',ru:'',uk:''}};
    const a=writer.save(first),b=writer.save({...first,names:{...first.names,en:'Latest name'},price:2300});
    await Promise.resolve();expect(calls).toEqual([null]);release();await a;const saved=await b;
    expect(calls).toEqual([null,1]);expect(saved.data.names.en).toBe('Latest name');expect(saved.data.price).toBe(2300);
    expect(draftFingerprint({...first,names:{...first.names,en:'Latest name'},price:2300})).toBe(draftFingerprint(saved.data));
    expect(store.list()).toHaveLength(109);
    const same=await writer.save({...saved.data,names:{...saved.data.names,en:' Latest name '}});
    expect(same.version).toBe(2);expect(draftFingerprint(same.data)).toBe(draftFingerprint(saved.data));
  });
  test('a lost creation response can be retried without duplicating the product',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user;let loseResponse=true;
    const writer=new DraftWriter(null,async(record,data,key)=>{
      const saved=record?store.save(owner,record.data.id,data,record.version):store.create(owner,data,key);
      if(loseResponse){loseResponse=false;throw new Error('Connection lost');}return saved;
    },()=>{});
    const data={...emptyProduct(),names:{en:'Retry ring',ru:'',uk:''}};
    await expect(writer.save(data)).rejects.toThrow('Connection lost');
    const saved=await writer.save(data);expect(saved.data.sku).toBe('P138');expect(store.list()).toHaveLength(109);
  });
  test('a stale autosave pauses further writes and never overwrites another editor',async()=>{
    const store=setup(),owner=store.login('owner@example.com').user,initial=store.product(24);let calls=0;
    const other=store.save(owner,24,{...initial.data,price:4567},initial.version);
    const writer=new DraftWriter(initial,async(record,data)=>{calls++;return store.save(owner,24,data,record!.version);},()=>{});
    await expect(writer.save({...initial.data,price:1111})).rejects.toMatchObject({status:409});
    await expect(writer.save({...initial.data,price:2222})).rejects.toMatchObject({status:409});
    expect(calls).toBe(1);expect(store.product(24).data.price).toBe(other.data.price);
  });
  test('HEIC detection accepts HEVC still images and rejects video and AVIF containers',()=>{
    const box=(brand:string)=>new Uint8Array([0,0,0,20,...Buffer.from('ftyp'+brand),0,0,0,0,...Buffer.from(brand)]);
    expect(isHeic(box('heic'))).toBe(true);expect(isHeic(box('heix'))).toBe(true);
    expect(isHeic(box('mp42'))).toBe(false);expect(isHeic(box('avif'))).toBe(false);
    expect(isHeic(new Uint8Array([1,2,3]))).toBe(false);
  });
  test.skipIf(process.platform!=='darwin')('a real HEIC file is converted locally to a browser-viewable JPEG',async()=>{
    const folder=await mkdtemp(join(tmpdir(),'luminore-heic-test-'));folders.push(folder);
    const target=join(folder,'test.heic');
    const command=Bun.spawn(['/usr/bin/sips','-Z','64','-s','format','heic','public/Products/Rings/Yellow Pear Ring (P024)/yellow-pear-front-v1.png','--out',target],{stdout:'ignore',stderr:'ignore'});
    expect(await command.exited).toBe(0);
    const input=new Uint8Array(await Bun.file(target).arrayBuffer());expect(isHeic(input)).toBe(true);
    const jpeg=await convertHeic(input);expect(imageExtension(jpeg)).toBe('jpg');
  });
});
