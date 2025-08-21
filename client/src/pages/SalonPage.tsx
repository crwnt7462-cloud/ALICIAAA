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

import { Button } from '@/components/ui/button';

export default function SalonPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

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
          name: (userSalon as any)?.name || "Mon Salon",
          verified: true,
          rating: (userSalon as any)?.rating || 4.8,
          reviewCount: (userSalon as any)?.reviewCount || 0,
          priceRange: "€€€",
          address: (userSalon as any)?.address || "Paris, France",
          backgroundImage: (userSalon as any)?.coverImageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
          primaryColor: (userSalon as any)?.customColors?.primary || '#8b5cf6'
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
        primaryColor: '#8b5cf6',
        description: "Salon Avyento vous accueille dans un cadre moderne et chaleureux au cœur de Paris. Notre équipe de professionnels passionnés vous propose des services de coiffure et de beauté de haute qualité, en utilisant les dernières techniques et produits premium.",
        instagram: "https://instagram.com/salon.avyento",
        facebook: "https://facebook.com/salon.avyento",
        tiktok: "https://tiktok.com/@salon.avyento"
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
      if (isAuthenticated && (userSalon as any)?.serviceCategories?.length > 0) {
        return (userSalon as any).serviceCategories.map((category: any) => ({
          id: category.name?.toLowerCase().replace(/\s+/g, '-') || 'services',
          name: category.name || 'Services',
          description: category.description || 'Nos services professionnels',
          services: category.services?.map((service: any) => ({
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

  // Avis avec réponses du salon
  const reviews = [
    {
      id: 1,
      name: 'Marie L.',
      rating: 5,
      date: 'Il y a 2 jours',
      comment: 'Service exceptionnel ! Sarah a réalisé exactement la coupe que je souhaitais.',
      service: 'Coupe + Brushing',
      verified: true,
      photos: ['https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80'],
      salonResponse: {
        date: 'Il y a 1 jour',
        message: 'Merci Marie pour votre confiance ! Sarah sera ravie de lire votre commentaire. À très bientôt ! 😊'
      }
    },
    {
      id: 2,
      name: 'Sophie M.',
      rating: 4,
      date: 'Il y a 1 semaine',
      comment: 'Très bon salon, accueil chaleureux et résultat parfait. Je recommande !',
      service: 'Soin visage',
      verified: true,
      salonResponse: {
        date: 'Il y a 6 jours',
        message: 'Merci Sophie ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous. 💜'
      }
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
      {/* Barre de navigation Avyento */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Avyento */}
            <div className="flex-shrink-0">
              <img 
                src="/avyento-logo.png" 
                alt="Avyento"
                className="w-auto cursor-pointer"
                style={{ height: '115px' }}
                onClick={() => navigate('/')}
              />
            </div>
            
            {/* Bouton Connexion */}
            <div>
              <button 
                className="bg-purple-600/20 backdrop-blur-md text-purple-900 border border-purple-300/50 px-6 py-2 rounded-full font-medium text-sm hover:bg-purple-600/30 transition-all duration-300 shadow-lg"
                onClick={() => navigate('/client-register')}
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Header salon moderne inspiration skincare avec image */}
      <div className="relative overflow-hidden h-[50vh] min-h-[400px] sm:h-[60vh] lg:h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${salonData.backgroundImage || '/salon-skincare-cover.png'})`,
            backgroundPosition: 'center center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        </div>
        
        {/* Contenu superposé au style skincare */}
        <div className="relative h-full flex flex-col justify-end items-start px-4 sm:px-6 md:px-12 lg:px-16 pb-6 sm:pb-8">
          <div className="max-w-md sm:max-w-lg space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {salonData.name}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base font-light">
                {salonData.address}
              </p>
            </div>
            
            {/* Boutons glassmorphism violets */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              
              {/* Réseaux sociaux - seulement si les liens existent */}
              {salonData.instagram && (
                <a 
                  href={salonData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
              {salonData.facebook && (
                <a 
                  href={salonData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </a>
              )}
              {salonData.tiktok && (
                <a 
                  href={salonData.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 font-bold">♪</span>
                  <span className="hidden sm:inline">TikTok</span>
                </a>
              )}
            </div>
            
            {/* Info badges */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-white">{salonData.rating}</span>
                <span className="text-xs text-white/80">({salonData.reviewCount})</span>
              </div>
              {salonData.verified && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-green-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-400/30">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-xs font-medium text-green-200">Vérifié</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets modernisée */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-16 z-10">
        <div className="flex justify-center overflow-x-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-2 sm:space-x-6 lg:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm font-medium border-b-2 transition-all duration-200 ${
                  tab.active
                    ? 'text-gray-900 hover:text-gray-900'
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

      {/* Contenu des onglets - plus compact et moderne */}
      <div className="max-w-full lg:max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {serviceCategories.map((category: any) => (
              <div 
                key={category.id}
                className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="w-full flex items-center justify-between text-left group hover:bg-gray-50/50 rounded-xl p-3 -m-3 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 group-hover:bg-gray-200/80 transition-all duration-200">
                        {expandedCategory === category.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {expandedCategory === category.id && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent"></div>
                    {category.services.map((service: any, index: any) => (
                      <div 
                        key={index} 
                        className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/40 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex">
                          {/* Image plus grande et moderne */}
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <img
                              src={service.photo}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                              {formatDuration(service.duration)}
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">{service.name}</h4>
                                <div className="text-right">
                                  <span className="font-bold text-purple-600 text-xl">{service.price}€</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">{service.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {service.rating && (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium text-gray-700">{service.rating}</span>
                                    <span className="text-xs text-gray-500">({service.reviews})</span>
                                  </div>
                                )}
                              </div>
                              
                              <Button 
                                size="sm" 
                                className="rounded-full px-4 py-2 text-xs font-medium"
                                style={getButtonStyle()}
                                onClick={() => {
                                  localStorage.setItem('selectedService', JSON.stringify({
                                    name: service.name,
                                    price: service.price,
                                    duration: service.duration,
                                    description: service.description
                                  }));
                                  navigate('/professional-selection');
                                }}
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
            
            {/* Carte de localisation */}
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden mt-6">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Notre localisation
                </h3>
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{salonData.address}</p>
                    <p className="text-xs text-gray-500 mt-1">Carte interactive disponible prochainement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'galerie' && (
          <div className="space-y-4">
            {/* Galeries de photos */}
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">Nos galeries photos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Galerie Coiffure */}
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/40 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-32">
                    <img
                      src="https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=400&h=300&fit=crop&q=80"
                      alt="Galerie Coiffure"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      12 photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Coiffure & Styling</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">Découvrez nos dernières créations en coiffure, coupes tendances et colorations.</p>
                  </div>
                </div>

                {/* Galerie Soins */}
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/40 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-32">
                    <img
                      src="https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=400&h=300&fit=crop&q=80"
                      alt="Galerie Soins"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      8 photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Soins & Bien-être</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">Moments de détente et soins personnalisés pour sublimer votre beauté naturelle.</p>
                  </div>
                </div>

                {/* Galerie Salon */}
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/40 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-32">
                    <img
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80"
                      alt="Galerie Salon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=400&h=300&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      15 photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Atmosphère du Salon</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">Plongez dans l'univers raffiné et moderne de notre institut de beauté.</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200/50"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.experience}</p>
                      </div>
                      {member.availableToday && (
                        <div className="bg-green-100/80 backdrop-blur-sm text-green-700 text-xs px-3 py-1.5 rounded-full border border-green-200/50 flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Disponible
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {member.specialties.map((specialty, idx) => (
                        <span 
                          key={idx} 
                          className="bg-purple-100/80 backdrop-blur-sm text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200/50"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{member.rating}</span>
                        <span className="text-xs text-gray-500">({member.reviewsCount})</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="rounded-full px-4 py-2 text-xs font-medium"
                        style={getButtonStyle()}
                        onClick={() => {
                          localStorage.setItem('selectedProfessional', member.id.toString());
                          navigate('/service-selection');
                        }}
                      >
                        Réserver avec {member.name.split(' ')[0]}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}



        {activeTab === 'infos' && (
          <div className="space-y-4">
            {/* Description du salon - optionnelle */}
            {salonData.description && (
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">À propos de nous</h3>
                <p className="text-gray-700 leading-relaxed">{salonData.description}</p>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">Informations pratiques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/30">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/30">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Lun-Ven: 9h-19h, Sam: 9h-17h</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/30">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">{salonData.address}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {salonData.facebook && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/30">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">@salon-avyento</span>
                    </div>
                  )}
                  {salonData.instagram && (
                    <div className="flex items-center gap-3 p-3 bg-pink-50/80 backdrop-blur-sm rounded-xl border border-pink-200/30">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <span className="text-sm font-medium">@salon.avyento</span>
                    </div>
                  )}
                </div>
              </div>
              

            </div>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center border border-gray-200/50">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{review.name}</span>
                        <div className="flex gap-0.5">
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
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>
                    {review.service && (
                      <div className="bg-purple-100/80 backdrop-blur-sm text-purple-800 text-xs px-3 py-1 rounded-full inline-block border border-purple-200/50 mb-3">
                        {review.service}
                      </div>
                    )}
                    
                    {/* Réponse du salon */}
                    {review.salonResponse && (
                      <div className="mt-3 ml-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">S</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900">{salonData.name}</span>
                          <span className="text-xs text-gray-500">{review.salonResponse.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.salonResponse.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer complet identique à ClientRegister.tsx */}
      <footer className="bg-gray-900 text-white py-8 w-full mt-12">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La solution intelligente qui anticipe, planifie et maximise vos résultats.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="cursor-pointer hover:text-white transition-colors">Coiffure</div>
                <div className="cursor-pointer hover:text-white transition-colors">Esthétique</div>
                <div className="cursor-pointer hover:text-white transition-colors">Manucure</div>
                <div className="cursor-pointer hover:text-white transition-colors">Massage</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partenaires</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="cursor-pointer hover:text-white transition-colors">Devenir partenaire</div>
                <div className="cursor-pointer hover:text-white transition-colors">Tarifs professionnels</div>
                <div className="cursor-pointer hover:text-white transition-colors">Formation & Support</div>
                <div className="cursor-pointer hover:text-white transition-colors">Témoignages</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="cursor-pointer hover:text-white transition-colors">Centre d'aide</div>
                <div className="cursor-pointer hover:text-white transition-colors">Contact</div>
                <div className="cursor-pointer hover:text-white transition-colors">CGU</div>
                <div className="cursor-pointer hover:text-white transition-colors">Confidentialité</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-3">
                <a href="https://twitter.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://tiktok.com/@useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <span className="w-4 h-4 font-bold text-current">♪</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© 2024 Avyento. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}