#!/usr/bin/env node

/**
 * Test de sécurité RLS - Validation des politiques
 * 
 * OBJECTIFS:
 * 1. Vérifier que les anonymes ne peuvent PAS accéder aux tables directement
 * 2. Vérifier que les anonymes PEUVENT accéder à la vue sécurisée
 * 3. Vérifier que les authenticated ont accès aux tables via RLS
 * 4. Valider les temps de réponse et index
 * 
 * Usage: node scripts/test_rls_security.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function testRLSSecurity() {
  console.log('🔒 Testing RLS Security Implementation...');

  if (process.env.USE_MOCK_DB === 'true') {
    console.log('⚠️  Skipping - USE_MOCK_DB=true (test only works with real Supabase)');
    process.exit(0);
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !anonKey) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY missing');
    }

    // Client anonyme (public)
    const supabaseAnon = createClient(supabaseUrl, anonKey);
    
    console.log('\n📋 Test Plan:');
    console.log('================');
    console.log('1. ❌ Anon access to tables (should FAIL)');
    console.log('2. ✅ Anon access to secure view (should WORK)');
    console.log('3. ✅ Service role access (should WORK)');
    console.log('4. 📊 Performance validation');

    // ========================================
    // Test 1: Accès anonyme aux tables (doit échouer)
    // ========================================
    
    console.log('\n🚫 Test 1: Anonymous access to tables (expecting FAILURES)');
    
    const tableTests = [
      { table: 'salons', test: 'SELECT salon data' },
      { table: 'services', test: 'SELECT services data' },
      { table: 'salon_services', test: 'SELECT salon_services data' }
    ];

    let tablesBlocked = 0;
    
    for (const { table, test } of tableTests) {
      try {
        const startTime = Date.now();
        const { data, error } = await supabaseAnon
          .from(table)
          .select('*')
          .limit(1);
        
        const responseTime = Date.now() - startTime;
        
        if (error) {
          console.log(`  ✅ ${test}: BLOCKED (${error.code}) - ${responseTime}ms`);
          tablesBlocked++;
        } else {
          console.log(`  ❌ ${test}: ALLOWED (${data?.length || 0} rows) - SECURITY BREACH!`);
        }
      } catch (err) {
        console.log(`  ✅ ${test}: BLOCKED (exception) - Security OK`);
        tablesBlocked++;
      }
    }

    // ========================================
    // Test 2: Accès anonyme à la vue sécurisée (doit marcher)
    // ========================================
    
    console.log('\n✅ Test 2: Anonymous access to secure view (expecting SUCCESS)');
    
    try {
      const startTime = Date.now();
      const { data, error } = await supabaseAnon
        .from('effective_services_public')
        .select('salon_name, service_name, effective_price, effective_duration')
        .limit(5);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        console.log(`  ❌ Secure view access: FAILED (${error.code}) - ${error.message}`);
        console.log(`     Hint: Run the RLS setup SQL first`);
      } else {
        console.log(`  ✅ Secure view access: SUCCESS (${data?.length || 0} rows) - ${responseTime}ms`);
        if (data && data.length > 0) {
          console.log(`     Sample: ${data[0].salon_name} - ${data[0].service_name} (${data[0].effective_price}€)`);
        }
      }
    } catch (err) {
      console.log(`  ❌ Secure view access: EXCEPTION - ${err.message}`);
    }

    // ========================================
    // Test 3: Service role access (validation admin)
    // ========================================
    
    if (serviceRoleKey) {
      console.log('\n🔑 Test 3: Service role access (admin validation)');
      
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      
      try {
        const startTime = Date.now();
        const { data, error } = await supabaseAdmin
          .from('salons')
          .select('id, name')
          .limit(3);
        
        const responseTime = Date.now() - startTime;
        
        if (error) {
          console.log(`  ❌ Service role access: FAILED (${error.code})`);
        } else {
          console.log(`  ✅ Service role access: SUCCESS (${data?.length || 0} salons) - ${responseTime}ms`);
        }
      } catch (err) {
        console.log(`  ❌ Service role access: EXCEPTION - ${err.message}`);
      }
    }

    // ========================================
    // Test 4: Performance validation
    // ========================================
    
    console.log('\n📊 Test 4: Performance validation');
    
    const perfTests = [
      { 
        name: 'Secure view query', 
        query: () => supabaseAnon.from('effective_services_public').select('*').limit(50)
      }
    ];

    for (const perfTest of perfTests) {
      try {
        const iterations = 3;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
          const startTime = Date.now();
          await perfTest.query();
          times.push(Date.now() - startTime);
        }
        
        const avgTime = Math.round(times.reduce((a, b) => a + b) / times.length);
        const maxTime = Math.max(...times);
        
        console.log(`  📈 ${perfTest.name}: avg ${avgTime}ms, max ${maxTime}ms`);
        
        if (maxTime > 500) {
          console.log(`     ⚠️  Slow query detected - consider adding indexes`);
        }
      } catch (err) {
        console.log(`  ❌ ${perfTest.name}: Failed - ${err.message}`);
      }
    }

    // ========================================
    // Résultats finaux
    // ========================================
    
    console.log('\n🎯 SECURITY VALIDATION RESULTS:');
    console.log('================================');
    console.log(`Tables blocked for anon: ${tablesBlocked}/${tableTests.length}`);
    
    if (tablesBlocked === tableTests.length) {
      console.log('✅ SECURITY: Tables properly protected');
    } else {
      console.log('❌ SECURITY BREACH: Some tables accessible to anonymous users');
    }
    
    console.log('\n💡 Next steps:');
    console.log('1. If tables are NOT blocked: Run sql/01_rls_security_option_a.sql in Supabase');
    console.log('2. If view is NOT accessible: Check view permissions and RLS policies');
    console.log('3. Test your API endpoints with: ./booking_smoke.sh');
    
    process.exit(tablesBlocked === tableTests.length ? 0 : 1);

  } catch (error) {
    console.error('❌ Security test failed:', error.message);
    process.exit(1);
  }
}

testRLSSecurity();