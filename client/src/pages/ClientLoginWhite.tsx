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

export default function ClientLoginWhite() {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-10 w-10 p-0 rounded-full bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-all duration-300 text-gray-600 hover:scale-110"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Votre beauté
                <span className="block text-2xl text-gray-700">à portée de main</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Découvrez et réservez les meilleurs salons de beauté près de chez vous
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                  <div className="text-gray-600 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-full border border-gray-200">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Espace Client</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 text-sm rounded-md font-medium ${isLogin ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 text-sm rounded-md font-medium ${!isLogin ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">Prénom</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="border-gray-200 focus:border-violet-400 h-10"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">Nom</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="border-gray-200 focus:border-violet-400 h-10"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-gray-200 focus:border-violet-400 pl-10 h-10"
                      placeholder="votre@email.com"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="border-gray-200 focus:border-violet-400 pl-10 pr-10 h-10"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="border-gray-200 focus:border-violet-400 pl-10 h-10"
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-gray-200 focus:border-violet-400 h-10"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 h-10 rounded-md"
                >
                  {isLogin ? "Se connecter" : "Créer mon compte"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}