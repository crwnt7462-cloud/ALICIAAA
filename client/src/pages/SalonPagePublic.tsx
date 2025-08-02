import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  Award,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getSalonGlassCard } from '@/lib/salonColors';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description?: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  expanded: boolean;
  services: Service[];
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  price: number;
  bio: string;
  experience: string;
}

interface SalonData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  coverImageUrl?: string;
  logoUrl?: string;
  photos: string[];
  serviceCategories: ServiceCategory[];
  professionals: Professional[];
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
}

export default function SalonPagePublic() {
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
          { id: 3, name: 'Mèches', price: 120, duration: '2h30', description: 'Mèches naturelles ou colorées' },
          { id: 4, name: 'Coupe Enfant', price: 25, duration: '30min', description: 'Coupe adaptée aux enfants -12 ans' }
        ]
      },
      {
        id: 2,
        name: 'Barbe',
        expanded: false,
        services: [
          { id: 5, name: 'Taille de barbe', price: 35, duration: '45min', description: 'Taille et stylisation de barbe' },
          { id: 6, name: 'Rasage traditionnel', price: 40, duration: '1h', description: 'Rasage au rasoir avec soins' }
        ]
      },
      {
        id: 3,
        name: 'Rasage',
        expanded: false,
        services: [
          { id: 7, name: 'Rasage classique', price: 30, duration: '30min', description: 'Rasage traditionnel complet' },
          { id: 8, name: 'Rasage de luxe', price: 50, duration: '45min', description: 'Rasage avec soins premium' }
        ]
      }
    ],
    professionals: [
      {
        id: '1',
        name: 'Sarah Martinez',
        specialty: 'Coiffure & Coloration',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        price: 65,
        bio: 'Expert en coiffure moderne et coloration naturelle',
        experience: '8 ans d\'expérience'
      },
      {
        id: '2', 
        name: 'Marie Dubois',
        specialty: 'Soins Esthétiques',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        price: 80,
        bio: 'Spécialiste en soins anti-âge et bien-être',
        experience: '10 ans d\'expérience'
      }
    ]
  };

  const handleBooking = () => {
    toast({
      title: "Redirection vers réservation",
      description: "Vous allez être redirigé vers la page de réservation",
    });
    // setLocation('/salon-booking');
  };

  const handleShare = () => {
    toast({
      title: "Lien copié !",
      description: "Le lien du salon a été copié dans votre presse-papier",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isLiked ? "Salon retiré de vos favoris" : "Salon ajouté à vos favoris",
    });
  };

  const toggleCategory = (categoryId: number) => {
    // Pour l'affichage public, on peut permettre d'expand/collapse
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/30 to-purple-100/20 backdrop-blur-sm">
      <div className="max-w-lg mx-auto glass-card shadow-lg">
        {/* Header avec navigation */}
        <div className="sticky top-0 z-50 glass-button border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="glass-button text-black rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`glass-button rounded-xl ${isLiked ? 'text-red-500' : 'text-black'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
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
        <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-pink-100">
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
            className="w-full glass-button text-black rounded-xl py-3 font-medium"
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
                                  className="glass-button text-black mt-2 reservation-preview-btn"
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
              <h3 className="font-semibold text-gray-900 mb-4">👩‍💼 Notre équipe</h3>
              
              {salonData.professionals.map((professional) => (
                <Card key={professional.id} className="glass-card shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={professional.avatar}
                        alt={professional.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{professional.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-yellow-600 font-medium">{professional.rating}</span>
                          </div>
                        </div>
                        <p className="text-violet-600 text-sm font-medium">{professional.specialty}</p>
                        <p className="text-gray-600 text-sm mt-1">{professional.bio}</p>
                        <p className="text-gray-500 text-xs mt-1">{professional.experience}</p>
                        
                        <Button 
                          size="sm" 
                          onClick={handleBooking}
                          className="glass-button text-black mt-3"
                          style={{ backgroundColor: salonData.customColors?.primary }}
                        >
                          <User className="w-3 h-3 mr-1" />
                          Réserver avec {professional.name}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Note moyenne</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">{salonData.rating}</div>
                <p className="text-gray-500">Basé sur {salonData.reviews} avis clients</p>
              </div>
              
              {/* Simulation d'avis */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">• il y a 2 jours</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "Excellente expérience ! Sarah est très professionnelle et a su exactement ce que je voulais. Le salon est moderne et très propre."
                  </p>
                  <p className="text-gray-500 text-xs mt-2">- Marie L.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'infos' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📍 Localisation</h3>
                <p className="text-gray-600 text-sm">{salonData.address}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🏆 Certifications</h3>
                <div className="space-y-2">
                  {salonData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🎖️ Récompenses</h3>
                <div className="space-y-2">
                  {salonData.awards.map((award, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {award}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de réservation flottant */}
        <div className="sticky bottom-0 p-4 glass-button border-t border-white/20">
          <Button 
            onClick={handleBooking}
            className="w-full py-3 font-medium glass-button text-black rounded-xl"
            style={{ backgroundColor: salonData.customColors?.primary }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}