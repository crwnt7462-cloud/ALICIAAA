import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ClientLoginBooking() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      toast({
        title: "Connexion en cours...",
        description: "Vérification des identifiants"
      });

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
          description: "Redirection vers la réservation..."
        });
        
        // Rediriger vers la page de réservation
        setTimeout(() => {
          setLocation('/salon-booking');
        }, 1000);
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/salon-booking')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Se connecter</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion à votre compte</h2>
            <p className="text-sm text-gray-600">Entrez vos identifiants pour continuer</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pr-10"
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

            <Button 
              onClick={handleLogin}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-full font-medium text-lg shadow-md hover:shadow-lg transition-all"
              disabled={!loginData.email || !loginData.password}
            >
              Se connecter
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-violet-600 text-sm">
                Mot de passe oublié ?
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Button 
                  variant="link" 
                  className="text-violet-600 p-0 h-auto"
                  onClick={() => setLocation('/salon-booking')}
                >
                  Créer un compte
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}