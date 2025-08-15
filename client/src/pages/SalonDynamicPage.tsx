import React from 'react';
import { useLocation } from 'wouter';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function SalonDynamicPage() {
  const [location] = useLocation();
  const salonSlug = location.startsWith('/salon/') ? location.substring(7) : 'default-salon';
  
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut si aucun salon trouvé
  const defaultData = getDefaultSalonData('Salon Dynamique', salonSlug);
  
  // Utiliser les données du salon ou les données par défaut
  const finalSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Salon Personnalisé',
    description: 'Salon de beauté professionnel',
    address: 'Adresse du salon',
    phone: 'Téléphone du salon',
  };

  const finalServices = services.length > 0 ? services : defaultData.services;
  const finalStaff = staff.length > 0 ? staff : defaultData.staff;
  const finalReviews = reviews.length > 0 ? reviews : defaultData.reviews;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  return (
    <SalonPageTemplate
      salonData={finalSalonData}
      services={finalServices}
      staff={finalStaff}
      reviews={finalReviews}
      isOwner={isOwner}
    />
  );
}