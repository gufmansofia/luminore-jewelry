import type { AdminProduct, ProductData } from './types';

export function draftFingerprint(data: ProductData): string {
  return JSON.stringify({...data,id:0,sku:'',altText:data.altText.trim()||data.names.en.trim()},(_,value)=>typeof value==='string'?value.trim():value);
}
export const hasDraftContent=(data:ProductData)=>!!data.names.en.trim()||data.images.length>0;
type Transport=(record:AdminProduct|null,data:ProductData,key:string)=>Promise<AdminProduct>;

// All saves share one queue and one latest version, including the initial POST.
export class DraftWriter {
  record:AdminProduct|null;
  private tail:Promise<unknown>=Promise.resolve();
  private conflict:Error|null=null;
  constructor(record:AdminProduct|null,private transport:Transport,private persisted:(product:AdminProduct)=>void,private key=crypto.randomUUID()) { this.record=record; }
  save(data:ProductData):Promise<AdminProduct> {
    const snapshot=structuredClone(data);
    const task=this.tail.then(async()=>{
      if(this.conflict)throw this.conflict;
      if(this.record&&draftFingerprint(snapshot)===draftFingerprint(this.record.data))return this.record;
      try {
        const saved=await this.transport(this.record,snapshot,this.key);
        this.record=saved;this.persisted(saved);return saved;
      } catch(error) {
        if((error as {status?:number}).status===409)this.conflict=error as Error;
        throw error;
      }
    });
    this.tail=task.catch(()=>{});
    return task;
  }
  async settled(){await this.tail;}
}
