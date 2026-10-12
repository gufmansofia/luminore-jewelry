import {products, type Product} from '../data/products';
import type {Language} from '../i18n/translations';
import {choose, localizeSpec, productName} from './product-copy';
import {formatCarat} from './carat';

// Distinguish designs that share a name using specifications visible on the page.
export function productSearchTitle(product: Product, language: Language) {
  const name = productName(product, language);
  const duplicates = products.filter(item => productName(item, language) === name);
  if (duplicates.length < 2) return name;
  if (product.totalCarat !== null) {
    const weight = formatCarat(product.totalCarat);
    if (duplicates.filter(item => item.totalCarat !== null && formatCarat(item.totalCarat) === weight).length === 1) {
      return `${name} — ${weight} ${choose(language, 'ct', 'кар.', 'кар.')}`;
    }
  }
  return `${name} — ${product.sku}`;
}

export function productSearchDescription(product: Product, language: Language) {
  const pick = (en: string, ru: string, uk: string) => choose(language, en, ru, uk);
  const title = productSearchTitle(product, language);
  const details: string[] = [];
  if (product.totalCarat !== null && title === productName(product, language)) {
    const label = product.caratBasis === 'unconfirmed'
      ? pick('Listed weight', 'Указанный вес', 'Зазначена вага')
      : product.categoryEn === 'Earrings'
        ? pick('Total weight per pair', 'Общий вес пары', 'Загальна вага пари')
        : pick('Total stone weight', 'Общий вес камней', 'Загальна вага каменів');
    details.push(`${label}: ${formatCarat(product.totalCarat)} ${pick('ct', 'кар.', 'кар.')}`);
  }
  if (product.metalType && product.metalType !== 'Not Specified') details.push(localizeSpec(product.metalType, language));
  if (product.diamondCut && product.diamondCut !== 'Not Specified') details.push(localizeSpec(product.diamondCut, language));
  return `${title}. ${details.length ? details.join('; ') + '. ' : ''}${pick('Ask Luminore about availability and delivery.', 'Уточните наличие и доставку в Luminore.', 'Уточніть наявність і доставку в Luminore.')}`;
}
