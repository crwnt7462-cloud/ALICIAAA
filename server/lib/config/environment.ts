/**
 * Validation environnement serveur - SÉCURISÉ
 * 
 * Valide que toutes les variables requises sont présentes
 * SANS JAMAIS logger les valeurs sensibles
 */

interface EnvironmentValidation {
  isValid: boolean;
  missing: string[];
  mode: 'mock' | 'database' | 'production';
  warnings: string[];
}

// Variables requises selon le mode
const REQUIRED_VARS = {
  // Toujours requis
  base: ['NODE_ENV', 'PORT'],
  
  // Requis pour mode database
  database: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY'],
  
  // Requis pour production
  production: ['FRONT_ORIGIN'],
  
  // Optionnelles avec warnings
  optional: ['ENABLE_DIAG_ROUTES', 'ADDITIONAL_CORS_ORIGINS']
};

export function validateEnvironment(): EnvironmentValidation {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Déterminer le mode d'exécution
  const useMockDb = process.env.USE_MOCK_DB === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  
  let mode: EnvironmentValidation['mode'] = 'mock';
  if (!useMockDb) {
    mode = isProduction ? 'production' : 'database';
  }
  
  // Validation variables de base
  REQUIRED_VARS.base.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // Validation selon le mode
  if (mode === 'database' || mode === 'production') {
    REQUIRED_VARS.database.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
  }
  
  if (mode === 'production') {
    REQUIRED_VARS.production.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    // En production, forcer mocks OFF
    if (useMockDb) {
      warnings.push('USE_MOCK_DB=true in production - this should be false');
    }
  }
  
  // Validation optionnelles
  REQUIRED_VARS.optional.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`${varName} not set - using defaults`);
    }
  });
  
  const isValid = missing.length === 0;
  
  return {
    isValid,
    missing,
    mode,
    warnings
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  if (validation.isValid) {
    console.log('✅ server_boot_env_ok', {
      mode: validation.mode,
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mockDb: process.env.USE_MOCK_DB === 'true',
      diagnosticRoutes: process.env.ENABLE_DIAG_ROUTES === 'true'
    });
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ server_boot_env_warnings', {
        warnings: validation.warnings
      });
    }
  } else {
    console.error('❌ server_boot_fail_env', {
      missing: validation.missing,
      mode: validation.mode,
      hint: 'Check environment variables. See .env.example for reference'
    });
    
    // Arrêter en production si env invalide
    if (process.env.NODE_ENV === 'production') {
      console.error('💀 server_boot_exit_prod', { 
        reason: 'Invalid environment in production' 
      });
      process.exit(1);
    }
  }
}

/**
 * USAGE dans server/index.ts:
 * 
 * import { logEnvironmentStatus, validateEnvironment } from './lib/config/environment';
 * 
 * // Au boot
 * logEnvironmentStatus();
 * 
 * // Pour tests conditionnels
 * const env = validateEnvironment();
 * if (env.mode === 'database') { ... }
 */