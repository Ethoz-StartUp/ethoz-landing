import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const supabaseUrl = env.PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface Lead {
  school_name: string;
  school_rbd?: number;
  school_commune?: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone?: string;
  contact_source?: string;
  status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_done' | 'closed';
  created_at?: string;
}

export async function saveLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    console.warn('[Leads] Supabase not configured, lead not saved:', lead);
    return { ok: false, error: 'Supabase not configured' };
  }

  const { error } = await supabase.from('leads').insert([{
    ...lead,
    status: lead.status ?? 'new',
    created_at: new Date().toISOString(),
  }]);

  if (error) {
    console.error('[Leads] Failed to save:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
