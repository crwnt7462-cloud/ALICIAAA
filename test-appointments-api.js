// Script pour tester l'API des appointments
import http from 'http';

// 1. Test de login
function login() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'kikou@gmail.com',
      password: 'motdepasse'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📝 Login Response:', res.statusCode);
        console.log('📝 Headers:', res.headers);
        console.log('📝 Body:', data);
        
        // Extraire le cookie de session
        const cookies = res.headers['set-cookie'];
        resolve(cookies);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 2. Test des appointments avec cookie de session
function getAppointments(cookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/appointments?date=2025-01-06',
      method: 'GET',
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('\n🗓️ Appointments Response:', res.statusCode);
        console.log('🗓️ Body:', data);
        resolve(data);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Exécution
async function testAPI() {
  try {
    console.log('🔐 Test de connexion...');
    const cookies = await login();
    
    console.log('\n📅 Test des appointments...');
    await getAppointments(cookies);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPI();
