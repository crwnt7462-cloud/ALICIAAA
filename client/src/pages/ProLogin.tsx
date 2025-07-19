import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Scissors, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "salon@example.com", // Données de test pré-remplies
    password: "password123"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", formData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${data.user?.businessName || data.user?.firstName}`
        });
        setLocation("/dashboard");
      } else {
        throw new Error(data.message || "Erreur de connexion");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemo = () => {
    setFormData({
      email: "salon@example.com",
      password: "password123"
    });
    toast({
      title: "Compte de démonstration",
      description: "Identifiants de test pré-remplis"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion Pro
          </h1>
          <p className="text-gray-600">
            Accédez à votre tableau de bord professionnel
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Se connecter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@salon.fr"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Actions rapides */}
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                onClick={quickDemo}
                className="w-full"
              >
                Tester avec compte démo
              </Button>
              
              <div className="text-center">
                <button
                  onClick={() => setLocation("/register")}
                  className="text-sm text-violet-600 hover:text-violet-700 underline"
                >
                  Pas encore de compte ? S'inscrire
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Fonctionnalités pro incluses :</p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span>• Planning intelligent</span>
            <span>• IA intégrée</span>
            <span>• Gestion stocks</span>
          </div>
        </div>
      </div>
    </div>
  );
}