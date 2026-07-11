import { describe, it, expect } from 'vitest';
import { es } from './translations/es';
import { esHome } from './translations/es-home';
import { en } from './translations/en';

const homePrefixes = new Set([
  'nav',
  'hero',
  'editorial',
  'problem',
  'solution',
  'home',
  'compliance',
  'how',
  'cta',
  'footer',
  'lang',
  'faq',
  'consentBanner',
  'consentSheet',
  'feedbackModal',
  'feedbackOverlay',
  'pitchModal',
  'features',
]);

describe('i18n key parity', () => {
  const esKeys = Object.keys(es).sort();
  const enKeys = Object.keys(en).sort();

  it('es.ts and en.ts have the same number of keys', () => {
    expect(esKeys.length).toBe(enKeys.length);
  });

  it('every key in es.ts exists in en.ts', () => {
    const missingInEn = esKeys.filter(k => !enKeys.includes(k));
    expect(missingInEn).toEqual([]);
  });

  it('every key in en.ts exists in es.ts', () => {
    const missingInEs = enKeys.filter(k => !esKeys.includes(k));
    expect(missingInEs).toEqual([]);
  });

  it('no translation value is empty', () => {
    const emptyEs = esKeys.filter(k => !es[k as keyof typeof es]?.trim());
    const emptyEn = enKeys.filter(k => !en[k as keyof typeof en]?.trim());
    expect(emptyEs).toEqual([]);
    expect(emptyEn).toEqual([]);
  });

  it('the eager home subset contains every key in its shared namespaces', () => {
    const expected = esKeys.filter(key => homePrefixes.has(key.split('.')[0]));
    expect(Object.keys(esHome).sort()).toEqual(expected);
  });

  it('the eager home subset exactly matches both source dictionaries', () => {
    const mismatchedEs = Object.entries(esHome).filter(([key, value]) => es[key as keyof typeof es] !== value);
    const missingInEn = Object.keys(esHome).filter(key => !(key in en));

    expect(mismatchedEs).toEqual([]);
    expect(missingInEn).toEqual([]);
  });
});
