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
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Résultats de recherche</h1>
        </div>

        {/* Barre de recherche */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Service ou salon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Où ?"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              Rechercher
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="p-4 space-y-4">
        <div className="text-sm text-gray-600">
          {salons.length} résultats trouvés{searchQuery && ` pour "${searchQuery}"`}
        </div>

        {salons.map((salon) => (
          <Card 
            key={salon.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setLocation(`/salon/${salon.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{salon.name}</h3>
                {salon.verified && (
                  <span className="text-xs text-gray-500">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>{salon.rating} ({salon.reviews} avis)</span>
                  <span>•</span>
                  <span>{salon.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{salon.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{salon.nextSlot}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {salon.services.map((service, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
              
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/book/${salon.id}`);
                }}
                className="w-full"
                size="sm"
              >
                Réserver
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}