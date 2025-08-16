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
    <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-amber-900 relative overflow-hidden">
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pb-20">
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
              className="font-bold mb-2"
              style={{ fontSize: '40px' }}
            >
              <span className="bg-gradient-to-r from-white via-violet-200 to-amber-200 bg-clip-text text-transparent">
                Avyento Pro
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
                  onClick={() => window.location.href = '/confidentialite'}
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