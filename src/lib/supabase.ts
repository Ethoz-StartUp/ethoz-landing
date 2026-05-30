import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { isInternal, isTestEmail } from '$lib/utils/internal';
import { getVisitorId } from '$lib/utils/visitor';
import { getDeviceMetadata } from '$lib/utils/device';
import { readAttribution } from '$lib/utils/attribution';
import { log } from '$lib/utils/logger';

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  return `${user.slice(0, 2)}***@${domain}`;
}

function captureError(err: unknown, context?: Record<string, unknown>): void {
  import('@sentry/browser').then(Sentry => {
    Sentry.captureException(err, { extra: context });
  }).catch(() => {});
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
      import('@sentry/browser').then(Sentry => {
        Sentry.addBreadcrumb({
          category: 'fetch',
          message: `${context} attempt ${attempt + 1}/${retries + 1}`,
          level: 'info',
          data: { url, attempt: attempt + 1 }
        });
      }).catch(() => {});

      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      const elapsed = Date.now() - started;

      import('@sentry/browser').then(Sentry => {
        Sentry.addBreadcrumb({
          category: 'fetch',
          message: `${context} attempt ${attempt + 1} failed`,
          level: 'warning',
          data: { url, attempt: attempt + 1, elapsed_ms: elapsed, error: String(err) }
        });
      }).catch(() => {});

      if (attempt < retries) {
        const backoffMs = 500 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, backoffMs));
        continue;
      }
    }
  }

  throw lastError;
}

const supabaseUrl = env.PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (supabase) {
  log.info('[Supabase] ✔ Client initialized —', supabaseUrl);
} else {
  log.warn('[Supabase] ✘ NOT configured — missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
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

/** Update the most recent lead with this email to a new status (client-side fallback) */
export async function updateLeadStatus(
  email: string,
  status: Lead['status'],
  notes?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured' };

  try {
    // Find the most recent lead with this email that hasn't been scheduled yet
    const { data: leads, error: selectError } = await supabase
      .from('leads')
      .select('id, status')
      .eq('contact_email', email)
      .in('status', ['new', 'contacted'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError || !leads?.length) {
      return { ok: false, error: selectError?.message ?? 'Lead not found' };
    }

    // Idempotent: skip if already at target status
    if (leads[0].status === status) return { ok: true };

    const updatePayload: Record<string, string> = { status };
    if (notes) updatePayload.notes = notes;

    const { error } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', leads[0].id);

    if (error) {
      log.error('[Leads] Status update failed:', error.message);
      return { ok: false, error: error.message };
    }

    log.info(`[Leads] Lead ${leads[0].id} → ${status}`);
    return { ok: true };
  } catch (err) {
    log.error('[Leads] updateLeadStatus error:', err);
    captureError(err, { fn: 'updateLeadStatus', email: maskEmail(email) });
    return { ok: false, error: String(err) };
  }
}

export async function saveLead(lead: Lead, recaptchaToken?: string | null): Promise<{ ok: boolean; error?: string }> {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;

  // Flag internal/test leads
  const test = isInternal() || isTestEmail(lead.contact_email);
  const notes = test ? '[TEST] Internal team' : lead.notes;

  const visitor_id = getVisitorId() || undefined;
  const metadata = getDeviceMetadata();
  const attribution = readAttribution();

  const payload = {
    ...lead,
    ...attribution,
    status: lead.status ?? 'new',
    notes,
    visitor_id,
    metadata,
    recaptcha_token: recaptchaToken || undefined,
  };

  // Use server-side verified endpoint if reCAPTCHA token is provided
  if (recaptchaToken && supabaseUrl) {
    try {
      const res = await fetchWithRetryAndTimeout(
        `${supabaseUrl}/functions/v1/verify-lead`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
        { timeoutMs: 10_000, retries: 1 },
        'verify-lead'
      );

      const data = await res.json();

      if (!res.ok) {
        log.error('[Leads] ✘ Verify-lead failed:', data.error, { lead: { school: lead.school_name, email: maskEmail(lead.contact_email) } });
        captureError(new Error(data.error), { fn: 'saveLead', school: lead.school_name, email: maskEmail(lead.contact_email) });
        return { ok: false, error: data.error };
      }

      log.info('[Leads] ✔ Lead saved (verified):', { school: lead.school_name, email: maskEmail(lead.contact_email), source: lead.contact_source });
      return { ok: true };
    } catch (err) {
      log.error('[Leads] ✘ Verify-lead error:', err);
      captureError(err, { fn: 'saveLead', school: lead.school_name, email: maskEmail(lead.contact_email) });
      return { ok: false, error: String(err) };
    }
  }

  // No direct-insert fallback: the leads table has no anon insert policy (migration 005),
  // so the verify-lead Edge Function is the only write path.
  if (!supabase) {
    log.warn('[Leads] Supabase not configured, lead not saved:', lead);
    return { ok: false, error: 'Supabase not configured' };
  }

  // Reached here with a configured client but no reCAPTCHA token (e.g. adblocker/network
  // blocked reCAPTCHA). Surface this explicitly instead of attempting a doomed anon insert.
  log.warn('[Leads] ✘ Lead not saved — reCAPTCHA token unavailable:', { school: lead.school_name, email: maskEmail(lead.contact_email) });
  return { ok: false, error: 'recaptcha_unavailable' };
}
