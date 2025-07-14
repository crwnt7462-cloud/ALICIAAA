import { useState, useEffect } from "react";
import { Search, MapPin, Star, Calendar, Clock, Shield, Award, ArrowRight, CheckCircle2, Users, TrendingUp, Quote, ThumbsUp, Sparkles, Zap, Heart, Camera, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  const testimonials = [
    {
      id: 1,
      name: "Marie L.",
      location: "Paris",
      rating: 5,
      comment: "Interface très intuitive ! J'ai trouvé mon salon de coiffure parfait en 2 minutes. Le système de réservation est fluide et les rappels automatiques très pratiques.",
      service: "Coiffure & Coloration",
      date: "Il y a 2 jours"
    },
    {
      id: 2,
      name: "Sophie M.",
      location: "Lyon",
      rating: 5,
      comment: "Excellent service ! Le salon était exactement comme décrit, et le processus de réservation très simple. Je recommande vivement BeautyBook.",
      service: "Soins visage",
      date: "Il y a 1 semaine"
    },
    {
      id: 3,
      name: "Julie R.",
      location: "Marseille",
      rating: 5,
      comment: "Parfait pour les rendez-vous de dernière minute. J'ai pu réserver un massage le jour même. L'équipe était professionnelle et accueillante.",
      service: "Massage bien-être",
      date: "Il y a 3 jours"
    }
  ];

  const faqs = [
    {
      question: "Comment réserver un rendez-vous ?",
      answer: "Recherchez un salon ou service, sélectionnez un créneau disponible, remplissez vos informations et confirmez. Vous recevrez immédiatement une confirmation par email et SMS."
    },
    {
      question: "Puis-je annuler ou modifier mon rendez-vous ?",
      answer: "Oui, vous pouvez annuler ou modifier gratuitement jusqu'à 24h avant votre rendez-vous directement depuis votre email de confirmation ou en contactant le salon."
    },
    {
      question: "Les salons sont-ils vérifiés ?",
      answer: "Tous nos partenaires sont rigoureusement sélectionnés et vérifiés. Nous contrôlons leurs certifications, équipements et respectons les normes d'hygiène et de qualité."
    },
    {
      question: "Que se passe-t-il si je suis en retard ?",
      answer: "Contactez directement le salon dès que possible. La plupart acceptent un retard de 15-20 minutes, mais au-delà, le rendez-vous peut être annulé."
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Le paiement se fait généralement sur place. Certains salons proposent un acompte en ligne sécurisé. Tous les modes de paiement sont acceptés."
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
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-16 lg:py-24 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-200/30 rounded-full animate-pulse delay-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">✨ Nouveau : Réservation instantanée</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Réservez votre 
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent animate-gradient">rendez-vous beauté</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Accédez aux meilleurs salons de votre région. Réservation en ligne simple, rapide et sécurisée.
            </p>
            
            {/* Stats rapides */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>2,500+ salons partenaires</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <span>50,000+ réservations/mois</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                <span>4.9/5 satisfaction client</span>
              </div>
            </div>
            
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
                          className="pl-12 h-14 border-0 bg-gray-50 focus:bg-white text-lg focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                          className="pl-12 h-14 border-0 bg-gray-50 focus:bg-white text-lg focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <Button 
                        onClick={handleSearch}
                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-medium transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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

      {/* Statistiques avec animations */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300 transform group-hover:scale-105">
                  <div className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium group-hover:text-gray-700">
                    {stat.label}
                  </div>
                </div>
                {index === 0 && <Zap className="w-6 h-6 text-purple-500 mx-auto animate-pulse" />}
                {index === 1 && <Heart className="w-6 h-6 text-pink-500 mx-auto animate-pulse delay-300" />}
                {index === 2 && <Star className="w-6 h-6 text-yellow-500 mx-auto animate-pulse delay-500" />}
                {index === 3 && <Clock className="w-6 h-6 text-blue-500 mx-auto animate-pulse delay-700" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie visuelle des services */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Découvrez nos services
            </h2>
            <p className="text-xl text-gray-600">
              Une expérience beauté complète à portée de clic
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Coiffure", icon: "💇‍♀️", color: "from-pink-400 to-pink-600" },
              { name: "Esthétique", icon: "✨", color: "from-purple-400 to-purple-600" },
              { name: "Massage", icon: "💆‍♀️", color: "from-blue-400 to-blue-600" },
              { name: "Onglerie", icon: "💅", color: "from-green-400 to-green-600" },
              { name: "Épilation", icon: "🪒", color: "from-orange-400 to-orange-600" },
              { name: "Maquillage", icon: "💄", color: "from-red-400 to-red-600" },
              { name: "Soins visage", icon: "🧴", color: "from-teal-400 to-teal-600" },
              { name: "Barbier", icon: "✂️", color: "from-gray-400 to-gray-600" }
            ].map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                    {service.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Voir tous les services
            </Button>
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
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 relative overflow-hidden">
                    {/* Pattern décoratif */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border-4 border-white/50">
                        <span className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">
                          {salon.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Gradient overlay au hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {salon.verified && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 animate-float">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
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
                        <Badge key={idx} variant="outline" className="text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-colors duration-200">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleBookSalon(salon.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <div className="text-purple-600 group-hover:text-purple-700">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
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

      {/* Témoignages clients */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 50 000 clients satisfaits nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-purple-200 mb-2" />
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.comment}"
                    </p>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {testimonial.service}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">98% de satisfaction</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-900">50,000+ clients heureux</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">Note moyenne 4.9/5</span>
              </div>
            </div>
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
              className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8 transform hover:scale-105 transition-all duration-200"
            >
              Rejoindre le réseau
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-100 hover:bg-purple-800 font-semibold px-8 transform hover:scale-105 transition-all duration-200"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur BeautyBook
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className={`transform transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Besoin d'aide ? Notre équipe est là pour vous
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  01 42 34 56 78
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  Chat en ligne
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Support client disponible 7j/7 de 9h à 20h
              </p>
            </div>
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