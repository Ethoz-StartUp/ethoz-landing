import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('consent store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('defaults to essential-only when no stored value', async () => {
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.essential).toBe(true);
    expect(c.analytics).toBe(false);
    expect(c.marketing).toBe(false);
    expect(c.updatedAt).toBeNull();
  });

  it('persists a decision to localStorage', async () => {
    const { setConsent, getConsent } = await import('./consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const c = getConsent();
    expect(c.analytics).toBe(true);
    expect(c.marketing).toBe(false);
    expect(c.updatedAt).toBeGreaterThan(0);
    const raw = localStorage.getItem('ethoz_consent_v1');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.analytics).toBe(true);
  });

  it('rehydrates from localStorage on import', async () => {
    localStorage.setItem(
      'ethoz_consent_v1',
      JSON.stringify({ essential: true, analytics: true, marketing: false, updatedAt: 1700000000000 })
    );
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.analytics).toBe(true);
    expect(c.updatedAt).toBe(1700000000000);
  });

  it('ignores a malformed localStorage entry and falls back to defaults', async () => {
    localStorage.setItem('ethoz_consent_v1', 'not-json');
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.analytics).toBe(false);
    expect(c.updatedAt).toBeNull();
  });

  it('hasDecided() is false before first decision, true after', async () => {
    const { hasDecided, setConsent } = await import('./consent.svelte');
    expect(hasDecided()).toBe(false);
    setConsent({ analytics: false, marketing: false });
    expect(hasDecided()).toBe(true);
  });

  it('essential is always true and cannot be disabled', async () => {
    const { setConsent, getConsent } = await import('./consent.svelte');
    // @ts-expect-error — type enforces this, runtime check for defensive behavior
    setConsent({ essential: false, analytics: true, marketing: false });
    expect(getConsent().essential).toBe(true);
  });
});
