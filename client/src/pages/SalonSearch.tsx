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
      {/* Header ultra-minimaliste style IMG_1257 */}
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="max-w-sm mx-auto text-center">
          {/* Logo "Design" comme dans l'image */}
          <div className="mb-12">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="absolute left-4 top-16 h-8 w-8 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-violet-600">Design</span>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-xl text-gray-500 font-normal mb-12">
            Find your salon
          </h1>

          {/* Champs de recherche ultra-simples */}
          <div className="space-y-6">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Service"
                className="h-14 px-6 border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 rounded-xl text-base font-normal placeholder:text-gray-400"
              />
            </div>
            
            <div className="relative">
              <Input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location"
                className="h-14 px-6 border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 rounded-xl text-base font-normal placeholder:text-gray-400"
              />
            </div>

            {/* Bouton de recherche */}
            <Button 
              onClick={handleSearch}
              className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-semibold mt-8"
            >
              Search
            </Button>
          </div>

          {/* Séparateur */}
          <div className="my-10">
            <p className="text-gray-400 text-sm">or browse categories</p>
          </div>

          {/* Catégories style minimaliste */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {categories.slice(1).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`p-4 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === category.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats (si recherche effectuée) */}
      {(searchQuery || activeFilter !== "all") && (
        <div className="max-w-sm mx-auto px-6 pb-20">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Results
            </h2>
          </div>

          <div className="space-y-4">
            {filteredSalons.map((salon) => (
              <Card 
                key={salon.id} 
                className="border-0 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setLocation(`/salon/${salon.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-xl">{salon.image}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {salon.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {salon.location}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          {salon.rating}
                        </span>
                        <span>{salon.distance}</span>
                        <span className="text-green-600">{salon.nextSlot}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation('/booking');
                      }}
                      className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-1 text-xs font-medium h-7"
                    >
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}