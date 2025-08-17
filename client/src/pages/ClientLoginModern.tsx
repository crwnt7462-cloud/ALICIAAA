import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User,
  Sparkles,
  Shield,
  Clock,
  Smartphone
} from "lucide-react";
import avyentoLogo from "@assets/3_1753714421825.png";

export default function ClientLoginModern() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

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
      const endpoint = isLogin ? '/api/client/login' : '/api/client/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success && data.client) {
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientData', JSON.stringify(data.client));
        
        toast({
          title: isLogin ? "Connexion réussie" : "Compte créé",
          description: isLogin 
            ? `Bienvenue ${data.client.firstName}!` 
            : "Votre compte a été créé avec succès",
        });
        
        // Vérifier s'il y a une réservation en cours
        const hasBookingInProgress = sessionStorage.getItem('currentBooking');
        if (hasBookingInProgress) {
          setLocation('/salon-booking');
        } else {
          setLocation('/client-dashboard');
        }
      } else {
        toast({
          title: isLogin ? "Erreur de connexion" : "Erreur de création",
          description: data.error || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur authentification:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Réservation instantanée",
      description: "Confirmez votre rendez-vous en quelques clics"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Disponibilités temps réel",
      description: "Voir les créneaux libres en direct"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Paiement sécurisé",
      description: "Transactions protégées et chiffrées"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Notifications smart",
      description: "Rappels automatiques de vos rendez-vous"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header avec logo et retour */}
      <div className="absolute top-6 left-6 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="h-12 w-12 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg border border-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
        </motion.div>
      </div>

      <div className="flex min-h-screen">
        {/* Côté gauche - Benefits et branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden">
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10 max-w-md mx-auto text-white">
            {/* Logo */}
            <motion.div 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={avyentoLogo} 
                alt="Avyento" 
                className="h-12 mx-auto mb-4 filter brightness-0 invert"
              />
              <h1 className="text-4xl font-light mb-2">
                Bienvenue sur
                <span className="block text-3xl font-medium bg-gradient-to-r from-pink-200 to-indigo-200 bg-clip-text text-transparent">
                  Avyento
                </span>
              </h1>
              <p className="text-indigo-100 text-lg leading-relaxed">
                La plateforme de beauté nouvelle génération
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-pink-200 mt-1 p-2 bg-white/10 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Titre dynamique */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-light text-slate-800 mb-2">
                    {isLogin ? "Connexion" : "Créer un compte"}
                  </h2>
                  <p className="text-slate-600">
                    {isLogin 
                      ? "Accédez à votre espace personnel" 
                      : "Rejoignez la communauté Avyento"
                    }
                  </p>
                </div>

                {/* Toggle Login/Register */}
                <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      isLogin 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      !isLogin 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Inscription
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Champs d'inscription uniquement */}
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-slate-700 font-medium">
                          Prénom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Votre prénom"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-slate-700 font-medium">
                          Nom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Votre nom"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Téléphone pour inscription */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 font-medium">
                        Téléphone (optionnel)
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmation mot de passe pour inscription */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bouton de soumission */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 h-auto rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        {isLogin ? "Connexion..." : "Création du compte..."}
                      </div>
                    ) : (
                      isLogin ? "Se connecter" : "Créer mon compte"
                    )}
                  </Button>
                </form>

                {/* Liens supplémentaires */}
                {isLogin && (
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => setLocation('/forgot-password')}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Message légal pour inscription */}
                {!isLogin && (
                  <p className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
                    En créant un compte, vous acceptez nos{" "}
                    <button 
                      onClick={() => setLocation('/cgu')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Conditions d'utilisation
                    </button>{" "}
                    et notre{" "}
                    <button 
                      onClick={() => setLocation('/confidentialite')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Politique de confidentialité
                    </button>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}