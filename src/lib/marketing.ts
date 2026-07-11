import { env } from '$env/dynamic/public';
import { isInternal, isTestEmail } from '$lib/utils/internal';
import { getVisitorId } from '$lib/utils/visitor';
import { getDeviceMetadata } from '$lib/utils/device';
import { readAttribution } from '$lib/utils/attribution';
import { log } from '$lib/utils/logger';
import { addBreadcrumb, captureException } from '$lib/sentry';
import { getConsent } from '$lib/stores/consent.svelte';

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  return `${user.slice(0, 2)}***@${domain}`;
}

function captureError(err: unknown, context?: Record<string, unknown>): void {
  captureException(err, context);
}

export async function fetchWithRetryAndTimeout(
  url: string,
  init: RequestInit,
  opts: { timeoutMs?: number; retries?: number } = {},
  context = 'fetch'
): Promise<Response> {
  const { timeoutMs = 10_000, retries = 1 } = opts;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      addBreadcrumb({
        category: 'fetch',
        message: `${context} attempt ${attempt + 1}/${retries + 1}`,
        level: 'info',
        data: { url, attempt: attempt + 1 }
      });

      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      const elapsed = Date.now() - started;

      addBreadcrumb({
        category: 'fetch',
        message: `${context} attempt ${attempt + 1} failed`,
        level: 'warning',
        data: { url, attempt: attempt + 1, elapsed_ms: elapsed, error: String(err) }
      });

      if (attempt < retries) {
        const backoffMs = 500 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, backoffMs));
        continue;
      }
    }
  }

  throw lastError;
}

export interface Lead {
  id?: string;
  school_name: string;
  school_rbd?: number;
  school_commune?: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone?: string;
  contact_source?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_done' | 'closed';
  metadata?: Record<string, unknown>;
  visitor_id?: string;
  created_at?: string;
  updated_at?: string;
}

function marketingEndpoint(): string {
  const base = (env.PUBLIC_MARKETING_API_URL ?? 'https://app.ethoz.cl').trim().replace(/\/+$/, '');
  return `${base}/api/marketing/leads`;
}

async function postMarketingPayload(
  payload: Record<string, unknown>,
  context: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetchWithRetryAndTimeout(
      marketingEndpoint(),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      { timeoutMs: 10_000, retries: 1 },
      context
    );

    const data = await res.json().catch(() => ({})) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? `http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function saveLead(lead: Lead, recaptchaToken?: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!recaptchaToken) {
    log.warn('[Leads] Lead not saved: reCAPTCHA token unavailable', {
      school: lead.school_name,
      email: maskEmail(lead.contact_email),
    });
    return { ok: false, error: 'recaptcha_unavailable' };
  }

  const test = isInternal() || isTestEmail(lead.contact_email);
  const notes = test ? '[TEST] Internal team' : lead.notes;
  const consent = getConsent();

  const payload = {
    kind: 'lead',
    ...lead,
    ...(consent.marketing ? readAttribution() : {}),
    status: lead.status ?? 'new',
    notes,
    visitor_id: consent.analytics ? (getVisitorId() || undefined) : undefined,
    metadata: getDeviceMetadata({ includeMarketingAttribution: consent.marketing }),
    recaptcha_token: recaptchaToken,
  };

  const result = await postMarketingPayload(payload, 'marketing-lead');
  if (!result.ok) {
    log.error('[Leads] Lead save failed:', result.error, {
      lead: { school: lead.school_name, email: maskEmail(lead.contact_email) },
    });
    captureError(new Error(result.error ?? 'Lead save failed'), {
      fn: 'saveLead',
      school: lead.school_name,
      email: maskEmail(lead.contact_email),
    });
    return result;
  }

  log.info('[Leads] Lead saved:', {
    school: lead.school_name,
    email: maskEmail(lead.contact_email),
    source: lead.contact_source,
  });
  return { ok: true };
}

export async function captureResourceRequest(
  email: string,
  resourceSlug: string
): Promise<{ ok: boolean; error?: string }> {
  const consent = getConsent();
  const payload = {
    kind: 'resource',
    contact_email: email,
    resource_slug: resourceSlug,
    contact_source: `resource:${resourceSlug}`,
    ...(consent.marketing ? readAttribution() : {}),
    visitor_id: consent.analytics ? (getVisitorId() || undefined) : undefined,
    metadata: getDeviceMetadata({ includeMarketingAttribution: consent.marketing }),
  };

  const result = await postMarketingPayload(payload, 'marketing-resource');
  if (!result.ok) {
    log.warn('[Resources] Request capture failed:', {
      error: result.error,
      email: maskEmail(email),
      resource: resourceSlug,
    });
  }
  return result;
}
