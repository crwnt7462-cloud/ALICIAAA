// =============================================================================
// CONFIGURATION PRODUCTION SAAS
// =============================================================================

export const PRODUCTION_CONFIG = {
  // Logging minimal pour production
  enableDetailedLogs: process.env.NODE_ENV === 'development',
  enableStartupMessages: process.env.NODE_ENV === 'development',
  enableFirebaseInstructions: false,
  enableSupabaseInstructions: false,
  
  // Performance
  maxRequestSize: '10mb',
  slowRequestThreshold: 2000, // ms
  
  // Sécurité
  enableCors: true,
  trustProxy: true,
  
  // Business
  defaultSubscriptionPlan: 'basic-pro',
  demoVerificationCode: process.env.NODE_ENV === 'development' ? '123456' : null,
  
  // Base URLs
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:5000',
    
  // Features par plan
  planFeatures: {
    'basic-pro': {
      maxClients: 100,
      maxBookings: 500,
      aiAssistant: false,
      advancedAnalytics: false,
      prioritySupport: false
    },
    'advanced-pro': {
      maxClients: 500,
      maxBookings: 2000,
      aiAssistant: true,
      advancedAnalytics: true,
      prioritySupport: false
    },
    'premium-pro': {
      maxClients: -1, // unlimited
      maxBookings: -1, // unlimited
      aiAssistant: true,
      advancedAnalytics: true,
      prioritySupport: true
    }
  }
};

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
};

export function productionLog(level: string, message: string, data?: any) {
  if (!PRODUCTION_CONFIG.enableDetailedLogs && level === LOG_LEVELS.DEBUG) {
    return;
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  
  if (process.env.NODE_ENV === 'production') {
    // En production, utiliser un service de logging structuré
    console.log(JSON.stringify(logEntry));
  } else {
    // En développement, affichage lisible
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  }
}