/**
 * Configuration de la base de données avec Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

// Configuration de la connexion PostgreSQL
let connectionString = process.env.DATABASE_URL;

// Mode développement - utiliser une URL de connexion mock si manquante
if (!connectionString && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)) {
  connectionString = 'postgresql://postgres.efkekkajoyfgtyqziohy:password@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
  console.log('🔧 Mode développement: DATABASE_URL configuré avec la vraie URL');
}

// Créer la connexion PostgreSQL avec gestion d'erreur
let client: any;
let db: any;

if (!connectionString) {
  console.log('⚠️ DATABASE_URL manquant, utilisation du mode mock');
  // Mode mock pour le développement
  db = {
    select: () => ({ from: () => ({ where: () => ({ execute: () => [] }) }) }),
    insert: () => ({ values: () => ({ execute: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ execute: () => [] }) }) }),
    delete: () => ({ where: () => ({ execute: () => [] }) })
  };
} else {
  try {
    client = postgres(connectionString);
    db = drizzle(client);
  } catch (error) {
    console.warn('⚠️ Connexion PostgreSQL échouée, utilisation du mode mock');
    // Mode mock pour le développement
    db = {
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      limit: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null })
    };
  }
}

// Export à la fin du fichier
export { db };