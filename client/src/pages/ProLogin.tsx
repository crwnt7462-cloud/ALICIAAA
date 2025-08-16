import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import avyentoProLogo from "@assets/Logo avyento pro._1755359490006.png";

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/login/professional", formData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue dans votre espace professionnel"
        });
        setLocation("/dashboard");
      } else {
        throw new Error(data.error || "Erreur de connexion");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
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
    <div className="min-h-screen bg-white relative">
      {/* Bouton retour */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Logo centré */}
      <div className="text-center pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={avyentoProLogo} 
            alt="Avyento Pro" 
            className="mx-auto"
            style={{ height: '130px' }}
          />
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                Connexion Professionnelle
              </h1>
              <p className="text-gray-600">Accédez à votre espace salon</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email professionnel
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@monsalon.fr"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 glass-input"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 pr-10 glass-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full glass-button-purple text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              {/* Liens */}
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setLocation("/forgot-password")}
                  className="text-sm text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
                <div className="text-sm text-gray-600">
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/register")}
                    className="text-violet-600 hover:text-violet-700 transition-colors font-medium"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}