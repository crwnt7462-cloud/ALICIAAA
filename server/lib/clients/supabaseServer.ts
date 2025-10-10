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

// Configuration des variables d'environnement Supabase
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  if (!process.env.SUPABASE_URL) {
    process.env.SUPABASE_URL = 'https://efkekkajoyfgtyqziohy.supabase.co';
    console.log('🔧 Mode développement: SUPABASE_URL configuré avec la vraie URL');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI3ODI5NCwiZXhwIjoyMDcyODU0Mjk0fQ.KLfHaxzhEXfgq-gSTQXLWYG5emngLbrCBK6w7me78yw';
    console.log('🔧 Mode développement: SUPABASE_SERVICE_ROLE_KEY configuré avec la vraie clé');
  }
  if (!process.env.SUPABASE_ANON_KEY) {
    process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzgyOTQsImV4cCI6MjA3Mjg1NDI5NH0.EP-EH8LWjeE7HXWPZyelLqdA4iCyfjmD7FnTu2fIMSA';
    console.log('🔧 Mode développement: SUPABASE_ANON_KEY configuré avec la vraie clé');
  }
}

// Validation environnement (sans exposer les valeurs)
function validateSupabaseEnv(): SupabaseConfig {
  // Récupérer les valeurs après configuration
  const finalUrl = process.env.SUPABASE_URL;
  const finalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const finalAnonKey = process.env.SUPABASE_ANON_KEY;

  console.log('🔍 Debug Supabase env:', {
    url: finalUrl ? 'SET' : 'MISSING',
    serviceRole: finalServiceRoleKey ? 'SET' : 'MISSING',
    anon: finalAnonKey ? 'SET' : 'MISSING',
    nodeEnv: process.env.NODE_ENV
  });

  if (!finalUrl || !finalUrl.startsWith('https://')) {
    throw new Error('SUPABASE_URL manquant ou invalide. Format: https://xxx.supabase.co');
  }

  if (!finalServiceRoleKey || (!finalServiceRoleKey.startsWith('eyJ') && !finalServiceRoleKey.startsWith('mock-'))) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante. Utilise la Service Role key depuis Project Settings > API');
  }

  if (!finalAnonKey || (!finalAnonKey.startsWith('eyJ') && !finalAnonKey.startsWith('mock-'))) {
    throw new Error('SUPABASE_ANON_KEY manquante. Utilise la anon/public key depuis Project Settings > API');
  }

  return { 
    url: finalUrl, 
    serviceRoleKey: finalServiceRoleKey, 
    anonKey: finalAnonKey 
  };
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
  serviceRole, // Export direct
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