import type { CSSProperties } from 'react';
import type { Product } from '../data/products';

// Art direction belongs to the catalogue cover, never the full product gallery.
// These existing top views show the complete pendant and its attachments.
const closeUpIndex: Record<number, number> = { 12: 3, 13: 3, 14: 3, 15: 3 };
const framing: Record<number, [number, string]> = {
  20:[2.1,'67% 58%'],21:[2.1,'67% 58%'],22:[2.1,'67% 58%'],
  12: [1.3, '50% 64%'],
  109: [2.6, '52% 88%'],
  110: [3, '50% 84%'],
  111: [3.2, '50% 75%'],
  112: [2.4, '50% 86%'],
};

export function cataloguePhoto(p: Product) {
  const index = closeUpIndex[p.id] ?? 0;
  const [scale, origin] = framing[p.id] ?? [1, '50% 50%'];
  return {
    src: p.images[index] ?? p.images[0],
    alternate: p.images[index === 0 ? 1 : 0],
    style: { '--cover-scale': scale, '--cover-origin': origin } as CSSProperties,
    closeUp: index > 0 || scale > 1,
    scale,
  };
}
