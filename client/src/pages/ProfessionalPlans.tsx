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
    <div className="min-h-screen bg-gray-50">
      {/* Header ultra-minimaliste */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              className="text-gray-500 hover:text-gray-900 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900">Tarifs</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Section titre ultra simple */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Choisissez le plan qui vous convient
          </h1>
          
          <p className="text-gray-600 mb-6">
            Essai gratuit de 14 jours • Annulation à tout moment
          </p>

          {/* Toggle facturation simplifié */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Annuel
              {billingCycle === 'annual' && (
                <span className="ml-1 text-xs text-green-600">-25%</span>
              )}
            </button>
          </div>
        </div>

        {/* Plans minimalistes */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const currentPrice = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                  plan.popular 
                    ? 'border-black shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                      Le plus populaire
                    </div>
                  </div>
                )}
                
                {/* Header simplifié */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.icon}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.tagline}
                  </p>
                  
                  {/* Prix clean */}
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {currentPrice}€
                    </span>
                    <span className="text-gray-600 ml-1">
                      /mois
                    </span>
                  </div>
                  
                  {billingCycle === 'annual' && savings > 0 && (
                    <div className="text-sm text-green-600 font-medium mb-2">
                      Économisez {savings}% par an
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {plan.limits}
                  </div>
                </div>

                {/* Fonctionnalités compactes */}
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton simple */}
                <Button 
                  className={`w-full h-10 text-sm font-medium rounded-md ${
                    plan.popular 
                      ? 'bg-black hover:bg-gray-800 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                >
                  Commencer l'essai
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer simple */}
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            Toutes les fonctionnalités incluses dans l'essai gratuit de 14 jours
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Aucune carte de crédit requise
          </p>
        </div>
      </div>
    </div>
  );
}