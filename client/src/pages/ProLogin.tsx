import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, Sparkles, Calendar, BarChart3, Users, Shield, Crown, Star } from 'lucide-react';

export default function ProLogin() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-amber-900 relative overflow-hidden">
      {/* Arrière-plan animé avec particules */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-amber-500/20"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -100 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* Logo et branding Avyento */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-500 to-amber-400 rounded-3xl blur-sm"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-violet-500 via-purple-600 to-amber-500 rounded-3xl flex items-center justify-center">
                  <Crown className="h-12 w-12 text-white" />
                </div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center"
              >
                <Star className="h-3 w-3 text-amber-900" />
              </motion.div>
            </div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-2"
            >
              <span className="bg-gradient-to-r from-white via-violet-200 to-amber-200 bg-clip-text text-transparent">
                Avyento
              </span>
              <span className="text-amber-300 ml-2 text-2xl">Pro</span>
            </motion.h1>
            <p className="text-white/80 text-lg font-medium">
              Plateforme professionnelle de beauté
            </p>
            <p className="text-white/60 text-sm mt-1">
              L'excellence technologique au service de votre salon
            </p>
          </motion.div>

          {/* Carte de connexion glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-8 rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Espace Professionnel
                  </h2>
                  <p className="text-white/70">
                    Connectez-vous pour accéder à votre dashboard
                  </p>
                </div>

                {/* Fonctionnalités premium */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                  >
                    <Calendar className="h-6 w-6 text-violet-300 mx-auto mb-2" />
                    <p className="text-white/80 text-sm font-medium">Planning IA</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                  >
                    <BarChart3 className="h-6 w-6 text-amber-300 mx-auto mb-2" />
                    <p className="text-white/80 text-sm font-medium">Analytics</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                  >
                    <Users className="h-6 w-6 text-purple-300 mx-auto mb-2" />
                    <p className="text-white/80 text-sm font-medium">Clientèle</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                  >
                    <Shield className="h-6 w-6 text-emerald-300 mx-auto mb-2" />
                    <p className="text-white/80 text-sm font-medium">Sécurisé</p>
                  </motion.div>
                </div>

                {/* Bouton de connexion premium */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleLogin}
                    className="w-full h-14 bg-gradient-to-r from-violet-500 via-purple-600 to-amber-500 hover:from-violet-600 hover:via-purple-700 hover:to-amber-600 text-white font-bold text-lg rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-amber-500/25 border border-white/20"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                    Se connecter avec Replit
                    <LogIn className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>

                {/* Badge sécurité */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <Shield className="h-4 w-4 text-emerald-300" />
                    <span className="text-white/70 text-xs font-medium">
                      Authentification sécurisée Replit
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Lien retour stylisé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-8"
          >
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="text-white/60 hover:text-white/90 hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              ← Retour à l'accueil
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}