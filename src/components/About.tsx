import { useId, useState } from 'react';
import { useLanguage } from '../i18n';
import { useReveal } from '../hooks/useMotion';
import { choose } from '../lib/product-copy';
import { ServiceStrip } from './ServiceStrip';
import { ContactChannel } from './ContactChannel';
import '../styles/about.css';

const copy = {
  ru: {
    title: 'Наш подход',
    intro: 'Расскажите, что для вас важно. Мы поможем разобраться в камнях, выбрать металл и согласовать детали.',
    availability: 'Все модели можно заказать с натуральными или лабораторными бриллиантами.',
    natural: 'Натуральные бриллианты', naturalDescription: 'Подберём камень с учётом ваших пожеланий и бюджета.',
    lab: 'Лабораторные бриллианты', labDescription: 'Поможем сравнить характеристики и выбрать подходящий вариант.',
    discuss: 'Обсудить украшение',
  },
  en: {
    title: 'Our approach',
    intro: 'Tell us what matters to you. We’ll help you understand the stones, choose a metal and agree on the details.',
    availability: 'Every design can be ordered with natural or lab-grown diamonds.',
    natural: 'Natural diamonds', naturalDescription: 'We’ll help you choose a stone that suits your preferences and budget.',
    lab: 'Lab-grown diamonds', labDescription: 'We’ll help you compare the specifications and find the right option.',
    discuss: 'Discuss a piece',
  },
  uk: {
    title: 'Наш підхід',
    intro: 'Розкажіть, що для вас важливо. Ми допоможемо розібратися в каменях, обрати метал і узгодити деталі.',
    availability: 'Усі моделі можна замовити з природними або лабораторними діамантами.',
    natural: 'Природні діаманти', naturalDescription: 'Підберемо камінь з урахуванням ваших побажань і бюджету.',
    lab: 'Лабораторні діаманти', labDescription: 'Допоможемо порівняти характеристики й обрати відповідний варіант.',
    discuss: 'Обговорити прикрасу',
  },
};

function StoneDetail({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <article className="approach-stone">
    <h3><button type="button" className="approach-stone-toggle" id={`${id}-toggle`} aria-expanded={open} aria-controls={`${id}-answer`} onClick={() => setOpen(value => !value)}>
      <span className="approach-stone-name">{title}</span>
      <svg className="approach-toggle-chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m5 9 7 7 7-7" /></svg>
    </button></h3>
    <div className="approach-answer" id={`${id}-answer`} role="region" aria-labelledby={`${id}-toggle`} aria-hidden={!open} inert={!open} data-open={open}>
      <div><p>{description}</p></div>
    </div>
  </article>;
}

export function About() {
  const { language } = useLanguage();
  const t = copy[language];
  const intro = useReveal<HTMLElement>();
  // Observe the wrapper: a fully clipped panel cannot observe its own entrance.
  const stones = useReveal<HTMLDivElement>();
  const end = useReveal<HTMLDivElement>();


  return <section id="about" data-theme="light" className="editorial-section about-section about-chapter" aria-labelledby="about-title">
    <header className="approach-intro approach-shell" ref={intro.ref} data-reveal={intro.phase}>
      <h2 className="approach-title" id="about-title">{t.title.split(' ').map((word, index) => <span key={index}><span className="approach-title-mask"><span className="approach-title-word" style={{ transitionDelay: `${index * 100}ms` }}>{word}</span></span>{' '}</span>)}</h2>
      <p className="approach-intro-copy">{t.intro}</p>
    </header>
    <div className="approach-diamond-stage" ref={stones.ref} data-reveal={stones.phase}>
      <div className="approach-diamonds">
        <div className="approach-stone-content approach-shell">
          <p className="approach-availability">{t.availability}</p>
          <StoneDetail title={t.natural} description={t.naturalDescription} />
          <StoneDetail title={t.lab} description={t.labDescription} />
        </div>
      </div>
    </div>
    <ServiceStrip />
    <div className="approach-end" ref={end.ref} data-reveal={end.phase}>
      <div className="manager-contact">
        <p>{choose(language,'Contact our manager','Связаться с менеджером','Зв’язатися з менеджером')}</p>
        <div>
          <ContactChannel channel="Telegram" className="manager-channel" />
          <ContactChannel channel="WhatsApp" className="manager-channel" />
        </div>
      </div>
    </div>
  </section>;
}
