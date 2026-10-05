import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { enquiryMessage, telegramEnquiryUrl, whatsappEnquiryUrl, type Enquiry } from '../lib/enquiry';
import { enquiryBudgetOptions, validEnquiryBudget } from '../lib/enquiry-budget';
import { validateEnquiry } from '../lib/enquiry-validation';

export function EnquiryForm({ bespoke = false, initialValues, guided = false, onBack }: { bespoke?: boolean; initialValues?: Partial<Enquiry>; guided?: boolean; onBack?: () => void }) {
  const { language: l, t } = useLanguage();
  const id = useId();
  const pick = (en: string, ru: string, uk: string) => choose(l, en, ru, uk);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Enquiry>({ name: '', email: '', phone: '', piece: '', details: '', ...initialValues, budget: validEnquiryBudget(initialValues?.budget, initialValues?.stone) });
  const [consent, setConsent] = useState(false);
  const errors = submitted ? validateEnquiry(values,consent,l,bespoke,guided) : {};
  const fieldState = (key:keyof ReturnType<typeof validateEnquiry>) => ({'aria-invalid':!!errors[key], 'aria-describedby':errors[key] ? `${id}-${key}-error` : undefined});
  const fieldError = (key:keyof ReturnType<typeof validateEnquiry>) => errors[key] && <span id={`${id}-${key}-error`} className="form-error" role="alert">{errors[key]}</span>;
  const [copyStatus,setCopyStatus]=useState('');
  const copyText=useRef<HTMLTextAreaElement>(null);
  const [ready, setReady] = useState(false);
  const review = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const details = useRef<HTMLTextAreaElement>(null);
  const pieceOptions = [['Rings',t.products.rings],['Earrings',t.products.earrings],['Pendants',t.products.pendants],['Bracelets',t.products.bracelets],['Necklaces',t.products.necklaces],['Other',pick('Other','Другое','Інше')]];
  const budgetOptions = enquiryBudgetOptions(values.stone, l);
  const update = (key: keyof Enquiry, value: string) => setValues(old => ({ ...old, [key]: value }));
  useEffect(() => { if (initialValues) { setValues(old => {
    const next = { ...old, ...initialValues };
    return { ...next, budget: validEnquiryBudget(next.budget, next.stone) };
  }); setReady(false); } }, [initialValues]);
  useEffect(() => { if (ready) { review.current?.focus({preventScroll:true}); review.current?.scrollIntoView({block:'start',behavior:'instant'}); } }, [ready]);
  const message = enquiryMessage({...values,piece:pieceOptions.find(([key])=>key===values.piece)?.[1],budget:budgetOptions.find(([key])=>key===values.budget)?.[1]}, l, bespoke);
  if (ready) return <div className="enquiry-review" ref={review} tabIndex={-1} aria-labelledby={`${id}-ready`}>
    <p className="section-eyebrow">{pick('Your enquiry', 'Ваша заявка', 'Ваша заявка')}</p>
    <h3 id={`${id}-ready`}>{pick('Your message is ready', 'Сообщение подготовлено', 'Повідомлення підготовлено')}</h3>
    <p>{pick('Review your message and choose Telegram or WhatsApp. Your enquiry has not been sent yet.', 'Проверьте сообщение и выберите Telegram или WhatsApp. Пока заявка не отправлена.', 'Перевірте повідомлення та оберіть Telegram або WhatsApp. Заявку ще не надіслано.')}</p>
    <textarea ref={copyText} className="enquiry-message" readOnly value={message} rows={8} aria-label={pick("Your message","Ваше сообщение","Ваше повідомлення")}/>
    <button type="button" className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(message);setCopyStatus(pick("Message copied","Сообщение скопировано","Повідомлення скопійовано"));}catch{copyText.current?.focus();copyText.current?.select();setCopyStatus(pick("Select and copy the message above.","Скопируйте выделенное сообщение выше.","Скопіюйте виділене повідомлення вище."));}}}>{pick("Copy message","Скопировать сообщение","Скопіювати повідомлення")}</button><p role="status">{copyStatus}</p>
    <div className="enquiry-channels"><a className="primary-button" href={telegramEnquiryUrl(message)} target="_blank" rel="noopener noreferrer">Telegram ↗</a><a className="outline-button" href={whatsappEnquiryUrl(message)} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div>
    <button className="text-button" onClick={() => { setReady(false); requestAnimationFrame(() => name.current?.focus()); }}>{pick('Edit message', 'Изменить сообщение', 'Змінити повідомлення')}</button>
  </div>;
  const optional = pick('optional', 'необязательно', 'необов’язково');
  return <form className="enquiry-form" noValidate aria-label={bespoke ? pick('Bespoke enquiry', 'Заявка на индивидуальный заказ', 'Заявка на індивідуальне замовлення') : pick('Contact enquiry', 'Запрос консультации', 'Запит консультації')} onSubmit={e => {
    e.preventDefault(); setSubmitted(true);
    const first = Object.keys(validateEnquiry(values,consent,l,bespoke,guided))[0];
    if (first) { const field=e.currentTarget.elements.namedItem(first) as HTMLElement|null; requestAnimationFrame(()=>field?.focus()); return; }
    setReady(true);
  }}>
    {onBack && <button type="button" className="text-button guided-back" onClick={onBack}><span aria-hidden="true">←</span> {pick('Edit selection', 'Изменить выбор', 'Змінити вибір')}</button>}
    <div className="form-heading"><h3>{guided ? pick('Your enquiry', 'Ваша заявка', 'Ваша заявка') : bespoke ? pick('Tell us your idea', 'Расскажите о своей идее', 'Розкажіть про свою ідею') : pick('How can we help?', 'Чем мы можем помочь?', 'Чим ми можемо допомогти?')}</h3><p>{pick('Fields marked * are required. Choose your messenger after reviewing the message.', 'Поля со * обязательны. Мессенджер можно выбрать после проверки сообщения.', 'Поля із * обов’язкові. Месенджер можна обрати після перевірки повідомлення.')}</p></div>
    <div className="form-fields">
      <label className="form-field">{pick('Your name', 'Ваше имя', 'Ваше ім’я')} *<input ref={name} {...fieldState('name')} name="name" autoComplete="name" maxLength={100} required value={values.name} onChange={e => { e.target.setCustomValidity(''); update('name', e.target.value); }} />{fieldError('name')}</label>
      <label className="form-field">{pick('Phone', 'Телефон', 'Телефон')} <span>({optional})</span><input name="phone" type="tel" autoComplete="tel" maxLength={50} value={values.phone} onChange={e => update('phone', e.target.value)} /></label>
      {!bespoke && <label className="form-field form-field--full">Email <span>({optional})</span><input {...fieldState('email')} name="email" type="email" autoComplete="email" maxLength={150} value={values.email} onChange={e => update('email', e.target.value)} />{fieldError('email')}</label>}
      {bespoke && <>{!guided && <label className="form-field">{pick('Type of piece', 'Тип украшения', 'Тип прикраси')} *<select {...fieldState('piece')} name="piece" required value={values.piece} onChange={e => update('piece', e.target.value)}><option value="">{pick('Select a type', 'Выберите тип', 'Оберіть тип')}</option>{pieceOptions.map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select>{fieldError('piece')}</label>}
      <label className="form-field">{pick('Budget', 'Бюджет', 'Бюджет')} <span>({optional})</span><select name="budget" value={values.budget} onChange={e => update('budget', e.target.value)}><option value="">{pick('Select a range', 'Выберите диапазон', 'Оберіть діапазон')}</option>{budgetOptions.map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label></>}
      <label className="form-field form-field--full">{pick('Your message', 'Ваше сообщение', 'Ваше повідомлення')} {bespoke ? <span>({optional})</span> : '*'}<textarea ref={details} {...fieldState('details')} name="details" required={!bespoke} rows={4} maxLength={1500} value={values.details} onChange={e => { e.target.setCustomValidity(''); update('details', e.target.value); }} placeholder={bespoke ? pick('The design, stones or occasion you have in mind…', 'Дизайн, камни или повод, для которого выбираете украшение…', 'Дизайн, камені або нагода, для якої обираєте прикрасу…') : pick('Tell us which piece you are interested in…', 'Расскажите, какое украшение вас интересует…', 'Розкажіть, яка прикраса вас цікавить…')} />{fieldError('details')}</label>
    </div>
    <label className="form-consent"><input {...fieldState('consent')} name="consent" type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>{pick('I agree to the processing of my details to respond to this enquiry.', 'Согласен(-на) на обработку моих данных для ответа на заявку.', 'Погоджуюся на обробку моїх даних для відповіді на заявку.')} *</span></label>{fieldError('consent')}
    <button className="text-button form-privacy" type="button" onClick={() => window.dispatchEvent(new CustomEvent('luminore:open-info', { detail: 'privacy' }))}>{t.footer.privacy}</button>
    <button className="primary-button" type="submit">{pick('Prepare message', 'Подготовить сообщение', 'Підготувати повідомлення')}</button>
    <p className="form-note">{pick('You can check your message before sending it.', 'Перед отправкой вы сможете проверить сообщение.', 'Перед надсиланням ви зможете перевірити повідомлення.')}</p>
  </form>;
}
