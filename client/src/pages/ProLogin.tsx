import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import avyentoProLogo from "@/assets/avyento-logo.png";

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation et sanitisation des inputs
    const email = String(formData.email ?? "").trim().toLowerCase();
    const password = String(formData.password ?? "");
    
    // Validation email améliorée
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 254) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir un email valide",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Validation mot de passe
    if (!password || password.length < 6) {
      toast({
        title: "Mot de passe invalide",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        signal: controller.signal,
        cache: 'no-store',
        referrerPolicy: 'same-origin'
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.ok && data.user) {
        // Stockage sécurisé des données utilisateur
        try {
          localStorage.setItem('proData', JSON.stringify(data.user));
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue dans votre espace professionnel"
          });
          // Rafraîchir l'état d'authentification
          refreshAuth();
          setTimeout(() => {
            setLocation("/dashboard");
          }, 100);
        } catch (storageError) {
          console.error('Erreur de stockage:', storageError);
          toast({
            title: "Erreur de stockage",
            description: "Impossible de sauvegarder les données de session",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Identifiants incorrects",
          variant: "destructive"
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Connexion expirée",
          description: "La connexion a pris trop de temps. Veuillez réessayer.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: error instanceof Error ? error.message : "Erreur serveur",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Bouton retour */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
        aria-label="Revenir à l'accueil"
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
            className="mx-auto h-32 w-auto"
            loading="eager"
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
              <p className="text-gray-600">Accédez à votre espace</p>
              
              {/* Indicateur de sécurité */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Connexion sécurisée</span>
              </div>
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
                    autoComplete="email"
                    autoFocus
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
                    className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full glass-button-purple text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  "Se connecter"
                )}
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
                    className="text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>

              {/* Mentions légales RGPD */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
                <p>
                  En vous connectant, vous acceptez nos{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/terms")}
                    className="text-violet-600 hover:text-violet-700 underline"
                  >
                    Conditions d'utilisation
                  </button>{" "}
                  et notre{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/privacy")}
                    className="text-violet-600 hover:text-violet-700 underline"
                  >
                    Politique de confidentialité
                  </button>
                  .
                </p>
                <p className="mt-2">
                  Vos données sont hébergées en Europe et protégées par le RGPD.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}