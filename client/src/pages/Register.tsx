import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, User, Building, Phone, MapPin, ArrowLeft, Check, Star, Crown, Gift } from "lucide-react";
import avyentoProLogo from "@/assets/avyento-logo.png";
import { getGenericGlassButton } from "@/lib/salonColors";

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
  salonName: "",
  siret: "",
  phone: "",
  address: "",
  city: ""
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("essentiel");
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number, type: 'percentage' | 'fixed'} | null>(null);

  // Codes promo disponibles (identiques à ProfessionalPlans)
  const availablePromoCodes = {
    'AVYENTO2025': { discount: 20, type: 'percentage' as const },
    'SALON50': { discount: 50, type: 'fixed' as const },
    'PREMIUM15': { discount: 15, type: 'percentage' as const },
    'FIRST100': { discount: 100, type: 'fixed' as const },
    'EMPIRE100': { discount: 100, type: 'fixed' as const },
    'FREE149': { discount: 149, type: 'fixed' as const },
  };

  // Charger le code promo ET le plan sélectionné depuis localStorage au montage du composant
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromoCode');
    if (savedPromo) {
      try {
        const promoData = JSON.parse(savedPromo);
        setAppliedPromo(promoData);
        setPromoCode(promoData.code);
      } catch (error) {
        console.error('Erreur lors du chargement du code promo:', error);
      }
    }
    
    // Charger le plan sélectionné
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      setSelectedPlan(savedPlan);
    }
  }, []);

  const validatePromoCode = () => {
    if (!promoCode.trim()) return;
    
    const code = promoCode.toUpperCase();
    const validPromo = availablePromoCodes[code as keyof typeof availablePromoCodes];
    
    if (validPromo) {
      setAppliedPromo({
        code,
        discount: validPromo.discount,
        type: validPromo.type
      });
      localStorage.setItem('appliedPromoCode', JSON.stringify({
        code,
        discount: validPromo.discount,
        type: validPromo.type
      }));
      toast({
        title: "Code promo appliqué !",
        description: `${validPromo.type === 'percentage' ? `${validPromo.discount}%` : `${validPromo.discount}€`} de réduction appliquée`,
      });
    } else {
      toast({
        title: "Code promo invalide",
        description: "Ce code promo n'existe pas ou a expiré",
        variant: "destructive",
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    localStorage.removeItem('appliedPromoCode');
    toast({
      title: "Code promo retiré",
      description: "Le code promo a été supprimé",
    });
  };

  const subscriptionPlans = [
    {
      id: "essentiel",
      name: "Essentiel",
      price: 29,
      features: [
        "Gestion des rendez-vous",
        "Base de données clients", 
        "Calendrier intégré",
        "Support email",
        "Jusqu'à 200 RDV/mois"
      ],
      icon: User,
      popular: false
    },
    {
      id: "professionnel",
      name: "Professionnel",
      price: 79,
      features: [
        "Tout de l'Essentiel",
        "Analytics avancés",
        "Gestion des stocks",
        "Notifications SMS",
        "Jusqu'à 1000 RDV/mois"
      ],
      icon: Star,
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: 149,
      features: [
        "Tout du Professionnel",
        "Assistant IA intégré",
        "RDV illimités",
        "Analytics avancés avec IA",
        "Support prioritaire 24/7"
      ],
      icon: Crown,
      popular: false
    }
  ];

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

    if (!acceptTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les CGU pour continuer",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // Inscription avec plan d'abonnement sélectionné
  const response = await apiRequest("POST", "/api/register", {
        ...registerData,
        subscriptionPlan: selectedPlan
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Salon créé avec succès !",
          description: `Abonnement ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} activé`
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
      {/* Bouton retour en haut à gauche */}
      <button
        onClick={() => setLocation('/')}
        className="absolute left-6 top-6 z-10 glass-button p-3 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Logo Avyento centré au-dessus du conteneur */}
      <div className="text-center pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={avyentoProLogo} 
            alt="Avyento Pro" 
            className="mx-auto"
            style={{ height: '130px' }}
          />
        </motion.div>
      </div>

      {/* Contenu principal optimisé tablette/desktop */}
      <div className="flex items-center justify-center px-2 py-4 md:px-6 lg:px-4 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
        >
          {/* Formulaire global */}
          <form onSubmit={handleRegister}>
            {/* Card principale avec orientation paysage sur tablette/desktop */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl md:flex md:min-h-[65vh] lg:min-h-[70vh] overflow-hidden">
              
              {/* Section gauche - Premiers champs du formulaire */}
              <div className="md:w-1/2 md:p-4 lg:p-6 xl:p-8 md:bg-gradient-to-br md:from-violet-50 md:to-purple-50 md:rounded-l-3xl md:flex md:flex-col md:justify-center">

                {/* Titre et sous-titre dans la colonne de gauche */}
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
                    Inscription Salon
                  </h1>
                  <p className="text-gray-600 text-base md:text-base lg:text-lg">Créez votre salon professionnel</p>
                </div>

                {/* Partie gauche du formulaire */}
                <div className="space-y-3 p-4 sm:p-6 md:p-0">
                  {/* Prénom */}
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs font-medium text-gray-900 text-left block">Prénom *</Label>
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
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs font-medium text-gray-900 text-left block">Nom *</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Martin"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="pl-10 glass-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Nom du salon */}
                  <div className="space-y-1">
                    <Label htmlFor="salonName" className="text-xs font-medium text-gray-900 text-left block">Nom du salon *</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="salonName"
                        placeholder="Salon Beautiful"
                        value={formData.salonName}
                        onChange={(e) => updateField("salonName", e.target.value)}
                        className="pl-10 glass-input"
                        required
                      />
                    </div>
                  </div>

                  {/* SIRET */}
                  <div className="space-y-1">
                    <Label htmlFor="siret" className="text-xs font-medium text-gray-900 text-left block">Numéro SIRET *</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="siret"
                        placeholder="12345678901234"
                        value={formData.siret}
                        onChange={(e) => updateField("siret", e.target.value)}
                        className="pl-10 glass-input"
                        required
                        maxLength={14}
                      />
                    </div>
                  </div>

                  {/* Email professionnel */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-900 text-left block">Email professionnel *</Label>
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
              <div className="md:w-1/2 md:p-4 lg:p-6 xl:p-8 md:flex md:flex-col md:justify-center">
                <div className="space-y-3 p-4 sm:p-6 md:p-0">
                    {/* Téléphone */}
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-medium text-gray-900 text-left block">Téléphone professionnel *</Label>
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
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-xs font-medium text-gray-900 text-left block">Ville *</Label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="city"
                          placeholder="Paris"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="pl-10 glass-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Adresse complète */}
                    <div className="space-y-1">
                      <Label htmlFor="address" className="text-xs font-medium text-gray-900 text-left block">Adresse complète *</Label>
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
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs font-medium text-gray-900 text-left block">Mot de passe *</Label>
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
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-900 text-left block">Confirmer le mot de passe *</Label>
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
                </div>
              </div>
            </div>

            {/* Section Plans d'Abonnement - séparée en dessous */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl mt-6 p-4 md:p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Choisissez votre plan</h2>
                <p className="text-sm md:text-base text-gray-600">Sélectionnez l'abonnement qui correspond à vos besoins</p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => {
                  const IconComponent = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer rounded-2xl border-2 p-4 md:p-6 transition-all duration-300 ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-50 shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-md'
                      } ${plan.popular ? 'ring-2 ring-violet-200' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Populaire
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <div className={`inline-flex p-3 rounded-2xl mb-3 ${
                          isSelected ? 'bg-violet-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            isSelected ? 'text-violet-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-2xl md:text-3xl font-bold text-gray-900">{plan.price}€</span>
                          <span className="text-sm md:text-base text-gray-600">/mois</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-xs md:text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-violet-500 bg-violet-500/5 pointer-events-none">
                          <div className="absolute top-3 right-3">
                            <div className="bg-violet-500 rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CGU et bouton d'inscription */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl mt-6 p-4 md:p-6">
              <div className="max-w-sm md:max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-transparent border-2 border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="acceptTerms" className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    J'accepte les{" "}
                    <span 
                      className="text-violet-600 hover:text-violet-700 underline cursor-pointer"
                      onClick={() => setLocation('/cgu')}
                    >
                      CGU Avyento
                    </span>
                    {" "}*
                  </label>
                </div>

                {/* Bouton d'inscription avec le même style que la page d'accueil */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full ${getGenericGlassButton(0)} rounded-xl py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Création..." : `Créer mon salon ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} (${subscriptionPlans.find(p => p.id === selectedPlan)?.price}€/mois)`}
                </motion.button>

                {/* Lien connexion */}
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setLocation("/pro-login")}
                    className="text-xs md:text-sm text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    Déjà un compte ? Se connecter
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Section Code Promo en bas de page */}
      <div className="w-full bg-gradient-to-br from-violet-50 to-purple-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-3">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Code Promo</h3>
              <p className="text-sm text-gray-600">
                Avez-vous un code promo ? Saisissez-le pour bénéficier d'une réduction sur votre abonnement.
              </p>
            </div>

            {!appliedPromo ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
                    placeholder="CODE PROMO"
                    className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-center font-medium"
                  />
                  <button
                    type="button"
                    onClick={validatePromoCode}
                    disabled={!promoCode.trim()}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Valider
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Codes disponibles: AVYENTO2025, SALON50, PREMIUM15, FIRST100, EMPIRE100, FREE149
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Code {appliedPromo.code} appliqué!</p>
                      <p className="text-sm text-green-600">
                        {appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : `${appliedPromo.discount}€`} de réduction
                        {appliedPromo.code === 'FREE149' && ' - Abonnement GRATUIT!'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer identique à la page d'accueil */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La solution intelligente qui anticipe, planifie et maximise vos résultats.
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