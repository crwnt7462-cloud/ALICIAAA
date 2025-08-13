import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/3_1753714421825.png";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, Star, MapPin, Clock, Award, Shield, CheckCircle2, 
  Sparkles, Crown, Heart, Zap, Camera, Gift, Coffee, Wifi, 
  Car, Users, TrendingUp, Phone, Mail, ArrowRight, ChevronDown,
  Menu, X, Play, Calendar, Euro
} from "lucide-react";

export default function UltraModernLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Éviter les erreurs d'unused variables
  console.log({ searchQuery, isMenuOpen, currentSlide });

  const featuredSalons = [
    {
      id: "1",
      name: "Salon Excellence Paris",
      rating: 4.9,
      reviews: 1247,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      services: ["Coiffure", "Coloration", "Soins"],
      price: "à partir de 65€",
      location: "Paris 1er",
      badges: ["Certifié L'Oréal", "Premium"],
      nextSlot: "Aujourd'hui 14h30"
    },
    {
      id: "2", 
      name: "Beauty Lounge Champs",
      rating: 4.8,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      services: ["Esthétique", "Massage", "Soins"],
      price: "à partir de 80€",
      location: "Paris 8e",
      badges: ["Spa Premium", "Bio"],
      nextSlot: "Demain 10h00"
    },
    {
      id: "3",
      name: "Nail Art Studio",
      rating: 4.7,
      reviews: 654,
      image: "https://images.unsplash.com/photo-1604902396830-aca29652ec1b?w=400",
      services: ["Manucure", "Pédicure", "Nail Art"],
      price: "à partir de 45€",
      location: "Paris 3e",
      badges: ["Spécialiste Ongles", "Créatif"],
      nextSlot: "Aujourd'hui 16h15"
    }
  ];

  const testimonials = [
    {
      name: "Sophie M.",
      service: "Coloration + Coupe",
      rating: 5,
      comment: "Résultat absolument parfait ! Sarah a compris exactement ce que je voulais.",
      salon: "Salon Excellence",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60"
    },
    {
      name: "Marie L.",
      service: "Soin visage hydratant",
      rating: 5,
      comment: "Un moment de détente incroyable, ma peau n'a jamais été aussi douce.",
      salon: "Beauty Lounge",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60"
    },
    {
      name: "Emma R.",
      service: "Nail Art personnalisé",
      rating: 5,
      comment: "Design unique et créatif, j'ai reçu tellement de compliments !",
      salon: "Nail Art Studio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Salons partenaires" },
    { number: "150k+", label: "Clientes satisfaites" },
    { number: "4.9/5", label: "Note moyenne" },
    { number: "24h/7j", label: "Support client" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}&location=Paris`);
    }
  };

  const handleSalonClick = (salonId: string) => {
    setLocation(`/salon/${salonId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation ultra-moderne */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-16 w-auto" />
              <Badge className="ml-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                Premium
              </Badge>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-gray-600 hover:text-violet-600">
                Services
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-violet-600">
                Salons
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-violet-600">
                À propos
              </Button>
              <Button 
                variant="outline" 
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
                onClick={() => setLocation("/pro-login")}
              >
                Espace Pro
              </Button>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                onClick={() => setLocation("/client-dashboard")}
              >
                Connexion
              </Button>
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="pt-20 px-4 space-y-4">
            <Button variant="ghost" className="w-full justify-start text-lg">Services</Button>
            <Button variant="ghost" className="w-full justify-start text-lg">Salons</Button>
            <Button variant="ghost" className="w-full justify-start text-lg">À propos</Button>
            <Button variant="outline" className="w-full text-lg">Espace Pro</Button>
            <Button className="w-full text-lg bg-gradient-to-r from-violet-600 to-purple-600">
              Connexion
            </Button>
          </div>
        </div>
      )}

      {/* Hero section révolutionnaire */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-violet-50 via-purple-50 to-rose-50 relative overflow-hidden">
        {/* Animations d'arrière-plan */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-violet-200 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
              <span className="text-violet-700 font-semibold">#1 Plateforme Beauté Premium</span>
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Votre beauté,<br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                notre art
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Découvrez l'excellence beauté avec 2,500+ salons d'exception.<br />
              Réservation instantanée, expérience premium garantie.
            </p>

            {/* Barre de recherche ultra-moderne */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative bg-white rounded-2xl shadow-2xl p-2 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 flex items-center space-x-3 pl-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Coiffure, esthétique, manucure..."
                      className="border-0 focus:ring-0 text-lg bg-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pr-2">
                    <Badge variant="secondary" className="text-xs">Paris</Badge>
                    <Button 
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
                    >
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg"
                onClick={() => setLocation("/booking")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Réserver maintenant
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-violet-200 text-violet-600 hover:bg-violet-50 px-8 py-4 rounded-xl text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Salons en vedette */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Salons d'exception
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos partenaires premium sélectionnés avec soin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredSalons.map((salon) => (
              <Card 
                key={salon.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                onClick={() => handleSalonClick(salon.id)}
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-violet-400 to-purple-500"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-violet-600 font-semibold">
                      {salon.nextSlot}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{salon.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {salon.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {salon.rating} ({salon.reviews})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-violet-600">{salon.price}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {salon.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {salon.badges.map((badge, idx) => (
                      <Badge key={idx} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("/booking");
                    }}
                  >
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages animés */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clientes
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 150,000 expériences beauté réussies
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="flex-shrink-0 w-full max-w-2xl mx-auto shadow-xl border-0">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-xl text-gray-700 mb-6 italic">
                        "{testimonial.comment}"
                      </blockquote>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500"></div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.service} • {testimonial.salon}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Indicateurs */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-violet-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold text-violet-600 mb-2 group-hover:scale-110 transition-transform">
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

      {/* Footer moderne */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={logoImage} alt="Logo" className="h-16 w-auto mb-4" />
              <p className="text-gray-400 mb-4">
                La plateforme beauté premium qui révolutionne votre expérience.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Coiffure</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Esthétique</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Massage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manucure</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Restez informée des dernières tendances beauté</p>
              <div className="flex">
                <Input 
                  placeholder="Votre email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button className="ml-2 bg-gradient-to-r from-violet-600 to-purple-600">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Beauty Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}