const commonPasswords = [
  '123456',
  'password',
  'password123',
  'admin',
  'admin123',
  'test',
  'test123',
  'correct',
  'correct123',
  'salon',
  'salon123',
  'demo',
  'demo123',
  '1234',
  '12345',
  '123456789',
  'qwerty',
  'azerty',
  'milop',
  'MILOP',
  'melo',
  'MELO'
];

async function testPassword(password) {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'correct@gmail.com', 
        password: password 
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ TROUVÉ! Mot de passe: "${password}"`);
      console.log('Données utilisateur:', data.user);
      return true;
    } else {
      console.log(`❌ "${password}" - ${data.error || 'incorrect'}`);
    }
  } catch (error) {
    console.log(`❌ "${password}" - Erreur: ${error.message}`);
  }
  return false;
}

async function findPassword() {
  console.log('🔍 Recherche du mot de passe pour correct@gmail.com...\n');
  
  for (const password of commonPasswords) {
    const found = await testPassword(password);
    if (found) {
      console.log('\n🎉 MOT DE PASSE TROUVÉ !');
      break;
    }
    // Petite pause pour éviter de surcharger le serveur
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🔍 Test terminé.');
}

findPassword();
