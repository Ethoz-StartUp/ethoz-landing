import { describe, it, expect } from 'vitest';
import { es } from './translations/es';
import { en } from './translations/en';

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
});
