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
      id: 'monthly',
      name: 'Monthly',
      price: 98,
      period: 'Monthly',
      description: 'Payment Of $98 Each Month',
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 92,
      period: 'Monthly',
      description: 'Payment Of $276 Every 3 Months',
      popular: true,
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      textColor: 'text-white',
      buttonColor: 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 83,
      period: 'Monthly',
      description: 'Payment Of $996 Each Year',
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`
                ${plan.bgColor} 
                ${plan.popular ? 'ring-2 ring-blue-400 shadow-2xl scale-105' : 'shadow-lg'} 
                rounded-3xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl
                ${index === 1 ? 'transform lg:-mt-4' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white/20 text-white px-4 py-2 rounded-full border border-white/20">
                    The Most Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8 text-center">
                <div className={`${plan.textColor} mb-6 ${plan.popular ? 'pt-6' : ''}`}>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-light">$</span>
                    <span className="text-6xl font-bold">{plan.price}</span>
                    <span className="text-lg font-normal ml-2">/ {plan.period}</span>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold ${plan.textColor} mb-2`}>
                  {plan.name}
                </h3>
                
                <p className={`${plan.popular ? 'text-blue-100' : 'text-gray-500'} text-sm mb-8`}>
                  {plan.description}
                </p>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`
                    w-full py-4 text-lg font-medium rounded-2xl transition-all duration-200
                    ${plan.buttonColor}
                  `}
                >
                  Start With A Monthly Plan
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