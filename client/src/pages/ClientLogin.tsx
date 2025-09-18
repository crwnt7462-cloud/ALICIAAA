import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import avyentoLogo from "@/assets/avyento-logo.png";


export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Login response:', data);
      
      if (data.success && data.client) {
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientData', JSON.stringify(data.client));
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.client.firstName} !`,
        });
        
  // Rediriger vers le dashboard client après connexion
  window.location.href = '/client-dashboard';
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Identifiants incorrects",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo centré en haut, cliquable */}
      <div className="pt-8 pb-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <img
            src={avyentoLogo}
            alt="Avyento"
            className="h-28 w-auto cursor-pointer"
            onClick={() => setLocation('/')} />
        </div>
      </div>

      {/* Formulaire centré */}
      <div className="flex-1 flex items-start justify-center px-6 pt-2">
        <div className="w-full max-w-sm glass-card p-8 rounded-2xl">
          <h1 className="text-xl font-medium text-gray-700 mb-8 text-center">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-14 glass-input rounded-2xl text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Champ Password */}
            <div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-14 glass-input rounded-2xl text-base placeholder:text-gray-400"
                required
              />
            </div>

            {/* Bouton Sign up */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 glass-button text-base font-semibold rounded-2xl"
            >
              {isLoading ? "Connexion..." : "Sign up"}
            </Button>
          </form>

          {/* Séparateur */}
          <div className="my-8 text-center">
            <span className="text-gray-400 text-sm">or Sign in with</span>
          </div>



          {/* Boutons sociaux */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Google login')}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Facebook login')}
            >
              <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                f
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Twitter login')}
            >
              <div className="w-6 h-6 bg-black rounded text-white text-xs font-bold flex items-center justify-center">
                X
              </div>
            </Button>
          </div>

          {/* Lien inscription */}
          <div className="text-center">
            <span className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-violet-600 font-semibold hover:text-violet-700"
                onClick={() => setLocation('/client-register')}
              >
                Sign up
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}