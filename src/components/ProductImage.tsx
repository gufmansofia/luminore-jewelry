import type {ImgHTMLAttributes} from 'react';
import {imageSources} from '../lib/images';
export function ProductImage({src='',sizes='(max-width: 700px) 45vw, (max-width: 1024px) 45vw, 33vw',...props}:ImgHTMLAttributes<HTMLImageElement>){
 return <img {...imageSources(src)} sizes={sizes} decoding="async" {...props}/>;
}
