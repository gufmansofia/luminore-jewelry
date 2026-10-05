import type { Language } from '../i18n/translations';
export const collections = [
  {slug:'rings',category:'Rings',name:['Diamond rings','Кольца с бриллиантами','Каблучки з діамантами'],description:['Explore solitaire, three-stone and eternity rings. Compare the listed stone weights, shapes and metal options, or discuss a natural-diamond version with us.','Кольца-солитеры, модели с тремя камнями и кольца-дорожки. Сравните вес, огранку и металл или обсудите с нами вариант с натуральными бриллиантами.','Каблучки-солітери, моделі з трьома каменями та каблучки-доріжки. Порівняйте вагу, огранювання й метал або обговоріть із нами варіант із природними діамантами.']},
  {slug:'earrings',category:'Earrings',name:['Diamond earrings','Серьги с бриллиантами','Сережки з діамантами'],description:['Studs, drops and hoops, with the details of each pair listed on its page. Check whether a stated weight refers to the pair or an individual earring before choosing.','Пусеты, подвесные серьги и серьги-кольца. Характеристики каждой пары указаны на её странице: обратите внимание, относится вес к паре или к одной серьге.','Пусети, підвісні сережки та сережки-кільця. Характеристики кожної пари зазначені на її сторінці: зверніть увагу, чи стосується вага пари або однієї сережки.']},
  {slug:'bracelets',category:'Bracelets',name:['Diamond bracelets','Браслеты с бриллиантами','Браслети з діамантами'],description:['Explore tennis bracelets and individual stone designs. We can discuss length, fit, stone choice and the details of your preferred piece.','Теннисные браслеты и модели с отдельными камнями. Обсудим длину, посадку, выбор камней и детали понравившегося украшения.','Тенісні браслети та моделі з окремими каменями. Обговоримо довжину, посадку, вибір каменів і деталі прикраси, яка вам сподобалась.']},
  {slug:'pendants',category:'Pendants',name:['Diamond pendants','Подвески с бриллиантами','Підвіски з діамантами'],description:['Choose a pendant by its shape, setting and listed stone weight. Chain inclusion and length are confirmed for the selected piece before an order.','Выбирайте подвеску по форме, оправе и указанному весу камней. Наличие цепочки и её длину уточняем для выбранного украшения перед заказом.','Обирайте підвіску за формою, оправою та зазначеною вагою каменів. Наявність ланцюжка та його довжину уточнюємо для обраної прикраси перед замовленням.']},
  {slug:'necklaces',category:'Necklaces',name:['Diamond necklaces','Колье с бриллиантами','Кольє з діамантами'],description:['Explore tennis necklaces and other stone-set designs. Compare the listed specifications, then discuss length, metal and natural or lab-grown stone options.','Теннисные колье и другие модели с камнями. Сравните указанные характеристики, затем обсудите длину, металл и варианты с натуральными или лабораторными камнями.','Тенісні кольє та інші моделі з каменями. Порівняйте зазначені характеристики, потім обговоріть довжину, метал і варіанти з природними або лабораторними каменями.']},
] as const;
export type Collection = typeof collections[number];
export const collectionText = (values: readonly string[], l: Language) => values[l === 'en' ? 0 : l === 'ru' ? 1 : 2];
export const collectionPath = (category: string) => {
  const item = collections.find(c => c.category === category);
  return item ? `/collections/${item.slug}` : '/collection';
};
export function collectionRoute(path: string) {
  const match = path.match(/^\/(collection|collections\/([a-z-]+))(?:\/page\/([1-9]\d*))?$/);
  if (!match) return null;
  const collection = match[2] ? collections.find(c => c.slug === match[2]) : undefined;
  if (match[2] && !collection) return null;
  return {collection, page: Number(match[3] || 1), path: collection ? `/collections/${collection.slug}` : '/collection'};
}
