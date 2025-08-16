import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, Sparkles, Calendar, BarChart3, Users, Shield, Crown } from 'lucide-react';

export default function ProLogin() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Émojis flottants diffus style Avyento */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {['💫', '✨', '💎', '🌟', '💜', '🔮'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl"
            initial={{ 
              opacity: 0.1
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20 + index * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index * 10)}%`,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>



      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo Avyento Pro centré */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.h1
              className="font-bold flex items-center justify-center mb-4"
              style={{ fontSize: '40px' }}
            >
              <img 
                src="/generated-icon.png" 
                alt="Avyento Pro" 
                className="inline-block mr-3"
                style={{ width: '40px', height: '40px' }}
              />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                Avyento Pro
              </span>
            </motion.h1>
          </motion.div>

          {/* Carte minimaliste style Avyento */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl p-8 rounded-3xl">
              <div className="space-y-8">
                {/* Titre de la section */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Espace Professionnel
                  </h2>
                  <p className="text-gray-600">
                    Connectez-vous pour accéder à votre dashboard
                  </p>
                </div>

                {/* Icônes des fonctionnalités - Style minimaliste */}
                <div className="grid grid-cols-2 gap-6 py-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-violet-50/50 transition-colors"
                  >
                    <Calendar className="h-12 w-12 text-violet-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Planning IA</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-violet-50/50 transition-colors"
                  >
                    <BarChart3 className="h-12 w-12 text-violet-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Analytics</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-violet-50/50 transition-colors"
                  >
                    <Users className="h-12 w-12 text-violet-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Équipe</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-violet-50/50 transition-colors"
                  >
                    <Crown className="h-12 w-12 text-violet-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Premium</span>
                  </motion.div>
                </div>

                {/* Bouton de connexion minimaliste */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleLogin}
                    size="lg"
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    Se connecter avec Replit
                    <LogIn className="h-5 w-5 ml-3" />
                  </Button>
                </motion.div>

                {/* Badge sécurité minimaliste */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    Authentification sécurisée Replit
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Lien retour minimaliste */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-6"
          >
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              ← Retour à l'accueil
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer - Identique à la page d'accueil */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La plateforme IA qui révolutionne la beauté et optimise vos revenus.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/search'}
                >
                  Coiffure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/search'}
                >
                  Esthétique
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/search'}
                >
                  Manucure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/search'}
                >
                  Massage
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partenaires</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/devenir-partenaire'}
                >
                  Devenir partenaire
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/tarifs-pros'}
                >
                  Tarifs professionnels
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/formation'}
                >
                  Formation & Support
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/success-stories'}
                >
                  Témoignages
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/centre-aide'}
                >
                  Centre d'aide
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/cgu'}
                >
                  CGU
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => window.location.href = '/confidentialité'}
                >
                  Confidentialité
                </div>
              </div>
            </div>

          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Avyento. Tous droits réservés.
            </p>
            <div className="flex gap-3 mt-4 md:mt-0">
              <a href="https://twitter.com/avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.818.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.369-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://tiktok.com/@avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.197 10.157v4.841c0 2.13-1.72 3.85-3.85 3.85s-3.85-1.72-3.85-3.85 1.72-3.85 3.85-3.85c.212 0 .424.017.63.052v2.08c-.2-.035-.408-.052-.63-.052-1.02 0-1.85.83-1.85 1.85s.83 1.85 1.85 1.85 1.85-.83 1.85-1.85V2h2v2.9c0 1.61 1.31 2.92 2.92 2.92V9.9c-1.61 0-2.92-1.31-2.92-2.92v-.74zm4.18-3.22c-.78-.78-1.26-1.85-1.26-3.04V2h1.89c.13 1.19.61 2.26 1.39 3.04.78.78 1.85 1.26 3.04 1.26v1.89c-1.19-.13-2.26-.61-3.04-1.39z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}