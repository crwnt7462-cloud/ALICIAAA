import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
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
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Charger les données du salon du professionnel connecté si on est sur /salon
  const { data: userSalon } = useQuery({
    queryKey: ['/api/salon/my-salon'],
    enabled: location === '/salon' && isAuthenticated,
    retry: false,
    staleTime: 5000
  });

  // Déterminer quel salon afficher selon l'URL
  const getSalonData = () => {
    if (location === '/salon') {
      // Si utilisateur connecté et a un salon, utiliser ses données
      if (isAuthenticated && userSalon) {
        return {
          name: userSalon.name || "Mon Salon",
          verified: true,
          rating: userSalon.rating || 4.8,
          reviewCount: userSalon.reviewCount || 0,
          priceRange: "€€€",
          address: userSalon.address || "Paris, France",
          backgroundImage: userSalon.coverImageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
          primaryColor: userSalon.customColors?.primary || '#8b5cf6'
        };
      }
      
      // Fallback : template de base pour visiteurs non connectés
      return {
        name: "Salon Avyento",
        verified: true,
        rating: 4.8,
        reviewCount: 127,
        priceRange: "€€€",
        address: "75001 Paris, France",
        backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
        primaryColor: '#8b5cf6'
      };
    } else if (location === '/salon-excellence-paris' || location.includes('excellence-paris')) {
      return {
        name: "Salon Excellence Paris",
        verified: true,
        rating: 4.8,
        reviewCount: 203,
        priceRange: "€€€",
        address: "15 Rue de la Paix, 75002 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
        primaryColor: '#7c3aed'
      };
    } else if (location === '/barbier-gentleman-marais' || location.includes('barbier-gentleman')) {
      return {
        name: "Barbier Gentleman Marais",
        verified: true,
        rating: 4.7,
        reviewCount: 156,
        priceRange: "€€",
        address: "42 Rue des Rosiers, 75004 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=800&fit=crop&q=80",
        primaryColor: '#059669'
      };
    } else if (location === '/salon-moderne-republique' || location.includes('moderne-republique')) {
      return {
        name: "Salon Moderne République",
        verified: true,
        rating: 4.6,
        reviewCount: 189,
        priceRange: "€€€",
        address: "25 Avenue de la République, 75003 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=800&fit=crop&q=80",
        primaryColor: '#d97706'
      };
    } else if (location === '/institut-beaute-saint-germain' || location.includes('institut-beaute')) {
      return {
        name: "Institut Beauté Saint-Germain",
        verified: true,
        rating: 4.9,
        reviewCount: 134,
        priceRange: "€€€€",
        address: "8 Boulevard Saint-Germain, 75005 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=500&h=800&fit=crop&q=80",
        primaryColor: '#ec4899'
      };
    } else if (location === '/beauty-lounge-montparnasse' || location.includes('beauty-lounge')) {
      return {
        name: "Beauty Lounge Montparnasse",
        verified: true,
        rating: 4.5,
        reviewCount: 98,
        priceRange: "€€",
        address: "14 Boulevard du Montparnasse, 75006 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=800&fit=crop&q=80",
        primaryColor: '#8b5cf6'
      };
    } else if (location === '/beauty-lash-studio' || location.includes('beauty-lash')) {
      return {
        name: "Beauty Lash Studio",
        verified: true,
        rating: 4.8,
        reviewCount: 76,
        priceRange: "€€",
        address: "9 Rue de la Pompe, 75016 Paris",
        backgroundImage: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=800&fit=crop&q=80",
        primaryColor: '#f59e0b'
      };
    }
    
    // Défaut pour tout autre salon dynamique
    return {
      name: "Salon Avyento",
      verified: true,
      rating: 4.8,
      reviewCount: 127,
      priceRange: "€€€",
      address: "75001 Paris, France",
      backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
      primaryColor: '#8b5cf6'
    };
  };

  const salonData = getSalonData();
  const primaryColor = salonData.primaryColor;

  // Onglets de navigation
  const tabs = [
    { id: 'services', label: 'Services', active: activeTab === 'services' },
    { id: 'equipe', label: 'Équipe', active: activeTab === 'equipe' },
    { id: 'galerie', label: 'Galerie', active: activeTab === 'galerie' },
    { id: 'infos', label: 'Infos', active: activeTab === 'infos' },
    { id: 'avis', label: 'Avis', active: activeTab === 'avis' }
  ];

  // Services spécifiques selon le salon
  const getServiceCategories = () => {
    if (location === '/salon') {
      // Si utilisateur connecté avec des services, utiliser ses données
      if (isAuthenticated && userSalon?.serviceCategories?.length > 0) {
        return userSalon.serviceCategories.map(category => ({
          id: category.name?.toLowerCase().replace(/\s+/g, '-') || 'services',
          name: category.name || 'Services',
          description: category.description || 'Nos services professionnels',
          services: category.services?.map(service => ({
            name: service.name || 'Service',
            price: service.price || 50,
            duration: service.duration || '60 min',
            description: service.description || 'Service professionnel',
            photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
            rating: 4.8,
            reviews: Math.floor(Math.random() * 50) + 10
          })) || []
        }));
      }

      // Services par défaut pour template ou utilisateur sans services configurés
      return [
        {
          id: 'coiffure',
          name: 'Coiffure',
          description: 'Coupes, colorations et soins capillaires',
          services: [
            {
              name: 'Coupe + Brushing',
              price: 65,
              duration: 60,
              description: 'Coupe personnalisée avec brushing professionnel',
              photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 23
            },
            {
              name: 'Coloration',
              price: 85,
              duration: 120,
              description: 'Coloration complète avec soin',
              photo: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop&q=80',
              rating: 4.9,
              reviews: 18
            },
            {
              name: 'Balayage',
              price: 120,
              duration: 180,
              description: 'Technique balayage à la main',
              photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
              rating: 4.7,
              reviews: 31
            }
          ]
        },
        {
          id: 'soins',
          name: 'Soins',
          description: 'Soins capillaires et traitements',
          services: [
            {
              name: 'Soin restructurant',
              price: 45,
              duration: 45,
              description: 'Soin profond pour cheveux abîmés',
              photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&q=80',
              rating: 4.6,
              reviews: 14
            },
            {
              name: 'Massage du cuir chevelu',
              price: 35,
              duration: 30,
              description: 'Massage relaxant et stimulant',
              photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 42
            }
          ]
        }
      ];
    } else if (location === '/salon-excellence-paris' || location.includes('excellence-paris')) {
      return [
        {
          id: 'coiffure-femme',
          name: 'Coiffure Femme',
          description: 'Services haut de gamme pour femmes',
          services: [
            {
              name: 'Coupe + Brushing',
              price: 75,
              duration: 60,
              description: 'Coupe sur-mesure avec brushing premium',
              photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 45
            },
            {
              name: 'Coloration Premium',
              price: 95,
              duration: 140,
              description: 'Coloration haut de gamme avec produits professionnels',
              photo: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop&q=80',
              rating: 4.9,
              reviews: 32
            },
            {
              name: 'Mèches',
              price: 110,
              duration: 160,
              description: 'Technique de mèches professionnelle',
              photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
              rating: 4.7,
              reviews: 28
            }
          ]
        },
        {
          id: 'coiffure-homme',
          name: 'Coiffure Homme',
          description: 'Services spécialisés pour hommes',
          services: [
            {
              name: 'Coupe Homme',
              price: 45,
              duration: 45,
              description: 'Coupe moderne et tendance',
              photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
              rating: 4.6,
              reviews: 38
            },
            {
              name: 'Barbe',
              price: 25,
              duration: 30,
              description: 'Taille et soin de barbe professionnel',
              photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
              rating: 4.7,
              reviews: 22
            }
          ]
        }
      ];
    } else if (location === '/barbier-gentleman-marais' || location.includes('barbier-gentleman')) {
      return [
        {
          id: 'barbier',
          name: 'Services Barbier',
          description: 'Art traditionnel de la barberie',
          services: [
            {
              name: 'Coupe Classique',
              price: 35,
              duration: 45,
              description: 'Coupe traditionnelle aux ciseaux',
              photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 67
            },
            {
              name: 'Rasage Traditionnel',
              price: 30,
              duration: 40,
              description: 'Rasage au rasoir avec serviette chaude',
              photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&q=80',
              rating: 4.9,
              reviews: 89
            },
            {
              name: 'Coupe + Barbe',
              price: 55,
              duration: 75,
              description: 'Service complet coupe et barbe',
              photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 45
            }
          ]
        }
      ];
    } else if (location === '/salon-moderne-republique' || location.includes('moderne-republique')) {
      return [
        {
          id: 'coiffure-moderne',
          name: 'Coiffure Moderne',
          description: 'Coupes et styles contemporains',
          services: [
            {
              name: 'Coupe Tendance',
              price: 60,
              duration: 50,
              description: 'Coupe dans l\'air du temps',
              photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
              rating: 4.7,
              reviews: 34
            },
            {
              name: 'Color Bar',
              price: 80,
              duration: 120,
              description: 'Coloration créative et moderne',
              photo: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop&q=80',
              rating: 4.6,
              reviews: 28
            }
          ]
        }
      ];
    } else if (location === '/institut-beaute-saint-germain' || location.includes('institut-beaute')) {
      return [
        {
          id: 'soins-visage',
          name: 'Soins du Visage',
          description: 'Soins esthétiques premium',
          services: [
            {
              name: 'Soin Anti-Age',
              price: 85,
              duration: 75,
              description: 'Soin premium anti-vieillissement',
              photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&q=80',
              rating: 4.9,
              reviews: 56
            },
            {
              name: 'Soin Hydratant',
              price: 65,
              duration: 60,
              description: 'Hydratation profonde de la peau',
              photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 43
            }
          ]
        },
        {
          id: 'massages',
          name: 'Massages',
          description: 'Massages relaxants et thérapeutiques',
          services: [
            {
              name: 'Massage Relaxant',
              price: 70,
              duration: 60,
              description: 'Massage détente corps entier',
              photo: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=200&h=200&fit=crop&q=80',
              rating: 4.9,
              reviews: 78
            }
          ]
        }
      ];
    } else if (location === '/beauty-lounge-montparnasse' || location.includes('beauty-lounge')) {
      return [
        {
          id: 'esthetique',
          name: 'Esthétique',
          description: 'Soins beauté et bien-être',
          services: [
            {
              name: 'Soin Visage Complet',
              price: 55,
              duration: 70,
              description: 'Soin nettoyant et hydratant',
              photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&q=80',
              rating: 4.6,
              reviews: 23
            },
            {
              name: 'Épilation',
              price: 40,
              duration: 45,
              description: 'Épilation professionnelle',
              photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
              rating: 4.5,
              reviews: 31
            }
          ]
        }
      ];
    } else if (location === '/beauty-lash-studio' || location.includes('beauty-lash')) {
      return [
        {
          id: 'cils',
          name: 'Extensions de Cils',
          description: 'Spécialiste des extensions de cils',
          services: [
            {
              name: 'Extension Cils Volume',
              price: 80,
              duration: 120,
              description: 'Pose d\'extensions volume russe',
              photo: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop&q=80',
              rating: 4.8,
              reviews: 45
            },
            {
              name: 'Rehaussement Cils',
              price: 45,
              duration: 60,
              description: 'Lift et teinture des cils naturels',
              photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop&q=80',
              rating: 4.7,
              reviews: 32
            }
          ]
        }
      ];
    }
    
    // Défaut - Services Avyento
    return [
      {
        id: 'coiffure',
        name: 'Coiffure',
        description: 'Coupes, colorations et soins capillaires',
        services: [
          {
            name: 'Coupe + Brushing',
            price: 65,
            duration: 60,
            description: 'Coupe personnalisée avec brushing professionnel',
            photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
            rating: 4.8,
            reviews: 23
          }
        ]
      }
    ];
  };

  const serviceCategories = getServiceCategories();

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
      {/* Header salon moderne avec effet glass */}
      <div className="relative overflow-hidden">
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-purple-900/20"></div>
        </div>
        
        {/* Card informations salon avec glassmorphism */}
        <div className="relative -mt-20 mx-4">
          <div className="bg-white/95 backdrop-blur-20 rounded-3xl border border-white/30 shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {salonData.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{salonData.name}</h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {salonData.address}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-yellow-50/80 backdrop-blur-8 px-3 py-1.5 rounded-full border border-yellow-200/50">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{salonData.rating}</span>
                    <span className="text-xs text-gray-600">({salonData.reviewCount} avis)</span>
                  </div>
                  {salonData.verified && (
                    <div className="flex items-center gap-1.5 bg-green-50/80 backdrop-blur-8 px-3 py-1.5 rounded-full border border-green-200/50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Vérifié</span>
                    </div>
                  )}
                  <div className="bg-slate-50/80 backdrop-blur-8 px-3 py-1.5 rounded-full border border-slate-200/50">
                    <span className="text-xs font-medium text-gray-700">{salonData.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white/80 backdrop-blur-16 border-b border-gray-200/50 mt-6">
        <div className="flex justify-center overflow-x-auto px-4 lg:px-8">
          <div className="flex space-x-8 lg:space-x-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
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
      </div>

      {/* Contenu des onglets */}
      <div className="p-4 space-y-6">
        {activeTab === 'services' && (
          <div className="space-y-3">
            {serviceCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-slate-50/90 backdrop-blur-20 border border-slate-400/30 rounded-2xl shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="w-full flex items-center justify-between text-left group hover:bg-white/40 rounded-xl p-3 -m-3 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-violet-500/20 backdrop-blur-12 px-4 py-2 rounded-full border border-violet-400/30 font-semibold text-violet-800 shadow-sm">
                        {category.services.length} service{category.services.length > 1 ? 's' : ''}
                      </span>
                      <div className="p-2 rounded-lg bg-violet-500/15 backdrop-blur-8 border border-violet-400/25 group-hover:bg-violet-500/25 transition-all duration-200 shadow-sm">
                        {expandedCategory === category.id ? (
                          <ChevronUp className="w-4 h-4 text-violet-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-violet-700" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {expandedCategory === category.id && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent"></div>
                    {category.services.map((service, index) => (
                      <div 
                        key={index} 
                        className="bg-white/60 backdrop-blur-8 rounded-xl border border-slate-300/30 p-4 hover:bg-white/80 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={service.photo}
                            alt={service.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200/50"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-base">{service.name}</h4>
                              <div className="text-right">
                                <span className="font-bold text-gray-900 text-lg">{service.price}€</span>
                                <p className="text-xs text-gray-500 font-medium">{formatDuration(service.duration)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-600 font-medium">{formatDuration(service.duration)}</span>
                                </div>
                                {service.rating && (
                                  <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-700 font-medium">{service.rating}</span>
                                    <span className="text-sm text-gray-500">({service.reviews} avis)</span>
                                  </div>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                style={getButtonStyle('outline')}
                                className="bg-white/70 backdrop-blur-8 border border-slate-300/40 hover:bg-white/90 rounded-xl font-medium shadow-sm"
                                onClick={() => navigate('/avyento-booking')}
                              >
                                Réserver
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          <p>© 2025 Avyento. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </div>
  );
}