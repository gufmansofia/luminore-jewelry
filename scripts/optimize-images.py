"""Create responsive delivery copies. Never overwrite supplied originals."""
import hashlib,json,subprocess
from pathlib import Path
from PIL import Image,ImageOps
root=Path(__file__).resolve().parent.parent
paths=json.loads(subprocess.check_output(['bun','-e','import {products} from "./src/data/products"; import {blogPosts} from "./src/data/blogs"; import {spotlightPieces} from "./src/data/spotlight"; console.log(JSON.stringify([...new Set([...products.flatMap(p=>p.images),...blogPosts.map(p=>p.image).filter(Boolean),...spotlightPieces.map(p=>p.image),"/atelier-hero.png"])]));'],cwd=root,text=True))
out=root/'public/optimized';out.mkdir(exist_ok=True)
manifest={};original_bytes=0;delivery_bytes=0
for source in paths:
 file=root/'public'/source.lstrip('/');digest=hashlib.sha256(file.read_bytes()).hexdigest()[:16]
 with Image.open(file) as raw:
  img=ImageOps.exif_transpose(raw).convert('RGB');width,height=img.size;variants=[]
  for target in sorted(set([min(width,n) for n in [480,960,1600]])):
   name=f'{digest}-{target}.webp';dest=out/name
   if not dest.exists():
    copy=img.copy();copy.thumbnail((target,round(height*target/width)),Image.Resampling.LANCZOS);copy.save(dest,'WEBP',quality=88,method=6)
   variants.append({'src':'/optimized/'+name,'width':target})
  manifest[source]={'width':width,'height':height,'variants':variants}
  original_bytes+=file.stat().st_size;delivery_bytes+=(out/Path(variants[0]['src']).name).stat().st_size
(root/'src/data/image-manifest.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
print(f'{len(paths)} images: originals {original_bytes/1e6:.1f} MB; catalogue-size copies {delivery_bytes/1e6:.1f} MB. Originals preserved.')
