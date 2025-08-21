import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Users, TrendingUp, Sparkles, ArrowRight, Star, Search, MapPin, Home, BarChart3, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { getGenericGlassButton } from "@/lib/salonColors";
import { useState } from "react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Fonction de recherche pour salon par service et ville
  const handleSearch = () => {
    const query = searchService.trim();
    const location = searchLocation.trim();
    
    // Construire l'URL avec les paramètres de recherche
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (location) searchParams.set('location', location);
    
    const searchUrl = `/search-results${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    setLocation(searchUrl);
  };

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
    <>
      {/* Menu de navigation desktop - Affiché directement */}
      <div className="hidden lg:block bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer"
              onClick={() => setLocation('/')}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Avyento Pro</h1>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setLocation('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Tableau de bord</span>
            </button>
            
            <button
              onClick={() => setLocation('/planning')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Planning</span>
            </button>
            
            <button
              onClick={() => setLocation('/clients')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Clients</span>
            </button>
            
            <button
              onClick={() => setLocation('/analytics')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Analytics</span>
            </button>
            
            <button
              onClick={() => setLocation('/ai-assistant')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">IA Assistant</span>
            </button>
            
            <button
              onClick={() => setLocation('/settings')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Paramètres</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLocation('/pro-login')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Connexion Pro
            </button>
          </div>
        </div>
      </div>
      
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

        {/* Salon de Démonstration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4 lg:space-y-8"
        >
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 text-center mb-4 lg:mb-8">
            Salon de Démonstration
          </h2>
          
          <div className="flex justify-center">
            {/* Salon Avyento - Template officiel */}
            <Card 
              className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer max-w-md w-full"
              onClick={() => setLocation('/salon')}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-violet-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-lg">Salon Avyento</h3>
                    <p className="text-xs lg:text-sm text-gray-600">Salon moderne - Paris 1er</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs lg:text-sm text-gray-600">4.8 • 127 avis</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Barre de Recherche avec Service et Ville */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 text-center mb-6">
                Trouvez votre salon de beauté
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Champ Service */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Service (coiffure, massage, esthétique...)"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 rounded-xl border-0 bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Champ Ville */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ville (Paris, Lyon, Marseille...)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 rounded-xl border-0 bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Bouton de recherche */}
              <Button
                onClick={handleSearch}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher des salons
              </Button>

              {/* Suggestions rapides */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['Coiffure', 'Massage', 'Esthétique', 'Onglerie', 'Barbier'].map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchService(service);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full transition-colors duration-200"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Buttons with Glassmorphism */}
        <div className="space-y-4">
          
          {/* Bouton principal - Espace Pro */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${getGenericGlassButton(0)} rounded-xl py-3 font-medium flex items-center justify-center`}
            onClick={() => setLocation('/pro-login')}
          >
            Espace Professionnel
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
          
          {/* Bouton secondaire - Client */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${getGenericGlassButton(1)} rounded-xl py-3 font-medium`}
            onClick={() => setLocation('/client-login')}
          >
            Espace Client
          </motion.button>
          
          {/* Bouton dashboard (pour utilisateurs connectés) */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${getGenericGlassButton(2)} rounded-xl py-3 font-medium text-sm opacity-75`}
            onClick={() => setLocation('/dashboard')}
          >
            Tableau de bord (connecté)
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>© 2025 Avyento. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </motion.div>
    </>
  );
}