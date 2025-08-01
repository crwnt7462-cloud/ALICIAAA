import { db } from './db';
import { services, staff, users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
    console.log('🌱 Ajout des données de test...');

    // Vérifier si l'utilisateur de test existe déjà
    const existingUser = await db.select().from(users).where(eq(users.email, 'test@monapp.com')).limit(1);
    
    let testUserId = '1';
    if (existingUser.length === 0) {
      // Créer un utilisateur de test
      const hashedPassword = await bcrypt.hash('test1234', 10);
      const [newUser] = await db.insert(users).values({
        id: testUserId,
        email: 'test@monapp.com',
        passwordHash: hashedPassword,
        firstName: 'Demo',
        lastName: 'Paris',
        businessName: 'Salon Demo Paris',
        phone: '01 42 86 75 90',
        address: '15 Rue de la Paix, 75001 Paris',
        mentionHandle: '@usemyrr',
        isActive: true,
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active'
      }).returning();
      testUserId = newUser.id;
    } else {
      testUserId = existingUser[0].id;
    }

    // Vérifier si les services existent déjà
    const existingServices = await db.select().from(services).where(eq(services.userId, testUserId));
    
    if (existingServices.length === 0) {
      // Ajouter des services réels
      const salonServices = [
        {
          userId: testUserId,
          name: 'Coupe + Brushing Premium',
          description: 'Coupe personnalisée avec brushing professionnel par nos experts. Consultation incluse.',
          price: '85.00',
          duration: 60,
          category: 'Coiffure',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Coloration Complète Luxe',
          description: 'Coloration haut de gamme avec soins capillaires L\'Oréal Professionnel. Garantie couleur 6 semaines.',
          price: '120.00',
          duration: 120,
          category: 'Coiffure',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Soin Visage Anti-Âge',
          description: 'Soin premium hydratant et raffermissant. Produits Sothys. Résultats visibles immédiatement.',
          price: '95.00',
          duration: 75,
          category: 'Esthétique',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Manucure Française Parfaite',
          description: 'Manucure complète avec french parfaite. Vernis gel longue tenue. Tenue 3 semaines.',
          price: '45.00',
          duration: 45,
          category: 'Ongles',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Épilation Sourcils Design',
          description: 'Restructuration complète des sourcils selon la morphologie du visage. Technique de précision.',
          price: '25.00',
          duration: 20,
          category: 'Esthétique',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Massage Relaxant Corps',
          description: 'Massage détente 60min aux huiles essentielles bio. Évacuation complète du stress.',
          price: '80.00',
          duration: 60,
          category: 'Bien-être',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Balayage Californien',
          description: 'Technique de balayage naturel pour un effet soleil. Spécialiste cheveux blonds.',
          price: '140.00',
          duration: 180,
          category: 'Coiffure',
          isActive: true
        },
        {
          userId: testUserId,
          name: 'Extension Cils Volume',
          description: 'Pose d\'extensions cils effet volume russe. Tenue 4-6 semaines. Look glamour garanti.',
          price: '75.00',
          duration: 90,
          category: 'Esthétique',
          isActive: true
        }
      ];

      await db.insert(services).values(salonServices);
      console.log('✅ Services ajoutés avec succès');
    }

    // Ajouter du staff si inexistant
    const existingStaff = await db.select().from(staff).where(eq(staff.userId, testUserId));
    
    if (existingStaff.length === 0) {
      const salonStaff = [
        {
          userId: testUserId,
          firstName: 'Sophie',
          lastName: 'Martinez',
          email: 'sophie@excellence-paris.fr',
          phone: '01 42 86 75 91',
          role: 'coiffeuse',
          specialization: 'Coiffure & Coloration',
          experience: 8,
          isActive: true,
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: { start: '09:00', end: '18:00' }
        },
        {
          userId: testUserId,
          firstName: 'Emma',
          lastName: 'Dubois',
          email: 'emma@excellence-paris.fr',
          phone: '01 42 86 75 92',
          role: 'estheticienne',
          specialization: 'Esthétique & Soins',
          experience: 5,
          isActive: true,
          workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          workingHours: { start: '10:00', end: '19:00' }
        },
        {
          userId: testUserId,
          firstName: 'Luna',
          lastName: 'Rodriguez',
          email: 'luna@excellence-paris.fr',
          phone: '01 42 86 75 93',
          role: 'manucure',
          specialization: 'Ongles & Manucure',
          experience: 6,
          isActive: true,
          workingDays: ['monday', 'wednesday', 'thursday', 'friday', 'saturday'],
          workingHours: { start: '09:30', end: '17:30' }
        }
      ];

      await db.insert(staff).values(salonStaff);
      console.log('✅ Équipe ajoutée avec succès');
    }

    console.log('✅ Données de test créées avec succès');
    console.log('Compte PRO: test@monapp.com / test1234');
    console.log('Handle PRO: @usemyrr');
    console.log('Compte CLIENT: client@test.com / client123');
    
    // Créer un salon pour le compte test (après les imports)
    setTimeout(() => {
      import('./storage.js').then(({ storage }) => {
        storage.saveSalonData('salon-demo', {
          id: 'salon-demo',
          userId: testUserId,
          name: 'Demo Paris - Salon Demo',
          description: 'Salon de beauté moderne lié au compte test@monapp.com',
          longDescription: `Notre salon Demo Paris vous accueille depuis plus de 15 ans dans un cadre moderne et chaleureux. 
          
Spécialisés dans les coupes tendances et les soins personnalisés, notre équipe d'experts est formée aux dernières techniques et utilise exclusivement des produits de qualité professionnelle.

Situé au cœur du 8ème arrondissement, nous proposons une gamme complète de services pour sublimer votre beauté naturelle.`,
          address: '15 Avenue des Champs-Élysées, 75008 Paris',
          phone: '01 42 25 76 89',
          rating: 4.8,
          reviews: 247,
          verified: true,
          certifications: [
            'Salon labellisé L\'Oréal Professionnel',
            'Formation continue Kérastase',
            'Certification bio Shu Uemura'
          ],
          awards: [
            'Élu Meilleur Salon Paris 8ème 2023',
            'Prix de l\'Innovation Beauté 2022',
            'Certification Éco-responsable'
          ],
          serviceCategories: [
            {
              id: 1,
              name: 'Cheveux',
              expanded: true,
              services: [
                { id: 1, name: 'Coupe & Brushing', price: 45, duration: '1h', description: 'Coupe personnalisée et brushing professionnel' },
                { id: 2, name: 'Coloration', price: 80, duration: '2h', description: 'Coloration complète avec soins' },
                { id: 3, name: 'Mèches', price: 120, duration: '2h30', description: 'Mèches naturelles ou colorées' },
                { id: 4, name: 'Coupe Enfant', price: 25, duration: '30min', description: 'Coupe adaptée aux enfants -12 ans' }
              ]
            },
            {
              id: 2,
              name: 'Soins Visage',
              expanded: false,
              services: [
                { id: 5, name: 'Soin du visage classique', price: 65, duration: '1h15', description: 'Nettoyage, gommage et hydratation' },
                { id: 6, name: 'Soin anti-âge', price: 95, duration: '1h30', description: 'Soin complet avec technologies avancées' },
                { id: 7, name: 'Épilation sourcils', price: 20, duration: '20min', description: 'Épilation et restructuration' }
              ]
            }
          ]
        });
        console.log('💎 SALON DEMO: salon-demo lié au compte test');
      });
    }, 100);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
}