import { useState } from "react";
import { Search, MapPin, Star, Calendar, Clock, Shield, Award, ArrowRight, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const stats = [
    { number: "50,000+", label: "Rendez-vous par mois" },
    { number: "2,500+", label: "Salons partenaires" },
    { number: "4.9/5", label: "Satisfaction client" },
    { number: "24h/24", label: "Réservation disponible" }
  ];

  const topSalons = [
    {
      id: "demo-user",
      name: "Salon Excellence",
      location: "Paris 16ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "Aujourd'hui 15h",
      services: ["Coiffure", "Coloration"],
      verified: true
    },
    {
      id: "salon-2",
      name: "Institut Prestige",
      location: "Lyon Centre",
      rating: 4.8,
      reviews: 198,
      nextSlot: "Demain 9h30",
      services: ["Soins visage", "Épilation"],
      verified: true
    },
    {
      id: "salon-3",
      name: "Spa Wellness",
      location: "Marseille",
      rating: 4.7,
      reviews: 156,
      nextSlot: "Aujourd'hui 17h",
      services: ["Massage", "Relaxation"],
      verified: true
    }
  ];

  const benefits = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Réservation instantanée",
      description: "Trouvez et réservez votre créneau en moins de 2 minutes"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Paiement sécurisé",
      description: "Transactions protégées et remboursement garanti"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Salons certifiés",
      description: "Tous nos partenaires sont vérifiés et évalués"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Support client",
      description: "Assistance 7j/7 pour toutes vos questions"
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
      {/* Header professionnel */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BeautyBook</h1>
                  <p className="text-xs text-gray-500 -mt-1">Réservation beauté</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-purple-600"
                onClick={() => setLocation("/pro-login")}
              >
                Espace Professionnel
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                onClick={() => setLocation("/pro-login")}
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section épuré */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Réservez votre 
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">rendez-vous beauté</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Accédez aux meilleurs salons de votre région. Réservation en ligne simple, rapide et sécurisée.
            </p>
            
            {/* Barre de recherche premium */}
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 shadow-2xl bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <div className="relative">
                        <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Quel service recherchez-vous ?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-14 border-0 bg-gray-50 focus:bg-white text-lg"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Dans quelle ville ?"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="pl-12 h-14 border-0 bg-gray-50 focus:bg-white text-lg"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <Button 
                        onClick={handleSearch}
                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-medium"
                      >
                        Rechercher
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salons recommandés */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Salons recommandés
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos partenaires les mieux notés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topSalons.map((salon, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-slate-900">
                          {salon.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    {salon.verified && (
                      <Badge className="absolute top-4 right-4 bg-green-100 text-green-800 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {salon.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{salon.rating}</span>
                        <span className="text-gray-500">({salon.reviews} avis)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{salon.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{salon.nextSlot}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {salon.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-gray-600">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleBookSalon(salon.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium"
                    >
                      Réserver maintenant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir BeautyBook ?
            </h2>
            <p className="text-xl text-gray-600">
              La plateforme de référence pour vos rendez-vous beauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="text-purple-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Professionnels */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Vous êtes professionnel de la beauté ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau et augmentez votre visibilité. Plus de 50 000 clients vous attendent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/pro-login")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8"
            >
              Rejoindre le réseau
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-100 hover:bg-purple-800 font-semibold px-8"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Footer professionnel */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">BeautyBook</h3>
                  <p className="text-sm text-gray-500">Réservation beauté</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                La plateforme de référence pour réserver vos rendez-vous beauté en France. 
                Simple, rapide et sécurisé.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Coiffure</a></li>
                <li><a href="#" className="hover:text-purple-600">Esthétique</a></li>
                <li><a href="#" className="hover:text-purple-600">Massage</a></li>
                <li><a href="#" className="hover:text-purple-600">Onglerie</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="hover:text-purple-600">Conditions</a></li>
                <li><a href="#" className="hover:text-purple-600">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 BeautyBook. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}