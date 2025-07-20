import { useState } from "react";
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
import { useLocation } from "wouter";

export default function ModernSubscriptionPlans() {
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic' as const,
      name: 'Salon Pro',
      subtitle: 'Pour débuter en beauté',
      monthlyPrice: 49,
      yearlyPrice: 490,
      originalYearlyPrice: 588,
      description: 'Tous les outils essentiels pour digitaliser votre salon',
      popular: false,
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      features: [
        'Planning intelligent illimité',
        'Gestion clients professionnelle', 
        'Réservations en ligne 24/7',
        'Notifications SMS/Email automatiques',
        'Analytics et rapports détaillés',
        'Système de paiement intégré',
        'Support expert par email',
        'Formation vidéo complète'
      ]
    },
    {
      id: 'premium' as const,
      name: 'Beauty Empire',
      subtitle: 'La solution ultime',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      originalYearlyPrice: 1788,
      description: 'Dominez votre marché avec l\'IA et l\'automatisation',
      popular: true,
      color: 'from-purple-600 via-pink-600 to-rose-500',
      icon: Crown,
      features: [
        'TOUT du plan Salon Pro +',
        'Rendly AI - Assistant ultra-intelligent',
        'Messagerie illimitée temps réel',
        'Pages personnalisées infinies',
        'Analytics prédictives IA',
        'Marketing automation avancé',
        'Programme fidélité automatisé',
        'Intégrations premium (Google, Meta...)',
        'Support VIP instantané 24/7',
        'Formation personnelle 1-à-1',
        'Certification Beauty Pro offerte'
      ]
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

  const handleSelectPlan = (planType: 'basic' | 'premium') => {
    setLocation(`/subscription/signup/${planType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-medium text-sm">Plans Professionnels Premium</span>
            <Crown className="w-4 h-4 text-yellow-400 animate-bounce" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
            Révolutionnez votre salon
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Rejoignez l'élite de la beauté digitale. Plus de <span className="text-purple-400 font-bold">2,847 salons</span> nous font déjà confiance pour transformer leur business.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">+347%</div>
              <div className="text-sm text-gray-400">ROI moyen</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-1 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
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
                className={`relative group transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br ${
                  plan.popular 
                    ? 'from-slate-800/90 to-purple-900/50 ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/25' 
                    : 'from-slate-800/50 to-slate-700/30 hover:from-slate-800/70 hover:to-slate-700/50'
                } backdrop-blur-xl overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
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
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-purple-300 font-medium mb-1">{plan.subtitle}</p>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline mb-4">
                      {originalPrice && (
                        <span className="text-lg text-gray-500 line-through mr-2">
                          {originalPrice}€
                        </span>
                      )}
                      <span className="text-4xl font-bold text-white">
                        {currentPrice}€
                      </span>
                      <span className="text-gray-400 ml-2">
                        /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    
                    {savings > 0 && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        <Gift className="w-3 h-3 mr-1" />
                        Économisez {savings}% avec l'abonnement annuel
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-sm ${
                          feature.includes('TOUT') || feature.includes('🚀') || feature.includes('🤖') 
                            ? 'text-purple-300 font-medium' 
                            : 'text-gray-300'
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
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-white text-slate-900 hover:bg-gray-100 shadow-md'
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
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
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
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pourquoi choisir Beauty Pro ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">ROI Prouvé</h4>
                  <p className="text-gray-400 text-sm">Nos clients voient en moyenne +347% de ROI en 6 mois</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Support Expert</h4>
                  <p className="text-gray-400 text-sm">Équipe dédiée de spécialistes beauté disponible 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Certifié</h4>
                  <p className="text-gray-400 text-sm">Solution certifiée conforme RGPD et sécurité bancaire</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                Déploiement en moins de 24h • Formation incluse • Migration gratuite
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 text-center">
          <blockquote className="text-lg text-gray-300 italic max-w-3xl mx-auto">
            "Beauty Pro a transformé mon salon. +280% de réservations en 3 mois, des clients plus fidèles et un business automatisé. Je recommande à 100% !"
          </blockquote>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face" 
              alt="Sophie Martin" 
              className="w-10 h-10 rounded-full"
            />
            <div className="text-left">
              <div className="text-white font-medium">Sophie Martin</div>
              <div className="text-gray-400 text-sm">Propriétaire, Salon Elite Paris</div>
            </div>
            <div className="flex space-x-1 ml-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}