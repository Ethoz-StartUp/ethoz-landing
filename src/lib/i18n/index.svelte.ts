import { es } from './translations/es';
import { en } from './translations/en';
import { BRAND, LEGAL_NAME, DOMAIN } from '../brand';

type TranslationKey = keyof typeof es;
type Locale = 'es' | 'en';

const translations: Record<Locale, Record<string, string>> = { es, en };

// Safe only with adapter-static (single render pass). Move locale to context/store before enabling SSR — module-level $state leaks across concurrent server requests.
let locale = $state<Locale>('es');

export function t(key: TranslationKey): string {
  const raw = translations[locale][key] ?? key;
  // Interpolate brand tokens so all copy stays rebrandable from $lib/brand.
  return raw.includes('{')
    ? raw.replace(/\{brand\}/g, BRAND).replace(/\{legal\}/g, LEGAL_NAME).replace(/\{domain\}/g, DOMAIN)
    : raw;
}

export function setLocale(newLocale: Locale) {
  locale = newLocale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = newLocale;
  }
}

export function getLocale(): Locale {
  return locale;
}

export function toggleLocale() {
  setLocale(locale === 'es' ? 'en' : 'es');
}

export type { Locale, TranslationKey };
