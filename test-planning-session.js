#!/usr/bin/env node

import fetch from 'node-fetch';

async function testPlanningAuth() {
  console.log('🔧 Test complet session + planning...\n');
  
  try {
    // 1. Test de connexion
    console.log('1️⃣ Test de connexion salon...');
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    
    // Récupération des cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies:', cookies);
    
    if (!cookies) {
      console.error('❌ Pas de cookies de session reçus');
      return;
    }
    
    // 2. Test de vérification de session
    console.log('\n2️⃣ Test de vérification session...');
    const whoamiResponse = await fetch('http://localhost:3000/api/test-whoami', {
      headers: { 'Cookie': cookies }
    });
    
    const whoamiData = await whoamiResponse.json();
    console.log('✅ Whoami response:', whoamiData);
    
    // 3. Test de récupération des rendez-vous
    console.log('\n3️⃣ Test API appointments...');
    const appointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies }
    });
    
    if (appointmentsResponse.ok) {
      const appointments = await appointmentsResponse.json();
      console.log(`✅ Rendez-vous récupérés: ${appointments.length}`);
      
      if (appointments.length > 0) {
        console.log('📋 Premier rendez-vous:');
        console.log(JSON.stringify(appointments[0], null, 2));
      } else {
        console.log('ℹ️ Aucun rendez-vous trouvé');
      }
    } else {
      console.error(`❌ Erreur API appointments: ${appointmentsResponse.status}`);
      const errorText = await appointmentsResponse.text();
      console.error('Details:', errorText);
    }
    
    // 4. Test sans authentification
    console.log('\n4️⃣ Test sans authentification (doit échouer)...');
    const noAuthResponse = await fetch('http://localhost:3000/api/appointments');
    console.log(`Status sans auth: ${noAuthResponse.status}`);
    const noAuthText = await noAuthResponse.text();
    console.log('Réponse sans auth:', noAuthText);
    
  } catch (error) {
    console.error('❌ Erreur durant le test:', error.message);
  }
}

testPlanningAuth();