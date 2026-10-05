import type { Product } from '../data/products';
import { localizeSpec, productName } from './product-copy';
import { formatCarat } from './carat';

export const PAGE_SIZE = 12;
// Opening selection approved from the collection preview on 3 October 2026.
const featuredProductIds = [85, 103, 55, 112, 79, 99, 6, 108, 89, 71, 13, 86];
const featuredRanks = new Map(featuredProductIds.map((id, index) => [id, index]));
const aliases: Record<string, string[]> = {
  Rings: ['ring', 'rings', 'кольцо', 'кольца', 'каблучка', 'каблучки'],
  Earrings: ['earring', 'earrings', 'серьги', 'серьга', 'сережки', 'сережка', 'серёжки'],
  Pendants: ['pendant', 'pendants', 'подвеска', 'подвески', 'підвіска', 'підвіски', 'кулон', 'кулоны', 'кулони'],
  Bracelets: ['bracelet', 'bracelets', 'браслет', 'браслеты', 'браслети'],
  Necklaces: ['necklace', 'necklaces', 'колье', 'кольє', 'намисто'],
};
export const normalizeSearch = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ё/g, 'е').trim();
export function catalogueCategory(value = 'all') {
  return Object.keys(aliases).find(key => key === value || aliases[key].some(alias => normalizeSearch(alias) === normalizeSearch(value))) ?? 'all';
}
const tokens = (value: string) => normalizeSearch(value).replace(/([\p{L}])(\d)|(\d)([\p{L}])/gu, '$1$3 $2$4').split(/[^\p{L}\p{N}.]+/u).filter(Boolean);
export function matchesProduct(p: Product, search: string) {
  const query = normalizeSearch(search);
  if (!query) return true;
  const category = catalogueCategory(query);
  if (category !== 'all') return p.categoryEn === category;
  const words = tokens([p.name, p.nameEn, p.nameUk, p.sourceName, p.sourceCode, p.sku, ...aliases[p.categoryEn] ?? [],
    p.totalCarat===null?'':`${formatCarat(p.totalCarat)} ct кар. карат карата каратів`,
    ...(['en', 'ru', 'uk'] as const).flatMap(l => [productName(p,l),localizeSpec(p.metalType, l), localizeSpec(p.diamondCut, l)])].join(' '));
  return tokens(query).every(part => words.some(word => /^\d/.test(part) ? word === part : word.startsWith(part)));
}
export function withinBudget(price: number | null, budget: string) {
  if (budget === 'under-2000') return price !== null && price < 2000;
  if (budget === '2000-5000') return price !== null && price >= 2000 && price < 5000;
  if (budget === '5000-15000') return price !== null && price >= 5000 && price < 15000;
  if (budget === '15000-plus') return price !== null && price >= 15000;
  return true;
}
export function filterCatalogue(items: Product[], search: string, category: string, sort: string, budget = 'all') {
  return items.filter(p => withinBudget(p.priceUsd, budget) && (category === 'all' || p.categoryEn === catalogueCategory(category)) && matchesProduct(p, search)).sort((a, b) => {
    if (sort === 'low-to-high') return (a.priceUsd ?? Infinity) - (b.priceUsd ?? Infinity);
    if (sort === 'high-to-low') return (b.priceUsd ?? -Infinity) - (a.priceUsd ?? -Infinity);
    return (featuredRanks.get(a.id) ?? featuredProductIds.length) - (featuredRanks.get(b.id) ?? featuredProductIds.length) || Number(b.images.length>0)-Number(a.images.length>0) || a.id - b.id;
  });
}
