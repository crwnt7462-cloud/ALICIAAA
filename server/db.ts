import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configuration robuste de la base de données
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
});

// Gestionnaire d'erreurs global pour éviter les crashes
pool.on('error', (err) => {
  console.error('🔥 Erreur de connexion PostgreSQL:', err.message);
});

export const db = drizzle(pool, { schema });
export { pool };