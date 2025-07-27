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
    </div>
  );
}