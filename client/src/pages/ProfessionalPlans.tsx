import { useState } from "react";
import { Check, Star, Zap, Sparkles, ArrowRight, Shield, Users, BarChart3, Brain, CreditCard, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ProfessionalPlans() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'essentiel',
      name: 'ESSENTIEL',
      icon: <Sparkles className="w-6 h-6" />,
      tagline: 'Pour démarrer sereinement',
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        'Gestion des créneaux et planning complet',
        'Gestion clientèle (fiches, historique, notes)',
        'Réservation client intuitive + expérience personnalisée',
        'Praticité quotidienne (rappels, géolocalisation, paiement)',
        'Conformité RGPD',
        'Support par email'
      ],
      limits: '200 RDV/mois, 1 établissement',
      color: 'from-green-500 to-emerald-600',
      popular: false
    },
    {
      id: 'professionnel',
      name: 'PROFESSIONNEL',
      icon: <Zap className="w-6 h-6" />,
      tagline: 'Pour développer son business',
      monthlyPrice: 79,
      yearlyPrice: 65,
      features: [
        'Tout l\'Essentiel +',
        'Aspects financiers complets (facturation, stats CA, export comptable)',
        'Communication & marketing (promos ciblées, galerie, avis, chat)',
        'Analytics avancés + reviews bidirectionnelles',
        'Multi-établissements (jusqu\'à 3)',
        'IA Smart planning + prédiction no-show',
        'Assistant comptable IA + rapprochement bancaire',
        'Forum pro communautaire'
      ],
      limits: '1000 RDV/mois',
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      icon: <Star className="w-6 h-6" />,
      tagline: 'L\'arsenal complet du pro moderne',
      monthlyPrice: 149,
      yearlyPrice: 125,
      features: [
        'Tout le Professionnel +',
        'IA complète : rebooking auto, copilot business, relance intelligente',
        'Marketing intelligent : fidélité dynamique, UGC auto, cartes cadeaux IA',
        'Fonctionnalités client boostées : routine beauté IA, reconnaissance visuelle',
        'Détails uniques : statut VIP, mode cowork, voice booking, mini CRM',
        'Établissements illimités',
        'RDV illimités',
        'Support prioritaire + formation personnalisée'
      ],
      limits: 'Illimité',
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    
    // Créer directement la session de paiement Stripe
    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: planId,
          customerEmail: 'professionnel@example.com',
          customerName: 'Professionnel Test',
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      // Fallback vers la page d'inscription en cas d'erreur
      setLocation(`/salon-registration?plan=${planId}`);
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice * 12;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header compact */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-wide" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif', fontWeight: 600, letterSpacing: '0.02em' }}>Rendly</h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-violet-600"
            >
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Hero Section ultra-compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-3 py-1 mb-3">
            <Shield className="w-3 h-3 text-violet-600" />
            <span className="text-xs font-medium text-violet-700">14 jours gratuits</span>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Plans <span className="text-gradient">professionnels</span>
          </h1>
          
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Développez votre salon avec Rendly
          </p>

          {/* Toggle de facturation ultra-compact */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`text-xs ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-violet-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annuel
            </span>
            {billingCycle === 'annual' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0">
                -25%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans de tarification ultra-compacts */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'ring-2 ring-violet-500 shadow-lg' : 'hover:scale-[1.02]'
              } ${selectedPlan === plan.id ? 'ring-2 ring-violet-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-center py-1 text-xs font-semibold">
                    Le plus populaire
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-6' : 'pt-3'} pb-2`}>
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-1.5 rounded-md bg-gradient-to-r ${plan.color}`}>
                    <div className="text-white">{plan.icon}</div>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                  {plan.name}
                </CardTitle>
                
                <p className="text-gray-600 text-xs mb-2">{plan.tagline}</p>
                
                <div className="space-y-0.5">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {getPrice(plan)}€
                    </span>
                    <span className="text-gray-500 text-xs">/mois</span>
                  </div>
                  
                  {billingCycle === 'annual' && (
                    <div className="text-xs text-green-600 font-medium">
                      -{getSavings(plan)}€/an
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {plan.limits}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 px-3 pb-3">
                <div className="space-y-1.5">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-xs leading-tight">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="text-xs text-gray-500 text-center font-medium">
                      +{plan.features.length - 3} fonctionnalités
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  size="sm"
                  className={`w-full h-8 text-xs font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'gradient-bg text-white hover:opacity-90' 
                      : 'border border-gray-300 text-gray-700 hover:border-violet-500 hover:text-violet-600 bg-white hover:bg-violet-50'
                  }`}
                >
                  Essai gratuit
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section garanties ultra-compacte */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 gradient-bg rounded-md flex items-center justify-center mx-auto mb-2">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs mb-1">Sécurisé</h3>
              <p className="text-gray-600 text-xs">RGPD & SSL</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 gradient-bg rounded-md flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs mb-1">Support 7j/7</h3>
              <p className="text-gray-600 text-xs">Experts beauté</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 gradient-bg rounded-md flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs mb-1">ROI +35%</h3>
              <p className="text-gray-600 text-xs">Plus de réservations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}