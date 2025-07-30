import { firebaseStorage } from './firebaseStorage';
import { storage as memoryStorage } from './storage';
import { FIREBASE_CONFIG } from './firebaseSetup';

export async function createTestAccounts() {
  console.log('💾 Comptes de test déjà disponibles dans PostgreSQL');
  console.log('✅ Compte PRO: test@monapp.com / test1234');
  console.log('✅ Compte CLIENT: client@test.com / client123');
  
  // Les comptes existent déjà, pas besoin de les recréer
  try {
    

    
    // Créer des données de salon pour le test
    await memoryStorage.saveSalonData('salon-demo', {
      id: 'salon-demo',
      name: 'Salon Excellence Paris',
      address: '15 Rue de la Paix, 75001 Paris',
      phone: '01 42 86 75 90',
      description: 'Salon de beauté haut de gamme au cœur de Paris',
      longDescription: 'Découvrez notre salon de beauté d\'exception situé rue de la Paix. Nos experts vous accueillent dans un cadre luxueux pour des prestations sur-mesure.',
      rating: 4.8,
      reviewCount: 127,
      serviceCategories: [
        {
          id: 1,
          name: 'Coiffure',
          expanded: false,
          services: [
            {
              id: 1,
              name: 'Coupe + Brushing Premium',
              price: 85,
              duration: '1h',
              description: 'Coupe personnalisée avec brushing professionnel'
            },
            {
              id: 2,
              name: 'Coloration Complète',
              price: 120,
              duration: '2h',
              description: 'Coloration haut de gamme avec soins'
            }
          ]
        },
        {
          id: 2,
          name: 'Esthétique',
          expanded: false,
          services: [
            {
              id: 3,
              name: 'Soin Visage Anti-Âge',
              price: 95,
              duration: '1h15',
              description: 'Soin premium hydratant et raffermissant'
            }
          ]
        }
      ],
      certifications: [
        'Salon Certifié L\'Oréal Professionnel',
        'Expert Coloriste Certifié',
        'Formation Continue Sothys'
      ],
      awards: [
        'Prix du Meilleur Salon 2024 - Paris 1er',
        'Excellence Service Client 2023',
        'Salon Éco-Responsable Certifié'
      ],
      customColors: {
        primary: '#7c3aed',
        accent: '#a855f7',
        buttonText: '#ffffff',
        priceColor: '#7c3aed',
        neonFrame: '#a855f7'
      },
      isPublished: true
    });
    
    console.log('💎 SALON DEMO: salon-demo créé avec données complètes');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test:', error);
  }
}