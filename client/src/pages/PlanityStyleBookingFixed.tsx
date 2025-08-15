import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlanityStyleBookingFixed() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientToken', data.client.token);
        toast({
          title: "Connexion réussie !",
          description: "Bon retour parmi nous !"
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation inscription
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
              onClick={() => setLocation('/booking-datetime')}
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
              <p className="text-sm text-gray-500">{selectedDateTime?.date || "Jeudi 20 février"}</p>
              <p className="font-medium text-gray-900">{selectedDateTime?.time || "11:00"}</p>
            </div>
          </div>
        </div>

        {/* Titre et bouton connexion */}
        <div className="bg-white p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-center text-gray-900 mb-4">
            Nouveau sur Planity ?
          </h2>
          
          {/* Bouton "J'ai déjà un compte" */}
          <Button
            variant="outline"
            onClick={() => setShowLoginModal(true)}
            className="w-full h-12 mb-4 bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
          >
            J'ai déjà un compte - Se connecter
          </Button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">ou créer un nouveau compte</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} className="bg-white p-4 space-y-4">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Téléphone portable <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                <span className="text-sm">🇫🇷</span>
              </div>
              <Input
                type="tel"
                placeholder="Enter votre numéro..."
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-l-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-12 border-gray-200 focus:border-violet-500"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* CGU */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="cgu"
              checked={formData.acceptCGU}
              onCheckedChange={(checked) => setFormData({...formData, acceptCGU: !!checked})}
              className="mt-1"
            />
            <label htmlFor="cgu" className="text-sm text-gray-600 leading-5">
              J'accepte les <span className="text-violet-600 underline">CGU</span> de Planity.
            </label>
          </div>

          {/* Bouton créer compte */}
          <Button
            type="submit"
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
          >
            Créer mon compte
          </Button>
        </form>
      </div>

      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Se connecter</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLoginModal(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Email</label>
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="h-12 border-gray-200 focus:border-violet-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Mot de passe</label>
                  <Input
                    type="password"
                    placeholder="Votre mot de passe"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="h-12 border-gray-200 focus:border-violet-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
                >
                  Se connecter
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}