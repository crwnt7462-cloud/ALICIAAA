import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check,
  Crown,
  Star,
  Users,
  MessageCircle,
  BarChart3,
  Zap,
  Shield,
  ArrowLeft,
  Sparkles,
  Gift
} from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Plan Basic",
    price: 49,
    priceAnnual: 39,
    description: "Parfait pour débuter avec les fonctionnalités essentielles",
    icon: <Star className="w-6 h-6" />,
    color: "blue",
    features: [
      "Gestion complète des rendez-vous",
      "Base de données clients illimitée",
      "Calendrier synchronisé",
      "Notifications par email",
      "Support technique par email",
      "Sauvegarde automatique",
      "Interface mobile optimisée"
    ],
    limitations: [
      "Pas d'Intelligence Artificielle",
      "Support limité aux heures ouvrables",
      "Pas de messagerie directe"
    ]
  },
  {
    id: "premium",
    name: "Plan Premium",
    price: 149,
    priceAnnual: 119,
    description: "Solution complète avec IA et fonctionnalités avancées",
    icon: <Crown className="w-6 h-6" />,
    color: "violet",
    popular: true,
    features: [
      "Toutes les fonctionnalités Basic",
      "Intelligence Artificielle Rendly",
      "Messagerie directe avec clients",
      "Analytics et rapports avancés",
      "Prédictions et optimisations IA",
      "Support prioritaire 24/7",
      "Intégrations tierces",
      "Personnalisation avancée",
      "Formation et accompagnement"
    ],
    limitations: []
  }
];

export default function SubscriptionPlans() {
  const [, setLocation] = useLocation();
  const [billingType, setBillingType] = useState<"monthly" | "annual">("monthly");

  const handleSelectPlan = (planId: string) => {
    setLocation(`/subscription/signup/${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pro-tools")}
            className="mb-4 self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux outils pro
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-violet-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Plans Professionnels
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins professionnel. 
            Tous nos plans incluent une période d'<button 
              onClick={() => setLocation("/free-trial")}
              className="text-green-600 hover:text-green-700 hover:underline font-medium"
            >
              essai gratuite de 14 jours
            </button>.
          </p>
        </div>

        {/* Toggle de facturation */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white border rounded-lg p-1 flex">
            <button
              onClick={() => setBillingType("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingType === "monthly"
                  ? "bg-violet-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingType("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingType === "annual"
                  ? "bg-violet-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annuel
              <Badge className="ml-2 text-xs bg-green-100 text-green-700">
                -20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Bouton d'essai gratuit mis en avant */}
        <div className="text-center mb-8">
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Essai Gratuit 14 Jours
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Testez toutes les fonctionnalités sans engagement ni carte bancaire
              </p>
              <Button 
                onClick={() => setLocation("/free-trial")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Gift className="w-4 h-4 mr-2" />
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? "border-violet-200 shadow-lg scale-105" 
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white px-3 py-1">
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-${plan.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className="text-white">
                    {plan.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mt-2">
                  {plan.description}
                </p>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {billingType === "monthly" ? plan.price : plan.priceAnnual}€
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{billingType === "monthly" ? "mois" : "mois"}
                    </span>
                  </div>
                  
                  {billingType === "annual" && (
                    <p className="text-sm text-green-600 mt-1">
                      Économisez {(plan.price - plan.priceAnnual) * 12}€ par an
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Fonctionnalités */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Fonctionnalités incluses
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900">Non inclus</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-300 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bouton d'action */}
                <div className="pt-4">
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-violet-600 hover:bg-violet-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    } text-white py-3`}
                  >
                    {plan.popular ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Choisir Premium
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Choisir Basic
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Garanties */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Nos garanties
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                <button 
                  onClick={() => setLocation("/free-trial")}
                  className="text-green-600 hover:text-green-700 hover:underline"
                >
                  Essai gratuit 14 jours
                </button>
              </h4>
              <p className="text-sm text-gray-600">
                Testez toutes les fonctionnalités sans engagement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                Support dédié
              </h4>
              <p className="text-sm text-gray-600">
                Équipe d'experts disponible pour vous accompagner
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                Annulation flexible
              </h4>
              <p className="text-sm text-gray-600">
                Changez ou annulez votre plan à tout moment
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Questions fréquentes
          </h3>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 border text-left">
              <h4 className="font-medium text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h4>
              <p className="text-sm text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                Les changements sont proratisés automatiquement.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border text-left">
              <h4 className="font-medium text-gray-900 mb-2">
                Que se passe-t-il si j'annule mon abonnement ?
              </h4>
              <p className="text-sm text-gray-600">
                Vous gardez l'accès à toutes les fonctionnalités jusqu'à la fin de votre période de facturation. 
                Vos données restent sauvegardées pendant 30 jours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}