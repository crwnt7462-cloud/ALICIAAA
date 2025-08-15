import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlanityStyleBooking() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    acceptCGU: false
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  // Récupérer les données des étapes précédentes
  const selectedProfessional = localStorage.getItem('selectedProfessional');
  const selectedDateTime = JSON.parse(localStorage.getItem('selectedDateTime') || '{}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Logic connexion
      try {
        const response = await fetch('/api/client/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('clientToken', data.client.token);
          toast({
            title: "Connexion réussie !",
            description: "Redirection vers votre espace..."
          });
          setLocation('/client-dashboard');
        } else {
          toast({
            title: "Erreur de connexion",
            description: data.error || "Email ou mot de passe incorrect",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur connexion:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } else {
      // Logic inscription
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.acceptCGU) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        return;
      }

      try {
        const response = await fetch('/api/client/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('clientToken', data.client.token);
          toast({
            title: "Compte créé avec succès !",
            description: "Bienvenue chez Avyento !"
          });
          setLocation('/client-dashboard');
        } else {
          toast({
            title: "Erreur d'inscription",
            description: data.error || "Impossible de créer le compte",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur inscription:', error);
        toast({
          title: "Erreur d'inscription",
          description: "Impossible de créer le compte. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation('/search')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Bonhomme</h1>
              <p className="text-xs text-gray-500">Paris Archives</p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-lg mx-auto">
        {/* Section service sélectionné */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Coupe Bonhomme</h3>
              <p className="text-sm text-gray-500">30 min • 39,00 €</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Jeudi 20 février</p>
              <p className="font-medium text-gray-900">11:00</p>
            </div>
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div className="bg-white p-4 border-b border-gray-100">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              S'inscrire
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="cgu"
                  checked={formData.acceptCGU}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptCGU: checked as boolean }))}
                />
                <label htmlFor="cgu" className="text-sm text-gray-600 leading-relaxed">
                  J'accepte les <span className="text-blue-600 underline">CGU</span> d'Avyento.
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium mt-6"
            >
              {isLogin ? 'Se connecter' : 'Continuer'}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Nouveau sur Planity ?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}

          {!isLogin && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}