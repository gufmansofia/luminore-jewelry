// An additional collection filter; the pieces keep their original product categories.
export const kidsCollectionProductIds = [130, 131] as const;
const ids = new Set<number>(kidsCollectionProductIds);
export const isKidsCollectionProduct = (product: { id: number }) => ids.has(product.id);
export const kidsCollectionNames = { en: 'Kids Collection', ru: 'Детская коллекция', uk: 'Дитяча колекція' };
export const kidsCollectionPath = '/collection?category=Kids';
