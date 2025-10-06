// Script pour créer un salon pour kikou@gmail.com
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000';

async function createSalonForKikou() {
  try {
    // 1. Login first
    console.log('🔐 Connexion en tant que kikou@gmail.com...');
    const loginResponse = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'kikou@gmail.com',
        password: 'motdepasse'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    // Extraire les cookies de session
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('✅ Connexion réussie');

    // 2. Create salon
    console.log('🏢 Création du salon...');
    const salonData = {
      name: "Salon de Kikou",
      description: "Mon salon de beauté",
      business_phone: "0123456789",
      business_address: "123 Rue de la Beauté, 75001 Paris",
      facebook: "",
      instagram: "",
      tiktok: "",
      service_categories: [
        {
          id: 'cat-coiffure',
          name: 'Coiffure',
          description: 'Services de coiffure',
          services: [
            {
              id: 'service-coupe',
              name: 'Coupe',
              price: 30,
              duration: '01:00',
              description: 'Coupe de cheveux'
            }
          ]
        }
      ],
      team_members: [
        {
          id: Date.now(),
          name: 'Kikou',
          bio: 'Coiffeuse expérimentée',
          role: 'Coiffeuse',
          avatar: '',
          rating: 5,
          nextSlot: '',
          experience: '5 ans',
          specialties: ['Coupe', 'Coloration'],
          reviewsCount: 10,
          availableToday: true
        }
      ]
    };

    const salonResponse = await fetch(`${API_BASE}/api/salon/create-personalized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(salonData)
    });

    if (!salonResponse.ok) {
      const error = await salonResponse.text();
      throw new Error(`Salon creation failed: ${salonResponse.status} - ${error}`);
    }

    const salonResult = await salonResponse.json();
    console.log('✅ Salon créé avec succès:', salonResult);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createSalonForKikou();
