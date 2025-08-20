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
  Users,
  Phone,
  Calendar
} from 'lucide-react';
import logoAvyento from '@assets/Logo avyento._1755714467098.png';

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
        
        {/* Header avec navigation - RESPONSIVE */}
        <div className="flex items-center justify-between p-4 pt-6 lg:pt-8 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Logo Avyento sur mobile et desktop */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <img 
                src={logoAvyento} 
                alt="Avyento" 
                className="h-8 w-auto lg:h-10"
              />
              <span className="hidden lg:block text-white text-xl font-semibold">Avyento</span>
            </div>
          </div>
          
          {/* Boutons d'action responsive */}
          <div className="flex items-center gap-3">
            {/* Desktop - boutons avec texte */}
            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => window.open(`tel:+33123456789`)}
                className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-black/30 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Appeler</span>
              </button>
              
              <button 
                onClick={() => setLocation('/booking')}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Réserver</span>
              </button>
            </div>

            {/* Mobile - boutons icônes */}
            <div className="flex items-center gap-3 lg:hidden">
              <button 
                onClick={() => window.open(`tel:+33123456789`)}
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Desktop - boutons additionnels */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Spacer pour pousser le contenu vers le bas - Responsive */}
        <div className="flex-1 lg:flex-none lg:mt-20"></div>

        {/* Informations du salon en bas - RESPONSIVE LAYOUT */}
        <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-4 lg:pt-32">
          <div className="px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-end">
              
              {/* Informations salon - Colonne gauche sur desktop */}
              <div>
                {/* Nom du salon */}
                <div className="flex items-center gap-2 mb-2 lg:mb-4">
                  <h1 className="text-white text-3xl lg:text-5xl font-bold">{salonData.name}</h1>
                  {salonData.verified && (
                    <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400 flex-shrink-0" />
                  )}
                </div>

                {/* Rating et avis */}
                <div className="flex items-center gap-4 mb-3 lg:mb-6 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium lg:text-lg">{salonData.rating}</span>
                    <span className="text-white/70 lg:text-lg">({salonData.reviewCount} avis)</span>
                  </div>
                  <span className="text-white/70 lg:text-lg">{salonData.priceRange}</span>
                </div>

                {/* Adresse */}
                <div className="flex items-center gap-2 mb-6 lg:mb-8">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-white/70" />
                  <span className="text-white/90 lg:text-lg">{salonData.address}</span>
                </div>

                {/* Bouton réservation mobile seulement */}
                <div className="lg:hidden mb-6">
                  <button 
                    onClick={() => setLocation('/booking')}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors"
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>

              {/* Informations rapides - Colonne droite sur desktop */}
              <div className="hidden lg:block">
                <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{salonData.rating}</div>
                      <div className="text-sm text-white/70">Note moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{salonData.reviewCount}</div>
                      <div className="text-sm text-white/70">Avis clients</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => setLocation('/booking')}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Réserver un rendez-vous
                    </button>
                    <button 
                      onClick={() => window.open(`tel:+33123456789`)}
                      className="w-full bg-transparent border border-white/30 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/10 transition-colors"
                    >
                      Appeler le salon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets - RESPONSIVE */}
          <div className="border-t border-white/20 pt-0 lg:pt-4">
            <div className="px-4 lg:px-8 max-w-7xl mx-auto">
              <div className="flex justify-around lg:justify-start lg:gap-8 py-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 py-2 px-3 lg:px-4 rounded-lg transition-colors ${
                      tab.active 
                        ? 'text-white bg-white/10' 
                        : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm lg:text-base font-medium">{tab.label}</span>
                    {tab.active && (
                      <div className="w-6 lg:w-8 h-0.5 bg-blue-400 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu des onglets - Panel responsive */}
        <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl max-h-[50vh] lg:max-h-none overflow-y-auto lg:mx-8 lg:max-w-7xl lg:mx-auto lg:mb-8">
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