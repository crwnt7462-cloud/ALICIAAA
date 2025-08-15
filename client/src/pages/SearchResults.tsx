import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, Clock, ArrowLeft, 
  Sparkles, ChevronRight, Heart, LogIn,
  SlidersHorizontal, TrendingUp, Award
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
                  value={searchQuery} 
                  placeholder="Soins visage" 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="icon">
                  <Search />
                </span>
              </div>
              
              <div className="field">
                <input 
                  value={searchLocation} 
                  placeholder="Paris, Lyon, Marseille..." 
                  onChange={(e) => setSearchLocation(e.target.value)}
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
          
        {/* Notification de mise à jour temps réel */}
        <AnimatePresence>
          {showUpdateNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="ios-card bg-green-50 border-green-200 text-green-800 text-sm px-4 py-2 rounded-xl text-center mb-6"
            >
              ✨ Salon mis à jour en temps réel
            </motion.div>
          )}
        </AnimatePresence>
        {/* Titre principal minimaliste */}
        <div className="text-center mb-8">
          <h1 className="heroSlash__title mb-4">
            Trouvez votre salon de beauté idéal
          </h1>
          <p className="heroSlash__subtitle max-w-2xl mx-auto">
            Découvrez les meilleurs professionnels de la beauté près de chez vous et réservez en quelques clics
          </p>
        </div>

        {/* Instructions pour le test de synchronisation - Style iOS */}
        <div className="ios-card p-6 text-center mb-8">
          <p className="text-gray-800 font-semibold mb-2">
            🚀 Test de synchronisation temps réel
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Modifiez un salon dans l'éditeur et voyez les changements apparaître instantanément ici
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">
              WebSocket: {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation('/salon-page-editor')}
              className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl"
            >
              ✏️ Ouvrir l'éditeur
            </Button>
            <Button
              onClick={() => refetchSalons()}
              className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl"
            >
              🔄 Actualiser
            </Button>
          </div>
        </div>



        {/* Filtres par catégorie style iOS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Catégories</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button text-black px-4 py-2 rounded-2xl font-semibold shadow-xl hover:shadow-2xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {showFilters ? 'Masquer' : 'Plus'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'glass-button bg-violet-100 text-violet-800 border-2 border-violet-300'
                      : 'glass-button text-black hover:bg-white/90'
                  }`}
                >
                  {category.name}
                </button>
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
    </div>
  );
}