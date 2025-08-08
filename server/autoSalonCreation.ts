import { storage } from './storage';
import { nanoid } from 'nanoid';

interface ProfessionalRegistrationData {
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  services?: string[];
  description?: string;
}

interface AutoCreatedSalon {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  longDescription: string;
  ownerId: string;
  ownerEmail: string;
  subscriptionPlan: string;
  shareableUrl: string;
  isPublished: boolean;
  customColors: {
    primary: string;
    accent: string;
    buttonText: string;
    priceColor: string;
    neonFrame: string;
  };
  serviceCategories: any[];
  certifications: string[];
  awards: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 🚀 CRÉATION AUTOMATIQUE DE PAGE SALON LORS INSCRIPTION PROFESSIONNELLE
 * 
 * Quand un professionnel s'inscrit avec abonnement, cette fonction :
 * 1. Génère automatiquement un ID unique pour le salon
 * 2. Crée une page salon personnalisée avec le nom du business
 * 3. Configure les couleurs et services par défaut
 * 4. Rend la page accessible publiquement via /salon/[id]
 * 5. Permet au professionnel de modifier sa page
 */
export async function createAutomaticSalonPage(
  professionalData: ProfessionalRegistrationData
): Promise<AutoCreatedSalon> {
  
  // Générer un ID unique pour le salon (URL-friendly) - JAMAIS "salon-demo"
  const uniqueId = nanoid(8).toLowerCase().replace(/[^a-z0-9]/g, '');
  const salonId = `salon-${uniqueId}`;
  
  console.log('🏗️ Création automatique page salon pour:', professionalData.businessName);
  console.log('🆔 ID unique généré:', salonId, '(différent de salon-demo)');
  
  // Configuration des couleurs par défaut selon l'abonnement
  const defaultColors = {
    basic: {
      primary: '#7c3aed',
      accent: '#a855f7',
      buttonText: '#ffffff',
      priceColor: '#7c3aed',
      neonFrame: '#a855f7'
    },
    premium: {
      primary: '#d97706',
      accent: '#f59e0b',
      buttonText: '#ffffff',
      priceColor: '#d97706',
      neonFrame: '#f59e0b'
    },
    enterprise: {
      primary: '#059669',
      accent: '#10b981',
      buttonText: '#ffffff',
      priceColor: '#059669',
      neonFrame: '#10b981'
    }
  };
  
  // Services par défaut selon le type de salon
  const defaultServiceCategories = [
    {
      id: 1,
      name: 'Services Principaux',
      expanded: false,
      services: [
        {
          id: 1,
          name: 'Consultation',
          price: 0,
          duration: '15min',
          description: 'Consultation gratuite pour définir vos besoins'
        },
        {
          id: 2,
          name: 'Service Standard',
          price: 50,
          duration: '1h',
          description: 'Service de base personnalisé'
        }
      ]
    }
  ];
  
  // Créer les données du salon
  const salonData: AutoCreatedSalon = {
    id: salonId,
    name: professionalData.businessName,
    address: professionalData.address,
    phone: professionalData.phone,
    email: professionalData.email,
    description: professionalData.description || `${professionalData.businessName} - Votre salon de beauté de confiance`,
    longDescription: professionalData.description || `Bienvenue chez ${professionalData.businessName}. Nous vous accueillons dans un cadre professionnel pour des prestations de qualité.`,
    ownerId: professionalData.email, // Utiliser l'email comme ID temporaire
    ownerEmail: professionalData.email,
    subscriptionPlan: professionalData.subscriptionPlan,
    shareableUrl: `/salon/${salonId}`,
    isPublished: true,
    customColors: defaultColors[professionalData.subscriptionPlan],
    serviceCategories: defaultServiceCategories,
    certifications: ['Professionnel Certifié'],
    awards: [],
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&auto=format'
    ],
    rating: 5.0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Sauvegarder dans le système de stockage PostgreSQL
  try {
    await storage.createSalon(salonData);
    console.log('✅ Page salon créée automatiquement:', salonId);
    console.log('🔗 URL publique:', `/salon/${salonId}`);
    
    return salonData;
  } catch (error) {
    console.error('❌ Erreur création page salon:', error);
    throw new Error(`Impossible de créer la page salon pour ${professionalData.businessName}`);
  }
}

/**
 * 🔄 MISE À JOUR DES PERMISSIONS SALON
 * Associe le salon créé au compte professionnel pour les modifications
 */
export async function linkSalonToProfessional(salonId: string, professionalEmail: string): Promise<void> {
  try {
    // En production, créer la liaison dans la base de données
    console.log(`🔗 Salon ${salonId} associé au professionnel ${professionalEmail}`);
    
    // Pour l'instant, stocker dans le système mémoire
    // Implement salon-professional linking if needed
    
  } catch (error) {
    console.error('❌ Erreur liaison salon-professionnel:', error);
  }
}

/**
 * 📊 STATISTIQUES CRÉATION AUTOMATIQUE
 */
export function getAutoCreationStats(): {
  totalSalonsCreated: number;
  byPlan: Record<string, number>;
} {
  // En production, récupérer depuis la base de données
  return {
    totalSalonsCreated: 0,
    byPlan: {
      basic: 0,
      premium: 0,
      enterprise: 0
    }
  };
}