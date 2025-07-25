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
        firstName: 'Excellence',
        lastName: 'Paris',
        businessName: 'Salon Excellence Paris',
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

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
}