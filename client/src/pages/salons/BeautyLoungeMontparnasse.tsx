import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function BeautyLoungeMontparnasse() {
  const salonSlug = 'beauty-lounge-montparnasse';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Beauty Lounge Montparnasse
  const defaultData = getDefaultSalonData('Beauty Lounge Montparnasse', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Beauty Lounge Montparnasse',
    description: 'Espace beauté moderne proposant coiffure, esthétique et bien-être',
    address: '8 Avenue du Maine, 75014 Paris',
    phone: '01 45 38 77 55',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['Salon de beauté certifié', 'Coiffure et esthétique', 'Produits premium'],
    awards: ['Salon innovant 2024', 'Excellence service client', 'Beauty Awards Paris'],
    longDescription: 'Beauty Lounge Montparnasse est un espace beauté complet où se mêlent coiffure moderne, soins esthétiques et moments de détente. Notre équipe experte vous accueille dans un cadre raffiné au cœur de Montparnasse.',
    priceRange: '€€',
    openingHours: {
      lundi: { open: '10:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '20:00' },
      vendredi: { open: '09:00', close: '20:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { open: '10:00', close: '17:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: 'Coupe Tendance Femme',
      description: 'Coupe moderne adaptée à votre morphologie',
      price: 65,
      duration: 60,
      category: 'Coiffure',
      photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80'],
      rating: 4.8,
      reviewCount: 67
    },
    {
      id: 2,
      name: 'Coloration Premium',
      description: 'Coloration haut de gamme avec produits professionnels',
      price: 85,
      duration: 120,
      category: 'Coloration',
      photos: ['https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1200&q=80'],
      rating: 4.6,
      reviewCount: 45
    },
    {
      id: 3,
      name: 'Soin Visage Relaxant',
      description: 'Soin complet du visage avec massage relaxant',
      price: 70,
      duration: 75,
      category: 'Esthétique',
      photos: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 89
    },
    {
      id: 4,
      name: 'Manucure Gel',
      description: 'Pose de vernis gel longue tenue avec nail art',
      price: 45,
      duration: 60,
      category: 'Ongles',
      rating: 4.7,
      reviewCount: 34
    },
    {
      id: 5,
      name: 'Massage Bien-être',
      description: 'Massage relaxant aux huiles essentielles',
      price: 80,
      duration: 60,
      category: 'Bien-être',
      photos: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80'],
      rating: 4.8,
      reviewCount: 56
    },
    {
      id: 6,
      name: 'Forfait Beauté Complète',
      description: 'Coupe + couleur + soin visage + manucure',
      price: 220,
      duration: 240,
      category: 'Forfaits',
      photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 123
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: 'Julie Moreau',
      role: 'Directrice & Coiffeuse expert',
      experience: '10 ans d\'expérience',
      specialties: ['Coupes tendance', 'Coloration', 'Conseil en image'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Julie dirige le Beauty Lounge avec passion et expertise. Spécialisée en coiffure tendance, elle saura sublimer votre look.',
      rating: 4.8,
      reviewsCount: 67
    },
    {
      id: 2,
      name: 'Camille Laurent',
      role: 'Esthéticienne diplômée',
      experience: '6 ans d\'expérience',
      specialties: ['Soins visage', 'Épilation', 'Soins corps'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Experte en soins esthétiques, Camille vous propose des soins personnalisés dans une ambiance relaxante et bienveillante.',
      rating: 4.6,
      reviewsCount: 45
    },
    {
      id: 3,
      name: 'Emma Garcia',
      role: 'Nail artist & Prothésiste ongulaire',
      experience: '4 ans d\'expérience',
      specialties: ['Nail art', 'Extensions', 'Soins des ongles'],
      photo: 'https://images.unsplash.com/photo-1594824704449-21d0d6e4ba90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Créative et précise, Emma transforme vos ongles en véritables œuvres d\'art avec des techniques innovantes et tendance.',
      rating: 4.9,
      reviewsCount: 23
    }
  ];

  return (
    <SalonPageTemplate
      salonData={customizedSalonData}
      services={customizedServices}
      staff={customizedStaff}
      reviews={reviews}
      loading={loading}
      isOwner={isOwner}
    />
  );
}