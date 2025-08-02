import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function SalonSearchComplete() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("barbier");
  const [locationQuery, setLocationQuery] = useState("Paris");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  // Récupérer les salons depuis l'API avec couleurs et images
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

  // Utiliser uniquement les vrais salons depuis l'API PostgreSQL avec couleurs personnalisées
  const salons = salonsData?.salons || [];

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
        
        {/* Bouton retour en haut à gauche - position exacte */}
        <button
          onClick={() => setLocation('/')}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

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

            {/* Bouton Search - plus compact */}
            <button
              onClick={() => {
                // Déclencher la recherche avec les paramètres actuels
                setSearchQuery(searchQuery || "salon");
              }}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors mb-6"
            >
              Search
            </button>

            {/* Texte séparateur */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">or browse categories</p>
            </div>
          
            {/* Catégories - exactement comme screenshot en bas */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setActiveFilter("coiffure");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Coiffure
              </button>
              <button
                onClick={() => {
                  setActiveFilter("esthetique");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Esthétique
              </button>
              <button
                onClick={() => {
                  setActiveFilter("barbier");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Barbier
              </button>
              <button
                onClick={() => {
                  setActiveFilter("ongles");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Manucure
              </button>
              <button
                onClick={() => {
                  setActiveFilter("massage");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Massage
              </button>
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Tous
              </button>
            </div>

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
            
            {!isLoading && salons.map((salon: any) => (
              <div 
                key={salon.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  // Rediriger vers la page dynamique du salon avec son ID
                  console.log('🔗 Redirection vers salon:', salon.id, salon.name);
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
                  <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30">
                    <Heart className="h-4 w-4 text-white" />
                  </button>
                  
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
                    <button 
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-colors text-white"
                      style={{
                        backgroundColor: salon.customColors?.primary || '#8B5CF6',
                        borderColor: salon.customColors?.primary || '#8B5CF6'
                      }}
                      onMouseEnter={(e) => {
                        const primary = salon.customColors?.primary || '#8B5CF6';
                        // Assombrir la couleur au hover
                        const darkerColor = primary.replace('#', '').match(/.{2}/g)
                          ?.map((hex: string) => Math.max(0, parseInt(hex, 16) - 30).toString(16).padStart(2, '0'))
                          .join('');
                        e.currentTarget.style.backgroundColor = '#' + (darkerColor || '7C3AED');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = salon.customColors?.primary || '#8B5CF6';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation('/salon-booking');
                      }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}