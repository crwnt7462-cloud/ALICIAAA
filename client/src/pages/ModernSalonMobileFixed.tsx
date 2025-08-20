import { useState, useEffect } from 'react';
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

export default function ModernSalonMobileFixed() {
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

  console.log('ModernSalonMobileFixed loaded - no API calls');

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gradient-to-br lg:from-purple-50 lg:via-pink-50 lg:to-indigo-50">
      {/* Image de fond avec overlay - Responsive */}
      <div className="relative h-screen lg:h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 lg:from-black/60"></div>

        {/* Header - RESPONSIVE avec logo Avyento */}
        <div className="relative z-10 flex items-center justify-between p-4 lg:p-6">
          <button 
            onClick={() => setLocation('/')}
            className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-full p-2 lg:p-3 text-white hover:bg-black/30 transition-all"
          >
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Logo Avyento centré */}
          <div className="flex-1 flex justify-center">
            <img 
              src={logoAvyento} 
              alt="Avyento" 
              className="h-8 lg:h-12 w-auto object-contain filter brightness-0 invert opacity-90"
            />
          </div>

          {/* Boutons actions - RESPONSIVE */}
          <div className="flex items-center gap-2">
            <button className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-full p-2 lg:p-3 text-white hover:bg-black/30 transition-all">
              <Share2 className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2">Partager</span>
            </button>
            <button className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-full p-2 lg:p-3 text-white hover:bg-black/30 transition-all">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2">Favoris</span>
            </button>
            <button 
              onClick={() => window.open('tel:+33123456789')}
              className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-full p-2 lg:p-3 text-white hover:bg-black/30 transition-all"
            >
              <Phone className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2">Appeler</span>
            </button>
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

        {/* Contenu des onglets - Panel responsive avec glassmorphism */}
        <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl lg:rounded-3xl shadow-2xl max-h-[50vh] lg:max-h-none overflow-y-auto lg:mx-8 lg:max-w-7xl lg:mx-auto lg:mb-8">
          {activeTab === 'services' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Catégorie Coiffure avec glassmorphism */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Coiffure</h3>
                        <p className="text-sm text-gray-600">Coupes, colorations et coiffages</p>
                      </div>
                      <div className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">3 services</div>
                    </div>
                  </div>
                  
                  {/* Services détaillés avec prix alignés */}
                  <div className="p-4 space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/80 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-lg">Coupe homme classique</h4>
                        <div className="text-xl font-bold text-purple-600">35€</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Coupe traditionnelle avec finition soignée</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>45 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>4,5 (12)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setLocation('/booking')}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/80 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-lg">Coupe & Brushing femme</h4>
                        <div className="text-xl font-bold text-purple-600">55€</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Coupe personnalisée avec mise en forme</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>75 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>4,8 (28)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setLocation('/booking')}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Catégorie Manucure & Pédicure - ESPACEMENT AUGMENTÉ */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <div className="p-4 bg-gradient-to-r from-pink-50/80 to-purple-50/80 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Manucure & Pédicure</h3>
                        <p className="text-sm text-gray-600">Soins des ongles et nail art</p>
                      </div>
                      <div className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">2 services</div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/80 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-lg">Manucure classique</h4>
                        <div className="text-xl font-bold text-purple-600">30€</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Soin complet avec pose de vernis</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>45 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>4,6 (18)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setLocation('/booking')}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vue du salon sur la carte */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg text-gray-800">Localisation</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="bg-gradient-to-br from-blue-100/80 to-indigo-100/80 backdrop-blur-sm border border-white/30 rounded-xl h-48 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Vue du salon sur la carte</p>
                        <p className="text-sm text-gray-500 mt-1">{salonData.address}</p>
                        <button className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all">
                          Voir sur Google Maps
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infos' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Horaires d'ouverture avec design glassmorphism */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm border-b border-white/20">
                    <h3 className="font-semibold text-lg text-gray-800">Horaires d'ouverture</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-medium">Lundi - Vendredi</span>
                      <span className="text-gray-600">9h00 - 19h00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-medium">Samedi</span>
                      <span className="text-gray-600">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-medium">Dimanche</span>
                      <span className="text-red-500 font-medium">Fermé</span>
                    </div>
                  </div>
                </div>

                {/* Note client */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold text-lg text-gray-800">Note client</h3>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-4xl font-bold text-yellow-600 mb-2">4.8/5</div>
                    <p className="text-gray-600 mb-2">Basé sur 142 avis</p>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Autres onglets avec glassmorphism */}
          {activeTab === 'equipe' && (
            <div className="p-6 lg:p-8">
              <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notre Équipe</h3>
                <p className="text-gray-600">Informations sur l'équipe à venir</p>
              </div>
            </div>
          )}

          {activeTab === 'galerie' && (
            <div className="p-6 lg:p-8">
              <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-br from-pink-100/80 to-purple-100/80 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl">📸</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Galerie Photos</h3>
                <p className="text-gray-600">Découvrez nos réalisations prochainement</p>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="p-6 lg:p-8">
              <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-br from-yellow-100/80 to-orange-100/80 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Avis Clients</h3>
                <p className="text-gray-600 mb-4">Les retours de nos clients arrivent bientôt</p>
                <div className="text-3xl font-bold text-yellow-600">4.8/5</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}