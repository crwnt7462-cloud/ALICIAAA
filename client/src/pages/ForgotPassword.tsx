import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'sent' | 'error'>('form');

  const resetMutation = useMutation({
    mutationFn: async (emailData: { email: string }) => {
      const response = await apiRequest('POST', '/api/auth/forgot-password', emailData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }
      return response.json();
    },
    onSuccess: () => {
      setStep('sent');
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"
      });
    },
    onError: (error: Error) => {
      setStep('error');
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    resetMutation.mutate({ email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
          <p className="text-gray-600">
            Saisissez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'sent' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : step === 'error' ? (
                <AlertCircle className="h-8 w-8 text-red-600" />
              ) : (
                <Mail className="h-8 w-8 text-violet-600" />
              )}
            </div>
            <CardTitle>
              {step === 'sent' ? 'Email envoyé !' : 
               step === 'error' ? 'Erreur' : 
               'Réinitialisation'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="pl-10"
                      disabled={resetMutation.isPending}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {resetMutation.isPending ? 'Envoi en cours...' : 'Envoyer le lien'}
                </Button>
              </form>
            )}

            {step === 'sent' && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    Un email de réinitialisation a été envoyé à <strong>{email}</strong>
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.</p>
                  <p>Le lien expire dans 1 heure.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('form');
                    setEmail('');
                  }}
                  className="w-full"
                >
                  Renvoyer un email
                </Button>
              </div>
            )}

            {step === 'error' && (
              <div className="text-center space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    Impossible d'envoyer l'email. Vérifiez que l'adresse est correcte.
                  </p>
                </div>
                <Button
                  onClick={() => setStep('form')}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  Réessayer
                </Button>
              </div>
            )}

            {/* Lien de retour */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setLocation('/client-login')}
                className="w-full text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Aide supplémentaire */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Vous ne trouvez pas l'email ?</p>
          <p>Vérifiez vos dossiers spam et courriers indésirables.</p>
        </div>
      </div>
    </div>
  );
}