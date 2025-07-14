import { useState } from "react";
import { Search, Calendar, MapPin, Star, Clock, Euro, Users, Award, Sparkles, ArrowRight, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const popularServices = [
    { name: "Coiffure", icon: "✂️", gradient: "from-pink-500 to-rose-600" },
    { name: "Ongles", icon: "💅", gradient: "from-purple-500 to-indigo-600" },
    { name: "Massage", icon: "💆", gradient: "from-green-500 to-emerald-600" },
    { name: "Esthétique", icon: "✨", gradient: "from-blue-500 to-cyan-600" },
  ];

  const featuredSalons = [
    {
      id: "demo-user",
      name: "Salon Belle Époque",
      rating: 4.8,
      reviews: 247,
      location: "Paris 15ème",
      nextSlot: "Aujourd'hui 14h30",
      services: ["Coiffure", "Coloration"],
      specialOffer: "-20% première visite"
    },
    {
      id: "salon-2", 
      name: "Beauty Studio Emma",
      rating: 4.9,
      reviews: 189,
      location: "Lyon 3ème",
      nextSlot: "Demain 10h00",
      services: ["Ongles", "Extensions"],
      specialOffer: "Offre duo"
    },
    {
      id: "salon-3",
      name: "Wellness Center",
      rating: 4.7,
      reviews: 156,
      location: "Marseille 1er", 
      nextSlot: "Aujourd'hui 16h00",
      services: ["Massage", "Spa"],
      specialOffer: "Pack détente"
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`);
    }
  };

  const handleBookSalon = (salonId: string) => {
    setLocation(`/book/${salonId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Modern */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BeautyPro
              </span>
            </div>
            
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
              onClick={() => setLocation("/pro-login")}
            >
              Espace Pro
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section Moderne */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-8 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Votre beauté,
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                notre priorité
              </span>
            </h1>
            <p className="text-gray-600 mb-6">
              Réservez instantanément dans les meilleurs salons près de chez vous.
            </p>
          </div>

          {/* Search Bar Mobile */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm mb-8">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher un service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Où ?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services Populaires */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Services populaires</h2>
            <div className="grid grid-cols-2 gap-3">
              {popularServices.map((service, index) => (
                <Card key={index} className="border-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                  <CardContent className={`p-4 bg-gradient-to-br ${service.gradient}`}>
                    <div className="text-center text-white">
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <p className="font-medium text-sm">{service.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Salons en vedette */}
      <section className="py-8 bg-white">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Salons recommandés</h2>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Près de vous
            </Badge>
          </div>

          <div className="space-y-4">
            {featuredSalons.map((salon, index) => (
              <Card key={index} className="border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{salon.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{salon.rating}</span>
                            <span className="text-sm text-gray-500">({salon.reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {salon.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Clock className="w-4 h-4" />
                          {salon.nextSlot}
                        </div>
                      </div>
                      
                      {salon.specialOffer && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs">
                          {salon.specialOffer}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {salon.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleBookSalon(salon.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      size="sm"
                    >
                      Réserver maintenant
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Pourquoi choisir BeautyPro ?</h2>
          
          <div className="space-y-4">
            {[
              {
                icon: <Calendar className="w-6 h-6 text-purple-600" />,
                title: "Réservation 24h/24",
                description: "Réservez quand vous voulez, même la nuit"
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                title: "Confirmation instantanée",
                description: "Votre rendez-vous confirmé en 1 clic"
              },
              {
                icon: <Star className="w-6 h-6 text-yellow-500" />,
                title: "Salons vérifiés",
                description: "Tous nos partenaires sont certifiés qualité"
              },
              {
                icon: <Phone className="w-6 h-6 text-blue-600" />,
                title: "Support client",
                description: "Une équipe à votre écoute 7j/7"
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA pour les professionnels */}
      <section className="py-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-2">Vous êtes professionnel ?</h2>
            <p className="text-purple-100 mb-6">
              Rejoignez notre réseau et développez votre clientèle
            </p>
            <Button 
              onClick={() => setLocation("/pro-login")}
              className="bg-white text-purple-600 hover:bg-gray-50 font-semibold"
              size="lg"
            >
              Devenir partenaire
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">BeautyPro</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            La beauté à portée de main, partout en France
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">À propos</a>
            <a href="#" className="hover:text-white">Support</a>
            <a href="#" className="hover:text-white">Conditions</a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 BeautyPro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}