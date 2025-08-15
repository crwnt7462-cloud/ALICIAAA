import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import avyentoLogo from "@assets/3_1753714421825.png";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [, setShowFilters] = useState(false);
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

  // Recherche salons temps réel depuis l'API
  const { data: apiResults } = useQuery({
    queryKey: ['/api/public/salons', searchQuery, searchLocation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('category', searchQuery.toLowerCase());
      if (searchLocation) params.set('city', searchLocation.toLowerCase());
      
      const response = await fetch(`/api/public/salons?${params.toString()}`);
      const data = await response.json();
      return data.success ? data.salons : [];
    },
    refetchOnWindowFocus: false
  });



  // Combiner les résultats API avec des salons de démo
  const allResults = apiResults || [
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
    }
  ];

  const filteredResults = selectedCategory === "all" 
    ? allResults 
    : allResults.filter(salon => salon.category === selectedCategory);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.history.pushState({}, '', `/search?${params.toString()}`);
  };

  const handleSalonClick = (salon: { route: string }) => {
    setLocation(salon.route);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30"
    >
      {/* Header avec retour */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-2 rounded-xl hover:bg-black/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Recherche</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Logo Avyento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center pt-2 pb-4"
        >
          <img 
            src={avyentoLogo} 
            alt="Avyento" 
            className="h-40 w-auto object-contain"
          />
        </motion.div>

        {/* Barre de recherche glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={servicePlaceholder + (servicePlaceholder ? '|' : '')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 bg-gray-50/50 rounded-xl h-11 text-sm focus:bg-white/70 transition-colors duration-200"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={locationPlaceholder + (locationPlaceholder ? '|' : '')}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 border-0 bg-gray-50/50 rounded-xl h-11 text-sm focus:bg-white/70 transition-colors duration-200"
                />
              </div>

              <motion.button
                onClick={handleSearch}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full h-11 rounded-2xl overflow-hidden group font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.4) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center h-full text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtres par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-xl hover:bg-black/5"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-gray-700 hover:bg-white/90 border border-gray-200/50'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredResults.length} salon{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
            </h2>
          </div>

          <div className="space-y-3">
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
                    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleSalonClick(salon)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={salon.image} 
                          alt={salon.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
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

                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-violet-600 transition-colors">
                              {salon.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <MapPin className="h-3 w-3" />
                              {salon.location} • {salon.distance}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{salon.rating}</span>
                            <span className="text-xs text-gray-600">({salon.reviews} avis)</span>
                          </div>
                          <span className="text-sm font-medium text-violet-600">{salon.priceRange}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {salon.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-violet-100 text-violet-800 text-xs">
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