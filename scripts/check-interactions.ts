import { test, expect } from 'bun:test';
import { readSavedPieces, toggleSavedPiece } from '../src/lib/saved-pieces';
import { enquiryMessage, telegramEnquiryUrl } from '../src/lib/enquiry';
import { enquiryBudgetOptions, validEnquiryBudget } from '../src/lib/enquiry-budget';
import { articleChapters } from '../src/lib/article-chapters';
import { blogPosts } from '../src/data/blogs';

test('saved pieces survive stale data without duplicates or a two-piece storage limit', () => {
  const valid = new Set([1, 4, 16]);
  for (const value of [null, '{', 'null', '{}', 'true']) expect(readSavedPieces(value, valid)).toEqual([]);
  expect(readSavedPieces('[1,4,4,999,"16",null,16]', valid)).toEqual([1, 4, 16]);
  expect(toggleSavedPiece([1, 4], 16)).toEqual([1, 4, 16]);
  expect(toggleSavedPiece([1, 4, 16], 4)).toEqual([1, 16]);
});

test('guided preferences reach the Luminore Telegram draft in all languages without pretending a collection request is bespoke', () => {
  for (const language of ['en', 'ru', 'uk'] as const) {
    const draft = enquiryMessage({ name: 'Anna', piece: 'Ring', ringShape: 'oval', stone: 'natural', direction: 'collection', details: 'Oval & pear + side stones' }, language, true);
    const url = new URL(telegramEnquiryUrl(draft));
    expect(url.origin + url.pathname).toBe('https://t.me/luminore_jewelry');
    expect(url.searchParams.get('text')).toBe(draft);
    expect(draft).toContain('Oval & pear + side stones');
    expect(draft).not.toMatch(/undefined|discuss a bespoke piece|обсудить украшение на заказ|обговорити прикрасу на замовлення/);
    expect(draft).toContain(({ en: 'Natural', ru: 'Натуральные', uk: 'Природні' })[language]);
    expect(draft).toContain(({ en: 'From the collection', ru: 'Из коллекции', uk: 'З колекції' })[language]);
    expect(draft).toContain(({ en: 'Cut / sketch: Oval', ru: 'Огранка / эскиз: Овал', uk: 'Огранювання / ескіз: Овал' })[language]);
    const sketchDraft = enquiryMessage({ name: 'Anna', piece: 'Ring', ringShape: 'sketch', details: '' }, language, true);
    expect(sketchDraft).toContain(({ en: 'My own sketch', ru: 'Свой эскиз', uk: 'Власний ескіз' })[language]);
  }
});

test('every article chapter links to its existing heading exactly once, across languages', () => {
  for (const post of blogPosts) for (const content of [post.content, post.contentEn, post.contentUk]) {
    const chapters = articleChapters(content);
    expect(chapters.length).toBeGreaterThan(0);
    expect(new Set(chapters.map(chapter => chapter.id)).size).toBe(chapters.length);
    expect(chapters.map(chapter => chapter.title)).toEqual(content.filter(text => text.startsWith('## ')).map(text => text.slice(3)));
    for (const chapter of chapters) expect(content[chapter.index]).toBe('## ' + chapter.title);
  }
});

test('natural diamond budgets reach Telegram for every piece type and language', () => {
  for (const language of ['en', 'ru', 'uk'] as const) {
    const options = enquiryBudgetOptions('natural', language);
    expect(options.map(([value]) => value)).toEqual(['5000-15000', '15000-25000', '25000-50000', '50000+', 'flexible']);
    for (const piece of ['Rings', 'Earrings', 'Bracelets', 'Pendants', 'Necklaces', 'Other']) {
      for (const [value, label] of options) {
        const draft = enquiryMessage({ name: 'Anna', piece, stone: 'natural', budget: label, details: '' }, language, true);
        expect(new URL(telegramEnquiryUrl(draft)).searchParams.get('text')).toContain(label);
        expect(validEnquiryBudget(value, 'natural')).toBe(value);
      }
    }
  }
  expect(enquiryBudgetOptions('natural', 'en')[0][1]).toBe('$5,000 – $15,000');
});

test('changing diamond type clears incompatible budgets and retains shared choices', () => {
  for (const stone of ['lab', 'undecided', undefined] as const) {
    expect(enquiryBudgetOptions(stone, 'en').map(([value]) => value)).toEqual(['under-2000', '2000-5000', '5000-15000', '15000+', 'flexible']);
    for (const budget of ['15000-25000', '25000-50000', '50000+']) expect(validEnquiryBudget(budget, stone)).toBe('');
  }
  for (const budget of ['under-2000', '2000-5000', '15000+']) expect(validEnquiryBudget(budget, 'natural')).toBe('');
  for (const stone of ['natural', 'lab', 'undecided'] as const) {
    for (const budget of ['5000-15000', 'flexible']) expect(validEnquiryBudget(budget, stone)).toBe(budget);
    expect(validEnquiryBudget(undefined, stone)).toBe('');
    expect(validEnquiryBudget('invalid', stone)).toBe('');
  }
});
