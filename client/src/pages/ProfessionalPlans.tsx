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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Rediriger vers la page d'inscription/paiement
    setLocation(`/subscribe?plan=${planId}&billing=${billingCycle}`);
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">BeautyBook Pro</h1>
              </div>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section compact */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-3 py-1 mb-4">
            <Shield className="w-3 h-3 text-violet-600" />
            <span className="text-xs font-medium text-violet-700">14 jours gratuits</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Choisissez votre plan <span className="text-gradient">professionnel</span>
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Développez votre salon avec nos outils professionnels
          </p>

          {/* Toggle de facturation compact */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-violet-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annuel
            </span>
            {billingCycle === 'annual' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                -25%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans de tarification compacts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
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
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-8' : 'pt-4'} pb-3`}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}>
                    <div className="text-white">{plan.icon}</div>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mb-3">{plan.tagline}</p>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {getPrice(plan)}€
                    </span>
                    <span className="text-gray-500 text-sm">/mois</span>
                  </div>
                  
                  {billingCycle === 'annual' && (
                    <div className="text-xs text-green-600 font-medium">
                      Économisez {getSavings(plan)}€/an
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {plan.limits}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 px-4 pb-4">
                <div className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{plan.features.length - 4} autres fonctionnalités
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  size="sm"
                  className={`w-full font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'gradient-bg text-white hover:opacity-90' 
                      : 'border border-gray-300 text-gray-700 hover:border-violet-500 hover:text-violet-600 bg-white hover:bg-violet-50'
                  }`}
                >
                  <span>Essai gratuit</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  14 jours gratuits
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section garanties compacte */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Sécurité garantie</h3>
              <p className="text-gray-600 text-xs">Conformité RGPD et chiffrement SSL</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Support expert</h3>
              <p className="text-gray-600 text-xs">Équipe dédiée beauté 7j/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">ROI prouvé</h3>
              <p className="text-gray-600 text-xs">+35% de réservations en moyenne</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-3 h-3" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="w-3 h-3" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}