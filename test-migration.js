#!/usr/bin/env node

import fetch from 'node-fetch';

async function executeMigration() {
  console.log('🔧 Exécution de la migration salon_id...\n');
  
  try {
    // 1. Se connecter pour avoir les permissions
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    
    // 2. Vérifier l'état actuel des appointments
    console.log('📊 État avant migration...');
    const beforeResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies }
    });
    
    if (beforeResponse.ok) {
      const beforeData = await beforeResponse.json();
      console.log(`   Appointments existants: ${beforeData.length}`);
    }
    
    // 3. Note: La migration SQL doit être exécutée manuellement dans Supabase
    console.log('\n⚠️ ATTENTION: La migration SQL doit être exécutée dans Supabase:');
    console.log('   1. Allez dans Supabase Dashboard');
    console.log('   2. SQL Editor');
    console.log('   3. Exécutez le fichier sql/add_salon_id_to_appointments.sql');
    
    console.log('\n✅ Une fois la migration SQL terminée, testez avec le nouveau code API');
    
  } catch (error) {
    console.error('❌ Erreur migration:', error.message);
  }
}

executeMigration();