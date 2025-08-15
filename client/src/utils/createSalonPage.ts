/**
 * Utilitaire pour créer une nouvelle page salon avec le template standardisé
 */

export interface CreateSalonPageConfig {
  salonName: string;
  salonSlug: string;
  customCoverImage?: string;
  customAddress?: string;
  customPhone?: string;
  customDescription?: string;
  customServices?: Array<{
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
  }>;
  customStaff?: Array<{
    name: string;
    role: string;
    specialties: string[];
    avatar?: string;
  }>;
  customOpeningHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
}

/**
 * Génère le code TypeScript pour une nouvelle page salon
 */
export function generateSalonPageCode(config: CreateSalonPageConfig): string {
  const {
    salonName,
    salonSlug,
    customCoverImage,
    customAddress,
    customPhone,
    customDescription,
    customServices,
    customStaff,
    customOpeningHours
  } = config;

  const componentName = salonSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function ${componentName}() {
  const salonSlug = '${salonSlug}';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à ${salonName}
  const defaultData = getDefaultSalonData('${salonName}', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: '${salonName}',${customDescription ? `
    description: '${customDescription}',` : ''}${customAddress ? `
    address: '${customAddress}',` : ''}${customPhone ? `
    phone: '${customPhone}',` : ''}${customCoverImage ? `
    coverImageUrl: '${customCoverImage}',` : ''}${customOpeningHours ? `
    openingHours: ${JSON.stringify(customOpeningHours, null, 6).replace(/^/gm, '    ')},` : ''}
  };

  ${customServices ? `const customizedServices = services.length > 0 ? services : [
${customServices.map((service, index) => `    {
      id: ${index + 1},
      name: "${service.name}",
      description: "${service.description}",
      price: ${service.price},
      duration: ${service.duration},
      category: "${service.category}"
    }`).join(',\n')}
  ];` : 'const customizedServices = services.length > 0 ? services : defaultData.services;'}

  ${customStaff ? `const customizedStaff = staff.length > 0 ? staff : [
${customStaff.map((member, index) => `    {
      id: ${index + 1},
      name: "${member.name}",
      role: "${member.role}",
      specialties: ${JSON.stringify(member.specialties)},
      rating: 4.8,
      reviewsCount: ${Math.floor(Math.random() * 100) + 20}${member.avatar ? `,
      avatar: "${member.avatar}"` : ''}
    }`).join(',\n')}
  ];` : 'const customizedStaff = staff.length > 0 ? staff : defaultData.staff;'}

  const customizedReviews = reviews.length > 0 ? reviews : defaultData.reviews;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <SalonPageTemplate
      salonData={customizedSalonData}
      services={customizedServices}
      staff={customizedStaff}
      reviews={customizedReviews}
      isOwner={isOwner}
    />
  );
}`;
}

/**
 * Liste des salons de démonstration à créer/mettre à jour
 */
export const DEMO_SALONS: CreateSalonPageConfig[] = [
  {
    salonName: 'Salon Excellence Paris',
    salonSlug: 'salon-excellence-paris',
    customCoverImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    customAddress: '45 Avenue des Champs-Élysées, 75008 Paris',
    customPhone: '01 42 89 15 67',
    customDescription: 'Salon de coiffure haut de gamme sur les Champs-Élysées - Excellence et innovation',
    customServices: [
      { name: 'Coupe Femme Premium', description: 'Coupe sur-mesure avec consultation style', price: 85, duration: 90, category: 'coiffure' },
      { name: 'Coloration Expert', description: 'Coloration professionnelle avec produits premium', price: 120, duration: 150, category: 'coiffure' },
      { name: 'Brushing Signature', description: 'Mise en forme professionnelle longue durée', price: 45, duration: 60, category: 'coiffure' },
      { name: 'Soin Restructurant', description: 'Soin réparateur intensif cheveux abîmés', price: 65, duration: 45, category: 'soins' }
    ],
    customStaff: [
      { name: 'Isabelle Moreau', role: 'Directrice Artistique', specialties: ['Coupe', 'Coloration', 'Formation'], avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
      { name: 'Alexandre Dubois', role: 'Coloriste Expert', specialties: ['Balayage', 'Coloration', 'Conseil'] },
      { name: 'Sophie Laurent', role: 'Coiffeuse Senior', specialties: ['Coupe', 'Brushing', 'Événementiel'] }
    ]
  },
  {
    salonName: 'Institut Belle Époque',
    salonSlug: 'institut-belle-epoque',
    customCoverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    customAddress: '28 Rue de Rivoli, 75004 Paris',
    customPhone: '01 44 61 23 88',
    customDescription: 'Institut de beauté traditionnelle - Soins d\'exception depuis 1923',
    customServices: [
      { name: 'Soin Visage Signature', description: 'Soin anti-âge personnalisé 90 minutes', price: 95, duration: 90, category: 'soins' },
      { name: 'Massage Relaxant', description: 'Massage corps complet aux huiles essentielles', price: 75, duration: 60, category: 'bien-être' },
      { name: 'Épilation Intégrale', description: 'Épilation complète à la cire chaude', price: 65, duration: 75, category: 'épilation' },
      { name: 'Manucure Française', description: 'Soin complet des mains avec pose vernis', price: 40, duration: 45, category: 'ongles' }
    ],
    customStaff: [
      { name: 'Céleste Moreau', role: 'Esthéticienne Expert', specialties: ['Soins anti-âge', 'Massage', 'Conseil'] },
      { name: 'Amélie Rousseau', role: 'Spécialiste Ongles', specialties: ['Manucure', 'Pédicure', 'Nail art'] }
    ]
  },
  {
    salonName: 'Modern Hair Studio',
    salonSlug: 'modern-hair-studio',
    customCoverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    customAddress: '12 Rue de la Paix, 75002 Paris',
    customPhone: '01 47 03 22 41',
    customDescription: 'Studio de coiffure moderne - Créativité et tendances actuelles',
    customServices: [
      { name: 'Coupe Tendance', description: 'Coupe moderne selon les dernières tendances', price: 55, duration: 60, category: 'coiffure' },
      { name: 'Coloration Fantasy', description: 'Colorations audacieuses et créatives', price: 90, duration: 120, category: 'coiffure' },
      { name: 'Lissage Brésilien', description: 'Traitement lissant longue durée', price: 150, duration: 180, category: 'soins' },
      { name: 'Extensions Cheveux', description: 'Pose d\'extensions naturelles ou colorées', price: 200, duration: 120, category: 'extensions' }
    ]
  }
];

/**
 * Crée les routes pour tous les salons de démonstration
 */
export function generateSalonRoutes(): string {
  return DEMO_SALONS.map(salon => {
    const componentName = salon.salonSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    return `        <Route path="/salons/${salon.salonSlug}" component={${componentName}} />`;
  }).join('\n');
}

/**
 * Génère les imports pour tous les salons
 */
export function generateSalonImports(): string {
  return DEMO_SALONS.map(salon => {
    const componentName = salon.salonSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    return `import ${componentName} from '@/pages/salons/${componentName}';`;
  }).join('\n');
}