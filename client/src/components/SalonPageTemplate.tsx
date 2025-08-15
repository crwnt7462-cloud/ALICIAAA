import { useState, useEffect } from 'react';
import { useCustomColors } from '@/hooks/useCustomColors';
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

interface SalonService {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
}

interface SalonStaff {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
}

interface SalonReview {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
  ownerResponse?: {
    message: string;
    date: string;
  };
}

interface SalonData {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  coverImageUrl?: string;
  logo?: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  amenities: string[];
  priceRange: string;
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass: string;
    priceColor: string;
    neonFrame: string;
    intensity: number;
  };
}

interface SalonPageTemplateProps {
  salonData: SalonData;
  services: SalonService[];
  staff: SalonStaff[];
  reviews: SalonReview[];
  isOwner?: boolean;
}

/**
 * Template complet de page salon standardisé avec personnalisations
 * Inclut : Header, onglets (Services, Équipe, Galerie, Infos, Avis), couleurs personnalisées
 * Layout responsive et cohérent pour tous les salons
 */
export function SalonPageTemplate({ 
  salonData, 
  services = [], 
  staff = [], 
  reviews = []
}: SalonPageTemplateProps) {
  console.log('🎨 SalonPageTemplate - CustomColors appliquées:', salonData?.customColors);
  
  // ✅ Utiliser les couleurs personnalisées du salon
  const { customColors } = useCustomColors(salonData.slug);
  
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1]));
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  // Appliquer les variables CSS dynamiquement
  useEffect(() => {
    if (customColors) {
      const root = document.documentElement;
      root.style.setProperty('--salon-primary', customColors.primary);
      root.style.setProperty('--salon-accent', customColors.accent);
      root.style.setProperty('--salon-button-text', customColors.buttonText);
      root.style.setProperty('--salon-price-color', customColors.priceColor);
      root.style.setProperty('--salon-neon-frame', customColors.neonFrame);
      root.style.setProperty('--salon-intensity', (customColors.intensity / 100).toString());
      
      console.log('✅ Variables CSS salon appliquées globally');
    }
  }, [customColors]);

  // Organiser les services par catégorie
  const servicesByCategory = services.reduce((acc: any, service: any) => {
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

  const toggleDescription = (categoryId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Générer des données d'avis par service (simulation)
  const getServiceReviews = (serviceId: number) => {
    const allReviews = [
      { id: 1, rating: 5, comment: "Service impeccable !", clientName: "Marie L.", serviceId: 1 },
      { id: 2, rating: 4, comment: "Très satisfait du résultat", clientName: "Paul M.", serviceId: 1 },
      { id: 3, rating: 5, comment: "Rasage parfait, ambiance top", clientName: "Thomas K.", serviceId: 3 },
      { id: 4, rating: 5, comment: "Antoine est un vrai pro", clientName: "Pierre D.", serviceId: 2 },
      { id: 5, rating: 4, comment: "Excellent soin, très relaxant", clientName: "Jean R.", serviceId: 5 }
    ];
    return allReviews.filter(review => review.serviceId === serviceId);
  };

  // Générer des photos par service (simulation)
  const getServicePhotos = (serviceId: number) => {
    const photosByService: { [key: number]: string[] } = {
      1: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400&h=300&fit=crop"
      ],
      2: [
        "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
      ],
      3: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559599538-ecae83ba5934?w=400&h=300&fit=crop"
      ]
    };
    return photosByService[serviceId] || [];
  };

  // Calculer la note moyenne d'un service
  const getServiceRating = (serviceId: number) => {
    const reviews = getServiceReviews(serviceId);
    if (reviews.length === 0) return 4.5; // Note par défaut
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec photo de couverture */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={salonData.coverImageUrl || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
          alt={salonData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
        
        {/* Bouton retour */}
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
            onClick={() => navigator.share?.({ title: salonData.name, url: window.location.href })}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Informations salon - Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{salonData.name}</h1>
            <CheckCircle className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{salonData.rating || 4.8}</span>
              <span className="text-white/80">({salonData.reviewsCount || 0} avis)</span>
            </div>
            <span className="text-white/80">{salonData.priceRange}</span>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{salonData.address}</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets avec couleurs personnalisées */}
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
              <div key={category.id} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-lg shadow-purple-500/10">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/60 transition-all duration-300"
                >
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm text-gray-600 ${expandedDescriptions.has(category.id) ? '' : 'truncate'}`}>
                        {category.name === 'Coupe' && 'Services de coupe et styling professionnels'}
                        {category.name === 'Rasage' && 'Rasage traditionnel et moderne au coupe-chou'}
                        {category.name === 'Soins' && 'Soins du visage et de la barbe avec produits premium'}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(category.id);
                        }}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium whitespace-nowrap"
                      >
                        {expandedDescriptions.has(category.id) ? 'voir -' : '(voir +)'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-500">{category.services.length} service{category.services.length > 1 ? 's' : ''}</span>
                    {category.expanded ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                </button>
                
                {category.expanded && (
                  <div className="border-t border-gray-200/50">
                    {category.services.map((service: any) => {
                      const serviceReviews = getServiceReviews(service.id);
                      const serviceRating = getServiceRating(service.id);
                      const servicePhotos = getServicePhotos(service.id);
                      
                      return (
                        <div key={service.id} className="px-6 py-5 border-b border-gray-100/50 last:border-b-0">
                          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            {/* Info principale du service */}
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-lg text-gray-900 truncate sm:whitespace-normal">{service.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{service.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {service.duration} min
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-semibold text-gray-900">{serviceRating.toFixed(1)}</span>
                                      <span className="text-xs text-gray-500">({serviceReviews.length} avis)</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-600">
                                      {service.price}€
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Avis clients pour ce service */}
                              {serviceReviews.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <h5 className="text-sm font-semibold text-gray-700">Avis clients :</h5>
                                  <div className="space-y-2">
                                    {serviceReviews.slice(0, 2).map((review) => (
                                      <div key={review.id} className="bg-gray-50/80 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                          </div>
                                          <span className="text-xs font-medium text-gray-700">{review.clientName}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 italic">"{review.comment}"</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Galerie photos du service */}
                              {servicePhotos.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Photos de ce service :</h5>
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {servicePhotos.slice(0, 4).map((photo, index) => (
                                      <div key={index} className="flex-shrink-0">
                                        <img 
                                          src={photo}
                                          alt={`${service.name} ${index + 1}`}
                                          className="w-20 h-20 object-cover rounded-lg border-2 border-white/50 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Bouton réservation avec style DA Avyento */}
                              <div className="mt-4">
                                <button 
                                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-violet-600 to-amber-500 rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95 backdrop-blur-xl border border-white/20"
                                  onClick={() => window.location.href = `/booking/${salonData.slug}?service=${service.id}`}
                                >
                                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-violet-600 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                  <Calendar className="h-4 w-4 mr-2 relative z-10" />
                                  <span className="relative z-10 text-sm font-semibold">Réserver maintenant</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="grid gap-4">
            {staff.map((member: any) => (
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
                    <p className="text-sm text-gray-600">{salonData.address}</p>
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
                      href={`tel:${salonData.phone}`} 
                      className="text-sm hover:underline"
                      style={{ color: customColors?.primary || '#3b82f6' }}
                    >
                      {salonData.phone}
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
                      {salonData.openingHours && Object.entries(salonData.openingHours).map(([day, hours]: [string, any]) => (
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

            {salonData.amenities && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customColors?.primary || '#1f2937' }}>
                  Équipements et services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {salonData.amenities.map((amenity: string) => (
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
            {reviews.map((review: any) => (
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