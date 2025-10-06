#!/usr/bin/env node
/**
 * Script pour se connecter automatiquement en tant que propriétaire du salon salon-15228957
 */

const BASE_URL = 'http://localhost:3000';

async function loginAsSalonOwner() {
  console.log('🔐 Connexion automatique en tant que propriétaire du salon salon-15228957\n');
  
  try {
    // === ÉTAPE 1: Récupérer l'ID du propriétaire ===
    const salonInfo = await fetch(`${BASE_URL}/api/salon/salon-15228957/owner`);
    const salon = await salonInfo.json();
    
    console.log('Salon:', salon.salonName);
    console.log('Propriétaire ID:', salon.ownerId);
    
    // === ÉTAPE 2: Se connecter via l'endpoint de test ===
    const loginResponse = await fetch(`${BASE_URL}/api/test-login-salon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        salonOwnerId: salon.ownerId
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Échec connexion');
    }
    
    const loginResult = await loginResponse.json();
    console.log('✅ Connecté en tant que:', loginResult.user.salonName);
    
    console.log('\n🎯 Instructions:');
    console.log('1. Ouvrez votre navigateur sur: http://localhost:5173/planning');
    console.log('2. Ouvrez les outils de développement (F12)');
    console.log('3. Dans la console, exécutez cette commande pour simuler la connexion:');
    console.log('');
    console.log(`fetch('/api/test-login-salon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ salonOwnerId: '${salon.ownerId}' })
}).then(() => location.reload())`);
    console.log('');
    console.log('4. La page se rechargera et vous verrez les rendez-vous du salon');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

loginAsSalonOwner();