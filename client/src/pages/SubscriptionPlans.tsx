import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  currency: string;
  billingCycle: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Erreur récupération plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic-pro':
        return <Star className="h-6 w-6 text-blue-500" />;
      case 'advanced-pro':
        return <Zap className="h-6 w-6 text-purple-500" />;
      case 'premium-pro':
        return <Crown className="h-6 w-6 text-amber-500" />;
      default:
        return <Star className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'basic-pro':
        return 'from-blue-500 to-cyan-500';
      case 'advanced-pro':
        return 'from-purple-500 to-pink-500';
      case 'premium-pro':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Chargement des plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            Plans d'Abonnement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choisissez le plan qui correspond le mieux aux besoins de votre salon
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 ${
                plan.isPopular 
                  ? 'ring-2 ring-purple-400 scale-105 transform hover:scale-110' 
                  : 'hover:scale-105 transform'
              }`}
            >
              {/* Badge populaire */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Plus Populaire
                  </div>
                </div>
              )}

              {/* Header plan */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-gray-500 ml-1">/mois</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation(`/register?plan=${plan.id}`)}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${getPlanGradient(plan.id)} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                Choisir ce Plan
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="backdrop-blur-md bg-white/30 rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Notre équipe est là pour vous accompagner dans le choix du plan qui convient le mieux à votre salon.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contacter un Expert
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;