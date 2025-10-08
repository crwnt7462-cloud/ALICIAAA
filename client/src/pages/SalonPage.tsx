/** @jsxImportSource react */
import * as React from 'react';
import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getSalonColor, getSalonButtonClass, getSalonGlassCard, getGlassStyle } from '@/lib/salonColors';

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
import useBookingWizard from '@/hooks/useBookingWizard';
import { clearSalonCacheForAuthenticatedUser } from '@/utils/salonCache';
import { broadcastServiceMutation } from '@/lib/broadcastServiceMutation';
import { useToast } from '@/hooks/use-toast';

// Helper pour convertir hex en rgba avec opacité
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Contrôle d'opacité pour l'effet glass sur le bouton Réserver (édition uniquement)
function RenderOpacitySlider({ isEditing, canEditSalon, buttonOpacity, setButtonOpacity }: any) {
  if (!(isEditing && canEditSalon())) return null;
  return (
    <div className="flex items-center gap-3 mb-4">
      <label htmlFor="opacity-slider" className="text-sm font-medium text-gray-700">Opacité du bouton (effet glass):</label>
      <input
        id="opacity-slider"
        type="range"
        min={0.2}
        max={1}
        step={0.01}
        value={buttonOpacity}
        onChange={e => setButtonOpacity(Number(e.target.value))}
        style={{ width: 120 }}
      />
      <span className="text-xs text-gray-500">{Math.round(buttonOpacity*100)}%</span>
    </div>
  );
}

export default function SalonPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth(); // Récupérer l'utilisateur aussi
  const [selectedColor, setSelectedColor] = useState('#f59e0b'); // Couleur par défaut orange
  // Opacité globale pour les effets glass (en pourcentage)
  const [glassOpacity, setGlassOpacity] = useState(20); // 20% par défaut
  // Opacité utilisée pour le bouton (échelle 0..1)
  const buttonOpacity = Math.max(0.05, Math.min(1, glassOpacity / 100));
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Image sélectionnée pour affichage en grand
  const { setSelectedService } = useBookingWizard();
  
  // Détecter params.slug depuis l'URL (robuste pour /salon/:slug ou /salon/:uuid)
  const paramsMatch = location.match(/^\/salon\/([^/]+)(?:\/.*)?$/);
  const paramsSlug = paramsMatch?.[1] ?? null;

  // UUID detection (very permissive, matches hex + hyphens length 36)
  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  const isUuid = paramsSlug ? uuidRegex.test(paramsSlug) : false;
  const isTemplateView = location === '/salon';

  // Decide which identifier to use
  // CORRECTION: Si on est sur /salon (template view), ne pas utiliser le storedSlug d'un autre salon
  const storedSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
  const slugOrUuid = paramsSlug || (!isTemplateView ? storedSlug : null);

  // Persist any slug/uuid found in URL for downstream pages
  useEffect(() => {
    if (paramsSlug) {
      try { sessionStorage.setItem('salonSlug', paramsSlug); } catch (e) { /* ignore */ }
      if (isUuid) {
        console.log('salon_page_fetch_uuid', { uuid: paramsSlug });
      } else {
        console.log('salon_page_fetch_slug', { slug: paramsSlug });
      }
    } else if (isTemplateView && isAuthenticated) {
      // Si on est sur /salon en tant qu'utilisateur connecté, nettoyer tous les caches de salon
      try { 
        clearSalonCacheForAuthenticatedUser();
      } catch (e) { /* ignore */ }
    }
  }, [paramsSlug, isUuid, isTemplateView, isAuthenticated]);
  // If no slug and not template view, show not found early
  useEffect(() => {
    if (!slugOrUuid && !isTemplateView) {
      console.warn('salon_page_no_slug');
    }
  }, [slugOrUuid, isTemplateView]);
  
  // Charger les données du salon du professionnel connecté si on est sur /salon
  const { data: userSalon, isLoading: userSalonLoading } = useQuery({
    queryKey: ['/api/salon/my-salon'],
    enabled: isTemplateView && isAuthenticated,
    retry: false,
    staleTime: 5000
  });

  console.log('[SalonPage DEBUG] isAuthenticated:', isAuthenticated, 'user:', user, 'isTemplateView:', isTemplateView, 'userSalon:', userSalon);

  // Log minimal pour debug des services
  console.debug('[SalonPage] services from my-salon', (userSalon as any)?.services?.length);

  // Charger les données d'un salon spécifique par ID (accès pro authentifié)
  const salonId = isUuid ? paramsSlug : null;
  const { data: specificSalonById } = useQuery({
    queryKey: ['/api/salon', salonId],
    queryFn: () => fetch(`/api/salon/${salonId}`).then(res => res.json()),
    enabled: !!salonId,
    retry: false,
    staleTime: 5000
  });

  // Charger les données d'un salon spécifique par slug public (accès public)
  const { data: specificSalonBySlug, isLoading: publicLoading, error: publicError } = useQuery({
    queryKey: ['public-salon', slugOrUuid],
    queryFn: async () => {
      if (!slugOrUuid) throw new Error('identifier manquant');
      // Use the same public endpoint: server will handle uuid or public_slug
      try {
        const response = await fetch(`/api/public/salon/${slugOrUuid}`);
        if (!response.ok) {
          console.warn('salon_page_fetch_err', { slugOrUuid });
          throw new Error('Salon not found');
        }
        const payload = await response.json();
        console.log('salon_page_fetch_ok', { slug: slugOrUuid });
        // store payload for other pages to use as fallback (e.g., professional-selection)
        try {
          if (typeof window !== 'undefined' && payload) {
            try { sessionStorage.setItem('publicSalonPayload', JSON.stringify(payload)); } catch (e) { /* ignore storage errors */ }
          }
        } catch (e) {
          /* ignore */
        }
        return payload.salon ?? null;
      } catch (err) {
        console.warn('salon_page_fetch_err', { slugOrUuid });
        throw err;
      }
    },
    enabled: !!slugOrUuid,
    retry: false,
    staleTime: 5000,
  });

  useEffect(() => {
    if (publicError) {
      console.warn('salon_page_fetch_err', { slugOrUuid });
    }
  }, [publicError, slugOrUuid]);

  // Combiner les données selon le type d'accès
  const specificSalon = specificSalonById || specificSalonBySlug;

  // If no slug provided for a public salon page, show not found
  if (!slugOrUuid && !isTemplateView) {
    console.warn('salon_page_no_slug');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Salon introuvable</h2>
          <p className="text-gray-600">Le salon demandé est introuvable ou le lien est invalide.</p>
        </div>
      </div>
    );
  }
  
  // ✅ PROTECTION + FLASH KILLER: Redirection immédiate si salon existe
  useEffect(() => {
    if (isTemplateView && isAuthenticated && userSalon && (userSalon as any)?.id) {
      console.log('🔄 REDIRECTION IMMÉDIATE - Salon existant détecté');
      const salonUrl = `/salon/${(userSalon as any).id}`;
      // Redirection immédiate sans délai
      window.location.href = salonUrl;
    }
  }, [isTemplateView, isAuthenticated, userSalon]);

  // 🚨 FLASH KILLER SUPPLÉMENTAIRE : Détection précoce des données
  useEffect(() => {
    // Dès qu'on détecte des données API, arrêter tout loading
    if (specificSalon || (userSalon && (userSalon as any)?.name)) {
      console.log('🚀 DÉTECTION DONNÉES - Arrêt loading immédiat');
      setHasLoadedApiData(true);
      setIsDataLoading(false);
    }
  }, [specificSalon, userSalon]);

  // ✅ CORRECTION: Activer le mode édition SEULEMENT si:
  // 1. L'utilisateur est sur /salon (sa propre page) ET authentifié ET n'a pas encore de salon
  // 2. OU si l'utilisateur est le propriétaire du salon affiché (pour d'autres URLs)
  const isOwnSalonPage = isTemplateView && isAuthenticated;
  const isSalonCreated = isAuthenticated && userSalon && (userSalon as any).name;
  
  // Fonction pour déterminer si l'utilisateur peut éditer ce salon
  const canEditSalon = () => {
    console.log('canEditSalon check:', { 
      isTemplateView, 
      isAuthenticated, 
      specificSalon: !!specificSalon,
      specificSalonOwnerId: specificSalon?.ownerId,
      userId: user?.id,
      hasExistingSalon: !!(userSalon && (userSalon as any)?.id)
    });
    
    // Mode template (/salon) : l'utilisateur authentifié peut toujours éditer pour créer/modifier son salon
    if (isTemplateView) {
      return isAuthenticated;
    }
    // Salon spécifique : seul le propriétaire peut éditer
    if (specificSalon && isAuthenticated && user) {
      return specificSalon.ownerId === user.id;
    }
    return false;
  };
  
  const [isEditing, setIsEditing] = useState(false); // Commencer en mode lecture seule si l'utilisateur ne peut pas éditer
  const isReadOnly = !canEditSalon() || !isEditing;
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#8b5cf6');
  const [isDataLoading, setIsDataLoading] = useState(true); // COMMENCER EN LOADING pour éviter flash
  const [hasLoadedApiData, setHasLoadedApiData] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false); // Contrôler l'affichage du template
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

  // Fonction pour récupérer les bonnes customColors selon le contexte
  const getCurrentSalonCustomColors = () => {
    if (specificSalon) {
      return specificSalon.customColors;
    }
    if (isTemplateView && userSalon) {
      return (userSalon as any)?.customColors;
    }
    return null;
  };

  // Déterminer quel salon afficher selon l'URL
  const getSalonData = () => {
    // 🔄 PRIORITÉ ABSOLUE : Données API disponibles
    if (specificSalon) {
      return {
        name: specificSalon.name || "Salon",
        verified: true,
        rating: 4.8,
        reviewCount: 127,
        priceRange: "€€€",
  address: specificSalon.address || specificSalon.business_address || "Paris, France",
  // Prefer the canonical server field `cover_image_url`, then fall back to other variants
  backgroundImage: specificSalon.cover_image_url || specificSalon.coverImageUrl || specificSalon.cover_image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
        primaryColor: '#8b5cf6',
        description: specificSalon.description || "Bienvenue dans notre salon",
        instagram: specificSalon.instagram || "",
        facebook: specificSalon.facebook || "",
        tiktok: specificSalon.tiktok || ""
      };
    }

    // 🔄 PRIORITÉ : Données utilisateur sur template view
    if (isTemplateView && userSalon && (userSalon as any)?.name) {
      return {
        name: (userSalon as any)?.name || "Mon Salon",
        verified: true,
        rating: (userSalon as any)?.rating || 4.8,
        reviewCount: (userSalon as any)?.reviewCount || 0,
        priceRange: "€€€",
        address: (userSalon as any)?.address || "Paris, France",
        backgroundImage: (userSalon as any)?.coverImageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
        primaryColor: (userSalon as any)?.customColors?.primary || '#8b5cf6',
        description: (userSalon as any)?.description || "Bienvenue dans notre salon",
        instagram: (userSalon as any)?.instagram || "",
        facebook: (userSalon as any)?.facebook || "",
        tiktok: (userSalon as any)?.tiktok || ""
      };
    }

    // 🚨 FLASH KILLER : Si on charge, PAS DE TEMPLATE DU TOUT
    if (isDataLoading || (!hasLoadedApiData && isTemplateView && isAuthenticated)) {
      return {
        name: "Chargement de votre salon...",
        verified: true,
        rating: 4.8,
        reviewCount: 0,
        priceRange: "€€€",
        address: "Chargement...",
        backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80",
        primaryColor: '#8b5cf6',
        description: "Chargement de vos données personnalisées...",
        instagram: "",
        facebook: "",
        tiktok: ""
      };
    }
    
    if (isTemplateView) {
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
  const primaryColor = customPrimaryColor || salonDataFetched.primaryColor;

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
      // Si utilisateur connecté avec des services réels stockés en jsonb
      if (isAuthenticated && Array.isArray((userSalon as any)?.services) && (userSalon as any).services.length > 0) {
        return [{
          id: 'services',
          name: 'Services',
          description: 'Nos services professionnels',
          services: (userSalon as any).services.map((service: any) => ({
            name: service.name || 'Service',
            price: service.price || 0,
            duration: service.duration || 30,
            category: service.category || 'général',
            description: service.description || 'Service professionnel',
            photo: 'https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80',
            rating: 4.8,
            reviews: Math.floor(Math.random() * 50) + 10
          }))
        }];
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

  // Chargement contrôlé sans flash de données par défaut sur les pages publiques /salon/:slug
  useEffect(() => {
    const isPublicSalonRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/salon/');

    // Cas public: n'afficher le template qu'une fois les données chargées
    if (isPublicSalonRoute) {
      if (specificSalon) {
        setHasLoadedApiData(true);
        setIsDataLoading(false);
        setShowTemplate(true);
      } else {
        // Attente silencieuse: pas de fallback qui pourrait montrer un autre salon
        setHasLoadedApiData(false);
        setIsDataLoading(true);
        setShowTemplate(false);
      }
      return;
    }

    // Cas template/éditeur: conserver l'ancien comportement
    if (specificSalon || (userSalon && (userSalon as any)?.name)) {
      setHasLoadedApiData(true);
      setIsDataLoading(false);
      setShowTemplate(true);
      return;
    }

    if (isTemplateView && isAuthenticated && !userSalon) {
      setIsDataLoading(true);
      setShowTemplate(false);
      return;
    }

    setIsDataLoading(false);
    setShowTemplate(true);
    setHasLoadedApiData(true);
  }, [specificSalon, userSalon, isTemplateView, isAuthenticated]);

  // Synchroniser les données quand les queries API changent
  useEffect(() => {
    if (hasLoadedApiData) return; // Éviter les rechargements multiples
    
    let dataToLoad = null;
    
    // Priorité aux données spécifiques du salon
    if (specificSalon) {
      dataToLoad = specificSalon;
    } else if (userSalon && isTemplateView) {
      dataToLoad = userSalon;
    }
    
    if (dataToLoad) {
      console.log('Chargement des données API:', dataToLoad);
      
      setSalonData({
        nom: dataToLoad.name || '',
        adresse: dataToLoad.address || '',
        telephone: dataToLoad.telephone || '',
        description: dataToLoad.description || '',
        horaires: dataToLoad.horaires || '',
        facebook: dataToLoad.facebook || '',
        instagram: dataToLoad.instagram || '',
        tiktok: dataToLoad.tiktok || ''
      });
      
      if (dataToLoad.serviceCategories) {
        setServiceCategoriesState(dataToLoad.serviceCategories);
      }
      // Accept both snake_case (server) and camelCase (client) team fields
      const apiTeam = dataToLoad.team_members ?? dataToLoad.teamMembers ?? [];
      if (apiTeam && Array.isArray(apiTeam) && apiTeam.length > 0) {
        setTeamMembersState(apiTeam);
      }
      if (dataToLoad.coverImageUrl) {
        setCoverImage(dataToLoad.coverImageUrl);
      }
      
      setHasLoadedApiData(true);
      setIsDataLoading(false);
      
      // Nettoyer le localStorage après chargement réussi des données API
      localStorage.removeItem('salonData');
      localStorage.removeItem('serviceCategoriesState');
      localStorage.removeItem('teamMembersState');
      localStorage.removeItem('coverImage');
    }
  }, [specificSalon, userSalon, isTemplateView, hasLoadedApiData]);

  async function handleSave() {
    setIsEditing(false);
    try {
      let response;
      let mutationSalonId = null;
      let mutationServiceId = null;
      let mutationType = 'update';

      if (isTemplateView) {
        // Mode template : créer un nouveau salon personnalisé
        response = await fetch('/api/salon/create-personalized', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            salonData: {...salonData, ...infoData},
            serviceCategories: serviceCategoriesState,
            teamMembers: teamMembersState,
            coverImage,
            galleryImages,
          })
        });
        mutationType = 'create';
      } else if (specificSalon) {
        // Salon spécifique : mettre à jour le salon existant
        response = await fetch('/api/salon/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            salonId: specificSalon.id,
            salonData: {...salonData, ...infoData},
            serviceCategories: serviceCategoriesState,
            teamMembers: teamMembersState,
            coverImage,
            galleryImages,
          })
        });
        mutationType = 'update';
      }

      if (response && response.ok) {
        const result = await response.json();

        // Nettoyer le localStorage après une sauvegarde réussie
        localStorage.removeItem('serviceCategoriesState');
        localStorage.removeItem('teamMembersState');
        localStorage.removeItem('salonData');
        localStorage.removeItem('coverImage');

        // Déterminer le salonId à notifier (création: depuis result, update: depuis specificSalon)
        if (isTemplateView && result.salonUrl) {
          // Extraire salonId de l'URL si possible
          const match = result.salonUrl.match(/\/salon\/(.+)$/);
          mutationSalonId = match ? match[1] : null;
        } else if (specificSalon) {
          mutationSalonId = specificSalon.id;
        }

        // Optionnel: déterminer le serviceId si mutation sur un service précis (à affiner si besoin)
        // mutationServiceId = ...

        // Broadcast la mutation (création ou update)
        if (mutationSalonId) {
          // type-narrowing: cast mutationType to expected union type
          broadcastServiceMutation(mutationSalonId, mutationServiceId, mutationType as 'create' | 'update' | 'delete' | undefined);
        }

        if (isTemplateView && result.salonUrl) {
          // ✅ REDIRECTION OBLIGATOIRE : /salon ne doit jamais être modifié
          // Créer un salon avec l'ID utilisateur et rediriger immédiatement
          // BUT: prefer redirecting to the public read-only URL (shareable link)
          console.log('🔄 Redirection depuis /salon vers salon personnel (orig):', result.salonUrl);
          toast({ title: 'Salon créé avec succès !', description: 'Redirection vers la version publique du salon...', duration: 4000 });

          // Extract id/slug from returned URL and try to resolve a public_slug via the public API
          const match = result.salonUrl.match(/\/salon\/(.+)$/);
          const idOrSlug = match ? match[1] : null;
          let targetUrl = result.salonUrl;
          if (idOrSlug) {
            try {
              const pubResp = await fetch(`/api/public/salon/${idOrSlug}`);
              if (pubResp.ok) {
                const pubPayload = await pubResp.json();
                const publicSlug = pubPayload?.salon?.public_slug || pubPayload?.salon?.publicSlug || pubPayload?.salon?.publicSlug?.toString?.() || null;
                if (publicSlug) {
                  targetUrl = `/salon/${publicSlug}`;
                  console.log('salon_page_redirect_public', { from: result.salonUrl, to: targetUrl });
                } else {
                  // If no explicit public_slug, fallback to using returned idOrSlug
                  targetUrl = `/salon/${idOrSlug}`;
                  console.warn('salon_page_public_slug_not_found', { idOrSlug });
                }
              } else {
                console.warn('salon_page_public_lookup_failed', { idOrSlug, status: pubResp.status });
                targetUrl = `/salon/${idOrSlug}`;
              }
            } catch (err: any) {
              console.warn('salon_page_public_lookup_err', { idOrSlug, error: err?.message || err });
              targetUrl = `/salon/${idOrSlug}`;
            }
          }

          window.location.href = targetUrl;
        } else {
          toast({ title: 'Succès', description: 'Modifications enregistrées sur votre salon !', duration: 4000 });
        }
      } else {
        const errorData = response ? await response.json() : { error: 'Erreur inconnue' };
        toast({
          title: "Erreur lors de l'enregistrement",
          description: errorData.error || 'Erreur inconnue',
          duration: 6000,
        });
      }
    } catch (e) {
      console.error('Erreur de sauvegarde:', e);
      toast({
        title: "Erreur lors de l'enregistrement",
        description: e instanceof Error ? e.message : 'Erreur inconnue',
        duration: 6000,
      });
    }
  }

  // Ajout de la gestion des catégories et services modifiables
  const [serviceCategoriesState, setServiceCategoriesState] = useState(serviceCategories);

  function handleServiceChange(categoryIdx: number, serviceIdx: number, field: string, value: string) {
    const updated = [...serviceCategoriesState];
    (updated[categoryIdx].services[serviceIdx] as any)[field] = value;
    setServiceCategoriesState(updated);
    
    // Sauvegarde automatique dans localStorage
    localStorage.setItem('serviceCategoriesState', JSON.stringify(updated));
  }

  function handleCategoryChange(categoryIdx: number, field: string, value: string) {
    const updated = [...serviceCategoriesState];
    (updated[categoryIdx] as any)[field] = value;
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
      photo: '',
      photos: []
    });
    setServiceCategoriesState(updated);
  }

  function handleServicePhotoUpload(categoryIdx: number, serviceIdx: number, file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...serviceCategoriesState];
      const service = updated[categoryIdx].services[serviceIdx];
      
      // Initialiser photos comme array si c'est une string
      if (typeof service.photos === 'undefined' || !Array.isArray(service.photos)) {
        service.photos = service.photo ? [service.photo] : [];
      }
      
      // Ajouter la nouvelle photo
      service.photos.push(e.target?.result as string);
      
      // Garder la première photo comme photo principale pour compatibilité
      service.photo = service.photos[0];
      
      setServiceCategoriesState(updated);
      
      // Sauvegarde automatique dans localStorage
      localStorage.setItem('serviceCategoriesState', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveServicePhoto(categoryIdx: number, serviceIdx: number, photoIdx: number) {
    const updated = [...serviceCategoriesState];
    const service = updated[categoryIdx].services[serviceIdx];
    
    if (service.photos && Array.isArray(service.photos)) {
      service.photos.splice(photoIdx, 1);
      // Mettre à jour la photo principale
      service.photo = service.photos.length > 0 ? service.photos[0] : '';
    }
    
    setServiceCategoriesState(updated);
    
    // Sauvegarde automatique dans localStorage
    localStorage.setItem('serviceCategoriesState', JSON.stringify(updated));
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

  // États pour la galerie et les infos
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [infoData, setInfoData] = useState({
    horaires: salonData.horaires,
    telephone: salonData.telephone,
    email: 'contact@avyento.fr',
    adresse: salonData.adresse,
    facebook: '',
    instagram: '',
    tiktok: '',
    description: '',
    horaires_lundi: '',
    horaires_mardi: '',
    horaires_mercredi: '',
    horaires_jeudi: '',
    horaires_vendredi: '',
    horaires_samedi: '',
    horaires_dimanche: ''
  });

  // Fonctions pour gérer la galerie
  function handleAddGalleryImage(imageUrl: string) {
    setGalleryImages([...galleryImages, imageUrl]);
  }

  function handleRemoveGalleryImage(index: number) {
    const updated = [...galleryImages];
    updated.splice(index, 1);
    setGalleryImages(updated);
  }

  function handleGalleryImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleAddGalleryImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonctions pour gérer les infos
  function handleInfoChange(field: string, value: string) {
    setInfoData({...infoData, [field]: value});
  }

  // ✅ CORRECTION: Charger les données depuis l'API au démarrage
  useEffect(() => {
    if (specificSalon) {
      // Map API fields into local state with safe fallbacks and logging
      const addr = specificSalon.address || specificSalon.adresse || '';
      const desc = specificSalon.description || specificSalon.desc || '';
      const opening = specificSalon.opening_hours || specificSalon.horaires || '';
      const facebook = specificSalon.facebook || '';
      const instagram = specificSalon.instagram || '';
      const tiktok = specificSalon.tiktok || '';

      if (!addr) {
        console.warn('salon_page_missing_field', { field: 'address', slugOrUuid });
      }
      if (!desc) {
        console.warn('salon_page_missing_field', { field: 'description', slugOrUuid });
      }
      if (!opening) {
        console.warn('salon_page_missing_field', { field: 'opening_hours', slugOrUuid });
      }
      if (!facebook && !instagram && !tiktok) {
        console.warn('salon_page_missing_field', { field: 'socials', slugOrUuid });
      }

      setSalonData({
        nom: specificSalon.name || '',
        adresse: addr || 'Adresse non renseignée',
        telephone: specificSalon.telephone || '',
        description: desc || 'Description non renseignée',
        horaires: opening || 'Horaires non renseignés',
        facebook,
        instagram,
        tiktok
      });
      if (specificSalon.serviceCategories && specificSalon.serviceCategories.length > 0) {
        // Normaliser les services pour inclure le champ photos
        const normalizedCategories = specificSalon.serviceCategories.map((category: any) => ({
          ...category,
          services: category.services.map((service: any) => ({
            ...service,
            photos: service.photos || (service.photo ? [service.photo] : [])
          }))
        }));
        setServiceCategoriesState(normalizedCategories);
      }
      // specificSalon may use snake_case or camelCase for team
      const specificTeam = specificSalon.team_members ?? specificSalon.teamMembers ?? [];
      if (Array.isArray(specificTeam) && specificTeam.length > 0) {
        setTeamMembersState(specificTeam);
      }
      // Cover image: prefer canonical `cover_image_url` returned by the public API
      const coverFromApiRaw = specificSalon.cover_image_url || specificSalon.coverImageUrl || specificSalon.cover_image || specificSalon.coverImage || '';
      // Defensive: ignore extremely large data blobs for cover (likely accidental) but allow normal data URIs or http(s) urls
      const coverFromApi = typeof coverFromApiRaw === 'string' && coverFromApiRaw.length < 200000 ? coverFromApiRaw : '';
      if (coverFromApi) setCoverImage(coverFromApi);

      // Gallery images: prefer canonical `gallery_images` (array), normalize other shapes to string[]
      let galleryFromApi: any = specificSalon.gallery_images ?? specificSalon.galleryImages ?? specificSalon.gallery ?? [];
      if (!Array.isArray(galleryFromApi)) {
        // If it's a single string, convert to array, else empty
        galleryFromApi = galleryFromApi ? [galleryFromApi] : [];
      }
      const normalizedGallery: string[] = (galleryFromApi || []).map((g: any) => String(g)).filter(Boolean);
      if (normalizedGallery.length > 0) {
        setGalleryImages(normalizedGallery);
      } else {
        // Keep placeholders if gallery is empty, but log for observability
        console.warn('salon_page_empty_gallery', { slugOrUuid });
      }
      setInfoData({
        horaires: opening || 'Horaires non renseignés',
        telephone: specificSalon.telephone || '',
        email: specificSalon.email || 'contact@avyento.fr',
        adresse: addr || 'Adresse non renseignée',
        facebook: facebook || '',
        instagram: instagram || '',
        tiktok: tiktok || '',
        description: desc || 'Description non renseignée',
        horaires_lundi: specificSalon.horaires_lundi || '',
        horaires_mardi: specificSalon.horaires_mardi || '',
        horaires_mercredi: specificSalon.horaires_mercredi || '',
        horaires_jeudi: specificSalon.horaires_jeudi || '',
        horaires_vendredi: specificSalon.horaires_vendredi || '',
        horaires_samedi: specificSalon.horaires_samedi || '',
        horaires_dimanche: specificSalon.horaires_dimanche || ''
      });
    } else if (isTemplateView && isAuthenticated && userSalon) {
      const salonApiData = userSalon as any;
      setSalonData({
        nom: salonApiData.name || '',
        adresse: salonApiData.address || '',
        telephone: salonApiData.telephone || '',
        description: salonApiData.description || '',
        horaires: salonApiData.horaires || '',
        facebook: salonApiData.facebook || '',
        instagram: salonApiData.instagram || '',
        tiktok: salonApiData.tiktok || ''
      });
      if (salonApiData.serviceCategories && salonApiData.serviceCategories.length > 0) {
        // Normaliser les services pour inclure le champ photos
        const normalizedCategories = salonApiData.serviceCategories.map((category: any) => ({
          ...category,
          services: category.services.map((service: any) => ({
            ...service,
            photos: service.photos || (service.photo ? [service.photo] : [])
          }))
        }));
        setServiceCategoriesState(normalizedCategories);
      }
      const salonApiTeam = salonApiData.team_members ?? salonApiData.teamMembers ?? [];
      if (Array.isArray(salonApiTeam) && salonApiTeam.length > 0) {
        setTeamMembersState(salonApiTeam);
      }
      if (salonApiData.coverImageUrl) {
        setCoverImage(salonApiData.coverImageUrl);
      }
      if (salonApiData.galleryImages && Array.isArray(salonApiData.galleryImages)) {
        setGalleryImages(salonApiData.galleryImages);
      }
      setInfoData({
        horaires: salonApiData.horaires || '',
        telephone: salonApiData.telephone || '',
        email: salonApiData.email || 'contact@avyento.fr',
        adresse: salonApiData.address || '',
        facebook: salonApiData.facebook || '',
        instagram: salonApiData.instagram || '',
        tiktok: salonApiData.tiktok || '',
        description: salonApiData.description || '',
        horaires_lundi: salonApiData.horaires_lundi || '',
        horaires_mardi: salonApiData.horaires_mardi || '',
        horaires_mercredi: salonApiData.horaires_mercredi || '',
        horaires_jeudi: salonApiData.horaires_jeudi || '',
        horaires_vendredi: salonApiData.horaires_vendredi || '',
        horaires_samedi: salonApiData.horaires_samedi || '',
        horaires_dimanche: salonApiData.horaires_dimanche || ''
      });
    }
  }, [specificSalon, isTemplateView, isAuthenticated, userSalon]);

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
  // Masquer le bouton Modifier si on est sur une page publique (URL /salon/:public_slug)
  const isPublicSalonPage = location.match(/^\/salon\/[a-z0-9-]{10,}$/i) && !canEditSalon();
  // � FLASH KILLER ULTIME : Écran de chargement strict
  if (isDataLoading || (!hasLoadedApiData && isTemplateView && isAuthenticated && !showTemplate)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-semibold text-lg">Chargement de votre salon...</p>
          <p className="mt-2 text-gray-500 text-sm">Préparation de vos données personnalisées</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isPublicSalonPage && (
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
      )}
      
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

        {/* Sélecteur de couleurs - Visible seulement en mode édition */}
        {isEditing && (
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-800">🎨 Couleurs du salon</h3>
              <div className="flex gap-2">
                {[
                  { name: 'Orange', color: '#f59e0b' },
                  { name: 'Violet', color: '#7c3aed' },
                  { name: 'Rose', color: '#ec4899' },
                  { name: 'Bleu', color: '#3b82f6' },
                  { name: 'Vert', color: '#10b981' }
                ].map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() => {
                      setSelectedColor(preset.color);
                      console.log('Couleur sélectionnée:', preset.color);
                    }}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                  className="backdrop-blur-md text-white border px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                  style={{ 
                    backgroundColor: `${selectedColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
                    borderColor: `${selectedColor}80`
                  }}
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
                  className="backdrop-blur-md text-white border px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                  style={{ 
                    backgroundColor: `${selectedColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
                    borderColor: `${selectedColor}80`
                  }}
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
                  className="backdrop-blur-md text-white border px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2"
                  style={{ 
                    backgroundColor: `${selectedColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
                    borderColor: `${selectedColor}80`
                  }}
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4 font-bold">♪</span>
                  <span className="hidden sm:inline">TikTok</span>
                </a>
              )}
            </div>
            
            {/* Info badges */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              <div 
                className="flex items-center gap-1 sm:gap-1.5 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border"
                style={{ 
                  backgroundColor: `${selectedColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  borderColor: `${selectedColor}80`
                }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-white">{salonDataFetched.rating}</span>
                <span className="text-xs text-white/80">({salonDataFetched.reviewCount})</span>
              </div>
              {salonDataFetched.verified && (
                <div 
                  className="flex items-center gap-1 sm:gap-1.5 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/30"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: selectedColor }} />
                  <span className="text-xs font-medium text-white">Vérifié</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section personnalisation des couleurs - Visible seulement en mode édition */}
      {canEditSalon() && isEditing && (
        <div className="bg-white/95 backdrop-blur-md border-b border-blue-200/50 sticky top-16 z-15">
          <div className="max-w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: selectedColor }}></div>
                  <h3 className="text-sm font-semibold text-gray-900">🎨 Personnalisation des couleurs et effets</h3>
                </div>
                
                {/* Palette de couleurs prédéfinies */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Palette de couleurs:</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      '#7c3aed', '#ec4899', '#3b82f6', '#10b981', 
                      '#f59e0b', '#ef4444', '#6366f1', '#059669',
                      '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ${
                          selectedColor === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-white'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Couleur personnalisée */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-700">Couleur personnalisée:</label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-xs w-20"
                      placeholder="#000000"
                    />
                  </div>

                  {/* Contrôle d'opacité pour effet glass */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-700">Opacité Glass:</label>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={glassOpacity}
                      onChange={(e) => setGlassOpacity(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-600 w-8">{glassOpacity}%</span>
                  </div>
                </div>

                {/* Aperçu de l'effet glass */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-700">Aperçu:</span>
                  <div 
                    className="px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 text-white text-xs font-medium"
                    style={{ backgroundColor: `${selectedColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}` }}
                  >
                    Effet Glass
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                style={tab.active ? { borderColor: selectedColor, color: selectedColor } : {}}
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
            {/* Affichage des services réels stockés en jsonb */}
            {isAuthenticated && Array.isArray((userSalon as any)?.services) && (userSalon as any).services.length > 0 && location === '/salon' ? (
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-4">Nos Services</h3>
                  <div className="space-y-3">
                    {(userSalon as any).services.map((service: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="flex p-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{service.category || 'Service'}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-semibold text-gray-900">{service.price}€</span>
                              <span className="text-gray-600">{service.duration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : isAuthenticated && Array.isArray((userSalon as any)?.services) && (userSalon as any).services.length === 0 && location === '/salon' ? (
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                  <p className="text-gray-500">Aucun service encore ajouté</p>
                </div>
              </div>
            ) : (
              <>
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
                        disabled={isReadOnly}
                      />
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-full"
                        onClick={() => handleDeleteCategory(categoryIdx)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedCategory === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  )}
                  {isEditing && (
                    <textarea
                      value={category.description}
                      onChange={e => handleCategoryChange(categoryIdx, 'description', e.target.value)}
                      className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                      placeholder="Description de la catégorie"
                      disabled={isReadOnly}
                    />
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
                {(expandedCategory === category.id || isEditing) && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent"></div>
                    {category.services.map((service: any, serviceIdx: number) => (
                    <div key={serviceIdx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {!isEditing ? (
                        // Vue client moderne comme le screenshot
                        <div className="flex p-4">
                          {/* Images du service */}
                          <div className="flex gap-2 w-40 flex-shrink-0">
                            {(() => {
                              // Obtenir les photos du service (priorité au tableau photos, sinon photo principale, sinon par défaut)
                              const servicePhotos = service.photos && Array.isArray(service.photos) && service.photos.length > 0
                                ? service.photos
                                : service.photo 
                                ? [service.photo]
                                : [
                                    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&q=80',
                                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
                                    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop&q=80'
                                  ];

                              // Afficher jusqu'à 3 images
                              const displayPhotos = servicePhotos.slice(0, 3);
                              
                              // Compléter avec des images par défaut si moins de 3 photos
                              const defaultImages = [
                                'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&q=80',
                                'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
                                'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop&q=80'
                              ];
                              
                              while (displayPhotos.length < 3) {
                                displayPhotos.push(defaultImages[displayPhotos.length]);
                              }

                              // param typing for map
                              return displayPhotos.map((photo: string, index: number) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={`${service.name} - Photo ${index + 1}`}
                                  className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform shadow-sm"
                                  onClick={() => setSelectedImage(photo)}
                                  onError={e => {
                                    e.currentTarget.src = defaultImages[index];
                                  }}
                                />
                              ));
                            })()}
                          </div>

                          {/* Contenu principal */}
                          <div className="flex-1 ml-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-base mb-1">{service.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                
                                {/* Rating avec étoiles */}
                                <div className="flex items-center gap-1 mb-3">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {service.rating || '4.9'} ({service.reviews || '127'} avis)
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  {/* Prix */}
                                  <div className="text-right">
                                    <span 
                                      className="font-bold text-xl"
                                      style={{ color: selectedColor }}
                                    >
                                      {service.price}€
                                    </span>
                                  </div>

                                  {/* Bouton Réserver */}
                                  <button
                                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg"
                                    style={{
                                      backgroundColor: hexToRgba(selectedColor || primaryColor || '#f59e0b', buttonOpacity),
                                      backdropFilter: 'blur(12px)',
                                      WebkitBackdropFilter: 'blur(12px)',
                                      backgroundImage: 'none',
                                      color: '#000',
                                      border: 'none',
                                      boxShadow: '0 6px 18px -6px rgba(0,0,0,0.25)',
                                    }}
                                    onClick={() => {
                                      try {
                                        const normalize = (s: any) => {
                                          const id = s.id ?? s.serviceId ?? s.service_id ?? null;
                                          let price = s.price ?? s.amount ?? s.price_cents ?? s.cost ?? null;
                                          if (typeof price === 'number' && price > 1000) price = price / 100;
                                          if (typeof price === 'string' && price.match(/^\d+$/)) price = parseFloat(price);
                                          let duration = s.duration ?? s.length ?? s.time ?? null;
                                          if (typeof duration === 'string') {
                                            const mm = duration.match(/(\d+)/);
                                            duration = mm ? parseInt(mm[1], 10) : null;
                                          }
                                          return { id, name: s.name ?? s.title ?? 'Service', price, duration, raw: s };
                                        };
                                        const normalized = normalize(service);
                                        try { setSelectedService(normalized.id ?? service.id, normalized); } catch (e) { /* ignore */ }
                                        try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
                                        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
                                      } catch (e) { /* ignore */ }
                                      navigate('/professional-selection');
                                    }}
                                  >
                                    Réserver
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Vue édition (version existante)
                        <div className="flex">
                          <div className="w-60 flex-shrink-0 pr-4">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ajouter une photo
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleServicePhotoUpload(categoryIdx, serviceIdx, e.target.files[0]);
                                  }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                            
                            {/* Galerie des photos du service */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Photos du service ({service.photos && Array.isArray(service.photos) ? service.photos.length : (service.photo ? 1 : 0)})
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {service.photos && Array.isArray(service.photos) ? (
                                  // param typing for map
                                  service.photos?.map((photo: string, photoIdx: number) => (
                                    <div key={photoIdx} className="relative group">
                                      <img
                                        src={photo}
                                        alt={`Photo ${photoIdx + 1}`}
                                        className="w-full h-16 object-cover rounded border"
                                      />
                                      <button
                                        onClick={() => handleRemoveServicePhoto(categoryIdx, serviceIdx, photoIdx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : service.photo ? (
                                  <div className="relative group">
                                    <img
                                      src={service.photo}
                                      alt="Photo principale"
                                      className="w-full h-16 object-cover rounded border"
                                    />
                                    <button
                                      onClick={() => handleServiceChange(categoryIdx, serviceIdx, 'photo', '')}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <div className="col-span-3 text-center text-gray-400 text-sm py-4 border-2 border-dashed border-gray-300 rounded">
                                    Aucune photo
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <input
                                  value={service.name}
                                  onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'name', e.target.value)}
                                  className="bg-gray-100 px-2 py-1 rounded text-lg font-bold mb-1"
                                  placeholder="Nom du service"
                                  disabled={isReadOnly}
                                />
                                <div className="flex gap-2">
                                  <input
                                    value={service.price}
                                    onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'price', e.target.value)}
                                    className="bg-gray-100 px-2 py-1 rounded text-sm w-20"
                                    placeholder="Prix (€)"
                                    disabled={isReadOnly}
                                  />
                                  <input
                                    value={service.duration || ''}
                                    onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'duration', e.target.value)}
                                    className="bg-gray-100 px-2 py-1 rounded text-sm w-20"
                                    placeholder="Durée (min)"
                                    type="number"
                                    min="1"
                                    disabled={isReadOnly}
                                  />
                                </div>
                              </div>
                              <textarea
                                value={service.description}
                                onChange={e => handleServiceChange(categoryIdx, serviceIdx, 'description', e.target.value)}
                                className="bg-gray-100 px-2 py-1 rounded w-full mb-2"
                                placeholder="Description du service"
                                disabled={isReadOnly}
                              />
                              <div className="flex flex-wrap gap-2">
                                {service.duration && (
                                  <span className="text-xs rounded-full bg-green-100 text-green-800 px-2 py-1">
                                    ⏱️ {service.duration} min
                                  </span>
                                )}
                                {service.price && (
                                  <span className="text-xs rounded-full bg-blue-100 text-blue-800 px-2 py-1">
                                    💰 {service.price}€
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
              </>
            )}
          </div>
        )}
        {/* DEBUG: afficher toutes les colonnes du row `specificSalon` pour vérification */}
  {(specificSalon && !isTemplateView) || ((typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1') || process.env.NODE_ENV === 'development') && (
          <div className="bg-white/95 border border-gray-200 rounded-xl p-4 mt-4">
            <h3 className="text-sm font-semibold mb-2">Données brutes du salon (toutes les colonnes)</h3>
            {!specificSalon && <div className="text-xs text-gray-500">Aucune donnée publique chargée.</div>}
            {specificSalon && (
              <div className="max-h-72 overflow-auto text-xs font-mono bg-gray-50 p-2 rounded">
                {Object.entries(specificSalon).map(([k, v]) => (
                  <div key={k} className="py-1 border-b last:border-b-0 border-gray-100">
                    <div className="text-gray-700 font-medium">{k}</div>
                    <div className="text-gray-600 mt-1">{(() => {
                      try {
                        return typeof v === 'string' && v.length > 500 ? v.slice(0, 500) + '... (truncated)' : JSON.stringify(v, null, 2);
                      } catch (e) {
                        return String(v);
                      }
                    })()}</div>
                  </div>
                ))}
              </div>
            )}
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
                          disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                          disabled={isReadOnly}
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
            
            {isEditing && (
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-4 mb-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Ajouter une image</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((imageUrl, idx) => (
                <div key={idx} className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={imageUrl}
                    alt={`Galerie ${idx + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'infos' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* À propos */}
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  À propos
                </h3>
                {isEditing ? (
                  <div className="space-y-4 flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description du salon</label>
                    <textarea
                      value={infoData.description || ''}
                      onChange={(e) => handleInfoChange('description', e.target.value)}
                      className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={6}
                      placeholder="Décrivez votre salon, votre équipe, vos spécialités..."
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {infoData.description || 'Aucune description.'}
                    </p>
                  </div>
                )}
              </div>
              {/* Réseaux Sociaux */}
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                  Réseaux Sociaux
                </h3>
                {isEditing ? (
                  <div className="space-y-4 flex-1">
                    {/* Facebook */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={infoData.facebook || ''}
                        onChange={(e) => handleInfoChange('facebook', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://www.facebook.com/votre-salon"
                      />
                    </div>
                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.946 1.404-5.946s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.74-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={infoData.instagram || ''}
                        onChange={(e) => handleInfoChange('instagram', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        placeholder="https://www.instagram.com/votre-salon"
                      />
                    </div>
                    {/* TikTok */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        TikTok
                      </label>
                      <input
                        type="url"
                        value={infoData.tiktok || ''}
                        onChange={(e) => handleInfoChange('tiktok', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
                        placeholder="https://www.tiktok.com/@votre-salon"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 flex-1">
                    {infoData.facebook && (
                      <a
                        href={infoData.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                      </a>
                    )}
                    {infoData.instagram && (
                      <a
                        href={infoData.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.946 1.404-5.946s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.74-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {infoData.tiktok && (
                      <a
                        href={infoData.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        <span>TikTok</span>
                      </a>
                    )}
                    {!infoData.facebook && !infoData.instagram && !infoData.tiktok && (
                      <p className="text-gray-500 text-sm">Aucun réseau social configuré</p>
                    )}
                  </div>
                )}
              </div>
              {/* Horaires d'ouverture */}
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  Horaires d'ouverture
                </h3>
                {isEditing ? (
                  <div className="space-y-3 flex-1">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour, index) => (
                      <div key={jour} className="flex items-center space-x-3">
                        <label className="w-20 text-sm font-medium text-gray-700">{jour}</label>
                        <input
                          type="text"
                          // guard optional: index signature or fallback
                          value={
                            (infoData as any)[`horaires_${jour.toLowerCase()}`] || ''
                          }
                          onChange={(e) => handleInfoChange(`horaires_${jour.toLowerCase()}`, e.target.value)}
                          className="flex-1 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="9h00 - 18h00 ou Fermé"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden flex-1">
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour) => (
                          <tr key={jour} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 pr-6 text-sm font-medium text-gray-700 w-24">{jour}</td>
                            <td className="py-3 text-sm text-gray-600">
                              {/* guard optional: index signature or fallback */}
                              {(infoData as any)[`horaires_${jour.toLowerCase()}`] || 'Non défini'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Contact (Téléphone, Email, Adresse) */}
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Contact
                </h3>
                {isEditing ? (
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="text"
                        value={infoData.telephone}
                        onChange={(e) => handleInfoChange('telephone', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={infoData.email}
                        onChange={(e) => handleInfoChange('email', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Adresse email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                      <textarea
                        value={infoData.adresse}
                        onChange={(e) => handleInfoChange('adresse', e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="Adresse complète du salon"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900">{infoData.telephone || 'Non défini'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-gray-900">{infoData.email || 'Non défini'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Adresse</p>
                        <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                          {infoData.adresse || 'Non définie'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                    {/* guard optional: review.photos */}
                    {Array.isArray(review.photos) && review.photos.map((photo: string, pidx: number) => (
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

      {/* Modal pour affichage d'image en grand */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] m-4">
            <img
              src={selectedImage}
              alt="Image en grand"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}