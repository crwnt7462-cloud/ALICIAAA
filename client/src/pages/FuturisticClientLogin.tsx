import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Lock, Star, Clock, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Effets futuristes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="h-12 w-12 p-0 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all duration-300 text-white shadow-2xl hover:scale-110"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-white mb-6">
                Votre beauté
                <span className="block text-2xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">à portée de main</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Découvrez et réservez les meilleurs salons de beauté près de chez vous
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-105 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-purple-300 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-300 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-lg rounded-full border border-white/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-light text-white">Espace Client</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-white/10 backdrop-blur-lg rounded-2xl p-1.5 border border-white/20">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-8 py-3 text-sm transition-all duration-500 hover:scale-105 rounded-xl font-medium ${isLogin ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-8 py-3 text-sm transition-all duration-500 hover:scale-105 rounded-xl font-medium ${!isLogin ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                      placeholder="Votre nom complet"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                      placeholder="Votre mot de passe"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                        placeholder="Confirmez votre mot de passe"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-white/20 rounded bg-white/5" />
                    <label className="ml-2 block text-sm text-gray-300">
                      J'accepte les <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">conditions d'utilisation</a>
                    </label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white hover:from-purple-600 hover:via-violet-600 hover:to-purple-700 h-12 font-semibold transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl transform active:scale-95 rounded-2xl shadow-lg border border-white/20 backdrop-blur-lg"
                >
                  {isLogin ? "Se connecter" : "Créer mon compte"}
                </Button>
              </form>

              {isLogin && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}

              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-xs text-gray-400">
                  En continuant, vous acceptez nos conditions générales
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}