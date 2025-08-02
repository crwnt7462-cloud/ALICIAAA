import { ArrowLeft, Scissors, Star, MapPin, Clock, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ServiceCoiffure() {
  const [, setLocation] = useLocation();

  const coiffureServices = [
    { name: "Coupe femme", price: "45€", duration: "1h" },
    { name: "Coupe + Brushing", price: "65€", duration: "1h30" },
    { name: "Coloration", price: "85€", duration: "2h" },
    { name: "Mèches", price: "95€", duration: "2h30" },
    { name: "Coupe homme", price: "25€", duration: "30min" },
    { name: "Barbe", price: "20€", duration: "20min" }
  ];

  const topSalons = [
    {
      name: "Salon Excellence",
      location: "Paris 16ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "Aujourd'hui 15h",
      specialties: ["Coloration", "Coupe tendance"]
    },
    {
      name: "Coiffure Moderne",
      location: "Lyon Centre",
      rating: 4.8,
      reviews: 198,
      nextSlot: "Demain 9h30",
      specialties: ["Balayage", "Coupe homme"]
    },
    {
      name: "Hair Studio",
      location: "Marseille",
      rating: 4.7,
      reviews: 156,
      nextSlot: "Aujourd'hui 17h",
      specialties: ["Extensions", "Soins"]
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
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-violet-600" />
              <h1 className="text-xl font-bold text-gray-900">Coiffure</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="gradient-bg text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Services de Coiffure</h2>
            <p className="opacity-90">Trouvez le salon parfait pour votre nouvelle coupe</p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span>2,500+ salons</span>
              <span>•</span>
              <span>Disponible 24h/24</span>
            </div>
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Services populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {coiffureServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-violet-600 font-semibold text-sm">{service.price}</span>
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

        {/* Top salons */}
        <Card>
          <CardHeader>
            <CardTitle>Salons recommandés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSalons.map((salon, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{salon.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {salon.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{salon.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">({salon.reviews} avis)</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {salon.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-600 text-sm font-medium">
                    Disponible: {salon.nextSlot}
                  </span>
                  <Button size="sm" className="gradient-bg text-white">
                    Réserver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          className="w-full gradient-bg text-white"
          onClick={() => setLocation('/search-results?service=coiffure')}
        >
          Voir tous les salons de coiffure
        </Button>
      </div>
    </div>
  );
}