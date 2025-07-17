import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Gift, 
  Check, 
  Clock, 
  Users, 
  Star,
  Shield,
  Crown
} from "lucide-react";

export default function FreeTrialSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenue dans votre essai gratuit !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Votre période d'essai de 14 jours a commencé. Vous avez maintenant accès à toutes les fonctionnalités Pro.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-green-600" />
                <span>14 jours d'essai gratuit complet</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Users className="w-4 h-4 text-green-600" />
                <span>Support client prioritaire</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Aucune carte bancaire requise</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Commencer à utiliser la plateforme
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/subscription-plans")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Essai Gratuit 14 Jours
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Testez toutes les fonctionnalités professionnelles gratuitement, sans engagement et sans carte bancaire.
            </p>
          </div>
        </div>

        {/* Avantages de l'essai gratuit */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Ce qui est inclus dans votre essai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Gestion complète</h4>
                  <p className="text-sm text-gray-600">Planning, clients, services, équipe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">IA Pro</h4>
                  <p className="text-sm text-gray-600">Assistant intelligent, prédictions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Messagerie Pro</h4>
                  <p className="text-sm text-gray-600">Communication directe clients</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Analytics avancés</h4>
                  <p className="text-sm text-gray-600">Rapports et statistiques détaillés</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Pages de réservation</h4>
                  <p className="text-sm text-gray-600">Créateur de pages personnalisées</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Support prioritaire</h4>
                  <p className="text-sm text-gray-600">Assistance dédiée 7j/7</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire d'inscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet-600" />
              Créer votre compte d'essai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jean"
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dupont"
                    className="h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean.dupont@monsalon.fr"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01 23 45 67 89"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nom de votre établissement</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Salon Beauté Élégance"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Type d'établissement</Label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="salon">Salon de coiffure</option>
                  <option value="spa">Spa / Institut</option>
                  <option value="barbershop">Barbershop</option>
                  <option value="institute">Institut de beauté</option>
                  <option value="freelance">Freelance beauté</option>
                </select>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Commencer mon essai gratuit
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                En créant votre compte, vous acceptez nos{" "}
                <a href="#" className="text-violet-600 hover:underline">
                  conditions d'utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-violet-600 hover:underline">
                  politique de confidentialité
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}