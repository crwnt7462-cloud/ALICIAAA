import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Building2, Mail, Lock, Zap, BarChart3, Shield } from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import avyentoLogo from "@assets/3_1753714421825.png";

export default function FuturisticProLogin() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const { loginMutation, registerMutation } = useAuthSession();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Connexion
      loginMutation.mutate({ email: formData.email, password: formData.password }, {
        onSuccess: () => {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans votre espace professionnel",
          });
          setLocation('/dashboard');
        },
        onError: (error: any) => {
          toast({
            title: "Erreur de connexion",
            description: error?.message || "Vérifiez vos identifiants",
            variant: "destructive",
          });
        }
      });
    } else {
      // Inscription
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive",
        });
        return;
      }
      
      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName
      }, {
        onSuccess: () => {
          toast({
            title: "Inscription réussie",
            description: "Votre compte professionnel a été créé",
          });
          setLocation('/dashboard');
        },
        onError: (error: any) => {
          toast({
            title: "Erreur d'inscription",
            description: error?.message || "Une erreur est survenue",
            variant: "destructive",
          });
        }
      });
    }
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: "Intelligence artificielle", desc: "Optimisation automatique" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics avancés", desc: "Insights business temps réel" },
    { icon: <Shield className="w-5 h-5" />, title: "Sécurité maximale", desc: "Données protégées SSL" }
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
        {/* Côté gauche - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Plateforme
                <span className="block text-2xl text-gray-700">Professionnelle</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Gérez votre salon avec des outils de pointe et l'intelligence artificielle
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                  <div className="text-gray-600 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex flex-col items-center justify-center mb-2">
                <img src={avyentoLogo} alt="Avyento" className="h-28 w-auto mb-2" />
                <h2 className="text-2xl font-light text-gray-900">Espace Pro</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 rounded-full font-medium ${isLogin ? 'bg-violet-600 text-white shadow-lg hover:bg-violet-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 text-sm transition-all duration-300 hover:scale-105 rounded-full font-medium ${!isLogin ? 'bg-violet-600 text-white shadow-lg hover:bg-violet-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du salon</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Excellence Beauty Paris"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="votre@salon.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Votre mot de passe"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                    <label className="ml-2 block text-sm text-gray-900">
                      J'accepte les <a href="#" className="text-violet-600 hover:text-violet-700">conditions d'utilisation</a>
                    </label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending || registerMutation.isPending}
                  className="w-full bg-violet-600 text-white hover:bg-violet-700 h-11 font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(loginMutation.isPending || registerMutation.isPending) ? "Connexion en cours..." : (isLogin ? "Se connecter" : "Créer mon espace pro")}
                </Button>
              </form>

              {isLogin && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors rounded-full"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}