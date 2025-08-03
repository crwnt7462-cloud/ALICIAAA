import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { RealtimeNotificationBar } from "@/components/RealtimeNotificationBar";
import {
  ArrowLeft, Settings, Bell, Calendar, Users, CreditCard, 
  MessageCircle, BarChart3, Package, Globe, Crown, Star
} from "lucide-react";
import { getGenericGlassButton } from "@/lib/salonColors";

export default function BusinessFeaturesModern() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Vérifier l'authentification
  const { data: sessionData, isLoading } = useQuery<any>({
    queryKey: ['/api/auth/check-session'],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (!sessionData || !sessionData.authenticated)) {
      setLocation('/pro-login');
    }
  }, [sessionData, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: "Planning",
      description: "Gérer les rendez-vous",
      action: () => setLocation('/planning'),
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Clients",
      description: "Base clientèle complète",
      action: () => setLocation('/clients'),
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Statistiques et insights",
      action: () => setLocation('/analytics'),
      color: "bg-purple-500"
    },
    {
      icon: MessageCircle,
      title: "Messagerie",
      description: "Communication directe",
      action: () => setLocation('/pro-messaging'),
      color: "bg-orange-500"
    },
    {
      icon: CreditCard,
      title: "Paiements",
      description: "Terminal et facturation",
      action: () => setLocation('/payments'),
      color: "bg-indigo-500"
    },
    {
      icon: Package,
      title: "Inventaire",
      description: "Gestion des stocks",
      action: () => setLocation('/inventory'),
      color: "bg-pink-500"
    },
    {
      icon: Globe,
      title: "Page salon",
      description: "Site web personnalisé",
      action: () => setLocation('/page-builder'),
      color: "bg-teal-500"
    },
    {
      icon: Settings,
      title: "Paramètres",
      description: "Configuration salon",
      action: () => setLocation('/salon-settings'),
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Barre de notifications temps réel */}
      <RealtimeNotificationBar />

      {/* Header - même style que page recherche */}
      <div className="relative">
        
        {/* Bouton retour */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Container principal */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo salon - même style que "Design" */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-violet-600">Salon</h1>
            </div>

            {/* Titre */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-500 font-normal">Manage your business</h2>
            </div>

            {/* Badge Premium */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Premium Active</span>
              </div>
              <p className="text-white text-sm opacity-90">Accès complet aux outils pro</p>
            </div>

            {/* Grid des fonctionnalités - style cards modernes */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.action}
                  className="glass-button rounded-2xl p-4 text-left"
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-3`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </button>
              ))}
            </div>

            {/* Stats rapides - ✅ GLASSMORPHISM APPLIQUÉ */}
            <div className="glass-stat-card rounded-2xl p-4 mb-6">
              <h3 className="font-medium text-black mb-3">Aujourd'hui</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-violet-600">12</div>
                  <div className="text-xs text-gray-600">RDV</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">€890</div>
                  <div className="text-xs text-gray-600">CA</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">4.8</div>
                  <div className="text-xs text-gray-600">
                    <Star className="h-3 w-3 inline text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="space-y-3">
              <button
                onClick={() => setLocation('/booking')}
                className={`w-full h-12 ${getGenericGlassButton(0)} text-white rounded-2xl text-base font-medium transition-colors`}
              >
                Nouveau rendez-vous
              </button>
              
              <button
                onClick={() => setLocation('/pro-messaging')}
                className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-base font-medium transition-colors"
              >
                Ouvrir messagerie
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}