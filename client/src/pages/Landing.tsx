import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Calendar, Users, TrendingUp, Bot, Shield, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
          <span className="text-white text-3xl">✂</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Beauty Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La solution complète pour gérer votre salon de beauté avec intelligence artificielle
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Calendar className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Planning Intelligent</h3>
            <p className="text-gray-600 text-sm">Optimisation automatique des créneaux</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Bot className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">IA Avancée</h3>
            <p className="text-gray-600 text-sm">Prédictions et recommandations intelligentes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Analytics Pro</h3>
            <p className="text-gray-600 text-sm">Tableaux de bord détaillés</p>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-6">
        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </Label>
            <Input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-700"
              placeholder="votre.email@exemple.com"
              disabled
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </Label>
            <Input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-700"
              placeholder="••••••••"
              disabled
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Accéder à la démo
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Version démo - Accès complet aux fonctionnalités
            </p>
            <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
              <Shield className="w-3 h-3" />
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Utilisé par plus de 500+ salons</p>
          <div className="flex justify-center space-x-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-sm text-gray-600">4.9/5 (127 avis)</span>
          </div>
        </div>
      </div>

      {/* GDPR Notice */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre
          politique de confidentialité RGPD.
        </p>
      </div>
    </div>
  );
}
