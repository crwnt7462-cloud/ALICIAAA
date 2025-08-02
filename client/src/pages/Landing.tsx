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
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4"
    >
      <div className="max-w-md mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-6 pt-8"
        >
          <div className="w-16 h-16 gradient-bg rounded-3xl flex items-center justify-center shadow-luxury mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Beauty Pro
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              La plateforme complète pour gérer votre salon de beauté avec intelligence artificielle
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9/5 - 2,847 salons</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
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
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">2,847</p>
                <p className="text-xs text-gray-600">Salons actifs</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">150k+</p>
                <p className="text-xs text-gray-600">RDV gérés</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            onClick={() => setLocation('/client-login')}
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