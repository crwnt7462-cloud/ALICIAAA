#!/usr/bin/env node

import fetch from 'node-fetch';

async function checkCurrentAppointments() {
  console.log('🔍 Vérification des rendez-vous existants...\n');
  
  try {
    // 1. Connexion
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    
    // 2. Récupération des rendez-vous
    const appointmentsResponse = await fetch('http://localhost:3000/api/appointments', {
      headers: { 'Cookie': cookies }
    });
    
    const appointments = await appointmentsResponse.json();
    
    console.log(`📋 ${appointments.length} rendez-vous trouvés :\n`);
    
    appointments.forEach((apt, index) => {
      console.log(`${index + 1}. 👤 ${apt.clientName}`);
      console.log(`   📅 Date: ${apt.date}`);
      console.log(`   ⏰ Heure: ${apt.time || apt.start_time || apt.appointment_time}`);
      console.log(`   🏪 Service: ${apt.service}`);
      console.log(`   💰 Prix: ${apt.price || apt.revenue}€`);
      console.log('');
    });
    
    // 3. Vérification du format des dates
    console.log('🔍 Analyse des formats :');
    appointments.forEach(apt => {
      const dateFormat = apt.date?.includes('-') ? 'ISO (✅)' : 'Français (❌)';
      console.log(`   Date "${apt.date}" → ${dateFormat}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkCurrentAppointments();