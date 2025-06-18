import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-dark-900">
      {/* Header with Logo */}
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Scissors className="text-white text-2xl w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          BeautyPro
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plateforme tout-en-un pour professionnels
        </p>
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
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Se connecter
          </Button>

          <div className="text-center">
            <button className="text-primary text-sm hover:underline">
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </div>

      {/* GDPR Notice */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-dark-700 rounded-t-3xl">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre
          politique de confidentialité RGPD.
        </p>
      </div>
    </div>
  );
}
