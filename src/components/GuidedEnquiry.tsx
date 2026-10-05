import { useId, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import type { Enquiry } from '../lib/enquiry';
import { ringShapes, ringShapeLabel, type RingShape } from '../lib/ring-shapes';
import {RingShapeIcon} from './RingShapeIcon';
import { EnquiryForm } from './EnquiryForm';

type Step = 'piece' | 'shape' | 'stone' | 'direction' | 'contact';

export function GuidedEnquiry() {
  const { language: l, t } = useLanguage();
  const pick = (en: string, ru: string, uk: string) => choose(l, en, ru, uk);
  const id = useId();
  const [step, setStep] = useState<Step>('piece');
  const [piece, setPiece] = useState('');
  const [ringShape, setRingShape] = useState<RingShape>();
  const [stone, setStone] = useState<Enquiry['stone']>();
  const [direction, setDirection] = useState<Enquiry['direction']>();
  const [visitedContact, setVisitedContact] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const contact = useRef<HTMLDivElement>(null);
  const initialValues = useMemo(() => ({ piece, stone, direction, ringShape: piece === 'Rings' ? ringShape : undefined }), [piece, stone, direction, ringShape]);
  const steps: Step[] = piece === 'Rings' ? ['piece', 'shape', 'stone', 'direction', 'contact'] : ['piece', 'stone', 'direction', 'contact'];
  const stepIndex = steps.indexOf(step);
  const types = [['Rings', t.products.rings], ['Earrings', t.products.earrings], ['Bracelets', t.products.bracelets], ['Pendants', t.products.pendants], ['Necklaces', t.products.necklaces], ['Other', pick('Help me choose', 'Помогите выбрать', 'Допоможіть обрати')]];
  const stones = [['natural', t.product.naturalDiamond], ['lab', t.product.labGrownDiamond], ['undecided', pick('Help me choose', 'Помогите выбрать', 'Допоможіть обрати')]];
  const routes = [['collection', pick('From the collection', 'Из коллекции', 'З колекції')], ['bespoke', pick('A custom piece', 'На заказ', 'На замовлення')], ['undecided', pick('Help me choose', 'Помогите выбрать', 'Допоможіть обрати')]];
  const titles: Record<Step, string> = {
    piece: pick('What do you have in mind?', 'Какое украшение вы ищете?', 'Яку прикрасу ви шукаєте?'),
    shape: pick('Which diamond shape?', 'Какую огранку вы выбираете?', 'Яке огранювання ви обираєте?'),
    stone: pick('Your choice of diamond', 'Какие бриллианты вы предпочитаете?', 'Які діаманти ви обираєте?'),
    direction: pick('How would you like to start?', 'С чего начнём?', 'З чого почнемо?'),
    contact: pick('Your enquiry', 'Ваша заявка', 'Ваша заявка'),
  };
  const shapes = [...ringShapes].sort((a,b)=> (['undecided','sketch'].includes(a.value)?0:1)-(['undecided','sketch'].includes(b.value)?0:1)).map(shape => [shape.value, ringShapeLabel(shape.value, l)]);
  const options = step === 'piece' ? types : step === 'shape' ? shapes : step === 'stone' ? stones : routes;
  const selected = step === 'piece' ? piece : step === 'shape' ? ringShape : step === 'stone' ? stone : direction;
  const go = (next: Step) => {
    setStep(next);
    if (next === 'contact') setVisitedContact(true);
    requestAnimationFrame(() => {
      if (next === 'contact') contact.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
      else heading.current?.focus({ preventScroll: true });
      container.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  };
  return <div ref={container} id="bespoke-guide" className="guided-enquiry">
    <div className="guided-progress"><span aria-live="polite">{pick(`Step ${stepIndex+1} of ${steps.length}`,`Шаг ${stepIndex+1} из ${steps.length}`,`Крок ${stepIndex+1} із ${steps.length}`)}</span><div aria-hidden="true"><span style={{ width: `${(stepIndex+1)/steps.length*100}%` }} /></div></div>
    {step==='piece'&&<p className="guided-step-note">{pick('Choose a few details, then continue in Telegram or WhatsApp.','Выберите основные детали, затем продолжим общение в Telegram или WhatsApp.','Оберіть основні деталі, а потім продовжимо спілкування в Telegram або WhatsApp.')}</p>}
    {step !== 'contact' && <div key={step} className="guided-stage">
      <p className="section-eyebrow">{pick('Personal selection', 'Подбор украшения', 'Підбір прикраси')}</p>
      <h3 ref={heading} tabIndex={-1} id={`${id}-heading`}>{titles[step]}</h3>
      {step === 'shape' && <p className="guided-step-note">{pick('You can also share your own sketch in the messenger you choose.', 'Вы также можете отправить свой эскиз в выбранном мессенджере.', 'Ви також можете надіслати власний ескіз в обраному месенджері.')}</p>}
      <div role="group" aria-labelledby={`${id}-heading`} className={`guided-choices ${step==='shape'?'guided-shapes':''}`}>
        {options.map(([key, label]) => <button type="button" key={key} className="guided-choice" aria-pressed={selected === key} onClick={() => {
          if (step === 'piece') setPiece(key);
          else if (step === 'shape') setRingShape(key as RingShape);
          else if (step === 'stone') setStone(key as Enquiry['stone']);
          else setDirection(key as Enquiry['direction']);
        }}><span aria-hidden="true" />{step==='shape'&&<RingShapeIcon shape={key as RingShape}/>}<span className="guided-choice-label">{label}</span></button>)}
      </div>
      {step==='piece'&&<button type="button" className="text-button guided-shortcut" onClick={()=>{setPiece('Other');setStone('undecided');setDirection('bespoke');go('contact');}}>{pick('Discuss my idea directly','Сразу обсудить мою идею','Одразу обговорити мою ідею')} →</button>}
      <div className="guided-controls">{stepIndex > 0 && <button type="button" className="text-button" onClick={() => go(steps[stepIndex - 1])}>← {pick('Back', 'Назад', 'Назад')}</button>}<button type="button" className="primary-button" disabled={!selected} onClick={() => go(steps[stepIndex + 1])}>{pick('Next', 'Далее', 'Далі')} <span aria-hidden="true">→</span></button></div>
    </div>}
    <div ref={contact} hidden={step !== 'contact'}>{visitedContact && <>
      <dl className="guided-summary">
        <div><dt>{pick('Piece', 'Украшение', 'Прикраса')}</dt><dd>{types.find(([key]) => key === piece)?.[1]}</dd></div>
        {piece === 'Rings' && ringShape && <div><dt>{pick('Cut / sketch', 'Огранка / эскиз', 'Огранювання / ескіз')}</dt><dd>{ringShapeLabel(ringShape, l)}</dd></div>}
        <div><dt>{t.product.stones}</dt><dd>{stones.find(([key]) => key === stone)?.[1]}</dd></div>
        <div><dt>{pick('Preference', 'Пожелание', 'Побажання')}</dt><dd>{routes.find(([key]) => key === direction)?.[1]}</dd></div>
      </dl>
      <EnquiryForm bespoke initialValues={initialValues} guided onBack={() => go('direction')} />
    </>}</div>
  </div>;
}
