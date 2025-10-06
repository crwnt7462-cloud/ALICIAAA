#!/usr/bin/env node

import fetch from 'node-fetch';

async function testCrossDomainCookies() {
  console.log('🍪 Test des cookies cross-domain...\n');
  
  try {
    // 1. Se connecter depuis "localhost:5173" (simulation)
    console.log('1️⃣ Connexion avec origin localhost:5173...');
    
    const loginResponse = await fetch('http://localhost:3000/api/login-with-data', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'  // Simule une requête depuis le frontend
      }
    });
    
    const loginData = await loginResponse.json();
    const cookies = loginResponse.headers.get('set-cookie');
    
    console.log('📝 Login:', loginData.success ? '✅' : '❌');
    console.log('🍪 Cookies reçus:', cookies ? '✅' : '❌');
    
    if (cookies) {
      // 2. Test des appointments avec ces cookies
      console.log('\n2️⃣ Test appointments avec cookies cross-domain...');
      
      const appointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
        headers: { 
          'Cookie': cookies,
          'Origin': 'http://localhost:5173'
        }
      });
      
      console.log('📊 Status appointments:', appointmentsResponse.status);
      
      if (appointmentsResponse.ok) {
        const appointments = await appointmentsResponse.json();
        console.log(`✅ ${appointments.length} rendez-vous récupérés !`);
        
        if (appointments.length > 0) {
          console.log('📋 Premier rendez-vous:');
          console.log(`   Client: ${appointments[0].clientName}`);
          console.log(`   Date: ${appointments[0].date}`);
          console.log(`   Heure: ${appointments[0].time}`);
        }
      } else {
        const error = await appointmentsResponse.text();
        console.log('❌ Erreur appointments:', error);
      }
    }
    
    console.log('\n🎯 RÉSULTAT:');
    console.log(loginData.success && cookies ? 
      '✅ Les cookies cross-domain fonctionnent !' :
      '❌ Problème de cookies cross-domain');
    
  } catch (error) {
    console.error('❌ Erreur test:', error.message);
  }
}

testCrossDomainCookies();