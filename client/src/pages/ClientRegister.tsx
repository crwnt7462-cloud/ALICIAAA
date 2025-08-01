import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import rendlyLogo from "@assets/3_1753714421825.png";

export default function ClientRegister() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }),
        credentials: 'include'
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Register response:', data);
          
          if (data.success && data.client) {
            localStorage.setItem('clientToken', data.client.token);
            localStorage.setItem('clientData', JSON.stringify(data.client));
            
            toast({
              title: "Compte créé !",
              description: "Votre compte a été créé avec succès",
            });
            
            // Redirection vers le dashboard client
            window.location.href = '/client-dashboard';
          } else {
            throw new Error('Format de réponse invalide');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          toast({
            title: "Erreur d'inscription",
            description: "Réponse serveur invalide",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur d'inscription",
          description: `Erreur ${response.status}: L'email est peut-être déjà utilisé`,
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo centré en haut */}
      <div className="pt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-1 bg-white rounded-full transform rotate-45"></div>
          </div>
          <img src={rendlyLogo} alt="Rendly" className="h-8 w-auto" />
        </div>
      </div>

      {/* Formulaire centré */}
      <div className="flex-1 flex items-start justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-medium text-gray-700 mb-8 text-center">
            Create an account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Prénom */}
            <div>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Prénom"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Champ Nom */}
            <div>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Nom"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Champ Email */}
            <div>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Champ Téléphone */}
            <div>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Téléphone (optionnel)"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Champ Password */}
            <div>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mot de passe"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Champ Confirm Password */}
            <div>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirmer le mot de passe"
                className="h-14 bg-gray-50 border-0 rounded-2xl text-base placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Bouton Sign up */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold rounded-2xl shadow-lg"
            >
              {isLoading ? "Création..." : "Sign up"}
            </Button>
          </form>

          {/* Séparateur */}
          <div className="my-8 text-center">
            <span className="text-gray-400 text-sm">or Sign in with</span>
          </div>

          {/* Boutons sociaux */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Google signup')}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Facebook signup')}
            >
              <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                f
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
              onClick={() => console.log('Twitter signup')}
            >
              <div className="w-6 h-6 bg-black rounded text-white text-xs font-bold flex items-center justify-center">
                X
              </div>
            </Button>
          </div>

          {/* Lien connexion */}
          <div className="text-center">
            <span className="text-gray-500 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                className="text-violet-600 font-semibold hover:text-violet-700"
                onClick={() => setLocation('/client-login')}
              >
                Sign in
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}