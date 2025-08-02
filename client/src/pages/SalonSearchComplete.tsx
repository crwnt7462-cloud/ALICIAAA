import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal,
  Filter,
  Heart
} from "lucide-react";
import rendlyLogo from "@assets/3_1753714421825.png";

// Fonction pour obtenir la classe de couleur spécifique à chaque salon
const getSalonButtonClass = (salonId: string) => {
  const salonColors = {
    'salon-excellence-paris': 'glass-button-pink',
    'salon-moderne-republique': 'glass-button-indigo', 
    'barbier-gentleman-marais': 'glass-button-amber',
    'institut-beaute-saint-germain': 'glass-button-rose',
    'nail-art-opera': 'glass-button-rose',
    'spa-wellness-bastille': 'glass-button-emerald',
    'beauty-lounge-montparnasse': 'glass-button-indigo'
  };
  return salonColors[salonId] || 'glass-button-neutral';
};

// Fonction pour obtenir la classe de carte glassmorphism spécifique à chaque salon
const getSalonGlassCard = (salonId: string) => {
  const salonCardColors = {
    'salon-excellence-paris': 'glass-card-pink',
    'salon-moderne-republique': 'glass-card-indigo', 
    'barbier-gentleman-marais': 'glass-card-amber',
    'institut-beaute-saint-germain': 'glass-card-rose',
    'nail-art-opera': 'glass-card-rose',
    'spa-wellness-bastille': 'glass-card-emerald',
    'beauty-lounge-montparnasse': 'glass-card-indigo'
  };
  return salonCardColors[salonId] || 'glass-card-neutral';
};

export default function SalonSearchComplete() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("barbier");
  const [locationQuery, setLocationQuery] = useState("Paris");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  // Récupérer les salons depuis l'API
  const { data: salonsData, isLoading } = useQuery({
    queryKey: ['/api/search/salons', activeFilter, locationQuery, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeFilter !== 'all') params.append('category', activeFilter);
      if (locationQuery) params.append('city', locationQuery.toLowerCase());
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/search/salons?${params}`);
      if (!response.ok) throw new Error('Failed to fetch salons');
      return response.json();
    }
  });

  const salons = salonsData?.salons || [];

  // Données statiques de fallback si l'API ne répond pas
  const fallbackSalons = [
    {
      id: "salon-1",
      name: "Barbier Moderne",
      location: "République, Paris 11ème",
      rating: 4.8,
      reviews: 156,
      nextSlot: "11:30",
      price: "€€",
      services: ["Coupe homme", "Barbe", "Shampoing"],
      verified: true,
      distance: "0.8km",
      category: "coiffure",
      photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
      openNow: true,
      promotion: "-20% première visite"
    },
    {
      id: "salon-2",
      name: "Salon Excellence",
      location: "Marais, Paris 4ème",
      rating: 4.9,
      reviews: 298,
      nextSlot: "14:15",
      price: "€€€",
      services: ["Coupe", "Coloration", "Brushing"],
      verified: true,
      distance: "1.2km",
      category: "coiffure",
      photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      openNow: true,
      promotion: null
    },
    {
      id: "salon-3",
      name: "Beauty Institute",
      location: "Saint-Germain, Paris 6ème",
      rating: 4.7,
      reviews: 187,
      nextSlot: "16:00",
      price: "€€",
      services: ["Soins visage", "Épilation", "Massage"],
      verified: true,
      distance: "1.5km",
      category: "esthetique",
      photo: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
      openNow: false,
      promotion: "Nouveau client -15%"
    },
    {
      id: "salon-4",
      name: "Nail Art Studio",
      location: "Opéra, Paris 9ème",
      rating: 4.6,
      reviews: 89,
      nextSlot: "15:30",
      price: "€€",
      services: ["Manucure", "Pose gel", "Nail art"],
      verified: true,
      distance: "2.1km",
      category: "onglerie",
      photo: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      openNow: true,
      promotion: "3ème séance offerte"
    }
  ];

  const categories = [
    { id: "all", name: "Tous", count: salons.length },
    { id: "coiffure", name: "Coiffure", count: 2 },
    { id: "esthetique", name: "Esthétique", count: 1 },
    { id: "onglerie", name: "Onglerie", count: 1 }
  ];

  const filteredSalons = activeFilter === "all" 
    ? salons 
    : salons.filter((salon: any) => salon.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Layout exactement comme le screenshot - mobile-first */}
      <div className="relative">
        
        {/* Bouton retour glassmorphism - position exacte */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLocation('/')}
          className="absolute left-4 top-4 z-10 glass-button-secondary w-10 h-10 rounded-2xl flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        {/* Container principal - plus compact */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo Rendly - plus gros et plus proche */}
            <div className="text-center mb-6">
              <img src={rendlyLogo} alt="Rendly" className="h-28 w-auto mx-auto" />
            </div>

            {/* Titre - moins d'espace */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-500 font-normal">Find your salon</h2>
            </div>
          
            {/* Champs de recherche - plus compact */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="barbier"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Paris"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Bouton Glassmorphism - Rechercher un salon */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Déclencher la recherche avec les paramètres actuels
                setSearchQuery(searchQuery || "salon");
              }}
              className="relative w-full h-16 rounded-3xl overflow-hidden group mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center h-full text-white font-semibold text-lg">
                <Search className="w-5 h-5 mr-3" />
                Rechercher un salon
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.button>

            {/* Texte séparateur */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">or browse categories</p>
            </div>
          
            {/* Catégories avec animations - navigation moderne */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { filter: "coiffure", label: "Coiffure", delay: 0.1 },
                { filter: "esthetique", label: "Esthétique", delay: 0.2 },
                { filter: "barbier", label: "Barbier", delay: 0.3 },
                { filter: "ongles", label: "Manucure", delay: 0.4 },
                { filter: "massage", label: "Massage", delay: 0.5 },
                { filter: "all", label: "Tous", delay: 0.6 }
              ].map((category) => (
                <motion.button
                  key={category.filter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: category.delay,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#f3f4f6",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    backgroundColor: "#e5e7eb"
                  }}
                  onClick={() => {
                    setActiveFilter(category.filter);
                    setSearchQuery("");
                  }}
                  className={`h-12 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === category.filter 
                      ? "glass-button-pink" 
                      : "glass-button-secondary"
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>

          </div>
        </div>
      </div>



      {/* Section résultats avec cartes salons - visible en scrollant */}
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="px-4">
          {/* Header des résultats */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {salons.length} salons trouvés
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trier</span>
              <select className="text-sm border-0 bg-transparent text-gray-700 font-medium">
                <option>Distance</option>
                <option>Note</option>
                <option>Prix</option>
              </select>
            </div>
          </div>

          {/* Cartes des salons avec photos - exactement comme screenshot */}
          <div className="space-y-4 pb-6">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Recherche en cours...</p>
              </div>
            )}
            
            {!isLoading && salons.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun salon trouvé pour votre recherche</p>
              </div>
            )}
            
            {!isLoading && salons.map((salon: any, index: number) => (
              <motion.div 
                key={salon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={`${getSalonGlassCard(salon.id)} rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300`}
                onClick={() => {
                  console.log('🔗 CLIC SALON - Redirection vers:', `/salon/${salon.id}`, 'Nom:', salon.name);
                  setLocation(`/salon/${salon.id}`);
                }}
              >
                {/* Photo du salon en haut */}
                <div className="relative h-48 bg-gradient-to-br from-violet-400 to-purple-500">
                  {salon.photo && (
                    <img 
                      src={salon.coverImageUrl || salon.photo} 
                      alt={salon.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  
                  {/* Badges sur la photo */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {salon.verified && (
                      <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Vérifié
                      </span>
                    )}
                    {salon.openNow && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Ouvert
                      </span>
                    )}
                  </div>
                  
                  {/* Bouton favoris */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-3 right-3 ${getSalonButtonClass(salon.id)} w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <Heart className="h-4 w-4 text-black" />
                  </motion.button>
                  
                  {/* Promotion en bas de l'image */}
                  {salon.promotion && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {salon.promotion}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Informations du salon */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{salon.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{salon.location}</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{salon.price}</span>
                  </div>
                  
                  {/* Note et distance */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{salon.rating}</span>
                      <span className="text-sm text-gray-500">({salon.reviews} avis)</span>
                    </div>
                    <span className="text-sm text-gray-500">• {salon.distance}</span>
                  </div>
                  
                  {/* Services */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {salon.services.slice(0, 3).map((service: any, index: number) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                  
                  {/* Disponibilité et bouton réserver */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-green-600 font-medium">
                        Dispo {salon.nextSlot}
                      </span>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${getSalonButtonClass(salon.id)} px-4 py-2 rounded-xl text-sm font-medium`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation('/salon-booking');
                      }}
                    >
                      Réserver
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}