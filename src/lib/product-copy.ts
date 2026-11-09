import type { Product } from '../data/products';
import type { Language } from '../i18n/translations';
import { formatCarat, formatCaratExpression, formatCaratText, formatStoneWeights } from './carat';
export const choose = (language: Language, en: string, ru: string, uk: string) => language === 'ru' ? ru : language === 'uk' ? uk : en;
const isLuminoreProduct = (p: Product) => p.sourceBrand === 'Luminore';
export const productCaratNumber = (_p: Product, value: number) => formatCarat(value);
const listedCaratText = (p: Product, l: Language) => `${formatCaratExpression(p.listedCarat?.replace(/\s*ct\b/gi, '').trim() ?? '')} ${choose(l,'ct','кар.','кар.')}`;
const shortEnglishNames: Record<number,string> = {
 51:'Marquise & heart diamond ring · 1.54 ct', 54:'Round & pear three-stone diamond ring · 1.49 ct',
 57:'Oval & heart diamond ring · 1.57 ct',58:'Emerald-cut & baguette diamond ring · 1.2 ct',
 59:'Cushion & shield diamond ring · 5.17 ct',112:'Rose Lumiere two-stone diamond necklace · 3.13 ct',
 47:'Vivid green halo earrings · 6 ct',48:'Vivid green halo ring · 4.5 ct',
};
export const productName = (p: Product, l: Language) => {
 const name=p.id===7?choose(l,p.nameEn,'Кольцо-солитер с овальным бриллиантом 2 ct','Каблучка-солітер з овальним діамантом 2 ct'):choose(l,isLuminoreProduct(p)?p.nameEn:shortEnglishNames[p.id]??p.nameEn,p.name,p.nameUk);
 // Keep weights in descriptions/specifications, not in customer-facing names.
 return name.replace(/\s*(?:[·,]\s*)?\d+(?:[.,]\d+)?\s*(?:ct\b|кар\.)(?:\s+(?:total|stones)\b)?/gi,'')
  .replace(/\s*The /g,' ').replaceAll('Three Stones','Three-stone').trim();
};
export function productTitle(p: Product, l: Language) {
 return productName(p,l);
}
export function catalogueName(p: Product, l: Language) {
 return productName(p,l).replace(/\b(?:Lab[ -](?:Grown )?Diamond|Lab[ -]Grown|Diamond)\s+/gi,'')
  .replace(/с лабораторными бриллиантами/gi,'').replace(/з лабораторними діамантами/gi,'').replace(/\s+/g,' ').trim();
}
export const hasLuminoreEarringTotal = (p: Product) => isLuminoreProduct(p) && p.categoryEn==='Earrings' && p.totalCarat!==null;
export const totalStoneWeightLabel = (l: Language) => choose(l,'Total stone weight','Общий вес камней','Загальна вага каменів');
export function stoneWeightValue(p: Product, l: Language) {
 if(p.totalCarat===null) return isLuminoreProduct(p)&&p.listedCarat?listedCaratText(p,l):'';
 return `${productCaratNumber(p,p.totalCarat)} ${choose(l,'ct','кар.','кар.')}`;
}
export function catalogueWeight(p: Product, l: Language) {
 const weight=stoneWeightValue(p,l);
 if(hasLuminoreEarringTotal(p))return `${totalStoneWeightLabel(l)}: ${weight}`;
 return p.categoryEn==='Earrings' && p.caratBasis!=='unconfirmed' && p.caratBasis!=='listed' ? `${weight} ${choose(l,'/ pair','/ пара','/ пара')}` : weight;
}
export const requestDetail = (l: Language) => choose(l, 'Available on request', 'Уточняется по запросу', 'Уточнюється за запитом');
const words: Record<string, [string, string]> = {
 'Lab-Grown Diamond':['Лабораторный бриллиант','Лабораторний діамант'],
 'Natural Diamond':['Натуральный бриллиант','Природний діамант'], 'Diamond':['Бриллиант','Діамант'],
 'White Gold':['Белое золото','Біле золото'], 'Rose Gold':['Розовое золото','Рожеве золото'],
 'Gold':['Золото','Золото'],
 'White + Yellow Gold':['Белое и жёлтое золото','Біле та жовте золото'], 'White + Rose Gold':['Белое и розовое золото','Біле та рожеве золото'],
 '18K White Gold':['Белое золото 18K','Біле золото 18K'], '18K Rose Gold':['Розовое золото 18K','Рожеве золото 18K'],
 '18K White Gold (750)':['Белое золото 18K (750)','Біле золото 18K (750)'],
 '18K White / Yellow / Rose':['Золото 18K: белое, жёлтое или розовое','Золото 18K: біле, жовте або рожеве'],
 '18K White / Yellow':['Золото 18K: белое или жёлтое','Золото 18K: біле або жовте'],
 '18K White / Rose':['Золото 18K: белое или розовое','Золото 18K: біле або рожеве'],
 'Only 18K White':['Только белое золото 18K','Лише біле золото 18K'],
 'Fancy Intense Orangy Pink':['Насыщенный оранжево-розовый','Насичений помаранчево-рожевий'],
 'Fancy Intense Pink':['Насыщенный розовый','Насичений рожевий'], 'Fancy Vivid Pink':['Яркий розовый','Яскравий рожевий'],
 'Fancy Vivid Yellow':['Яркий жёлтый','Яскравий жовтий'], 'Vivid Green':['Яркий зелёный','Яскравий зелений'],
 'Fancy Yellow':['Фантазийный жёлтый','Фантазійний жовтий'],
 'Fancy Green':['Фантазийный зелёный','Фантазійний зелений'], 'Fancy Pink':['Фантазийный розовый','Фантазійний рожевий'],
 'Pink':['Розовый','Рожевий'], 'Long Pear':['Удлинённая груша','Подовжена груша'], 'Step Pear':['Ступенчатая груша','Ступінчаста груша'],
 'Square Cushion':['Квадратный кушон','Квадратний кушон'], 'Tapered Baguette':['Сужающийся багет','Звужений багет'],
 'Fancy Radiant':['Фантазийный радиант','Фантазійний радіант'], 'Multi-Shape':['Разные огранки','Різні огранювання'],
 'Round':['Круглая','Кругла'], 'Emerald':['Изумрудная','Смарагдова'], 'Marquise':['Маркиз','Маркіз'],
 'Pear':['Груша','Груша'], 'Heart':['Сердце','Серце'], 'Oval':['Овал','Овал'], 'Cushion':['Кушон','Кушон'],
 'Baguette':['Багет','Багет'],
 'Shield':['Щит','Щит'], 'Radiant':['Радиант','Радіант'], 'Trilliant':['Триллиант','Триліант'], 'Excellent':['Отличная','Відмінна'],
 'Modified Kite Step':['Модифицированная ступенчатая Kite (Modified Kite Step)','Модифікована ступінчаста Kite (Modified Kite Step)'],
 'Very Good':['Очень хорошее','Дуже добра'],
 'Medium':['Средний','Середній'], 'Not Specified':['Уточняется по запросу','Уточнюється за запитом'],
};
export function localizeSpec(value: string, l: Language) {
 if (!value || value === 'Not Specified') return requestDetail(l);
 if (l === 'en') return value.replace('Only 18K White','18K white gold').replace('18K White / Yellow / Rose','18K white, yellow or rose gold').replace('18K White / Yellow','18K white or yellow gold').replace('18K White / Rose','18K white or rose gold');
 if (words[value]) return words[value][l === 'ru' ? 0 : 1];
 // Translate compound cuts as complete tokens, avoiding accidental partial replacements.
 return value.split(/( & |\(|\))/).map(part => words[part.trim()] ? words[part.trim()][l === 'ru' ? 0 : 1] : part).join('').replaceAll(' & ', ' / ').replace(/\s*\(/g, ' (');
}
export function productDescription(p: Product, l: Language, natural = false, includeSpecifications = true) {
 if (natural) return choose(l,
  'This design can be requested with natural diamonds. We will confirm the stones, metal, dimensions and final price individually before you order.',
  'Этот дизайн можно заказать с натуральными бриллиантами. Камни, металл, размеры и итоговую стоимость согласуем индивидуально перед заказом.',
  'Цей дизайн можна замовити з природними діамантами. Камені, метал, розміри та остаточну вартість узгодимо індивідуально перед замовленням.');
 const n=p.nameEn.toLowerCase();
 let design: [string,string,string] = [productName(p,'en')+'.', productName(p,'ru')+'.',productName(p,'uk')+'.'];
 if(isLuminoreProduct(p)) {
  design=[p.descriptionEn,p.description,p.descriptionUk];
 } else if(p.categoryEn==='Rings') {
  if(/three.stone|three stone|three stones/.test(n)) design=['A three-stone ring with a central stone framed by a pair of side stones.','Кольцо с тремя камнями: центральный камень обрамлён парой боковых.','Каблучка з трьома каменями: центральний камінь обрамлений парою бічних.'];
  else if(/eternity/.test(n)) design=['An eternity ring with a line of stones along the setting.','Кольцо-дорожка с рядом камней вдоль оправы.','Каблучка-доріжка з рядом каменів уздовж оправи.'];
  else if(/open/.test(n)) design=['An open ring design with space between the ends of the setting.','Открытое кольцо с промежутком между концами оправы.','Відкрита каблучка з проміжком між кінцями оправи.'];
  else if(/solitaire/.test(n)) design=['A solitaire ring that brings the central stone into focus.','Кольцо-солитер подчёркивает центральный камень.','Каблучка-солітер підкреслює центральний камінь.'];
 } else if(p.categoryEn==='Earrings') {
  if(/eternity|hoop/.test(n)) design=['Hoop earrings with stones set along the hoops.','Серьги-кольца с бриллиантами вдоль оправы.','Сережки-кільця з діамантами вздовж оправи.'];
  else if(/drop|droplet/.test(n)) design=['Drop earrings with an elongated silhouette.','Серьги-подвески с вытянутым силуэтом.','Сережки-підвіски з видовженим силуетом.'];
  else if(/transform/.test(n)) design=['Convertible stud earrings.','Серьги-пусеты с трансформируемым дизайном.','Сережки-пусети з трансформованим дизайном.'];
  else if(/stud/.test(n)) design=['Stud earrings with a compact silhouette.','Серьги-пусеты с лаконичным силуэтом.','Сережки-пусети з лаконічним силуетом.'];
 } else if(p.categoryEn==='Bracelets' && /tennis/.test(n)) {
  design=['A tennis bracelet with a line of stones.','Теннисный браслет с последовательным рядом камней.','Тенісний браслет із послідовним рядом каменів.'];
 } else if(p.categoryEn==='Necklaces' && /tennis/.test(n)) {
  design=['A tennis necklace with stones arranged along the neckline.','Теннисное колье с бриллиантами вдоль линии шеи.','Тенісне кольє з діамантами вздовж лінії шиї.'];
 } else if(p.categoryEn==='Pendants' && /cross/.test(n)) {
  design=['A cross-shaped pendant with a stone-set silhouette.','Подвеска в форме креста с камнями.','Підвіска у формі хреста з каменями.'];
 } else if(p.categoryEn==='Pendants' && /solitaire/.test(n)) {
  design=['A solitaire pendant that brings the central stone into focus.','Подвеска-солитер подчёркивает центральный камень.','Підвіска-солітер підкреслює центральний камінь.'];
 }
 const sentences=[formatCaratText(choose(l,...design as [string,string,string]))];
 if (!includeSpecifications) return sentences[0];
 const listed=p.caratBasis==='unconfirmed'||p.caratBasis==='listed';
 if(p.totalCarat!==null) sentences.push((hasLuminoreEarringTotal(p)?totalStoneWeightLabel(l)+': ':choose(l,listed?'Listed stone weight: ':p.categoryEn==='Earrings'?'Total stone weight for the pair: ':'Total stone weight: ',listed?'Указанный вес камней: ':p.categoryEn==='Earrings'?'Общий вес камней в паре: ':'Общий вес камней: ',listed?'Зазначена вага каменів: ':p.categoryEn==='Earrings'?'Загальна вага каменів у парі: ':'Загальна вага каменів: '))+productCaratNumber(p,p.totalCarat)+choose(l,' ct.',' кар.',' кар.'));
 else if(isLuminoreProduct(p)&&p.listedCarat)sentences.push(choose(l,'Listed stone weights: ','Указанные веса камней: ','Зазначені ваги каменів: ')+listedCaratText(p,l)+'.');
 if(p.diamondCut) sentences.push(choose(l,'Cut: ','Огранка: ','Огранювання: ')+localizeSpec(p.diamondCut,l)+'.');
 if(p.metalType) sentences.push(choose(l,'Metal: ','Металл: ','Метал: ')+localizeSpec(p.metalType,l)+'.');
 if(p.gemstoneType) sentences.push(choose(l,'Stones: ','Камни: ','Камені: ')+localizeSpec(p.gemstoneType,l)+'.');
 return sentences.join(' ');
}
export function productSpecs(p: Product,l: Language,natural=false) {
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 const ct=pick('ct','кар.','кар.');
 if(natural) return [{label:pick('Stones','Камни','Камені'),value:pick('Natural diamonds','Натуральные бриллианты','Природні діаманти')},{label:pick('Specifications','Характеристики','Характеристики'),value:requestDetail(l)}];
 const result=[
 {label:pick('Metal','Металл','Метал'),value:localizeSpec(p.metalType,l)},
 {label:pick('Stone type','Тип камня','Тип каменю'),value:localizeSpec(p.gemstoneType,l)},
 {label:hasLuminoreEarringTotal(p)?totalStoneWeightLabel(l):p.caratBasis==='unconfirmed'||p.caratBasis==='listed'?pick('Listed carat weight','Указанный вес камней','Зазначена вага каменів'):p.categoryEn==='Earrings'?pick('Total stone weight · pair','Общий вес камней · пара','Загальна вага каменів · пара'):pick('Total stone weight','Общий вес камней','Загальна вага каменів'),value:p.totalCarat===null?(isLuminoreProduct(p)&&p.listedCarat?listedCaratText(p,l):requestDetail(l)):`${productCaratNumber(p,p.totalCarat)} ${ct}`},
 ];
 if(p.perEarring&&!hasLuminoreEarringTotal(p))result.push({label:p.perEarring.includes('+')?pick('Individual stone weights','Вес отдельных камней','Вага окремих каменів'):pick('Stone weight · one earring','Вес камней · одна серьга','Вага каменів · одна сережка'),value:`${isLuminoreProduct(p)?p.perEarring.split('+').map(w=>productCaratNumber(p,Number(w.trim()))).join(' + '):formatStoneWeights(p.perEarring)} ${ct}`});
 if(p.caratBasis==='unconfirmed')result.push({label:pick('Weight basis','Вес за штуку или пару','Вага за одиницю чи пару'),value:requestDetail(l)});
 if((isLuminoreProduct(p)||!p.sourceCode)&&p.mainStoneCarat)result.push({label:pick('Main stone','Основной камень','Основний камінь'),value:`${productCaratNumber(p,p.mainStoneCarat)} ${ct}`});
 if(p.paveCarat!==undefined)result.push({label:pick('Pavé stone weight','Вес камней паве','Вага каменів паве'),value:`${productCaratNumber(p,p.paveCarat)} ${ct}`});
 if(p.diamondCut)result.push({label:pick('Cut','Огранка','Огранювання'),value:localizeSpec(p.diamondCut,l)});
 if(p.diamondColor)result.push({label:pick('Colour','Цвет','Колір'),value:localizeSpec(p.diamondColor,l)});
 if(p.diamondClarity)result.push({label:pick('Clarity','Чистота','Чистота'),value:p.diamondClarity});
 if(p.stoneCount!==undefined)result.push({label:pick('Number of stones','Количество камней','Кількість каменів'),value:String(p.stoneCount)});
 if(p.finish)result.push({label:pick('Finish','Качество обработки','Якість обробки'),value:localizeSpec(p.finish,l)});
 const weight=p.grossWeight??(isLuminoreProduct(p)||!p.sourceCode?p.goldWeight:null);
 if(weight)result.push({label:p.grossWeight?pick('Total jewellery weight','Общий вес изделия','Загальна вага виробу'):pick('Gold weight','Вес золота','Вага золота'),value:weight+pick(' g',' г',' г')});
 if(isLuminoreProduct(p)&&p.listedWeight)result.push({label:pick('Weight','Вес','Вага'),value:p.listedWeight+pick(' g',' г',' г')});
 result.push({label:p.categoryEn==='Rings'?pick('Ring size','Размер кольца','Розмір каблучки'):pick('Dimensions / length','Размеры / длина','Розміри / довжина'),value:p.size?localizeSpec(p.size,l)+(p.sizeKind==='length'?pick(' cm',' см',' см'):''):requestDetail(l)});
 if(p.categoryEn==='Pendants')result.push({label:pick('Chain included','Цепочка в комплекте','Ланцюжок у комплекті'),value:p.chainIncluded===undefined?requestDetail(l):p.chainIncluded?pick('Yes','Да','Так'):pick('No','Нет','Ні')});
 const cert=p.certificateType?.match(/\b(?:GIA|IGI)\b/g);
 result.push({label:pick('Certification','Сертификация','Сертифікація'),value:cert?.length?[...new Set(cert)].join(' & ')+pick(' certified',' — сертифицировано',' — сертифіковано'):requestDetail(l)});
 if(isLuminoreProduct(p)&&p.certificateNumber)result.push({label:pick('Report number','Номер отчёта','Номер звіту'),value:formatCaratText(p.certificateNumber.replace(/\n/g,'; '))});
 if(p.certificateDate)result.push({label:pick('Report date','Дата отчёта','Дата звіту'),value:new Intl.DateTimeFormat(pick('en-GB','ru-RU','uk-UA'),{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(p.certificateDate))});
 return result;
}

export function productSpecGroups(p: Product, l: Language, natural = false) {
 const specs=productSpecs(p,l,natural);
 const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
 if(natural)return [{title:pick('Natural diamonds','Натуральные бриллианты','Природні діаманти'),specs}];
 const sizeLabel=p.categoryEn==='Rings'?pick('Ring size','Размер кольца','Розмір каблучки'):pick('Dimensions / length','Размеры / длина','Розміри / довжина');
 const sizeLabels=[sizeLabel,pick('Chain included','Цепочка в комплекте','Ланцюжок у комплекті')];
 const metalLabels=[pick('Metal','Металл','Метал'),pick('Weight','Вес','Вага'),pick('Total jewellery weight','Общий вес изделия','Загальна вага виробу'),pick('Gold weight','Вес золота','Вага золота')];
 const certification=pick('Certification','Сертификация','Сертифікація');
 const certificationLabels=[certification,pick('Report number','Номер отчёта','Номер звіту'),pick('Report date','Дата отчёта','Дата звіту')];
 return [
  {title:pick('Stones','Камни','Камені'),specs:specs.filter(s=>!sizeLabels.includes(s.label)&&!metalLabels.includes(s.label)&&!certificationLabels.includes(s.label))},
  {title:pick('Metal & dimensions','Металл и размеры','Метал і розміри'),specs:specs.filter(s=>metalLabels.includes(s.label)||sizeLabels.includes(s.label))},
  {title:certification,specs:specs.filter(s=>certificationLabels.includes(s.label))},
 ].filter(group=>group.specs.length);
}
