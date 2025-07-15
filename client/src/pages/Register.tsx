import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Mail, Lock, User, Phone, MapPin, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
  businessName: z.string().min(2, "Nom du salon requis"),
  ownerName: z.string().min(2, "Nom du propriétaire requis"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  address: z.string().min(5, "Adresse complète requise"),
  city: z.string().min(2, "Ville requise")
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", data);
      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès"
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
              onClick={() => setLocation("/pro-login")}
              className="text-gray-600 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all duration-200"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Inscription
            </h1>
            <p className="text-gray-600 text-lg">
              Rejoignez la révolution beauté digitale
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600"></div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Nouveau compte</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Rejoignez la communauté Rendly et digitalisez votre salon
              </CardDescription>
            </CardHeader>
            
            <CardContent>
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
                              <User className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                              <Input {...field} placeholder="John Doe" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                              <Building className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                              <Input {...field} placeholder="Salon Beauty" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                            <Input {...field} type="email" placeholder="contact@salon.com" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                            <Input {...field} placeholder="01 23 45 67 89" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                            <Input {...field} placeholder="123 rue de la Beauté" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                          <Input {...field} placeholder="Paris" className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
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
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-violet-400" />
                            <Input {...field} type="password" placeholder="••••••••" className="pl-12 h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl transition-all duration-200" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium py-3 shadow-lg" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Création...
                      </div>
                    ) : (
                      "Créer mon compte"
                    )}
                  </Button>

                  <div className="text-center pt-6 border-t border-violet-100">
                    <p className="text-sm text-gray-600 mb-3">Déjà un compte ?</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 font-medium"
                      onClick={() => setLocation("/pro-login")}
                    >
                      Se connecter
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Gratuit 14 jours
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Sans engagement
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Support inclus
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Besoin d'aide ? <a href="#" className="text-violet-600 hover:text-violet-800 font-medium">Contactez notre support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}