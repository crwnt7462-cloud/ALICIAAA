import { createClient } from '@supabase/supabase-js';

export function assertSupabaseEnv() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY in env');
    }
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }
}

export function getSupabaseForJwt(jwt?: string | null) {
  assertSupabaseEnv();
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      }
    }
  );
}
