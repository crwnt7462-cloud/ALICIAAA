#!/usr/bin/env node

/**
 * Script de vérification de connexion DB - SÉCURISÉ
 * 
 * Test la connexion Supabase sans exposer de secrets
 * Usage: node scripts/check_db.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function checkDatabaseConnection() {
  console.log('🔍 Database connection check starting...');
  
  const useMockDb = process.env.USE_MOCK_DB === 'true';
  
  if (useMockDb) {
    console.log('✅ db_check_mock_mode', { 
      status: 'ok',
      mode: 'mock',
      message: 'Mock database mode - no connection needed'
    });
    process.exit(0);
  }

  try {
    // Validation directe des ENV
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY missing');
    }
    
    // Créer client directement
    const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
    
    const projectHost = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    
    console.log('🔌 db_check_connecting', { 
      projectHost,
      mode: 'database'
    });

    // Test simple de lecture (table publique)
    const startTime = Date.now();
    const { data, error } = await supabasePublic
      .from('services')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('❌ db_check_fail', {
        error: error.message,
        code: error.code,
        hint: error.hint,
        responseTime
      });
      process.exit(1);
    }

    console.log('✅ db_check_success', {
      status: 'connected',
      recordsFound: data?.length || 0,
      responseTime,
      projectHost
    });

    // Test RLS (Row Level Security)
    console.log('🔐 db_check_rls_test');
    const { data: rls, error: rlsError } = await supabasePublic
      .from('salon_services')
      .select('id')
      .limit(1);

    if (rlsError) {
      console.warn('⚠️ db_check_rls_restricted', {
        message: 'RLS policies active - this is expected',
        error: rlsError.message
      });
    } else {
      console.log('✅ db_check_rls_ok', {
        recordsVisible: rls?.length || 0,
        message: 'RLS allows anonymous access to some records'
      });
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ db_check_error', {
      error: error.message,
      hint: 'Check SUPABASE_URL, SUPABASE_ANON_KEY in environment'
    });
    process.exit(1);
  }
}

checkDatabaseConnection();