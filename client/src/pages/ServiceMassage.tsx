import { ArrowLeft, Heart, Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ServiceMassage() {
  const [, setLocation] = useLocation();

  const massageServices = [
    { name: "Massage relaxant", price: "70€", duration: "1h" },
    { name: "Massage deep tissue", price: "85€", duration: "1h" },
    { name: "Massage aux pierres chaudes", price: "95€", duration: "1h15" },
    { name: "Massage californien", price: "80€", duration: "1h" },
    { name: "Massage thaï", price: "90€", duration: "1h30" },
    { name: "Réflexologie", price: "60€", duration: "45min" }
  ];

  const topSpas = [
    {
      name: "Spa Wellness",
      location: "Paris 7ème",
      rating: 4.9,
      reviews: 412,
      nextSlot: "Aujourd'hui 15h30",
      specialties: ["Massage ayurvédique", "Hot stone"]
    },
    {
      name: "Zen Attitude",
      location: "Cannes Centre",
      rating: 4.8,
      reviews: 287,
      nextSlot: "Demain 11h",
      specialties: ["Massage thaï", "Shiatsu"]
    },
    {
      name: "Relax & Spa",
      location: "Toulouse",
      rating: 4.7,
      reviews: 193,
      nextSlot: "Aujourd'hui 18h",
      specialties: ["Massage couple", "Aromathérapie"]
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
              <Heart className="w-5 h-5 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Massage</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Massages & Bien-être</h2>
            <p className="opacity-90">Détendez-vous avec nos spas et centres de massage</p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span>900+ spas</span>
              <span>•</span>
              <span>Thérapeutes certifiés</span>
            </div>
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Types de massage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {massageServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-semibold text-sm">{service.price}</span>
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

        {/* Top spas */}
        <Card>
          <CardHeader>
            <CardTitle>Spas recommandés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSpas.map((spa, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{spa.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {spa.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{spa.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">({spa.reviews} avis)</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {spa.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-600 text-sm font-medium">
                    Disponible: {spa.nextSlot}
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                    Réserver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white"
          onClick={() => setLocation('/search-results?service=massage')}
        >
          Voir tous les spas de massage
        </Button>
      </div>
    </div>
  );
}