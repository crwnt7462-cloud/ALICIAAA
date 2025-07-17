import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Building,
  Eye,
  EyeOff,
  Sparkles,
  Shield
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court")
});

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  businessName: z.string().min(2, "Nom du salon requis"),
  ownerName: z.string().min(2, "Nom du propriétaire requis"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  address: z.string().min(5, "Adresse complète requise"),
  city: z.string().min(2, "Ville requise")
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Simulation de connexion réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace professionnel"
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Simulation d'inscription réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Inscription réussie",
        description: "Votre compte professionnel a été créé"
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de créer le compte",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50/30">
      {/* Header minimaliste */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {/* Logo/Titre */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Espace Professionnel
              </h1>
            </div>
            <p className="text-gray-600">
              Connectez-vous à votre plateforme de gestion
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-violet-600" />
                <CardTitle className="text-xl text-center text-gray-900">
                  Accès Sécurisé
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm">
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm">
                    Inscription
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                        Email professionnel
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 h-11"
                          {...loginRegister("email")}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="text-xs text-red-600">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11"
                          {...loginRegister("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-xs text-red-600">{loginErrors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <a href="#" className="text-violet-600 hover:text-violet-700 hover:underline">
                        Mot de passe oublié ?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Connexion...
                        </div>
                      ) : (
                        "Se connecter"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
                          Votre nom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="ownerName"
                            placeholder="Jean Dupont"
                            className="pl-10 h-11"
                            {...registerRegister("ownerName")}
                          />
                        </div>
                        {registerErrors.ownerName && (
                          <p className="text-xs text-red-600">{registerErrors.ownerName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Téléphone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="01 23 45 67 89"
                            className="pl-10 h-11"
                            {...registerRegister("phone")}
                          />
                        </div>
                        {registerErrors.phone && (
                          <p className="text-xs text-red-600">{registerErrors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                        Nom de votre salon
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="businessName"
                          placeholder="Salon Beauté Élégance"
                          className="pl-10 h-11"
                          {...registerRegister("businessName")}
                        />
                      </div>
                      {registerErrors.businessName && (
                        <p className="text-xs text-red-600">{registerErrors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                        Email professionnel
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="contact@monsalon.fr"
                          className="pl-10 h-11"
                          {...registerRegister("email")}
                        />
                      </div>
                      {registerErrors.email && (
                        <p className="text-xs text-red-600">{registerErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11"
                          {...registerRegister("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {registerErrors.password && (
                        <p className="text-xs text-red-600">{registerErrors.password.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                          Adresse
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            placeholder="123 rue Example"
                            className="pl-10 h-11"
                            {...registerRegister("address")}
                          />
                        </div>
                        {registerErrors.address && (
                          <p className="text-xs text-red-600">{registerErrors.address.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          Ville
                        </Label>
                        <Input
                          id="city"
                          placeholder="Paris"
                          className="h-11"
                          {...registerRegister("city")}
                        />
                        {registerErrors.city && (
                          <p className="text-xs text-red-600">{registerErrors.city.message}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Création...
                        </div>
                      ) : (
                        "Créer mon compte"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Lien vers essai gratuit */}
              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">ou</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a 
                    href="/free-trial"
                    className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline"
                  >
                    Commencer un essai gratuit de 14 jours
                  </a>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-6 text-center text-xs text-gray-500">
                En vous connectant, vous acceptez nos{" "}
                <a href="#" className="text-violet-600 hover:underline">
                  conditions d'utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-violet-600 hover:underline">
                  politique de confidentialité
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}