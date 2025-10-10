import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, Clock, ArrowLeft, 
  LogIn, Zap, Waves, Crown, Flame, Orbit,
  CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import avyentoLogo from "@/assets/avyento-logo.png";

// Types optimisés
interface Salon {
  id: string;
  name: string;
  category: string;
  route?: string;
  shareableUrl?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  image?: string;
  location?: string;
  services?: string[];
  priceRange?: string;
  nextSlot?: string;
  verified?: boolean;
  reviewsCount?: number;
}

interface SearchParams {
  query?: string;
  location?: string;
}

// Constantes optimisées - Diversifiées pour tous les professionnels
const DEFAULT_CITIES = ["Paris", "Lyon", "Marseille", "Toulouse", "Bruxelles", "Genève", "Montréal", "Lausanne"];
const DEFAULT_SERVICES = ["Coiffure", "Massage", "Coaching", "Santé", "Consulting", "Esthétique", "Barbier", "Développement personnel"];

const CATEGORIES = [
  { id: "all", name: "Tous", icon: Orbit },
  { id: "beaute", name: "Salon de beauté", icon: Crown },
  { id: "bien-etre", name: "Bien-être", icon: Waves },
  { id: "cils", name: "Cils", icon: Zap },
  { id: "ongles", name: "Ongles", icon: Flame },
  { id: "tatouage", name: "Tatoueur", icon: CheckCircle },
  { id: "sport", name: "Coach sportif", icon: Star },
  { id: "sante", name: "Santé", icon: CheckCircle },
  { id: "consulting", name: "Consulting", icon: Star }
];

// Fonctions utilitaires optimisées et sécurisées
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '').substring(0, 100);
};

const validateInput = (input: string): boolean => {
  return input.length > 0 && input.length <= 100 && !/[<>]/g.test(input);
};

const safeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
};

const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const validateSearchParams = (params: SearchParams): SearchParams => {
  return {
    query: params.query ? sanitizeInput(params.query) : undefined,
    location: params.location ? sanitizeInput(params.location) : undefined
  };
};

// Hook personnalisé pour l'effet typewriter optimisé
function useTypewriterEffect(items: string[], speed: number = 100) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentItem = items[index];
    if (!currentItem) return;
    
    const typeSpeed = isDeleting ? speed / 2 : speed;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentItem.length) {
        setText(currentItem.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentItem.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentItem.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((index + 1) % items.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, charIndex, index, isDeleting, items, speed]);

  return text;
}

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Données dynamiques via API avec fallback optimisé
  const { data: cities = DEFAULT_CITIES } = useQuery({
    queryKey: ['/api/cities'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) throw new Error('Erreur API cities');
        const data = await response.json();
        return data.cities || DEFAULT_CITIES;
      } catch (error) {
        console.error('Erreur récupération villes:', error);
        return DEFAULT_CITIES;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  const { data: services = DEFAULT_SERVICES } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Erreur API services');
        const data = await response.json();
        return data.services || DEFAULT_SERVICES;
      } catch (error) {
        console.error('Erreur récupération services:', error);
        return DEFAULT_SERVICES;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Effets typewriter optimisés
  const cityText = useTypewriterEffect(cities, 100);
  const serviceText = useTypewriterEffect(services, 120);

  // Extract search params from URL avec validation optimisée
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawQuery = urlParams.get('q') || '';
      const rawLocation = urlParams.get('location') || '';
      
      const validatedParams = validateSearchParams({
        query: rawQuery,
        location: rawLocation
      });
      
      setSearchQuery(validatedParams.query || '');
      setSearchLocation(validatedParams.location || '');
    } catch (error) {
      console.error('Erreur parsing URL params:', error);
      setSearchQuery('');
      setSearchLocation('');
    }
  }, []);


  // Recherche salons temps réel depuis l'API - optimisée
  const { data: apiResults, refetch: refetchSalons, isLoading, error } = useQuery({
    queryKey: ['/api/public/salons', searchQuery, searchLocation],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('category', searchQuery.toLowerCase());
        if (searchLocation) params.set('city', searchLocation.toLowerCase());
        
        const response = await fetch(`/api/public/salons?${params.toString()}&_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📋 Données salons récupérées:', data.salons?.length || 0, 'salons');
        return data.success ? data.salons : [];
      } catch (error) {
        console.error('Erreur récupération salons:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000,
    staleTime: 0,
    gcTime: 0
  });

  // WebSocket pour synchronisation temps réel optimisée
  const { isConnected } = useWebSocket({
    onSalonUpdate: useCallback(async (salonId: string, salonData: any) => {
      console.log('🔄 Mise à jour salon reçue via WebSocket:', salonId, salonData?.name);
      
      setShowUpdateNotification(true);
      queryClient.removeQueries({ queryKey: ['/api/public/salons'] });
      await refetchSalons();
      
      console.log('✅ SearchResults mis à jour via WebSocket');
      setTimeout(() => setShowUpdateNotification(false), 3000);
    }, [queryClient, refetchSalons]),
    
    onConnect: useCallback(() => {
      console.log('✅ SearchResults connecté au WebSocket');
    }, []),
    
    onDisconnect: useCallback(() => {
      console.log('⚠️ SearchResults déconnecté du WebSocket');
    }, [])
  });

  // Utiliser seulement les données du backend
  const allResults = apiResults || [];

  const filteredResults = useMemo(() => {
    return selectedCategory === "all" 
      ? allResults 
      : allResults.filter((salon: Salon) => salon.category === selectedCategory);
  }, [allResults, selectedCategory]);

  const handleSearch = useCallback(() => {
    try {
      // Validation et sécurisation des paramètres
      if (!validateInput(serviceText) || !validateInput(cityText)) {
        console.warn('Paramètres de recherche invalides');
        return;
      }

      // Génération du token CSRF pour la sécurité
      const csrfToken = generateCSRFToken();
      try {
        sessionStorage.setItem('csrf-token', csrfToken);
      } catch (error) {
        console.warn('Impossible de stocker le token CSRF:', error);
      }

      const params = new URLSearchParams();
      if (searchQuery) params.set('q', sanitizeInput(searchQuery));
      if (searchLocation) params.set('location', sanitizeInput(searchLocation));
      
      // Navigation sécurisée
      const safeUrl = `/search?${params.toString()}`;
      window.history.pushState({}, '', safeUrl);
    } catch (error) {
      console.error('Erreur navigation recherche:', error);
    }
  }, [searchQuery, searchLocation, serviceText, cityText]);

  const handleSalonClick = useCallback((salon: Salon) => {
    try {
      const url = salon.shareableUrl || salon.route;
      console.log('🔗 Salon cliqué:', salon.name || salon.id, 'URL:', url);
      
      if (url) {
        // Validation et sécurisation de l'URL
        const safeUrlToUse = safeUrl(url);
        if (safeUrlToUse) {
          setLocation(safeUrlToUse);
        } else {
          console.warn('URL non sécurisée détectée:', url);
          // Fallback vers une page par défaut
          setLocation('/');
        }
      } else {
        console.error('❌ Aucune URL trouvée pour le salon:', salon);
        setLocation('/');
      }
    } catch (error) {
      console.error('Erreur navigation salon:', error);
      setLocation('/');
    }
  }, [setLocation]);

  // Composants optimisés
  const CategoryButton = useCallback(({ category, isSelected, onClick }: { 
    category: typeof CATEGORIES[0], 
    isSelected: boolean, 
    onClick: () => void 
  }) => {
              const IconComponent = category.icon;
              return (
                <motion.button
        onClick={onClick}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative p-6 rounded-3xl text-center transition-all duration-300 ${
          isSelected
                      ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 shadow-xl'
                      : 'glass-button hover:shadow-xl'
                  }`}
                  style={{
          background: isSelected 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05))'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
          border: isSelected 
                      ? '2px solid rgba(139, 92, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isSelected
                      ? 'bg-violet-100 text-violet-600 shadow-lg'
                      : 'bg-gray-50 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${
          isSelected
                      ? 'text-violet-800'
                      : 'text-gray-800 group-hover:text-violet-700'
                  }`}>
                    {category.name}
                  </span>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
                </motion.button>
              );
  }, []);

  const SalonCard = useCallback(({ salon, index }: { salon: Salon, index: number }) => (
                <motion.div
                  key={salon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
                >
                  <Card 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200/50 h-full flex flex-col hover:scale-105 active:scale-95"
                    onClick={() => handleSalonClick(salon)}
        role="button"
        tabIndex={0}
        aria-label={`Voir les détails de ${salon.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSalonClick(salon);
          }
        }}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Image du salon - Responsive et sécurisée */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={salon.image || '/placeholder-salon.jpg'}
              alt={`${salon.name} - ${salon.location}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-salon.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Badge disponibilité */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <div className="bg-emerald-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                <Clock className="h-3 w-3 inline mr-1" />
                <span className="hidden sm:inline">{salon.nextSlot}</span>
                <span className="sm:hidden">Dispo</span>
                          </div>
                        </div>

            {/* Badge vérifié */}
                            {salon.verified && (
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                <div className="bg-blue-500 text-white p-1 sm:p-1.5 rounded-full shadow-lg" title="Professionnel vérifié">
                  <CheckCircle className="h-3 w-3" />
          </div>
            </div>
          )}
      </div>

          {/* Contenu de la carte - Responsive */}
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="mb-2 sm:mb-3 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {salon.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{salon.location}</span>
              </p>
            </div>

            {/* Services - Responsive */}
            <div className="flex gap-1 flex-wrap mb-2 sm:mb-3">
              {salon.services?.slice(0, 2).map((service: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full truncate max-w-[100px]"
                  title={service}
                >
                  {service}
                </span>
              ))}
              {salon.services && salon.services.length > 2 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  +{salon.services.length - 2}
                </span>
              )}
                </div>

            {/* Rating et prix - Responsive */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-900 font-semibold text-xs sm:text-sm">
                    {salon.rating || '4.8'}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  ({salon.reviewsCount || '127'})
                </span>
                </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-gray-900">
                  {salon.priceRange || '€€'}
                </div>
              </div>
            </div>

            {/* Bouton Réserver - Responsive */}
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm py-2 sm:py-2.5"
              onClick={(e) => {
                e.stopPropagation();
                handleSalonClick(salon);
              }}
              aria-label={`Réserver avec ${salon.name}`}
            >
              Réserver
            </Button>
                </div>
        </CardContent>
      </Card>
    </motion.div>
  ), [handleSalonClick]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header de recherche moderne et responsive */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              </Button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={avyentoLogo}
                  alt="Avyento"
                  className="h-6 w-auto sm:h-8 cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => setLocation('/')}
                />
                <div className="hidden sm:block">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900">Recherche</h1>
                  <p className="text-xs text-gray-500">Trouvez votre professionnel idéal</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-600 hidden sm:inline">
                  {isConnected ? 'Temps réel' : 'Hors ligne'}
                </span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setLocation("/pro-login")}
                className="hidden sm:flex text-xs sm:text-sm px-3 py-1.5 rounded-lg border-gray-300 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden lg:inline">Pro</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de recherche principale - Responsive et sécurisée */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-200" />
                <input
                  type="text"
                  value={serviceText}
                  placeholder="Service recherché"
                  readOnly
                  className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                  aria-label="Service recherché"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-200" />
                <input
                  type="text"
                  value={cityText}
                  placeholder="Ville"
                  readOnly
                  className="w-full h-10 sm:h-12 pl-9 sm:pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                  aria-label="Ville"
                />
              </div>
                </div>
            
            <Button
              onClick={handleSearch}
              className="h-10 sm:h-12 px-6 sm:px-8 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
              aria-label="Lancer la recherche"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Rechercher</span>
              <span className="sm:hidden">Recherche</span>
            </Button>
          </div>
        </div>
                </div>

      {/* Filtres et catégories - Responsive et accessible */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    selectedCategory === category.id
                      ? 'bg-violet-600 text-white shadow-lg hover:bg-violet-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`Filtrer par ${category.name}`}
                  aria-pressed={selectedCategory === category.id}
                >
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {filteredResults.length} professionnel{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
              </div>
              {isLoading && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-violet-600">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-violet-500"></div>
                  Recherche en cours...
                </div>
              )}
            </div>
                </div>
              </div>
            </div>

      {/* Contenu principal - Résultats responsive et sécurisé */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8" role="main" aria-label="Résultats de recherche">
        {isLoading && (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Recherche de professionnels...</p>
            <div className="mt-4 text-xs text-gray-500">
              Recherche sécurisée en cours...
            </div>
          </div>
        )}

        {!isLoading && filteredResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResults.map((salon: Salon, index: number) => (
                <SalonCard key={salon.id} salon={salon} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredResults.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Aucun professionnel trouvé</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSearchLocation('');
                }}
                variant="outline"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base border-gray-300 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
              >
                Réinitialiser les filtres
              </Button>
              <Button
                onClick={() => setLocation('/')}
                variant="ghost"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}