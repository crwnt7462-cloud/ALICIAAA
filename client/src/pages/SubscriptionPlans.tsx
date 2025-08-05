import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '../../shared/subscriptionPlans';
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Sparkles, 
  Users, 
  Calendar,
  BarChart3,
  MessageCircle,
  Brain,
  Zap,
  Star
} from 'lucide-react';

const iconMapping = {
  'Gestion des rendez-vous': Calendar,
  'Fiche client complète': Users,
  'Planning professionnel': Calendar,
  'Notifications automatiques': MessageCircle,
  'Statistiques de base': BarChart3,
  '🤖 IA Assistant intégrée': Brain,
  '📊 Analyse prédictive avancée': BarChart3,
  '💬 Chatbot intelligent pour clients': MessageCircle,
  '⚡ Optimisation automatique planning': Zap,
  '🎯 Recommendations personnalisées': Star,
};

export default function SubscriptionPlans() {
  const [, setLocation] = useLocation();
  const { currentPlan, isActive, isBasicPro, isAdvancedPro, isPremiumPro } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    if (planId === currentPlan && isActive) {
      return; // Déjà abonné à ce plan
    }
    
    // Rediriger vers le processus de paiement Stripe
    setLocation(`/subscribe/${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/dashboard')}
                className="glass-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Plans d'abonnement</h1>
                <p className="text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isPremium = plan.id === 'premium-pro';
            const isAdvanced = plan.id === 'advanced-pro';
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${isPremium ? 'lg:scale-105' : ''}`}
              >
                <Card className={`h-full ${
                  isPremium ? 'ring-2 ring-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50' :
                  isAdvanced ? 'ring-2 ring-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50' :
                  'bg-white/50'
                } backdrop-blur-md border-white/40`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      {isPremium ? (
                        <Crown className="w-8 h-8 text-violet-500" />
                      ) : isAdvanced ? (
                        <Star className="w-8 h-8 text-amber-500" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    
                    <div className="mt-3">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                      <span className="text-gray-600 ml-2">/{plan.interval === 'month' ? 'mois' : 'an'}</span>
                    </div>
                    
                    {isCurrentPlan && isActive && (
                      <Badge variant="outline" className="mt-3">
                        Plan actuel
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">✅ Fonctionnalités incluses :</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => {
                            const IconComponent = iconMapping[feature] || Check;
                            return (
                              <li key={idx} className="flex items-start space-x-3">
                                <IconComponent className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      
                      {plan.restrictions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">❌ Limitations :</h4>
                          <ul className="space-y-2">
                            {plan.restrictions.map((restriction, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <div className="w-4 h-4 border border-gray-300 rounded-sm mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{restriction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={isCurrentPlan && isActive}
                      className={`w-full ${isPremium ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700' : ''} glass-button`}
                    >
                      {isCurrentPlan && isActive ? (
                        'Plan actuel'
                      ) : (
                        <>
                          {isPremium ? <Crown className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                          Choisir ce plan
                        </>
                      )}
                    </Button>
                    
                    {isPremium && (
                      <p className="text-center text-xs text-gray-500 mt-3">
                        🚀 Toutes les fonctionnalités IA incluses
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Comparaison rapide */}
        <div className="mt-12 bg-white/30 backdrop-blur-md rounded-lg p-6 border border-white/40">
          <h3 className="text-lg font-semibold text-center mb-6">🤔 Quelle différence entre les plans ?</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Pro - 29€/mois</h4>
              <p className="text-sm text-gray-600">
                Parfait pour débuter avec toutes les fonctionnalités essentielles de gestion de salon
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-violet-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-violet-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Pro - 149€/mois</h4>
              <p className="text-sm text-gray-600">
                Pour les professionnels qui veulent l'IA et des fonctionnalités avancées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}