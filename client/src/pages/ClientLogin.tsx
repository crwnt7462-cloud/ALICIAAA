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
  User,
  Heart,
  Calendar,
  Shield,
  Star
} from "lucide-react";

export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
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
      const response = await fetch(`/api/client/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          })
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: isLogin ? "Connexion réussie" : "Compte créé",
          description: isLogin ? "Bienvenue !" : "Votre compte a été créé avec succès"
        });
        setLocation('/client-dashboard');
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

  const benefits = [
    { icon: <Calendar className="w-5 h-5" />, title: "Réservation instantanée", desc: "Prenez rendez-vous en 2 clics" },
    { icon: <Heart className="w-5 h-5" />, title: "Favoris & Historique", desc: "Retrouvez vos salons préférés" },
    { icon: <Star className="w-5 h-5" />, title: "Avis & Notes", desc: "Partagez votre expérience" },
    { icon: <Shield className="w-5 h-5" />, title: "Paiement sécurisé", desc: "Transactions protégées" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-10 w-10 p-0 rounded-full bg-white/80 hover:bg-white shadow-sm border"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Effet géométrique subtil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Votre beauté
                <span className="block text-2xl text-gray-600">à portée de main</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Découvrez et réservez les meilleurs salons de beauté près de chez vous
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-gray-700 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.desc}</p>
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
                <User className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light text-gray-900">Espace Client</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 text-sm ${isLogin ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 text-sm ${!isLogin ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Prénom</Label>
                      <Input
                        type="text"
                        placeholder="Marie"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Nom</Label>
                      <Input
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Téléphone</Label>
                    <Input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="marie@example.com"
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
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 h-11 font-medium"
                >
                  {isLogin ? "Se connecter" : "Créer mon compte"}
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