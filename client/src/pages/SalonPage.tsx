import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Heart, 
  Share2, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  ShieldCheck 
} from "lucide-react";

interface SalonData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  coverImageUrl: string;
  logoUrl: string;
  photos: string[];
  verified: boolean;
  certifications: string[];
  awards: string[];
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    priceColor: string;
    neonFrame: string;
  };
  serviceCategories: Array<{
    id: number;
    name: string;
    expanded: boolean;
    services: Array<{
      id: number;
      name: string;
      price: number;
      duration: string;
      description?: string;
    }>;
  }>;
  staff: Array<{
    id: number;
    name: string;
    role: string;
    specialties: string[];
    rating: number;
    reviewsCount: number;
    avatar: string;
  }>;
  reviews: Array<{
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
  }>;
}

export default function SalonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Données du salon (identiques à SalonPageEditor mais en affichage public)
  const salonData: SalonData = {
    id: 'agashou-salon',
    name: 'Agashou - Salon de Beauté',
    description: 'Salon de beauté moderne et professionnel spécialisé dans les coupes tendances',
    longDescription: `Notre salon Agashou vous accueille dans un cadre moderne et chaleureux. Spécialisés dans les coupes tendances et les soins personnalisés, notre équipe d'experts est formée aux dernières techniques et utilise exclusivement des produits de qualité professionnelle.

Situé au cœur de Paris, nous proposons une gamme complète de services pour sublimer votre beauté naturelle. De la coupe classique aux colorations les plus audacieuses, en passant par nos soins anti-âge révolutionnaires, chaque prestation est réalisée avec la plus grande attention.`,
    address: '15 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 25 76 89',
    rating: 4.8,
    reviews: 247,
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
    logoUrl: '',
    photos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop'
    ],
    verified: true,
    certifications: [
      'Salon labellisé L\'Oréal Professionnel',
      'Formation continue Kérastase',
      'Certification bio Shu Uemura'
    ],
    awards: [
      'Élu Meilleur Salon Paris 8ème 2023',
      'Prix de l\'Innovation Beauté 2022',
      'Certification Éco-responsable'
    ],
    customColors: {
      primary: '#06b6d4', // cyan
      accent: '#ec4899',  // pink
      buttonText: '#ffffff',
      priceColor: '#ec4899', // pink pour les prix
      neonFrame: '#ef4444' // rouge néon
    },
    serviceCategories: [
      {
        id: 1,
        name: 'Cheveux',
        expanded: true,
        services: [
          { id: 1, name: 'Coupe & Brushing', price: 45, duration: '1h', description: 'Coupe personnalisée et brushing professionnel' },
          { id: 2, name: 'Coloration', price: 80, duration: '2h', description: 'Coloration complète avec soins' },
          { id: 3, name: 'Mèches', price: 65, duration: '1h30', description: 'Mèches tendance toutes techniques' },
          { id: 4, name: 'Soin Capillaire', price: 35, duration: '45min', description: 'Soin reconstructeur en profondeur' }
        ]
      },
      {
        id: 2,
        name: 'Visage',
        expanded: false,
        services: [
          { id: 5, name: 'Soin Visage Classique', price: 55, duration: '1h', description: 'Nettoyage, gommage, masque' },
          { id: 6, name: 'Soin Anti-âge Premium', price: 85, duration: '1h30', description: 'Soin advanced avec LED thérapie' },
          { id: 7, name: 'Épilation Sourcils', price: 20, duration: '30min', description: 'Épilation et restructuration' }
        ]
      },
      {
        id: 3,
        name: 'Corps',
        expanded: false,
        services: [
          { id: 8, name: 'Massage Relaxant', price: 70, duration: '1h', description: 'Massage complet détente' },
          { id: 9, name: 'Gommage Corps', price: 45, duration: '45min', description: 'Exfoliation et hydratation' }
        ]
      }
    ],
    staff: [
      {
        id: 1,
        name: 'Sophie Martin',
        role: 'Styliste Senior',
        specialties: ['Colorations', 'Coupes tendances', 'Soins'],
        rating: 4.9,
        reviewsCount: 89,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b811b147?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Amélie Dubois',
        role: 'Esthéticienne',
        specialties: ['Soins visage', 'Anti-âge', 'Épilation'],
        rating: 4.8,
        reviewsCount: 67,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ],
    reviews: [
      {
        id: 1,
        clientName: 'Marie L.',
        rating: 5,
        comment: 'Excellent salon ! Sophie a fait des merveilles avec mes cheveux. Je recommande vivement !',
        date: '2024-01-15',
        service: 'Coupe & Coloration',
        verified: true,
        ownerResponse: {
          message: 'Merci beaucoup Marie ! C\'était un plaisir de vous recevoir. À bientôt ! 💫',
          date: '2024-01-16'
        }
      },
      {
        id: 2,
        clientName: 'Julie R.',
        rating: 5,
        comment: 'Service impeccable, équipe très professionnelle. Le soin visage était parfait !',
        date: '2024-01-10',
        service: 'Soin Visage Premium',
        verified: true
      },
      {
        id: 3,
        clientName: 'Laura M.',
        rating: 4,
        comment: 'Très satisfaite de ma coupe ! Salon moderne et accueillant.',
        date: '2024-01-08',
        service: 'Coupe & Brushing',
        verified: true
      }
    ]
  };

  const toggleCategory = (categoryId: number) => {
    // Dans une vraie application, ceci mettrait à jour l'état
    console.log('Toggle category:', categoryId);
  };

  const handleBooking = () => {
    setLocation('/avyento-booking');
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isLiked ? 
        `${salonData.name} retiré de vos favoris` : 
        `${salonData.name} ajouté à vos favoris`
    });
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
      toast({
        title: "Lien copié !",
        description: "Le lien du salon a été copié dans votre presse-papiers"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header fixe */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-button border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="glass-button text-black rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <span className="font-semibold text-black truncate mx-4">
            {salonData.name}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`glass-button text-black rounded-xl ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="glass-button text-black rounded-xl"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Photo de couverture */}
      <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-pink-100 mt-16">
        {salonData.coverImageUrl ? (
          <img 
            src={salonData.coverImageUrl} 
            alt="Photo de couverture" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-xl font-bold">{salonData.name}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Informations du salon */}
      <div className="p-4 space-y-4">
        {/* Nom et notation */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{salonData.name}</h1>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-yellow-600 font-medium">{salonData.rating}</span>
            <span className="text-gray-500">({salonData.reviews} avis)</span>
            {salonData.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm">{salonData.description}</p>

        {/* Adresse et téléphone */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{salonData.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{salonData.phone}</span>
          </div>
        </div>

        {/* Bouton de réservation principal */}
        <Button 
          onClick={handleBooking}
          className="w-full glass-button text-white rounded-xl py-3 font-medium"
          style={{ backgroundColor: salonData.customColors?.primary }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Prendre rendez-vous
        </Button>
      </div>

      {/* Navigation par onglets */}
      <div className="sticky top-16 z-40 glass-button border-b border-white/20">
        <div className="flex overflow-x-auto">
          {['services', 'personnel', 'avis', 'infos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'services' && 'Services'}
              {tab === 'personnel' && 'Personnel'}
              {tab === 'avis' && 'Avis'}
              {tab === 'infos' && 'Infos'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {salonData.serviceCategories.map((category) => (
              <Card 
                key={category.id} 
                className="glass-card shadow-sm"
                style={{
                  border: `2px solid ${salonData.customColors?.neonFrame || '#ef4444'}`,
                  boxShadow: `0 0 12px ${salonData.customColors?.neonFrame || '#ef4444'}30`
                }}
              >
                <CardContent className="p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span className="text-gray-500">
                      {category.expanded ? '−' : '+'}
                    </span>
                  </div>
                  
                  {category.expanded && (
                    <div className="mt-3 space-y-3">
                      {category.services.map((service) => (
                        <div key={service.id} className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              {service.description && (
                                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{service.duration}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div 
                                className="text-lg font-bold price-preview"
                                style={{ color: salonData.customColors?.priceColor || '#ec4899' }}
                              >
                                {service.price}€
                              </div>
                              <Button 
                                size="sm" 
                                onClick={handleBooking}
                                className="glass-button text-white mt-2 reservation-preview-btn"
                                style={{ 
                                  backgroundColor: salonData.customColors?.primary,
                                  color: salonData.customColors?.buttonText 
                                }}
                              >
                                Choisir
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

        {activeTab === 'personnel' && (
          <div className="space-y-4">
            {salonData.staff.map((member) => (
              <Card key={member.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600 text-sm">{member.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-yellow-600 text-xs font-medium">{member.rating}</span>
                        <span className="text-gray-500 text-xs">({member.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Spécialités :</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
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

        {activeTab === 'avis' && (
          <div className="space-y-4">
            {salonData.reviews.map((review) => (
              <Card key={review.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                        {review.verified && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                  
                  <Badge variant="outline" className="text-xs">
                    {review.service}
                  </Badge>

                  {review.ownerResponse && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-800">Réponse du propriétaire</span>
                        <span className="text-xs text-blue-600">{review.ownerResponse.date}</span>
                      </div>
                      <p className="text-blue-700 text-sm">{review.ownerResponse.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">À propos</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {salonData.longDescription}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Prix & Distinctions
                </h3>
                <div className="space-y-2">
                  {salonData.awards.map((award, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{award}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {salonData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bouton de réservation fixe en bas */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <Button 
          onClick={handleBooking}
          className="w-full glass-button text-white rounded-2xl py-4 font-semibold text-lg shadow-xl"
          style={{ backgroundColor: salonData.customColors?.primary }}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Réserver maintenant
        </Button>
      </div>

      {/* Espace pour le bouton fixe */}
      <div className="h-20"></div>
    </div>
  );
}