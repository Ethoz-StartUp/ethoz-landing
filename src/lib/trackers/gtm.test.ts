import { beforeEach, describe, expect, it, vi } from 'vitest';

function mockHostname(hostname: string): void {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { hostname },
  });
}

async function setup(consent = true, hostname = 'ethoz.cl') {
  vi.resetModules();
  document.head.querySelectorAll('script').forEach((script) => script.remove());
  localStorage.clear();
  sessionStorage.clear();
  mockHostname(hostname);
  (window as any).dataLayer = [];
  (window as any).gtag = vi.fn();
  const { setConsent } = await import('$lib/stores/consent.svelte');
  setConsent({ analytics: consent, marketing: false });
  return import('./gtm');
}

describe('GTM tracker', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('loads only once and emits the standard GTM bootstrap event', async () => {
    const { getGtmLoadState, loadGtm } = await setup();
    const first = loadGtm();
    const second = loadGtm();
    const script = document.querySelector<HTMLScriptElement>('#ethoz-gtm-script');

    expect(script?.src).toContain('googletagmanager.com/gtm.js?id=GTM-WX6ZCXLZ');
    expect(document.querySelectorAll('#ethoz-gtm-script')).toHaveLength(1);
    expect((window as any).dataLayer).toHaveLength(1);
    expect((window as any).dataLayer[0]).toMatchObject({ event: 'gtm.js' });
    expect((window as any).dataLayer[0]['gtm.start']).toEqual(expect.any(Number));
    expect(getGtmLoadState()).toBe('loading');

    script?.dispatchEvent(new Event('load'));
    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(true);
    expect(getGtmLoadState()).toBe('loaded');
  });

  it('does not load off production or without analytics consent', async () => {
    let tracker = await setup(true, 'localhost');
    await expect(tracker.loadGtm()).resolves.toBe(false);
    expect(document.querySelector('#ethoz-gtm-script')).toBeNull();

    tracker = await setup(false, 'ethoz.cl');
    await expect(tracker.loadGtm()).resolves.toBe(false);
    expect(document.querySelector('#ethoz-gtm-script')).toBeNull();
  });

  it('retries once after a load error without duplicating the bootstrap event', async () => {
    vi.useFakeTimers();
    const { loadGtm } = await setup();
    const result = loadGtm();
    document.querySelector<HTMLScriptElement>('#ethoz-gtm-script')?.dispatchEvent(new Event('error'));
    await vi.advanceTimersByTimeAsync(750);

    const retry = document.querySelector<HTMLScriptElement>('#ethoz-gtm-script');
    expect(retry).not.toBeNull();
    expect((window as any).dataLayer.filter((item: any) => item.event === 'gtm.js')).toHaveLength(1);
    retry?.dispatchEvent(new Event('load'));
    await expect(result).resolves.toBe(true);
  });

  it('cancels an in-flight load immediately when analytics consent is revoked', async () => {
    const { cancelPendingGtmLoad, getGtmLoadState, loadGtm } = await setup();
    const result = loadGtm();
    expect(document.querySelector('#ethoz-gtm-script')).not.toBeNull();
    expect(getGtmLoadState()).toBe('loading');

    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: false, marketing: false });
    cancelPendingGtmLoad();

    expect(document.querySelector('#ethoz-gtm-script')).toBeNull();
    expect((window as any).dataLayer.filter((item: any) => item.event === 'gtm.js')).toHaveLength(0);
    expect(getGtmLoadState()).toBe('idle');
    await expect(result).resolves.toBe(false);
  });

  it('maps analytics and marketing choices to all Consent Mode v2 fields', async () => {
    const { updateGoogleConsent } = await setup();
    updateGoogleConsent({ analytics: true, marketing: false });
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    expect((window as any).gtag).toHaveBeenCalledWith('set', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ignore_referrer: true,
    });
  });

  it('deletes Google analytics and advertising cookies after revocation', async () => {
    const { clearGoogleTrackingCookies } = await setup();
    document.cookie = '_ga=test; path=/';
    document.cookie = '_gcl_au=test; path=/';
    clearGoogleTrackingCookies({ analytics: false, marketing: false });
    expect(document.cookie).not.toContain('_ga=');
    expect(document.cookie).not.toContain('_gcl_au=');
  });
});
