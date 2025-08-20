import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

interface SalonMobileProps {
  pageUrl?: string;
}

export default function ModernSalonMobile({ }: SalonMobileProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // Données du salon
  const salonData = {
    name: "Salon Avyento Démo",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€€",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
    services: [
      {
        id: 1,
        name: "Coupe Femme",
        description: "Coupe personnalisée avec shampoing et brushing",
        price: 45,
        duration: 60,
        rating: 4.8,
        reviewCount: 89
      },
      {
        id: 2,
        name: "Coloration Complète",
        description: "Coloration racines et longueurs avec soin protecteur",
        price: 85,
        duration: 120,
        rating: 4.9,
        reviewCount: 67
      },
      {
        id: 3,
        name: "Soin Visage Premium",
        description: "Nettoyage profond, gommage et masque hydratant",
        price: 65,
        duration: 75,
        rating: 4.7,
        reviewCount: 43
      }
    ]
  };

  const tabs = [
    { id: 'services', label: 'Ser', active: activeTab === 'services' },
    { id: 'equipe', label: 'Équ', active: activeTab === 'equipe' },
    { id: 'galerie', label: 'Gal', active: activeTab === 'galerie' },
    { id: 'infos', label: 'Inf', active: activeTab === 'infos' },
    { id: 'avis', label: 'Avi', active: activeTab === 'avis' }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Image de fond avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${salonData.backgroundImage})`,
        }}
      >
        {/* Overlay noir graduel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80"></div>
      </div>

      {/* Contenu au-dessus de l'image */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header avec navigation */}
        <div className="flex items-center justify-between p-4 pt-12">
          <button 
            onClick={() => setLocation('/dashboard')}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Spacer pour pousser le contenu vers le bas */}
        <div className="flex-1"></div>

        {/* Informations du salon en bas */}
        <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-4">
          <div className="px-6">
            {/* Nom du salon */}
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-white text-3xl font-bold">{salonData.name}</h1>
              {salonData.verified && (
                <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
              )}
            </div>

            {/* Rating et avis */}
            <div className="flex items-center gap-4 mb-3 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{salonData.rating}</span>
                <span className="text-white/70">({salonData.reviewCount} avis)</span>
              </div>
              <span className="text-white/70">{salonData.priceRange}</span>
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-4 w-4 text-white/70" />
              <span className="text-white/90">{salonData.address}</span>
            </div>
          </div>

          {/* Onglets */}
          <div className="border-t border-white/20 pt-0">
            <div className="flex justify-around px-4 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                    tab.active 
                      ? 'text-white bg-white/10' 
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.active && (
                    <div className="w-6 h-0.5 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu des onglets - Panel qui remonte du bas */}
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
          {activeTab === 'services' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Coupe & Styling</h3>
                        <p className="text-sm text-gray-600">(voir +)</p>
                      </div>
                      <div className="text-sm text-gray-500">2 services</div>
                    </div>
                  </div>
                  
                  {/* Service détail */}
                  <div className="p-4 space-y-4 border-t">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Coupe homme classique</h4>
                      <p className="text-sm text-gray-600">Coupe traditionnelle avec finition soignée</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>45 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>4,5 (2)</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>3</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xl font-bold text-gray-900">35€</div>
                        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                          RDV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipe' && (
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Informations sur l'équipe à venir</p>
              </div>
            </div>
          )}

          {activeTab === 'galerie' && (
            <div className="p-6">
              <div className="text-center text-gray-500">
                <div className="h-12 w-12 mx-auto mb-3 text-gray-300 flex items-center justify-center">
                  📸
                </div>
                <p>Galerie photos à venir</p>
              </div>
            </div>
          )}

          {activeTab === 'infos' && (
            <div className="p-6">
              <div className="text-center text-gray-500">
                <div className="h-12 w-12 mx-auto mb-3 text-gray-300 flex items-center justify-center">
                  ℹ️
                </div>
                <p>Informations détaillées à venir</p>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Avis clients à venir</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}