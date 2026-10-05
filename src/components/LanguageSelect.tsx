import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage, type Language } from '../i18n';
import { choose } from '../lib/product-copy';

const languages: { value: Language; code: string; name: string }[] = [
  { value: 'en', code: 'EN', name: 'English' },
  { value: 'uk', code: 'UA', name: 'Українська' },
  { value: 'ru', code: 'RU', name: 'Русский' },
];

export function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = languages.findIndex(option => option.value === language);
  const label = choose(language, 'Language', 'Язык', 'Мова');

  useEffect(() => {
    if (!open) return;
    options.current[selected]?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open, selected]);

  const closeAndFocus = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return <div ref={root} className="language-picker"
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        event.stopPropagation();
        closeAndFocus();
      }
    }}>
    <button ref={trigger} id={`${id}-trigger`} type="button" className="language-select"
      aria-label={`${label}: ${languages[selected].name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={`${id}-options`}
      onClick={() => setOpen(value => !value)}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (open) options.current[selected]?.focus();
          else setOpen(true);
        }
      }}>
      <span>{languages[selected].code}</span>
      <svg className="language-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>
    </button>
    <div id={`${id}-options`} className="language-options" role="menu" aria-labelledby={`${id}-trigger`} hidden={!open}
      onKeyDown={event => {
        if (event.key === 'Tab') {
          // Return to the trigger so native Tab continues through the page in order.
          closeAndFocus();
          return;
        }
        const current = options.current.findIndex(option => option === document.activeElement);
        const total = languages.length;
        let next = -1;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = total - 1;
        else if (event.key === 'ArrowDown') next = (current + 1) % total;
        else if (event.key === 'ArrowUp') next = (current - 1 + total) % total;
        else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const character = event.key.toLocaleLowerCase();
          for (let offset = 1; offset <= total; offset++) {
            const index = (current + offset) % total;
            if ([languages[index].code, languages[index].name].some(text => text.toLocaleLowerCase().startsWith(character))) {
              next = index;
              break;
            }
          }
        }
        if (next >= 0) {
          event.preventDefault();
          options.current[next]?.focus();
        }
      }}>
      {languages.map((option, index) => <button key={option.value} ref={element => { options.current[index] = element; }}
        type="button" className="language-option" role="menuitemradio" aria-checked={language === option.value} tabIndex={-1}
        lang={option.value} onClick={() => {
          closeAndFocus();
          if (option.value !== language) setLanguage(option.value);
        }}>
        <span className="language-option-code" aria-hidden="true">{option.code}</span>
        <span>{option.name}</span>
        <svg className="language-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4 10-10" /></svg>
      </button>)}
    </div>
  </div>;
}
