// Configuration par défaut pour tous les salons utilisant le template unifié
export interface DefaultSalonData {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  coverImageUrl: string;
  customColors: {
    primary: string;
    accent: string;
    buttonText: string;
    intensity: number;
  };
  serviceCategories: Array<{
    id: number;
    name: string;
    services: Array<{
      id: number;
      name: string;
      price: number;
      duration: number;
      description?: string;
    }>;
  }>;
  requireDeposit?: boolean;
  depositPercentage?: number;
}

// Salon Avyento Démo - Couleur rouge comme configuré
export const avyentoDemoSalon: DefaultSalonData = {
  id: 'avyento-demo',
  name: 'Avyento Salon Démo',
  description: 'Salon de démonstration avec toutes les fonctionnalités Premium Pro',
  address: '123 Avenue des Champs-Élysées, 75008 Paris',
  phone: '01 42 86 98 15',
  email: 'demo@avyento.com',
  rating: 4.9,
  reviewCount: 147,
  photos: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#e11d48', // Rouge comme configuré
    accent: '#171519',
    buttonText: '#ffffff',
    intensity: 59
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Coiffure',
      services: [
        { id: 1, name: 'Coupe + Brushing', price: 65, duration: 60, description: 'Coupe personnalisée avec brushing professionnel' },
        { id: 2, name: 'Coloration', price: 85, duration: 120, description: 'Coloration complète avec soin' },
        { id: 3, name: 'Balayage', price: 120, duration: 180, description: 'Technique balayage à la main' }
      ]
    },
    {
      id: 2,
      name: 'Soins',
      services: [
        { id: 4, name: 'Soin restructurant', price: 45, duration: 45, description: 'Soin profond pour cheveux abîmés' },
        { id: 5, name: 'Massage du cuir chevelu', price: 35, duration: 30, description: 'Massage relaxant et stimulant' }
      ]
    }
  ],
  requireDeposit: true,
  depositPercentage: 30
};

// Salon Excellence Paris
export const excellenceParisSalon: DefaultSalonData = {
  id: 'salon-excellence-paris',
  name: 'Salon Excellence Paris',
  description: 'Salon de coiffure haut de gamme au cœur de Paris',
  address: '15 Rue de la Paix, 75002 Paris',
  phone: '01 42 96 85 47',
  email: 'contact@excellence-paris.fr',
  rating: 4.8,
  reviewCount: 203,
  photos: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#7c3aed',
    accent: '#a855f7',
    buttonText: '#ffffff',
    intensity: 35
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Coiffure Femme',
      services: [
        { id: 1, name: 'Coupe + Brushing', price: 75, duration: 60 },
        { id: 2, name: 'Coloration Premium', price: 95, duration: 140 },
        { id: 3, name: 'Mèches', price: 110, duration: 160 }
      ]
    },
    {
      id: 2,
      name: 'Coiffure Homme',
      services: [
        { id: 4, name: 'Coupe Homme', price: 45, duration: 45 },
        { id: 5, name: 'Barbe', price: 25, duration: 30 }
      ]
    }
  ]
};

// Institut Beauté Saint-Germain
export const instituteSaintGermainSalon: DefaultSalonData = {
  id: 'institut-beaute-saint-germain',
  name: 'Institut Beauté Saint-Germain',
  description: 'Institut de beauté et bien-être dans le quartier Saint-Germain',
  address: '8 Boulevard Saint-Germain, 75005 Paris',
  phone: '01 43 26 71 89',
  email: 'contact@institut-saint-germain.fr',
  rating: 4.7,
  reviewCount: 156,
  photos: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#059669',
    accent: '#10b981',
    buttonText: '#ffffff',
    intensity: 40
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Soins du visage',
      services: [
        { id: 1, name: 'Soin hydratant', price: 65, duration: 60 },
        { id: 2, name: 'Nettoyage de peau', price: 85, duration: 75 },
        { id: 3, name: 'Soin anti-âge', price: 120, duration: 90 }
      ]
    },
    {
      id: 2,
      name: 'Épilation',
      services: [
        { id: 4, name: 'Épilation jambes complètes', price: 45, duration: 45 },
        { id: 5, name: 'Épilation maillot', price: 35, duration: 30 }
      ]
    }
  ]
};

// Beauty Lounge Montparnasse
export const beautyLoungeMontparnasseSalon: DefaultSalonData = {
  id: 'beauty-lounge-montparnasse',
  name: 'Beauty Lounge Montparnasse',
  description: 'Lounge beauté moderne dans le quartier Montparnasse',
  address: '42 Avenue du Maine, 75014 Paris',
  phone: '01 43 20 56 78',
  email: 'hello@beauty-lounge.fr',
  rating: 4.6,
  reviewCount: 89,
  photos: [
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#dc2626',
    accent: '#ef4444',
    buttonText: '#ffffff',
    intensity: 45
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Manucure',
      services: [
        { id: 1, name: 'Manucure classique', price: 35, duration: 45 },
        { id: 2, name: 'Pose vernis semi-permanent', price: 45, duration: 60 },
        { id: 3, name: 'Nail art', price: 55, duration: 75 }
      ]
    },
    {
      id: 2,
      name: 'Pédicure',
      services: [
        { id: 4, name: 'Pédicure complète', price: 50, duration: 60 },
        { id: 5, name: 'Soin des pieds', price: 40, duration: 45 }
      ]
    }
  ]
};

// Beauty Lash Studio
export const beautyLashStudioSalon: DefaultSalonData = {
  id: 'beauty-lash-studio',
  name: 'Beauty Lash Studio',
  description: 'Spécialiste des extensions de cils et regard',
  address: '25 Rue du Faubourg Saint-Antoine, 75011 Paris',
  phone: '01 43 71 92 34',
  email: 'contact@beauty-lash.fr',
  rating: 4.9,
  reviewCount: 234,
  photos: [
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#9333ea',
    accent: '#a855f7',
    buttonText: '#ffffff',
    intensity: 50
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Extensions de cils',
      services: [
        { id: 1, name: 'Pose volume russe', price: 85, duration: 120 },
        { id: 2, name: 'Pose classique', price: 65, duration: 90 },
        { id: 3, name: 'Retouche', price: 45, duration: 60 }
      ]
    },
    {
      id: 2,
      name: 'Sourcils',
      services: [
        { id: 4, name: 'Restructuration sourcils', price: 35, duration: 45 },
        { id: 5, name: 'Teinture sourcils', price: 25, duration: 30 }
      ]
    }
  ]
};

// Salon Moderne République
export const salonModerneRepubliqueSalon: DefaultSalonData = {
  id: 'salon-moderne-republique',
  name: 'Salon Moderne République',
  description: 'Salon de coiffure tendance près de République',
  address: '18 Boulevard du Temple, 75011 Paris',
  phone: '01 43 55 67 89',
  email: 'info@salon-moderne.fr',
  rating: 4.5,
  reviewCount: 178,
  photos: [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#0ea5e9',
    accent: '#38bdf8',
    buttonText: '#ffffff',
    intensity: 42
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Coiffure Tendance',
      services: [
        { id: 1, name: 'Coupe moderne', price: 55, duration: 50 },
        { id: 2, name: 'Coloration fantaisie', price: 95, duration: 150 },
        { id: 3, name: 'Lissage brésilien', price: 150, duration: 180 }
      ]
    }
  ]
};

// Barbier Gentleman Marais
export const barbierGentlemanMaraisSalon: DefaultSalonData = {
  id: 'barbier-gentleman-marais',
  name: 'Barbier Gentleman Marais',
  description: 'Barbier traditionnel dans le cœur historique du Marais',
  address: '7 Rue des Rosiers, 75004 Paris',
  phone: '01 42 72 85 96',
  email: 'contact@gentleman-barbier.fr',
  rating: 4.8,
  reviewCount: 312,
  photos: [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&crop=center'
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&crop=center',
  customColors: {
    primary: '#92400e',
    accent: '#d97706',
    buttonText: '#ffffff',
    intensity: 48
  },
  serviceCategories: [
    {
      id: 1,
      name: 'Services Barbier',
      services: [
        { id: 1, name: 'Coupe traditionnelle', price: 35, duration: 45 },
        { id: 2, name: 'Rasage à la lame', price: 25, duration: 30 },
        { id: 3, name: 'Coupe + Barbe', price: 50, duration: 60 }
      ]
    },
    {
      id: 2,
      name: 'Soins Homme',
      services: [
        { id: 4, name: 'Soin du visage homme', price: 45, duration: 45 },
        { id: 5, name: 'Taille moustache', price: 15, duration: 15 }
      ]
    }
  ]
};

// Export de tous les salons de démo
export const demoSalons = {
  'avyento-demo': avyentoDemoSalon,
  'salon-excellence-paris': excellenceParisSalon,
  'institut-beaute-saint-germain': instituteSaintGermainSalon,
  'beauty-lounge-montparnasse': beautyLoungeMontparnasseSalon,
  'beauty-lash-studio': beautyLashStudioSalon,
  'salon-moderne-republique': salonModerneRepubliqueSalon,
  'barbier-gentleman-marais': barbierGentlemanMaraisSalon
};

// Fonction pour obtenir les données d'un salon démo
export function getDemoSalonData(salonSlug: string): DefaultSalonData | null {
  return demoSalons[salonSlug as keyof typeof demoSalons] || null;
}

// Fonction pour créer un nouveau salon avec les données par défaut
export function createDefaultSalonData(overrides: Partial<DefaultSalonData>): DefaultSalonData {
  const defaultData: DefaultSalonData = {
    id: overrides.id || 'nouveau-salon',
    name: overrides.name || 'Nouveau Salon',
    description: overrides.description || 'Description de votre salon',
    address: overrides.address || 'Votre adresse',
    phone: overrides.phone || '01 XX XX XX XX',
    email: overrides.email || 'contact@votre-salon.fr',
    rating: 4.8,
    reviewCount: 0,
    photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center'],
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center',
    customColors: {
      primary: '#8b5cf6',
      accent: '#f59e0b',
      buttonText: '#ffffff',
      intensity: 40
    },
    serviceCategories: [
      {
        id: 1,
        name: 'Services Principaux',
        services: [
          { id: 1, name: 'Service de base', price: 50, duration: 60, description: 'Service principal de votre salon' }
        ]
      }
    ],
    requireDeposit: false,
    depositPercentage: 30
  };

  return { ...defaultData, ...overrides };
}