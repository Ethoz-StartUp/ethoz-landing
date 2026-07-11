import { browser } from '$app/environment';
import { getConsent } from '$lib/stores/consent.svelte';

const STORAGE_KEY = 'ethoz_vid';

/** Get or create a persistent visitor ID for cross-platform matching */
export function getVisitorId(): string {
  if (!browser) return '';
  if (!getConsent().analytics) {
    clearVisitorId();
    return '';
  }

  try {
    let vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return '';
  }
}

/** Identify visitor in GA4 via dataLayer */
export function identifyGA4(vid: string): void {
  if (!browser || !vid || !getConsent().analytics) return;
  const trackingWindow = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  const dl = trackingWindow.dataLayer;
  if (!Array.isArray(dl)) return;
  dl.push({ user_id: vid, ethoz_visitor_id: vid });
  trackingWindow.gtag?.('set', { user_id: vid, ethoz_visitor_id: vid });
}

/** Identify visitor in Microsoft Clarity */
export function identifyClarity(vid: string): void {
  if (!browser || !vid || !getConsent().analytics) return;
  const clarity = (window as any).clarity;
  if (typeof clarity === 'function') {
    clarity('identify', vid);
  }
}

/** Identify visitor across all platforms */
export function identifyVisitor(): string {
  const vid = getVisitorId();
  if (vid) {
    identifyGA4(vid);
    identifyClarity(vid);
  }
  return vid;
}

export function clearVisitorId(): void {
  if (!browser) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be disabled.
  }

  const trackingWindow = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (Array.isArray(trackingWindow.dataLayer)) {
    trackingWindow.dataLayer.push({ user_id: null, ethoz_visitor_id: null });
  }
  trackingWindow.gtag?.('set', { user_id: null, ethoz_visitor_id: null });
}
