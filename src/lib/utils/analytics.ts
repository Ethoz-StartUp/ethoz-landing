import { isInternal } from './internal';
import { getConsent } from '$lib/stores/consent.svelte';
import { scrubEvent, type EventPayload } from './events';

const BUFFER_KEY = 'ethoz_pending_events';

type AnalyticsWindow = Window & { dataLayer?: unknown[] };

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
  // GTM listens for this custom event and forwards it through one GA4 Event
  // tag. Keeping a single representation prevents duplicate GA4 deliveries.
  dl.push({ event, ...payload });
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
