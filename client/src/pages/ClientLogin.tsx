import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, User, Heart, Calendar, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Login response:', data);
          
          if (data.success && data.client) {
            localStorage.setItem('clientToken', data.client.token);
            localStorage.setItem('clientData', JSON.stringify(data.client));
            
            toast({
              title: "Connexion réussie",
              description: `Bienvenue ${data.client.firstName} !`,
            });
            
            // Redirection immédiate vers le dashboard client
            window.location.href = '/client-dashboard';
          } else {
            throw new Error('Format de réponse invalide');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          toast({
            title: "Erreur de connexion",
            description: "Réponse serveur invalide",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: `Erreur ${response.status}: Identifiants incorrects`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-violet-50 flex">
      {/* Bouton retour */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-white/50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      {/* Section gauche - Image et branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-500 via-rose-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center space-y-8 max-w-md">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/30">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Espace Client
              </h1>
              <p className="text-xl text-pink-100 leading-relaxed">
                Votre beauté, nos soins experts
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
              {[
                { icon: Calendar, text: "Réservation simplifiée" },
                { icon: Heart, text: "Prestations personnalisées" },
                { icon: Shield, text: "Paiement sécurisé" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-2 border-black/10 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-violet-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Connexion Client</CardTitle>
              <p className="text-gray-600 mt-2">Accédez à votre espace personnel</p>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button 
                    type="button"
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Nouveau sur notre plateforme ?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/client-register')}
                  className="h-12 px-8 border-violet-200 text-violet-600 hover:bg-violet-50 font-medium transition-colors rounded-lg"
                >
                  Créer mon compte
                </Button>
              </div>

              <div className="mt-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">Compte de test disponible</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Email:</strong> client@test.com</p>
                  <p><strong>Mot de passe:</strong> client123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}