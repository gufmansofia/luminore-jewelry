import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';

interface Testimonial {
  name: string;
  nameEn: string;
  nameUk: string;
  role: string;
  roleEn: string;
  roleUk: string;
  text: string;
  textEn: string;
  textUk: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Анна К.',
    nameEn: 'Anna K.',
    nameUk: 'Анна К.',
    role: 'Помолвочное кольцо',
    roleEn: 'Engagement Ring',
    roleUk: 'Заручинна каблучка',
    text: 'Кольцо превзошло все ожидания. Бриллиант играет невероятно, а качество исполнения безупречно. Luminore создали именно то, о чем я мечтала.',
    textEn: 'The ring exceeded all expectations. The diamond sparkles incredibly, and the craftsmanship is flawless. Luminore created exactly what I dreamed of.',
    textUk: 'Каблучка перевершила всі очікування. Діамант грає неймовірно, а якість виконання бездоганна. Luminore створили саме те, про що я мріяла.',
    rating: 5,
  },
  {
    name: 'Михаил Д.',
    nameEn: 'Michael D.',
    nameUk: 'Михайло Д.',
    role: 'Подарок на юбилей',
    roleEn: 'Anniversary Gift',
    roleUk: 'Подарунок на річницю',
    text: 'Заказывал серьги для жены. Индивидуальный подход, прозрачность на каждом этапе и потрясающий результат. Жена была в восторге.',
    textEn: 'Ordered earrings for my wife. Personal approach, transparency at every stage, and a stunning result. My wife was thrilled.',
    textUk: 'Замовляв сережки для дружини. Індивідуальний підхід, прозорість на кожному етапі та приголомшливий результат. Дружина була в захваті.',
    rating: 5,
  },
  {
    name: 'Елена С.',
    nameEn: 'Elena S.',
    nameUk: 'Олена С.',
    role: 'Коллекция украшений',
    roleEn: 'Jewellery collection',
    roleUk: 'Колекція прикрас',
    text: 'Уже третье украшение от Luminore. Каждый раз — идеальное сочетание дизайна и качества. Лабораторные бриллианты ничем не уступают натуральным.',
    textEn: 'This is my third piece from Luminore. Every time — a perfect blend of design and quality. Lab-grown diamonds are every bit as beautiful as natural ones.',
    textUk: 'Вже третя прикраса від Luminore. Щоразу — ідеальне поєднання дизайну та якості. Лабораторні діаманти жодним чином не поступаються природним.',
    rating: 5,
  },
  {
    name: 'Дарья Л.',
    nameEn: 'Daria L.',
    nameUk: 'Дар\'я Л.',
    role: 'Кольцо на заказ',
    roleEn: 'Custom Ring',
    roleUk: 'Каблучка на замовлення',
    text: 'Сделали кольцо по моему эскизу. Команда была невероятно внимательна к деталям. Результат — произведение искусства, которым я горжусь каждый день.',
    textEn: 'They made a ring from my sketch. The team was incredibly attentive to detail. The result is a work of art I am proud to wear every day.',
    textUk: 'Зробили каблучку за моїм ескізом. Команда була неймовірно уважна до деталей. Результат — витвір мистецтва, яким я пишаюся щодня.',
    rating: 5,
  },
];

const FADE_OUT_MS = 220;
const REVIEW_INTERVAL_MS = 2500;

export function Testimonials() {
  const { language:l, t } = useLanguage();
  const pauseUntil=useRef(0);
  const [readAll, setReadAll] = useState(false);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const content = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{x:number;y:number} | null>(null);
  const pick=(en:string,ru:string,uk:string)=>choose(l,en,ru,uk);

  const select=useCallback((index:number,manual=false)=>{
    const next=(index+testimonials.length)%testimonials.length;
    if(manual)pauseUntil.current=Date.now()+8000;
    setAnnounce(manual);
    setCycle(value=>value+1);
    if(next===activeIndex.current)return;
    activeIndex.current=next;
    if(transitionTimer.current!==null)clearTimeout(transitionTimer.current);
    if(reducedMotion){setActive(next);setLeaving(false);return;}
    setLeaving(true);
    transitionTimer.current=setTimeout(()=>{
      setActive(next);
      setLeaving(false);
      transitionTimer.current=null;
    },FADE_OUT_MS);
  },[reducedMotion]);
  const move=useCallback((delta:number,manual=true)=>select(activeIndex.current+delta,manual),[select]);

  useEffect(()=>{
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectMotion=()=>setReducedMotion(motion.matches);
    respectMotion();
    motion.addEventListener('change',respectMotion);
    const observer=new IntersectionObserver(([entry])=>{
      const inView=entry.isIntersecting&&entry.intersectionRatio>=0.2;
      setVisible(inView);
      if(inView)setRevealed(true);
    },{threshold:[0,0.2]});
    // On mobile the section heading enters first; reveal when the review itself is visible.
    if(content.current)observer.observe(content.current);
    const visibility=()=>setPageVisible(!document.hidden);
    visibility();
    document.addEventListener('visibilitychange',visibility);
    return ()=>{
      observer.disconnect();
      motion.removeEventListener('change',respectMotion);
      document.removeEventListener('visibilitychange',visibility);
      if(transitionTimer.current!==null)clearTimeout(transitionTimer.current);
    };
  },[]);

  useEffect(()=>{
    if(!reducedMotion)return;
    if(transitionTimer.current!==null)clearTimeout(transitionTimer.current);
    transitionTimer.current=null;
    setActive(activeIndex.current);
    setLeaving(false);
  },[reducedMotion]);

  const rotating=!readAll&&!reducedMotion&&!keyboardFocused&&!touching&&visible&&pageVisible;
  useEffect(()=>{
    if(!rotating)return;
    const timer=window.setTimeout(()=>move(1,false),Math.max(REVIEW_INTERVAL_MS,pauseUntil.current-Date.now()));
    return ()=>window.clearTimeout(timer);
  },[cycle,rotating,move]);

  return <section id="testimonials" data-theme="light" className={`editorial-section testimonials-section${revealed?' is-revealed':''}`} aria-labelledby="testimonials-title" aria-roledescription={readAll?undefined:pick('carousel','карусель','карусель')}
    onPointerDownCapture={()=>{setKeyboardFocused(false);pauseUntil.current=Date.now()+8000;setCycle(value=>value+1);}}
    onFocusCapture={e=>{setRevealed(true);setKeyboardFocused((e.target as HTMLElement).matches(':focus-visible'));}}
    onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node | null))setKeyboardFocused(false);}}
    onKeyDown={e=>{if(readAll)return;if(e.key==='ArrowRight'){e.preventDefault();setKeyboardFocused(true);move(1);}if(e.key==='ArrowLeft'){e.preventDefault();setKeyboardFocused(true);move(-1);}}}>
    <div className="editorial-container testimonial-layout">
      <header className="section-heading"><p className="section-eyebrow">{t.testimonials.eyebrow}</p><h2 id="testimonials-title">{t.testimonials.headline1}{t.testimonials.headline2}</h2></header>
      <div className="testimonial-panel">
        {readAll&&<div className="reviews-list">{testimonials.map(item=><figure key={item.nameEn}><blockquote><p>{pick("“","«","«")}{pick(item.textEn,item.text,item.textUk)}{pick("”","»","»")}</p></blockquote><figcaption>{pick(item.nameEn,item.name,item.nameUk)} · {pick(item.roleEn,item.role,item.roleUk)}</figcaption></figure>)}</div>}
        <div hidden={readAll}>
        <div ref={content} className="testimonial-content" tabIndex={0} aria-live={announce?'polite':'off'} aria-atomic="true"
          onPointerDown={e=>{if(e.isPrimary&&e.button===0){touchStart.current={x:e.clientX,y:e.clientY};setTouching(true);e.currentTarget.setPointerCapture(e.pointerId);}}}
          onPointerCancel={()=>{touchStart.current=null;setTouching(false);}}
          onLostPointerCapture={()=>{touchStart.current=null;setTouching(false);}}
          onPointerUp={e=>{
            const start=touchStart.current;touchStart.current=null;setTouching(false);
            if(!start)return;
            const dx=e.clientX-start.x,dy=e.clientY-start.y;
            if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1);
          }}>
          {testimonials.map((item,i)=><figure key={item.nameEn} className={`testimonial-slide ${active===i&&!leaving?'is-active':''}`} aria-hidden={active!==i||leaving} role="group" aria-roledescription={pick('slide','слайд','слайд')} aria-label={pick(`Review ${i+1} of ${testimonials.length}`,`Отзыв ${i+1} из ${testimonials.length}`,`Відгук ${i+1} із ${testimonials.length}`)}>
            <blockquote><p>{pick('“','«','«')}{pick(item.textEn,item.text,item.textUk)}{pick('”','»','»')}</p></blockquote>
            <figcaption><p className="testimonial-author">{pick(item.nameEn,item.name,item.nameUk)}</p><p className="testimonial-role">{pick(item.roleEn,item.role,item.roleUk)}</p></figcaption>
          </figure>)}
        </div>
        </div>
        <button type="button" className="text-button reviews-mode" aria-expanded={readAll} onClick={()=>{setReadAll(!readAll);setRevealed(true);}}>{readAll?pick("Back to carousel","Вернуться к карусели","Повернутися до каруселі"):pick("Read all reviews","Читать все отзывы","Читати всі відгуки")}</button>
      </div>
    </div>
  </section>;
}
