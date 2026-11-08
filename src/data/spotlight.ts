import catalogue from './luminore-catalogue.json';
// Retain the approved wide photographs for matching models; use the supplied
// current catalogue photograph for the one-carat studs.
export const spotlightPieces = [
  { productId: 24, image: '/Products/spotlight/fancy-yellow-pear-ring.jpg', caption: 'bottom', wideCaption: 'bottom', position: '50% 50%' },
  { productId: 14, image: '/Products/spotlight/diamond-cross-pendant.jpg', caption: 'top', wideCaption: 'top', position: '50% 50%' },
  { productId: 47, image: '/Products/spotlight/vivid-green-halo-earrings.jpg', caption: 'bottom', wideCaption: 'bottom', position: '50% 50%' },
  { productId: 1, image: catalogue.products.find(row => row.row === 31)!.images[0]!, caption: 'bottom', wideCaption: 'bottom', position: '50% 50%' },
  { productId: 37, image: '/Products/spotlight/pear-pendant.jpg', caption: 'top', wideCaption: 'top', position: '27% 50%' },
] as const;
