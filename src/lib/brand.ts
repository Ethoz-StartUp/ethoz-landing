// Single source of truth for the brand name. Rebrand = edit these three values.
//
// - Code (.svelte / .ts): import { BRAND } from '$lib/brand' and interpolate.
// - i18n copy (translations/*.ts): use the {brand} / {legal} / {domain} tokens —
//   the t() function substitutes them at read time.
//
// NOT covered here on purpose: URLs (ethoz.cl, ethoz.web.app), email addresses,
// social handles, and backend endpoints — those are infrastructure, not
// display name, and changing them is a separate DNS/hosting/account task.

/** Display / marketing name. */
export const BRAND = 'Ethoz';

/** Registered legal entity name (used in footer, legal pages). */
export const LEGAL_NAME = 'ETHOZ SpA';

/** Primary public domain (used in displayed copy, not in hardcoded URLs). */
export const DOMAIN = 'ethoz.cl';
