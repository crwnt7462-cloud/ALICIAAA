import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function BarbierGentlemanMarais() {
  const salonSlug = 'barbier-gentleman-marais';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques au Barbier Gentleman Marais
  const defaultData = getDefaultSalonData('Barbier Gentleman Marais', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Barbier Gentleman Marais',
    description: 'Salon de coiffure traditionnel au cœur du Marais - Excellence et savoir-faire depuis 1995',
    address: '15 Rue des Rosiers, 75004 Paris',
    phone: '01 42 72 18 39',
    coverImageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['WiFi gratuit', 'Climatisation', 'Produits professionnels', 'Parking proche', 'Accessible PMR'],
    priceRange: '€€',
    openingHours: {
      lundi: { closed: true, open: '', close: '' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '19:30' },
      vendredi: { open: '09:00', close: '19:30' },
      samedi: { open: '08:30', close: '18:00' },
      dimanche: { open: '10:00', close: '17:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Coupe Gentleman",
      description: "Coupe traditionnelle à la tondeuse et aux ciseaux",
      price: 35,
      duration: 45,
      category: "coiffure"
    },
    {
      id: 2,
      name: "Taille de Barbe",
      description: "Taille et entretien de barbe avec rasoir traditionnel",
      price: 25,
      duration: 30,
      category: "barbe"
    },
    {
      id: 3,
      name: "Rasage Traditionnel",
      description: "Rasage complet au rasoir avec serviettes chaudes",
      price: 30,
      duration: 40,
      category: "barbe"
    },
    {
      id: 4,
      name: "Coupe + Barbe",
      description: "Formule complète coupe et barbe",
      price: 55,
      duration: 75,
      category: "formules"
    },
    {
      id: 5,
      name: "Soin Capillaire",
      description: "Shampooing et soin nourrissant",
      price: 20,
      duration: 25,
      category: "soins"
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Antoine Mercier",
      role: "Maître Barbier",
      specialties: ["Coupe traditionnelle", "Rasage", "Conseil style"],
      rating: 4.9,
      reviewsCount: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Julien Moreau",
      role: "Barbier",
      specialties: ["Coupe moderne", "Barbe", "Styling"],
      rating: 4.8,
      reviewsCount: 89,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Pierre Dubois",
      role: "Coiffeur Senior",
      specialties: ["Coupes classiques", "Conseil", "Soins"],
      rating: 4.7,
      reviewsCount: 67
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Marc D.",
      rating: 5,
      comment: "Excellent barbier ! Antoine maîtrise parfaitement l'art du rasage traditionnel. Un vrai savoir-faire.",
      date: "Il y a 3 jours",
      service: "Rasage Traditionnel",
      verified: true,
      ownerResponse: {
        message: "Merci Marc ! C'est un plaisir de perpétuer ces techniques traditionnelles.",
        date: "Il y a 2 jours"
      }
    },
    {
      id: 2,
      clientName: "Thomas R.",
      rating: 5,
      comment: "Salon authentique dans le Marais. Service impeccable et ambiance chaleureuse. Je recommande vivement !",
      date: "Il y a 1 semaine",
      service: "Coupe Gentleman",
      verified: true
    },
    {
      id: 3,
      clientName: "Alexandre M.",
      rating: 4,
      comment: "Très bon salon, coupe parfaite. Julien est très professionnel et de bon conseil.",
      date: "Il y a 2 semaines",
      service: "Coupe + Barbe",
      verified: true,
      ownerResponse: {
        message: "Merci Alexandre ! Julien sera ravi de ce retour positif.",
        date: "Il y a 2 semaines"
      }
    },
    {
      id: 4,
      clientName: "Philippe L.",
      rating: 5,
      comment: "Une institution dans le quartier ! Toujours satisfait depuis 5 ans que je viens ici.",
      date: "Il y a 3 semaines",
      service: "Taille de Barbe",
      verified: true
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