#!/usr/bin/env node

import fetch from 'node-fetch';

async function debugPlanningFlow() {
  console.log('🔍 DEBUG COMPLET du flux planning...\n');
  
  try {
    // 1. Test direct de l'endpoint appointments avec le bon user_id
    console.log('1️⃣ Test direct avec le user_id qui a les données...');
    
    const loginTestResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const cookies1 = loginTestResponse.headers.get('set-cookie');
    
    const appointmentsResponse1 = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies1 }
    });
    
    const appointments1 = await appointmentsResponse1.json();
    console.log(`   Compte test: ${appointments1.length} rendez-vous`);
    
    // 2. Test avec le compte pro
    console.log('\n2️⃣ Test avec le compte pro...');
    
    const loginProResponse = await fetch('http://localhost:3000/api/login-direct-pro', {
      method: 'POST'
    });
    
    const cookies2 = loginProResponse.headers.get('set-cookie');
    
    const appointmentsResponse2 = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies2 }
    });
    
    const appointments2 = await appointmentsResponse2.json();
    console.log(`   Compte pro: ${appointments2.length} rendez-vous`);
    
    // 3. Test cross-domain (frontend -> backend)
    console.log('\n3️⃣ Test cross-domain (simulation frontend)...');
    
    // Simulation d'une requête depuis localhost:5173
    const crossDomainResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 
        'Origin': 'http://localhost:5173',
        'Cookie': cookies2
      }
    });
    
    console.log('   Status cross-domain:', crossDomainResponse.status);
    
    if (crossDomainResponse.ok) {
      const crossDomainData = await crossDomainResponse.json();
      console.log(`   Cross-domain appointments: ${crossDomainData.length}`);
    } else {
      console.log('   Erreur cross-domain:', await crossDomainResponse.text());
    }
    
    // 4. Vérification des sessions
    console.log('\n4️⃣ Vérification des sessions...');
    
    const whoami1 = await fetch('http://localhost:3000/api/test-whoami', {
      headers: { 'Cookie': cookies1 }
    });
    const whoami1Data = await whoami1.json();
    console.log('   Session compte test:', whoami1Data.authenticated ? '✅' : '❌');
    
    const whoami2 = await fetch('http://localhost:3000/api/test-whoami', {
      headers: { 'Cookie': cookies2 }
    });
    const whoami2Data = await whoami2.json();
    console.log('   Session compte pro:', whoami2Data.authenticated ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Erreur debug:', error.message);
  }
}

debugPlanningFlow();