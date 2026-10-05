import type { Language } from '../i18n/translations';
import type { Enquiry } from './enquiry';
import { choose } from './product-copy';

export function validateEnquiry(values: Enquiry, consent: boolean, language: Language, bespoke: boolean, guided = false) {
  const errors: Partial<Record<'name'|'email'|'piece'|'details'|'consent',string>> = {};
  const pick = (en:string,ru:string,uk:string) => choose(language,en,ru,uk);
  if (!values.name.trim()) errors.name = pick('Enter your name.','Введите имя.','Введіть ім’я.');
  if (values.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = pick('Enter a valid email address.','Проверьте адрес email.','Перевірте адресу email.');
  if (bespoke && !guided && !values.piece) errors.piece = pick('Choose a type of piece.','Выберите тип украшения.','Оберіть тип прикраси.');
  if (!bespoke && !values.details.trim()) errors.details = pick('Tell us how we can help.','Напишите, чем мы можем помочь.','Напишіть, чим ми можемо допомогти.');
  if (!consent) errors.consent = pick('Please agree so we can respond to your enquiry.','Подтвердите согласие, чтобы мы могли ответить на заявку.','Підтвердьте згоду, щоб ми могли відповісти на заявку.');
  return errors;
}
