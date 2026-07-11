import { isInternal } from './internal';
import { getConsent } from '$lib/stores/consent.svelte';
import { isProductionTrackingHost } from '$lib/trackers/gtm';
import { scrubEvent, type EventPayload } from './events';

const BUFFER_KEY = 'ethoz_pending_events';

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

/** Remove events persisted by the pre-Consent-Mode implementation. */
export function clearPendingEvents(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(BUFFER_KEY);
  } catch {
    // Storage can be disabled; there is nothing else to retain or send.
  }
}

function pushToDataLayer(event: string, payload: EventPayload): void {
  if (typeof window === 'undefined') return;
  const w = window as AnalyticsWindow;
  const dl = Array.isArray(w.dataLayer) ? w.dataLayer : (w.dataLayer = []);
  // Production uses one canonical delivery contract. A structured copy is
  // available only on non-production hosts where GTM is intentionally disabled.
  if (!isProductionTrackingHost()) dl.push({ event, ...payload });
  if (typeof w.gtag !== 'function') {
    w.gtag = function () {
      // Preserve Google's canonical array-like gtag command shape.
      // eslint-disable-next-line prefer-rest-params
      dl.push(arguments);
    };
  }
  w.gtag('event', event, payload);
}

export function trackEvent(event: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;
  clearPendingEvents();
  if (isInternal()) return;
  if (!getConsent().analytics) {
    return;
  }
  pushToDataLayer(event, scrubEvent(payload));
}

/** @deprecated Pre-consent events are intentionally dropped, never replayed. */
export function flushPendingEvents(): void {
  clearPendingEvents();
}
