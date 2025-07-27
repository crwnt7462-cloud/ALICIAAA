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
  Filter, 
  ArrowLeft,
  CheckCircle2 
} from "lucide-react";

export default function SalonSearch() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

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
      id: "salon-excellence",
      name: "Salon Excellence Paris",
      location: "Paris 16ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "Aujourd'hui 15h",
      services: ["Coiffure", "Coloration"],
      verified: true,
      distance: "0.8 km"
    },
    {
      id: "salon-2", 
      name: "Institut Prestige",
      location: "Lyon Centre",
      rating: 4.8,
      reviews: 198,
      nextSlot: "Demain 9h30",
      services: ["Soins visage", "Épilation"],
      verified: true,
      distance: "1.2 km"
    },
    {
      id: "salon-3",
      name: "Spa Wellness",
      location: "Marseille",
      rating: 4.7,
      reviews: 156,
      nextSlot: "Aujourd'hui 17h",
      services: ["Massage", "Relaxation"],
      verified: true,
      distance: "2.1 km"
    }
  ];

  const handleSearch = () => {
    console.log("Recherche:", searchQuery, locationQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      {/* Header moderne */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full hover:bg-violet-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Trouvez votre salon
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Les meilleurs professionnels de la beauté près de chez vous
              </p>
            </div>
          </div>

          {/* Barre de recherche améliorée */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Service recherché..."
                className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500 bg-white shadow-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="md:col-span-1 relative">
              <Input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Ville, quartier..."
                className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500 bg-white shadow-sm"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Filtres rapides */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" className="text-violet-600 border-violet-200 hover:bg-violet-50">
            <Filter className="h-3 w-3 mr-2" />
            Filtres
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-50">Coiffure</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-50">Esthétique</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-violet-50">Massage</Badge>
          </div>
        </div>

        {/* Résultats */}
        <div className="text-sm text-gray-600 mb-6 flex items-center justify-between">
          <span>{salons.length} salons trouvés{searchQuery && ` pour "${searchQuery}"`}</span>
          <span className="text-violet-600">Triés par pertinence</span>
        </div>

        <div className="space-y-3">
          {salons.map((salon) => (
            <Card 
              key={salon.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white rounded-2xl"
              onClick={() => setLocation(`/salon/${salon.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Image du salon compacte */}
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-violet-700 font-bold text-lg">
                      {salon.name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {salon.name}
                        </h3>
                        {salon.verified && (
                          <CheckCircle2 className="h-4 w-4 text-violet-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {salon.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({salon.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{salon.location}</span>
                      <span className="text-gray-400">•</span>
                      <span>{salon.distance}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {salon.services.slice(0, 2).map((service, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1"
                            >
                              {service}
                            </Badge>
                          ))}
                          {salon.services.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{salon.services.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>{salon.nextSlot}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation('/booking');
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-4 py-2 text-sm font-medium h-8"
                        size="sm"
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
      </div>
    </div>
  );
}