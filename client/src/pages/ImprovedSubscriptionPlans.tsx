import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Crown, 
  Zap, 
  ArrowRight, 
  Star, 
  Users, 
  BarChart, 
  MessageSquare,
  Sparkles,
  Shield,
  Rocket,
  TrendingUp,
  Heart,
  Award,
  Gift,
  Calendar,
  Wifi,
  Clock,
  ArrowLeft
} from "lucide-react";

export default function ImprovedSubscriptionPlans() {
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planId: string) => {
    // Rediriger vers le workflow d'inscription salon avec le plan sélectionné
    setLocation(`/salon-registration-password?plan=${planId}`);
  };

  const plans = [
    {
      id: 'essential' as const,
      name: 'Beauty Essential',
      subtitle: 'Parfait pour commencer',
      monthlyPrice: 19,
      yearlyPrice: 190,
      originalYearlyPrice: 228,
      description: 'Tout l\'essentiel pour digitaliser votre salon rapidement',
      popular: false,
      color: 'from-green-500 to-emerald-600',
      icon: Users,
      ribbon: 'ÉCONOMIQUE',
      features: [
        'Planning numérique intelligent',
        'Gestion clientèle complète', 
        'Réservations web 24/7',
        'Notifications automatiques SMS/Email',
        'Paiements sécurisés Stripe',
        'Rapports de base',
        'Support par email',
        'Formation gratuite en ligne',
        'Application mobile dédiée',
        'Sauvegarde automatique des données'
      ],
      limits: 'Jusqu\'à 150 clients • 1 salon • 2 utilisateurs'
    },
    {
      id: 'professional' as const,
      name: 'Beauty Pro',
      subtitle: 'Boostez votre business',
      monthlyPrice: 49,
      yearlyPrice: 490,
      originalYearlyPrice: 588,
      description: 'Tous les outils professionnels pour développer votre activité',
      popular: true,
      color: 'from-violet-600 to-purple-700',
      icon: BarChart,
      ribbon: 'PLUS POPULAIRE',
      features: [
        '✨ TOUT du plan Essential +',
        'Analytics avancés et insights business',
        'Marketing automation intelligent', 
        'Campagnes SMS/Email personnalisées',
        'Programme de fidélité intégré',
        'Gestion des stocks et alertes',
        'Intégration réseaux sociaux',
        'Support prioritaire par téléphone',
        'Formation personnalisée 1-à-1',
        'API et intégrations tierces',
        'Multi-salons et équipes',
        'Rapports financiers détaillés'
      ],
      limits: 'Clients illimités • 3 salons • 10 utilisateurs'
    },
    {
      id: 'enterprise' as const,
      name: 'Beauty Empire',
      subtitle: 'Pour les chaînes et franchises',
      monthlyPrice: 99,
      yearlyPrice: 990,
      originalYearlyPrice: 1188,
      description: 'Solution complète pour les entreprises multi-sites',
      popular: false,
      color: 'from-amber-500 to-orange-600',
      icon: Crown,
      ribbon: 'ENTERPRISE',
      features: [
        '👑 TOUT du plan Pro +',
        'IA prédictive pour optimisation',
        'Tableau de bord multi-sites',
        'Gestion des franchises',
        'Formation équipe sur-mesure',
        'Intégration ERP/CRM existant',
        'Support dédié 24/7',
        'Consulting business mensuel',
        'White-label et personnalisation',
        'Sauvegardes multiples et sécurité renforcée',
        'Conformité RGPD automatique',
        'Analyses prédictives avancées'
      ],
      limits: 'Tout illimité • Support dédié • Développement sur-mesure'
    }
  ];

  const getCurrentPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getOriginalPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? null : plan.originalYearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingPeriod === 'yearly') {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      return Math.round((savings / monthlyCost) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Choisissez votre plan</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Offre de lancement - 30% de réduction la première année
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Révolutionnez votre
            <span className="block bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              salon de beauté
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Rejoignez plus de 10,000 professionnels qui ont choisi notre plateforme 
            pour digitaliser et développer leur activité
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                -17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = getCurrentPrice(plan);
            const originalPrice = getOriginalPrice(plan);
            const savings = getSavings(plan);

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular 
                    ? 'ring-2 ring-violet-500 shadow-xl scale-105' 
                    : 'hover:shadow-lg border-gray-200'
                }`}
              >
                {/* Ribbon */}
                {plan.ribbon && (
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${plan.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {plan.ribbon}
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                    
                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        {originalPrice && (
                          <span className="text-2xl text-gray-400 line-through">
                            {originalPrice}€
                          </span>
                        )}
                        <span className="text-4xl font-bold text-gray-900">
                          {currentPrice}€
                        </span>
                      </div>
                      
                      <p className="text-gray-600">
                        par {billingPeriod === 'monthly' ? 'mois' : 'an'}
                        {billingPeriod === 'yearly' && (
                          <span className="block text-sm text-green-600 font-medium">
                            Économisez {savings}% par an
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-700 text-center text-sm">{plan.description}</p>
                    
                    <div className="space-y-3">
                      {plan.features.slice(0, 6).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.features.length > 6 && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-violet-600 font-medium hover:text-violet-700 list-none">
                            + {plan.features.length - 6} fonctionnalités supplémentaires
                          </summary>
                          <div className="mt-3 space-y-3">
                            {plan.features.slice(6).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">{plan.limits}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full h-12 font-semibold text-base transition-all duration-300 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Commencer avec {plan.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600">Salons partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-gray-600">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support client</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Sécurisé SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">Certifié RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Satisfaction garantie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}