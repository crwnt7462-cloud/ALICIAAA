/**
 * Configuration CORS sécurisée
 * 
 * RÈGLES:
 * - Pas de wildcard (*) en production
 * - Origins whitelistées via ENV
 * - Logs de sécurité
 */

import cors from 'cors';

function getAllowedOrigins(): string[] {
  const frontOrigin = process.env.FRONT_ORIGIN;
  const additionalOrigins = process.env.ADDITIONAL_CORS_ORIGINS;
  
  const origins: string[] = [];
  
  // Origin principal (requis)
  if (frontOrigin) {
    origins.push(frontOrigin);
  }
  
  // Origins additionnelles (optionnel, séparées par virgules)
  if (additionalOrigins) {
    const additional = additionalOrigins.split(',').map(o => o.trim()).filter(Boolean);
    origins.push(...additional);
  }
  
  // Fallbacks sécurisés par environnement
  if (origins.length === 0) {
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      // Dev: permettre localhost sur ports courants
      origins.push('http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001');
      console.warn('⚠️ cors_fallback_dev', { origins, hint: 'Set FRONT_ORIGIN in environment' });
    } else {
      // Production: JAMAIS de fallback wildcard
      console.error('❌ cors_no_origin_prod', { 
        error: 'FRONT_ORIGIN required in production',
        hint: 'Set FRONT_ORIGIN environment variable'
      });
      // En mode développement, utiliser un fallback
      console.log('🔧 Mode développement: utilisation du fallback CORS');
      return ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];
    }
  }
  
  // En développement, toujours ajouter localhost:3000 pour le debug
  if ((process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) && !origins.includes('http://localhost:3000')) {
    origins.push('http://localhost:3000');
  }
  
  return origins;
}

export function createCorsConfig() {
  const allowedOrigins = getAllowedOrigins();
  
  console.log('🌐 cors_config_init', { 
    allowedOrigins: allowedOrigins.length,
    env: process.env.NODE_ENV,
    wildcard: false 
  });
  
  return {
    origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
      // Permettre requêtes sans origin (ex: Postman, curl, assets)
      if (!origin || origin === 'null') {
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
          console.log('✅ cors_allowed_no_origin_dev', { origin: origin || null });
          return callback(null, true);
        } else {
          console.warn('⚠️ cors_no_origin_prod', { origin: origin || null });
          return callback(new Error('Origin required'), false);
        }
      }
      
      if (allowedOrigins.includes(origin)) {
        console.log('✅ cors_allowed', { origin, allowed: true });
        return callback(null, true);
      }
      
      // En développement, permettre origin: 'null' pour les requêtes sans origin
      if ((process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) && origin === 'null') {
        console.log('✅ cors_allowed_null_dev', { origin });
        return callback(null, true);
      }
      
      console.warn('❌ cors_blocked', { 
        origin, 
        allowed: false,
        allowedOrigins: allowedOrigins.length 
      });
      
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  };
}

/**
 * USAGE dans server/index.ts:
 * 
 * import { createCorsConfig } from './lib/config/cors';
 * 
 * const corsConfig = createCorsConfig();
 * app.use(cors(corsConfig));
 */