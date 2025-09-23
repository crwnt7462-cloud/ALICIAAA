import { useState, useEffect } from 'react';
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
  
  // ✅ CORRECTION: Activer le mode édition SEULEMENT si:
  // 1. L'utilisateur est sur /salon (sa propre page) ET authentifié
  // 2. OU si l'utilisateur est le propriétaire du salon affiché (pour d'autres URLs)
  const isOwnSalonPage = location === '/salon' && isAuthenticated;
  const isSalonCreated = isAuthenticated && userSalon && (userSalon as any).name;
  
  // Fonction pour déterminer si l'utilisateur peut éditer ce salon
  const canEditSalon = () => {
    // Seul le propriétaire peut éditer sur /salon
    if (location === '/salon') {
      return isAuthenticated;
    }
    // Pour les autres pages de salon (salon public), pas d'édition autorisée
    // TODO: Implémenter vérification d'ownership via API si nécessaire
    return false;
  };
  
  const [isEditing, setIsEditing] = useState(canEditSalon() && !isSalonCreated);
  const [salonData, setSalonData] = useState({
    nom: "Salon Excellence",
    adresse: "Paris 8ème",
    telephone: "01 23 45 67 89",
    description: "Le meilleur salon de Paris !",
    horaires: "Lun-Ven: 9h-19h, Sam: 9h-17h",
    facebook: "https://facebook.com/salon.avyento",
    instagram: "https://instagram.com/salon.avyento",
    tiktok: "https://tiktok.com/@salon.avyento"
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
        backgroundImage: "/salon-skincare-cover.png",
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

  const salonDataFetched = getSalonData();
  const primaryColor = salonDataFetched.primaryColor;

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSalonData({ ...salonData, [e.target.name]: e.target.value });
  }

  // Restauration des données locales au montage
  useEffect(() => {
    const savedSalonData = localStorage.getItem('salonData');
    const savedServiceCategories = localStorage.getItem('serviceCategoriesState');
    const savedTeamMembers = localStorage.getItem('teamMembersState');
    const savedCoverImage = localStorage.getItem('coverImage');
    if (savedSalonData) setSalonData(JSON.parse(savedSalonData));
    if (savedServiceCategories) setServiceCategoriesState(JSON.parse(savedServiceCategories));
    if (savedTeamMembers) setTeamMembersState(JSON.parse(savedTeamMembers));
    if (savedCoverImage) setCoverImage(savedCoverImage);
  }, []);

  // Charger les données du salon depuis l'API au montage et après modification
  useEffect(() => {
    async function fetchSalon() {
      const res = await fetch('/api/salon/my-salon');
      if (res.ok) {
        const data = await res.json();
        setSalonData({
          nom: data.name || '',
          adresse: data.address || '',
          telephone: data.telephone || '',
          description: data.description || '',
          horaires: data.horaires || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          tiktok: data.tiktok || ''
        });
        setServiceCategoriesState(data.serviceCategories || []);
        setTeamMembersState(data.teamMembers || []);
        setCoverImage(data.coverImageUrl || '');
      }
    }
    fetchSalon();
  }, []);

  async function handleSave() {
    setIsEditing(false);
    try {
      await fetch('/api/salon/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonData,
          serviceCategories: serviceCategoriesState,
          teamMembers: teamMembersState,
          coverImage,
        })
      });
      // Recharger les données du salon après modification
      const res = await fetch('/api/salon/my-salon');
      if (res.ok) {
        const data = await res.json();
        setSalonData({
          nom: data.name || '',
          adresse: data.address || '',
          telephone: data.telephone || '',
          description: data.description || '',
          horaires: data.horaires || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          tiktok: data.tiktok || ''
        });
        setServiceCategoriesState(data.serviceCategories || []);
        setTeamMembersState(data.teamMembers || []);
        setCoverImage(data.coverImageUrl || '');
      }
      alert("Modifications enregistrées !");
    } catch (e) {
      alert("Erreur lors de l'enregistrement");
    }
  }

  // Ajout de la gestion des catégories et services modifiables
  const [serviceCategoriesState, setServiceCategoriesState] = useState(serviceCategories);

  function handleServiceChange(categoryIdx: number, serviceIdx: number, field: string, value: string) {
    const updated = [...serviceCategoriesState];
    updated[categoryIdx].services[serviceIdx][field] = value;
    setServiceCategoriesState(updated);
  }

  function handleCategoryChange(categoryIdx: number, field: string, value: string) {
    const updated = [...serviceCategoriesState];
    updated[categoryIdx][field] = value;
    setServiceCategoriesState(updated);
  }

  function handleDeleteCategory(categoryIdx: number) {
    const updated = [...serviceCategoriesState];
    updated.splice(categoryIdx, 1);
    setServiceCategoriesState(updated);
  }

  function handleAddCategory() {
    setServiceCategoriesState([
      ...serviceCategoriesState,
      {
        id: `cat-${Date.now()}`,
        name: '',
        description: '',
        services: []
      }
    ]);
  }

  function handleAddService(categoryIdx: number) {
    const updated = [...serviceCategoriesState];
    updated[categoryIdx].services.push({
      name: '',
      price: '',
      duration: '',
      description: '',
      photo: ''
    });
    setServiceCategoriesState(updated);
  }

  function handleServicePhotoUpload(categoryIdx: number, serviceIdx: number, file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...serviceCategoriesState];
      updated[categoryIdx].services[serviceIdx].photo = e.target?.result as string;
      setServiceCategoriesState(updated);
    };
    reader.readAsDataURL(file);
  }

  // Ajout de la gestion de l'équipe modifiable
  type TeamMember = {
    id: number;
    name: string;
    role: string;
    specialties: string[];
    rating: number;
    reviewsCount: number;
    avatar: string;
    availableToday: boolean;
    nextSlot: string;
    experience: string;
    bio: string;
    [key: string]: any; // index signature pour accès dynamique
  };
  const [teamMembersState, setTeamMembersState] = useState<TeamMember[]>(teamMembers);

  function handleTeamMemberChange(idx: number, field: string, value: any) {
    const updated = [...teamMembersState];
    if (field === 'specialties') {
      updated[idx].specialties = value;
    } else {
      updated[idx][field] = value;
    }
    setTeamMembersState(updated);
  }

  function handleDeleteTeamMember(idx: number) {
    const updated = [...teamMembersState];
    updated.splice(idx, 1);
    setTeamMembersState(updated);
  }

  function handleAddTeamMember() {
    setTeamMembersState([
      ...teamMembersState,
      {
        id: Date.now(),
        name: '',
        role: '',
        specialties: [],
        rating: 0,
        reviewsCount: 0,
        avatar: '',
        availableToday: false,
        nextSlot: '',
        experience: '',
        bio: ''
      }
    ]);
  }

  // Ajout de la gestion de la photo de couverture modifiable
  const [coverImage, setCoverImage] = useState(salonDataFetched.backgroundImage);
  function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCoverImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // Ajout du bouton Modifier/Enregistrer en haut à droite
  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ position: "absolute", top: 24, right: 32, zIndex: 100 }}>
        {canEditSalon() && !isEditing && (
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-purple-700 transition"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        )}
        {canEditSalon() && isEditing && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        )}
      </div>
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
          </div>
        </div>
      </div>
      {/* Header salon moderne inspiration skincare avec image */}
      <div className="relative overflow-hidden h-[50vh] min-h-[400px] sm:h-[60vh] lg:h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${coverImage || '/salon-skincare-cover.png'})`,
            backgroundPosition: 'center center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        </div>
        {isEditing && canEditSalon() && (
          <div className="absolute top-4 left-4 z-20 bg-white/80 rounded-xl p-3 shadow">
            <label className="block text-sm font-medium mb-2">Changer la photo de couverture</label>
            <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
          </div>
        )}
        
        {/* Contenu superposé au style skincare */}
        <div className="relative h-full flex flex-col justify-end items-start px-4 sm:px-6 md:px-12 lg:px-16 pb-6 sm:pb-8">
          <div className="max-w-md sm:max-w-lg space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {isEditing ? (
                  <input
                    name="nom"
                    value={salonData.nom}
                    onChange={handleChange}
                    className="bg-white/80 px-2 py-1 rounded text-lg font-bold"
                  />
                ) : (
                  salonData.nom
                )}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base font-light">
                {isEditing ? (
                  <input
                    name="adresse"
                    value={salonData.adresse}
                    onChange={handleChange}
                    className="bg-white/80 px-2 py-1 rounded text-sm"
                  />
                ) : (
                  salonData.adresse
                )}
              </p>
            </div>
            
            {/* Boutons glassmorphism violets */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              
              {/* Réseaux sociaux - seulement si les liens existent */}
              {salonDataFetched.instagram && (
                <a 
                  href={salonDataFetched.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
              {salonDataFetched.facebook && (
                <a 
                  href={salonDataFetched.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </a>
              )}
              {salonDataFetched.tiktok && (
                <a 
                  href={salonDataFetched.tiktok}
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
                <span className="text-xs sm:text-sm font-medium text-white">{salonDataFetched.rating}</span>
                <span className="text-xs text-white/80">({salonDataFetched.reviewCount})</span>
              </div>
              {salonDataFetched.verified && (
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
            {isEditing && canEditSalon() && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold mb-4"
                onClick={handleAddCategory}
              >
                + Ajouter une catégorie
              </button>
            )}
            {serviceCategoriesState.map((category: any, categoryIdx: number) => (
              <div key={category.id} className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={category.name}
                        onChange={e => handleCategoryChange(categoryIdx, 'name', e.target.value)}
                        className="bg-gray-100 px-2 py-1 rounded text-lg font-bold"
                        placeholder="Nom de la catégorie"
                      />
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-full"
                        onClick={() => handleDeleteCategory(categoryIdx)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                  )}
                  {isEditing ? (
                    <textarea
                      value={category.description}
                      onChange={e => handleCategoryChange(categoryIdx, 'description', e.target.value)}
                      className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                      placeholder="Description de la catégorie"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                  )}
                  {isEditing && canEditSalon() && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-full mb-2"
                      onClick={() => handleAddService(categoryIdx)}
                    >
                      + Ajouter un service
                    </button>
                  )}
                </div>
                <div className="px-4 pb-4 space-y-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent"></div>
                  {category.services.map((service: any, serviceIdx: number) => (
                    <div key={serviceIdx} className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/40 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="flex">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          {isEditing ? (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleServicePhotoUpload(categoryIdx, serviceIdx, e.target.files[0]);
                                  }
                                }}
                                className="mb-2"
                              />
                              <input
                                value={service.photo}
                                onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'photo', e.target.value)}
                                className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                                placeholder="URL de la photo"
                              />
                              {service.photo && (
                                <img
                                  src={service.photo}
                                  alt="Aperçu"
                                  className="w-full h-full object-cover rounded"
                                />
                              )}
                            </div>
                          ) : (
                            <img
                              src={service.photo}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&q=80';
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              {isEditing ? (
                                <input
                                  value={service.name}
                                  onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'name', e.target.value)}
                                  className="bg-gray-100 px-2 py-1 rounded text-lg font-bold mb-1"
                                  placeholder="Nom du service"
                                />
                              ) : (
                                <h4 className="font-semibold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">{service.name}</h4>
                              )}
                              <div className="text-right">
                                {isEditing ? (
                                  <input
                                    value={service.price}
                                    onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'price', e.target.value)}
                                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                                    placeholder="Prix (€)"
                                  />
                                ) : (
                                  <span className="font-bold text-purple-600 text-xl">{service.price}€</span>
                                )}
                              </div>
                            </div>
                            {isEditing ? (
                              <textarea
                                value={service.description}
                                onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'description', e.target.value)}
                                className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                                placeholder="Description du service"
                              />
                            ) : (
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: 'rgb(229 231 235)' }}>
                                {service.duration} min
                              </span>
                              {service.reviews > 0 && (
                                <span className="text-xs rounded-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.125rem', paddingBottom: '0.125rem', backgroundColor: 'rgb(229 231 235)' }}>
                                  {service.reviews} avis
                                </span>
                              )}
                            </div>
                          </div>
                          {!isEditing && (
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-purple-700 transition"
                                onClick={() => { /* Réserver le service */ }}
                              >
                                Réserver
                              </button>
                              <button
                                className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-300"
                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                              >
                                {expandedCategory === category.id ? 'Masquer les détails' : 'Voir les détails'}
                                {expandedCategory === category.id ? (
                                  <ChevronUp className="w-4 h-4 ml-1" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 ml-1" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {!isEditing && expandedCategory === category.id && (
                        <div className="p-4 pt-0">
                          <h5 className="font-semibold text-gray-900 mb-2">Détails du service</h5>
                          <p className="text-sm text-gray-600 mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <div className="w-full sm:w-1/2">
                              <h6 className="font-medium text-gray-900 mb-1">Inclus dans ce service :</h6>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Consultation personnalisée</li>
                                <li>Produits de haute qualité</li>
                                <li>Suivi post-service</li>
                              </ul>
                            </div>
                            <div className="w-full sm:w-1/2">
                              <h6 className="font-medium text-gray-900 mb-1">Préparez-vous avant le rendez-vous :</h6>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Arriver 10 minutes en avance</li>
                                <li>Informer sur d'éventuelles allergies</li>
                                <li>Éviter de venir à jeun</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'equipe' && (
          <div className="space-y-4">
            {isEditing && canEditSalon() && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold mb-4"
                onClick={handleAddTeamMember}
              >
                + Ajouter un membre de l'équipe
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembersState.map((member, idx) => (
                <div key={member.id} className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          value={member.name}
                          onChange={e => handleTeamMemberChange(idx, 'name', e.target.value)}
                          className="bg-gray-100 px-2 py-1 rounded text-lg font-bold"
                          placeholder="Nom du membre"
                        />
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded-full"
                          onClick={() => handleDeleteTeamMember(idx)}
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                    )}
                    {isEditing ? (
                      <textarea
                        value={member.bio}
                        onChange={e => handleTeamMemberChange(idx, 'bio', e.target.value)}
                        className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                        placeholder="Biographie"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 mt-0.5">{member.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={member.specialties.join(', ')}
                          onChange={e => handleTeamMemberChange(idx, 'specialties', e.target.value.split(',').map(s => s.trim()))}
                          className="bg-purple-100/80 backdrop-blur-sm text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200/50 w-full"
                          placeholder="Spécialités (séparées par des virgules)"
                        />
                      ) : (
                        member.specialties.map((specialty, sidx) => (
                          <span key={sidx} className="bg-purple-100/80 backdrop-blur-sm text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200/50">
                            {specialty}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{member.telephone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{member.availableToday ? 'Disponible aujourd\'hui' : 'Non disponible'}</span>
                      </div>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="p-4 pt-0">
                      <h5 className="font-semibold text-gray-900 mb-2">Services proposés</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {member.specialties.map((specialty, sidx) => (
                          <li key={sidx}>{specialty}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'galerie' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Galerie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Images de la galerie - exemples statiques */}
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={`https://images.unsplash.com/photo-${idx + 1516975080664}-ed2fc6a32937?w=400&h=400&fit=crop&q=80`}
                    alt={`Galerie ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'infos' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Horaires d'ouverture</h3>
              <p className="text-sm text-gray-600">
                {salonData.horaires.split(',').map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Contact</h3>
              <p className="text-sm text-gray-600">
                Téléphone : <span className="font-medium text-gray-900">{salonData.telephone}</span>
              </p>
              <p className="text-sm text-gray-600">
                Email : <span className="font-medium text-gray-900">contact@avyento.fr</span>
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Adresse</h3>
              <p className="text-sm text-gray-600">
                {salonData.adresse}
              </p>
            </div>
          </div>
        )}
        {activeTab === 'avis' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Avis</h2>
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Laissez un avis</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom</label>
                  <input
                    type="text"
                    className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre avis</label>
                  <textarea
                    className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    rows={4}
                    placeholder="Votre avis sur nos services"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white rounded-md px-4 py-2 font-semibold shadow hover:bg-purple-700 transition-all duration-300 flex-1"
                  >
                    Envoyer
                  </button>
                  <button
                    type="button"
                    className="bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-md px-4 py-2 font-medium hover:bg-white/30 transition-all duration-300 flex-1"
                    onClick={() => setActiveTab('services')}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://images.unsplash.com/photo-${review.id + 1516975080664}-ed2fc6a32937?w=40&h=40&fit=crop&q=80`}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-gray-900">{review.rating}</span>
                          <span className="text-xs text-gray-500">({review.date})</span>
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-green-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-400/30">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        <span className="text-xs font-medium text-green-200">Vérifié</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <div className="flex flex-wrap gap-2">
                    {review.photos.map((photo, pidx) => (
                      <img
                        key={pidx}
                        src={photo}
                        alt={`Photo ${pidx + 1}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover"
                      />
                    ))}
                  </div>
                  {review.salonResponse && (
                    <div className="mt-4 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{review.salonResponse.date}</p>
                      <div className="bg-gray-100 rounded-md p-3">
                        <p className="text-sm text-gray-800">{review.salonResponse.message}</p>
                      </div>
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