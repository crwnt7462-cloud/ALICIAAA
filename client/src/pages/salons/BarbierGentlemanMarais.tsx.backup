import React from 'react';
import { SalonPageTemplate } from '@/components/SalonPageTemplate';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';

export default function BarbierGentlemanMarais() {
  const salonSlug = 'barbier-gentleman-marais';
  
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);

  // Données par défaut si aucun salon trouvé
  const defaultData = getDefaultSalonData('Barbier Gentleman Marais', salonSlug);
  
  // ✅ PRIORITÉ AUX DONNÉES RÉELLES avec customColors
  console.log('🔍 BarbierGentlemanMarais - Services reçus:', services.length);
  console.log('🎨 BarbierGentlemanMarais - CustomColors:', salonData?.customColors);
  
  // Utiliser prioritairement les vraies données du salon
  const finalSalonData = salonData || defaultData.salonData;
  const finalServices = services.length > 0 ? services : [];
  const finalStaff = staff.length > 0 ? staff : [];  
  const finalReviews = reviews.length > 0 ? reviews : [];
  
  // Si pas de services, afficher un message informatif
  if (services.length === 0 && salonData) {
    console.log('⚠️ Aucun service trouvé pour le salon:', salonData.name);
  }

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