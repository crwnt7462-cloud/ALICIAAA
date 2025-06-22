import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Sparkles, ArrowRight, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Calendar,
      title: "Planning intelligent",
      description: "Gérez vos rendez-vous avec un système de planning optimisé par IA",
      color: "from-blue-100 to-purple-100"
    },
    {
      icon: Users,
      title: "Gestion clients",
      description: "Base de données clients complète avec historique et préférences",
      color: "from-purple-100 to-pink-100"
    },
    {
      icon: TrendingUp,
      title: "Analytics avancées",
      description: "Tableaux de bord et analyses pour optimiser votre business",
      color: "from-emerald-100 to-green-100"
    },
    {
      icon: Sparkles,
      title: "Assistant IA",
      description: "Copilote intelligent pour automatiser et optimiser vos tâches",
      color: "from-amber-100 to-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <div className="w-16 h-16 gradient-bg rounded-3xl flex items-center justify-center shadow-luxury mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Beauty Pro
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              La plateforme complète pour gérer votre salon de beauté avec intelligence artificielle
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9/5 - 2,847 salons</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">2,847</p>
                <p className="text-xs text-gray-600">Salons actifs</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">150k+</p>
                <p className="text-xs text-gray-600">RDV gérés</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full gradient-bg text-white shadow-md hover:scale-105 transition-all duration-200 rounded-xl py-3"
            onClick={() => setLocation('/')}
          >
            Accéder au tableau de bord
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl py-3"
            onClick={() => setLocation('/booking')}
          >
            Nouveau rendez-vous
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>© 2025 Beauty Pro. Plateforme de gestion professionnelle.</p>
        </div>
      </div>
    </div>
  );
}