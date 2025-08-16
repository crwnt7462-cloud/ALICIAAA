import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import avyentoLogo from "@assets/Logo avyento._1755363678253.png";

export default function ClientRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Champs requis",
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
      const { confirmPassword, ...registerData } = formData;
      const response = await fetch('/api/register/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Compte créé avec succès !",
          description: "Vous pouvez maintenant vous connecter",
        });
        setLocation('/client-login');
      } else {
        toast({
          title: "Erreur de création",
          description: data.message || "Une erreur est survenue lors de la création du compte",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de réseau",
        description: "Impossible de créer le compte",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Bouton retour en haut à gauche avec style /home */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Contenu principal optimisé desktop */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md lg:max-w-4xl"
        >
          {/* Card principale avec orientation paysage sur desktop */}
          <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl lg:flex lg:h-[75vh] overflow-hidden">
            
            {/* Section gauche - Branding (desktop uniquement) */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-center lg:p-10 lg:bg-gradient-to-br lg:from-violet-50 lg:to-purple-50 lg:rounded-l-3xl">
              <div className="text-center w-full max-w-sm px-4">
                <div className="mb-2">
                  <img 
                    src={avyentoLogo} 
                    alt="Avyento" 
                    className="mx-auto"
                    style={{ height: '145px' }}
                  />
                </div>
                <p className="text-gray-600 text-base mb-8 leading-relaxed px-2">
                  Rejoignez des milliers d'utilisateurs satisfaits
                </p>
                <div className="space-y-4 text-left max-w-xs mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center glass-button">
                      <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-base leading-relaxed">Inscription gratuite</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center glass-button">
                      <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-base leading-relaxed">Accès immédiat</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center glass-button">
                      <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-base leading-relaxed">Support 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section droite - Formulaire */}
            <div className="p-8 lg:w-1/2 lg:p-4 lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto">
              {/* En-tête mobile */}
              <div className="text-center mb-8 lg:hidden">
                <div className="mb-0">
                  <img 
                    src={avyentoLogo} 
                    alt="Avyento" 
                    className="mx-auto"
                    style={{ height: '120px' }}
                  />
                </div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">
                  Inscription
                </h1>
                <p className="text-gray-600 text-lg">Créez votre compte client</p>
              </div>

              {/* En-tête desktop */}
              <div className="hidden lg:block text-center mb-2">
                <h2 className="text-lg font-bold mb-0 text-gray-900">
                  Inscription
                </h2>
              </div>

              {/* Formulaire avec vrai style /home */}
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-2">
                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="block text-xs lg:text-xs font-medium text-gray-700">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-xs lg:text-xs font-medium text-gray-700">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs lg:text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Téléphone (optionnel) */}
                <div className="space-y-1 hidden">
                  <label htmlFor="phone" className="block text-xs lg:text-xs font-medium text-gray-700">
                    Téléphone (optionnel)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Votre numéro"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs lg:text-xs font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-14 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmation mot de passe */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-xs lg:text-xs font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-14 py-3 lg:py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Conditions */}
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-3 h-3 lg:w-3 lg:h-3 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    required
                  />
                  <span className="ml-2 text-xs lg:text-xs text-gray-600">
                    J'accepte les{' '}
                    <button
                      type="button"
                      onClick={() => setLocation('/cgu')}
                      className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      CGU Avyento
                    </button>
                  </span>
                </div>

                {/* Bouton d'inscription avec vrai style glass-button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full glass-button text-black font-medium py-3 lg:py-2 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 text-gray-900" />
                      <span className="text-gray-900 font-semibold">Créer mon compte</span>
                    </>
                  )}
                </button>
              </form>

              {/* Lien de connexion */}
              <div className="text-center mt-4 lg:mt-2">
                <p className="text-xs lg:text-xs text-gray-600">
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => setLocation('/client-login')}
                    className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
}