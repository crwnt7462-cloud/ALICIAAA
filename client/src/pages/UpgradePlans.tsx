import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Check, Star, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UpgradePlans() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { currentPlan, canAccess } = useSubscription();

  const plans = [
    {
      id: 'basic-pro',
      name: 'Basic Pro',
      price: '29€',
      period: '/mois',
      description: 'Parfait pour démarrer votre activité',
      popular: false,
      features: [
        'Jusqu\'à 100 clients',
        'Planning de base',
        'Gestion des rendez-vous',
        'Notifications email',
        'Support par email',
        'Page salon personnalisable'
      ],
      limitations: [
        'IA limitée (10 analyses/mois)',
        'Pas de messagerie premium',
        'Analytics de base'
      ]
    },
    {
      id: 'advanced-pro',
      name: 'Advanced Pro',
      price: '79€',
      period: '/mois',
      description: 'Pour les salons en croissance',
      popular: true,
      features: [
        'Clients illimités',
        'Planning avancé avec équipe',
        'IA d\'optimisation complète',
        'Messagerie premium',
        'Analytics détaillées',
        'Gestion des stocks',
        'Programme de fidélité',
        'Notifications SMS',
        'Support prioritaire'
      ],
      limitations: [
        'Pas de white-label',
        'Intégrations limitées'
      ]
    },
    {
      id: 'premium-pro',
      name: 'Premium Pro',
      price: '149€',
      period: '/mois',
      description: 'Solution complète pour les pros',
      popular: false,
      features: [
        'Tout d\'Advanced Pro',
        'Solution white-label',
        'Intégrations illimitées',
        'IA prédictive avancée',
        'Chatbot IA personnalisé',
        'API complète',
        'Multi-établissements',
        'Support 24/7 dédié',
        'Formation personnalisée'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = (planId: string) => {
    // Rediriger vers la page de paiement Stripe avec le plan sélectionné
    setLocation(`/stripe-checkout?plan=${planId}&upgrade=true`);
  };

  const getCurrentPlanIndex = () => {
    return plans.findIndex(plan => plan.id === currentPlan);
  };

  const currentPlanIndex = getCurrentPlanIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="glass-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Choisir votre plan</h1>
              <p className="text-sm text-gray-600">
                Plan actuel : <Badge variant="outline">{currentPlan?.replace('-', ' ').toUpperCase()}</Badge>
              </p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Titre principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Développez votre salon avec nos solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins et donnez à votre salon 
            les outils pour réussir dans le digital.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan;
            const canUpgradeToThis = index > currentPlanIndex;
            
            return (
              <Card key={plan.id} className={`
                relative glass-card
                ${plan.popular ? 'ring-2 ring-violet-500 ring-opacity-50' : ''}
                ${isCurrentPlan ? 'bg-violet-50/50' : ''}
              `}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Le plus populaire
                  </Badge>
                )}
                
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Votre plan actuel
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Fonctionnalités */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fonctionnalités incluses :</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-2">Limitations :</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="text-sm text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bouton d'action */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button 
                        className="w-full glass-button opacity-50" 
                        disabled
                      >
                        Plan actuel
                      </Button>
                    ) : canUpgradeToThis ? (
                      <Button 
                        className="w-full glass-button-violet hover:glass-effect"
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Passer à {plan.name}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full glass-button opacity-50" 
                        disabled
                      >
                        Plan inférieur
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Garanties */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Satisfait ou remboursé
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Essayez notre solution pendant 30 jours. Si vous n'êtes pas entièrement satisfait, 
            nous vous remboursons intégralement, sans questions.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div>✓ Annulation à tout moment</div>
            <div>✓ Migration des données incluse</div>
            <div>✓ Support durant la transition</div>
          </div>
        </div>
      </div>
    </div>
  );
}