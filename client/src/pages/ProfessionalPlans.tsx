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
      {/* Header épuré */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Plans professionnels</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section minimaliste */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Shield className="w-4 h-4" />
            14 jours d'essai gratuit
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Des outils puissants pour faire grandir votre salon de beauté
          </p>

          {/* Toggle de facturation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
              </button>
            </div>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Économisez 25%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans de tarification */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const currentPrice = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-2 rounded-xl ${
                  plan.popular 
                    ? 'border-violet-500 shadow-lg ring-2 ring-violet-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-violet-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                      Le plus populaire
                    </div>
                  </div>
                )}
                
                <CardContent className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                  {/* Header du plan */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-3">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {plan.tagline}
                    </p>
                    
                    {/* Prix */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-gray-900">
                          {currentPrice}€
                        </span>
                        <span className="text-gray-600">
                          /{billingCycle === 'monthly' ? 'mois' : 'mois'}
                        </span>
                      </div>
                      
                      {billingCycle === 'annual' && savings > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Économisez {savings}% par an
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500 mt-1">
                        {plan.limits}
                      </div>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bouton CTA */}
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan.id);
                    }}
                  >
                    Commencer l'essai gratuit
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section garantie */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Garantie 14 jours</span>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Essayez Rendly gratuitement pendant 14 jours. 
            Aucune carte de crédit requise. Annulation possible à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}