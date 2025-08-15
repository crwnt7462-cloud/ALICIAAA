import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, Clock, ArrowLeft, 
  Sparkles, ChevronRight, Heart, LogIn,
  SlidersHorizontal, TrendingUp, Award, Scissors, Palette,
  Gem, Waves, Brush, Zap, ShieldCheck, Crown, Flame, Orbit
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  // États pour l'effet typewriter identique à PublicLanding
  const [cityText, setCityText] = useState("");
  const [cityIndex, setCityIndex] = useState(0);
  const [cityCharIndex, setCityCharIndex] = useState(0);
  const [isCityDeleting, setIsCityDeleting] = useState(false);

  const [serviceText, setServiceText] = useState("");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [serviceCharIndex, setServiceCharIndex] = useState(0);
  const [isServiceDeleting, setIsServiceDeleting] = useState(false);

  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  const frenchCities = [
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

  const beautyServices = [
    "Coiffure",
    "Massage", 
    "Manucure",
    "Esthétique",
    "Barbier",
    "Extensions",
    "Épilation",
    "Soins visage"
  ];

  // Extract search params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const location = urlParams.get('location') || '';
    setSearchQuery(query);
    setSearchLocation(location);
  }, []);

  // Animation pour les villes (identique à PublicLanding)
  useEffect(() => {
    const currentCity = frenchCities[cityIndex];
    if (!currentCity) return;
    
    const typeSpeed = isCityDeleting ? 50 : 100;
    const pauseTime = isCityDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isCityDeleting && cityCharIndex < currentCity.length) {
        setCityText(currentCity.slice(0, cityCharIndex + 1));
        setCityCharIndex(cityCharIndex + 1);
      } else if (isCityDeleting && cityCharIndex > 0) {
        setCityText(currentCity.slice(0, cityCharIndex - 1));
        setCityCharIndex(cityCharIndex - 1);
      } else if (!isCityDeleting && cityCharIndex === currentCity.length) {
        setTimeout(() => setIsCityDeleting(true), pauseTime);
      } else if (isCityDeleting && cityCharIndex === 0) {
        setIsCityDeleting(false);
        setCityIndex((cityIndex + 1) % frenchCities.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [cityText, cityCharIndex, cityIndex, isCityDeleting, frenchCities]);

  // Animation pour les services (identique à PublicLanding)
  useEffect(() => {
    const currentService = beautyServices[serviceIndex];
    if (!currentService) return;
    
    const typeSpeed = isServiceDeleting ? 60 : 120;
    const pauseTime = isServiceDeleting ? 600 : 2500;

    const timeout = setTimeout(() => {
      if (!isServiceDeleting && serviceCharIndex < currentService.length) {
        setServiceText(currentService.slice(0, serviceCharIndex + 1));
        setServiceCharIndex(serviceCharIndex + 1);
      } else if (isServiceDeleting && serviceCharIndex > 0) {
        setServiceText(currentService.slice(0, serviceCharIndex - 1));
        setServiceCharIndex(serviceCharIndex - 1);
      } else if (!isServiceDeleting && serviceCharIndex === currentService.length) {
        setTimeout(() => setIsServiceDeleting(true), pauseTime);
      } else if (isServiceDeleting && serviceCharIndex === 0) {
        setIsServiceDeleting(false);
        setServiceIndex((serviceIndex + 1) % beautyServices.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [serviceText, serviceCharIndex, serviceIndex, isServiceDeleting, beautyServices]);



  const categories = [
    { id: "all", name: "Tous", icon: Orbit },
    { id: "coiffure", name: "Coiffure", icon: Zap },
    { id: "esthetique", name: "Esthétique", icon: Crown },
    { id: "massage", name: "Massage", icon: Waves },
    { id: "onglerie", name: "Onglerie", icon: Flame }
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
    <div className="heroSlash">
      <div style={{ display: 'block' }}>
        {/* Header identique à PublicLanding */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center" style={{ gap: '2px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/')}
                  className="relative p-3 hover:bg-gray-100/80 rounded-xl transition-colors duration-200 mr-2"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>
                
                <div>
                  <img src={avyentoLogo} alt="Logo" className="h-24 w-auto" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-5">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-600 hidden sm:inline">
                    {isConnected ? 'Temps réel' : 'Hors ligne'}
                  </span>
                </div>
                <button 
                  className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hidden lg:flex"
                  onClick={() => setLocation("/client-login-modern")}
                >
                  <span className="hidden md:inline">Se connecter</span>
                  <span className="md:hidden">Connexion</span>
                </button>
                <button 
                  className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hidden lg:flex"
                  onClick={() => setLocation("/salon/demo-user")}
                >
                  Réserver
                </button>
                <button 
                  className="glass-button text-black p-3 rounded-2xl shadow-xl hover:shadow-2xl"
                  onClick={() => setLocation("/pro-login")}
                >
                  <LogIn className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Section héroïque identique à PublicLanding */}
        <div className="heroSlash__inner">
          <div className="heroSlash__left">
            <div className="heroSlash__badge">
              <span className="dot"></span>
              Test de synchronisation temps réel
            </div>
            
            <h1 className="heroSlash__title">
              Trouvez votre salon de <span className="light">beauté idéal</span>
            </h1>
            
            <p className="heroSlash__subtitle">
              Découvrez les meilleurs professionnels de la beauté près de chez vous et réservez en quelques clics
            </p>
            
            <div className="heroSlash__search heroSlash__search--double">
              <div className="field">
                <input 
                  value={serviceText} 
                  placeholder={serviceText || "Service"} 
                  readOnly
                  style={{ cursor: 'pointer' }}
                />
                <span className="icon">
                  <Search />
                </span>
              </div>
              
              <div className="field">
                <input 
                  value={cityText} 
                  placeholder={cityText || "Ville"} 
                  readOnly
                  style={{ cursor: 'pointer' }}
                />
                <span className="icon location">
                  <MapPin />
                </span>
              </div>
              
              <button onClick={handleSearch} className="heroSlash__cta">
                Rechercher
              </button>
            </div>
            
            <ul className="heroSlash__kpis">
              <li><strong>50 000+</strong><span>Rendez-vous / mois</span></li>
              <li><strong>2 500+</strong><span>Salons partenaires</span></li>
              <li><strong>4,9/5</strong><span>Satisfaction client</span></li>
              <li><strong>24h/24</strong><span>Réservation dispo</span></li>
            </ul>
          </div>
          
          <div className="heroSlash__right">
            <div className="heroPhone">
              <div className="heroPhone__screen">
                <div className="heroPhone__pill" />
              </div>
            </div>
          </div>
        </div>
          




        {/* Section catégories moderne glassmorphism */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="heroSlash__title text-2xl mb-3">
              Explorez par <span className="light">catégorie</span>
            </h2>
            <p className="heroSlash__subtitle text-sm max-w-lg mx-auto">
              Découvrez nos services spécialisés adaptés à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative p-6 rounded-3xl text-center transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 shadow-xl'
                      : 'glass-button hover:shadow-xl'
                  }`}
                  style={{
                    background: selectedCategory === category.id 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05))'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: selectedCategory === category.id 
                      ? '2px solid rgba(139, 92, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-violet-100 text-violet-600 shadow-lg'
                      : 'bg-gray-50 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? 'text-violet-800'
                      : 'text-gray-800 group-hover:text-violet-700'
                  }`}>
                    {category.name}
                  </span>
                  
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Résultats style iOS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredResults.length} salon{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
            </h2>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Recherche de salons...</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    className="ios-card overflow-hidden cursor-pointer group"
                    onClick={() => handleSalonClick(salon)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={salon.image} 
                          alt={salon.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        <div className="absolute bottom-3 left-3">
                          <div className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                            <Clock className="h-3 w-3" />
                            {salon.nextSlot}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-gray-900 text-base group-hover:transition-colors"
                              style={{
                                color: salon.customColors?.primary || '#1f2937'
                              }}
                            >
                              {salon.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4" />
                              {salon.location} • {salon.distance}
                            </div>
                          </div>
                          <ChevronRight 
                            className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-base font-semibold text-gray-900">{salon.rating}</span>
                            <span className="text-sm text-gray-600">({salon.reviews} avis)</span>
                          </div>
                          <span 
                            className="text-base font-bold"
                            style={{
                              color: salon.customColors?.priceColor || '#8b5cf6'
                            }}
                          >
                            {salon.priceRange}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {salon.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge 
                              key={idx} 
                              className="glass-button text-xs font-medium"
                              style={{
                                backgroundColor: salon.customColors?.primary ? `${salon.customColors.primary}15` : '#f3f4f6',
                                color: salon.customColors?.primary || '#6b7280',
                                borderColor: salon.customColors?.primary ? `${salon.customColors.primary}30` : '#e5e7eb'
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

          {/* Message si aucun résultat */}
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <div className="ios-card w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun salon trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La plateforme IA qui révolutionne la beauté et optimise vos revenus.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Coiffure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Esthétique
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Manucure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Massage
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/centre-aide')}
                >
                  Centre d'aide
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/contact')}
                >
                  Contact
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/cgu')}
                >
                  CGU
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/confidentialite')}
                >
                  Confidentialité
                </div>
              </div>
            </div>

          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Avyento. Tous droits réservés.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.017 6.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM12.017 0A10 10 0 0022 10.017c0 5.522-4.478 9.983-10 9.983S2 15.539 2 10.017C2 4.495 6.478.017 12.017.017zm0 18.7a8.683 8.683 0 100-17.366 8.683 8.683 0 000 17.366z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}