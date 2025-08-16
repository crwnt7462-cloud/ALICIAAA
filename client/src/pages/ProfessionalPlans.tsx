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
          {/* Plan Professionnel - Populaire en premier */}
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
                
                <p className="text-violet-100 text-sm mb-6">
                  Le plus populaire
                </p>
                
                <Button 
                  onClick={() => handleSelectPlan('professionnel')}
                  className="w-full py-3 text-base font-medium rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>

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
              
              <p className="text-gray-500 text-sm mb-6">
                Pour commencer
              </p>
              
              <Button 
                onClick={() => handleSelectPlan('essentiel')}
                className="w-full py-3 text-base font-medium rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>

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
              
              <p className="text-gray-500 text-sm mb-6">
                Fonctionnalités avancées
              </p>
              
              <Button 
                onClick={() => handleSelectPlan('premium')}
                className="w-full py-3 text-base font-medium rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout - Exact Slay asymmetric layout */}
        <div className="hidden lg:block relative flex items-start justify-center min-h-[500px] mb-20">
          {/* Carte de gauche - décalée vers le bas et inclinée */}
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
                
                <p className="text-gray-500 text-sm mb-8">
                  Pour commencer
                </p>
                
                <Button 
                  onClick={() => handleSelectPlan('essentiel')}
                  className="w-full py-4 text-lg font-medium rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Carte centrale - surélevée */}
          <div className="relative z-10">
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
                
                <p className="text-violet-100 text-sm mb-8">
                  Le plus populaire
                </p>
                
                <Button 
                  onClick={() => handleSelectPlan('professionnel')}
                  className="w-full py-4 text-lg font-medium rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Carte de droite - décalée vers le bas et inclinée */}
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
                
                <p className="text-gray-500 text-sm mb-8">
                  Fonctionnalités avancées
                </p>
                
                <Button 
                  onClick={() => handleSelectPlan('premium')}
                  className="w-full py-4 text-lg font-medium rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="pb-8 sm:pb-16"></div>
      </div>
    </div>
  );
}