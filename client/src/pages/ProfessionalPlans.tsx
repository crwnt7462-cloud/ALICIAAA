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
        'IA Rendly Assistant',
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
    <div className="min-h-screen bg-white">
      {/* Header très simple */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Tarifs</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez le plan parfait
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Commencez gratuitement, upgradez quand vous voulez
          </p>

          {/* Toggle facturation large */}
          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                billingCycle === 'annual' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Facturation annuelle
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Économisez 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans très espacés et larges */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {plans.map((plan) => {
            const currentPrice = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-500 shadow-lg ring-4 ring-purple-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Recommandé
                    </div>
                  </div>
                )}
                
                {/* Icon et nom */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">
                    {plan.tagline}
                  </p>
                </div>
                
                {/* Prix très visible */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {currentPrice}€
                    </span>
                    <span className="text-xl text-gray-600">
                      /mois
                    </span>
                  </div>
                  
                  {billingCycle === 'annual' && savings > 0 && (
                    <div className="text-green-600 font-semibold">
                      Économisez {savings}% par an
                    </div>
                  )}
                  
                  <div className="text-gray-500 mt-2">
                    {plan.limits}
                  </div>
                </div>

                {/* Fonctionnalités avec plus d'espace */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton plus grand */}
                <Button 
                  className={`w-full h-14 text-lg font-semibold rounded-xl ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
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

        {/* Section garantie spacieuse */}
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-md">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Essai gratuit de 14 jours
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Testez toutes les fonctionnalités sans engagement. 
              Aucune carte de crédit requise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}