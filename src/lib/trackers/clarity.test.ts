import { beforeEach, describe, expect, it, vi } from 'vitest';

function mockHostname(hostname: string): void {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { hostname },
  });
}

async function setup(consent = true, hostname = 'ethoz.cl') {
  vi.resetModules();
  vi.doMock('$env/dynamic/public', () => ({
    env: { PUBLIC_CLARITY_PROJECT_ID: 'clarity-test' },
  }));
  document.head.querySelectorAll('script').forEach((script) => script.remove());
  localStorage.clear();
  sessionStorage.clear();
  mockHostname(hostname);
  delete (window as any).clarity;
  const { setConsent } = await import('$lib/stores/consent.svelte');
  setConsent({ analytics: consent, marketing: false });
  return import('./clarity');
}

describe('Clarity tracker', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('queues ConsentV2 before inserting the production script', async () => {
    const { loadClarity } = await setup();
    expect(loadClarity({ analytics: true, marketing: false })).toBe(true);
    expect(document.querySelector<HTMLScriptElement>('#ethoz-clarity-script')?.src)
      .toContain('clarity.ms/tag/clarity-test');
    expect((window as any).clarity.q[0]).toEqual([
      'consentv2',
      { ad_Storage: 'denied', analytics_Storage: 'granted' },
    ]);
  });

  it('does not load off production or without analytics consent', async () => {
    let tracker = await setup(true, 'localhost');
    expect(tracker.loadClarity({ analytics: true, marketing: false })).toBe(false);
    expect(document.querySelector('#ethoz-clarity-script')).toBeNull();

    tracker = await setup(false, 'ethoz.cl');
    expect(tracker.loadClarity({ analytics: false, marketing: false })).toBe(false);
    expect(document.querySelector('#ethoz-clarity-script')).toBeNull();
  });

  it('updates both Clarity storage categories', async () => {
    const { updateClarityConsent } = await setup();
    const clarity = vi.fn();
    (window as any).clarity = clarity;
    updateClarityConsent({ analytics: true, marketing: true });
    expect(clarity).toHaveBeenCalledWith('consentv2', {
      ad_Storage: 'granted',
      analytics_Storage: 'granted',
    });
  });

  it('reapplies consent when the script is already loaded', async () => {
    const { loadClarity } = await setup();
    expect(loadClarity({ analytics: true, marketing: false })).toBe(true);
    const clarity = vi.fn();
    (window as any).clarity = clarity;

    expect(loadClarity({ analytics: true, marketing: true })).toBe(true);
    expect(clarity).toHaveBeenCalledWith('consentv2', {
      ad_Storage: 'granted',
      analytics_Storage: 'granted',
    });
    expect(document.querySelectorAll('#ethoz-clarity-script')).toHaveLength(1);
  });

  it('removes an in-flight script when analytics consent is revoked', async () => {
    const { loadClarity, revokeClarityConsent } = await setup();
    expect(loadClarity({ analytics: true, marketing: false })).toBe(true);
    expect(document.querySelector('#ethoz-clarity-script')).not.toBeNull();

    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: false, marketing: false });
    revokeClarityConsent();

    expect(document.querySelector('#ethoz-clarity-script')).toBeNull();
  });

  it('revokes consent, ends the session, and removes first-party cookies', async () => {
    const { revokeClarityConsent } = await setup();
    const clarity = vi.fn();
    (window as any).clarity = clarity;
    document.cookie = '_clck=test; path=/';
    document.cookie = '_clsk=test; path=/';
    revokeClarityConsent();
    expect(clarity).toHaveBeenNthCalledWith(1, 'consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: 'denied',
    });
    expect(clarity).toHaveBeenNthCalledWith(2, 'consent', false);
    expect(document.cookie).not.toContain('_clck=');
    expect(document.cookie).not.toContain('_clsk=');
  });
});
