import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Building2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/demo-login', {});
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.firstName} !`,
        });
        // Rediriger vers la page de gestion des pages
        setLocation('/pro-pages');
      } else {
        throw new Error('Erreur de connexion');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion démo",
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
          <CardTitle className="text-2xl">Connexion Démo</CardTitle>
          <p className="text-gray-600">Testez les fonctionnalités professionnelles</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Compte de démonstration</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Salon:</strong> Salon Beautiful</p>
              <p><strong>Propriétaire:</strong> Marie Dubois</p>
              <p><strong>Email:</strong> salon@example.com</p>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium"
          >
            <LogIn className="h-4 w-4 mr-2" />
            {isLoading ? 'Connexion...' : 'Se connecter en mode démo'}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Mode démo pour tester les fonctionnalités Pro Tools
          </div>
        </CardContent>
      </Card>
    </div>
  );
}