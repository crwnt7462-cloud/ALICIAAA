import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, Clock, ArrowLeft, 
  Sparkles, ChevronRight, Heart,
  SlidersHorizontal, TrendingUp, Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import avyentoLogo from "@assets/3_1753714421825.png";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // États pour l'effet typewriter sur les placeholders
  const [servicePlaceholder, setServicePlaceholder] = useState("");
  const [locationPlaceholder, setLocationPlaceholder] = useState("");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);
  const [serviceCharIndex, setServiceCharIndex] = useState(0);
  const [locationCharIndex, setLocationCharIndex] = useState(0);
  const [isServiceDeleting, setIsServiceDeleting] = useState(false);
  const [isLocationDeleting, setIsLocationDeleting] = useState(false);

  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  const services = [
    "Coiffure",
    "Massage", 
    "Manucure",
    "Esthétique",
    "Barbier",
    "Extensions",
    "Épilation",
    "Soins visage"
  ];
  
  const locations = [
    "Paris",
    "Lyon", 
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Strasbourg"
  ];

  // Extract search params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const location = urlParams.get('location') || '';
    setSearchQuery(query);
    setSearchLocation(location);
  }, []);

  // Animation pour les services (EXACTEMENT comme PublicLanding)
  useEffect(() => {
    const currentService = services[serviceIndex];
    if (!currentService) return;
    
    const typeSpeed = isServiceDeleting ? 60 : 120;
    const pauseTime = isServiceDeleting ? 600 : 2500;

    const timeout = setTimeout(() => {
      if (!isServiceDeleting && serviceCharIndex < currentService.length) {
        setServicePlaceholder(currentService.slice(0, serviceCharIndex + 1));
        setServiceCharIndex(serviceCharIndex + 1);
      } else if (isServiceDeleting && serviceCharIndex > 0) {
        setServicePlaceholder(currentService.slice(0, serviceCharIndex - 1));
        setServiceCharIndex(serviceCharIndex - 1);
      } else if (!isServiceDeleting && serviceCharIndex === currentService.length) {
        setTimeout(() => setIsServiceDeleting(true), pauseTime);
      } else if (isServiceDeleting && serviceCharIndex === 0) {
        setIsServiceDeleting(false);
        setServiceIndex((serviceIndex + 1) % services.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [servicePlaceholder, serviceCharIndex, serviceIndex, isServiceDeleting, services]);

  // Animation pour les villes (EXACTEMENT comme PublicLanding)
  useEffect(() => {
    const currentLocation = locations[locationIndex];
    if (!currentLocation) return;
    
    const typeSpeed = isLocationDeleting ? 50 : 100;
    const pauseTime = isLocationDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isLocationDeleting && locationCharIndex < currentLocation.length) {
        setLocationPlaceholder(currentLocation.slice(0, locationCharIndex + 1));
        setLocationCharIndex(locationCharIndex + 1);
      } else if (isLocationDeleting && locationCharIndex > 0) {
        setLocationPlaceholder(currentLocation.slice(0, locationCharIndex - 1));
        setLocationCharIndex(locationCharIndex - 1);
      } else if (!isLocationDeleting && locationCharIndex === currentLocation.length) {
        setTimeout(() => setIsLocationDeleting(true), pauseTime);
      } else if (isLocationDeleting && locationCharIndex === 0) {
        setIsLocationDeleting(false);
        setLocationIndex((locationIndex + 1) % locations.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [locationPlaceholder, locationCharIndex, locationIndex, isLocationDeleting, locations]);

  const categories = [
    { id: "all", name: "Tous", icon: Sparkles },
    { id: "coiffure", name: "Coiffure", icon: Sparkles },
    { id: "esthetique", name: "Esthétique", icon: Heart },
    { id: "massage", name: "Massage", icon: TrendingUp },
    { id: "onglerie", name: "Onglerie", icon: Award }
  ];

  // Recherche salons temps réel depuis l'API - SANS CACHE pour données fraîches
  const { data: apiResults, refetch: refetchSalons, isLoading } = useQuery({
    queryKey: ['/api/public/salons', searchQuery, searchLocation], // Clé stable
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('category', searchQuery.toLowerCase());
      if (searchLocation) params.set('city', searchLocation.toLowerCase());
      
      // Ajouter timestamp pour éviter cache navigateur
      const response = await fetch(`/api/public/salons?${params.toString()}&_t=${Date.now()}`, {
        cache: 'no-store', // Forcer pas de cache
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      console.log('📋 Données salons récupérées:', data.salons?.length || 0, 'salons');
      if (data.salons?.length > 0) {
        console.log('🔄 Mise à jour avec données serveur:', data.salons[0]);
      }
      return data.success ? data.salons : [];
    },
    refetchOnWindowFocus: true, // Refetch quand on revient sur la page
    refetchOnMount: true, // Refetch au montage du composant
    refetchInterval: 5000, // Refetch toutes les 5 secondes
    staleTime: 0, // Toujours considérer comme périmé
    gcTime: 0 // Pas de cache en mémoire
  });

  // 🔌 WebSocket pour synchronisation temps réel
  const { isConnected } = useWebSocket({
    onSalonUpdate: async (salonId: string, salonData: any) => {
      console.log('🔄 Mise à jour salon reçue via WebSocket:', salonId, salonData?.name);
      
      // Afficher notification de mise à jour
      setShowUpdateNotification(true);
      
      // FORCER le rafraîchissement immédiat sans cache
      queryClient.removeQueries({ queryKey: ['/api/public/salons'] }); // Supprimer tout cache
      
      // Refetch forcé avec nouvelles données
      await refetchSalons();
      
      console.log('✅ SearchResults mis à jour via WebSocket');
      
      // Masquer notification après 3 secondes
      setTimeout(() => setShowUpdateNotification(false), 3000);
    },
    onConnect: () => {
      console.log('✅ SearchResults connecté au WebSocket');
    },
    onDisconnect: () => {
      console.log('⚠️ SearchResults déconnecté du WebSocket');
    }
  });



  // Combiner les résultats API avec des salons de démo
  const demoSalons = [
    {
      id: "barbier-gentleman-marais",
      name: "Barbier Gentleman Marais",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop",
      location: "Le Marais, Paris 4ème",
      distance: "1.2 km",
      nextSlot: "Aujourd'hui 14h30",
      services: ["Coupe Classique", "Barbe & Moustache", "Soins Visage"],
      priceRange: "€€",
      category: "coiffure",
      verified: true,
      popular: true,
      route: "/salon/barbier-gentleman-marais"
    },
    {
      id: "beauty-lash-studio",
      name: "Beauty Lash Studio",
      rating: 4.9,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=200&fit=crop",
      location: "République, Paris 3ème",
      distance: "2.1 km",
      nextSlot: "Demain 10h00",
      services: ["Extensions Volume", "Lifting de Cils", "Épilation Sourcils"],
      priceRange: "€€€",
      category: "esthetique",
      verified: true,
      route: "/salon/beauty-lash-studio"
    },
    {
      id: "salon-excellence-paris",
      name: "Salon Excellence Paris",
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=300&h=200&fit=crop",
      location: "Champs-Élysées, Paris 8ème",
      distance: "3.2 km",
      nextSlot: "Aujourd'hui 16h00",
      services: ["Coupe Premium", "Coloration Expert", "Soin Restructurant"],
      priceRange: "€€€",
      category: "coiffure",
      popular: true,
      route: "/salon/salon-excellence-paris"
    },
    {
      id: "institut-beaute-saint-germain",
      name: "Institut Beauté Saint-Germain",
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
      location: "Saint-Germain, Paris 6ème",
      distance: "2.8 km",
      nextSlot: "Demain 15h30",
      services: ["Soins Visage", "Épilation", "Massage Relaxant"],
      priceRange: "€€€",
      category: "esthetique",
      route: "/salon/institut-beaute-saint-germain"
    },
    {
      id: "beauty-lounge-montparnasse",
      name: "Beauty Lounge Montparnasse",
      rating: 4.6,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop",
      location: "Montparnasse, Paris 14ème",
      distance: "4.1 km",
      nextSlot: "Aujourd'hui 18h00",
      services: ["Manucure", "Pédicure", "Nail Art"],
      priceRange: "€€",
      category: "onglerie",
      route: "/salon/beauty-lounge-montparnasse"
    },
    {
      id: "salon-moderne-republique",
      name: "Salon Moderne République",
      rating: 4.5,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop",
      location: "République, Paris 11ème",
      distance: "1.8 km",
      nextSlot: "Demain 11h00",
      services: ["Coupe Tendance", "Coloration", "Brushing"],
      priceRange: "€€",
      category: "coiffure",
      route: "/salon/salon-moderne-republique"
    },
    {
      id: "beauty-spa-marais",
      name: "Beauty Spa Le Marais",
      rating: 4.8,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=300&h=200&fit=crop",
      location: "Le Marais, Paris 4ème",
      distance: "2.1 km",
      nextSlot: "Aujourd'hui 16h30",
      services: ["Soin Visage", "Massage", "Gommage"],
      priceRange: "€€€",
      category: "esthetique",
      route: "/salon/beauty-spa-marais",
      verified: true,
      popular: true
    },
    {
      id: "barber-shop-bastille",
      name: "Barber Shop Bastille",
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop",
      location: "Bastille, Paris 11ème",
      distance: "1.5 km",
      nextSlot: "Demain 14h00",
      services: ["Coupe Barbe", "Rasage", "Soin Cheveux"],
      priceRange: "€",
      category: "barbier",
      route: "/salon/barber-shop-bastille",
      verified: true
    },
    {
      id: "nail-art-studio-chatelet",
      name: "Nail Art Studio Châtelet",
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop",
      location: "Châtelet, Paris 1er",
      distance: "0.8 km",
      nextSlot: "Aujourd'hui 18h00",
      services: ["Manucure", "Pédicure", "Nail Art"],
      priceRange: "€€",
      category: "onglerie",
      route: "/salon/nail-art-studio-chatelet",
      popular: true
    },
    {
      id: "coiffure-tendance-belleville",
      name: "Coiffure Tendance Belleville",
      rating: 4.3,
      reviews: 73,
      image: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=300&h=200&fit=crop",
      location: "Belleville, Paris 20ème",
      distance: "3.2 km",
      nextSlot: "Demain 10h30",
      services: ["Coupe", "Coloration", "Lissage"],
      priceRange: "€€",
      category: "coiffure",
      route: "/salon/coiffure-tendance-belleville"
    },
    {
      id: "institut-zen-opera",
      name: "Institut Zen Opéra",
      rating: 4.9,
      reviews: 201,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
      location: "Opéra, Paris 9ème",
      distance: "1.3 km",
      nextSlot: "Aujourd'hui 15h00",
      services: ["Massage Relaxant", "Soin Visage", "Réflexologie"],
      priceRange: "€€€",
      category: "esthetique",
      route: "/salon/institut-zen-opera",
      verified: true,
      popular: true
    },
    {
      id: "barbershop-vintage-montmartre",
      name: "Barbershop Vintage Montmartre",
      rating: 4.4,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&h=200&fit=crop",
      location: "Montmartre, Paris 18ème",
      distance: "2.7 km",
      nextSlot: "Demain 13h30",
      services: ["Coupe Vintage", "Rasage Traditionnel", "Barbe"],
      priceRange: "€€",
      category: "barbier",
      route: "/salon/barbershop-vintage-montmartre",
      verified: true
    },
    {
      id: "nails-express-chatelet",
      name: "Nails Express Châtelet",
      rating: 4.2,
      reviews: 118,
      image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=300&h=200&fit=crop",
      location: "Châtelet, Paris 1er",
      distance: "0.9 km",
      nextSlot: "Aujourd'hui 17h30",
      services: ["Manucure Express", "Gel Polish", "French"],
      priceRange: "€",
      category: "onglerie",
      route: "/salon/nails-express-chatelet"
    }
  ];

  // Combiner API et démo pour avoir plus de résultats
  const allResults = [...(apiResults || []), ...demoSalons];

  const filteredResults = selectedCategory === "all" 
    ? allResults 
    : allResults.filter(salon => salon.category === selectedCategory);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.history.pushState({}, '', `/search?${params.toString()}`);
  };

  const handleSalonClick = (salon: { route?: string; shareableUrl?: string; name?: string; id?: string }) => {
    const url = salon.shareableUrl || salon.route;
    console.log('🔗 Salon cliqué:', salon.name || salon.id, 'URL:', url);
    if (url) {
      setLocation(url);
    } else {
      console.error('❌ Aucune URL trouvée pour le salon:', salon);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600"
    >
      {/* Header avec retour - Style Avyento responsive */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center gap-3 lg:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-2 lg:p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
            
            {/* Logo desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <img src={avyentoLogo} alt="Avyento" className="h-10 w-auto" />
              <h1 className="text-xl font-bold text-white">Recherche</h1>
            </div>
            
            {/* Titre mobile */}
            <h1 className="text-lg font-semibold text-white lg:hidden">Recherche</h1>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs text-white/70 hidden sm:inline">
                {isConnected ? 'Temps réel' : 'Hors ligne'}
              </span>
            </div>
          </div>
          
          {/* Notification de mise à jour temps réel */}
          <AnimatePresence>
            {showUpdateNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-500 text-white text-xs px-3 py-1 rounded-full text-center"
              >
                ✨ Salon mis à jour en temps réel
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Logo Avyento - Mobile seulement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center py-1 lg:hidden"
        >
          <img 
            src={avyentoLogo} 
            alt="Avyento" 
            className="h-32 w-auto object-contain mx-auto"
          />
          <p className="text-white/80 text-sm mt-1 px-4">
            Toutes vos réservations beauté en un clic
          </p>
        </motion.div>

        {/* Hero section desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:block text-center py-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trouvez votre salon de beauté idéal
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez les meilleurs professionnels de la beauté près de chez vous et réservez en quelques clics
          </p>
        </motion.div>

        {/* Instructions pour le test de synchronisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 lg:p-6 text-center"
        >
          <p className="text-sm lg:text-base text-white font-medium">
            🚀 Test de synchronisation temps réel
          </p>
          <p className="text-xs lg:text-sm text-white/70 mt-1">
            Modifiez un salon dans l'éditeur et voyez les changements apparaître instantanément ici
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-white/70">
              WebSocket: {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4 justify-center">
            <Button
              onClick={() => setLocation('/salon-page-editor')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-4 lg:px-6 py-2 text-xs lg:text-sm transition-all duration-300 transform hover:scale-105"
            >
              ✏️ Ouvrir l'éditeur
            </Button>
            <Button
              onClick={() => refetchSalons()}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl px-4 lg:px-6 py-2 text-xs lg:text-sm transition-all duration-300"
            >
              🔄 Actualiser
            </Button>
          </div>
        </motion.div>

        {/* Barre de recherche glassmorphism responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 lg:space-y-6"
        >
          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl lg:rounded-3xl overflow-hidden border border-white/20">
            <CardContent className="p-4 lg:p-6 space-y-3 lg:space-y-4">
              {/* Version mobile (existante) */}
              <div className="lg:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder={servicePlaceholder + (servicePlaceholder ? '|' : '')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-0 bg-white/10 rounded-xl h-11 text-sm text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-300"
                  />
              </div>
              
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder={locationPlaceholder + (locationPlaceholder ? '|' : '')}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 border-0 bg-white/10 rounded-xl h-11 text-sm text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Version desktop */}
              <div className="hidden lg:flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    placeholder={servicePlaceholder + (servicePlaceholder ? '|' : '')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 border-0 bg-white/10 rounded-xl text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-300 text-base"
                  />
                </div>

                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    placeholder={locationPlaceholder + (locationPlaceholder ? '|' : '')}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-12 py-3 border-0 bg-white/10 rounded-xl text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-300 text-base"
                  />
                </div>

                <motion.button
                  onClick={handleSearch}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 transform shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5 mr-2 inline" />
                  Rechercher
                </motion.button>
              </div>

              {/* Bouton recherche mobile seulement */}
              <motion.button
                onClick={handleSearch}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="lg:hidden relative w-full h-11 rounded-xl overflow-hidden group font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
              >
                <div className="relative flex items-center justify-center h-full text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </div>
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtres par catégorie responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 lg:space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-white">Catégories</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {showFilters ? 'Masquer' : 'Plus'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 border border-white/20 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Résultats responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 lg:space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-white">
              {filteredResults.length} salon{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
            </h2>
          </div>

          {isLoading && (
            <div className="text-center py-8 lg:py-12">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-10 lg:w-10 border-b-2 border-amber-400 mx-auto"></div>
              <p className="text-white/70 mt-3 lg:mt-4">Recherche de salons...</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredResults.map((salon: any, index: number) => (
                <motion.div
                  key={salon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="border-0 shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl lg:rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/20 hover:border-white/30 hover:transform hover:scale-105"
                    onClick={() => handleSalonClick(salon)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={salon.image} 
                          alt={salon.name}
                          className="w-full h-32 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          {salon.verified && (
                            <Badge className="bg-green-500/90 text-white text-xs">
                              Vérifié
                            </Badge>
                          )}
                          {salon.popular && (
                            <Badge className="bg-orange-500/90 text-white text-xs">
                              Populaire
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <div className="flex items-center gap-1 text-white text-xs">
                              <Clock className="h-3 w-3" />
                              {salon.nextSlot}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 lg:p-5 space-y-3 lg:space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 
                              className="font-semibold text-white text-sm lg:text-base group-hover:transition-colors"
                              style={{
                                color: salon.customColors?.primary ? salon.customColors.primary : '#ffffff'
                              }}
                            >
                              {salon.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs lg:text-sm text-white/70 mt-1">
                              <MapPin className="h-3 w-3 lg:h-4 lg:w-4" />
                              {salon.location} • {salon.distance}
                            </div>
                          </div>
                          <ChevronRight 
                            className="h-4 w-4 lg:h-5 lg:w-5 text-white/60 group-hover:text-amber-400 transition-colors" 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400 fill-current" />
                            <span className="text-sm lg:text-base font-medium text-white">{salon.rating}</span>
                            <span className="text-xs lg:text-sm text-white/70">({salon.reviews} avis)</span>
                          </div>
                          <span 
                            className="text-sm lg:text-base font-medium text-amber-400"
                            style={{
                              color: salon.customColors?.priceColor || '#fbbf24'
                            }}
                          >
                            {salon.priceRange}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 lg:gap-2">
                          {salon.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs lg:text-sm bg-white/10 text-white/80 border-white/20 hover:bg-white/15"
                              style={{
                                backgroundColor: salon.customColors?.primary ? `${salon.customColors.primary}20` : 'rgba(255, 255, 255, 0.1)',
                                color: salon.customColors?.primary || 'rgba(255, 255, 255, 0.8)',
                                borderColor: salon.customColors?.primary ? `${salon.customColors.primary}40` : 'rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Message si aucun résultat */}
        {filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 gradient-bg rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun salon trouvé
            </h3>
            <p className="text-gray-600 text-sm">
              Essayez de modifier vos critères de recherche
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}