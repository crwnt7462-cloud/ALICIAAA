import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Building2,
  Sparkles,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    salonName: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : {
            salonName: formData.salonName,
            phone: formData.phone
          })
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: isLogin ? "Connexion réussie" : "Compte créé",
          description: isLogin ? "Bienvenue dans votre espace professionnel" : "Votre salon a été enregistré avec succès"
        });
        setLocation('/dashboard');
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    }
  };

  const features = [
    { icon: <TrendingUp className="w-5 h-5" />, title: "Analytics avancés", desc: "Tableaux de bord intelligents" },
    { icon: <Users className="w-5 h-5" />, title: "Gestion clientèle", desc: "Base de données complète" },
    { icon: <Sparkles className="w-5 h-5" />, title: "IA intégrée", desc: "Assistant virtuel Rendly" },
    { icon: <Shield className="w-5 h-5" />, title: "Sécurité maximale", desc: "Données protégées SSL" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Effet géométrique */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light mb-4">
                Plateforme
                <span className="block text-2xl text-gray-400">Professionnelle</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Gérez votre salon avec des outils de pointe et l'intelligence artificielle
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <div className="text-gray-300 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-gray-300" />
                <h2 className="text-2xl font-light text-white">Espace Pro</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 text-sm ${isLogin ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 text-sm ${!isLogin ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Nom du salon</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Mon Salon de Beauté"
                          value={formData.salonName}
                          onChange={(e) => setFormData({...formData, salonName: e.target.value})}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-300">Email professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="pro@monsalon.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200 h-11 font-medium"
                >
                  {isLogin ? "Se connecter" : "Créer mon espace pro"}
                </Button>
              </form>

              {isLogin && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}

              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  En continuant, vous acceptez nos conditions générales
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}