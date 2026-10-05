import manifest from '../data/image-manifest.json';
export function imageSources(src:string,width=960){
 const image=manifest[src as keyof typeof manifest];
 if(!image)return {src};
 return {src:(image.variants.find(v=>v.width>=width)??image.variants[image.variants.length-1]).src,srcSet:image.variants.map(v=>`${v.src} ${v.width}w`).join(', '),width:image.width,height:image.height};
}
