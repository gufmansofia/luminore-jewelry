import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AdminError } from './store';

export function isHeic(bytes: Uint8Array): boolean {
  if (bytes.length < 16 || new TextDecoder().decode(bytes.slice(4,8)) !== 'ftyp') return false;
  const size=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(0);
  if (size<16 || size>bytes.length) return false;
  const brands=[];
  for(let i=8;i+4<=Math.min(size,256);i+=4) if(i!==12) brands.push(new TextDecoder().decode(bytes.slice(i,i+4)));
  return brands.some(brand=>['heic','heix','hevc','hevx'].includes(brand));
}

// The local prototype runs on macOS. Conversion stays on the user's computer.
export async function convertHeic(bytes: Uint8Array): Promise<Uint8Array> {
  if(process.platform!=='darwin') throw new AdminError(415,'Преобразование HEIC доступно на Mac. Выберите JPG, PNG или WebP.');
  const folder=await mkdtemp(join(tmpdir(),'luminore-heic-'));
  try {
    const input=join(folder,'source.heic'),output=join(folder,'converted.jpg');
    await Bun.write(input,bytes);
    const conversion=Bun.spawn(['/usr/bin/sips','-s','format','jpeg',input,'--out',output],{stdout:'ignore',stderr:'ignore'});
    const timer=setTimeout(()=>conversion.kill(),30_000);
    let code:number;
    try { code=await conversion.exited; } finally { clearTimeout(timer); }
    if(code!==0 || !await Bun.file(output).exists()) throw new AdminError(415,'Не удалось преобразовать это HEIC-фото. Выберите другую фотографию или JPG.');
    return new Uint8Array(await Bun.file(output).arrayBuffer());
  } finally { await rm(folder,{recursive:true,force:true}); }
}
