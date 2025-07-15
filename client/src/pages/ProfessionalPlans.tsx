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
      emoji: '🌱',
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
      emoji: '🚀',
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
      emoji: '⭐',
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
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BeautyBook Pro</h1>
                <p className="text-xs text-gray-500 -mt-1">Abonnements professionnels</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-violet-600"
            >
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">14 jours d'essai gratuit</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
            <span className="block text-gradient mt-2">professionnel</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Développez votre salon avec nos outils professionnels. Commencez votre essai gratuit aujourd'hui.
          </p>

          {/* Toggle de facturation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-violet-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annuel
            </span>
            {billingCycle === 'annual' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                Économisez jusqu'à 25%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans de tarification */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-violet-500 shadow-xl scale-105' : 'hover:scale-105'
              } ${selectedPlan === plan.id ? 'ring-2 ring-violet-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    ⭐ Le plus populaire
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">{plan.emoji}</span>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${plan.color}`}>
                    <div className="text-white">{plan.icon}</div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                
                <p className="text-gray-600 mb-6">{plan.tagline}</p>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {getPrice(plan)}€
                    </span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  
                  {billingCycle === 'annual' && (
                    <div className="text-sm text-green-600 font-medium">
                      Économisez {getSavings(plan)}€/an
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {plan.limits}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full h-12 font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'gradient-bg text-white hover:opacity-90 shadow-lg hover:shadow-xl' 
                      : 'border-2 border-gray-300 text-gray-700 hover:border-violet-500 hover:text-violet-600 bg-white hover:bg-violet-50'
                  }`}
                >
                  <span>Commencer l'essai gratuit</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  14 jours gratuits • Annulation à tout moment
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section garanties et support */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi choisir BeautyBook Pro ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sécurité garantie</h3>
              <p className="text-gray-600 text-sm">Conformité RGPD, données chiffrées et sauvegardes automatiques</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support expert</h3>
              <p className="text-gray-600 text-sm">Équipe dédiée aux professionnels de la beauté disponible 7j/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ROI prouvé</h3>
              <p className="text-gray-600 text-sm">+35% de réservations en moyenne avec nos outils IA</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Puis-je changer de plan à tout moment ?
              </summary>
              <p className="text-gray-600 mt-3 text-left">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                L'essai gratuit nécessite-t-il une carte bancaire ?
              </summary>
              <p className="text-gray-600 mt-3 text-left">
                Non, aucune carte bancaire n'est requise pour commencer votre essai de 14 jours. Vous ne serez facturé qu'après la période d'essai.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Mes données sont-elles transférables ?
              </summary>
              <p className="text-gray-600 mt-3 text-left">
                Absolument. Nous proposons un service de migration gratuit et vos données vous appartiennent toujours.
              </p>
            </details>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Nous appeler
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat en direct
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}