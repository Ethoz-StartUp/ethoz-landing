import { isInternal } from './internal';
import { getConsent } from '$lib/stores/consent.svelte';
import { scrubEvent, type EventPayload } from './events';

const BUFFER_KEY = 'ethoz_pending_events';
const MAX_BUFFER = 50;

type QueuedEvent = { event: string; payload: EventPayload; at: number };

function readBuffer(): QueuedEvent[] {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(BUFFER_KEY);
    return raw ? (JSON.parse(raw) as QueuedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeBuffer(queue: QueuedEvent[]): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(BUFFER_KEY, JSON.stringify(queue.slice(-MAX_BUFFER)));
  } catch {
    // storage quota or disabled — drop
  }
}

function pushToDataLayer(event: string, payload: EventPayload): void {
  if (typeof window === 'undefined') return;
  const dl = (window as any).dataLayer;
  if (!Array.isArray(dl)) return;
  dl.push({ event, ...payload });
}

export function trackEvent(event: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;
  if (isInternal()) return;
  const scrubbed = scrubEvent(payload);
  if (!getConsent().analytics) {
    const queue = readBuffer();
    queue.push({ event, payload: scrubbed, at: Date.now() });
    writeBuffer(queue);
    return;
  }
  pushToDataLayer(event, scrubbed);
}

export function flushPendingEvents(): void {
  if (typeof window === 'undefined') return;
  if (!getConsent().analytics) return;
  if (isInternal()) return;
  const queue = readBuffer();
  for (const q of queue) pushToDataLayer(q.event, q.payload);
  try {
    sessionStorage.removeItem(BUFFER_KEY);
  } catch {
    // ignore
  }
}
