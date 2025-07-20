import { ArrowLeft, Sparkles, Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ServiceEsthetique() {
  const [, setLocation] = useLocation();

  const esthetiqueServices = [
    { name: "Soin visage classique", price: "65€", duration: "1h" },
    { name: "Nettoyage de peau", price: "75€", duration: "1h15" },
    { name: "Épilation sourcils", price: "25€", duration: "30min" },
    { name: "Épilation jambes", price: "45€", duration: "45min" },
    { name: "Massage visage", price: "55€", duration: "45min" },
    { name: "Soin anti-âge", price: "95€", duration: "1h30" }
  ];

  const topInstituts = [
    {
      name: "Institut Prestige",
      location: "Paris 8ème",
      rating: 4.9,
      reviews: 287,
      nextSlot: "Aujourd'hui 14h",
      specialties: ["Soins anti-âge", "Épilation laser"]
    },
    {
      name: "Beauty Center",
      location: "Lyon Part-Dieu",
      rating: 4.8,
      reviews: 156,
      nextSlot: "Demain 10h",
      specialties: ["Microneedling", "Peeling"]
    },
    {
      name: "Spa Wellness",
      location: "Nice Centre",
      rating: 4.7,
      reviews: 193,
      nextSlot: "Aujourd'hui 16h30",
      specialties: ["Soins bio", "Relaxation"]
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
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h1 className="text-xl font-bold text-gray-900">Esthétique</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Soins Esthétiques</h2>
            <p className="opacity-90">Prenez soin de votre beauté avec nos instituts partenaires</p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span>1,800+ instituts</span>
              <span>•</span>
              <span>Produits premium</span>
            </div>
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Soins populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {esthetiqueServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-pink-600 font-semibold text-sm">{service.price}</span>
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

        {/* Top instituts */}
        <Card>
          <CardHeader>
            <CardTitle>Instituts recommandés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInstituts.map((institut, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{institut.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {institut.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{institut.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">({institut.reviews} avis)</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {institut.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-600 text-sm font-medium">
                    Disponible: {institut.nextSlot}
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                    Réserver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white"
          onClick={() => setLocation('/search-results?service=esthetique')}
        >
          Voir tous les instituts d'esthétique
        </Button>
      </div>
    </div>
  );
}