import { useState } from "react";
import { Search, Calendar, MapPin, Star, Clock, Euro, Users, Award, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const popularServices = [
    { name: "Coiffure", icon: "✂️", color: "from-pink-400 to-rose-500" },
    { name: "Ongles", icon: "💅", color: "from-purple-400 to-indigo-500" },
    { name: "Massage", icon: "💆", color: "from-green-400 to-emerald-500" },
    { name: "Esthétique", icon: "✨", color: "from-blue-400 to-cyan-500" },
    { name: "Barbier", icon: "🪒", color: "from-orange-400 to-red-500" },
    { name: "Spa", icon: "🧖", color: "from-teal-400 to-blue-500" },
  ];

  const featuredSalons = [
    {
      id: "demo-user",
      name: "Salon Belle Époque",
      rating: 4.8,
      reviews: 247,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
      location: "Paris 15ème",
      nextSlot: "Aujourd'hui 14h30",
      services: ["Coiffure", "Coloration", "Soins"]
    },
    {
      id: "salon-2",
      name: "Beauty Studio Emma",
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop",
      location: "Lyon 3ème",
      nextSlot: "Demain 10h00",
      services: ["Ongles", "Extensions", "Maquillage"]
    },
    {
      id: "salon-3",
      name: "Wellness Center",
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
      location: "Marseille 1er",
      nextSlot: "Aujourd'hui 16h00",
      services: ["Massage", "Spa", "Relaxation"]
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Rediriger vers une page de résultats de recherche
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">BeautyBook</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">
                Trouver un salon
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">
                Comment ça marche
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">
                Aide
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-purple-600"
                onClick={() => setLocation("/dashboard")}
              >
                Je suis un professionnel de beauté
              </Button>
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => setLocation("/dashboard")}
              >
                Mon compte
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Réservez votre rendez-vous beauté
              <br />
              <span className="text-purple-600">en quelques clics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez les meilleurs salons de beauté près de chez vous. 
              Réservation instantanée, paiement sécurisé, satisfaction garantie.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Rechercher un service (coiffure, manucure...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-lg border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Où ? (Paris, Lyon, Marseille...)"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="pl-10 h-12 text-lg border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Services */}
          <div className="mt-12">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
              Services populaires
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {popularServices.map((service) => (
                <Button
                  key={service.name}
                  variant="outline"
                  className="bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300"
                  onClick={() => setSearchQuery(service.name)}
                >
                  <span className="mr-2 text-lg">{service.icon}</span>
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Salons recommandés
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les établissements les mieux notés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSalons.map((salon) => (
              <Card 
                key={salon.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setLocation(`/book/${salon.id}`)}
              >
                <div className="relative">
                  <img 
                    src={salon.image} 
                    alt={salon.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{salon.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{salon.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{salon.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">{salon.nextSlot}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {salon.services.map((service) => (
                      <span 
                        key={service}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{salon.reviews} avis</span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir BeautyBook ?
            </h2>
            <p className="text-lg text-gray-600">
              La plateforme de référence pour vos rendez-vous beauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Réservation 24h/24
              </h3>
              <p className="text-gray-600">
                Réservez votre rendez-vous à tout moment, même en dehors des heures d'ouverture
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Salons vérifiés
              </h3>
              <p className="text-gray-600">
                Tous nos partenaires sont sélectionnés et évalués pour garantir la qualité
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Communauté active
              </h3>
              <p className="text-gray-600">
                Consultez les avis authentiques de milliers de clients satisfaits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes un professionnel de la beauté ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Rejoignez BeautyBook et développez votre clientèle
          </p>
          <Button 
            size="lg"
            variant="outline"
            className="bg-white text-purple-600 hover:bg-gray-50 border-white"
            onClick={() => setLocation("/dashboard")}
          >
            Rejoindre BeautyBook Pro
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold">BeautyBook</span>
              </div>
              <p className="text-gray-400">
                La plateforme de réservation beauté de référence en France
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Pour les clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trouver un salon</a></li>
                <li><a href="#" className="hover:text-white">Mes réservations</a></li>
                <li><a href="#" className="hover:text-white">Avis et notes</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Pour les professionnels</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Rejoindre BeautyBook</a></li>
                <li><a href="#" className="hover:text-white">Tableau de bord</a></li>
                <li><a href="#" className="hover:text-white">Gestion des rdv</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">CGU</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BeautyBook. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}