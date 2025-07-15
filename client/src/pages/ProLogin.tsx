import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Mail, Lock, User, Phone, MapPin, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
      ownerName: "",
      phone: "",
      address: "",
      city: ""
    }
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      if (response.ok) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace professionnel"
        });
        setLocation("/dashboard");
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", data);
      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte professionnel a été créé"
        });
        setLocation("/dashboard");
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Veuillez réessayer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100 to-violet-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-xl shadow-lg border-b border-violet-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setLocation("/")}>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-wide group-hover:text-violet-600 transition-colors duration-200" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif', fontWeight: 600, letterSpacing: '0.02em' }}>Rendly</span>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all duration-200"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Connexion
            </h1>
            <p className="text-gray-600 text-lg">
              Accédez à votre espace de gestion professionnel
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600"></div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Accès Sécurisé</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Connectez-vous à votre plateforme de gestion
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                                <Input {...field} type="email" placeholder="votre@email.com" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                                <Input {...field} type="password" placeholder="••••••••" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-lg">Connexion en cours...</span>
                          </div>
                        ) : (
                          <span className="text-lg">Se connecter</span>
                        )}
                      </Button>
                      
                      <div className="text-center pt-8 border-t border-violet-100">
                        <p className="text-base text-gray-600 mb-4">Pas encore de compte ?</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full border-2 border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
                          onClick={() => setLocation("/register")}
                        >
                          Créer un compte
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="ownerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Votre nom</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                  <Input {...field} placeholder="John Doe" className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom du salon</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                  <Input {...field} placeholder="Salon Beauty" className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email professionnel</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input {...field} type="email" placeholder="contact@salon.com" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input {...field} placeholder="01 23 45 67 89" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input {...field} placeholder="123 rue de la Beauté" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Paris" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input {...field} type="password" placeholder="••••••••" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={isLoading}>
                        {isLoading ? "Création..." : "Créer mon compte"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-10">
            <div className="flex items-center justify-center gap-6 text-base text-gray-500 mb-6">
              <span className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Sécurisé SSL</span>
              </span>
              <span className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300" />
                <span className="font-medium">Connexion rapide</span>
              </span>
              <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-500" />
                <span className="font-medium">Support 24/7</span>
              </span>
            </div>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-2xl">
              <p className="text-base text-gray-700 mb-2">
                <span className="font-semibold">Besoin d'aide ?</span>
              </p>
              <a href="#" className="text-violet-600 hover:text-violet-800 font-semibold text-lg hover:underline transition-all duration-200">
                Contactez notre équipe support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}