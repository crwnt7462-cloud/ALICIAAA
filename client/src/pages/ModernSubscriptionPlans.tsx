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
  Clock
} from "lucide-react";
export default function ModernSubscriptionPlans() {
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planId: string) => {
    // Mapper les IDs de plan vers les plans corrects
    const planMapping = {
      'starter': 'basic-pro',
      'professional': 'advanced-pro', 
      'enterprise': 'premium-pro'
    };
    
    const mappedPlan = planMapping[planId as keyof typeof planMapping] || 'basic-pro';
    
    // Sauvegarder le plan sélectionné dans localStorage pour MultiStepSubscription
    localStorage.setItem('selectedPlan', mappedPlan);
    
    // Rediriger vers le workflow d'inscription avec le plan correct
    setLocation(`/multi-step-subscription?plan=${mappedPlan}`);
  };

  const plans = [
    {
      id: 'starter' as const,
      name: 'Beauty Start',
      subtitle: 'Parfait pour débuter',
      monthlyPrice: 29,
      yearlyPrice: 290,
      originalYearlyPrice: 348,
      description: 'L\'essentiel pour numériser votre salon avec style',
      popular: false,
      color: 'from-emerald-500 to-teal-600',
      icon: Users,
      ribbon: 'NOUVEAU',
      features: [
        'Planning numérique moderne',
        'Gestion clientèle simplifiée', 
        'Réservations web 24/7',
        'Notifications automatiques',
        'Rapports de base',
        'Paiements sécurisés',
        'Support par email',
        'Guides de démarrage'
      ],
      limits: 'Jusqu\'à 100 clients • 1 salon'
    },
    {
      id: 'professional' as const,
      name: 'Beauty Pro',
      subtitle: 'Boostez votre business',
      monthlyPrice: 79,
      yearlyPrice: 790,
      originalYearlyPrice: 948,
      description: 'Tous les outils pro pour développer votre activité',
      popular: true,
      color: 'from-violet-600 to-purple-700',
      icon: BarChart,
      ribbon: 'POPULAIRE',
      features: [
        'TOUT du plan Beauty Start +',
        'Analytics avancés et insights',
        'Marketing automation intelligent', 
        'Gestion multi-établissements (3 max)',
        'Programme de fidélité automatisé',
        'Intégrations réseaux sociaux',
        'Inventaire et stock alerts',
        'Support prioritaire par chat',
        'Formation personnalisée',
        'Export comptabilité'
      ],
      limits: 'Jusqu\'à 500 clients • 3 salons'
    },
    {
      id: 'enterprise' as const,
      name: 'Beauty Empire',
      subtitle: 'La puissance absolue',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      originalYearlyPrice: 1788,
      description: 'L\'arsenal complet avec IA pour dominer votre marché',
      popular: false,
      color: 'from-gradient-start to-gradient-end',
      icon: Crown,
      ribbon: 'PREMIUM',
      features: [
        'TOUT du plan Beauty Pro +',
        'Avyento AI - Assistant révolutionnaire',
        'Messagerie clients illimitée temps réel',
        'Pages de réservation infinies',
        'IA prédictive et recommandations',
        'Automatisation marketing complète',
        'Multi-établissements illimités',
        'Intégrations premium (Google, Meta, Apple)',
        'Support VIP 24/7 avec account manager',
        'Formation 1-à-1 et certification',
        'API et développements sur mesure',
        'Certification Beauty Pro offerte'
      ],
      limits: 'Clients illimités • Salons illimités'
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
      const savings = plan.originalYearlyPrice - plan.yearlyPrice;
      return Math.round((savings / plan.originalYearlyPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 relative overflow-hidden">
      {/* Glass pattern background */}
      <div className="absolute inset-0 opacity-10 animate-pulse" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
            <span className="text-gray-800 font-medium text-sm">Plans Professionnels Premium</span>
            <Crown className="w-4 h-4 text-amber-500 animate-bounce" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-violet-700 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Révolutionnez votre salon
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Rejoignez l'élite de la beauté digitale. Plus de <span className="text-violet-600 font-bold">2,847 salons</span> nous font déjà confiance pour transformer leur business.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">+347%</div>
              <div className="text-sm text-gray-600">ROI moyen</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-1 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs border-0 animate-pulse">
                -17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = getCurrentPrice(plan);
            const originalPrice = getOriginalPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative group transition-all duration-500 hover:scale-105 border-0 ${
                  plan.popular 
                    ? 'bg-white/40 backdrop-blur-md ring-2 ring-violet-400/50 shadow-2xl shadow-violet-400/25' 
                    : 'bg-white/25 backdrop-blur-md hover:bg-white/35'
                } border border-white/30 overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    POPULAIRE
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Plan Header */}
                  <div className="mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-violet-700 font-medium mb-1">{plan.subtitle}</p>
                    <p className="text-gray-700 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline mb-4">
                      {originalPrice && (
                        <span className="text-lg text-gray-600 line-through mr-2">
                          {originalPrice}€
                        </span>
                      )}
                      <span className="text-4xl font-bold text-gray-900">
                        {currentPrice}€ TTC
                      </span>
                      <span className="text-gray-700 ml-2">
                        /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    
                    {savings > 0 && (
                      <Badge className="bg-green-100/80 text-green-700 border border-green-300/50">
                        <Gift className="w-3 h-3 mr-1" />
                        Économisez {savings}% avec l'abonnement annuel
                      </Badge>
                    )}
                  </div>

                  {/* Limits */}
                  {plan.limits && (
                    <div className="mb-6 p-3 bg-white/30 rounded-lg border border-white/40 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-700" />
                        <span className="text-sm text-gray-800 font-medium">{plan.limits}</span>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-sm ${
                          feature.includes('TOUT') || feature.includes('🚀') || feature.includes('🤖') 
                            ? 'text-violet-700 font-medium' 
                            : 'text-gray-800'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white/90 border border-white/50 shadow-md'
                    }`}
                  >
                    {plan.popular ? (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Dominer le marché
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Commencer maintenant
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Guarantee */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Garantie satisfait ou remboursé 30 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Beauty Pro ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">ROI Prouvé</h4>
                  <p className="text-gray-700 text-sm">Nos clients voient en moyenne +347% de ROI en 6 mois</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Support Expert</h4>
                  <p className="text-gray-700 text-sm">Équipe dédiée de spécialistes beauté disponible 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Certifié</h4>
                  <p className="text-gray-700 text-sm">Solution certifiée conforme RGPD et sécurité bancaire</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300">
              <p className="text-gray-700 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                Déploiement en moins de 24h • Formation incluse • Migration gratuite
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 text-center">
          <blockquote className="text-lg text-gray-700 italic max-w-3xl mx-auto">
            "Beauty Pro a transformé mon salon. +280% de réservations en 3 mois, des clients plus fidèles et un business automatisé. Je recommande à 100% !"
          </blockquote>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face" 
              alt="Sophie Martin" 
              className="w-10 h-10 rounded-full"
            />
            <div className="text-left">
              <div className="text-gray-900 font-medium">Sophie Martin</div>
              <div className="text-gray-600 text-sm">Propriétaire, Salon Elite Paris</div>
            </div>
            <div className="flex space-x-1 ml-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}