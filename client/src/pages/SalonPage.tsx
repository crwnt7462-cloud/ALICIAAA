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
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function SalonPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [, navigate] = useLocation();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      {/* Header salon responsive avec effet glass */}
      <div className="bg-white/90 backdrop-blur-16 border-b border-violet-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full bg-violet-100/50 hover:bg-violet-200/70"
            >
              <ArrowLeft className="h-4 w-4 text-violet-700" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">{salonData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3 text-violet-600" />
                <span>{salonData.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 pb-20 lg:pb-6">
        {/* En-tête salon avec infos */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-2 mb-2 lg:mb-4">
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900">{salonData.name}</h2>
            {salonData.verified && (
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-violet-600" />
            )}
          </div>
          <div className="flex items-center gap-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 lg:h-5 lg:w-5 fill-current text-amber-400" />
              <span className="font-medium text-gray-900">{salonData.rating}</span>
              <span className="text-sm text-gray-600">({salonData.reviewCount} avis)</span>
            </div>
            <Badge variant="secondary" className="bg-violet-100/70 text-violet-700 border-violet-200/50">
              {salonData.priceRange}
            </Badge>
          </div>
          
          {/* Bouton de réservation principal */}
          <Button 
            onClick={() => navigate('/avyento-booking')}
            className="w-full lg:w-auto bg-violet-600/90 backdrop-blur-8 hover:bg-violet-700 text-white font-semibold text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Réserver maintenant
          </Button>
        </div>

        {/* Onglets de navigation */}
        <div className="mb-6 lg:mb-8">
          <div className="flex space-x-1 bg-slate-50/90 backdrop-blur-8 p-1 rounded-lg border border-violet-200/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base font-medium rounded-md transition-all duration-200 ${
                  tab.active
                    ? 'bg-white/80 text-violet-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'services' && (
          <div className="space-y-4 lg:space-y-6">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                <div 
                  className="bg-white/70 backdrop-blur-12 border border-violet-200/50 rounded-xl shadow-sm mb-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="h-5 w-5 text-violet-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-violet-600" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedCategory === category.id && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
                    {category.services.map((service, index) => (
                      <Card 
                        key={index}
                        className="bg-white/70 backdrop-blur-12 border border-violet-200/50 hover:border-violet-300/70 hover:bg-white/80 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
                        onClick={() => navigate('/avyento-booking')}
                      >
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={service.photo} 
                              alt={service.name}
                              className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-base lg:text-lg">{service.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="h-3 w-3 fill-current text-amber-400" />
                                <span className="text-sm text-gray-600">{service.rating} ({service.reviews})</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3 text-violet-600" />
                              <span>{formatDuration(service.duration)}</span>
                            </div>
                            <div className="text-xl font-bold text-violet-700">
                              {service.price}€
                            </div>
                          </div>
                          
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/avyento-booking');
                            }}
                            className="w-full mt-4 bg-violet-600/90 backdrop-blur-8 hover:bg-violet-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            Réserver
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-white/70 backdrop-blur-12 border border-violet-200/50 shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{member.name}</h4>
                      <p className="text-violet-600 font-medium">{member.role}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-current text-amber-400" />
                        <span className="text-sm text-gray-600">{member.rating} ({member.reviewsCount} avis)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white/70 backdrop-blur-12 border border-violet-200/50 shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{review.name}</span>
                        {review.verified && (
                          <CheckCircle className="h-4 w-4 text-violet-600" />
                        )}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-sm text-violet-600">Service: {review.service}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'infos' && (
          <Card className="bg-white/70 backdrop-blur-12 border border-violet-200/50 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">Informations pratiques</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-violet-600" />
                  <span className="text-gray-600">{salonData.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-violet-600" />
                  <span className="text-gray-600">Lun-Sam: 9h-19h, Dim: 10h-18h</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-violet-600" />
                  <span className="text-gray-600">01 42 36 25 14</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'galerie' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/70 backdrop-blur-12 border border-violet-200/50 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={`https://images.unsplash.com/photo-${1522337360788 + i}?w=300&h=300&fit=crop&q=80`}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Navigation mobile */}
      <MobileBottomNav />
    </div>
  );
}