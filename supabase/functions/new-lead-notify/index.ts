/**
 * New Lead Email Notification
 *
 * Called by Supabase Database Webhook on INSERT to leads table.
 * Sends an email notification to the team when a new lead arrives.
 *
 * Deploy:
 *   supabase functions deploy new-lead-notify --project-ref irpesrcijcdwyjxxwpyb
 *
 * Then configure Database Webhook in Supabase Dashboard:
 *   Database → Webhooks → Create → Table: leads, Events: INSERT
 *   URL: https://irpesrcijcdwyjxxwpyb.supabase.co/functions/v1/new-lead-notify
 *   Headers: Authorization: Bearer <SUPABASE_ANON_KEY>
 */

const NOTIFY_EMAIL = 'contacto@ethoz.cl';
const FROM_EMAIL = 'leads@ethoz.cl';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload = await req.json();

    // Supabase webhook payload: { type: 'INSERT', table: 'leads', record: {...}, ... }
    const record = payload.record ?? payload;

    const schoolName = record.school_name || 'Sin colegio';
    const contactName = record.contact_name || 'Sin nombre';
    const contactEmail = record.contact_email || 'Sin email';
    const contactPhone = record.contact_phone || 'No proporcionado';
    const contactRole = record.contact_role || 'No especificado';
    const source = record.contact_source || 'directo';
    const notes = record.notes || '';
    const isTest = notes.includes('[TEST]');
    const visitorId = record.visitor_id || '';

    // Skip test leads
    if (isTest) {
      return new Response(JSON.stringify({ ok: true, skipped: 'test lead' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format email body
    const subject = `🎯 Nuevo lead: ${contactName} — ${schoolName}`;
    const body = `
Nuevo lead en Ethoz
════════════════════

Contacto: ${contactName}
Email: ${contactEmail}
Teléfono: ${contactPhone}
Cargo: ${contactRole}

Colegio: ${schoolName}
RBD: ${record.school_rbd || 'N/A'}
Comuna: ${record.school_commune || 'N/A'}

Fuente: ${source}
Fecha: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}
${notes && !isTest ? `Notas: ${notes}` : ''}
${visitorId ? `Visitor ID: ${visitorId} (buscar en GA4/Clarity)` : ''}

════════════════════
Responder a: ${contactEmail}
Ver en Supabase: https://supabase.com/dashboard/project/irpesrcijcdwyjxxwpyb/editor/leads
`.trim();

    // Send via Resend API if key is available
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Ethoz Leads <${FROM_EMAIL}>`,
          to: [NOTIFY_EMAIL],
          reply_to: contactEmail,
          subject,
          text: body,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('[new-lead-notify] Resend error:', err);
        // Don't fail — lead is already saved
      } else {
        console.info(`[new-lead-notify] Email sent for ${contactEmail}`);
      }
    } else {
      // Fallback: log to console (visible in Supabase Edge Function logs)
      console.info(`[new-lead-notify] No RESEND_API_KEY — logging lead:`);
      console.info(body);
    }

    return new Response(JSON.stringify({ ok: true, lead: contactEmail }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[new-lead-notify] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
