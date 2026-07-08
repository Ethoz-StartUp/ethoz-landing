import { es } from './translations/es';
import { BRAND, LEGAL_NAME, DOMAIN } from '../brand';

type TranslationKey = keyof typeof es;
type Locale = 'es' | 'en';

// es ships eagerly (default locale, used for SSR/prerender). en (~260 KB min)
// loads on demand the first time the visitor switches language and is cached
// here for the rest of the session, keeping it out of the critical bundle.
const translations: Partial<Record<Locale, Record<string, string>>> = { es };

// Safe only with adapter-static (single render pass). Move locale to context/store before enabling SSR — module-level $state leaks across concurrent server requests.
let locale = $state<Locale>('es');

export function t(key: TranslationKey): string {
  const dict = translations[locale] ?? es;
  const raw = dict[key] ?? key;
  // Interpolate brand tokens so all copy stays rebrandable from $lib/brand.
  return raw.includes('{')
    ? raw.replace(/\{brand\}/g, BRAND).replace(/\{legal\}/g, LEGAL_NAME).replace(/\{domain\}/g, DOMAIN)
    : raw;
}

export async function setLocale(newLocale: Locale): Promise<void> {
  if (newLocale === 'en' && !translations.en) {
    const { en } = await import('./translations/en');
    translations.en = en;
  }
  locale = newLocale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = newLocale;
  }
}

export function getLocale(): Locale {
  return locale;
}

export async function toggleLocale(): Promise<void> {
  await setLocale(locale === 'es' ? 'en' : 'es');
}

export type { Locale, TranslationKey };
