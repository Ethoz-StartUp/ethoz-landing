import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  captureResourceRequest,
  fetchWithRetryAndTimeout,
  maskEmail,
  saveLead,
} from './marketing';
import { setConsent } from '$lib/stores/consent.svelte';

const baseLead = {
  school_name: 'Colegio Test',
  contact_name: 'Test User',
  contact_role: 'Director',
  contact_email: 'test@example.com',
  status: 'new' as const,
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setConsent({ analytics: false, marketing: false });
});

describe('maskEmail', () => {
  it('masks a typical email', () => {
    expect(maskEmail('alice@example.com')).toBe('al***@example.com');
  });

  it('returns *** when there is no domain', () => {
    expect(maskEmail('noatsign')).toBe('***');
  });
});

describe('fetchWithRetryAndTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resolves immediately on first success', async () => {
    const okResponse = new Response('{"ok":true}', { status: 200 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(okResponse));

    const promise = fetchWithRetryAndTimeout(
      'https://app.test.ethoz.cl/api/marketing/leads',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) },
      { timeoutMs: 10_000, retries: 1 }
    );

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
  });

  it('retries once on network failure then resolves', async () => {
    const okResponse = new Response('{"ok":true}', { status: 200 });
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(okResponse)
    );

    const promise = fetchWithRetryAndTimeout(
      'https://app.test.ethoz.cl/api/marketing/leads',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' },
      { timeoutMs: 10_000, retries: 1 }
    );

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(200);
  });

  it('throws after exhausting all retries', async () => {
    vi.useRealTimers();
    const networkError = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(
      fetchWithRetryAndTimeout(
        'https://app.test.ethoz.cl/api/marketing/leads',
        { method: 'POST' },
        { timeoutMs: 10_000, retries: 1 }
      )
    ).rejects.toThrow('Failed to fetch');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    vi.useFakeTimers();
  });
});

describe('saveLead', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ok:true on success', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    const result = await saveLead(baseLead, 'tok');
    expect(result).toEqual({ ok: true });
  });

  it('posts to the GCP marketing endpoint', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    await saveLead(baseLead, 'tok');

    expect(fetchMock.mock.calls[0][0]).toBe('https://app.test.ethoz.cl/api/marketing/leads');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.kind).toBe('lead');
    expect(body.recaptcha_token).toBe('tok');
    expect(body).not.toHaveProperty('visitor_id');
    expect(body).not.toHaveProperty('utm_source');
  });

  it('returns recaptcha_unavailable without a token', async () => {
    const result = await saveLead(baseLead);
    expect(result).toEqual({ ok: false, error: 'recaptcha_unavailable' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('flags test emails', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    await saveLead({ ...baseLead, contact_email: 'ignacioaraya1995@gmail.com' }, 'tok');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.notes).toBe('[TEST] Internal team');
  });

  it('captures resource requests through the same endpoint', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    const result = await captureResourceRequest('lead@colegio.cl', 'guia-ley-21719');

    expect(result).toEqual({ ok: true });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.kind).toBe('resource');
    expect(body.resource_slug).toBe('guia-ley-21719');
  });

  it('includes visitor ID only with analytics consent', async () => {
    setConsent({ analytics: true, marketing: false });
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    await saveLead(baseLead, 'tok');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.visitor_id).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it('includes attribution only with marketing consent', async () => {
    setConsent({ analytics: false, marketing: true });
    localStorage.setItem(
      'ethoz_attribution_first',
      JSON.stringify({ utm_source: 'linkedin', first_touch_at: '2026-01-01T00:00:00.000Z' })
    );
    fetchMock.mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    await saveLead(baseLead, 'tok');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.utm_source).toBe('linkedin');
    expect(body).not.toHaveProperty('visitor_id');
  });
});
