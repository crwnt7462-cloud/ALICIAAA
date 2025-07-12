import { useState } from "react";
import { Search, Calendar, MapPin, Star, Clock, Euro, Users, Award, Sparkles, User } from "lucide-react";
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
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">BeautyBook</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#salons" className="text-gray-700 hover:text-purple-600 font-medium text-sm">
                Trouver un salon
              </a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium text-sm">
                Avantages
              </a>
              <a href="#pro" className="text-gray-700 hover:text-purple-600 font-medium text-sm">
                Professionnels
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-purple-600 text-sm"
                onClick={() => setLocation("/dashboard")}
              >
                Espace Pro
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
                onClick={() => setLocation("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-800">Réservation en 3 clics • Plus rapide que Planity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              Réservez votre rendez-vous beauté
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">en 3 clics seulement</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto">
              L'expérience de réservation la plus rapide du marché. 
              Simple, fluide, efficace. Fini les formulaires interminables !
            </p>
            
            {/* Badge USP */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Clock className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Réservation en 30 secondes</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Confirmation instantanée</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <Users className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">100% sans attente</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Service (coiffure, manucure...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Ville ou adresse"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="pl-9 h-11 border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="h-11 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold whitespace-nowrap shadow-lg"
                  >
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Services */}
          <div className="mt-8 lg:mt-12">
            <h3 className="text-center text-base lg:text-lg font-semibold text-gray-700 mb-4 lg:mb-6">
              Services populaires
            </h3>
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              {popularServices.map((service) => (
                <Button
                  key={service.name}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300 text-sm"
                  onClick={() => setSearchQuery(service.name)}
                >
                  <span className="mr-1.5 text-base">{service.icon}</span>
                  {service.name}
                </Button>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="text-center mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocation("/book/demo-user")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-xl text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Tester la réservation 3 clics
                </Button>
                
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-400 text-violet-700 hover:text-violet-900 font-bold px-8 py-4 rounded-full shadow-lg text-lg"
                >
                  <User className="w-5 h-5 mr-2" />
                  Accès Professionnel
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-500">
                <p>Démo gratuite • Aucune inscription requise</p>
                <span className="hidden sm:inline">•</span>
                <p>Dashboard complet disponible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section id="salons" className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Salons recommandés
            </h2>
            <p className="text-base lg:text-lg text-gray-600">
              Découvrez les établissements les mieux notés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {featuredSalons.map((salon) => (
              <Card 
                key={salon.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white"
                onClick={() => setLocation(`/book/${salon.id}`)}
              >
                <div className="relative">
                  <img 
                    src={salon.image} 
                    alt={salon.name}
                    className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-semibold">{salon.rating}</span>
                  </div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full shadow-md">
                    <span className="text-xs font-bold">3 clics</span>
                  </div>
                </div>
                
                <CardContent className="p-4 lg:p-5">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{salon.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{salon.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3 h-3 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{salon.nextSlot}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {salon.services.slice(0, 3).map((service) => (
                      <span 
                        key={service}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{salon.reviews} avis</span>
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs px-4 shadow-md">
                      Réserver en 3 clics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              L'expérience utilisateur qui claque 🔥
            </h2>
            <p className="text-base lg:text-lg text-gray-600">
              Plus rapide que Planity • Plus simple que tout le reste
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                Réservation en 30 secondes
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                3 clics suffisent : Service → Créneau → Confirmer. C'est tout !
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                Interface fluide et moderne
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                Design épuré, navigation intuitive, zéro complication. L'expérience que vous méritez.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                Communauté active
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                Consultez les avis authentiques de milliers de clients satisfaits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA */}
      <section id="pro" className="py-12 lg:py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">
            Vous êtes un professionnel de la beauté ?
          </h2>
          <p className="text-base lg:text-xl text-purple-100 mb-6 lg:mb-8">
            Rejoignez BeautyBook et développez votre clientèle
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="lg"
              variant="outline"
              className="bg-white text-purple-600 hover:bg-gray-50 border-white w-full sm:w-auto"
              onClick={() => setLocation("/pro-login")}
            >
              Rejoindre BeautyBook Pro
            </Button>
            <Button 
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/30 w-full sm:w-auto"
              onClick={() => setLocation("/pro-login")}
            >
              Démo gratuite
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                <span className="text-base lg:text-lg font-bold">BeautyBook</span>
              </div>
              <p className="text-sm lg:text-base text-gray-400">
                La plateforme de réservation beauté de référence en France
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Pour les clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#salons" className="hover:text-white text-xs lg:text-sm">Trouver un salon</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">Mes réservations</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">Avis et notes</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Professionnels</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#pro" className="hover:text-white text-xs lg:text-sm">Rejoindre BeautyBook</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm" onClick={() => setLocation("/pro")}>Tableau de bord</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">Gestion des rdv</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">Contact</a></li>
                <li><a href="#" className="hover:text-white text-xs lg:text-sm">CGU</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-gray-400">
            <p className="text-xs lg:text-sm">&copy; 2025 BeautyBook. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}