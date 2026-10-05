import type { Language } from '../i18n/translations';
import { choose } from './product-copy';

export const ringShapes = [
  { value: 'round', en: 'Round', ru: 'Круглая', uk: 'Кругла' },
  { value: 'oval', en: 'Oval', ru: 'Овал', uk: 'Овал' },
  { value: 'pear', en: 'Pear', ru: 'Груша', uk: 'Груша' },
  { value: 'marquise', en: 'Marquise', ru: 'Маркиз', uk: 'Маркіз' },
  { value: 'heart', en: 'Heart', ru: 'Сердце', uk: 'Серце' },
  { value: 'emerald', en: 'Emerald', ru: 'Изумрудная', uk: 'Смарагдова' },
  { value: 'radiant', en: 'Radiant', ru: 'Радиант', uk: 'Радіант' },
  { value: 'cushion', en: 'Cushion', ru: 'Кушон', uk: 'Кушон' },
  { value: 'princess', en: 'Princess', ru: 'Принцесса', uk: 'Принцеса' },
  { value: 'asscher', en: 'Asscher', ru: 'Ашер', uk: 'Ашер' },
  { value: 'trilliant', en: 'Trilliant', ru: 'Триллиант', uk: 'Триліант' },
  { value: 'baguette', en: 'Baguette', ru: 'Багет', uk: 'Багет' },
  { value: 'shield', en: 'Shield', ru: 'Щит', uk: 'Щит' },
  { value: 'other', en: 'Another cut', ru: 'Другая огранка', uk: 'Інше огранювання' },
  { value: 'sketch', en: 'My own sketch', ru: 'Свой эскиз', uk: 'Власний ескіз' },
  { value: 'undecided', en: 'Help me choose', ru: 'Помогите выбрать', uk: 'Допоможіть обрати' },
] as const;

export type RingShape = typeof ringShapes[number]['value'];

export function ringShapeLabel(value: RingShape, language: Language) {
  const shape = ringShapes.find(shape => shape.value === value)!;
  return choose(language, shape.en, shape.ru, shape.uk);
}
