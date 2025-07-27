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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Sélectionnez un salon
            </h1>
          </div>

          {/* Barre de recherche */}
          <div className="text-sm text-gray-600 mb-4">
            Les meilleurs salons et instituts aux alentours de Paris - Réservation en ligne
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que cherchez-vous ?"
                className="h-12 pl-4 pr-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1 relative">
              <Input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Adresse, ville..."
                className="h-12 pl-4 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 px-6 bg-gray-900 hover:bg-gray-800"
            >
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Résultats */}
        <div className="text-sm text-gray-600 mb-4">
          {salons.length} résultats trouvés{searchQuery && ` pour "${searchQuery}"`}
        </div>

        <div className="space-y-4">
          {salons.map((salon) => (
            <Card 
              key={salon.id} 
              className="border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:shadow-md"
              onClick={() => setLocation(`/salon/${salon.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-l-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center">
                      <div className="w-8 h-1 bg-gray-400 rounded-full transform rotate-45"></div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{salon.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{salon.location}</span>
                          <span className="text-gray-500">• {salon.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-amber-400" />
                            <span className="text-sm font-medium text-gray-900">{salon.rating}</span>
                            <span className="text-sm text-gray-500">({salon.reviews} avis)</span>
                          </div>
                          {salon.verified && (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {salon.services.slice(0, 3).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-green-600">{salon.nextSlot}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/booking/${salon.id}`);
                        }}
                      >
                        Prendre RDV
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