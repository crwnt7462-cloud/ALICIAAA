import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function InstitutBeauteSaintGermain() {
  const salonSlug = 'institut-beaute-saint-germain';
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut spécifiques à Institut Beauté Saint-Germain
  const defaultData = getDefaultSalonData('Institut Beauté Saint-Germain', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Institut Beauté Saint-Germain',
    description: 'Institut de beauté haut de gamme spécialisé en soins du visage et épilation',
    address: '12 Rue de Saint-Germain, 75006 Paris',
    phone: '01 43 25 88 66',
    coverImageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['Institut agréé CIDESCO', 'Esthéticienne diplômée d\'État', 'Soins anti-âge certifiés'],
    awards: ['Excellence soins visage 2024', 'Institut de référence Saint-Germain', 'Prix qualité service'],
    longDescription: 'Institut Beauté Saint-Germain vous propose une parenthèse bien-être au cœur de Saint-Germain-des-Prés. Spécialisés dans les soins visage haut de gamme et les techniques anti-âge, nous utilisons les dernières innovations cosmétiques pour révéler votre beauté naturelle.',
    priceRange: '€€€',
    openingHours: {
      lundi: { open: '09:00', close: '19:00' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '20:00' },
      vendredi: { open: '09:00', close: '20:00' },
      samedi: { open: '09:00', close: '18:00' },
      dimanche: { open: '', close: '', closed: true }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: 'Soin Hydratant Classique',
      description: 'Nettoyage, gommage, masque et hydratation',
      price: 75,
      duration: 60,
      category: 'Soins Visage',
      photos: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80'],
      rating: 4.7,
      reviewCount: 28
    },
    {
      id: 2,
      name: 'Soin Anti-Âge Premium',
      description: 'Soin complet avec actifs anti-âge',
      price: 120,
      duration: 75,
      category: 'Soins Visage',
      photos: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80'],
      rating: 4.9,
      reviewCount: 45
    },
    {
      id: 3,
      name: 'Soin Éclat Vitamine C',
      description: 'Soin illuminateur pour teint terne',
      price: 90,
      duration: 60,
      category: 'Soins Visage',
      rating: 4.6,
      reviewCount: 32
    },
    {
      id: 4,
      name: 'Nettoyage de Peau',
      description: 'Extraction des comédons et purification',
      price: 85,
      duration: 70,
      category: 'Soins Visage',
      photos: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80'],
      rating: 4.8,
      reviewCount: 67
    },
    {
      id: 5,
      name: 'Gommage Corps Relaxant',
      description: 'Exfoliation douce tout le corps',
      price: 65,
      duration: 45,
      category: 'Soins Corps',
      rating: 4.5,
      reviewCount: 19
    },
    {
      id: 6,
      name: 'Enveloppement Minceur',
      description: 'Soin raffermissant et drainant',
      price: 95,
      duration: 60,
      category: 'Soins Corps',
      photos: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80'],
      rating: 4.7,
      reviewCount: 23
    },
    {
      id: 7,
      name: 'Épilation Sourcils',
      description: 'Épilation + restructuration sourcils',
      price: 25,
      duration: 20,
      category: 'Épilation',
      rating: 4.9,
      reviewCount: 89
    },
    {
      id: 8,
      name: 'Épilation Jambes Complètes',
      description: 'Épilation cire chaude professionnelle',
      price: 55,
      duration: 45,
      category: 'Épilation',
      rating: 4.8,
      reviewCount: 56
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Esthéticienne diplômée d\'État',
      experience: '8 ans d\'expérience',
      specialties: ['Soins anti-âge', 'Soins visage premium'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Spécialisée dans les soins anti-âge et les techniques de pointe, Sophie vous accompagne dans votre routine beauté personnalisée.',
      rating: 4.8,
      reviewsCount: 34
    },
    {
      id: 2,
      name: 'Marie Dubois',
      role: 'Spécialiste épilation',
      experience: '5 ans d\'expérience',
      specialties: ['Épilation définitive', 'Soins corps'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Experte en épilation et soins du corps, Marie privilégie les techniques douces et personnalisées pour chaque client.',
      rating: 4.6,
      reviewsCount: 28
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