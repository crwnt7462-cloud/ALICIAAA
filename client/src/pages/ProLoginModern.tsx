import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, Building, ShieldCheck } from 'lucide-react';
import logoImage from "@assets/3_1753714421825.png";

export default function ProLoginModern() {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    window.location.href = '/api/login';
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
          
          {/* Logo Avyento centré */}
          <div className="text-center mb-8">
            <img src={logoImage} alt="Avyento" className="h-24 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Avyento Pro</h1>
            <p className="text-gray-600">Accédez à votre espace professionnel</p>
          </div>

          {/* Avantages */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <Building className="h-4 w-4 text-violet-600" />
              </div>
              <span>Gestion salon avancée</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-violet-600" />
              </div>
              <span>Sécurité garantie</span>
            </div>
          </div>

          {/* Bouton de connexion - style Avyento */}
          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
          >
            <LogIn className="h-5 w-5" />
            Se connecter avec Replit
          </motion.button>

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