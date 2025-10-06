#!/usr/bin/env node
/**
 * Script pour tester ce que le planning reçoit de l'API
 */

const BASE_URL = 'http://localhost:3000';

// Simuler un navigateur avec gestion des cookies
class SessionClient {
  constructor() {
    this.cookies = new Map();
  }
  
  extractCookies(response) {
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(',');
      cookies.forEach(cookie => {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          this.cookies.set(name.trim(), value.trim());
        }
      });
    }
  }
  
  getCookieHeader() {
    const cookieStrings = [];
    for (const [name, value] of this.cookies) {
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join('; ');
  }
  
  async fetch(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    this.extractCookies(response);
    return response;
  }
}

async function testPlanningAPI() {
  console.log('🔍 Test de l\'API planning\n');
  
  const client = new SessionClient();
  
  try {
    // === ÉTAPE 1: Se connecter en tant que propriétaire du salon ===
    console.log('1️⃣ Connexion en tant que propriétaire du salon...');
    const loginResponse = await client.fetch(`${BASE_URL}/api/test-login-salon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Échec connexion');
    }
    
    const loginResult = await loginResponse.json();
    console.log('✅ Connecté en tant que:', loginResult.user.salonName);
    
    // === ÉTAPE 2: Tester les différentes requêtes que le planning peut faire ===
    console.log('\n2️⃣ Test requête appointments sans paramètres...');
    const allAppointments = await client.fetch(`${BASE_URL}/api/appointments`);
    const allData = await allAppointments.json();
    console.log('📋 Tous les appointments:', allData.length);
    allData.forEach(apt => {
      console.log(`  - ${apt.clientName} le ${apt.date} à ${apt.time} (${apt.service})`);
    });
    
    // === ÉTAPE 3: Tester avec filtre date d'aujourd'hui ===
    console.log('\n3️⃣ Test requête appointments pour le 2025-10-04...');
    const todayParams = new URLSearchParams();
    todayParams.append('date', '2025-10-04');
    
    const todayAppointments = await client.fetch(`${BASE_URL}/api/appointments?${todayParams}`);
    const todayData = await todayAppointments.json();
    console.log('📋 Appointments du 2025-10-04:', todayData.length);
    todayData.forEach(apt => {
      console.log(`  - ${apt.clientName} le ${apt.date} à ${apt.time} (${apt.service})`);
    });
    
    // === ÉTAPE 4: Simuler exactement la requête du planning en mode semaine ===
    console.log('\n4️⃣ Test requête planning mode semaine...');
    const today = new Date('2025-10-04'); // Forcer la date d'aujourd'hui
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    console.log('📅 Semaine:', startOfWeek.toISOString().split('T')[0], 'à', endOfWeek.toISOString().split('T')[0]);
    
    // Le planning ne filtre pas par date en mode semaine
    const weekParams = new URLSearchParams();
    
    const weekAppointments = await client.fetch(`${BASE_URL}/api/appointments?${weekParams}`);
    const weekData = await weekAppointments.json();
    console.log('📋 Appointments mode semaine:', weekData.length);
    weekData.forEach(apt => {
      console.log(`  - ${apt.clientName} le ${apt.date} à ${apt.time} (${apt.service})`);
    });
    
    // === ÉTAPE 5: Vérifier les headers de réponse ===
    console.log('\n5️⃣ Vérification headers réponse...');
    console.log('Status:', weekAppointments.status);
    console.log('Content-Type:', weekAppointments.headers.get('content-type'));
    
    // === ÉTAPE 6: Test avec les mêmes paramètres que le frontend ===
    console.log('\n6️⃣ Test avec paramètres frontend exactes...');
    const frontendParams = new URLSearchParams();
    // currentWeekOffset = 0, selectedEmployee = 'all', viewMode = 'week'
    
    const frontendResponse = await client.fetch(`${BASE_URL}/api/appointments?${frontendParams}`);
    const frontendData = await frontendResponse.json();
    console.log('📋 Réponse frontend-like:', frontendData.length);
    console.log('📝 Structure premier élément:', frontendData[0] ? Object.keys(frontendData[0]) : 'Aucun élément');
    
    console.log('\n🎯 Résumé:');
    console.log('- Session active:', loginResult.success ? '✅' : '❌');
    console.log('- Appointments trouvés:', allData.length > 0 ? '✅' : '❌');
    console.log('- Appointments aujourd\'hui:', todayData.length > 0 ? '✅' : '❌');
    console.log('- Format data correct:', frontendData[0] ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPlanningAPI();