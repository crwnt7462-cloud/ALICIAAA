import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Sparkles, ArrowRight, Star, Search } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { getGenericGlassButton } from "@/lib/salonColors";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Calendar,
      title: "Planning intelligent",
      description: "Gérez vos rendez-vous avec un système de planning optimisé par IA",
      color: "from-blue-100 to-purple-100"
    },
    {
      icon: Users,
      title: "Gestion clients",
      description: "Base de données clients complète avec historique et préférences",
      color: "from-purple-100 to-pink-100"
    },
    {
      icon: TrendingUp,
      title: "Analytics avancées",
      description: "Tableaux de bord et analyses pour optimiser votre business",
      color: "from-emerald-100 to-green-100"
    },
    {
      icon: Sparkles,
      title: "Assistant IA",
      description: "Copilote intelligent pour automatiser et optimiser vos tâches",
      color: "from-amber-100 to-orange-100"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4 md:p-6 lg:p-8"
    >
      <div className="max-w-md mx-auto lg:max-w-6xl space-y-8 lg:space-y-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-6 pt-8 lg:pt-16"
        >
          <div className="w-16 h-16 lg:w-24 lg:h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-luxury mx-auto">
            <Sparkles className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-2 lg:mb-4">
              Beauty Pro
            </h1>
            <p className="text-gray-600 text-sm lg:text-xl leading-relaxed max-w-3xl mx-auto">
              La plateforme complète pour gérer votre salon de beauté avec intelligence artificielle
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm lg:text-base text-gray-600 ml-2">4.9/5 - 2,847 salons</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
                <CardContent className="p-4 lg:p-6 text-center">
                  <div className={`w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-5 h-5 lg:w-8 lg:h-8 text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-lg mb-1 lg:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-3 gap-4 lg:gap-8 text-center">
              <div>
                <p className="text-xl lg:text-3xl font-bold text-gray-900">2,847</p>
                <p className="text-xs lg:text-sm text-gray-600">Salons actifs</p>
              </div>
              <div>
                <p className="text-xl lg:text-3xl font-bold text-gray-900">150k+</p>
                <p className="text-xs lg:text-sm text-gray-600">RDV gérés</p>
              </div>
              <div>
                <p className="text-xl lg:text-3xl font-bold text-gray-900">98%</p>
                <p className="text-xs lg:text-sm text-gray-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Salons de Démonstration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4 lg:space-y-8"
        >
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 text-center mb-4 lg:mb-8">
            Salons de Démonstration
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
            {/* Barbier Gentleman Marais */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/barbier-gentleman-marais')}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-lg">Barbier Gentleman Marais</h3>
                    <p className="text-xs lg:text-sm text-gray-600">Barbier traditionnel - Le Marais</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs lg:text-sm text-gray-600">4.8 • 156 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Beauty Lash Studio */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/beauty-lash-studio')}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-lg">Beauty Lash Studio</h3>
                    <p className="text-xs lg:text-sm text-gray-600">Extensions de cils - République</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs lg:text-sm text-gray-600">4.9 • 78 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Salon Excellence Paris */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/salon-excellence-paris')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">Salon Excellence Paris</h3>
                    <p className="text-xs text-gray-600">Coiffure haut de gamme - Champs-Élysées</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8 • 127 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Institut Beauté Saint-Germain */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/institut-beaute-saint-germain')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">Institut Beauté Saint-Germain</h3>
                    <p className="text-xs text-gray-600">Soins & esthétique - Saint-Germain</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.7 • 89 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Beauty Lounge Montparnasse */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/beauty-lounge-montparnasse')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-rose-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">Beauty Lounge Montparnasse</h3>
                    <p className="text-xs text-gray-600">Salon moderne - Montparnasse</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.6 • 94 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Salon Moderne République */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => setLocation('/salon/salon-moderne-republique')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">Salon Moderne République</h3>
                    <p className="text-xs text-gray-600">Salon tendance - République</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.5 • 67 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Buttons with Glassmorphism */}
        <div className="space-y-4">
          {/* Bouton Glassmorphism Principal - Rechercher un salon */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ 
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation('/search')}
            className="relative w-full h-16 rounded-3xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.4) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center h-full text-white font-semibold text-lg">
              <Search className="w-5 h-5 mr-3" />
              Rechercher un salon
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </motion.button>
          
          {/* Bouton secondaire */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${getGenericGlassButton(0)} rounded-xl py-3 font-medium flex items-center justify-center`}
            onClick={() => setLocation('/dashboard')}
          >
            Accéder au tableau de bord
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${getGenericGlassButton(1)} rounded-xl py-3 font-medium`}
            onClick={() => setLocation('/client-login-modern')}
          >
            Espace client
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </motion.div>
  );
}