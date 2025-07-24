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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>



      <div className="flex min-h-screen">
        {/* Côté gauche - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light mb-4 text-gray-900">
                Plateforme
                <span className="block text-2xl text-gray-700">Professionnelle</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Gérez votre salon avec des outils de pointe et l'intelligence artificielle
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                  <div className="text-gray-600 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light text-gray-900">Espace Pro</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 ${isLogin ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 ${!isLogin ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
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
                      <Label className="text-gray-700">Nom du salon</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Mon Salon de Beauté"
                          value={formData.salonName}
                          onChange={(e) => setFormData({...formData, salonName: e.target.value})}
                          className="pl-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-700">Email professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="pro@monsalon.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-violet-600 text-white hover:bg-violet-700 h-11 font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  {isLogin ? "Se connecter" : "Créer mon espace pro"}
                </Button>
              </form>

              {isLogin && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}

              <div className="text-center pt-4 border-t border-gray-200">
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