import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import avyentoLogo from "@assets/Logo avyento._1755812542143.png";

export default function ProfessionalPlans() {
  const [, setLocation] = useLocation();
  const [, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number, type: 'percentage' | 'fixed'} | null>(null);

  // Codes promo disponibles (gardés pour /register)
  const availablePromoCodes = {
    'AVYENTO2025': { discount: 20, type: 'percentage' as const, description: '20% de réduction' },
    'SALON50': { discount: 50, type: 'fixed' as const, description: '50€ de réduction' },
    'PREMIUM15': { discount: 15, type: 'percentage' as const, description: '15% de réduction' },
    'FIRST100': { discount: 100, type: 'fixed' as const, description: '100€ de réduction' },
    'EMPIRE100': { discount: 100, type: 'fixed' as const, description: '100€ de réduction sur Beauty Empire' },
    'FREE149': { discount: 149, type: 'fixed' as const, description: 'Abonnement gratuit - 149€ de réduction' },
  };

  const getDiscountedPrice = (originalPrice: number) => {
    if (!appliedPromo) return originalPrice;
    
    if (appliedPromo.type === 'percentage') {
      return originalPrice * (1 - appliedPromo.discount / 100);
    } else {
      return Math.max(0, originalPrice - appliedPromo.discount);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Sauvegarder le plan sélectionné pour la page register
    localStorage.setItem('selectedPlan', planId);
    setLocation('/register');
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
                  className="w-auto cursor-pointer"
                  style={{ height: '115px' }}
                  onClick={() => setLocation('/')}
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
            Essai gratuit 7 jours - sans engagement
          </p>
        </div>

        {/* Plan Toggle Buttons */}
        <div className="flex items-center justify-center mb-8 space-x-2 sm:space-x-4">
          <Button 
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 sm:px-8 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-200 ${
              !isYearly 
                ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            variant={!isYearly ? "default" : "outline"}
          >
            Mensuel
          </Button>
          <Button 
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 sm:px-8 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-200 ${
              isYearly 
                ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            variant={isYearly ? "default" : "outline"}
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
                  <span className="text-5xl font-bold text-green-600">29</span>
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
              <Badge className="bg-white/90 text-violet-800 px-4 py-1 rounded-full border border-white/30 text-xs font-bold shadow-lg">
                Le plus populaire
              </Badge>
            </div>
            <Card className="glass-card-violet shadow-2xl rounded-3xl border-0 overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="text-white mb-4 pt-4">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-light">€</span>
                    <span className="text-5xl font-bold text-white">79</span>
                    <span className="text-base font-normal ml-2">/ mois</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Professionnel
                </h3>
                
                <p className="text-white/90 text-sm mb-4 font-medium">
                  Le plus populaire
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-center">
                  <div className="flex items-center justify-center text-sm text-white font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Tout de l'Essentiel</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-white font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Analytics avancés</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-white font-medium">
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
                  <span className="text-5xl font-bold text-green-600">149</span>
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
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-white/90 text-violet-800 px-6 py-2 rounded-full border border-white/30 text-sm font-bold shadow-lg">
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
                
                <p className="text-white/90 text-sm mb-6 font-medium">
                  Le plus populaire
                </p>

                {/* 3 éléments descriptifs */}
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-white font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Tout de l'Essentiel</span>
                  </div>
                  <div className="flex items-center text-sm text-white font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                    <span>Analytics avancés</span>
                  </div>
                  <div className="flex items-center text-sm text-white font-medium">
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

      {/* Section stats minimaliste */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Une solution complète pour votre salon</h2>
            <p className="text-lg text-gray-600">Tout ce dont vous avez besoin, rien de superflu</p>
          </div>
          
          {/* Grid simple et épuré */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">24h/24</div>
              <div className="text-gray-900 font-medium mb-1">Prise de RDV</div>
              <div className="text-gray-500 text-sm">Réservations automatiques</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">NF525</div>
              <div className="text-gray-900 font-medium mb-1">Caisse certifiée</div>
              <div className="text-gray-500 text-sm">Conforme à la loi française</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">0€</div>
              <div className="text-gray-900 font-medium mb-1">Frais cachés</div>
              <div className="text-gray-500 text-sm">Transparence totale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section IA - Différenciateur majeur */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full"></span>
              <span className="text-xs font-medium text-violet-700">EXCLUSIF</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              La première IA beauté au monde
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous sommes les seuls à proposer une intelligence artificielle spécialisée pour les salons
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Fonctionnalités IA */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimisation intelligente</h3>
                <p className="text-gray-600 text-sm">L'IA analyse vos données pour optimiser automatiquement votre planning et maximiser vos revenus</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommandations personnalisées</h3>
                <p className="text-gray-600 text-sm">Suggestions de services adaptées à chaque client basées sur son historique et ses préférences</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prédictions avancées</h3>
                <p className="text-gray-600 text-sm">Anticipation des tendances et détection automatique des créneaux les plus rentables</p>
              </div>
            </div>

            {/* Impact chiffres */}
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Impact mesuré</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-violet-600 mb-1">+35%</div>
                    <div className="text-xs text-gray-500">CA moyen</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-600 mb-1">-70%</div>
                    <div className="text-xs text-gray-500">Temps admin</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-600 mb-1">98%</div>
                    <div className="text-xs text-gray-500">Précision</div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Exclusivité Avyento</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section fonctionnalités */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-100 hover:border-violet-200 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing automatisé</h3>
              <p className="text-gray-600 text-sm">Campagnes de fidélisation et promotions personnalisées pour augmenter votre chiffre d'affaires</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-100 hover:border-violet-200 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Gestion complète</h3>
              <p className="text-gray-600 text-sm">Clients, agendas, équipe et statistiques centralisés dans une interface simple</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-100 hover:border-violet-200 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analyses détaillées</h3>
              <p className="text-gray-600 text-sm">Rapports et insights pour optimiser vos performances et prendre les bonnes décisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section garanties simple */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos engagements</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-1">7 jours</div>
              <div className="text-gray-500 text-sm">Essai gratuit</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-500 text-sm">Support français</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-1">30 jours</div>
              <div className="text-gray-500 text-sm">Satisfait ou remboursé</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Gratuit</div>
              <div className="text-gray-500 text-sm">Migration de données</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Professionnels - Design exact */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Émojis flottants dans bulles pastelles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-16 w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/40 to-purple-300/30 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-12" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
            <span className="text-lg">⚡</span>
          </div>
          <div className="absolute top-32 right-24 w-12 h-12 rounded-full bg-gradient-to-br from-pink-200/35 to-rose-300/25 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '2s', animationDuration: '3s' }}>
            <span className="text-lg">💡</span>
          </div>
          <div className="absolute bottom-32 left-12 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-300/30 backdrop-blur-sm flex items-center justify-center animate-bounce transform rotate-45" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}>
            <span className="text-lg">❓</span>
          </div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/35 to-green-300/25 backdrop-blur-sm flex items-center justify-center animate-bounce transform -rotate-12" style={{ animationDelay: '3s', animationDuration: '4s' }}>
            <span className="text-lg">🔧</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Badge et titre exactement comme sur la capture */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Questions Fréquentes
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Questions <span className="text-violet-600">fréquentes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes sur Avyento
            </p>
          </div>

          {/* FAQ avec design exact et effets identiques */}
          <div className="space-y-6">
            <details className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-lg hover:bg-violet-50 transition-colors">
                Combien de temps faut-il pour configurer Avyento ?
                <svg className="w-6 h-6 text-violet-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                La prise en main est simple et intuitive, la configuration prend environ 30 minutes. Vous avez accès directement à votre espace après inscription et nous restons disponibles si vous avez besoin d'aide.
              </div>
            </details>

            <details className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-lg hover:bg-violet-50 transition-colors">
                Mes données actuelles peuvent-elles être récupérées ?
                <svg className="w-6 h-6 text-violet-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                Oui, nous importons gratuitement vos clients, historique des rendez-vous et services depuis la plupart des logiciels de gestion existants.
              </div>
            </details>

            <details className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-lg hover:bg-violet-50 transition-colors">
                Que se passe-t-il si je veux changer d'abonnement ?
                <svg className="w-6 h-6 text-violet-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                Vous pouvez passer d'un plan à l'autre à tout moment. Le changement est immédiat et proratisé selon votre période de facturation.
              </div>
            </details>

            <details className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-lg hover:bg-violet-50 transition-colors">
                L'IA fonctionne-t-elle dès le premier jour ?
                <svg className="w-6 h-6 text-violet-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                L'IA commence à apprendre dès le premier jour et s'améliore avec le temps. Les recommandations de base sont disponibles immédiatement, les prédictions avancées sont vraiment efficaces après quelques semaines d'utilisation.
              </div>
            </details>

            <details className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-lg hover:bg-violet-50 transition-colors">
                Y a-t-il des frais de transaction sur les paiements ?
                <svg className="w-6 h-6 text-violet-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                Aucun frais de transaction. Vous payez uniquement votre abonnement mensuel, quel que soit le nombre de paiements traités par votre salon.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Footer - Identique à la page / */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La solution intelligente qui anticipe, planifie et maximise vos résultats.
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