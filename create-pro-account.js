#!/usr/bin/env node

import fetch from 'node-fetch';

async function createProAccount() {
  console.log('🏗️ Création du compte pro@avyento.com...\n');
  
  try {
    // 1. Créer le compte
    const signupResponse = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pro@avyento.com',
        password: 'avyento2025',
        firstName: 'Salon',
        lastName: 'Pro',
        salonName: 'Mon Salon de Beauté'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('📝 Création compte:', signupData.success ? '✅ Réussi' : '❌ Échec');
    
    if (signupData.success) {
      console.log('   Nouveau user_id:', signupData.user.id);
      
      // 2. Maintenant on peut transférer les rendez-vous vers ce nouveau compte
      console.log('\n📋 Transfert des rendez-vous existants...');
      console.log('⚠️ Note: Cette étape nécessiterait une mise à jour directe en base');
      console.log('   Ancien user_id: 47b38fc8-a9d5-4253-9618-08e81963af42');
      console.log('   Nouveau user_id:', signupData.user.id);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createProAccount();