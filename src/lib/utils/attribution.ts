import { browser } from '$app/environment';
import { getConsent } from '$lib/stores/consent.svelte';

const FIRST_KEY = 'ethoz_attribution_first';
const LAST_KEY = 'ethoz_attribution_last';

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
  first_touch_at?: string;
  last_touch_at?: string;
};

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'li_fat_id',
  'msclkid',
] as const;

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // quota or disabled — in-memory only
  }
}

function parseUrl(): Partial<Attribution> {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Attribution> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) (out as Record<string, string>)[k] = v;
  }
  out.landing_page = window.location.pathname || '/';
  return out;
}

function parseReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    const refUrl = new URL(ref);
    if (refUrl.hostname === window.location.hostname) return undefined;
    return `${refUrl.origin}${refUrl.pathname}`;
  } catch {
    return undefined;
  }
}

export function captureAttribution(): void {
  if (!browser) return;
  if (!getConsent().marketing) {
    clearAttribution();
    return;
  }
  const now = new Date().toISOString();
  const fromUrl = parseUrl();
  const ref = parseReferrer();
  const last: Attribution = { ...fromUrl, last_touch_at: now };
  if (ref) last.referrer = ref;
  writeJson(sessionStorage, LAST_KEY, last);

  const existingFirst = readJson<Attribution>(localStorage, FIRST_KEY);
  if (!existingFirst) {
    const first: Attribution = { ...fromUrl, first_touch_at: now };
    if (ref) first.referrer = ref;
    writeJson(localStorage, FIRST_KEY, first);
  }
}

export function readAttribution(): Attribution {
  if (!browser) return {};
  if (!getConsent().marketing) {
    clearAttribution();
    return {};
  }
  const first = readJson<Attribution>(localStorage, FIRST_KEY) ?? {};
  const last = readJson<Attribution>(sessionStorage, LAST_KEY) ?? {};
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = (first as Record<string, string>)[k] ?? (last as Record<string, string>)[k];
    if (v) (out as Record<string, string>)[k] = v;
  }
  if (first.referrer) out.referrer = first.referrer;
  else if (last.referrer) out.referrer = last.referrer;
  out.landing_page = last.landing_page ?? first.landing_page;
  out.first_touch_at = first.first_touch_at;
  out.last_touch_at = last.last_touch_at;
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined)) as Attribution;
}

export function clearAttribution(): void {
  if (!browser) return;
  for (const storage of [localStorage, sessionStorage]) {
    try {
      storage.removeItem(FIRST_KEY);
      storage.removeItem(LAST_KEY);
    } catch {
      // Storage can be unavailable; no attribution will be read in that case.
    }
  }
}

/**
 * Remove campaign and click identifiers before an analytics-only page view can
 * copy the current URL. The navigation stays on the same document and retains
 * unrelated query parameters and the hash.
 */
export function stripAttributionFromUrl(): void {
  if (!browser) return;
  try {
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of UTM_KEYS) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    if (!changed) return;
    const next = `${url.pathname}${url.search}${url.hash}`;
    history.replaceState(history.state, '', next);
  } catch {
    // A synthetic or locked-down location must not block the page.
  }
}
