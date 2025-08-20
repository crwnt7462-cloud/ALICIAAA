import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Share2, Heart, Phone, MapPin, Star, Clock, ChevronDown, ChevronUp, User, Calendar, Info, MessageSquare, Image } from 'lucide-react';
import logoAvyento from '@assets/Logo avyento._1755714467098.png';

export default function ModernSalonCompact() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  
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

  // Services avec photos
  const serviceCategories = [
    {
      id: 'coiffure',
      name: 'Coiffure',
      description: 'Coupes, colorations et coiffages',
      count: 4,
      services: [
        {
          name: 'Coupe homme classique',
          description: 'Coupe traditionnelle avec finition soignée',
          price: 35,
          duration: 45,
          rating: 4.5,
          reviews: 12,
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Coupe & Brushing femme',
          description: 'Coupe personnalisée avec mise en forme',
          price: 55,
          duration: 75,
          rating: 4.8,
          reviews: 28,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Coloration complète',
          description: 'Couleur uniforme sur toute la chevelure',
          price: 85,
          duration: 120,
          rating: 4.7,
          reviews: 15,
          image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Mèches & Balayage',
          description: 'Technique de coloration naturelle',
          price: 95,
          duration: 150,
          rating: 4.9,
          reviews: 22,
          image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'esthetique',
      name: 'Esthétique',
      description: 'Soins du visage et épilation',
      count: 3,
      services: [
        {
          name: 'Soin visage hydratant',
          description: 'Nettoyage et hydratation en profondeur',
          price: 65,
          duration: 60,
          rating: 4.6,
          reviews: 18,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Épilation jambes complètes',
          description: 'Épilation à la cire tiède',
          price: 45,
          duration: 45,
          rating: 4.4,
          reviews: 25,
          image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop&q=80'
        },
        {
          name: 'Soin anti-âge',
          description: 'Traitement raffermissant et régénérant',
          price: 95,
          duration: 90,
          rating: 4.8,
          reviews: 12,
          image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&h=100&fit=crop&q=80'
        }
      ]
    }
  ];

  // Équipe
  const teamMembers = [
    {
      name: 'Sophie Martin',
      role: 'Directrice & Coiffeuse experte',
      specialties: ['Coupe', 'Coloration', 'Brushing'],
      experience: '15 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c479e32?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Emma Dubois',
      role: 'Esthéticienne diplômée',
      specialties: ['Soins visage', 'Épilation', 'Massage'],
      experience: '8 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Lucas Bernard',
      role: 'Coiffeur spécialisé homme',
      specialties: ['Coupe homme', 'Barbe', 'Rasage'],
      experience: '10 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80'
    }
  ];

  // Avis clients
  const reviews = [
    {
      name: 'Marie L.',
      rating: 5,
      date: '2 jours',
      comment: 'Excellent salon ! Sophie a fait des merveilles avec ma couleur. Je recommande vivement !',
      service: 'Coloration complète'
    },
    {
      name: 'Thomas R.',
      rating: 5,
      date: '1 semaine',
      comment: 'Lucas est un vrai professionnel. Coupe parfaite à chaque fois.',
      service: 'Coupe homme classique'
    },
    {
      name: 'Julie M.',
      rating: 4,
      date: '2 semaines',
      comment: 'Très bon soin du visage avec Emma. Peau toute douce après !',
      service: 'Soin visage hydratant'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

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
            <button className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-white/10">
              <Share2 className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2 font-medium">Partager</span>
            </button>
            <button className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-3 lg:p-4 text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-white/10">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden lg:inline ml-2 font-medium">Favoris</span>
            </button>
            <button 
              onClick={() => window.open('tel:+33123456789')}
              className="bg-gradient-to-r from-purple-500/90 to-violet-500/90 backdrop-blur-xl border border-white/30 rounded-2xl p-3 lg:p-4 text-white hover:from-purple-600/90 hover:to-violet-600/90 transition-all duration-300 shadow-2xl hover:shadow-purple/20"
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
            className="bg-white/80 backdrop-blur-xl border border-white/40 text-gray-700 py-4 px-6 rounded-2xl font-medium hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/10"
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
          
          {/* ONGLET SERVICES avec volets dépliants et photos */}
          {activeTab === 'services' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {serviceCategories.map((category) => (
                  <div key={category.id} className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple/10 hover:bg-white/85 transition-all duration-300">
                    {/* Header de catégorie avec bouton dépliable */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-6 bg-gradient-to-r from-purple-50/70 to-violet-50/70 backdrop-blur-xl border-b border-white/30 hover:from-purple-100/70 hover:to-violet-100/70 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h3 className="font-bold text-xl bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">{category.name}</h3>
                          <p className="text-gray-600">{category.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-purple-700 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full font-medium border border-white/50 shadow-lg">
                            {category.count} services
                          </div>
                          {expandedCategory === category.id ? (
                            <ChevronUp className="h-5 w-5 text-purple-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {/* Contenu dépliable avec services et photos */}
                    {expandedCategory === category.id && (
                      <div className="p-6 space-y-4">
                        {category.services.map((service, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                              {/* Photo de prestation */}
                              <div className="flex-shrink-0">
                                <img
                                  src={service.image}
                                  alt={service.name}
                                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl object-cover shadow-lg border border-white/40"
                                />
                              </div>
                              
                              {/* Contenu service */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h4>
                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                  </div>
                                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent ml-6">
                                    {service.price}€
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-medium text-sm">{service.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                      <span className="font-medium text-sm">{service.rating} ({service.reviews})</span>
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
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET ÉQUIPE */}
          {activeTab === 'equipe' && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Notre équipe d'experts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 text-center hover:bg-white/90 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white/50"
                    />
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-purple-100/80 backdrop-blur-xl text-purple-700 px-3 py-1 rounded-full text-sm border border-white/40">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mt-3">{member.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET GALERIE */}
          {activeTab === 'galerie' && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nos réalisations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=300&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&q=80'
                ].map((image, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-2 hover:bg-white/80 transition-all duration-300 shadow-lg">
                    <img
                      src={image}
                      alt={`Réalisation ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET INFOS */}
          {activeTab === 'infos' && (
            <div className="p-6 lg:p-8">
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-3 text-purple-600" />
                    Informations pratiques
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                      <p className="text-gray-600">{salonData.address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                      <p className="text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-purple-600" />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Lundi - Vendredi</span>
                      <span className="text-gray-600">9h00 - 19h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Samedi</span>
                      <span className="text-gray-600">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dimanche</span>
                      <span className="text-gray-600">Fermé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET AVIS */}
          {activeTab === 'avis' && (
            <div className="p-6 lg:p-8">
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{salonData.rating}</span>
                </div>
                <p className="text-gray-600">Basé sur {salonData.reviewCount} avis vérifiés</p>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/90 transition-all duration-300 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">Il y a {review.date}</span>
                        </div>
                      </div>
                      <span className="bg-purple-100/80 backdrop-blur-xl text-purple-700 px-3 py-1 rounded-full text-sm border border-white/40">
                        {review.service}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PIED DE PAGE - Identique à la page d'accueil */}
        <div className="mt-16 text-center text-xs text-gray-500 pb-8">
          <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </div>
  );
}