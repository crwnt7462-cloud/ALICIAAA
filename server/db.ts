import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error('SUPABASE_URL manquant dans .env');
}
if (!key) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant. Utilise la *Service Role key* (pas l’anon key), dans Project Settings > API.');
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
