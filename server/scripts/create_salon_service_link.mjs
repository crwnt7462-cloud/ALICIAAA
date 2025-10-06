#!/usr/bin/env node

/**
 * Script simplifiée - Utilise salon existant + crée liaison salon_services
 * 
 * Usage: node scripts/create_salon_service_link.mjs
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

async function createSalonServiceLink() {
  console.log('🔗 Creating salon-service link for testing...');

  if (process.env.USE_MOCK_DB === 'true') {
    console.log('⚠️  Skipping - USE_MOCK_DB=true');
    process.exit(0);
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Utiliser le salon créé précédemment
    const salonId = 'a4ecc323-77d0-4218-9b0d-8d16f5634bfa';
    
    // Chercher un service existant ou en créer un minimal
    console.log('🔍 Looking for existing services...');
    const { data: existingServices } = await supabase
      .from('services')
      .select('id, name')
      .limit(1);

    let serviceId;
    if (existingServices && existingServices.length > 0) {
      serviceId = existingServices[0].id;
      console.log('✅ Using existing service:', existingServices[0].name);
    } else {
      // Créer un service très minimal
      serviceId = randomUUID();
      console.log('💇 Creating minimal service...');
      
      const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert({
          id: serviceId,
          name: 'Test Service'
        })
        .select()
        .single();

      if (serviceError) {
        console.error('❌ Service creation failed:', serviceError);
        throw serviceError;
      }
      console.log('✅ Service created:', newService.name);
    }

    // Créer la liaison salon_services
    console.log('🔗 Creating salon-service link...');
    const { data: link, error: linkError } = await supabase
      .from('salon_services')
      .insert({
        salon_id: salonId,
        service_id: serviceId,
        price: 50,
        duration: 30
      })
      .select()
      .single();

    if (linkError) {
      console.error('❌ Link creation failed:', linkError);
      throw linkError;
    }

    console.log('✅ Link created successfully!');
    console.log('\n🎯 TEST READY:');
    console.log('=================');
    console.log(`SALON_A_ID="${salonId}"`);
    console.log(`SERVICE_A_ID="${serviceId}"`);
    console.log('EXPECTED_PRICE_A="50"');
    console.log('EXPECTED_DURATION_A="30"');
    
    // Tester immédiatement
    console.log('\n🧪 Testing API call...');
    const { data: testResult } = await supabase
      .from('salon_services')
      .select(`
        service_id,
        price,
        duration,
        services(name)
      `)
      .eq('salon_id', salonId);

    console.log('📊 Query result:', JSON.stringify(testResult, null, 2));

    process.exit(0);

  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

createSalonServiceLink();