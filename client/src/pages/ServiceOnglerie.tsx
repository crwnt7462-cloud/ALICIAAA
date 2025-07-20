import { ArrowLeft, Palette, Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ServiceOnglerie() {
  const [, setLocation] = useLocation();

  const onglerieServices = [
    { name: "Manucure classique", price: "35€", duration: "45min" },
    { name: "Pose vernis semi-permanent", price: "45€", duration: "1h" },
    { name: "French manucure", price: "40€", duration: "1h" },
    { name: "Nail art", price: "55€", duration: "1h15" },
    { name: "Pédicure", price: "50€", duration: "1h" },
    { name: "Pose capsules", price: "65€", duration: "1h30" }
  ];

  const topNailBars = [
    {
      name: "Nail Art Studio",
      location: "Paris 9ème",
      rating: 4.9,
      reviews: 328,
      nextSlot: "Aujourd'hui 14h30",
      specialties: ["Nail art", "Extensions"]
    },
    {
      name: "Beauty Nails",
      location: "Bordeaux Centre",
      rating: 4.8,
      reviews: 215,
      nextSlot: "Demain 10h30",
      specialties: ["Semi-permanent", "Soins ongles"]
    },
    {
      name: "Ongle Parfait",
      location: "Strasbourg",
      rating: 4.7,
      reviews: 167,
      nextSlot: "Aujourd'hui 16h",
      specialties: ["French", "Réparation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Onglerie</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Soins des Ongles</h2>
            <p className="opacity-90">Sublimez vos ongles avec nos nail bars experts</p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span>1,200+ nail bars</span>
              <span>•</span>
              <span>Produits premium</span>
            </div>
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Prestations populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {onglerieServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-purple-600 font-semibold text-sm">{service.price}</span>
                    <span className="text-gray-500 text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top nail bars */}
        <Card>
          <CardHeader>
            <CardTitle>Nail bars recommandés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topNailBars.map((nailbar, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{nailbar.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {nailbar.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{nailbar.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">({nailbar.reviews} avis)</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {nailbar.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-600 text-sm font-medium">
                    Disponible: {nailbar.nextSlot}
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                    Réserver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
          onClick={() => setLocation('/search-results?service=onglerie')}
        >
          Voir tous les nail bars
        </Button>
      </div>
    </div>
  );
}