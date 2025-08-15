import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Heart, 
  Share2,
  Calendar,
  Users,
  Award,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalonGalleryTemplate } from '@/components/SalonGalleryTemplate';
import type { UploadResult } from '@uppy/core';

interface SalonService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Grouper les services par catégorie
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, SalonService[]>);

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
      {/* Header avec image de couverture */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        {salonData.coverImageUrl ? (
          <img
            src={salonData.coverImageUrl}
            alt={salonData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-violet-600 to-purple-600"></div>
        )}
        
        {/* Overlay et contenu */}
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex items-end justify-between w-full">
              <div className="flex items-end gap-6">
                {/* Logo salon */}
                {salonData.logo && (
                  <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-lg">
                    <img
                      src={salonData.logo}
                      alt={`${salonData.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Infos principales */}
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{salonData.name}</h1>
                  <p className="text-lg mb-3 opacity-90">{salonData.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{salonData.rating}</span>
                      <span className="opacity-75">({salonData.reviewsCount} avis)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="opacity-75">{salonData.address}</span>
                    </div>
                    
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {salonData.priceRange}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="text-white hover:bg-white/20"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/20"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => handleBooking()}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 avyento-card border-0 mt-6">
            <TabsTrigger value="overview" className="avyento-glass-effect">
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="services" className="avyento-glass-effect">
              Services
            </TabsTrigger>
            <TabsTrigger value="team" className="avyento-glass-effect">
              Équipe
            </TabsTrigger>
            <TabsTrigger value="gallery" className="avyento-glass-effect">
              <Camera className="h-4 w-4 mr-1" />
              Galerie
            </TabsTrigger>
            <TabsTrigger value="reviews" className="avyento-glass-effect">
              Avis
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <div className="mt-6 mb-12">
            {/* Onglet Aperçu */}
            <TabsContent value="overview" className="space-y-8">
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
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-violet-600" />
                      <div>
                        <p className="font-medium">Horaires d'ouverture</p>
                        <div className="text-sm text-gray-600 mt-1">
                          {Object.entries(salonData.openingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day} :</span>
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

                {/* Équipements */}
                <div className="avyento-card">
                  <h3 className="text-xl font-semibold mb-4">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {salonData.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-violet-700 border-violet-300">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="avyento-card text-center">
                  <div className="text-2xl font-bold text-violet-600 mb-1">{services.length}</div>
                  <div className="text-sm text-gray-600">Services</div>
                </div>
                <div className="avyento-card text-center">
                  <div className="text-2xl font-bold text-violet-600 mb-1">{staff.length}</div>
                  <div className="text-sm text-gray-600">Professionnels</div>
                </div>
                <div className="avyento-card text-center">
                  <div className="text-2xl font-bold text-violet-600 mb-1">{salonData.rating}</div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
                <div className="avyento-card text-center">
                  <div className="text-2xl font-bold text-violet-600 mb-1">{averageServicePrice}€</div>
                  <div className="text-sm text-gray-600">Prix moyen</div>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Services */}
            <TabsContent value="services" className="space-y-6">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category} className="avyento-card">
                  <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                  <div className="grid gap-4">
                    {categoryServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className="text-violet-600 font-semibold">{service.price}€</span>
                            <span className="text-gray-500">• {service.duration} min</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleBooking(service.id)}
                          size="sm"
                          className="ml-4"
                        >
                          Réserver
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Onglet Équipe */}
            <TabsContent value="team" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                  <div key={member.id} className="avyento-card text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                    <p className="text-violet-600 text-sm mb-2">{member.role}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{member.rating}</span>
                      <span className="text-xs text-gray-500">({member.reviewsCount})</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Galerie */}
            <TabsContent value="gallery">
              <SalonGalleryTemplate 
                salonId={salonData.id}
                salonSlug={salonData.slug}
                isOwner={isOwner}
              />
            </TabsContent>

            {/* Onglet Avis */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="avyento-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Avis clients</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= salonData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {salonData.rating} sur 5 ({salonData.reviewsCount} avis)
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    <Award className="h-3 w-3 mr-1" />
                    Avis vérifiés
                  </Badge>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.clientName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Vérifié
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>{review.service}</div>
                          <div>{review.date}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      {/* Réponse du propriétaire */}
                      {review.ownerResponse && (
                        <div className="bg-violet-50 border-l-4 border-violet-500 p-4 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-violet-700 border-violet-300">
                              Propriétaire
                            </Badge>
                            <span className="text-xs text-gray-500">{review.ownerResponse.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{review.ownerResponse.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}