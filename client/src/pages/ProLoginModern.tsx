import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, Building, Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      
      {/* Éléments flottants diffus style /home */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-white/10 to-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-48 w-80 h-80 rounded-full bg-gradient-to-br from-violet-300/15 to-pink-300/10 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-amber-300/10 to-violet-400/15 blur-3xl"></div>
        
        {/* Émojis flottants diffus */}
        <div className="absolute top-20 left-20 text-6xl opacity-5">✨</div>
        <div className="absolute top-40 right-32 text-5xl opacity-5">💫</div>
        <div className="absolute bottom-32 left-16 text-7xl opacity-5">🌟</div>
        <div className="absolute top-1/2 right-16 text-4xl opacity-5">⭐</div>
        <div className="absolute bottom-20 right-1/4 text-6xl opacity-5">✨</div>
      </div>

      {/* Bouton retour en haut à gauche */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 p-3 rounded-xl transition-all duration-200 hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </button>

      {/* Contenu principal */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg lg:max-w-xl"
        >
          {/* Card principale glassmorphism Avyento */}
          <div 
            className="rounded-3xl p-8 lg:p-12 shadow-2xl transition-all duration-300 hover:shadow-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* En-tête avec logo Avyento Pro */}
            <div className="text-center mb-10">
              <div className="mb-6">
                <img 
                  src={avyentoProLogo} 
                  alt="Avyento Pro" 
                  className="mx-auto"
                  style={{ height: '50px' }}
                />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-violet-200 to-amber-200 bg-clip-text text-transparent">
                  Connexion Pro
                </span>
              </h1>
              <p className="text-white/80 text-lg">Accédez à votre dashboard Avyento</p>
            </div>

            {/* Formulaire glassmorphism */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email professionnel
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-200 text-white placeholder-white/50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-14 py-4 rounded-2xl outline-none transition-all duration-200 text-white placeholder-white/50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-white/60" />
                    ) : (
                      <Eye className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-violet-400 focus:ring-violet-400 focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="ml-3 text-sm text-white/80">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-white/90 hover:text-white font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton de connexion style Avyento */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-medium py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">Se connecter</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider glassmorphism */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-sm text-white/70">ou</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Connexion avec Google style Avyento */}
            <button
              onClick={() => {
                // Redirection vers Google OAuth (à configurer côté serveur)
                window.location.href = '/api/auth/google';
              }}
              className="w-full font-medium py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Chrome className="w-5 h-5 text-white" />
              <span className="text-white">Continuer avec Google</span>
            </button>

            {/* Lien d'inscription */}
            <div className="text-center mt-8">
              <p className="text-sm text-white/70">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setLocation('/register')}
                  className="text-white hover:text-violet-200 font-medium transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}