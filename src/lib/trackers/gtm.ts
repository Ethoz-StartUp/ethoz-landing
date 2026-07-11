import { getConsent } from '$lib/stores/consent.svelte';

export const GTM_ID = 'GTM-WX6ZCXLZ';

const SCRIPT_ID = 'ethoz-gtm-script';
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 750;

export type GtmLoadState = 'idle' | 'loading' | 'loaded' | 'failed';
export type TrackingConsent = { analytics: boolean; marketing: boolean };
type ConsentValue = 'granted' | 'denied';
type Gtag = (...args: unknown[]) => void;
type TrackingWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

let state: GtmLoadState = 'idle';
let activeLoad: Promise<boolean> | null = null;
let bootstrapPushed = false;
let bootstrapEvent: Record<string, unknown> | null = null;
let pendingScript: HTMLScriptElement | null = null;
let finishPendingLoad: ((succeeded: boolean) => void) | null = null;
let loadGeneration = 0;

export function isProductionTrackingHost(hostname = typeof window === 'undefined' ? '' : window.location.hostname): boolean {
  return hostname === 'ethoz.cl' || hostname === 'www.ethoz.cl';
}

function trackingWindow(): TrackingWindow {
  return window as TrackingWindow;
}

function ensureDataLayer(): unknown[] {
  const w = trackingWindow();
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  return w.dataLayer;
}

function ensureGtag(): Gtag {
  const w = trackingWindow();
  if (typeof w.gtag !== 'function') {
    w.gtag = function () {
      // Preserve Google's canonical array-like gtag command shape.
      // eslint-disable-next-line prefer-rest-params
      ensureDataLayer().push(arguments);
    };
  }
  return w.gtag;
}

export function getGtmLoadState(): GtmLoadState {
  return state;
}

function removeBootstrapEvent(): void {
  const dataLayer = trackingWindow().dataLayer;
  if (bootstrapEvent && Array.isArray(dataLayer)) {
    const index = dataLayer.indexOf(bootstrapEvent);
    if (index >= 0) dataLayer.splice(index, 1);
  }
  bootstrapEvent = null;
  bootstrapPushed = false;
}

/** Stop a requested GTM script before it can finish after consent withdrawal. */
export function cancelPendingGtmLoad(): void {
  if (!pendingScript && state !== 'loading') return;

  loadGeneration += 1;
  const script = pendingScript;
  const finish = finishPendingLoad;
  pendingScript = null;
  finishPendingLoad = null;

  if (script) {
    script.onload = null;
    script.onerror = null;
    script.remove();
  }
  removeBootstrapEvent();
  state = 'idle';
  activeLoad = null;
  finish?.(false);
}

export function updateGoogleConsent(consent: TrackingConsent): void {
  if (typeof window === 'undefined') return;
  const analytics: ConsentValue = consent.analytics ? 'granted' : 'denied';
  const marketing: ConsentValue = consent.marketing ? 'granted' : 'denied';
  const gtag = ensureGtag();
  gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });
  gtag('set', {
    allow_google_signals: false,
    allow_ad_personalization_signals: consent.marketing,
    ignore_referrer: !consent.marketing,
  });
}

function expireCookie(name: string): void {
  const domains = ['', window.location.hostname, 'ethoz.cl', '.ethoz.cl'];
  for (const domain of new Set(domains)) {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
  }
}

/** Remove first-party identifiers for every denied Google consent category. */
export function clearGoogleTrackingCookies(consent: TrackingConsent): void {
  if (typeof document === 'undefined') return;
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name));

  for (const name of names) {
    const analyticsCookie = name === '_ga' || name.startsWith('_ga_') || name === '_gid'
      || name.startsWith('_gat') || name === 'FPID' || name === 'FPLC';
    const advertisingCookie = name.startsWith('_gcl_') || name.startsWith('_gac_');
    if ((!consent.analytics && analyticsCookie) || (!consent.marketing && advertisingCookie)) {
      expireCookie(name);
    }
  }
}

function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function attemptLoad(attempt: number): Promise<boolean> {
  const generation = loadGeneration;
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`
  );
  if (existing) {
    state = 'loaded';
    return true;
  }

  state = 'loading';
  if (!bootstrapPushed) {
    bootstrapEvent = { 'gtm.start': Date.now(), event: 'gtm.js' };
    ensureDataLayer().push(bootstrapEvent);
    bootstrapPushed = true;
  }

  const succeeded = await new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    let settled = false;
    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      if (pendingScript === script) pendingScript = null;
      if (finishPendingLoad === finish) finishPendingLoad = null;
      resolve(result);
    };

    pendingScript = script;
    finishPendingLoad = finish;
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.onload = () => {
      const stillAllowed = generation === loadGeneration
        && getConsent().analytics
        && isProductionTrackingHost();
      if (!stillAllowed) script.remove();
      finish(stillAllowed);
    };
    script.onerror = () => {
      script.remove();
      finish(false);
    };
    document.head.appendChild(script);
  });

  if (generation !== loadGeneration) return false;

  if (succeeded) {
    state = 'loaded';
    return true;
  }

  if (!getConsent().analytics || !isProductionTrackingHost()) {
    removeBootstrapEvent();
    state = 'idle';
    return false;
  }

  state = 'failed';
  if (attempt >= MAX_ATTEMPTS) {
    removeBootstrapEvent();
    console.warn('[GTM] failed to load');
    return false;
  }

  await wait(RETRY_DELAY_MS);
  if (!getConsent().analytics || !isProductionTrackingHost()) {
    removeBootstrapEvent();
    state = 'idle';
    return false;
  }
  return attemptLoad(attempt + 1);
}

/** Load GTM once, only on the public production hosts and after analytics opt-in. */
export function loadGtm(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (!isProductionTrackingHost() || !getConsent().analytics) return Promise.resolve(false);
  if (state === 'loaded') return Promise.resolve(true);
  if (activeLoad) return activeLoad;

  const pending = attemptLoad(1);
  const tracked = pending.finally(() => {
    if (activeLoad === tracked) activeLoad = null;
  });
  activeLoad = tracked;
  return tracked;
}
