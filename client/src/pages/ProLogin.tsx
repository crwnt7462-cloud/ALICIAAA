import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Building2, Eye, EyeOff, ArrowLeft, Users, Sparkles, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function ProLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Pro login response:', data);
          
          if (data.success && data.user) {
            localStorage.setItem('proToken', data.user.id);
            localStorage.setItem('proData', JSON.stringify(data.user));
            
            toast({
              title: "Connexion réussie",
              description: `Bienvenue ${data.user.firstName} !`,
            });
            
            // Redirection immédiate vers les Pro Tools
            window.location.href = '/business-features';
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
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex">
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center space-y-8 max-w-md">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/30">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Espace Professionnel
              </h1>
              <p className="text-xl text-violet-100 leading-relaxed">
                Gérez votre salon avec simplicité et efficacité
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
              {[
                { icon: Users, text: "Gestion clients avancée" },
                { icon: Building2, text: "Planning intelligent" },
                { icon: Shield, text: "Sécurité garantie" }
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
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-violet-600" />
              </div>
              <CardTitle className="text-2xl">Connexion Professionnelle</CardTitle>
              <p className="text-gray-600">Accédez à votre espace Pro</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email professionnel
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-12 rounded-lg pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium h-12"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Compte de test disponible</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Email:</strong> test@monapp.com</p>
                  <p><strong>Mot de passe:</strong> test1234</p>
                  <p><strong>Handle:</strong> @usemyrr</p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                Connexion sécurisée uniquement avec compte existant
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}