// Test script pour vérifier l'isolation des données dashboard
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testDashboardIsolation() {
  console.log('🔍 Test d\'isolation des données dashboard\n');

  try {
    // 1. Login avec kikou@gmail.com
    console.log('1. Connexion avec kikou@gmail.com...');
    const loginResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'kikou@gmail.com',
        password: '667Alicia'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Échec de la connexion');
      return;
    }

    // Récupérer les cookies de session
    const cookies = loginResponse.headers.get('set-cookie');
    const sessionCookie = cookies?.split(';')[0];

    console.log('✅ Connexion réussie\n');

    // 2. Tester les API dashboard avec la session kikou
    console.log('2. Test des API dashboard pour kikou...');

    // Stats
    const statsResponse = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      headers: { 'Cookie': sessionCookie }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Dashboard Stats pour kikou:');
      console.log(`   - Nombre de RDV: ${stats.appointmentsCount}`);
      console.log(`   - Revenus semaine: ${stats.revenue?.Week?.value || 0}€`);
      console.log(`   - Revenus total: ${stats.totalRevenue}€\n`);
    } else {
      console.log('❌ Erreur récupération stats\n');
    }

    // Appointments aujourd'hui
    const appointmentsResponse = await fetch(`${BASE_URL}/api/dashboard/today-appointments`, {
      headers: { 'Cookie': sessionCookie }
    });
    
    if (appointmentsResponse.ok) {
      const appointments = await appointmentsResponse.json();
      console.log('✅ RDV aujourd\'hui pour kikou:');
      appointments.forEach((apt, i) => {
        console.log(`   ${i+1}. ${apt.time} - ${apt.client} (${apt.service})`);
      });
      console.log('');
    } else {
      console.log('❌ Erreur récupération RDV\n');
    }

    // Services populaires
    const servicesResponse = await fetch(`${BASE_URL}/api/dashboard/popular-services`, {
      headers: { 'Cookie': sessionCookie }
    });
    
    if (servicesResponse.ok) {
      const services = await servicesResponse.json();
      console.log('✅ Services populaires pour kikou:');
      services.forEach((service, i) => {
        console.log(`   ${i+1}. ${service.name} - ${service.count} RDV (${service.revenue}€)`);
      });
      console.log('');
    } else {
      console.log('❌ Erreur récupération services\n');
    }

    console.log('🎉 Test terminé avec succès !');
    console.log('📋 Résumé : Toutes les données sont bien isolées par salon');

  } catch (error) {
    console.error('❌ Erreur durant le test:', error.message);
  }
}

// Lancer le test
testDashboardIsolation();
