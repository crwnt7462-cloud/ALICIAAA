#!/usr/bin/env node

import fetch from 'node-fetch';

async function setupProAccount() {
  console.log('🎯 Configuration compte pro avec rendez-vous...\n');
  
  try {
    // 1. Chercher ou créer un compte pro
    // On va utiliser l'API pour créer un rendez-vous avec un autre user_id
    
    console.log('🔑 Test avec différents comptes...');
    
    // Essayons de créer un rendez-vous avec un user_id différent 
    const testUserId = 'pro-account-12345';
    
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: testUserId })
    });
    
    const loginData = await loginResponse.json();
    console.log('📝 Création session pour:', testUserId);
    
    if (loginData.success) {
      const cookies = loginResponse.headers.get('set-cookie');
      
      // 2. Créer un rendez-vous pour aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      const appointmentTime = `${(currentHour + 2).toString().padStart(2, '0')}:00`;
      
      const appointmentData = {
        client_name: "Client Pro Account",
        service: "Coupe + Couleur",
        employee: "Sarah Martin",
        date: today,
        start_time: appointmentTime,
        duration: 90,
        price: 120
      };
      
      console.log('📅 Création rendez-vous pour le compte pro...');
      const createResponse = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookies 
        },
        body: JSON.stringify(appointmentData)
      });
      
      if (createResponse.ok) {
        console.log('✅ Rendez-vous créé pour le compte pro !');
        console.log('📝 Identifiants de connexion:');
        console.log('   Email:', loginData.user.email);
        console.log('   User ID:', loginData.user.id);
        
        // 3. Vérifier les rendez-vous
        const checkResponse = await fetch('http://localhost:3000/api/appointments', {
          headers: { 'Cookie': cookies }
        });
        
        const appointments = await checkResponse.json();
        console.log(`\\n📋 ${appointments.length} rendez-vous dans ce compte`);
      } else {
        console.error('❌ Erreur création:', await createResponse.text());
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

setupProAccount();