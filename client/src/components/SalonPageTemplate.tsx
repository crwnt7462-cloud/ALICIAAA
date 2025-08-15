import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalonGalleryTemplate } from '@/components/SalonGalleryTemplate';

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

interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  services: SalonService[];
  expanded: boolean;
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
}

interface SalonPageTemplateProps {
  salonData: SalonData;
  services: SalonService[];
  staff: SalonStaff[];
  reviews: SalonReview[];
  isOwner?: boolean;
}

/**
 * Template complet de page salon standardisé
 * Inclut : Header, onglets, galerie, services, équipe, avis
 * Layout responsive et cohérent pour tous les salons
 */
export function SalonPageTemplate({ 
  salonData, 
  services = [], 
  staff = [], 
  reviews = [],
  isOwner = false 
}: SalonPageTemplateProps) {
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedCategoryDescriptions, setExpandedCategoryDescriptions] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Grouper les services par catégorie avec descriptions
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, SalonService[]>);

  // Créer les catégories de services avec descriptions
  const displayServiceCategories: ServiceCategory[] = useMemo(() => 
    Object.entries(servicesByCategory).map(([categoryName, categoryServices], index) => ({
      id: index + 1,
      name: categoryName,
      description: getCategoryDescription(categoryName),
      services: categoryServices,
      expanded: expandedCategories.has(index + 1),
    })), [servicesByCategory, expandedCategories]);

  // Fonction pour obtenir les descriptions de catégories avec formatage HTML
  function getCategoryDescription(categoryName: string): string | undefined {
    const descriptions: Record<string, string> = {
      'Coupe & Styling': '<strong>Créativité</strong> et <em>savoir-faire</em> pour sublimer votre <u>style unique</u>',
      'Barbe & Moustache': '<strong>Précision</strong> et <em>finition parfaite</em> pour un look <u>impeccable</u>',
      'Soins & Traitements': '<strong>Relaxation</strong> et <em>bien-être</em> pour une <u>expérience premium</u>',
      'Colorations': '<strong>Innovation</strong> et <em>personnalisation</em> pour révéler votre <u>véritable couleur</u>'
    };
    return descriptions[categoryName];
  }

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set();
      if (!prev.has(categoryId)) {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Calculer les stats
  const averageServicePrice = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;

  const handleBooking = (serviceId?: number) => {
    // Navigation vers réservation
    window.location.href = `/salon-booking/${salonData.slug}${serviceId ? `?service=${serviceId}` : ''}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: salonData.name,
        text: salonData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec photo de couverture - EXACTEMENT COMME BARBIER GENTLEMAN MARAIS */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={salonData.coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
          alt={salonData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
        
        {/* Bouton retour - Style Avyento */}
        <button 
          onClick={() => {
            console.log('🔙 Bouton retour cliqué - Navigation vers /search');
            window.location.href = '/search';
          }}
          className="absolute top-8 left-4 avyento-button-secondary w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center z-10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        
        {/* Informations salon en overlay - Style Avyento */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-0">{salonData.name}</h1>
            <CheckCircle className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{salonData.rating || 4.8}</span>
              <span className="opacity-90">({salonData.reviewsCount || 0} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 opacity-90" />
              <span className="opacity-90">{salonData.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - Style Avyento Responsive */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex salon-tab-navigation">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'equipe', label: 'Équipe', icon: Users },
            { id: 'galerie', label: 'Galerie', icon: Camera },
            { id: 'info', label: 'Infos', icon: MapPin },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`salon-tab-button flex items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ flex: '1 1 0px', minWidth: '20%' }}
            >
              <tab.icon className="salon-tab-icon h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="salon-tab-label truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets - Style mobile exact */}
      <div className="bg-white p-6 pb-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {displayServiceCategories.map((category: ServiceCategory) => (
              <div key={category.id} className="avyento-card overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                    {/* Description affichée uniquement quand le volet est fermé */}
                    {!category.expanded && category.description && (
                      <div className="mt-2">
                        <div 
                          className="text-sm text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: expandedCategoryDescriptions.has(category.id) 
                              ? category.description 
                              : category.description.length > 80 
                                ? category.description.substring(0, 80) + '...'
                                : category.description
                          }}
                        />
                        {category.description.length > 80 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCategoryDescriptions(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(category.id)) {
                                  newSet.delete(category.id);
                                } else {
                                  newSet.add(category.id);
                                }
                                return newSet;
                              });
                            }}
                            className="text-violet-600 hover:text-violet-700 text-sm font-medium mt-1 transition-colors cursor-pointer"
                          >
                            {expandedCategoryDescriptions.has(category.id) ? 'Voir moins' : 'Voir +'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {category.expanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                
                {category.expanded && (
                  <div className="border-t border-gray-100">
                    <div className="space-y-0">
                      {category.services.map((service: SalonService) => (
                        <div key={service.id} className="p-5 border-b border-gray-50 last:border-b-0">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                {/* Notation du service */}
                                {service.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                                    {service.reviewCount && (
                                      <button 
                                        className="text-xs text-violet-600 hover:text-violet-700 font-medium underline"
                                        onClick={() => setActiveTab('reviews')}
                                      >
                                        ({service.reviewCount} avis)
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Description service */}
                              {service.description && (
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                  {service.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  Durée : {service.duration} min
                                </div>
                                <div className="text-lg font-semibold text-violet-600">
                                  {service.price}€
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleBooking(service.id)}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                          >
                            Réserver ce service
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Onglet Équipe */}
        {activeTab === 'equipe' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="avyento-card">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-violet-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-violet-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(member.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {member.rating} ({member.reviewsCount} avis)
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Galerie */}
        {activeTab === 'galerie' && (
          <div>
            <SalonGalleryTemplate salonId={salonData.id} />
          </div>
        )}

        {/* Onglet Infos */}
        {activeTab === 'info' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations de contact */}
              <div className="avyento-card">
                <h3 className="text-xl font-semibold mb-4">Informations</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-violet-600" />
                    <span>{salonData.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-violet-600" />
                    <span>{salonData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Horaires d'ouverture */}
              <div className="avyento-card">
                <h3 className="text-xl font-semibold mb-4">Horaires</h3>
                <div className="space-y-2">
                  {Object.entries(salonData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">
                        {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Équipements */}
            <div className="avyento-card">
              <h3 className="text-xl font-semibold mb-4">Équipements</h3>
              <div className="grid grid-cols-2 gap-3">
                {salonData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Avis */}
        {activeTab === 'avis' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="avyento-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{review.service}</Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  {review.ownerResponse && (
                    <div className="border-l-4 border-violet-200 pl-4 bg-violet-50/30 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-violet-700">Réponse du salon</span>
                        <Badge variant="secondary" className="text-xs">Propriétaire</Badge>
                      </div>
                      <p className="text-sm text-gray-700">{review.ownerResponse.message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">{review.ownerResponse.date}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}