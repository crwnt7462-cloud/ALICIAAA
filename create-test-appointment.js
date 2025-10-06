#!/usr/bin/env node

import fetch from 'node-fetch';

async function createTestAppointment() {
  console.log('🧪 Création d\'un rendez-vous de test avec le bon format...\n');
  
  try {
    // 1. Connexion au salon
    console.log('🔑 Connexion...');
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    
    // 2. Création d'un rendez-vous avec le bon format
    console.log('📅 Création du rendez-vous...');
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: 2025-10-05
    const currentHour = now.getHours();
    const testTime = `${(currentHour + 1).toString().padStart(2, '0')}:30`; // Dans 1h
    
    const appointmentData = {
      client_name: "Client Test Planning",
      service: "Coupe + Brushing",
      employee: "Sarah Martin",
      date: today, // ✅ Format ISO correct
      start_time: testTime, // ✅ Champ correct pour l'API
      duration: 60,
      notes: "Test pour vérifier l'affichage dans le planning",
      status: "scheduled",
      type: "client",
      price: 85
    };
    
    console.log('📝 Données du rendez-vous:', appointmentData);
    
    const createResponse = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies 
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (createResponse.ok) {
      const newAppointment = await createResponse.json();
      console.log('✅ Rendez-vous créé avec succès !');
      console.log('   ID:', newAppointment.id);
      console.log('   Date:', appointmentData.date);
      console.log('   Heure:', appointmentData.start_time);
    } else {
      const error = await createResponse.text();
      console.error('❌ Erreur création:', error);
    }
    
    // 3. Vérification - récupération des rendez-vous
    console.log('\n🔍 Vérification...');
    
    const checkResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies }
    });
    
    const appointments = await checkResponse.json();
    console.log(`📋 ${appointments.length} rendez-vous trouvé(s)`);
    
    if (appointments.length > 0) {
      appointments.forEach(apt => {
        console.log(`   • ${apt.clientName} - ${apt.date} à ${apt.time}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createTestAppointment();