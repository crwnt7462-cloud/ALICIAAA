import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Building2, Eye, EyeOff } from 'lucide-react';
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
      const response = await apiRequest('POST', '/api/auth/login', formData);
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.firstName} !`,
        });
        // Redirection vers le tableau de bord pro
        setLocation('/pro-dashboard');
      } else {
        const errorData = await response.json();
        toast({
          title: "Erreur de connexion",
          description: errorData.message || "Identifiants incorrects",
          variant: "destructive"
        });
      }
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
                className="w-full"
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
                  className="w-full pr-10"
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
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium"
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
  );
}