import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockLocation(url: string) {
  const u = new URL(url);
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      href: u.href,
      search: u.search,
      pathname: u.pathname,
      hostname: u.hostname,
      origin: u.origin,
    },
  });
}

function mockReferrer(ref: string) {
  Object.defineProperty(document, 'referrer', { configurable: true, get: () => ref });
}

describe('attribution', () => {
  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    sessionStorage.clear();
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: false, marketing: true });
  });

  it('captureAttribution parses UTMs from the URL and persists to both storages', async () => {
    mockLocation('https://ethoz.cl/?utm_source=linkedin&utm_medium=cpc&utm_campaign=q2');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.utm_source).toBe('linkedin');
    expect(a.utm_medium).toBe('cpc');
    expect(a.utm_campaign).toBe('q2');
    expect(a.landing_page).toBe('/');
    expect(a.first_touch_at).toBeTruthy();
    expect(a.last_touch_at).toBeTruthy();
  });

  it('captures ad click ids (gclid, fbclid, li_fat_id, msclkid)', async () => {
    mockLocation('https://ethoz.cl/demo?gclid=abc&fbclid=def&li_fat_id=ghi&msclkid=jkl');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.gclid).toBe('abc');
    expect(a.fbclid).toBe('def');
    expect(a.li_fat_id).toBe('ghi');
    expect(a.msclkid).toBe('jkl');
  });

  it('first-touch wins for utm_* across multiple captures; last-touch wins for landing_page', async () => {
    mockLocation('https://ethoz.cl/?utm_source=google');
    mockReferrer('https://google.com/');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();

    mockLocation('https://ethoz.cl/contacto?utm_source=linkedin');
    captureAttribution();

    const a = readAttribution();
    expect(a.utm_source).toBe('google'); // first-touch wins
    expect(a.referrer).toBe('https://google.com/'); // first-touch wins, query-free
    expect(a.landing_page).toBe('/contacto'); // last-touch wins
  });

  it('returns empty object when URL has no UTMs and referrer is empty', async () => {
    mockLocation('https://ethoz.cl/blog');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.utm_source).toBeUndefined();
    expect(a.landing_page).toBe('/blog');
    expect(a.first_touch_at).toBeTruthy();
  });

  it('captures referrer only when cross-origin', async () => {
    mockLocation('https://ethoz.cl/');
    mockReferrer('https://ethoz.cl/blog/foo');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    expect(readAttribution().referrer).toBeUndefined();
  });

  it('never throws if localStorage is disabled', async () => {
    mockLocation('https://ethoz.cl/?utm_source=linkedin');
    mockReferrer('');
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('quota');
    };
    try {
      const { captureAttribution, readAttribution } = await import('./attribution');
      expect(() => captureAttribution()).not.toThrow();
      expect(() => readAttribution()).not.toThrow();
    } finally {
      Storage.prototype.setItem = orig;
    }
  });

  it('does not capture or retain attribution without marketing consent', async () => {
    localStorage.setItem('ethoz_attribution_first', JSON.stringify({ utm_source: 'legacy' }));
    sessionStorage.setItem('ethoz_attribution_last', JSON.stringify({ utm_source: 'legacy' }));
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    mockLocation('https://ethoz.cl/?utm_source=linkedin');

    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();

    expect(readAttribution()).toEqual({});
    expect(localStorage.getItem('ethoz_attribution_first')).toBeNull();
    expect(sessionStorage.getItem('ethoz_attribution_last')).toBeNull();
  });

  it('strips campaign identifiers from the visible URL without removing unrelated params', async () => {
    mockLocation('https://ethoz.cl/demo?utm_source=linkedin&gclid=abc&school=2454#form');
    const replaceState = vi.spyOn(history, 'replaceState').mockImplementation(() => {});
    const { stripAttributionFromUrl } = await import('./attribution');

    stripAttributionFromUrl();

    expect(replaceState).toHaveBeenCalledWith(history.state, '', '/demo?school=2454#form');
  });
});
