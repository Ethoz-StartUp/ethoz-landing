import { describe, it, expect, beforeEach, vi } from 'vitest';

const { isProductionTrackingHostMock } = vi.hoisted(() => ({
  isProductionTrackingHostMock: vi.fn(() => false),
}));

vi.mock('$lib/trackers/gtm', () => ({
  isProductionTrackingHost: isProductionTrackingHostMock,
}));

describe('trackEvent', () => {
  beforeEach(async () => {
    vi.resetModules();
    isProductionTrackingHostMock.mockReturnValue(false);
    localStorage.clear();
    sessionStorage.clear();
    (window as any).dataLayer = [];
    (window as any).gtag = vi.fn();
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: false, marketing: false });
  });

  it('does not push to dataLayer when consent.analytics is false', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(0);
  });

  it('drops events and clears the legacy buffer when consent.analytics is false', async () => {
    sessionStorage.setItem('ethoz_pending_events', JSON.stringify([{ event: 'legacy' }]));
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect(sessionStorage.getItem('ethoz_pending_events')).toBeNull();
    expect((window as any).gtag).not.toHaveBeenCalled();
  });

  it('pushes a diagnostic event and a direct gtag event when analytics is granted', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(1);
    expect((window as any).dataLayer[0]).toMatchObject({ event: 'demo_booked', source: 'home' });
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'demo_booked', { source: 'home' });
  });

  it('uses only the canonical gtag command on production hosts', async () => {
    isProductionTrackingHostMock.mockReturnValue(true);
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });

    expect((window as any).dataLayer).toHaveLength(0);
    expect((window as any).gtag).toHaveBeenCalledTimes(1);
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'demo_booked', { source: 'home' });
  });

  it('scrubs PII before sending', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('contact_submit', { email: 'a@b.com', source: 'x' });
    const pushed = (window as any).dataLayer[0];
    expect(pushed).not.toHaveProperty('email');
    expect(pushed.source).toBe('x');
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'contact_submit', { source: 'x' });
  });

  it('never replays a legacy buffer after consent is granted', async () => {
    sessionStorage.setItem(
      'ethoz_pending_events',
      JSON.stringify([{ event: 'legacy_event', payload: { source: 'old' }, at: Date.now() }])
    );
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { flushPendingEvents } = await import('./analytics');
    flushPendingEvents();
    expect((window as any).dataLayer).toHaveLength(0);
    expect((window as any).gtag).not.toHaveBeenCalled();
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
