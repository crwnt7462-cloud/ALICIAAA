import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK
let adminApp;

if (getApps().length === 0) {
  // En production, utiliser les variables d'environnement pour les credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`
    });
  } else {
    // En développement, utiliser les émulateurs
    adminApp = initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'demo-project'
    });
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;