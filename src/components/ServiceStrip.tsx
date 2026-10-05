import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import '../styles/service-strip.css';

const copy = {
  en: { label: 'Luminore services', delivery: ['Worldwide', 'delivery'], experience: ['10+ years', 'experience'], care: ['Care &', 'repair'], certification: 'Reports for your chosen stone' },
  ru: { label: 'Сервис Luminore', delivery: ['Доставка', 'по миру'], experience: ['10+ лет', 'опыта'], care: ['Уход', 'и ремонт'], certification: 'Сертификат выбранного камня' },
  uk: { label: 'Сервіс Luminore', delivery: ['Доставка', 'у світі'], experience: ['10+ років', 'досвіду'], care: ['Догляд', 'і ремонт'], certification: 'Сертифікат обраного каменю' },
};

// Lucide 1.17.0: the same four icons used in the approved Reference minimal
// preview, with a fine 1px stroke. Licence: public/icons/lucide-LICENSE.txt.
function ServiceIcon({ name }: { name: 'truck' | 'history' | 'tag' | 'heart' }) {
  return <svg className="service-strip-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'truck' && <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>}
    {name === 'history' && <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></>}
    {name === 'tag' && <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></>}
    {name === 'heart' && <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />}
  </svg>;
}

function ServiceLabel({ parts }: { parts: string[] }) {
  return <span className="service-strip-label"><span>{parts[0]}</span>{' '}<span>{parts[1]}</span></span>;
}

export function ServiceStrip() {
  const { language } = useLanguage();
  const t = copy[language];
  return <section className="service-strip" aria-label={t.label} data-theme="light">
    <ul className="service-strip-items">
      <li><Link className="service-strip-item" to="/information/delivery"><ServiceIcon name="truck" /><ServiceLabel parts={t.delivery} /></Link></li>
      <li><div className="service-strip-item"><ServiceIcon name="history" /><ServiceLabel parts={t.experience} /></div></li>
      <li><div className="service-strip-item"><ServiceIcon name="tag" /><span className="service-strip-label">GIA / IGI<span className="sr-only"> — {t.certification}</span></span></div></li>
      <li><Link className="service-strip-item" to="/information/care"><ServiceIcon name="heart" /><ServiceLabel parts={t.care} /></Link></li>
    </ul>
  </section>;
}
