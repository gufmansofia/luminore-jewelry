import type { Language } from '../i18n/translations';
import { choose } from './product-copy';
import { ringShapeLabel, type RingShape } from './ring-shapes';
export type Enquiry = { name: string; email?: string; phone?: string; piece?: string; budget?: string; details: string; ringShape?: RingShape; stone?: 'natural' | 'lab' | 'undecided'; direction?: 'collection' | 'bespoke' | 'undecided' };
export function enquiryMessage(values: Enquiry, language: Language, bespoke: boolean) {
  const pick = (en: string, ru: string, uk: string) => choose(language, en, ru, uk);
  return [pick('Hello, Luminore!', 'Здравствуйте, Luminore!', 'Добрий день, Luminore!'),
    bespoke && (!values.direction || values.direction === 'bespoke') ? pick('I would like to discuss a bespoke piece.', 'Хочу обсудить украшение на заказ.', 'Хочу обговорити прикрасу на замовлення.') : pick('I would like a consultation.', 'Хочу получить консультацию.', 'Хочу отримати консультацію.'),
    `${pick('Name', 'Имя', 'Ім’я')}: ${values.name.trim()}`,
    values.email?.trim() && `Email: ${values.email.trim()}`,
    values.phone?.trim() && `${pick('Phone', 'Телефон', 'Телефон')}: ${values.phone.trim()}`,
    values.piece && `${pick('Piece', 'Украшение', 'Прикраса')}: ${values.piece}`,
    values.ringShape && `${pick('Cut / sketch', 'Огранка / эскиз', 'Огранювання / ескіз')}: ${ringShapeLabel(values.ringShape, language)}`,
    values.stone && `${pick('Diamonds', 'Бриллианты', 'Діаманти')}: ${values.stone === 'natural' ? pick('Natural', 'Натуральные', 'Природні') : values.stone === 'lab' ? pick('Lab-grown', 'Лабораторные', 'Лабораторні') : pick('Help me choose', 'Помогите выбрать', 'Допоможіть обрати')}`,
    values.direction && `${pick('Preference', 'Пожелание', 'Побажання')}: ${values.direction === 'collection' ? pick('From the collection', 'Из коллекции', 'З колекції') : values.direction === 'bespoke' ? pick('A custom piece', 'На заказ', 'На замовлення') : pick('Help me choose', 'Помогите выбрать', 'Допоможіть обрати')}`,
    values.budget && `${pick('Budget', 'Бюджет', 'Бюджет')}: ${values.budget}`,
    values.details.trim() && `${pick('Message', 'Сообщение', 'Повідомлення')}: ${values.details.trim()}`,
  ].filter(Boolean).join('\n');
}
export const whatsappEnquiryUrl = (message: string) => `https://wa.me/421940600708?text=${encodeURIComponent(message)}`;
export const telegramEnquiryUrl = (message: string) => `https://t.me/luminore_jewelry?text=${encodeURIComponent(message)}`;
