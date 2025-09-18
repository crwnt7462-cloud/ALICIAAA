import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Lock, Star, Clock, Shield } from 'lucide-react';
import avyentoLogo from "@/assets/avyento-logo.png";

export default function FuturisticClientLogin() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/client-dashboard');
  };

  const benefits = [
    { icon: <Star className="w-5 h-5" />, title: "Réservation instantanée", desc: "Confirmé en 2 clics" },
    { icon: <Clock className="w-5 h-5" />, title: "Disponibilités temps réel", desc: "Toujours à jour" },
    { icon: <Shield className="w-5 h-5" />, title: "Paiement sécurisé", desc: "Transactions protégées" }
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
        {/* Côté gauche - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Votre beauté
                <span className="block text-2xl text-gray-700">à portée de main</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Découvrez et réservez les meilleurs salons de beauté près de chez vous
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                  <div className="text-gray-600 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.desc}</p>
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
                <h2 className="text-2xl font-light text-gray-900">Espace Client</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Votre nom complet"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Votre mot de passe"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
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
                  className="w-full bg-violet-600 text-white hover:bg-violet-700 h-11 font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-full"
                >
                  {isLogin ? "Se connecter" : "Créer mon compte"}
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