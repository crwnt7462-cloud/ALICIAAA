import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import rendlyLogo from "@assets/3_1753714421825.png";

import { Eye, EyeOff } from 'lucide-react';

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Pro login response:', data);
          
          if (data.success && data.user) {
            localStorage.setItem('proToken', data.user.id);
            localStorage.setItem('proData', JSON.stringify(data.user));
            
            toast({
              title: "Connexion réussie",
              description: `Bienvenue ${data.user.firstName} !`,
            });
            
            // Redirection immédiate vers les Pro Tools
            window.location.href = '/business-features';
          } else {
            throw new Error('Format de réponse invalide');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          toast({
            title: "Erreur de connexion",
            description: "Réponse serveur invalide",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: `Erreur ${response.status}: Identifiants incorrects`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Erreur de réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo centré en haut */}
      <div className="pt-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src={rendlyLogo} alt="Rendly" className="h-32 w-auto" />
        </div>
      </div>

      {/* Formulaire centré */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-medium text-gray-700 mb-8 text-center">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Champ Password */}
            <div>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Password"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Bouton Sign up */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold rounded-2xl shadow-lg"
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
                onClick={() => setLocation('/professional-plans')}
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