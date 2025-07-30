// Configuration pour activer Firebase facilement
export const FIREBASE_CONFIG = {
  // Par défaut, utiliser le stockage en mémoire pour la stabilité
  USE_FIREBASE: process.env.USE_FIREBASE === 'true' || false,
  
  // Vérifier si toutes les clés Firebase sont présentes
  hasFirebaseSecrets: () => {
    return !!(
      process.env.VITE_FIREBASE_API_KEY &&
      process.env.VITE_FIREBASE_PROJECT_ID &&
      process.env.VITE_FIREBASE_APP_ID
    );
  },
  
  // Log de l'état de la configuration
  logStatus: () => {
    if (FIREBASE_CONFIG.USE_FIREBASE) {
      if (FIREBASE_CONFIG.hasFirebaseSecrets()) {
        console.log('🔥 Firebase configuré et activé');
      } else {
        console.log('⚠️ Firebase activé mais secrets manquants, fallback vers stockage mémoire');
      }
    } else {
      console.log('💾 Utilisation du stockage en mémoire (PostgreSQL)');
    }
  }
};

// Instructions pour activer Firebase
export const FIREBASE_INSTRUCTIONS = `
🔥 POUR ACTIVER FIREBASE :

1. Ajoutez cette variable d'environnement :
   USE_FIREBASE=true

2. Redémarrez l'application

3. Vos données seront automatiquement migrées vers Firebase !

Avantages de Firebase :
- Base de données temps réel
- Notifications instantanées  
- Synchronisation live entre pros et clients
- Stockage cloud pour images
- Scalabilité automatique
`;