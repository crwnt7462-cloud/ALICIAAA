import { useState } from 'react';
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

  // Fonction pour formater la durée intelligemment
  const formatDuration = (minutes: number) => {
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

  // Équipe - MODE AFFICHAGE
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Martinez',
      role: 'Coiffeuse Senior',
      specialties: ['Colorations', 'Coupes tendances', 'Soins capillaires'],
      rating: 4.9,
      reviewsCount: 127,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face',
      availableToday: true,
      nextSlot: '14:30',
      experience: '8 ans d\'expérience',
      bio: 'Passionnée par les nouvelles tendances, Sarah vous accompagne dans votre transformation capillaire.'
    }
  ];

  // Avis
  const reviews = [
    {
      id: 1,
      name: 'Marie L.',
      rating: 5,
      date: 'Il y a 2 jours',
      comment: 'Service exceptionnel ! Sarah a réalisé exactement la coupe que je souhaitais.',
      service: 'Coupe + Brushing',
      verified: true,
      photos: ['https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80']
    }
  ];

  // Fonction pour appliquer la couleur aux boutons
  const getButtonStyle = (variant: 'solid' | 'outline' = 'solid') => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        color: primaryColor,
        borderColor: primaryColor,
        border: `1px solid ${primaryColor}`
      };
    }
    
    return {
      backgroundColor: primaryColor,
      color: 'white',
      border: 'none'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header salon avec image de fond */}
      <div className="relative">
        <div 
          className="h-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Informations salon */}
        <div className="bg-white px-4 pb-4">
          <div className="flex items-start gap-4 -mt-8 relative z-10">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-violet-600">
                {salonData.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 mt-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{salonData.name}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {salonData.address}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{salonData.rating}</span>
                  <span className="text-xs text-gray-500">({salonData.reviewCount} avis)</span>
                </div>
                {salonData.verified && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {salonData.priceRange}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? 'text-gray-900 hover:text-gray-900 hover:border-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              style={tab.active ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4 space-y-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {serviceCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="flex items-center gap-2 text-left flex-1"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {category.services.length} service{category.services.length > 1 ? 's' : ''}
                        </span>
                        <div className="p-1">
                          {expandedCategory === category.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  </div>

                  {expandedCategory === category.id && (
                    <div className="space-y-3 mt-4 pt-3 border-t border-gray-100">
                      {category.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={service.photo}
                            alt={service.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{service.price}€</span>
                                <p className="text-xs text-gray-500">{formatDuration(service.duration)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{formatDuration(service.duration)}</span>
                              </div>
                              {service.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-gray-600">{service.rating}</span>
                                  <span className="text-xs text-gray-400">({service.reviews})</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Bouton Réserver centré en bas */}
                            <div className="flex justify-center mt-3">
                              <Button 
                                size="sm" 
                                style={getButtonStyle('outline')}
                                className="px-6"
                              >
                                Réserver
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-xs text-gray-500">{member.experience}</p>
                        </div>
                        {member.availableToday && (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Disponible
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{member.bio}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{member.rating}</span>
                            <span className="text-xs text-gray-500">({member.reviewsCount})</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          style={getButtonStyle('outline')}
                        >
                          Réserver avec {member.name.split(' ')[0]}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'galerie' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Galerie photos</h3>
              <p className="text-gray-600 text-sm mb-4">Découvrez nos réalisations</p>
              
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=400&h=300&fit=crop&q=80"
                  alt="Réalisation 1"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop&q=80"
                  alt="Réalisation 2"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Informations pratiques</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">@salon-avyento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span className="text-sm">@salon.avyento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Lun-Ven: 9h-19h, Sam: 9h-17h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{salonData.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        {review.service && (
                          <Badge variant="outline" className="text-xs mt-2">
                            {review.service}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer identique à la page d'accueil */}
        <div className="text-center text-xs text-gray-500 pb-4 mt-8">
          <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </div>
  );
}