/**
 * DEPRECATED: Utiliser server/lib/clients/supabaseServer.ts
 * 
 * Ce fichier est maintenu pour compatibilité ascendante.
 * Migration recommandée vers le client sécurisé.
 */

import { supabase as secureSupabase } from './lib/clients/supabaseServer';

// Export de compatibilité
export const supabase = secureSupabase;