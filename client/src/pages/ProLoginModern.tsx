import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import avyentoProLogo from "@assets/Logo avyento pro._1755359490006.png";

export default function ProLoginModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pour l'instant, redirection vers Replit Auth
      window.location.href = '/api/login';
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Bouton retour en haut à gauche avec style /home */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Contenu principal optimisé desktop */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md lg:max-w-4xl"
        >
          {/* Card principale avec orientation paysage sur desktop */}
          <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl lg:flex lg:max-h-[80vh]">
            
            {/* Section gauche - Branding (desktop uniquement) */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-center lg:p-10 lg:bg-gradient-to-br lg:from-violet-50 lg:to-purple-50 lg:rounded-l-3xl">
              <div className="text-center w-full max-w-sm px-4">
                <div className="mb-6">
                  <img 
                    src={avyentoProLogo} 
                    alt="Avyento Pro" 
                    className="mx-auto"
                    style={{ height: '70px' }}
                  />
                </div>
                <p className="text-gray-600 text-2xl mb-10 leading-relaxed px-2 font-medium">
                  La plateforme révolutionnaire pour professionnels de la beauté
                </p>
                <div className="space-y-4 text-left max-w-xs mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-700 text-base leading-relaxed">Planning IA optimisé</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-700 text-base leading-relaxed">Analytics en temps réel</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-gray-700 text-base leading-relaxed">Gestion clientèle avancée</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section droite - Formulaire */}
            <div className="p-8 lg:w-1/2 lg:p-8 lg:flex lg:flex-col lg:justify-center">
              {/* En-tête mobile */}
              <div className="text-center mb-8 lg:hidden">
                <div className="mb-6">
                  <img 
                    src={avyentoProLogo} 
                    alt="Avyento Pro" 
                    className="mx-auto"
                    style={{ height: '50px' }}
                  />
                </div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">
                  Connexion Pro
                </h1>
                <p className="text-gray-600 text-lg">Accédez à votre dashboard Avyento</p>
              </div>

              {/* En-tête desktop */}
              <div className="hidden lg:block text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                  Connexion
                </h2>
                <p className="text-gray-600 text-sm">Accédez à votre espace professionnel</p>
              </div>

              {/* Formulaire avec vrai style /home */}
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 lg:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-14 py-3 lg:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="ml-3 text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton de connexion avec vrai style glass-button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full glass-button text-black font-medium py-3 lg:py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 text-gray-900" />
                      <span className="text-gray-900 font-semibold">Se connecter</span>
                    </>
                  )}
                </button>
              </form>



              {/* Lien d'inscription */}
              <div className="text-center mt-8 lg:mt-6">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => setLocation('/register')}
                    className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}