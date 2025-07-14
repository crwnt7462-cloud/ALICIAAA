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
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
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
                className="text-gray-600 hover:text-violet-600"
                onClick={() => setLocation("/pro-login")}
              >
                Espace Professionnel
              </Button>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
                onClick={() => setLocation("/pro-login")}
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section épuré */}
      <section className="bg-gradient-to-b from-violet-50/30 to-white py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-violet-700">Réservation instantanée</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Réservez votre rendez-vous beauté
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              Trouvez et réservez chez les meilleurs professionnels près de chez vous
            </p>
            
            {/* Barre de recherche simple */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Service (coiffure, massage...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ville"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="h-12 pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setSearchLocation("Près de moi");
                          },
                          (error) => console.log("Géolocalisation non disponible")
                        );
                      }
                    }}
                    className="absolute right-2 top-3 text-violet-500 hover:text-violet-700"
                    title="Utiliser ma position"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-6 gradient-bg hover:opacity-90"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Bouton géolocalisation rapide */}
            <div className="max-w-2xl mx-auto mb-8">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setSearchLocation("Près de moi");
                        handleSearch();
                      },
                      (error) => console.log("Géolocalisation non disponible")
                    );
                  }
                }}
                className="w-full h-10 border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Trouver près de moi
              </Button>
            </div>

            {/* Recherches populaires */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 mb-3">Recherches populaires :</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Coiffure femme', 'Massage relaxant', 'Manucure', 'Soin visage', 'Épilation'].map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch();
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-violet-100 text-sm rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Créneaux disponibles aujourd'hui */}
      <section className="py-12 bg-gradient-to-r from-violet-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Créneaux disponibles aujourd'hui
            </h2>
            <p className="text-gray-600">Réservation immédiate possible</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: "14:30", salon: "Salon Élégance", service: "Coiffure", price: "45€", location: "Paris 11e" },
              { time: "16:00", salon: "Beauty Center", service: "Massage", price: "60€", location: "Paris 15e" },
              { time: "17:15", salon: "Nail Art Studio", service: "Manucure", price: "35€", location: "Paris 3e" }
            ].map((slot, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-violet-100 hover:border-violet-200 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                    {slot.time}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{slot.price}</div>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{slot.salon}</h3>
                <p className="text-sm text-gray-600 mb-1">{slot.service}</p>
                <p className="text-xs text-gray-500 mb-3">{slot.location}</p>
                <Button size="sm" className="w-full gradient-bg hover:opacity-90">
                  Réserver
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques simples */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Nos services
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "Coiffure", icon: "💇‍♀️" },
              { name: "Esthétique", icon: "✨" },
              { name: "Massage", icon: "💆‍♀️" },
              { name: "Onglerie", icon: "💅" }
            ].map((service, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="text-sm text-gray-700">{service.name}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topSalons.map((salon, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {salon.name}
                    </h3>
                    {salon.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{salon.rating} ({salon.reviews} avis)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{salon.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{salon.nextSlot}</span>
                    </div>
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
                    className="w-full gradient-bg hover:opacity-90"
                    size="sm"
                  >
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Recherchez", description: "Trouvez le service et le professionnel près de chez vous", icon: <Search className="w-6 h-6" /> },
              { step: "2", title: "Réservez", description: "Choisissez votre créneau et confirmez en quelques clics", icon: <Calendar className="w-6 h-6" /> },
              { step: "3", title: "Profitez", description: "Rendez-vous directement au salon, tout est organisé", icon: <Heart className="w-6 h-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-violet-600">
                    {item.icon}
                  </div>
                </div>
                <div className="text-sm font-medium text-violet-600 mb-2">Étape {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Pourquoi choisir BeautyBook ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-violet-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages clients */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Avis clients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  "{testimonial.comment}"
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{testimonial.name}, {testimonial.location}</span>
                  <span>{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application mobile */}
      <section className="py-12 gradient-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Téléchargez l'application mobile
            </h2>
            <p className="text-violet-100 mb-8">
              Réservez encore plus facilement depuis votre téléphone
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-violet-600 font-bold">📱</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">App Store</div>
                  <div className="text-violet-100 text-sm">Télécharger sur iOS</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-violet-600 font-bold">🤖</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Google Play</div>
                  <div className="text-violet-100 text-sm">Télécharger sur Android</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Professionnels */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Professionnel de la beauté ?
          </h2>
          <p className="text-gray-600 mb-6">
            Rejoignez notre réseau de 2,500+ salons partenaires
          </p>
          <Button 
            onClick={() => setLocation("/pro-login")}
            className="gradient-bg hover:opacity-90 text-white"
          >
            Rejoindre le réseau
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h2>

          <div className="space-y-3">
            {faqs.slice(0, 3).map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <div className={`transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {expandedFaq === index && (
                  <div className="px-4 pb-4 border-t">
                    <p className="text-sm text-gray-600 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-3">
              Une question ? Contactez-nous
            </p>
            <Button variant="outline" size="sm">
              Support
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
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
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
                <li><a href="#" className="hover:text-violet-600">Coiffure</a></li>
                <li><a href="#" className="hover:text-violet-600">Esthétique</a></li>
                <li><a href="#" className="hover:text-violet-600">Massage</a></li>
                <li><a href="#" className="hover:text-violet-600">Onglerie</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-violet-600">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-violet-600">Contact</a></li>
                <li><a href="#" className="hover:text-violet-600">Conditions</a></li>
                <li><a href="#" className="hover:text-violet-600">Confidentialité</a></li>
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