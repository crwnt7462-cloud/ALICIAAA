import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function InstitutBelleEpoque() {
  const salonSlug = 'institut-belle-epoque';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Institut Belle Époque
  const defaultData = getDefaultSalonData('Institut Belle Époque', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Institut Belle Époque',
    description: 'Institut de beauté traditionnel - Soins d\'exception depuis 1923',
    address: '28 Rue de Rivoli, 75004 Paris',
    phone: '01 44 61 23 88',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['Produits bio', 'Cabines privées', 'Musique relaxante', 'Thé offert', 'Accessible PMR'],
    priceRange: '€€€',
    openingHours: {
      lundi: { closed: true, open: '', close: '' },
      mardi: { open: '10:00', close: '19:00' },
      mercredi: { open: '10:00', close: '19:00' },
      jeudi: { open: '10:00', close: '20:00' },
      vendredi: { open: '10:00', close: '20:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { open: '10:00', close: '17:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Soin Visage Signature",
      description: "Soin anti-âge personnalisé de 90 minutes avec diagnostic de peau",
      price: 95,
      duration: 90,
      category: "soins"
    },
    {
      id: 2,
      name: "Massage Relaxant",
      description: "Massage corps complet aux huiles essentielles biologiques",
      price: 75,
      duration: 60,
      category: "bien-être"
    },
    {
      id: 3,
      name: "Épilation Intégrale",
      description: "Épilation complète à la cire chaude traditionnelle",
      price: 65,
      duration: 75,
      category: "épilation"
    },
    {
      id: 4,
      name: "Manucure Française",
      description: "Soin complet des mains avec pose de vernis classique",
      price: 40,
      duration: 45,
      category: "ongles"
    },
    {
      id: 5,
      name: "Soin Anti-âge Premium",
      description: "Protocole intensif anti-rides avec technologies avancées",
      price: 150,
      duration: 120,
      category: "soins"
    },
    {
      id: 6,
      name: "Pédicure Spa",
      description: "Soin relaxant des pieds avec bain et massage",
      price: 55,
      duration: 60,
      category: "ongles"
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Céleste Moreau",
      role: "Esthéticienne Expert",
      specialties: ["Soins anti-âge", "Massage", "Conseil"],
      rating: 4.9,
      reviewsCount: 127,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Amélie Rousseau",
      role: "Spécialiste Ongles",
      specialties: ["Manucure", "Pédicure", "Nail art"],
      rating: 4.8,
      reviewsCount: 84
    },
    {
      id: 3,
      name: "Margot Blanchard",
      role: "Masseuse Diplômée",
      specialties: ["Massage relaxant", "Reflexologie", "Aromathérapie"],
      rating: 4.9,
      reviewsCount: 76
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Valérie M.",
      rating: 5,
      comment: "Institut authentique avec un charme d'antan. Céleste maîtrise parfaitement les soins anti-âge. Résultats visibles !",
      date: "Il y a 3 jours",
      service: "Soin Visage Signature",
      verified: true,
      ownerResponse: {
        message: "Merci Valérie ! Notre savoir-faire traditionnel fait toute la différence.",
        date: "Il y a 2 jours"
      }
    },
    {
      id: 2,
      clientName: "Claire S.",
      rating: 5,
      comment: "Moment de pure détente. Le massage d'Amélie était exceptionnel, je recommande vivement cet institut.",
      date: "Il y a 1 semaine",
      service: "Massage Relaxant",
      verified: true
    },
    {
      id: 3,
      clientName: "Sophie L.",
      rating: 4,
      comment: "Très bel institut, prestations de qualité. Petit bémol sur le prix mais le service en vaut la peine.",
      date: "Il y a 2 semaines",
      service: "Manucure Française",
      verified: true,
      ownerResponse: {
        message: "Merci Sophie ! Nos tarifs reflètent la qualité de nos produits et l'expertise de notre équipe.",
        date: "Il y a 2 semaines"
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