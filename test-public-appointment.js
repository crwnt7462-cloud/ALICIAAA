#!/usr/bin/env node
/**
 * Script de test pour vérifier la création de rendez-vous via salon_slug
 */

const BASE_URL = 'http://localhost:3000';

async function testPublicAppointment() {
  console.log('🧪 Test création rendez-vous via salon public\n');
  
  try {
    // === ÉTAPE 1: Vérifier que le salon existe ===
    console.log('1️⃣ Vérification salon salon-15228957...');
    const salonInfo = await fetch(`${BASE_URL}/api/salon/salon-15228957/owner`);
    
    if (!salonInfo.ok) {
      throw new Error('Salon non trouvé');
    }
    
    const salon = await salonInfo.json();
    console.log('✅ Salon trouvé:', salon.salonName, 'propriétaire:', salon.ownerId);
    
    // === ÉTAPE 2: Créer un rendez-vous via salon_slug ===
    console.log('\n2️⃣ Création rendez-vous via salon_slug...');
    const appointmentData = {
      client_name: 'Test Client Reservation',
      service: 'Test Service',
      date: '2025-10-04', // Aujourd'hui
      start_time: '14:30',
      duration: 60,
      price: 75,
      salon_slug: 'salon-15228957'
    };
    
    console.log('📝 Données envoyées:', appointmentData);
    
    const createResponse = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Erreur création:', errorText);
      throw new Error('Échec création rendez-vous');
    }
    
    const appointment = await createResponse.json();
    console.log('✅ Rendez-vous créé avec ID:', appointment.id);
    
    // === ÉTAPE 3: Vérifier que le rendez-vous a le bon user_id ===
    console.log('\n3️⃣ Vérification user_id...');
    console.log('Appointment user_id:', appointment.user_id);
    console.log('Salon owner_id:', salon.ownerId);
    
    if (appointment.user_id === salon.ownerId) {
      console.log('✅ SUCCÈS: Le user_id correspond au propriétaire du salon !');
    } else {
      console.log('❌ ERREUR: Le user_id ne correspond pas au propriétaire du salon');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur during test:', error.message);
    process.exit(1);
  }
}

// Lancer le test
testPublicAppointment();