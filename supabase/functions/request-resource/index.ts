/**
 * request-resource — Capture an email in exchange for a PDF resource.
 *
 * Soft-gate: the client always delivers the PDF locally; this endpoint
 * is called fire-and-forget to persist the email as a warm lead.
 *
 * Deploy:
 *   supabase functions deploy request-resource --project-ref <ref>
 *
 * Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GA4_MEASUREMENT_ID (optional), GA4_API_SECRET (optional)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendGa4Event } from '../_shared/ga4.ts';

interface RequestPayload {
  email: string;
  resource_slug: string;
  visitor_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  return `${user.slice(0, 2)}***@${domain}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload: RequestPayload = await req.json();
    const email = (payload.email || '').trim().toLowerCase();
    const slug = (payload.resource_slug || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !slug) {
      return json({ error: 'Missing or invalid email/resource_slug' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error: insertError } = await supabase.from('leads').insert([
      {
        school_name: '',
        contact_name: email.split('@')[0],
        contact_role: 'resource_download',
        contact_email: email,
        contact_source: `resource:${slug}`,
        notes: `Resource download: ${slug}`,
        status: 'new',
        visitor_id: payload.visitor_id || null,
        utm_source: payload.utm_source || null,
        utm_medium: payload.utm_medium || null,
        utm_campaign: payload.utm_campaign || null,
        utm_content: payload.utm_content || null,
        utm_term: payload.utm_term || null,
        gclid: payload.gclid || null,
        fbclid: payload.fbclid || null,
        referrer: payload.referrer || null,
        landing_page: payload.landing_page || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('[request-resource] Insert error:', insertError.message);
      return json({ error: 'Failed to save request' }, 500);
    }

    if (payload.visitor_id) {
      sendGa4Event(payload.visitor_id, {
        name: 'resource_downloaded',
        params: {
          resource_slug: slug,
          utm_source: payload.utm_source || '',
          utm_medium: payload.utm_medium || '',
        },
      }).catch(() => {});
    }

    console.info(`[request-resource] Saved ${slug} → ${maskEmail(email)}`);
    return json({ ok: true, delivered_to: maskEmail(email) });
  } catch (err) {
    console.error('[request-resource] Unexpected error:', err);
    return json({ error: 'Internal error' }, 500);
  }
});
