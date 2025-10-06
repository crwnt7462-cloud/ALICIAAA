/**
 * Configuration client Supabase serveur - SÉCURISÉ
 * 
 * RÈGLES DE SÉCURITÉ:
 * - JAMAIS de secrets en clair dans le code
 * - Variables d'environnement obligatoires validées au boot
 * - Service role KEY uniquement côté serveur
 * - Logs sans secrets
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Types pour validation stricte
interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
}

// Validation environnement (sans exposer les valeurs)
function validateSupabaseEnv(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  // Validation URLs
  if (!url || !url.startsWith('https://')) {
    throw new Error('SUPABASE_URL manquant ou invalide. Format: https://xxx.supabase.co');
  }

  // Service role key requise pour opérations serveur
  if (!serviceRoleKey || !serviceRoleKey.startsWith('eyJ')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante. Utilise la Service Role key depuis Project Settings > API');
  }

  // Anon key requise pour opérations publiques
  if (!anonKey || !anonKey.startsWith('eyJ')) {
    throw new Error('SUPABASE_ANON_KEY manquante. Utilise la anon/public key depuis Project Settings > API');
  }

  return { url, serviceRoleKey, anonKey };
}

// Configuration selon mode d'exécution
function initializeSupabaseClients() {
  const useMockDb = process.env.USE_MOCK_DB === 'true';
  
  // En mode mock, on peut skipper la validation Supabase
  if (useMockDb) {
    console.log('🔧 server_boot_mock_mode', { source: 'mock', supabase: 'skipped' });
    return {
      serviceRole: null,
      public: null,
      config: { projectHost: 'mock-mode', useMock: true }
    };
  }

  try {
    const config = validateSupabaseEnv();
    
    // Client service role (écritures, admin)
    const serviceRole = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Client public/anon (lectures publiques)
    const publicClient = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Extraire host du projet (sans secrets)
    const projectHost = config.url.replace('https://', '').replace('.supabase.co', '');
    
    console.log('✅ server_boot_supabase_ok', { 
      projectHost, 
      useMock: false,
      serviceRoleConfigured: true,
      anonConfigured: true 
    });

    return {
      serviceRole,
      public: publicClient,
      config: { projectHost, useMock: false }
    };

  } catch (error) {
    console.error('❌ server_boot_fail_env', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY in environment'
    });
    
    // En production, forcer l'arrêt si DB mal configurée
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    throw error;
  }
}

// Export des clients initialisés
const { serviceRole, public: publicClient, config } = initializeSupabaseClients();

export { 
  serviceRole as supabase, // Compatibilité avec import existant 
  publicClient as supabasePublic,
  config as supabaseConfig
};

/**
 * USAGE:
 * 
 * // Pour opérations admin/serveur (CREATE, UPDATE, DELETE)
 * import { supabase } from './lib/clients/supabaseServer';
 * 
 * // Pour lectures publiques (SELECT avec RLS)
 * import { supabasePublic } from './lib/clients/supabaseServer';
 * 
 * // Pour config/logs
 * import { supabaseConfig } from './lib/clients/supabaseServer';
 */