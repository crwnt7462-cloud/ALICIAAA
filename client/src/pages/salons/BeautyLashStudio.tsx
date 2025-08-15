import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function BeautyLashStudio() {
  const salonSlug = 'beauty-lash-studio';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques au studio d'extensions de cils
  const defaultData = getDefaultSalonData('Beauty Lash Studio', salonSlug);
  
  // Personnalisation spécifique pour ce salon d'extensions
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Beauty Lash Studio',
    description: 'Studio spécialisé en extensions de cils et regard - Expertise premium',
    address: '15 Rue de la Paix, 75002 Paris',
    phone: '01 42 96 33 44',
    coverImageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['WiFi gratuit', 'Climatisation', 'Produits premium', 'Musique relaxante', 'Thé offert', 'Parking proche'],
    priceRange: '€€',
    openingHours: {
      lundi: { open: '09:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '20:00' },
      jeudi: { open: '09:00', close: '20:00' },
      vendredi: { open: '09:00', close: '19:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { open: '10:00', close: '17:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Extensions Volume Russe",
      description: "Technique premium pour un regard intense et naturel",
      price: 120,
      duration: 120,
      category: "Extensions Premium",
      photos: ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 78
    },
    {
      id: 2,
      name: "Extensions Classiques",
      description: "Pose traditionnelle pour un look élégant et discret",
      price: 85,
      duration: 90,
      category: "Extensions Classiques",
      photos: ['https://images.unsplash.com/photo-1591217638129-d973000b1e6a?w=1200&q=80'],
      rating: 4.8,
      reviewCount: 52
    },
    {
      id: 3,
      name: "Retouche Extensions",
      description: "Entretien et retouche pour maintenir la beauté du regard",
      price: 55,
      duration: 60,
      category: "Entretien",
      photos: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80'],
      rating: 4.7,
      reviewCount: 34
    },
    {
      id: 4,
      name: "Lifting de Cils",
      description: "Rehaussement naturel des cils avec teinture incluse",
      price: 65,
      duration: 45,
      category: "Soins du Regard",
      photos: ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80'],
      rating: 4.6,
      reviewCount: 41
    },
    {
      id: 5,
      name: "Épilation Sourcils Design",
      description: "Restructuration et design sur-mesure de vos sourcils",
      price: 35,
      duration: 30,
      category: "Soins du Regard",
      rating: 4.8,
      reviewCount: 29
    },
    {
      id: 6,
      name: "Teinture Cils & Sourcils",
      description: "Coloration professionnelle longue durée",
      price: 25,
      duration: 20,
      category: "Soins du Regard",
      rating: 4.5,
      reviewCount: 18
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Sarah Martinez",
      role: "Lash Artist Senior",
      avatar: "https://images.unsplash.com/photo-1594824949165-148e44ce8b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      specialties: ["Volume Russe", "Mega Volume", "Extensions Colorées"],
      rating: 4.9,
      reviewsCount: 87
    },
    {
      id: 2,
      name: "Emma Dubois",
      role: "Spécialiste Extensions",
      avatar: "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      specialties: ["Extensions Classiques", "Lifting de Cils", "Sourcils"],
      rating: 4.8,
      reviewsCount: 64
    },
    {
      id: 3,
      name: "Luna Chen",
      role: "Artiste du Regard",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      specialties: ["Volume Hybride", "Soins du Regard", "Épilation"],
      rating: 4.7,
      reviewsCount: 43
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Marie L.",
      rating: 5,
      comment: "Incroyable ! Mes extensions volume russe tiennent parfaitement depuis 3 semaines. Sarah est une véritable artiste, le résultat est naturel et magnifique.",
      date: "Il y a 3 jours",
      service: "Extensions Volume Russe",
      verified: true,
      ownerResponse: {
        message: "Merci Marie ! Nous sommes ravis que vos extensions vous plaisent. À bientôt pour la retouche !",
        date: "Il y a 2 jours"
      }
    },
    {
      id: 2,
      clientName: "Jessica M.",
      rating: 5,
      comment: "Studio très professionnel, hygiène irréprochable. Emma a pris le temps de bien m'expliquer l'entretien. Je recommande vivement !",
      date: "Il y a 1 semaine",
      service: "Extensions Classiques",
      verified: true
    },
    {
      id: 3,
      clientName: "Camille R.",
      rating: 5,
      comment: "Le lifting de cils avec Luna est parfait ! Mes cils sont recourbés naturellement, l'effet dure vraiment longtemps.",
      date: "Il y a 2 semaines",
      service: "Lifting de Cils",
      verified: true
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
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
      loading={loading}
    />
  );
}