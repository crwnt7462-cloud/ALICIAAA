import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  CheckCircle,
  Facebook,
  Instagram,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SalonPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [, navigate] = useLocation();

  // Couleur primaire du salon
  const primaryColor = '#8b5cf6';

  // Données du salon - MODE AFFICHAGE UNIQUEMENT
  const salonData = {
    name: "Salon Avyento",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
    priceRange: "€€€",
    address: "75001 Paris, France",
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

  // Services avec photos et avis
  const serviceCategories = [
    {
      id: 'coiffure',
      name: 'Coiffure',
      description: 'Coupes, colorations et soins capillaires',
      services: [
        {
          name: 'Coupe + Brushing',
          price: 45,
          duration: 60,
          description: 'Coupe personnalisée avec brushing professionnel',
          photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
          rating: 4.8,
          reviews: 23
        },
        {
          name: 'Coloration complète',
          price: 85,
          duration: 120,
          description: 'Coloration permanente avec soin protecteur',
          photo: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop&q=80',
          rating: 4.9,
          reviews: 18
        },
        {
          name: 'Mèches + Balayage',
          price: 95,
          duration: 150,
          description: 'Technique de balayage pour un effet naturel',
          photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
          rating: 4.7,
          reviews: 31
        }
      ]
    },
    {
      id: 'esthetique',
      name: 'Esthétique',
      description: 'Soins du visage et épilation',
      services: [
        {
          name: 'Soin visage purifiant',
          price: 65,
          duration: 75,
          description: 'Nettoyage en profondeur et hydratation',
          photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&q=80',
          rating: 4.6,
          reviews: 14
        },
        {
          name: 'Épilation sourcils',
          price: 25,
          duration: 30,
          description: 'Mise en forme professionnelle des sourcils',
          photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
          rating: 4.8,
          reviews: 42
        }
      ]
    }
  ];

  // Membres de l'équipe
  const teamMembers = [
    {
      name: "Marie Dubois",
      role: "Directrice & Coiffeuse experte",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b332c42c?w=300&h=300&fit=crop&crop=face",
      specialties: ["Colorations", "Coupes tendances", "Mariages"]
    },
    {
      name: "Sophie Martin", 
      role: "Coiffeuse & Coloriste",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      specialties: ["Balayages", "Soins", "Extensions"]
    },
    {
      name: "Emma Laurent",
      role: "Esthéticienne",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      specialties: ["Soins visage", "Épilations", "Maquillage"]
    }
  ];

  const formatDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de fond et overlay glassmorphism */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <img 
          src={salonData.backgroundImage}
          alt={salonData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Informations salon en overlay - SANS BOUTON RÉSERVER */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-16 border border-violet-100/30 rounded-3xl shadow-xl p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {salonData.name}
                    </h1>
                    {salonData.verified && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-gray-900">{salonData.rating}</span>
                      <span className="text-sm text-gray-600">({salonData.reviewCount} avis)</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 border-violet-200">
                      {salonData.priceRange}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{salonData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets avec design original */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-white text-violet-600 hover:bg-violet-50 border border-violet-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                <div 
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 hover:shadow-2xl hover:border-violet-200/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-5 h-5 text-violet-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                </div>

                {/* Services de la catégorie */}
                {expandedCategory === category.id && (
                  <div className="mt-4 space-y-4">
                    {category.services.map((service, idx) => (
                      <Card key={idx} className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:border-violet-200/50 transition-all duration-300">
                        <CardContent className="p-6 lg:p-8">
                          <div className="flex gap-4">
                            <img 
                              src={service.photo}
                              alt={service.name}
                              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {service.name}
                                </h4>
                                <div className="text-right">
                                  <div className="font-bold text-lg" style={{ color: primaryColor }}>
                                    {service.price}€
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-3">
                                {service.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-medium">{service.rating}</span>
                                    <span className="text-xs text-gray-500">({service.reviews} avis)</span>
                                  </div>
                                </div>
                                
                                <Button
                                  onClick={() => navigate('/avyento-booking')}
                                  className="bg-violet-600/90 hover:bg-violet-700/90 backdrop-blur-16 border border-violet-400/30 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 h-9 px-4 text-sm"
                                >
                                  Réserver
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Onglet Équipe */}
        {activeTab === 'equipe' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:border-violet-200/50 transition-all duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="text-center">
                    <img 
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty, specIdx) => (
                        <Badge key={specIdx} variant="secondary" className="bg-violet-100 text-violet-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Autres onglets */}
        {activeTab === 'galerie' && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Galerie Photos</h3>
            <p className="text-gray-600">Photos du salon à venir...</p>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations pratiques</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-violet-600" />
                <span>{salonData.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-600" />
                <span>01 42 86 98 15</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-violet-600" />
                <span>Lun-Sam: 9h-19h, Dim: 10h-18h</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Avis clients</h3>
            <p className="text-gray-600">Système d'avis en développement...</p>
          </div>
        )}
      </div>
    </div>
  );
}