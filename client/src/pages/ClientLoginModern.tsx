import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import rendlyLogo from "@assets/3_1753714421825.png";
import { getGenericGlassButton } from "@/lib/salonColors";

export default function ClientLoginModern() {
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
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'client'
        }),
      });

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('✅ CLIENT LOGIN SUCCESS:', data);
          
          if (data.success && data.redirect) {
            toast({
              title: "Connexion réussie",
              description: "Bienvenue !",
            });
            window.location.href = data.redirect;
          } else if (data.success) {
            toast({
              title: "Connexion réussie",
              description: "Bienvenue !",
            });
            window.location.href = '/search';
          } else {
            throw new Error('Format de réponse invalide');
          }
        } catch (parseError) {
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
    <div className="min-h-screen bg-white">
      {/* Layout ultra-minimaliste - même style que page recherche */}
      <div className="relative">
        
        {/* Bouton retour en haut à gauche */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-4 z-10 p-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Container principal - même style que page recherche */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto glass-card p-8 rounded-2xl">
            
            {/* Logo Rendly centré */}
            <div className="text-center mb-3">
              <img src={rendlyLogo} alt="Rendly" className="h-28 w-auto mx-auto" />
            </div>

            {/* Titre - même style */}
            <div className="text-center mb-6">
              <h2 className="text-xl text-gray-500 font-normal">Espace Client</h2>
            </div>
          
            {/* Champs de connexion - même style que recherche */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full h-12 px-4 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full h-12 px-4 pr-12 glass-input rounded-2xl text-base text-gray-900 placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Bouton connexion - même style que "Search" */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 ${getGenericGlassButton(0)} rounded-2xl text-base font-medium`}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            {/* Lien vers inscription */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setLocation('/client-register')}
                  className="text-gray-700 font-medium hover:underline"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}