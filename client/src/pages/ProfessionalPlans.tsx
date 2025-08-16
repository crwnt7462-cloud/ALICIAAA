import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import avyentoLogo from "@assets/avyento. (1)_1755286272417.png";

export default function ProfessionalPlans() {
  const [, setLocation] = useLocation();
  const [, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'essentiel',
      name: 'Essentiel',
      tagline: 'Pour commencer',
      price: 29,
      period: 'mois',
      yearlyPrice: 290,
      originalYearlyPrice: 348,
      description: 'Parfait pour débuter votre activité salon',
      features: [
        'Planning et réservations',
        'Gestion clientèle',
        'Notifications automatiques',
        'Paiements sécurisés',
        'Support email'
      ],
      limits: "Jusqu'à 200 RDV/mois",
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'professionnel',
      name: 'Professionnel',
      tagline: 'Le plus populaire',
      price: 79,
      period: 'mois',
      yearlyPrice: 790,
      originalYearlyPrice: 948,
      description: 'Idéal pour les salons établis avec plusieurs services',
      features: [
        "Tout de l'Essentiel",
        'Analytics avancés',
        'Marketing automation',
        'Multi-établissements (3 max)',
        'Support prioritaire'
      ],
      limits: "Jusqu'à 1000 RDV/mois",
      popular: true,
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      textColor: 'text-white',
      buttonColor: 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Fonctionnalités avancées',
      price: 149,
      period: 'mois',
      yearlyPrice: 1490,
      originalYearlyPrice: 1788,
      description: 'Solution complète pour les grands salons et chaînes',
      features: [
        'Tout du Professionnel',
        'Assistant IA intégré',
        'Messagerie clients illimitée',
        'Établissements illimités',
        'Support VIP 24/7'
      ],
      limits: 'RDV illimités',
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setLocation(`/subscription-payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header - Style Landing */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <img 
                  src={avyentoLogo} 
                  alt="Avyento Logo" 
                  className="h-8 w-auto sm:h-10"
                />
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <button onClick={() => setLocation('/')} className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                  Accueil
                </button>
                <button onClick={() => setLocation('/search')} className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                  Rechercher
                </button>
                <button onClick={() => setLocation('/professional-plans')} className="text-violet-600 font-semibold">
                  Tarifs Pro
                </button>
                <button onClick={() => setLocation('/pro-login')} className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                  Connexion Pro
                </button>
              </nav>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button 
                  onClick={() => setLocation('/register')}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-3 py-2 sm:px-6 text-sm sm:text-base rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="hidden sm:inline">Inscription Gratuite</span>
                  <span className="sm:hidden">S'inscrire</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Spacer for fixed header */}
        <div className="h-16"></div>

        {/* Trial Badge */}
        <div className="text-center mb-8">
          <Badge className="bg-violet-100 text-violet-600 px-4 py-2 rounded-full border border-violet-200">
            ✨ RÉVOLUTIONNEZ VOTRE SALON
          </Badge>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-2">
            Choisissez l'excellence pour votre salon
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Essai gratuit de 30 jours - Aucun engagement
          </p>
        </div>

        {/* Plan Toggle Buttons */}
        <div className="flex items-center justify-center mb-12 sm:mb-20 space-x-2 sm:space-x-4">
          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full font-medium text-sm sm:text-base"
          >
            Mensuel
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 sm:px-8 sm:py-3 rounded-full font-medium text-sm sm:text-base"
          >
            Annuel (-20%)
          </Button>
        </div>

        {/* Pricing Cards - Responsive: Stack on mobile, Asymmetric Slay layout on desktop */}
        
        {/* Mobile Layout - Stack vertical */}
        <div className="block lg:hidden space-y-6 mb-20 px-2">
          {/* Plan Essentiel */}
          <Card className="bg-white shadow-lg rounded-3xl border-0 overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="text-gray-800 mb-4">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-3xl font-light">€</span>
                  <span className="text-5xl font-bold">29</span>
                  <span className="text-base font-normal ml-2">/ mois</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Essentiel
              </h3>
              
              <p className="text-gray-500 text-sm mb-4">
                Pour commencer
              </p>

              {/* 3 éléments descriptifs */}
              <div className="space-y-2 mb-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Planning et réservations</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Jusqu'à 200 RDV/mois</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Gestion clientèle</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSelectPlan('essentiel')}
                className="w-full glass-button text-black py-3 text-base font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Commencer l'essai gratuit
              </button>
            </CardContent>
          </Card>

          {/* Plan Professionnel - Populaire au milieu */}
          <div className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-white/20 text-white px-4 py-1 rounded-full border border-white/20 text-xs font-medium">
                Le plus populaire
              </Badge>
            </div>
            <Card className="glass-card-violet shadow-2xl rounded-3xl border-0 overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="text-white mb-4 pt-4">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-light">€</span>
                    <span className="text-5xl font-bold">79</span>
                    <span className="text-base font-normal ml-2">/ mois</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Professionnel
                </h3>
                
                <p className="text-violet-100 text-sm mb-4">
                  Le plus populaire
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-center">
                  <div className="flex items-center justify-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Tout de l'Essentiel</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Analytics avancés</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Jusqu'à 1000 RDV/mois</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan('professionnel')}
                  className="w-full py-3 text-base font-medium rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Plan Premium */}
          <Card className="bg-white shadow-lg rounded-3xl border-0 overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="text-gray-800 mb-4">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-3xl font-light">€</span>
                  <span className="text-5xl font-bold">149</span>
                  <span className="text-base font-normal ml-2">/ mois</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Premium
              </h3>
              
              <p className="text-gray-500 text-sm mb-4">
                Fonctionnalités avancées
              </p>

              {/* 3 éléments descriptifs */}
              <div className="space-y-2 mb-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Tout du Professionnel</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>Assistant IA intégré</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  <span>RDV illimités</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSelectPlan('premium')}
                className="w-full glass-button text-black py-3 text-base font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Commencer l'essai gratuit
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout - Exact Slay asymmetric layout avec Professionnel AU CENTRE */}
        <div className="hidden lg:block relative flex items-start justify-center min-h-[500px] mb-20">
          {/* Carte de gauche - Essentiel décalée vers le bas et inclinée */}
          <div className="absolute left-0 top-16" style={{transform: 'rotate(-5deg)'}}>
            <Card className="bg-white shadow-lg rounded-3xl border-0 w-80 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="text-gray-800 mb-6">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-light">€</span>
                    <span className="text-6xl font-bold">29</span>
                    <span className="text-lg font-normal ml-2">/ mois</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Essentiel
                </h3>
                
                <p className="text-gray-500 text-sm mb-6">
                  Pour commencer
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>Planning et réservations</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>Jusqu'à 200 RDV/mois</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>Gestion clientèle</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSelectPlan('essentiel')}
                  className="w-full glass-button text-black py-4 text-lg font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Commencer l'essai gratuit
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Carte CENTRALE - Professionnel (LE PLUS POPULAIRE) surélevée AU CENTRE */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 z-20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-white/20 text-white px-6 py-2 rounded-full border border-white/20 text-sm font-medium">
                Le plus populaire
              </Badge>
            </div>
            <Card className="glass-card-violet shadow-2xl rounded-3xl border-0 w-96 overflow-hidden">
              <CardContent className="p-10 text-center">
                <div className="text-white mb-6 pt-6">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-light">€</span>
                    <span className="text-7xl font-bold">79</span>
                    <span className="text-xl font-normal ml-2">/ mois</span>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">
                  Professionnel
                </h3>
                
                <p className="text-violet-100 text-sm mb-6">
                  Le plus populaire
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Tout de l'Essentiel</span>
                  </div>
                  <div className="flex items-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Analytics avancés</span>
                  </div>
                  <div className="flex items-center text-sm text-violet-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Jusqu'à 1000 RDV/mois</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan('professionnel')}
                  className="w-full py-4 text-lg font-medium rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Carte de droite - Premium décalée vers le bas et inclinée */}
          <div className="absolute right-0 top-16" style={{transform: 'rotate(5deg)'}}>
            <Card className="bg-white shadow-lg rounded-3xl border-0 w-80 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="text-gray-800 mb-6">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-light">€</span>
                    <span className="text-6xl font-bold">149</span>
                    <span className="text-lg font-normal ml-2">/ mois</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Premium
                </h3>
                
                <p className="text-gray-500 text-sm mb-6">
                  Fonctionnalités avancées
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>Tout du Professionnel</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>Assistant IA intégré</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span>RDV illimités</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSelectPlan('premium')}
                  className="w-full glass-button text-black py-4 text-lg font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Commencer l'essai gratuit
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="pb-8 sm:pb-16"></div>
      </div>

      {/* Footer - Identique à la page / */}
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
                  onClick={() => setLocation('/search')}
                >
                  Coiffure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Esthétique
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Manucure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
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
                  onClick={() => setLocation('/devenir-partenaire')}
                >
                  Devenir partenaire
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/tarifs-pros')}
                >
                  Tarifs professionnels
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/formation')}
                >
                  Formation & Support
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/success-stories')}
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
                  onClick={() => setLocation('/centre-aide')}
                >
                  Centre d'aide
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/contact')}
                >
                  Contact
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/cgu')}
                >
                  CGU
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/confidentialite')}
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