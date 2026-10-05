import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { EnquiryForm } from './EnquiryForm';
export function Contact() {
  const { t, language:l } = useLanguage();
  const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);
  return <section id="contact" data-theme="light" className="editorial-section contact-section" aria-labelledby="contact-title"><div className="editorial-container contact-layout">
    <div><header className="section-heading"><p className="section-eyebrow">{t.contact.eyebrow}</p><h2 id="contact-title">{t.contact.headline1} {t.contact.headline2}</h2><p>{t.contact.description}</p></header>
    <div className="contact-direct"><h3>{pick('Speak with us directly','Свяжитесь с нами напрямую','Зв’яжіться з нами напряму')}</h3><a className="contact-phone" href="tel:+421940600708">+421 940 600 708</a><a href="mailto:jewelry@luminore.eu">jewelry@luminore.eu</a><div className="contact-channels"><a href="https://wa.me/421940600708" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://t.me/luminore_jewelry" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://www.instagram.com/luminore_jewelry/" target="_blank" rel="noopener noreferrer">Instagram</a></div></div></div>
    <EnquiryForm />
  </div></section>;
}
