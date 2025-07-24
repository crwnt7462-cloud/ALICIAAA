import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Building2, Mail, Lock, Zap, BarChart3, Shield } from 'lucide-react';

export default function FuturisticProLogin() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/pro-dashboard');
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: "Intelligence artificielle", desc: "Optimisation automatique" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics avancés", desc: "Insights business temps réel" },
    { icon: <Shield className="w-5 h-5" />, title: "Sécurité maximale", desc: "Données protégées SSL" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Effets futuristes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
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
        {/* Côté gauche - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-white mb-6">
                Plateforme
                <span className="block text-2xl bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Professionnelle</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Gérez votre salon avec des outils de pointe et l'intelligence artificielle
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-105 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-indigo-300 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.desc}</p>
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
                <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 backdrop-blur-lg rounded-full border border-white/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-light text-white">Espace Pro</h2>
              </div>
              <div className="flex justify-center">
                <div className="flex bg-white/10 backdrop-blur-lg rounded-2xl p-1.5 border border-white/20">
                  <Button
                    variant={isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(true)}
                    className={`px-8 py-3 text-sm transition-all duration-500 hover:scale-105 rounded-xl font-medium ${isLogin ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "ghost"}
                    onClick={() => setIsLogin(false)}
                    className={`px-8 py-3 text-sm transition-all duration-500 hover:scale-105 rounded-xl font-medium ${!isLogin ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom du salon</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                      placeholder="Excellence Beauty Paris"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                      placeholder="votre@salon.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
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
                        className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/10"
                        placeholder="Confirmez votre mot de passe"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-white/20 rounded bg-white/5" />
                    <label className="ml-2 block text-sm text-gray-300">
                      J'accepte les <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">conditions d'utilisation</a>
                    </label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white hover:from-indigo-600 hover:via-blue-600 hover:to-indigo-700 h-12 font-semibold transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl transform active:scale-95 rounded-2xl shadow-lg border border-white/20 backdrop-blur-lg"
                >
                  {isLogin ? "Se connecter" : "Créer mon espace pro"}
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