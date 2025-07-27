import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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

export default function SalonSearchComplete() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("barbier");
  const [locationQuery, setLocationQuery] = useState("Paris");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  const salons = [
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
    : salons.filter(salon => salon.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Layout exactement comme le screenshot - mobile-first */}
      <div className="relative">
        
        {/* Bouton retour en haut à gauche - position exacte */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Container principal - mêmes dimensions que screenshot */}
        <div className="px-6 pt-20 pb-8">
          <div className="max-w-sm mx-auto">
            
            {/* Logo "Design" violet - exactement comme image */}
            <div className="text-center mb-20">
              <h1 className="text-3xl font-bold text-violet-600">Design</h1>
            </div>

            {/* Titre - même position et style */}
            <div className="text-center mb-16">
              <h2 className="text-xl text-gray-500 font-normal">Find your salon</h2>
            </div>
          
            {/* Champs de recherche - exactement comme screenshot */}
            <div className="space-y-4 mb-8">
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

            {/* Bouton Search - exactement comme screenshot */}
            <button
              onClick={() => setActiveFilter("coiffure")}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors mb-8"
            >
              Search
            </button>

            {/* Texte séparateur */}
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm">or browse categories</p>
            </div>
          
            {/* Catégories - exactement comme screenshot en bas */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveFilter("coiffure")}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Coiffure
              </button>
              <button
                onClick={() => setActiveFilter("esthetique")}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Esthétique
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
              {filteredSalons.length} salons trouvés
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
            {filteredSalons.map((salon) => (
              <div 
                key={salon.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation(`/salon/${salon.id}`)}
              >
                {/* Photo du salon en haut */}
                <div className="relative h-48 bg-gradient-to-br from-violet-400 to-purple-500">
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
                    {salon.services.slice(0, 3).map((service, index) => (
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
                      className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation('/booking');
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