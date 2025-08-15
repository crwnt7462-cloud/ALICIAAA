import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function ModernHairStudio() {
  const salonSlug = 'modern-hair-studio';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Modern Hair Studio
  const defaultData = getDefaultSalonData('Modern Hair Studio', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Modern Hair Studio',
    description: 'Studio de coiffure moderne - Créativité et tendances actuelles',
    address: '12 Rue de la Paix, 75002 Paris',
    phone: '01 47 03 22 41',
    coverImageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['WiFi haut débit', 'Musique lounge', 'Café bio', 'Design moderne', 'Produits vegan'],
    priceRange: '€€',
    openingHours: {
      lundi: { open: '10:00', close: '19:00' },
      mardi: { open: '09:00', close: '20:00' },
      mercredi: { open: '09:00', close: '20:00' },
      jeudi: { open: '09:00', close: '21:00' },
      vendredi: { open: '09:00', close: '21:00' },
      samedi: { open: '08:30', close: '19:00' },
      dimanche: { closed: true, open: '', close: '' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Coupe Tendance",
      description: "Coupe moderne selon les dernières tendances internationales",
      price: 55,
      duration: 60,
      category: "coiffure"
    },
    {
      id: 2,
      name: "Coloration Fantasy",
      description: "Colorations audacieuses et créatives, toutes les nuances possibles",
      price: 90,
      duration: 120,
      category: "coiffure"
    },
    {
      id: 3,
      name: "Lissage Brésilien",
      description: "Traitement lissant longue durée pour cheveux parfaitement lisses",
      price: 150,
      duration: 180,
      category: "soins"
    },
    {
      id: 4,
      name: "Extensions Cheveux",
      description: "Pose d'extensions naturelles ou colorées pour volume et longueur",
      price: 200,
      duration: 120,
      category: "extensions"
    },
    {
      id: 5,
      name: "Balayage Créatif",
      description: "Technique de balayage personnalisée avec effets de lumière",
      price: 110,
      duration: 150,
      category: "coiffure"
    },
    {
      id: 6,
      name: "Coupe Pixie",
      description: "Coupe courte moderne avec styling et conseil personnalisé",
      price: 65,
      duration: 75,
      category: "coiffure"
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Luna Rodriguez",
      role: "Directrice Créative",
      specialties: ["Coupes avant-gardistes", "Colorations fantasy", "Tendances"],
      rating: 4.9,
      reviewsCount: 98,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Maxime Chen",
      role: "Coloriste Expert",
      specialties: ["Balayage", "Ombré", "Techniques mixtes"],
      rating: 4.8,
      reviewsCount: 73
    },
    {
      id: 3,
      name: "Zoé Martin",
      role: "Spécialiste Extensions",
      specialties: ["Extensions", "Volume", "Longueur"],
      rating: 4.7,
      reviewsCount: 59
    },
    {
      id: 4,
      name: "Sam Taylor",
      role: "Coiffeur Unisexe",
      specialties: ["Coupes modernes", "Styling", "Conseil"],
      rating: 4.8,
      reviewsCount: 41
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Emma K.",
      rating: 5,
      comment: "Luna a complètement transformé mes cheveux ! Coupe pixie parfaite, j'adore ce nouveau style. Studio très moderne.",
      date: "Il y a 2 jours",
      service: "Coupe Pixie",
      verified: true,
      ownerResponse: {
        message: "Merci Emma ! Luna est ravie que sa création vous plaise autant. Le pixie vous va à merveille !",
        date: "Il y a 1 jour"
      }
    },
    {
      id: 2,
      clientName: "Jade L.",
      rating: 5,
      comment: "Maxime est un artiste ! Mon balayage est exactement comme je l'imaginais. Couleurs sublimes et naturelles.",
      date: "Il y a 5 jours",
      service: "Balayage Créatif",
      verified: true
    },
    {
      id: 3,
      clientName: "Camille R.",
      rating: 4,
      comment: "Très satisfaite de mes extensions. Zoé a pris le temps de bien choisir la couleur. Résultat naturel !",
      date: "Il y a 1 semaine",
      service: "Extensions Cheveux",
      verified: true,
      ownerResponse: {
        message: "Merci Camille ! Zoé est très minutieuse dans le choix des extensions pour un rendu parfait.",
        date: "Il y a 1 semaine"
      }
    }
  ];

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
}