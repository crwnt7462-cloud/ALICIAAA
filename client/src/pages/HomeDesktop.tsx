import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Search,
  MapPin,
  Shield,
  Zap,
  Heart,
  Award,
  Play,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function HomeDesktop() {
  const [, setLocation] = useLocation();

  const featuredSalons = [
    {
      id: 1,
      name: "Barbier Gentleman Marais",
      address: "15 Rue des Rosiers, 75004 Paris",
      rating: 4.9,
      reviews: 127,
      price: "€€€",
      specialty: "Barbier traditionnel",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "barbier-gentleman-marais"
    },
    {
      id: 2,
      name: "Institut Beauté Saint-Germain",
      address: "28 Boulevard Saint-Germain, 75005 Paris",
      rating: 4.8,
      reviews: 89,
      price: "€€",
      specialty: "Soins visage & corps",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "institut-beaute-saint-germain"
    },
    {
      id: 3,
      name: "Salon Excellence Paris",
      address: "45 Avenue des Champs-Élysées, 75008 Paris",
      rating: 4.7,
      reviews: 156,
      price: "€€€",
      specialty: "Coiffure haut de gamme",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "salon-excellence-paris"
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Réservation intelligente",
      description: "Système de booking optimisé par IA avec disponibilités temps réel",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Gestion clientèle",
      description: "Base de données complète avec historique et préférences personnalisées",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Analytics pro",
      description: "Tableaux de bord avancés pour optimiser votre chiffre d'affaires",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Sparkles,
      title: "Assistant IA",
      description: "Copilote intelligent pour automatiser vos tâches quotidiennes",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Sophie Martinez",
      role: "Propriétaire Salon Excellence",
      image: "https://images.unsplash.com/photo-1494790108755-2616c8e4c0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "Beauty Pro a révolutionné ma gestion quotidienne. +40% de réservations en 3 mois !",
      rating: 5
    },
    {
      name: "Antoine Mercier",
      role: "Barbier Gentleman Marais",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "L'IA m'aide à optimiser mon planning. Mes clients adorent l'expérience de réservation.",
      rating: 5
    },
    {
      name: "Marie Dubois",
      role: "Institut Beauté Marais",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "Interface intuitive, clients satisfaits. Le support est exceptionnel !",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Salons partenaires" },
    { number: "50K+", label: "Réservations mensuelles" },
    { number: "98%", label: "Satisfaction client" },
    { number: "4.9", label: "Note moyenne" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Plateforme #1 en France
              </Badge>
              
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                La révolution
                <span className="block bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                  beauté digitale
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Découvrez et réservez dans les meilleurs salons de beauté de Paris. 
                Intelligence artificielle, réservation instantanée, expérience premium.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-900 hover:bg-white/90 text-lg px-8 py-4"
                  onClick={() => setLocation('/salon-search')}
                >
                  <Search className="w-5 h-5 mr-3" />
                  Trouver un salon
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
                  onClick={() => setLocation('/register')}
                >
                  <Play className="w-5 h-5 mr-3" />
                  Voir la démo
                </Button>
              </div>
              
              {/* Stats en héro */}
              <div className="grid grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Hero Image/Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Salon de beauté moderne"
                  className="rounded-2xl w-full h-96 object-cover shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-900">4.9★</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Salons partenaires
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Les meilleurs salons de Paris
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de salons d'exception, choisis pour leur expertise, 
              leur service client et leurs prestations de qualité.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredSalons.map((salon, index) => (
              <motion.div
                key={salon.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={salon.image}
                      alt={salon.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-purple-800 font-medium">
                        {salon.specialty}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                        {salon.price}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{salon.name}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{salon.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold">{salon.rating}</span>
                        <span className="text-gray-500 text-sm">({salon.reviews} avis)</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full group"
                      onClick={() => setLocation(`/salon/${salon.slug}`)}
                    >
                      Voir le salon
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Fonctionnalités
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir Beauty Pro ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète qui transforme l'expérience beauté avec des technologies innovantes 
              et une interface intuitive.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex items-start gap-6"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Interface Beauty Pro"
                  className="rounded-2xl w-full shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Témoignages
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez pourquoi plus de 500 salons ont choisi Beauty Pro pour transformer 
              leur activité et ravir leurs clients.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Prêt à révolutionner votre beauté ?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Rejoignez des milliers d'utilisateurs qui ont déjà découvert une nouvelle façon 
              de prendre soin d'eux. Réservation en 30 secondes, satisfaction garantie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-900 hover:bg-white/90 text-lg px-10 py-4"
                onClick={() => setLocation('/salon-search')}
              >
                <Search className="w-6 h-6 mr-3" />
                Commencer maintenant
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4"
                onClick={() => setLocation('/register')}
              >
                <Shield className="w-6 h-6 mr-3" />
                Créer un compte pro
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-12 text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Gratuit pour commencer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Support 7j/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}