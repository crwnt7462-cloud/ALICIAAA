import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function SalonExcellenceParis() {
  const salonSlug = 'salon-excellence-paris';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Salon Excellence Paris
  const defaultData = getDefaultSalonData('Salon Excellence Paris', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Salon Excellence Paris',
    description: 'Salon de coiffure haut de gamme sur les Champs-Élysées - Excellence et innovation',
    address: '45 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 89 15 67',
    coverImageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['WiFi gratuit', 'Climatisation', 'Produits premium', 'Parking valet', 'Accessible PMR', 'Champagne offert'],
    priceRange: '€€€',
    openingHours: {
      lundi: { open: '08:00', close: '20:00' },
      mardi: { open: '08:00', close: '20:00' },
      mercredi: { open: '08:00', close: '20:00' },
      jeudi: { open: '08:00', close: '21:00' },
      vendredi: { open: '08:00', close: '21:00' },
      samedi: { open: '08:00', close: '19:00' },
      dimanche: { open: '10:00', close: '18:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Coupe Femme Premium",
      description: "Coupe sur-mesure avec consultation style personnalisée",
      price: 85,
      duration: 90,
      category: "Coiffure Femme",
      photos: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80'],
      rating: 4.8,
      reviewCount: 45
    },
    {
      id: 2,
      name: "Coloration Expert",
      description: "Coloration professionnelle avec produits premium européens",
      price: 120,
      duration: 150,
      category: "Colorations",
      photos: ['https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 67
    },
    {
      id: 3,
      name: "Brushing Signature",
      description: "Mise en forme professionnelle longue durée avec finition parfaite",
      price: 45,
      duration: 60,
      category: "Coiffure Femme",
      rating: 4.7,
      reviewCount: 23
    },
    {
      id: 4,
      name: "Soin Restructurant",
      description: "Soin réparateur intensif pour cheveux abîmés ou colorés",
      price: 65,
      duration: 45,
      category: "Soins Capillaires",
      photos: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80'],
      rating: 4.6,
      reviewCount: 34
    },
    {
      id: 5,
      name: "Coupe Homme Prestige",
      description: "Coupe masculine exclusive avec finition précise",
      price: 55,
      duration: 60,
      category: "Coiffure Homme",
      rating: 4.8,
      reviewCount: 56
    },
    {
      id: 6,
      name: "Mèches Californienne",
      description: "Technique de mèches naturelles pour un effet soleil",
      price: 95,
      duration: 120,
      category: "Colorations",
      photos: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80', 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 78
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Isabelle Moreau",
      role: "Directrice Artistique",
      specialties: ["Coupe", "Coloration", "Formation"],
      rating: 4.9,
      reviewsCount: 89,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Alexandre Dubois",
      role: "Coloriste Expert",
      // Pas d'avatar pour tester l'affichage sans photo
      specialties: ["Balayage", "Coloration", "Conseil"],
      rating: 4.8,
      reviewsCount: 76
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "Coiffeuse Senior",
      specialties: ["Coupe", "Brushing", "Événementiel"],
      rating: 4.9,
      reviewsCount: 54
    },
    {
      id: 4,
      name: "Thomas Bernard",
      role: "Coiffeur Homme",
      specialties: ["Coupe masculine", "Barbe", "Styling"],
      rating: 4.7,
      reviewsCount: 42
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Catherine L.",
      rating: 5,
      comment: "Salon exceptionnel ! Isabelle a transformé ma coupe avec un talent remarquable. Service impeccable sur les Champs-Élysées.",
      date: "Il y a 2 jours",
      service: "Coupe Femme Premium",
      verified: true,
      ownerResponse: {
        message: "Merci Catherine ! Isabelle sera ravie de ce retour. Au plaisir de vous revoir.",
        date: "Il y a 1 jour"
      }
    },
    {
      id: 2,
      clientName: "Marc R.",
      rating: 5,
      comment: "Alexandre est un véritable artiste de la couleur. Résultat parfait, exactement ce que j'attendais !",
      date: "Il y a 5 jours",
      service: "Coloration Expert",
      verified: true
    },
    {
      id: 3,
      clientName: "Amélie D.",
      rating: 5,
      comment: "Cadre magnifique, équipe professionnelle. Sophie a réalisé un brushing parfait pour mon mariage.",
      date: "Il y a 1 semaine",
      service: "Brushing Signature",
      verified: true,
      ownerResponse: {
        message: "Félicitations pour votre mariage Amélie ! Merci de nous avoir fait confiance pour ce jour unique.",
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