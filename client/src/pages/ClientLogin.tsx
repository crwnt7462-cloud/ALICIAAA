import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientEmail', data.client.email);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace client",
        });
        
        setLocation('/client-dashboard');
      } else {
        const error = await response.json();
        toast({
          title: "Erreur de connexion",
          description: error.error || "Identifiants incorrects",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header simple */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-50 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Section gauche - Image et branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-amber-50/50"></div>
        <div className="relative flex items-center justify-center w-full p-12">
          <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-violet-600 to-amber-600 rounded-full shadow-inner flex items-center justify-center">
              <div className="w-48 h-2 bg-white rounded-full transform rotate-45 shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Vous avez déjà utilisé notre plateforme ?
            </h1>
          </div>

          <Card className="border border-black shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="h-12 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className="h-12 border-gray-300 focus:border-violet-500 focus:ring-violet-500 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button 
                    type="button"
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                    onClick={() => setLocation('/forgot-password')}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Nouveau sur notre plateforme ?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/client-register')}
                  className="h-12 px-8 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-medium transition-colors"
                >
                  Créer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informations de test */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 font-medium mb-2">Compte de démonstration</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Email:</strong> client@test.com</p>
              <p><strong>Mot de passe:</strong> client123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}