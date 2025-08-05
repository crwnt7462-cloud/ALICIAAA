import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import rendlyLogo from "@assets/3_1753714421825.png";
// import backgroundImage from "@assets/Sans titre (Votre story)_1754235595606.png";
import { getGenericGlassButton } from "@/lib/salonColors";

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



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white relative overflow-hidden">
      {/* Motifs géométriques subtils en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-rose-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-amber-200 rounded-full blur-xl"></div>
      </div>
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
        <div className="px-6 pt-16 pb-6 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border border-gray-200/50 p-10 rounded-3xl shadow-2xl relative z-10">
            
            {/* Logo Rendly centré */}
            <div className="text-center mb-6">
              <img src={rendlyLogo} alt="Rendly" className="h-32 w-auto mx-auto" />
            </div>

            {/* Titre - même style */}
            <div className="text-center mb-8">
              <h2 className="text-2xl text-gray-800 font-normal">Sign in to your salon</h2>
            </div>
          
            {/* Champs de connexion - même style que recherche */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email professionnel"
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-300 rounded-2xl text-lg text-gray-800 placeholder:text-gray-500"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full h-14 px-6 pr-12 bg-gray-50 border border-gray-300 rounded-2xl text-lg text-gray-800 placeholder:text-gray-500"
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

              {/* Bouton connexion - copié de ClientLoginModern */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 glass-button rounded-2xl text-base font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connexion..." : "Sign in"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}