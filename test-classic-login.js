#!/usr/bin/env node

import fetch from 'node-fetch';

async function testClassicLogin() {
  console.log('🔑 Test de connexion classique avec pro@avyento.com...\n');
  
  try {
    // 1. Connexion classique
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pro@avyento.com',
        password: 'avyento2025'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📝 Réponse login:', loginData);
    
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies:', cookies ? 'Reçus' : 'Aucun');
    
    if (!loginData.success) {
      console.log('❌ Connexion échouée');
      return;
    }
    
    console.log('✅ Connexion réussie avec user_id:', loginData.user.id);
    
    // 2. Récupération des rendez-vous avec cette session
    console.log('\n🗓️ Récupération des rendez-vous...');
    const appointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies }
    });
    
    if (appointmentsResponse.ok) {
      const appointments = await appointmentsResponse.json();
      console.log(`📋 ${appointments.length} rendez-vous trouvés pour ce compte`);
      
      appointments.forEach((apt, i) => {
        console.log(`   ${i+1}. ${apt.clientName} - ${apt.date} à ${apt.time}`);
      });
    } else {
      console.log('❌ Erreur récupération appointments:', await appointmentsResponse.text());
    }
    
    // 3. Comparaison avec le user_id du test
    console.log('\n🔍 Comparaison:');
    console.log('   User ID connexion classique:', loginData.user.id);
    console.log('   User ID test (avec rendez-vous):', '47b38fc8-a9d5-4253-9618-08e81963af42');
    console.log('   Match:', loginData.user.id === '47b38fc8-a9d5-4253-9618-08e81963af42' ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testClassicLogin();