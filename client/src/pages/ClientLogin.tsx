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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-10 w-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border border-violet-200 transition-all duration-300 hover:scale-110 text-violet-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Effets luxueux */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-4 h-4 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-32 w-5 h-5 bg-gradient-to-r from-rose-300 to-violet-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Votre beauté
                <span className="block text-2xl bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">à portée de main</span>
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                Découvrez et réservez les meilleurs salons de beauté près de chez vous
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-lg border border-violet-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 hover:scale-[1.03] animate-slide-up transform hover:-translate-y-1" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-violet-600 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-white shadow-2xl border border-violet-100 rounded-2xl backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-violet-100 to-pink-100 rounded-full">
                  <User className="w-6 h-6 text-violet-600" />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Espace Client</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-1.5 border border-violet-200 shadow-sm">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-8 py-3 text-sm transition-all duration-300 hover:scale-105 rounded-lg font-medium ${isLogin ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform active:scale-95' : 'text-violet-700 hover:text-violet-800 hover:bg-white/80'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-8 py-3 text-sm transition-all duration-300 hover:scale-105 rounded-lg font-medium ${!isLogin ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform active:scale-95' : 'text-violet-700 hover:text-violet-800 hover:bg-white/80'}`}
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
                  className="w-full bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 text-white hover:from-violet-600 hover:via-pink-600 hover:to-rose-600 h-12 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl transform active:scale-95 rounded-xl shadow-lg"
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