import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, User, Building, Phone, MapPin, ArrowLeft } from "lucide-react";
import avyentoProLogo from "@assets/Logo avyento pro._1755359490006.png";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    businessName: "",
    phone: "",
    address: "",
    city: ""
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // Inscription directe sans vérification par code
      const response = await apiRequest("POST", "/api/register/professional", registerData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Salon créé avec succès !",
          description: "Vous pouvez maintenant vous connecter et gérer votre salon"
        });
        setLocation("/pro-login");
      } else {
        throw new Error(data.error || "Erreur lors de la création du salon");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de création",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Emoji flottant discret */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-1/3 text-6xl opacity-8 animate-bounce-slow">💖</div>
      </div>

      {/* Bouton retour en haut à gauche */}
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
          className="w-full max-w-md lg:max-w-6xl"
        >
          {/* Formulaire global */}
          <form onSubmit={handleRegister}>
            {/* Card principale avec orientation paysage sur desktop */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl lg:flex lg:h-[85vh] overflow-hidden">
              
              {/* Section gauche - Premiers champs du formulaire */}
              <div className="lg:w-1/2 lg:p-10 lg:bg-gradient-to-br lg:from-violet-50 lg:to-purple-50 lg:rounded-l-3xl lg:flex lg:flex-col lg:justify-center">
                {/* Logo en haut sur mobile */}
                <div className="text-center mb-8 lg:hidden">
                  <div className="mb-0">
                    <img 
                      src={avyentoProLogo} 
                      alt="Avyento Pro" 
                      className="mx-auto"
                      style={{ height: '120px' }}
                    />
                  </div>
                  <h1 className="text-3xl font-bold mb-3 text-gray-900">
                    Inscription Pro
                  </h1>
                  <p className="text-gray-600 text-lg">Créez votre salon professionnel</p>
                </div>
                
                {/* En-tête desktop avec logo plus petit */}
                <div className="hidden lg:block lg:text-center lg:mb-8">
                  <img 
                    src={avyentoProLogo} 
                    alt="Avyento Pro" 
                    className="mx-auto mb-4"
                    style={{ height: '100px' }}
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer votre salon</h2>
                  <p className="text-gray-600 text-sm">Rejoignez la plateforme professionnelle</p>
                </div>

                {/* Partie gauche du formulaire */}
                <div className="space-y-4 p-8 lg:p-0">
                  {/* Prénom */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">Prénom</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="Sarah"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="pl-10 glass-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Martin"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>

                  {/* Nom du salon */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-900">Nom du salon</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="businessName"
                        placeholder="Salon Beautiful"
                        value={formData.businessName}
                        onChange={(e) => updateField("businessName", e.target.value)}
                        className="pl-10 glass-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Email professionnel */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email professionnel</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@salonbeautiful.fr"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10 glass-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section droite - Reste du formulaire */}
              <div className="lg:w-1/2 lg:p-10 lg:flex lg:flex-col lg:justify-center">
                <div className="space-y-4 p-8 lg:p-0">
                    {/* Téléphone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Téléphone</Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="01 23 45 67 89"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="pl-10 glass-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Ville */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-900">Ville</Label>
                      <Input
                        id="city"
                        placeholder="Paris"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>

                    {/* Adresse complète */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-900">Adresse complète</Label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="address"
                          placeholder="123 Rue de la Beauté"
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="pl-10 glass-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-900">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          className="pl-10 glass-input"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    {/* Confirmer mot de passe */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          className="pl-10 glass-input"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                {/* Bouton d'inscription avec vrai style glass-button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full glass-button text-black px-6 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? "Création..." : "Créer mon salon"}
                </button>
              </form>

              {/* Lien connexion */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setLocation("/pro-login")}
                  className="text-xs text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer identique à la page d'accueil */}
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