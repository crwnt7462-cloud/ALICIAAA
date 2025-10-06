#!/usr/bin/env node

import fetch from 'node-fetch';

async function checkExistingUsers() {
  console.log('🔍 Vérification des comptes existants...\n');
  
  try {
    // Connexion avec le compte de test qui a les rendez-vous
    const loginResponse = await fetch('http://localhost:3000/api/test-login-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonOwnerId: '47b38fc8-a9d5-4253-9618-08e81963af42' })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Compte avec rendez-vous:');
    console.log('   ID:', loginData.user.id);
    console.log('   Email:', loginData.user.email);
    console.log('   Nom:', loginData.user.firstName, loginData.user.lastName);
    console.log('   Salon:', loginData.user.salonName);
    
    console.log('\n💡 SOLUTION:');
    console.log('Pour voir les rendez-vous, vous devez vous connecter avec:');
    console.log('   Email:', loginData.user.email);
    console.log('   Mot de passe: (à définir)');
    
    console.log('\n🔧 Ou créer un vrai compte pro@avyento.com avec les rendez-vous existants');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkExistingUsers();