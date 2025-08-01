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
import rendlyLogo from "@assets/3_1753714421825.png";

export default function SalonSearch() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("barbier");
  const [locationQuery, setLocationQuery] = useState("Paris");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showResults, setShowResults] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  
  // Page complète avec interface de recherche et résultats

  // Récupérer les paramètres de l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    const location = urlParams.get('location');
    
    if (q) setSearchQuery(q);
    if (location) setLocationQuery(location);
    if (q || location) setShowResults(true);
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
    setShowResults(true);
  };

  const filteredSalons = activeFilter === "all" 
    ? salons 
    : salons.filter(salon => salon.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Layout ultra-minimaliste selon screenshot IMG_1258 */}
      <div className="relative">
        
        {/* Bouton retour en haut à gauche */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Container principal centré */}
        <div className="px-6 pt-20 pb-8">
          <div className="max-w-sm mx-auto">
            
            {/* Logo Rendly centré */}
            <div className="text-center mb-8">
              <img src={rendlyLogo} alt="Rendly" className="h-28 w-auto mx-auto" />
            </div>

            {/* Titre en gris */}
            <div className="text-center mb-16">
              <h2 className="text-xl text-gray-500 font-normal">Find your salon</h2>
            </div>

            {/* Champs de recherche */}
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

            {/* Bouton Search violet */}
            <button
              onClick={handleSearch}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium transition-colors"
            >
              Search
            </button>

            {/* Texte "or browse categories" */}
            <div className="text-center my-8">
              <p className="text-gray-400 text-sm">or browse categories</p>
            </div>

            {/* Catégories en bas selon screenshot */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setActiveFilter("coiffure");
                  handleSearch();
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Coiffure
              </button>
              <button
                onClick={() => {
                  setActiveFilter("esthetique");
                  handleSearch();
                }}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Esthétique
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Résultats de recherche */}
      {(searchQuery || activeFilter !== "all") && filteredSalons.length > 0 && (
        <div className="bg-gray-50 min-h-screen pt-8">
          <div className="max-w-sm mx-auto px-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 text-center">
              Available salons
            </h2>

            <div className="space-y-3 pb-20">
              {filteredSalons.map((salon) => (
                <Card 
                  key={salon.id} 
                  className="border-0 bg-white rounded-2xl cursor-pointer hover:shadow-sm transition-all"
                  onClick={() => setLocation(`/salon/${salon.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <span className="text-lg">{salon.image}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 mb-1 truncate">
                          {salon.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">
                          {salon.location}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-current" />
                            {salon.rating}
                          </span>
                          <span>{salon.distance}</span>
                          <span className="text-green-600 font-medium">{salon.nextSlot}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation('/salon-booking');
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-3 py-1.5 text-xs font-medium"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {(searchQuery || activeFilter !== "all") && filteredSalons.length === 0 && (
        <div className="bg-gray-50 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No salons found</p>
            <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
          </div>
        </div>
      )}
    </div>
  );
}