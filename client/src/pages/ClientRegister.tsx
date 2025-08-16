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
                <div className="flex items-center mb-3">
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

      {/* Footer identique à la page d'accueil */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                Avyento
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                La plateforme IA qui révolutionne la beauté et optimise vos revenus professionnels.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setLocation('/search')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Coiffure
                </button>
                <button
                  onClick={() => setLocation('/search')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Esthétique
                </button>
                <button
                  onClick={() => setLocation('/search')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Manucure
                </button>
                <button
                  onClick={() => setLocation('/search')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Massage
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Partenaires</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setLocation('/devenir-partenaire')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Devenir partenaire
                </button>
                <button
                  onClick={() => setLocation('/tarifs-pros')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Tarifs professionnels
                </button>
                <button
                  onClick={() => setLocation('/formation')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Formation & Support
                </button>
                <button
                  onClick={() => setLocation('/success-stories')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Témoignages
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setLocation('/centre-aide')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Centre d'aide
                </button>
                <button
                  onClick={() => setLocation('/contact')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </button>
                <button
                  onClick={() => setLocation('/cgu')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  CGU
                </button>
                <button
                  onClick={() => setLocation('/confidentialite')}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Confidentialité
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Avyento. Tous droits réservés.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/avyento" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass-button text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass-button text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 4.267c.77 0 1.398.628 1.398 1.398s-.628 1.398-1.398 1.398-1.398-.628-1.398-1.398.628-1.398 1.398-1.398zm7.718 0c4.209 0 7.718 3.509 7.718 7.718s-3.509 7.718-7.718 7.718-7.718-3.509-7.718-7.718 3.509-7.718 7.718-7.718zm0 2.325c-2.977 0-5.393 2.416-5.393 5.393s2.416 5.393 5.393 5.393 5.393-2.416 5.393-5.393-2.416-5.393-5.393-5.393z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@avyento" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass-button text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}