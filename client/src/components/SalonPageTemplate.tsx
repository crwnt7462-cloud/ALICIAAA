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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{salonData.rating || 4.8}</span>
              <span className="opacity-90">({salonData.reviewsCount || 0} avis)</span>
            </div>
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 opacity-90 mt-0.5 flex-shrink-0" />
              <span className="opacity-90 leading-tight">{salonData.address}</span>
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
                                {/* Notation du service - EXACTEMENT COMME BARBIER */}
                              {service.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                                  {service.reviewCount && (
                                    <button 
                                      className="text-xs text-violet-600 hover:text-violet-700 font-medium underline"
                                      onClick={() => setActiveTab('avis')}
                                    >
                                      ({service.reviewCount} avis)
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Galerie photos - EXACTEMENT COMME BARBIER */}
                            {service.photos && service.photos.length > 0 && (
                              <div className="flex gap-2 mt-2 mb-2">
                                {service.photos.slice(0, 3).map((photo, index) => (
                                  <div key={index} className="relative">
                                    <img 
                                      src={photo.replace('w=1200', 'w=200')} 
                                      alt={`${service.name} ${index + 1}`}
                                      className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                                      loading="lazy"
                                      style={{ imageRendering: 'auto' }}
                                    />
                                    {index === 2 && service.photos.length > 3 && (
                                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer">
                                        <span className="text-white text-xs font-semibold">+{service.photos.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {service.photos.length > 0 && (
                                  <button className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-violet-400 transition-colors">
                                    <Camera className="h-4 w-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {/* Description avec voir plus - EXACTEMENT COMME BARBIER */}
                            {service.description && (
                              <div className="mt-1">
                                <p className="text-sm text-gray-500">{service.description}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {service.duration}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-xl text-gray-900">{service.price}€</p>
                          </div>
                        </div>
                        <button 
                          className="avyento-button-secondary w-full"
                          onClick={() => handleBooking(service.id)}
                        >
                          Réserver
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

        {/* Onglet Équipe - EXACTEMENT COMME BARBIER GENTLEMAN MARAIS */}
        {activeTab === 'equipe' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Notre Équipe</h2>
              <p className="text-gray-600">Rencontrez nos experts passionnés</p>
            </div>
            
            {staff.map((member) => (
              <div key={member.id} className="avyento-card">
                <div className="flex items-start gap-4">
                  {member.avatar && (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{member.rating}</span>
                        <span className="text-xs text-gray-500">({member.reviewsCount} avis)</span>
                      </div>
                    </div>
                    
                    <p className="text-violet-600 font-medium mb-3">{member.role}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-violet-100 text-violet-800 text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Galerie */}
        {activeTab === 'galerie' && (
          <div>
            <SalonGalleryTemplate salonId={salonData.id} />
          </div>
        )}

        {/* Onglet Infos - EXACTEMENT COMME BARBIER GENTLEMAN MARAIS */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="avyento-card">
              <h3 className="avyento-subtitle text-gray-900 mb-4">À propos</h3>
              <p className="text-gray-700 mb-6">{salonData.description || salonData.longDescription || 'Découvrez notre salon de beauté et nos services personnalisés.'}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{salonData.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{salonData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>Mar-Sam: 9h-19h • Lun: Fermé • Dim: 10h-17h</span>
                </div>
              </div>
            </div>

            <div className="avyento-card">
              <h3 className="avyento-subtitle text-gray-900 mb-4">Spécialités & Expertise</h3>
              <div className="space-y-3">
                {(salonData.certifications || salonData.specialties || []).map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
              
              {(salonData.awards || []).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Distinctions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(salonData.awards || []).map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                        {award}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Avis - EXACTEMENT COMME BARBIER GENTLEMAN MARAIS */}
        {activeTab === 'avis' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {salonData.rating || 4.8}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {salonData.reviewsCount || 0} avis clients
              </p>
            </div>
            
            {/* Avis par service */}
            {displayServiceCategories.map((category) => {
              const servicesWithReviews = category.services.filter(service => 
                service.rating && service.reviewCount && service.reviewCount > 0
              );
              
              if (servicesWithReviews.length === 0) return null;
              
              return (
                <div key={category.id} className="space-y-4">
                  <h3 className="avyento-subtitle text-gray-900">{category.name}</h3>
                  
                  {servicesWithReviews.map((service) => (
                    <div key={service.id} id={`avis-service-${service.id}`} className="avyento-card p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        {service.name}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                          <span className="text-xs text-gray-500">({service.reviewCount} avis)</span>
                        </div>
                      </h4>
                      
                      {/* Avis client exemple */}
                      <div className="space-y-4">
                        <div className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-violet-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">Marc L.</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">Service impeccable, très professionnel !</p>
                              <span className="text-xs text-gray-400">Il y a 2 jours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
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