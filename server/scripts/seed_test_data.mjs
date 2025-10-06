#!/usr/bin/env node

/**
 * Script de peuplement DB - Trio minimal pour tests
 * 
 * Crée: 1 salon + 1 service + 1 liaison salon_services
 * Usage: node scripts/seed_test_data.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

async function seedTestData() {
  console.log('🌱 Seeding test data for booking flow validation...');

  // Vérifier que nous ne sommes pas en mode mock
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('⚠️  Skipping seed - USE_MOCK_DB=true');
    console.log('   Set USE_MOCK_DB=false to seed real database');
    process.exit(0);
  }

  try {
    // Configuration Supabase  
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Générer IDs de test
    const salonId = randomUUID();
    const serviceId = randomUUID();
    
    console.log('📋 Test IDs generated:', { salonId, serviceId });

    // 1. Créer le salon (colonnes minimales)
    console.log('🏢 Creating test salon...');
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .insert({
        id: salonId,
        name: 'Salon Test Booking Flow'
      })
      .select()
      .single();

    if (salonError) {
      console.error('❌ Salon creation failed:', salonError);
      throw salonError;
    }
    console.log('✅ Salon created:', salon.name);

    // 2. Créer le service (colonnes minimales)
    console.log('💇 Creating test service...');
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .insert({
        id: serviceId,
        name: 'Coupe Test',
        price: 45,
        duration: 35
      })
      .select()
      .single();

    if (serviceError) {
      console.error('❌ Service creation failed:', serviceError);
      throw serviceError;
    }
    console.log('✅ Service created:', service.name);

    // 3. Créer la liaison salon_services
    console.log('🔗 Creating salon-service link...');
    const { data: salonService, error: linkError } = await supabase
      .from('salon_services')
      .insert({
        salon_id: salonId,
        service_id: serviceId,
        price: 50,  // Override du prix de base
        duration: 30, // Override de la durée de base  
        active: true
      })
      .select()
      .single();

    if (linkError) {
      console.error('❌ Salon-service link failed:', linkError);
      throw linkError;
    }
    console.log('✅ Salon-service link created');

    // Afficher les résultats pour les tests
    console.log('\n🎯 TEST DATA READY:');
    console.log('=====================================');
    console.log(`SALON_ID="${salonId}"`);
    console.log(`SERVICE_ID="${serviceId}"`);
    console.log(`EXPECTED_PRICE="50"`);
    console.log(`EXPECTED_DURATION="30"`);
    console.log('');
    console.log('📝 Update your .env.booking_test with these values:');
    console.log(`SALON_A_ID="${salonId}"`);
    console.log(`SERVICE_A_ID="${serviceId}"`);
    console.log('EXPECTED_PRICE_A="50"');
    console.log('EXPECTED_DURATION_A="30"');
    console.log('');
    console.log('🧪 Then run: ./booking_smoke.sh');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', {
      error: error.message,
      hint: 'Check Supabase credentials and table schemas'
    });
    process.exit(1);
  }
}

seedTestData();