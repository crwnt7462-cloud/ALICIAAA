import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, User, Building, ShieldCheck } from 'lucide-react';

export default function ProLogin() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
            Avyento Pro
          </h1>
          <p className="text-gray-600 mt-2">
            Accédez à votre espace professionnel
          </p>
        </motion.div>

        {/* Carte de connexion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connexion Professionnelle
                </h2>
                <p className="text-gray-600 text-sm">
                  Connectez-vous pour gérer votre salon
                </p>
              </div>

              {/* Avantages */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <User className="h-4 w-4 text-purple-600" />
                  <span>Gestion clientèle avancée</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Building className="h-4 w-4 text-purple-600" />
                  <span>Page salon personnalisée</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span>Sécurité garantie</span>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Se connecter avec Replit
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Connexion sécurisée via Replit Auth
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lien retour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}