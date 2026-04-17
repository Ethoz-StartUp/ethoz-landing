import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('trackEvent', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    (window as any).dataLayer = [];
    vi.resetModules();
  });

  it('does not push to dataLayer when consent.analytics is false', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(0);
  });

  it('buffers events in sessionStorage when consent.analytics is false', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    const buffered = JSON.parse(sessionStorage.getItem('ethoz_pending_events') ?? '[]');
    expect(buffered).toHaveLength(1);
    expect(buffered[0].event).toBe('demo_booked');
  });

  it('pushes to dataLayer when consent.analytics is true', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(1);
    expect((window as any).dataLayer[0]).toMatchObject({ event: 'demo_booked', source: 'home' });
  });

  it('scrubs PII before sending', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('contact_submit', { email: 'a@b.com', source: 'x' });
    const pushed = (window as any).dataLayer[0];
    expect(pushed).not.toHaveProperty('email');
    expect(pushed.source).toBe('x');
  });

  it('flushes the buffer when flushPendingEvents() runs', async () => {
    const { trackEvent, flushPendingEvents } = await import('./analytics');
    trackEvent('a', { source: 'x' });
    trackEvent('b', { source: 'y' });
    expect((window as any).dataLayer).toHaveLength(0);
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    flushPendingEvents();
    expect((window as any).dataLayer).toHaveLength(2);
    expect(sessionStorage.getItem('ethoz_pending_events')).toBeNull();
  });

  it('internal users are still skipped', async () => {
    localStorage.setItem('ethoz_internal', '1');
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(0);
  });
});
