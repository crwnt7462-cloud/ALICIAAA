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
                          onClick={() => window.location.href = `/booking/${salonData.slug}?service=${service.id}`}
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