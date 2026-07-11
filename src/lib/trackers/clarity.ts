import { env } from '$env/dynamic/public';
import { getConsent } from '$lib/stores/consent.svelte';
import { isProductionTrackingHost, type TrackingConsent } from './gtm';

let loaded = false;
let pendingScript: HTMLScriptElement | null = null;
type ClarityConsentValue = 'granted' | 'denied';
type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityFunction };

function getClarity(): ClarityFunction | undefined {
  return (window as ClarityWindow).clarity;
}

function ensureClarity(): ClarityFunction {
  const w = window as ClarityWindow;
  if (typeof w.clarity !== 'function') {
    const stub: ClarityFunction = (...args: unknown[]) => {
      (stub.q ??= []).push(args);
    };
    w.clarity = stub;
  }
  return w.clarity;
}

export function updateClarityConsent(consent: TrackingConsent): void {
  if (typeof window === 'undefined') return;
  const clarity = getClarity();
  if (!clarity) return;
  const analytics: ClarityConsentValue = consent.analytics ? 'granted' : 'denied';
  const marketing: ClarityConsentValue = consent.marketing ? 'granted' : 'denied';
  clarity('consentv2', {
    ad_Storage: marketing,
    analytics_Storage: analytics,
  });
}

function expireClarityCookie(name: string): void {
  const domains = ['', window.location.hostname, 'ethoz.cl', '.ethoz.cl'];
  for (const domain of new Set(domains)) {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
  }
}

export function clearClarityCookies(): void {
  if (typeof document === 'undefined') return;
  for (const name of ['_clck', '_clsk']) expireClarityCookie(name);
}

/** Revoke Clarity storage, end its current session, and delete first-party IDs. */
export function revokeClarityConsent(): void {
  if (typeof window === 'undefined') return;
  if (pendingScript) {
    pendingScript.onload = null;
    pendingScript.onerror = null;
    pendingScript.remove();
    pendingScript = null;
    loaded = false;
  }
  const clarity = getClarity();
  if (clarity) {
    clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
    clarity('consent', false);
  }
  clearClarityCookies();
}

export function loadClarity(consent: TrackingConsent = getConsent()): boolean {
  if (typeof window === 'undefined') return false;
  if (loaded) {
    updateClarityConsent(consent);
    return true;
  }
  if (pendingScript) {
    updateClarityConsent(consent);
    return true;
  }
  if (!isProductionTrackingHost() || !consent.analytics || !getConsent().analytics) return false;
  const id = env.PUBLIC_CLARITY_PROJECT_ID;
  if (!id) return false;
  if (document.querySelector(`script[src*="clarity.ms/tag/${id}"]`)) {
    ensureClarity();
    loaded = true;
    updateClarityConsent(consent);
    return true;
  }

  const clarity = ensureClarity();
  clarity('consentv2', {
    ad_Storage: consent.marketing ? 'granted' : 'denied',
    analytics_Storage: 'granted',
  });

  const script = document.createElement('script');
  script.id = 'ethoz-clarity-script';
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${id}`;
  script.onload = () => {
    if (pendingScript === script) pendingScript = null;
    const stillAllowed = getConsent().analytics && isProductionTrackingHost();
    if (!stillAllowed) {
      loaded = false;
      script.remove();
      return;
    }
    loaded = true;
    updateClarityConsent(getConsent());
  };
  script.onerror = () => {
    if (pendingScript === script) pendingScript = null;
    loaded = false;
    script.remove();
    console.warn('[Clarity] failed to load');
  };
  pendingScript = script;
  document.head.appendChild(script);
  return true;
}
