import { useState } from "react";
import { Check, ArrowLeft, Crown, Zap, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ProfessionalPlans() {
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'essentiel',
      name: 'Essentiel',
      tagline: 'Pour commencer',
      monthlyPrice: 29,
      yearlyPrice: 290,
      originalYearlyPrice: 348,
      features: [
        'Planning et réservations',
        'Gestion clientèle',
        'Notifications automatiques',
        'Paiements sécurisés',
        'Support email'
      ],
      limits: 'Jusqu\'à 200 RDV/mois',
      popular: false,
      icon: <Users className="w-5 h-5 text-gray-600" />
    },
    {
      id: 'professionnel',
      name: 'Professionnel',
      tagline: 'Le plus populaire',
      monthlyPrice: 79,
      yearlyPrice: 790,
      originalYearlyPrice: 948,
      features: [
        'Tout de l\'Essentiel',
        'Analytics avancés',
        'Marketing automation',
        'Multi-établissements (3 max)',
        'Support prioritaire'
      ],
      limits: 'Jusqu\'à 1000 RDV/mois',
      popular: true,
      icon: <Zap className="w-5 h-5 text-violet-600" />
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Fonctionnalités avancées',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      originalYearlyPrice: 1788,
      features: [
        'Tout du Professionnel',
        'Assistant IA intégré',
        'Messagerie clients illimitée',
        'Établissements illimités',
        'Support VIP 24/7'
      ],
      limits: 'RDV illimités',
      popular: false,
      icon: <Crown className="w-5 h-5 text-amber-600" />
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setLocation(`/business-registration?plan=${planId}`);
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === 'annual') {
      return Math.round(((plan.originalYearlyPrice - plan.yearlyPrice) / plan.originalYearlyPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header très simple */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              className="text-gray-700 hover:text-gray-900 hover:bg-white/30 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Tarifs</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-6xl md:py-12">
        {/* Titre responsive */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 md:text-4xl md:mb-4">
            Trouvez le plan parfait
          </h1>
          <p className="text-base text-gray-600 mb-6 md:text-xl md:mb-8">
            Commencez gratuitement, upgradez quand vous voulez
          </p>

          {/* Toggle facturation responsive */}
          <div className="inline-flex items-center glass-effect rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all md:px-6 md:py-3 md:text-base ${
                billingCycle === 'monthly' 
                  ? 'glass-button text-gray-900 shadow-md' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all md:px-6 md:py-3 md:text-base ${
                billingCycle === 'annual' 
                  ? 'glass-button text-gray-900 shadow-md' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-1 px-1.5 py-0.5 bg-green-100/80 text-green-700 text-xs rounded-full md:ml-2 md:px-2 md:py-1">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans responsive */}
        <div className="space-y-4 mb-8 md:grid md:grid-cols-3 md:gap-6 md:space-y-0 lg:gap-12 md:mb-16">
          {plans.map((plan) => {
            const currentPrice = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <div 
                key={plan.id}
                className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 md:p-8 md:rounded-2xl md:hover:shadow-2xl ${
                  plan.popular 
                    ? 'glass-effect ring-2 ring-violet-400/30 shadow-2xl shadow-violet-400/20' 
                    : 'glass-card hover:bg-white/15'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 md:-top-4">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold md:px-4 md:py-2 md:text-sm shadow-lg">
                      Recommandé
                    </div>
                  </div>
                )}
                
                {/* Icon et nom mobile */}
                <div className="flex items-center gap-3 mb-4 md:text-center md:block md:mb-8">
                  <div className="flex-shrink-0 md:flex md:justify-center md:mb-4">
                    <div className="p-2 glass-button rounded-full md:p-3">
                      {plan.icon}
                    </div>
                  </div>
                  
                  <div className="md:text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 md:text-2xl md:mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 md:text-base">
                      {plan.tagline}
                    </p>
                  </div>
                </div>
                
                {/* Prix responsive */}
                <div className="mb-4 md:text-center md:mb-8">
                  <div className="flex items-baseline gap-1 md:justify-center md:mb-2">
                    <span className="text-2xl font-bold text-gray-900 md:text-5xl">
                      {currentPrice}€
                    </span>
                    <span className="text-sm text-gray-600 md:text-xl">
                      /mois
                    </span>
                  </div>
                  
                  {billingCycle === 'annual' && savings > 0 && (
                    <div className="text-sm text-green-600 font-medium md:font-semibold">
                      Économisez {savings}% par an
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mt-1 md:mt-2">
                    {plan.limits}
                  </div>
                </div>

                {/* Fonctionnalités compactes */}
                <div className="space-y-2 mb-4 md:space-y-4 md:mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 md:w-5 md:h-5" />
                      <span className="text-sm text-gray-700 md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton responsive */}
                <Button 
                  className={`w-full h-10 text-sm font-medium rounded-lg md:h-14 md:text-lg md:font-semibold md:rounded-xl glass-button hover:glass-effect text-black shadow-lg transition-all duration-300 ${
                    plan.popular 
                      ? 'ring-2 ring-violet-400/30' 
                      : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                >
                  Commencer gratuitement
                </Button>
              </div>
            );
          })}
        </div>

        {/* Section garantie responsive */}
        <div className="text-center bg-gray-50 rounded-xl p-6 md:rounded-2xl md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="p-3 bg-white rounded-full shadow-md md:p-4">
                <Shield className="w-6 h-6 text-green-500 md:w-8 md:h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 md:text-2xl md:mb-4">
              Essai gratuit de 14 jours
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed md:text-lg">
              Testez toutes les fonctionnalités sans engagement. 
              Aucune carte de crédit requise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}