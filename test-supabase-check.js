#!/usr/bin/env node
/**
 * Script pour vérifier si les rendez-vous sont bien sauvés dans Supabase
 */

const BASE_URL = 'http://localhost:3000';

async function testAndCheckSupabase() {
  console.log('🔍 Test et vérification Supabase\n');
  
  try {
    // === ÉTAPE 1: Vérifier l'état actuel de la table ===
    console.log('1️⃣ État actuel de la table appointments...');
    const currentState = await fetch(`${BASE_URL}/api/test-table-structure`);
    const currentData = await currentState.json();
    
    console.log('📊 Enregistrements actuels:', currentData.recordCount);
    if (currentData.sampleRecord) {
      console.log('📝 Dernier enregistrement:', {
        id: currentData.sampleRecord.id,
        client_name: currentData.sampleRecord.client_name,
        date: currentData.sampleRecord.date,
        appointment_time: currentData.sampleRecord.appointment_time,
        user_id: currentData.sampleRecord.user_id
      });
    }
    
    // === ÉTAPE 2: Créer un nouveau rendez-vous ===
    console.log('\n2️⃣ Création d\'un nouveau rendez-vous...');
    const appointmentData = {
      client_name: 'TEST SUPABASE CLIENT',
      service: 'Test Supabase Service',
      date: '2025-10-04',
      start_time: '16:00',
      duration: 45,
      price: 60,
      salon_slug: 'salon-15228957'
    };
    
    console.log('📤 Données envoyées:', appointmentData);
    
    const createResponse = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });
    
    console.log('📥 Statut réponse:', createResponse.status);
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Erreur création:', errorText);
      throw new Error('Échec création rendez-vous');
    }
    
    const appointmentResult = await createResponse.json();
    console.log('✅ Réponse serveur:', appointmentResult);
    
    // === ÉTAPE 3: Vérifier immédiatement dans la base ===
    console.log('\n3️⃣ Vérification immédiate dans la base...');
    
    // Attendre un peu pour que la DB se synchronise
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const afterState = await fetch(`${BASE_URL}/api/test-table-structure`);
    const afterData = await afterState.json();
    
    console.log('📊 Enregistrements après création:', afterData.recordCount);
    
    if (afterData.sampleRecord) {
      console.log('📝 Dernier enregistrement après création:', {
        id: afterData.sampleRecord.id,
        client_name: afterData.sampleRecord.client_name,
        date: afterData.sampleRecord.date,
        appointment_time: afterData.sampleRecord.appointment_time,
        user_id: afterData.sampleRecord.user_id
      });
    }
    
    // === ÉTAPE 4: Tentative de récupération directe par ID ===
    if (appointmentResult.id) {
      console.log('\n4️⃣ Tentative de récupération par ID...');
      
      // Se connecter en tant que propriétaire du salon
      const loginResponse = await fetch(`${BASE_URL}/api/test-login-salon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42'
        })
      });
      
      // Créer un client avec gestion des cookies
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
      
      const client = new SessionClient();
      
      // Se connecter
      await client.fetch(`${BASE_URL}/api/test-login-salon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
      });
      
      // Récupérer les appointments
      const appointmentsResponse = await client.fetch(`${BASE_URL}/api/appointments`);
      const appointments = await appointmentsResponse.json();
      
      console.log('📋 Rendez-vous récupérés via API:', appointments.length);
      
      const foundAppointment = appointments.find(apt => apt.id === appointmentResult.id);
      if (foundAppointment) {
        console.log('✅ Rendez-vous trouvé via API !');
        console.log('📝 Détails:', foundAppointment);
      } else {
        console.log('❌ Rendez-vous non trouvé via API');
        console.log('📝 Tous les rendez-vous:', appointments);
      }
    }
    
    console.log('\n🎯 Résumé:');
    console.log('- Rendez-vous créé:', appointmentResult.id ? '✅' : '❌');
    console.log('- Visible dans Supabase:', afterData.recordCount > currentData.recordCount ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Erreur during test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAndCheckSupabase();