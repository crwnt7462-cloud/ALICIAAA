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
          <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl lg:flex lg:min-h-[75vh] lg:max-h-[85vh] overflow-hidden">
            
            {/* Section gauche - Branding (desktop uniquement) */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-center lg:p-10 lg:bg-gradient-to-br lg:from-violet-50 lg:to-purple-50 lg:rounded-l-3xl">
              <div className="text-center w-full max-w-sm px-4">
                <div className="mb-0">
                  <img 
                    src={avyentoLogo} 
                    alt="Avyento" 
                    className="mx-auto"
                    style={{ height: '145px' }}
                  />
                </div>
                <p className="text-gray-600 text-base mb-10 leading-relaxed px-2">
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
            <div className="p-8 lg:w-1/2 lg:p-6 lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto">
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
              <div className="hidden lg:block text-center mb-4">
                <h2 className="text-xl font-bold mb-1 text-gray-900">
                  Inscription
                </h2>
                <p className="text-gray-600 text-xs">Créez votre compte client</p>
              </div>

              {/* Formulaire avec vrai style /home */}
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-3">
                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
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
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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
                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    J'accepte les{' '}
                    <button
                      type="button"
                      onClick={() => setLocation('/cgu')}
                      className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      conditions d'utilisation
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
              <div className="text-center mt-8 lg:mt-4">
                <p className="text-sm text-gray-600">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La plateforme IA qui révolutionne la beauté et optimise vos revenus.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Coiffure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Esthétique
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Manucure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Massage
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partenaires</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/devenir-partenaire')}
                >
                  Devenir partenaire
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/tarifs-pros')}
                >
                  Tarifs professionnels
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/formation')}
                >
                  Formation & Support
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/success-stories')}
                >
                  Témoignages
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/centre-aide')}
                >
                  Centre d'aide
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/contact')}
                >
                  Contact
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/cgu')}
                >
                  CGU
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/confidentialite')}
                >
                  Confidentialité
                </div>
              </div>
            </div>

          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Avyento. Tous droits réservés.
            </p>
            <div className="flex gap-3 mt-4 md:mt-0">
              <a href="https://twitter.com/avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.818.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.369-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://tiktok.com/@avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.197 10.157v4.841c0 2.13-1.72 3.85-3.85 3.85s-3.85-1.72-3.85-3.85 1.72-3.85 3.85-3.85c.212 0 .424.017.63.052v2.08c-.2-.035-.408-.052-.63-.052-1.02 0-1.85.83-1.85 1.85s.83 1.85 1.85 1.85 1.85-.83 1.85-1.85V2h2v2.9c0 1.61 1.31 2.92 2.92 2.92V9.9c-1.61 0-2.92-1.31-2.92-2.92v-.74zm4.18-3.22c-.78-.78-1.26-1.85-1.26-3.04V2h1.89c.13 1.19.61 2.26 1.39 3.04.78.78 1.85 1.26 3.04 1.26v1.89c-1.19-.13-2.26-.61-3.04-1.39z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}