import type { Language } from '../i18n/translations';
import type { Enquiry } from './enquiry';
import { choose } from './product-copy';

export function enquiryBudgetOptions(stone: Enquiry['stone'], language: Language) {
  const amount = (value: number) => '$' + new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ru-RU').format(value);
  const range = (from: number, to: number) => `${amount(from)} – ${amount(to)}`;
  const options: [string, string][] = stone === 'natural'
    ? [
      ['5000-15000', range(5000, 15000)],
      ['15000-25000', range(15000, 25000)],
      ['25000-50000', range(25000, 50000)],
      ['50000+', `${amount(50000)}+`],
    ]
    : [
      ['under-2000', choose(language, `Under ${amount(2000)}`, `До ${amount(2000)}`, `До ${amount(2000)}`)],
      ['2000-5000', range(2000, 5000)],
      ['5000-15000', range(5000, 15000)],
      ['15000+', `${amount(15000)}+`],
    ];
  return [...options, ['flexible', choose(language, 'Flexible', 'Обсудим', 'Обговоримо')] as [string, string]];
}

// Preserve contact details on back navigation; clear a budget incompatible with the selected stones.
export function validEnquiryBudget(budget: string | undefined, stone: Enquiry['stone']) {
  return enquiryBudgetOptions(stone, 'en').some(([value]) => value === budget) ? budget : '';
}
