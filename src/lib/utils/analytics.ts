import { isInternal } from './internal';

export function trackEvent(event: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || !(window as any).dataLayer) return;

  // Skip tracking for internal users
  if (isInternal()) return;

  (window as any).dataLayer.push({
    event,
    ...params
  });
}
