/**
 * TEMPLATE UNIQUE AVYENTO SALON
 * 
 * Ce fichier contient la configuration complète du design actuel de la page salon
 * comme template unique et standardisé pour toutes les pages /salon/
 * 
 * Généré à partir du design parfait de SalonPage.tsx - 21 Août 2025
 */

export interface AvyentoSalonTemplate {
  // Configuration du salon
  salonData: {
    name: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    priceRange: string;
    address: string;
    backgroundImage: string;
  };
  
  // Couleurs du thème
  colors: {
    primary: string;
    background: {
      gradient: string;
      overlay: string;
    };
    glass: {
      background: string;
      border: string;
      backdrop: string;
    };
  };
  
  // Structure des onglets
  tabs: Array<{
    id: string;
    label: string;
  }>;
  
  // Catégories de services avec structure complète
  serviceCategories: Array<{
    id: string;
    name: string;
    description: string;
    services: Array<{
      name: string;
      price: number;
      duration: number;
      description: string;
      photo: string;
      rating: number;
      reviews: number;
    }>;
  }>;
  
  // Équipe
  teamMembers: Array<{
    name: string;
    role: string;
    photo: string;
    specialties: string[];
  }>;
  
  // Configuration UI
  ui: {
    containerMaxWidth: string;
    spacing: {
      section: string;
      card: string;
    };
    borderRadius: {
      card: string;
      button: string;
      image: string;
    };
    animation: {
      hover: string;
      transition: string;
    };
  };
}

// Template Avyento Salon - Configuration complète du design actuel
export const AVYENTO_SALON_TEMPLATE: AvyentoSalonTemplate = {
  salonData: {
    name: "Salon Avyento",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€€",
    address: "75001 Paris, France",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80"
  },
  
  colors: {
    primary: "#8b5cf6", // Violet Avyento
    background: {
      gradient: "bg-gradient-to-br from-violet-50 to-purple-50",
      overlay: "bg-black/20"
    },
    glass: {
      background: "bg-white/70",
      border: "border-violet-100/30",
      backdrop: "backdrop-blur-16"
    }
  },
  
  tabs: [
    { id: 'services', label: 'Services' },
    { id: 'equipe', label: 'Équipe' },
    { id: 'galerie', label: 'Galerie' },
    { id: 'infos', label: 'Infos' },
    { id: 'avis', label: 'Avis' }
  ],
  
  serviceCategories: [
    {
      id: 'coiffure',
      name: 'Coiffure',
      description: 'Coupes, colorations et soins capillaires',
      services: [
        {
          name: 'Coupe + Brushing',
          price: 45,
          duration: 60,
          description: 'Coupe personnalisée avec brushing professionnel',
          photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
          rating: 4.8,
          reviews: 23
        },
        {
          name: 'Coloration complète',
          price: 85,
          duration: 120,
          description: 'Coloration permanente avec soin protecteur',
          photo: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop&q=80',
          rating: 4.9,
          reviews: 18
        },
        {
          name: 'Mèches + Balayage',
          price: 95,
          duration: 150,
          description: 'Technique de balayage pour un effet naturel',
          photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
          rating: 4.7,
          reviews: 31
        }
      ]
    },
    {
      id: 'esthetique',
      name: 'Esthétique',
      description: 'Soins du visage et épilation',
      services: [
        {
          name: 'Soin visage purifiant',
          price: 65,
          duration: 75,
          description: 'Nettoyage en profondeur et hydratation',
          photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&q=80',
          rating: 4.6,
          reviews: 14
        },
        {
          name: 'Épilation sourcils',
          price: 25,
          duration: 30,
          description: 'Mise en forme professionnelle des sourcils',
          photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
          rating: 4.8,
          reviews: 42
        }
      ]
    }
  ],
  
  teamMembers: [
    {
      name: "Marie Dubois",
      role: "Directrice & Coiffeuse experte",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b332c42c?w=300&h=300&fit=crop&crop=face",
      specialties: ["Colorations", "Coupes tendances", "Mariages"]
    },
    {
      name: "Sophie Martin",
      role: "Coiffeuse & Coloriste",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      specialties: ["Balayages", "Soins", "Extensions"]
    },
    {
      name: "Emma Laurent",
      role: "Esthéticienne",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      specialties: ["Soins visage", "Épilations", "Maquillage"]
    }
  ],
  
  ui: {
    containerMaxWidth: "max-w-4xl",
    spacing: {
      section: "mb-8",
      card: "p-6 lg:p-8"
    },
    borderRadius: {
      card: "rounded-3xl",
      button: "rounded-2xl",
      image: "rounded-2xl"
    },
    animation: {
      hover: "hover:scale-105",
      transition: "transition-all duration-300"
    }
  }
};

// Fonction utilitaire pour formater la durée
export const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}min`;
};

// CSS personnalisé pour le glassmorphism Avyento
export const AVYENTO_GLASS_STYLES = {
  card: "bg-white/70 backdrop-blur-16 border border-violet-100/30 rounded-3xl shadow-xl",
  cardHover: "hover:shadow-2xl hover:border-violet-200/50 transition-all duration-300",
  button: "bg-violet-600/90 hover:bg-violet-700/90 backdrop-blur-16 border border-violet-400/30 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300",
  buttonOutline: "bg-white/70 backdrop-blur-16 border border-violet-200/50 text-violet-600 hover:bg-violet-50/70 rounded-2xl shadow-xl font-semibold transition-all duration-300",
  tab: "bg-violet-500/10 backdrop-blur-12 border border-violet-200/30 rounded-2xl",
  tabActive: "bg-violet-600/90 backdrop-blur-16 border border-violet-400/30 text-white shadow-xl"
};