import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Share2, Heart, Phone, MapPin, Star, Clock } from 'lucide-react';
import logoAvyento from '@assets/Logo avyento._1755714467098.png';

export default function ModernSalonCompact() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  
  // Données du salon - STATIQUES UNIQUEMENT
  const salonData = {
    name: "Salon Avyento Démo",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€€",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80"
  };

  // Onglets de navigation
  const tabs = [
    { id: 'services', label: 'Services', active: activeTab === 'services' },
    { id: 'equipe', label: 'Équipe', active: activeTab === 'equipe' },
    { id: 'galerie', label: 'Galerie', active: activeTab === 'galerie' },
    { id: 'infos', label: 'Infos', active: activeTab === 'infos' },
    { id: 'avis', label: 'Avis', active: activeTab === 'avis' }
  ];

  console.log('ModernSalonCompact loaded - no API calls');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30">
      {/* Header moderne avec logo Avyento - FIXE */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between p-4 lg:p-6 max-w-7xl mx-auto">
          <button 
            onClick={() => setLocation('/')}
            className="bg-gray-100/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-gray-200/80 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Logo Avyento centré */}
          <div className="flex-1 flex justify-center">
            <img 
              src={logoAvyento} 
              alt="Avyento" 
              className="h-8 lg:h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Boutons actions - RESPONSIVE */}
          <div className="flex items-center gap-3">
            <button className="bg-gray-100/80 backdrop-blur-xl rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-gray-200/80 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Share2 className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2 font-medium">Partager</span>
            </button>
            <button className="bg-gray-100/80 backdrop-blur-xl border border-gray-300/50 rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-gray-200/80 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2 font-medium">Favoris</span>
            </button>
            <button 
              onClick={() => window.open('tel:+33123456789')}
              className="bg-gradient-to-r from-purple-500/90 to-violet-500/90 backdrop-blur-xl rounded-2xl p-3 lg:p-4 text-white hover:from-purple-600/90 hover:to-violet-600/90 transition-all duration-300 shadow-lg hover:shadow-purple/20"
            >
              <Phone className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2 font-medium">Appeler</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal avec image compacte */}
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        
        {/* Image compacte avec informations superposées */}
        <div className="relative mb-8">
          <div 
            className="h-64 lg:h-80 w-full bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Informations superposées */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">{salonData.name}</h1>
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{salonData.address}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(salonData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`} 
                      />
                    ))}
                    <span className="ml-2 text-white font-semibold">{salonData.rating}</span>
                    <span className="text-white/70">({salonData.reviewCount} avis)</span>
                  </div>
                </div>
                
                {/* Encadré stats glassmorphisme */}
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{salonData.rating}</div>
                      <div className="text-xs text-white/90">Note moyenne</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{salonData.reviewCount}</div>
                      <div className="text-xs text-white/90">Avis clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton d'action principal - SUPPRIMÉ SUR DEMANDE */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => window.open(`tel:+33123456789`)}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 text-gray-700 py-4 px-6 rounded-2xl font-medium hover:bg-white transition-all duration-300 shadow-lg"
          >
            <Phone className="h-5 w-5" />
          </button>
        </div>

        {/* Onglets modernes */}
        <div className="mb-8">
          <div className="flex justify-center lg:justify-start gap-2 p-2 bg-gray-100/80 backdrop-blur-xl rounded-2xl shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  tab.active 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets - Panel glassmorphisme */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
          {activeTab === 'services' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Catégorie Coiffure avec glassmorphisme parfait */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple/10 hover:bg-white/85 transition-all duration-300">
                  <div className="p-6 bg-gradient-to-r from-purple-50/70 to-violet-50/70 backdrop-blur-xl border-b border-white/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">Coiffure</h3>
                        <p className="text-gray-600">Coupes, colorations et coiffages</p>
                      </div>
                      <div className="text-sm text-purple-700 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full font-medium border border-white/50 shadow-lg">4 services</div>
                    </div>
                  </div>
                  
                  {/* Services détaillés avec glassmorphisme complet */}
                  <div className="p-6 space-y-4">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">Coupe homme classique</h4>
                          <p className="text-gray-600">Coupe traditionnelle avec finition soignée</p>
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent ml-6">35€</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">45 min</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">4,5 (12)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setLocation('/booking')}
                          className="bg-gradient-to-r from-purple-600/90 to-violet-600/90 backdrop-blur-xl border border-white/30 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-purple-700/90 hover:to-violet-700/90 transition-all duration-300 shadow-2xl hover:shadow-purple/20"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">Coupe & Brushing femme</h4>
                          <p className="text-gray-600">Coupe personnalisée avec mise en forme</p>
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent ml-6">55€</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">75 min</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">4,8 (28)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setLocation('/booking')}
                          className="bg-gradient-to-r from-purple-600/90 to-violet-600/90 backdrop-blur-xl border border-white/30 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-purple-700/90 hover:to-violet-700/90 transition-all duration-300 shadow-2xl hover:shadow-purple/20"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}