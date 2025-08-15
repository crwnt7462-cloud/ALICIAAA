import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function SalonModerneRepublique() {
  const salonSlug = 'salon-moderne-republique';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Salon Moderne République
  const defaultData = getDefaultSalonData('Salon Moderne République', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Salon Moderne République',
    description: 'Salon de coiffure moderne et tendance au cœur de la République',
    address: '25 Boulevard de la République, 75003 Paris',
    phone: '01 42 86 99 77',
    coverImageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['Salon éco-responsable', 'Produits bio certifiés', 'Coiffure créative'],
    awards: ['Innovation 2024', 'Prix du développement durable', 'Salon tendance'],
    longDescription: 'Salon Moderne République allie créativité et responsabilité environnementale. Nos coiffeurs experts utilisent exclusivement des produits bio et créent des coupes sur-mesure dans un esprit moderne et écologique.',
    priceRange: '€€',
    openingHours: {
      lundi: { open: '09:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '20:00' },
      vendredi: { open: '09:00', close: '20:00' },
      samedi: { open: '08:30', close: '18:30' },
      dimanche: { open: '', close: '', closed: true }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: 'Coupe Signature',
      description: 'Coupe personnalisée selon votre style avec produits bio',
      price: 75,
      duration: 60,
      category: 'Coupes Homme'
    },
    {
      id: 2,
      name: 'Coupe Asymétrique',
      description: 'Coupe moderne et audacieuse créée sur-mesure',
      price: 80,
      duration: 75,
      category: 'Coupes Homme'
    },
    {
      id: 3,
      name: 'Coloration Bio',
      description: 'Coloration 100% végétale respectueuse de vos cheveux',
      price: 95,
      duration: 120,
      category: 'Barbe & Rasage'
    },
    {
      id: 4,
      name: 'Balayage Naturel',
      description: 'Technique de balayage avec produits naturels',
      price: 110,
      duration: 150,
      category: 'Barbe & Rasage'
    },
    {
      id: 5,
      name: 'Soin Réparateur Bio',
      description: 'Soin profond aux huiles essentielles biologiques',
      price: 45,
      duration: 30,
      category: 'Soins Premium'
    },
    {
      id: 6,
      name: 'Brushing Eco',
      description: 'Coiffage avec techniques éco-responsables',
      price: 35,
      duration: 45,
      category: 'Soins Premium'
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Coiffeuse créative & Fondatrice',
      experience: '12 ans d\'expérience',
      specialties: ['Coupes asymétriques', 'Coloration végétale', 'Eco-coiffure'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Passionnée par la coiffure créative et l\'écologie, Marie a fondé ce salon pour allier beauté et respect de l\'environnement.',
      rating: 4.9,
      reviewsCount: 42
    },
    {
      id: 2,
      name: 'Lucas Moreau',
      role: 'Coiffeur coloriste bio',
      experience: '7 ans d\'expérience',
      specialties: ['Coloration naturelle', 'Balayage', 'Soins bio'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Expert en coloration végétale et soins naturels, Lucas privilégie les techniques respectueuses de la fibre capillaire.',
      rating: 4.7,
      reviewsCount: 31
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