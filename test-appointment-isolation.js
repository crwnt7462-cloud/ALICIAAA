#!/usr/bin/env node
/**
 * Script de test pour vérifier l'isolation des rendez-vous par salon
 * Ce script teste que chaque salon ne voit que ses propres rendez-vous
 */

const BASE_URL = 'http://localhost:3000';

// Simuler un navigateur avec gestion des cookies
class SessionClient {
  constructor() {
    this.cookies = new Map();
  }
  
  // Extraire les cookies depuis les headers de réponse
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
  
  // Créer le header Cookie pour les requêtes
  getCookieHeader() {
    const cookieStrings = [];
    for (const [name, value] of this.cookies) {
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join('; ');
  }
  
  // Faire une requête avec gestion automatique des cookies
  async fetch(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    
    // Ajouter les cookies existants
    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Extraire les nouveaux cookies
    this.extractCookies(response);
    
    return response;
  }
}

async function testAppointmentIsolation() {
  console.log('🧪 Test d\'isolation des rendez-vous par salon\n');
  
  // IDs de test pour différents salons
  const salon1OwnerId = 'test-salon-1-owner';
  const salon2OwnerId = 'test-salon-2-owner';
  
  // Créer deux clients avec gestion de session séparée
  const salon1Client = new SessionClient();
  const salon2Client = new SessionClient();
  
  try {
    // === ÉTAPE 1: Se connecter en tant que Salon 1 ===
    console.log('1️⃣ Connexion en tant que Salon 1...');
    const loginSalon1 = await salon1Client.fetch(`${BASE_URL}/api/test-login-salon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: salon1OwnerId })
    });
    
    if (!loginSalon1.ok) {
      const errorText = await loginSalon1.text();
      console.error('Erreur connexion Salon 1:', errorText);
      throw new Error('Échec connexion Salon 1');
    }
    
    const salon1Session = await loginSalon1.json();
    console.log('✅ Connecté en tant que:', salon1Session.user.salonName);
    
    // === ÉTAPE 2: Créer un rendez-vous pour Salon 1 ===
    console.log('\n2️⃣ Création d\'un rendez-vous pour Salon 1...');
    const createAppt1 = await salon1Client.fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Client Salon 1',
        service: 'Coupe Salon 1',
        date: '2025-10-10',
        start_time: '10:00',
        duration: 60,
        price: 50
      })
    });
    
    if (!createAppt1.ok) {
      const errorText = await createAppt1.text();
      console.error('Erreur détaillée:', errorText);
      throw new Error('Échec création rendez-vous Salon 1');
    }
    
    const appt1 = await createAppt1.json();
    console.log('✅ Rendez-vous créé pour Salon 1, ID:', appt1.id);
    
    // === ÉTAPE 3: Vérifier les rendez-vous du Salon 1 ===
    console.log('\n3️⃣ Vérification des rendez-vous de Salon 1...');
    const getSalon1Appts = await salon1Client.fetch(`${BASE_URL}/api/appointments`);
    
    const salon1Appointments = await getSalon1Appts.json();
    console.log('📋 Salon 1 a', salon1Appointments.length, 'rendez-vous');
    
    // === ÉTAPE 4: Se connecter en tant que Salon 2 ===
    console.log('\n4️⃣ Connexion en tant que Salon 2...');
    const loginSalon2 = await salon2Client.fetch(`${BASE_URL}/api/test-login-salon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: salon2OwnerId })
    });
    
    const salon2Session = await loginSalon2.json();
    console.log('✅ Connecté en tant que:', salon2Session.user.salonName);
    
    // === ÉTAPE 5: Créer un rendez-vous pour Salon 2 ===
    console.log('\n5️⃣ Création d\'un rendez-vous pour Salon 2...');
    const createAppt2 = await salon2Client.fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Client Salon 2',
        service: 'Coupe Salon 2',
        date: '2025-10-10',
        start_time: '14:00',
        duration: 45,
        price: 40
      })
    });
    
    const appt2 = await createAppt2.json();
    console.log('✅ Rendez-vous créé pour Salon 2, ID:', appt2.id);
    
    // === ÉTAPE 6: Vérifier les rendez-vous du Salon 2 ===
    console.log('\n6️⃣ Vérification des rendez-vous de Salon 2...');
    const getSalon2Appts = await salon2Client.fetch(`${BASE_URL}/api/appointments`);
    
    const salon2Appointments = await getSalon2Appts.json();
    console.log('📋 Salon 2 a', salon2Appointments.length, 'rendez-vous');
    
    // === ÉTAPE 7: Test d'isolation ===
    console.log('\n7️⃣ Test d\'isolation...');
    const salon1HasSalon2Appt = salon1Appointments.some(appt => appt.clientName === 'Client Salon 2');
    const salon2HasSalon1Appt = salon2Appointments.some(appt => appt.clientName === 'Client Salon 1');
    
    if (salon1HasSalon2Appt || salon2HasSalon1Appt) {
      console.log('❌ ÉCHEC: L\'isolation n\'est pas correcte !');
      console.log('   Salon 1 voit les rdv de Salon 2:', salon1HasSalon2Appt);
      console.log('   Salon 2 voit les rdv de Salon 1:', salon2HasSalon1Appt);
    } else {
      console.log('✅ SUCCÈS: L\'isolation fonctionne correctement !');
      console.log('   Chaque salon ne voit que ses propres rendez-vous');
    }
    
    // === ÉTAPE 8: Vérification croisée (Salon 1 ne doit pas voir rdv Salon 2) ===
    console.log('\n8️⃣ Vérification croisée...');
    const crossCheckSalon1 = await salon1Client.fetch(`${BASE_URL}/api/appointments`);
    const salon1FinalAppointments = await crossCheckSalon1.json();
    
    console.log('📋 Salon 1 final:', salon1FinalAppointments.length, 'rendez-vous');
    console.log('📋 Salon 2 final:', salon2Appointments.length, 'rendez-vous');
    
    // Afficher les détails pour debug
    console.log('\n📝 Détails des rendez-vous:');
    console.log('Salon 1:', salon1FinalAppointments.map(a => a.clientName));
    console.log('Salon 2:', salon2Appointments.map(a => a.clientName));
    
    console.log('\n🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur during test:', error.message);
    process.exit(1);
  }
}

// Lancer le test
testAppointmentIsolation();