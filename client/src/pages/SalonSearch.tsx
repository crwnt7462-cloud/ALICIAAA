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
  Navigation,
  Sparkles
} from "lucide-react";

export default function SalonSearch() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Paris");
  const [activeFilter, setActiveFilter] = useState("all");

  // Récupérer les paramètres de l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    const location = urlParams.get('location');
    
    if (q) setSearchQuery(q);
    if (location) setLocationQuery(location);
  }, []);

  const salons = [
    {
      id: "salon-1",
      name: "Salon Excellence Paris",
      location: "Champs-Élysées, Paris 8ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "15:30",
      price: "€€€",
      services: ["Coupe", "Coloration"],
      verified: true,
      distance: "800m",
      category: "coiffure",
      image: "💇‍♀️"
    },
    {
      id: "salon-2", 
      name: "Institut Beauté Marais",
      location: "Le Marais, Paris 4ème",
      rating: 4.8,
      reviews: 198,
      nextSlot: "16:00", 
      price: "€€",
      services: ["Soins visage", "Épilation"],
      verified: true,
      distance: "1.2km",
      category: "esthetique",
      image: "✨"
    },
    {
      id: "salon-3",
      name: "Spa Wellness",
      location: "Saint-Germain, Paris 6ème",
      rating: 4.7,
      reviews: 156,
      nextSlot: "17:00",
      price: "€€€€",
      services: ["Massage", "Hammam"],
      verified: true,
      distance: "2.1km",
      category: "massage",
      image: "🧘‍♀️"
    },
    {
      id: "salon-4",
      name: "Nail Art Studio",
      location: "Opéra, Paris 9ème",
      rating: 4.6,
      reviews: 89,
      nextSlot: "14:45",
      price: "€€",
      services: ["Manucure", "Pose gel"],
      verified: true,
      distance: "1.8km", 
      category: "onglerie",
      image: "💅"
    }
  ];

  const categories = [
    { id: "all", name: "Tout", count: salons.length },
    { id: "coiffure", name: "Coiffure", count: 1 },
    { id: "esthetique", name: "Esthétique", count: 1 },
    { id: "massage", name: "Massage", count: 1 },
    { id: "onglerie", name: "Onglerie", count: 1 }
  ];

  const handleSearch = () => {
    console.log("Recherche:", searchQuery, locationQuery);
  };

  const filteredSalons = activeFilter === "all" 
    ? salons 
    : salons.filter(salon => salon.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Header ultra-minimaliste */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-9 w-9 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900">Recherche</h1>
            <Button
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Barre de recherche centrée */}
        <div className="py-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Que recherchez-vous ?"
              className="h-12 pl-12 pr-4 border-gray-200 focus:border-violet-500 focus:ring-0 bg-gray-50 rounded-xl text-base"
            />
          </div>
          
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Où ?"
              className="h-12 pl-12 pr-4 border-gray-200 focus:border-violet-500 focus:ring-0 bg-gray-50 rounded-xl text-base"
            />
          </div>
        </div>

        {/* Catégories horizontales */}
        <div className="flex gap-2 pb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category.id
                  ? 'bg-violet-100 text-violet-700 border border-violet-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Résultats épurés */}
        <div className="space-y-3 pb-20">
          {filteredSalons.map((salon) => (
            <Card 
              key={salon.id} 
              className="border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer bg-white rounded-2xl overflow-hidden"
              onClick={() => setLocation(`/salon/${salon.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image/Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">
                      {salon.image}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {salon.name}
                          </h3>
                          {salon.verified && (
                            <CheckCircle2 className="h-4 w-4 text-violet-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{salon.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-amber-400 fill-current" />
                        <span className="font-medium text-gray-900">{salon.rating}</span>
                        <span className="text-gray-400">({salon.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{salon.nextSlot}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{salon.price}</span>
                        <span className="text-sm text-gray-500">• {salon.distance}</span>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation('/booking');
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium h-8"
                      >
                        Réserver
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredSalons.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-500">
              Essayez avec d'autres mots-clés ou une autre localisation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}