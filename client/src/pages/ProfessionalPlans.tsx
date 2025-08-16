import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ProfessionalPlans() {
  const [, setLocation] = useLocation();
  const [, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'essentiel',
      name: 'Essentiel',
      tagline: 'Pour commencer',
      price: 29,
      period: 'mois',
      yearlyPrice: 290,
      originalYearlyPrice: 348,
      description: 'Parfait pour débuter votre activité salon',
      features: [
        'Planning et réservations',
        'Gestion clientèle',
        'Notifications automatiques',
        'Paiements sécurisés',
        'Support email'
      ],
      limits: "Jusqu'à 200 RDV/mois",
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'professionnel',
      name: 'Professionnel',
      tagline: 'Le plus populaire',
      price: 79,
      period: 'mois',
      yearlyPrice: 790,
      originalYearlyPrice: 948,
      description: 'Idéal pour les salons établis avec plusieurs services',
      features: [
        "Tout de l'Essentiel",
        'Analytics avancés',
        'Marketing automation',
        'Multi-établissements (3 max)',
        'Support prioritaire'
      ],
      limits: "Jusqu'à 1000 RDV/mois",
      popular: true,
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      textColor: 'text-white',
      buttonColor: 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Fonctionnalités avancées',
      price: 149,
      period: 'mois',
      yearlyPrice: 1490,
      originalYearlyPrice: 1788,
      description: 'Solution complète pour les grands salons et chaînes',
      features: [
        'Tout du Professionnel',
        'Assistant IA intégré',
        'Messagerie clients illimitée',
        'Établissements illimités',
        'Support VIP 24/7'
      ],
      limits: 'RDV illimités',
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Redirect to subscription or payment page
    setLocation(`/subscription-payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar - Style Slay */}
        <div className="flex items-center justify-between mb-12 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Avyento</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8 text-gray-600">
            <button className="hover:text-gray-900">Personal</button>
            <button className="hover:text-gray-900">Company</button>
            <button className="hover:text-gray-900 font-medium">Business</button>
            <button className="hover:text-gray-900">Holders</button>
            <button className="hover:text-gray-900">Banks</button>
            <button className="hover:text-gray-900">Blog</button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">Help</button>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>🇫🇷</span>
              <span>EN</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 px-6"
            >
              Sign up
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6">
              Log in
            </Button>
          </div>
        </div>

        {/* Trial Badge */}
        <div className="text-center mb-8">
          <Badge className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full border border-gray-200">
            🎯 SAVE ON THE GO
          </Badge>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Join the ranks of our customers
          </h1>
          <p className="text-gray-600 text-lg">
            Trial Period For 30 Days With No Risk
          </p>
        </div>

        {/* Plan Toggle Buttons */}
        <div className="flex items-center justify-center mb-16 space-x-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium"
          >
            Solo
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 text-gray-600 hover:bg-gray-50 px-8 py-3 rounded-full font-medium"
          >
            Joint
          </Button>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-6xl mx-auto mb-16 relative">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`
                ${plan.bgColor} 
                ${plan.popular 
                  ? 'ring-2 ring-blue-400 shadow-2xl lg:scale-110 lg:z-10' 
                  : 'shadow-lg'
                } 
                ${!plan.popular && index === 0 ? 'lg:mt-8' : ''}
                ${!plan.popular && index === 2 ? 'lg:mt-8' : ''}
                rounded-3xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl
                ${plan.popular ? 'lg:w-80 w-full' : 'lg:w-72 w-full'}
                relative
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white/20 text-white px-6 py-2 rounded-full border border-white/20 text-sm font-medium">
                    The Most Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className={`${plan.popular ? 'p-10' : 'p-8'} text-center`}>
                <div className={`${plan.textColor} mb-6 ${plan.popular ? 'pt-8' : 'pt-4'}`}>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className={`${plan.popular ? 'text-5xl' : 'text-4xl'} font-light`}>€</span>
                    <span className={`${plan.popular ? 'text-7xl' : 'text-6xl'} font-bold`}>{plan.price}</span>
                    <span className={`${plan.popular ? 'text-xl' : 'text-lg'} font-normal ml-2`}>/ {plan.period}</span>
                  </div>
                </div>
                
                <h3 className={`${plan.popular ? 'text-3xl' : 'text-2xl'} font-bold ${plan.textColor} mb-2`}>
                  {plan.name}
                </h3>
                
                <p className={`${plan.popular ? 'text-blue-100' : 'text-gray-500'} text-sm mb-2`}>
                  {plan.tagline}
                </p>
                
                <p className={`${plan.popular ? 'text-blue-100' : 'text-gray-500'} text-xs mb-4`}>
                  {plan.limits}
                </p>
                
                <div className={`${plan.popular ? 'text-blue-100' : 'text-gray-600'} text-left mb-6`}>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full mr-3 ${plan.popular ? 'bg-white/60' : 'bg-blue-500'}`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`
                    w-full py-4 text-lg font-medium rounded-2xl transition-all duration-200
                    ${plan.buttonColor}
                  `}
                >
                  Commencer l'essai gratuit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="pb-16"></div>
      </div>
    </div>
  );
}