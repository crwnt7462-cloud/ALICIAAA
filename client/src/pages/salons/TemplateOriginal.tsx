import React, { useState, useEffect } from 'react';
import { useCustomColors } from '@/hooks/useCustomColors';
import { useSalonPageTemplate, getDefaultSalonData } from '@/hooks/useSalonPageTemplate';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Heart, 
  Share2,
  Calendar,
  Users,
  Camera,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

export default function TemplateOriginal() {
  const salonSlug = 'demo-user'; // Salon démo par défaut
  const { salonData, services, staff, reviews, loading, isOwner } = useSalonPageTemplate(salonSlug);
  const { customColors } = useCustomColors(salonSlug);
  
  // États pour l'interface
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1]));
  const [isFavorite, setIsFavorite] = useState(false);

  // Données par défaut spécifiques au Barbier Gentleman Marais
  const defaultData = getDefaultSalonData('Barbier Gentleman Marais', salonSlug);
  
  // Personnalisation spécifique pour ce salon
  const customizedSalonData = salonData || {
    ...defaultData.salonData,
    name: 'Barbier Gentleman Marais',
    description: 'Salon de coiffure traditionnel au cœur du Marais - Excellence et savoir-faire depuis 1995',
    address: '15 Rue des Rosiers, 75004 Paris',
    phone: '01 42 72 18 39',
    coverImageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    amenities: ['WiFi gratuit', 'Climatisation', 'Produits professionnels', 'Parking proche', 'Accessible PMR'],
    priceRange: '€€',
    openingHours: {
      lundi: { closed: true, open: '', close: '' },
      mardi: { open: '09:00', close: '19:00' },
      mercredi: { open: '09:00', close: '19:00' },
      jeudi: { open: '09:00', close: '19:30' },
      vendredi: { open: '09:00', close: '19:30' },
      samedi: { open: '08:30', close: '18:00' },
      dimanche: { open: '10:00', close: '17:00' }
    }
  };

  const customizedServices = services.length > 0 ? services : [
    {
      id: 1,
      name: "Coupe Gentleman",
      description: "Coupe traditionnelle à la tondeuse et aux ciseaux",
      price: 35,
      duration: 45,
      category: "coiffure"
    },
    {
      id: 2,
      name: "Taille de Barbe",
      description: "Taille et entretien de barbe avec rasoir traditionnel",
      price: 25,
      duration: 30,
      category: "barbe"
    },
    {
      id: 3,
      name: "Rasage Traditionnel",
      description: "Rasage complet au rasoir avec serviettes chaudes",
      price: 30,
      duration: 40,
      category: "barbe"
    },
    {
      id: 4,
      name: "Coupe + Barbe",
      description: "Formule complète coupe et barbe",
      price: 55,
      duration: 75,
      category: "formules"
    },
    {
      id: 5,
      name: "Soin Capillaire",
      description: "Shampooing et soin nourrissant",
      price: 20,
      duration: 25,
      category: "soins"
    }
  ];

  const customizedStaff = staff.length > 0 ? staff : [
    {
      id: 1,
      name: "Antoine Mercier",
      role: "Maître Barbier",
      specialties: ["Coupe traditionnelle", "Rasage", "Conseil style"],
      rating: 4.9,
      reviewsCount: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Julien Moreau",
      role: "Barbier",
      specialties: ["Coupe moderne", "Barbe", "Styling"],
      rating: 4.8,
      reviewsCount: 89,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Pierre Dubois",
      role: "Coiffeur Senior",
      specialties: ["Coupes classiques", "Conseil", "Soins"],
      rating: 4.7,
      reviewsCount: 67
    }
  ];

  const customizedReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      clientName: "Marc D.",
      rating: 5,
      comment: "Excellent barbier ! Antoine maîtrise parfaitement l'art du rasage traditionnel. Un vrai savoir-faire.",
      date: "Il y a 3 jours",
      service: "Rasage Traditionnel",
      verified: true,
      ownerResponse: {
        message: "Merci Marc ! C'est un plaisir de perpétuer ces techniques traditionnelles.",
        date: "Il y a 2 jours"
      }
    },
    {
      id: 2,
      clientName: "Thomas R.",
      rating: 5,
      comment: "Salon authentique dans le Marais. Service impeccable et ambiance chaleureuse. Je recommande vivement !",
      date: "Il y a 1 semaine",
      service: "Coupe Gentleman",
      verified: true
    },
    {
      id: 3,
      clientName: "Alexandre M.",
      rating: 4,
      comment: "Très bon salon, coupe parfaite. Julien est très professionnel et de bon conseil.",
      date: "Il y a 2 semaines",
      service: "Coupe + Barbe",
      verified: true,
      ownerResponse: {
        message: "Merci Alexandre ! Julien sera ravi de ce retour positif.",
        date: "Il y a 2 semaines"
      }
    },
    {
      id: 4,
      clientName: "Philippe L.",
      rating: 5,
      comment: "Une institution dans le quartier ! Toujours satisfait depuis 5 ans que je viens ici.",
      date: "Il y a 3 semaines",
      service: "Taille de Barbe",
      verified: true
    }
  ];

  // Organiser les services par catégorie avec couleurs personnalisées
  const servicesByCategory = customizedServices.reduce((acc: any, service: any) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const displayServiceCategories = Object.keys(servicesByCategory).map((categoryName, index) => ({
    id: index + 1,
    name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
    services: servicesByCategory[categoryName],
    expanded: expandedCategories.has(index + 1)
  }));

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

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
    <div className="min-h-screen bg-white">
      {/* Header avec photo de couverture - Design Barbier Gentleman Marais */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={customizedSalonData.coverImageUrl || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
          alt={customizedSalonData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
        
        {/* Bouton retour avec couleurs personnalisées */}
        <button 
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all z-10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        {/* Actions header */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <button 
            onClick={() => navigator.share?.({ title: customizedSalonData.name, url: window.location.href })}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Informations salon - Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{customizedSalonData.name}</h1>
            <CheckCircle className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-white/80">(247 avis)</span>
            </div>
            <span className="text-white/80">{customizedSalonData.priceRange}</span>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{customizedSalonData.address}</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - Design original */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'equipe', label: 'Équipe', icon: Users },
            { id: 'galerie', label: 'Galerie', icon: Camera },
            { id: 'infos', label: 'Infos', icon: MapPin },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-3 px-2 text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ 
                borderColor: activeTab === tab.id ? (customColors?.primary || '#8b5cf6') : 'transparent',
                color: activeTab === tab.id ? (customColors?.primary || '#1f2937') : undefined,
                backgroundColor: activeTab === tab.id ? `${customColors?.primary || '#8b5cf6'}10` : 'transparent'
              }}
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets avec couleurs personnalisées */}
      <div className="p-6">
        {activeTab === 'services' && (
          <div className="space-y-6">
            {displayServiceCategories.map((category: any) => (
              <div key={category.id} className="bg-gray-50 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {category.expanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                
                {category.expanded && (
                  <div className="border-t border-gray-200">
                    {category.services.map((service: any) => (
                      <div key={service.id} className="salon-service-card mx-4 my-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="salon-service-name font-medium">{service.name}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{service.duration} min</p>
                          </div>
                          <div className="ml-4">
                            <p className="salon-custom-price text-lg">
                              {service.price}
                              <span className="salon-currency-symbol ml-0.5">€</span>
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          className="salon-custom-button w-full mt-3 py-2 rounded-lg text-sm font-medium"
                          onClick={() => {
                            // Action de réservation avec redirection vers booking
                            window.location.href = `/booking/${salonSlug}?service=${service.id}`;
                          }}
                        >
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Réserver maintenant
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="grid gap-4">
            {customizedStaff.map((member: any) => (
              <div key={member.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-4">
                  <img 
                    src={member.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80`}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{member.rating}</span>
                      <span className="text-xs text-gray-500">({member.reviewsCount} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty: string) => (
                      <span 
                        key={specialty} 
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: customColors?.primary ? `${customColors.primary}20` : '#f3f4f6',
                          color: customColors?.primary || '#374151'
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'galerie' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Galerie photos avec couleurs personnalisées */}
            {[
              'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            ].map((photo, index) => (
              <div 
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                style={{ 
                  boxShadow: `0 4px 12px ${customColors?.primary || '#8b5cf6'}20` 
                }}
              >
                <img 
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${customColors?.primary || '#8b5cf6'}80` 
                  }}
                >
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-6">
            {/* Informations salon avec couleurs personnalisées */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4" style={{ color: customColors?.primary || '#1f2937' }}>
                Informations pratiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${customColors?.primary || '#8b5cf6'}20`,
                      color: customColors?.primary || '#8b5cf6'
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">{customizedSalonData.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${customColors?.primary || '#8b5cf6'}20`,
                      color: customColors?.primary || '#8b5cf6'
                    }}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <a 
                      href={`tel:${customizedSalonData.phone}`} 
                      className="text-sm hover:underline"
                      style={{ color: customColors?.primary || '#3b82f6' }}
                    >
                      {customizedSalonData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${customColors?.primary || '#8b5cf6'}20`,
                      color: customColors?.primary || '#8b5cf6'
                    }}
                  >
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Horaires d'ouverture</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      {customizedSalonData.openingHours && Object.entries(customizedSalonData.openingHours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize font-medium">{day}</span>
                          <span>
                            {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Équipements avec couleurs personnalisées */}
            {customizedSalonData.amenities && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customColors?.primary || '#1f2937' }}>
                  Équipements et services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {customizedSalonData.amenities.map((amenity: string) => (
                    <span 
                      key={amenity} 
                      className="px-3 py-2 text-sm rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${customColors?.primary || '#8b5cf6'}15`,
                        color: customColors?.primary || '#374151',
                        border: `1px solid ${customColors?.primary || '#8b5cf6'}30`
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            {customizedReviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                      {review.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.service}</p>
                
                {review.ownerResponse && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Réponse du salon</span>
                      <span className="text-xs text-gray-500">{review.ownerResponse.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.ownerResponse.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}