import { firebaseStorage } from './firebaseStorage';
import { storage as memoryStorage } from './storage';
import { FIREBASE_CONFIG } from './firebaseSetup';

export async function createTestAccounts() {
  console.log('🔧 Création/vérification des comptes de test...');
  
  try {
    // Création des 3 comptes PRO pour tester les différents plans d'abonnement
    console.log('🛠️ Création comptes PRO avec plans d\'abonnement...');
    
    // Compte Basic Pro (29€/mois)
    try {
      await memoryStorage.createUser({
        email: 'basic@salon.fr',
        password: 'basic123',
        firstName: 'Basic',
        lastName: 'Professional',
        businessName: 'Salon Basic Pro',
        phone: '01 42 86 75 01',
        address: '15 Rue Basic, 75001 Paris',
        subscriptionPlan: 'basic-pro',
        subscriptionStatus: 'active'
      });
      console.log('✅ Compte BASIC PRO créé: basic@salon.fr / basic123 (29€/mois)');
    } catch (error) {
      console.log('ℹ️ Compte BASIC PRO existe déjà');
    }
    
    // Compte Advanced Pro (79€/mois)
    try {
      await memoryStorage.createUser({
        email: 'advanced@salon.fr',
        password: 'advanced123',
        firstName: 'Advanced',
        lastName: 'Professional',
        businessName: 'Salon Advanced Pro',
        phone: '01 42 86 75 02',
        address: '25 Rue Advanced, 75002 Paris',
        subscriptionPlan: 'advanced-pro',
        subscriptionStatus: 'active'
      });
      console.log('✅ Compte ADVANCED PRO créé: advanced@salon.fr / advanced123 (79€/mois)');
    } catch (error) {
      console.log('ℹ️ Compte ADVANCED PRO existe déjà');
    }
    
    // Compte Premium Pro (149€/mois)
    try {
      await memoryStorage.createUser({
        email: 'premium@salon.fr',
        password: 'premium123',
        firstName: 'Premium',
        lastName: 'Professional',
        businessName: 'Salon Premium Pro',
        phone: '01 42 86 75 03',
        address: '35 Rue Premium, 75003 Paris',
        subscriptionPlan: 'premium-pro',
        subscriptionStatus: 'active'
      });
      console.log('✅ Compte PREMIUM PRO créé: premium@salon.fr / premium123 (149€/mois)');
    } catch (error) {
      console.log('ℹ️ Compte PREMIUM PRO existe déjà');
    }
    
    // Ancien compte demo (Basic Pro par défaut)
    try {
      await memoryStorage.createUser({
        email: 'test@monapp.com',
        password: 'test1234',
        firstName: 'Excellence',
        lastName: 'Paris',
        businessName: 'Salon Excellence Paris',
        phone: '01 42 86 75 90',
        address: '15 Rue de la Paix, 75001 Paris',
        subscriptionPlan: 'basic-pro',
        subscriptionStatus: 'active'
      });
      console.log('✅ Compte DEMO (Basic Pro) créé: test@monapp.com / test1234');
    } catch (error) {
      console.log('ℹ️ Compte DEMO existe déjà');
    }

    console.log('🛠️ Création compte CLIENT de test...');
    try {
      await memoryStorage.createClientAccount({
        email: 'client@test.com',
        password: 'client123',
        firstName: 'Marie',
        lastName: 'Client'
      });
      console.log('✅ Compte CLIENT créé: client@test.com / client123');
    } catch (error) {
      console.log('ℹ️ Compte CLIENT existe déjà ou créé précédemment');
    }
    

    
    // ✅ SALON DEMO SUPPRIMÉ - Pages créées automatiquement lors inscription professionnelle
    console.log('🚫 Salon demo supprimé - création automatique lors inscription pros');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test:', error);
  }
}