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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Bulles décoratives violettes d'Avyento */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grande bulle gauche */}
        <div className="absolute -left-32 top-16 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl"></div>
        {/* Bulle droite haute */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-300/50 rounded-full blur-2xl"></div>
        {/* Bulle droite basse */}
        <div className="absolute -right-32 bottom-32 w-80 h-80 bg-violet-300/35 rounded-full blur-3xl"></div>
        {/* Petite bulle centre */}
        <div className="absolute left-1/3 top-1/4 w-32 h-32 bg-violet-200/30 rounded-full blur-xl"></div>
      </div>

      {/* Navigation header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-gray-900" style={{ fontSize: '40px' }}>Avyento Pro</div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">Explore</a>
                <a href="/professional-plans" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              </nav>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar gauche */}
        <div className="w-80 bg-white/90 backdrop-blur-md border-r border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Connexion</h2>
          
          <nav className="space-y-2">
            <div className="bg-violet-100 text-violet-700 px-4 py-3 rounded-lg font-medium">
              Se connecter
            </div>
            <a href="#" className="block text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Créer un compte
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Mot de passe oublié
            </a>
            <a href="/" className="block text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Retour accueil
            </a>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            {/* Titre principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Connexion Professionnelle
              </h1>
              <p className="text-gray-600 text-lg">
                Accédez à votre espace Avyento Pro - Plateforme professionnelle de beauté. L'excellence technologique au service de votre salon.
              </p>
            </motion.div>

            {/* Carte de connexion */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl p-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Espace Professionnel
                    </h2>
                    <p className="text-gray-600">
                      Connectez-vous pour accéder à votre dashboard
                    </p>
                  </div>

                  {/* Fonctionnalités premium */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100"
                    >
                      <Calendar className="h-6 w-6 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">Planning IA</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100"
                    >
                      <BarChart3 className="h-6 w-6 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">Analytics</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100"
                    >
                      <Users className="h-6 w-6 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">Équipe</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100"
                    >
                      <Crown className="h-6 w-6 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">Premium</span>
                    </motion.div>
                  </div>

                  {/* Bouton de connexion */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-4"
                  >
                    <Button
                      onClick={handleLogin}
                      size="lg"
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-700 text-xs font-medium">
                        Authentification sécurisée Replit
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Section informations supplémentaires */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 text-sm mb-4">
                Nouveau sur Avyento Pro ?
              </p>
              <div className="flex justify-center space-x-4">
                <a href="/professional-plans" className="text-violet-600 hover:text-violet-700 text-sm font-medium underline">
                  Découvrir nos offres
                </a>
                <a href="/demo" className="text-violet-600 hover:text-violet-700 text-sm font-medium underline">
                  Demander une démo
                </a>
              </div>
            </motion.div>
          </div>
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