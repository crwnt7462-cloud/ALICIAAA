import { firebaseStorage } from './firebaseStorage';
import { storage as memoryStorage } from './storage';
import { FIREBASE_CONFIG } from './firebaseSetup';

export async function createTestAccounts() {
  console.log('🔧 Création/vérification des comptes de test...');
  
  try {
    // Forcer la création de nouveaux comptes avec mots de passe hachés valides
    console.log('🛠️ Création compte PRO de test...');
    try {
      await memoryStorage.createUser({
        email: 'test@monapp.com',
        password: 'test1234',
        firstName: 'Excellence',
        lastName: 'Paris',
        businessName: 'Salon Excellence Paris',
        phone: '01 42 86 75 90',
        address: '15 Rue de la Paix, 75001 Paris'
      });
      console.log('✅ Compte PRO créé: test@monapp.com / test1234');
    } catch (error) {
      console.log('ℹ️ Compte PRO existe déjà ou créé précédemment');
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