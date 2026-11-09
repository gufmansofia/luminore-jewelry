import catalogue from './luminore-catalogue.json';
import type { Product } from './products';
import { luminoreOwnerProducts } from './luminore-owner-products';

export const luminoreCatalogue = catalogue;
const categoryNames: Record<string, [string, string]> = {
  Rings: ['Кольца', 'Каблучки'], Earrings: ['Серьги', 'Сережки'],
  Pendants: ['Подвески', 'Підвіски'], Bracelets: ['Браслеты', 'Браслети'],
};

// Curated snapshot of the supplied latest catalogue. Only SELL COST is a price.
// Zero/unfilled prices, duplicate row 26 and owner-excluded stud rows 32, 33, 34, 36 are excluded.
export const luminoreSheetProducts: Product[] = catalogue.products.map(row => ({
  id: row.id, sku: `P${String(row.id).padStart(3, '0')}`,
  sourceCode: row.code, sourceName: row.sourceName, sourceBrand: 'Luminore',
  sourceUrl: `https://docs.google.com/spreadsheets/d/${catalogue.spreadsheetId}/edit#gid=${catalogue.sheetId}&range=C${row.row}:T${row.row}`,
  sourceSheetRow: row.row, listedCarat: row.listedCarat, listedWeight: row.listedWeight,
  name: row.nameRu, nameEn: row.nameEn, nameUk: row.nameUk,
  category: categoryNames[row.category]![0], categoryEn: row.category, categoryUk: categoryNames[row.category]![1],
  productType: row.category, metalType: row.metal, goldWeight: null, grossWeight: null,
  gemstoneType: row.stone, totalCarat: row.carat, mainStoneCarat: null,
  diamondColor: row.color, diamondClarity: row.clarity, diamondCut: row.cut,
  certificateType: row.certificateType, certificateNumber: row.certificateNumber,
  price: `$${row.price.toLocaleString('en-US')}`, priceUsd: row.price,
  caratBasis: row.caratBasis, perEarring: row.perEarring,
  description: `${row.nameRu}.`,
  descriptionEn: row.row === 65 ? 'A pear tennis bracelet with a yellow accent stone.' : `${row.nameEn}.`,
  descriptionUk: `${row.nameUk}.`,
  careInstructions: 'Clean gently with mild soap and lukewarm water. Store separately.',
  images: row.images, altText: row.nameEn, seoTags: `${row.category.toLowerCase()}, ${row.nameEn.toLowerCase()}`,
  allowNaturalOption: row.stone === 'Lab-Grown Diamond',
}));

// Owner-confirmed additions have their own provenance, without inventing Sheet rows.
export const luminoreProducts: Product[] = [...luminoreSheetProducts, ...luminoreOwnerProducts];
