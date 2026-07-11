import { esHome } from './translations/es-home';
import { BRAND, LEGAL_NAME, DOMAIN } from '../brand';

// Keep the complete dictionary as the compile-time schema without pulling it
// into the home bundle at runtime.
type TranslationKey = keyof typeof import('./translations/es').es;
type Locale = 'es' | 'en';
type Dictionary = Readonly<Partial<Record<TranslationKey, string>>>;
type FullDictionary = Readonly<Record<TranslationKey, string>>;

// The default route only needs its own copy plus shared chrome. Legacy routes
// promote this cache to the complete ES dictionary before they render. EN
// remains lazy and is cached after the first language switch.
const translations: Partial<Record<Locale, Dictionary>> = { es: esHome };
let fullEs: FullDictionary | undefined;
let fullEsPromise: Promise<FullDictionary> | undefined;

// Safe only with adapter-static (single render pass). Move locale to context/store before enabling SSR — module-level $state leaks across concurrent server requests.
let locale = $state<Locale>('es');

export function t(key: TranslationKey): string {
  const spanishFallback: Dictionary = fullEs ?? esHome;
  const dict: Dictionary = translations[locale] ?? spanishFallback;
  const raw = dict[key] ?? spanishFallback[key] ?? key;
  // Interpolate brand tokens so all copy stays rebrandable from $lib/brand.
  return raw.includes('{')
    ? raw.replace(/\{brand\}/g, BRAND).replace(/\{legal\}/g, LEGAL_NAME).replace(/\{domain\}/g, DOMAIN)
    : raw;
}

/** Load the complete Spanish dictionary before rendering a non-home route. */
export async function ensureLegacyEs(): Promise<void> {
  if (fullEs) return;

  fullEsPromise ??= import('./translations/es').then(({ es }) => es);

  try {
    fullEs = await fullEsPromise;
    translations.es = fullEs;
  } catch (error) {
    // A transient chunk failure must remain retryable on the next navigation.
    fullEsPromise = undefined;
    throw error;
  }
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
