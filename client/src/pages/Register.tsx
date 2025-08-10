import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Scissors, Mail, Lock, User, Building, Phone, MapPin } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    businessName: "",
    phone: "",
    address: "",
    city: ""
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // Inscription directe sans vérification par code
      const response = await apiRequest("POST", "/api/register/professional", registerData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Salon créé avec succès !",
          description: "Vous pouvez maintenant vous connecter et gérer votre salon"
        });
        setLocation("/pro-login");
      } else {
        throw new Error(data.error || "Erreur lors de la création du salon");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer votre salon
          </h1>
          <p className="text-gray-600">
            Rejoignez la plateforme professionnelle
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <Card className="shadow-lg border-0 glass-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Inscription Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Informations personnelles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Sarah"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Martin"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Salon */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Nom du salon</Label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="businessName"
                    placeholder="Salon Beautiful"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@salonbeautiful.fr"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="01 23 45 67 89"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="123 Rue de la Beauté"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 glass-input"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className="pl-10 glass-input"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full glass-button"
                disabled={isLoading}
              >
                {isLoading ? "Création..." : "Créer mon salon"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setLocation("/pro-login")}
                className="text-sm text-violet-600 hover:text-violet-700 underline"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}