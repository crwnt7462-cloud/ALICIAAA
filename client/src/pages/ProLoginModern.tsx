import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, Building, ShieldCheck, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import avyentoProLogo from "@assets/5_1755263333243.png";

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
    <div className="min-h-screen" style={{ background: 'radial-gradient(1600px 800px at 18% -10%, #F3EFFF 0%, #FFFFFF 58%)' }}>
      
      {/* Bouton retour en haut à gauche */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-4 top-4 z-10 p-2"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Container principal - même style que page recherche */}
      <div className="px-6 pt-16 pb-6 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto glass-card p-10 rounded-3xl shadow-2xl relative z-10">
          
          {/* Logo Avyento Pro centré */}
          <div className="text-center mb-8">
            <img src={avyentoProLogo} alt="Avyento Pro" className="h-16 w-auto mx-auto mb-4" />
            <p className="text-gray-600">Accédez à votre espace professionnel</p>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Champ Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email professionnel"
                className="w-full h-14 pl-12 pr-4 glass-input rounded-2xl text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mot de passe"
                className="w-full h-14 pl-12 pr-12 glass-input rounded-2xl text-gray-900 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Bouton de connexion */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Connexion..." : "Connexion"}
            </motion.button>
          </form>

          {/* Avantages */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                <Building className="h-3 w-3 text-violet-600" />
              </div>
              <span>Gestion salon avancée</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 text-violet-600" />
              </div>
              <span>Sécurité garantie</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Connexion sécurisée via Replit Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}