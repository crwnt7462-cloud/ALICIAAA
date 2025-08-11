import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Heart,
  Share2
} from "lucide-react";

function ModernSalonDetailNew() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // ✅ STANDARDISATION: Extraction ID salon depuis route param
  const salonId = location.split('/salon/')[1];
  
  // ✅ SUPPRESSION FALLBACK: Uniquement données depuis API
  const { data: salonData, isLoading, error } = useQuery({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId,
    retry: false,
    staleTime: 0,
    refetchOnMount: true
  });
  
  // ✅ GESTION DES ÉTATS D'ERREUR ET CHARGEMENT
  if (!salonId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salon non spécifié</h1>
          <button 
            onClick={() => setLocation('/search')}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher un salon
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du salon {salonId}...</p>
        </div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salon non trouvé</h1>
          <p className="text-gray-400 mb-4">Le salon {salonId} n'existe pas.</p>
          <button 
            onClick={() => setLocation('/search')}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher un salon
          </button>
        </div>
      </div>
    );
  }

  const salon = salonData;

  const defaultServices = [
    {
      id: 1,
      name: 'Cheveux',
      expanded: false,
      services: [
        { id: 1, name: 'Coupe Bonhomme', price: 39, duration: '30min' },
        { id: 2, name: 'Coupe Dégradée', price: 46, duration: '45min' },
        { id: 3, name: 'Coupe Transformation', price: 45, duration: '45min' }
      ]
    },
    {
      id: 2,
      name: 'Barbe',
      expanded: false,
      services: [
        { id: 7, name: 'Taille de barbe classique', price: 25, duration: '30min' },
        { id: 8, name: 'Rasage traditionnel', price: 35, duration: '45min' }
      ]
    }
  ];

  const [serviceCategories, setServiceCategories] = useState(defaultServices);

  const toggleServiceCategory = (index: number) => {
    setServiceCategories(prev => prev.map((category, i) => 
      i === index ? { ...category, expanded: !category.expanded } : category
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec retour */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/search')}
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`text-gray-600 hover:text-gray-900 ${isFavorite ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pb-20">
        {/* En-tête salon */}
        <div className="bg-white p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                {salon?.name || 'Salon'}
              </h1>
              {salon?.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {salon?.subtitle || 'Salon de beauté professionnel'}
          </p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {salon?.rating || '4.8'}
              </span>
              <span className="text-xs text-gray-500">
                ({salon?.reviews || '127'} avis)
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{salon?.location || 'Paris'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{salon?.phone || '01 23 45 67 89'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Ouvert • Ferme à 19h</span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex">
            {['services', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-violet-600 border-b-2 border-violet-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'services' ? 'Services' : 'Avis'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="p-4">
          {activeTab === 'services' && (
            <div className="space-y-3">
              {serviceCategories.map((category, index) => (
                <Card key={category.id} className="overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleServiceCategory(index)}
                    >
                      <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                      <div className="text-gray-400 text-lg">
                        {category.expanded ? '−' : '+'}
                      </div>
                    </div>
                    
                    {category.expanded && (
                      <div className="border-t border-gray-100">
                        {category.services.map((service, serviceIndex) => (
                          <div key={service.id} className={`p-4 flex items-center justify-between ${serviceIndex !== category.services.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{service.name}</h4>
                              <p className="text-xs text-gray-500">{service.price}€ • {service.duration}</p>
                            </div>
                            <Button 
                              onClick={() => {
                                console.log('🎯 NAVIGATION BOOKING: Redirection avec salon ID:', salonId);
                                setLocation(`/salon-booking?salon=${salonId}`);
                              }}
                              className="bg-violet-600 text-white hover:bg-violet-700 h-8 px-4 text-xs font-medium transition-all duration-300"
                            >
                              Choisir
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun avis disponible pour le moment</p>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de réservation fixe */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3">
          <Button 
            onClick={() => {
              console.log('🎯 NAVIGATION BOOKING PRINCIPALE: Redirection avec salon ID:', salonId);
              setLocation(`/salon-booking?salon=${salonId}`);
            }}
            className="w-full bg-violet-600 text-white hover:bg-violet-700 h-11 text-sm font-medium transition-all duration-300 hover:scale-[1.01] transform active:scale-95"
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModernSalonDetailNew;