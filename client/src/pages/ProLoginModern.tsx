import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import rendlyLogo from "@assets/3_1753714421825.png";

export default function ProLoginModern() {
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
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          
          if (data.success && data.user) {
            localStorage.setItem('proToken', data.user.id);
            localStorage.setItem('proData', JSON.stringify(data.user));
            
            toast({
              title: "Connexion réussie",
              description: `Bienvenue ${data.user.firstName} !`,
            });
            
            window.location.href = '/business-features';
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

  const handleDemoLogin = () => {
    setFormData({ email: 'test@monapp.com', password: 'test1234' });
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
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
          <div className="max-w-sm mx-auto">
            
            {/* Logo Rendly centré */}
            <div className="text-center mb-3">
              <img src={rendlyLogo} alt="Rendly" className="h-28 w-auto mx-auto" />
            </div>

            {/* Titre - même style */}
            <div className="text-center mb-6">
              <h2 className="text-xl text-gray-500 font-normal">Sign in to your salon</h2>
            </div>
          
            {/* Champs de connexion - même style que recherche */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email professionnel"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
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
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-2xl text-base font-medium transition-colors"
              >
                {isLoading ? "Connexion..." : "Sign in"}
              </button>
            </form>

            {/* Texte séparateur */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">or access demo</p>
            </div>

            {/* Bouton démo - même style que catégories */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleDemoLogin}
                className="h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-medium text-gray-600 transition-colors"
              >
                Compte démo salon
              </button>
            </div>

            {/* Info compte démo */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">test@monapp.com / test1234</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}