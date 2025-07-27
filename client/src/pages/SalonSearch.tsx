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

      <div className="max-w-4xl mx-auto px-4 py-6">
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

        <div className="space-y-6">
          {salons.map((salon) => (
            <Card 
              key={salon.id} 
              className="border border-black shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:border-violet-500 hover:shadow-violet-500/20 group"
              onClick={() => setLocation(`/salon/${salon.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image améliorée */}
                  <div className="w-40 h-40 bg-gradient-to-br from-violet-100 to-amber-100 rounded-l-lg flex items-center justify-center overflow-hidden">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-10 h-2 bg-gradient-to-r from-violet-600 to-amber-600 rounded-full transform rotate-45"></div>
                    </div>
                  </div>

                  {/* Contenu enrichi */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-violet-700 transition-colors">{salon.name}</h3>
                          {salon.verified && (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Vérifié
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-violet-500" />
                            <span className="font-medium">{salon.location}</span>
                            <span className="text-gray-400">• {salon.distance}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-current text-amber-500" />
                            <span className="text-sm font-bold text-gray-900">{salon.rating}</span>
                            <span className="text-sm text-gray-600">({salon.reviews} avis)</span>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">{salon.nextSlot}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          {salon.services.slice(0, 3).map((service) => (
                            <Badge key={service} className="bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-medium">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Réservation en ligne • Confirmation immédiate
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/salon-booking?salon=${salon.id}`);
                        }}
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