import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, User, Building, Phone, MapPin, ArrowLeft, Check, Star, Crown, Gift } from "lucide-react";
import avyentoProLogo from "@/assets/avyento-logo.png";
import { getGenericGlassButton } from "@/lib/salonColors";

// Types et constantes partagées
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  salonName: string;
  siret: string;
  phone: string;
  address: string;
  city: string;
}

type PromoType = 'percentage' | 'fixed';
interface AppliedPromo {
  code: string;
  discount: number;
  type: PromoType;
}

const AVAILABLE_PROMO_CODES: Record<string, { discount: number; type: PromoType }> = {
  AVYENTO2025: { discount: 20, type: 'percentage' },
  SALON50: { discount: 50, type: 'fixed' },
  PREMIUM15: { discount: 15, type: 'percentage' },
  FIRST100: { discount: 100, type: 'fixed' },
  EMPIRE100: { discount: 100, type: 'fixed' },
  FREE149: { discount: 149, type: 'fixed' },
};

const SUBSCRIPTION_PLANS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 29,
    features: [
      "Gestion des rendez-vous",
      "Base de données clients",
      "Calendrier intégré",
      "Support email",
      "Jusqu'à 200 RDV/mois",
    ],
    icon: User,
    popular: false,
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
      "Jusqu'à 1000 RDV/mois",
    ],
    icon: Star,
    popular: true,
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
      "Support prioritaire 24/7",
    ],
    icon: Crown,
    popular: false,
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegexFR = /^(\+33|0)[1-9](\d{2}){4}$/; // format FR simple
const siretRegex = /^\d{14}$/;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  salonName: "",
  siret: "",
  phone: "",
  address: "",
    city: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("essentiel");
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  // Codes promo disponibles (identiques à ProfessionalPlans)
  const availablePromoCodes = AVAILABLE_PROMO_CODES;

  // Charger le code promo ET le plan sélectionné depuis localStorage au montage du composant
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromoCode');
    if (savedPromo) {
      try {
        const promoData = JSON.parse(savedPromo);
        if (
          promoData &&
          typeof promoData.code === 'string' &&
          typeof promoData.discount === 'number' &&
          (promoData.type === 'percentage' || promoData.type === 'fixed')
        ) {
        setAppliedPromo(promoData);
        setPromoCode(promoData.code);
        }
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

  const validatePromoCode = useCallback(() => {
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
  }, [promoCode, availablePromoCodes, toast]);

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    setPromoCode('');
    localStorage.removeItem('appliedPromoCode');
    toast({
      title: "Code promo retiré",
      description: "Le code promo a été supprimé",
    });
  }, [toast]);

  const subscriptionPlans = SUBSCRIPTION_PLANS;
  const [isYearly, setIsYearly] = useState(false);

  // Prix au format identique à ProfessionalPlans (affichage TTC simple ici)
  const computeDisplayed = useCallback((monthlyPrice: number) => {
    if (isYearly) {
      const yearly = Math.round(monthlyPrice * 12 * 0.8);
      const perMonthEq = Math.round(yearly / 12);
      return { main: yearly, suffix: '/ an TTC', sub: `soit ${perMonthEq}€/mois TTC` };
    }
    return { main: monthlyPrice, suffix: '/ mois TTC', sub: '' };
  }, [isYearly]);

  // Carte plan inspirée de ProfessionalPlans (version mobile compacte)
  const PlanCardRegister = ({ plan }: { plan: typeof SUBSCRIPTION_PLANS[number] }) => {
    const { main, suffix, sub } = computeDisplayed(plan.price);
    const isPopular = !!plan.popular;
    const isVioletCard = plan.id === 'professionnel';
    return (
      <div className="relative">
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-white/90 text-violet-800 px-4 py-1 rounded-full border border-white/30 text-xs font-bold shadow-lg">
              Le plus populaire
            </span>
          </div>
        )}
        <div className={isVioletCard ? 'glass-card-violet shadow-2xl rounded-3xl border-0 overflow-hidden' : 'bg-white shadow-lg rounded-3xl border-0 overflow-hidden'}>
          <div className="p-5 sm:p-6 md:p-7 text-center">
            <div className={isVioletCard ? 'text-white mb-4 pt-2' : 'text-gray-800 mb-4'}>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-2xl sm:text-3xl font-light">€</span>
                <span className={isVioletCard ? 'text-5xl md:text-6xl font-bold text-white' : 'text-5xl md:text-6xl font-bold text-gray-900'}>{main}</span>
                <span className="text-sm sm:text-base font-normal ml-2">{suffix}</span>
              </div>
              {!!sub && (
                <div className={isVioletCard ? 'text-white/90 text-xs' : 'text-gray-600 text-xs'}>{sub}</div>
              )}
            </div>
            <h3 className={isVioletCard ? 'text-2xl md:text-3xl font-bold text-white mb-2' : 'text-xl md:text-2xl font-bold text-gray-800 mb-2'}>{plan.name}</h3>
            <div className={isVioletCard ? 'text-white/90 text-sm mb-4 font-medium' : 'text-gray-500 text-sm mb-4'}>
              {plan.features[0]}
            </div>
            <div className="space-y-2 mb-6">
              {plan.features.slice(0, 4).map((f, idx) => (
                <div key={idx} className={isVioletCard ? 'flex items-center justify-center text-sm text-white font-medium' : 'flex items-center justify-center text-sm text-gray-600'}>
                  <div className={isVioletCard ? 'w-1.5 h-1.5 bg-white rounded-full mr-2' : 'w-1.5 h-1.5 bg-blue-500 rounded-full mr-2'} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setSelectedPlan(plan.id); try { localStorage.setItem('selectedPlan', plan.id); } catch {} }}
              className={isVioletCard
                ? 'w-full py-3 text-base font-medium rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/20'
                : 'w-full glass-button text-black py-3 text-base font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'}
            >
              Choisir ce plan
            </button>
            <div className="mt-3 text-[11px] text-gray-500">
              Prix en euros TTC
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalisation
    const payload: RegisterFormData = {
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      salonName: formData.salonName.trim(),
      siret: formData.siret.replace(/\s/g, ''),
      phone: formData.phone.replace(/\s/g, ''),
      address: formData.address.trim(),
      city: formData.city.trim(),
    };

    // Validations client
    if (!emailRegex.test(payload.email)) {
      toast({ title: 'Email invalide', description: 'Veuillez saisir un email valide', variant: 'destructive' });
      return;
    }
    if (!phoneRegexFR.test(payload.phone)) {
      toast({ title: 'Téléphone invalide', description: 'Format FR attendu (ex: 0612345678 ou +33612345678)', variant: 'destructive' });
      return;
    }
    if (!siretRegex.test(payload.siret)) {
      toast({ title: 'SIRET invalide', description: 'Le SIRET doit contenir 14 chiffres', variant: 'destructive' });
      return;
    }
    if (payload.password.length < 8) {
      toast({ title: 'Mot de passe trop court', description: '8 caractères minimum', variant: 'destructive' });
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
      const response = await apiRequest("POST", "/api/register/professional", {
        firstName: payload.firstName,
        lastName: payload.lastName,
        businessName: payload.salonName,
        email: payload.email,
        password: payload.password,
        siret: payload.siret,
        phone: payload.phone,
        city: payload.city,
        address: payload.address,
        subscriptionPlan: selectedPlan,
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({ title: 'Erreur de création', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, selectedPlan, setLocation, toast]);

  const updateField = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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
      <div className="text-center pt-4 pb-2 sm:pt-6 sm:pb-3">
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
      <div className="flex items-center justify-center px-4 py-4 md:px-6 lg:px-4 lg:py-8 pb-24 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
        >
          {/* Formulaire global */}
          <form id="register-form" onSubmit={handleRegister}>
            {/* Card principale avec orientation paysage sur tablette/desktop */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl md:flex md:min-h-[60vh] lg:min-h-[66vh] overflow-hidden">
              
              {/* Section gauche - Premiers champs du formulaire */}
              <div className="md:w-1/2 md:p-4 lg:p-6 xl:p-8 md:bg-gradient-to-br md:from-violet-50 md:to-purple-50 md:rounded-l-3xl md:flex md:flex-col md:justify-center pt-4 md:pt-0">

                {/* Titre et sous-titre dans la colonne de gauche */}
                <div className="text-center mt-2 mb-6 md:mt-0 md:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
                    Inscription Pro
                  </h1>
                  <p className="text-gray-600 text-base md:text-base lg:text-lg">Créez votre espace pro</p>
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
                        autoComplete="given-name"
                        disabled={isLoading}
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
                        autoComplete="family-name"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Nom de l'entreprise / activité */}
                  <div className="space-y-1">
                    <Label htmlFor="salonName" className="text-xs font-medium text-gray-900 text-left block">Nom de l'entreprise / activité *</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="salonName"
                        placeholder="Nom de l'entreprise / activité (ex: Coaching, Conseil)"
                        value={formData.salonName}
                        onChange={(e) => updateField("salonName", e.target.value)}
                        className="pl-10 glass-input"
                        autoComplete="organization"
                        disabled={isLoading}
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
                        inputMode="numeric"
                        autoComplete="off"
                        disabled={isLoading}
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
                        placeholder="contact@entreprise.fr"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10 glass-input"
                        autoComplete="email"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section droite - Reste du formulaire */}
              <div className="md:w-1/2 md:p-4 lg:p-6 xl:p-8 md:flex md:flex-col md:justify-center pt-2 md:pt-0">
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
                          autoComplete="tel"
                          inputMode="tel"
                          disabled={isLoading}
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
                          autoComplete="address-level2"
                          disabled={isLoading}
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
                          placeholder="123 Avenue de l'Europe"
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="pl-10 glass-input"
                          autoComplete="address-line1"
                          disabled={isLoading}
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
                          autoComplete="new-password"
                          disabled={isLoading}
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
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* À qui s’adresse Avyento ? (section d'aide) */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl mt-6 p-4 md:p-6">
              <div className="text-center md:text-left md:max-w-3xl md:mx-auto">
                <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">À qui s’adresse Avyento ?</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">Avyento accompagne tous les professionnels des services.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-3 text-center">
                    <span className="font-semibold text-gray-900 block">Coaching & Bien-être</span>
                    <span className="text-gray-600">Coach sportif, nutrition, mindset…</span>
                  </div>
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-3 text-center">
                    <span className="font-semibold text-gray-900 block">Santé & Paramédical</span>
                    <span className="text-gray-600">Kiné, ostéo, praticiens…</span>
                  </div>
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-3 text-center">
                    <span className="font-semibold text-gray-900 block">Consulting & Services</span>
                    <span className="text-gray-600">Conseil, freelance, services pros…</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Section Plans d'Abonnement - séparée en dessous */}
            <div className="glass-card rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl mt-6 p-4 md:p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">Choisissez votre plan</h2>
                <p className="text-sm md:text-base text-gray-600">Sélectionnez l'abonnement qui correspond à vos besoins professionnels</p>
              </div>

              {/* Toggle Mensuel / Annuel (-20%) */}
              <div className="flex items-center justify-center mb-5 space-x-2 sm:space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                    !isYearly ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  Mensuel
                </button>
                <button 
                  type="button"
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                    isYearly ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  Annuel (-20%)
                </button>
                        </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {subscriptionPlans.map((plan) => (
                  <motion.div key={plan.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                    <PlanCardRegister plan={plan} />
                  </motion.div>
                ))}
                      </div>

              {/* Bandeau légal tarification */}
              <div className="mt-4">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 text-[11px] text-gray-600 text-center">
                  * Les tarifs affichés sont toutes taxes comprises (TTC), en euros. En formule annuelle, le total indiqué correspond au montant TTC dû pour 12 mois (remise de 20% déjà appliquée). Abonnement à reconduction tacite; vous pouvez résilier à tout moment avant la date de renouvellement depuis votre espace. Voir
                  {' '}<a href="/cgu" className="underline hover:text-violet-600">Conditions Générales</a> et <a href="/confidentialite" className="underline hover:text-violet-600">Politique de confidentialité</a>.
                        </div>
              </div>
            </div>

            {/* CGU, code promo et bouton d'inscription */}
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
                      Conditions d'utilisation
                    </span>
                    {" "}*
                  </label>
                </div>

                {/* Code Promo (compact) */}
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Code promo</h3>
                  </div>
                  {!appliedPromo ? (
                    <div>
                      <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
                        placeholder="CODE PROMO"
                        className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-center text-sm font-medium"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={validatePromoCode}
                        disabled={!promoCode.trim() || isLoading}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Valider
                      </button>
                      </div>
                      <div className="text-[11px] text-gray-500 text-center mt-2">
                        Codes disponibles: AVYENTO2025, SALON50, PREMIUM15, FIRST100, EMPIRE100, FREE149
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-800">Code {appliedPromo.code} appliqué</p>
                        <p className="text-xs text-green-700">
                          {appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : `${appliedPromo.discount}€`} de réduction
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-gray-500 hover:text-gray-700 text-base font-bold"
                        aria-label="Retirer le code promo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Bouton d'inscription avec le même style que la page d'accueil */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full ${getGenericGlassButton(0)} rounded-xl py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Création..." : `Créer mon espace pro ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} (${subscriptionPlans.find(p => p.id === selectedPlan)?.price}€/mois)`}
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

      {/* (Promo code section déplacée au-dessus du bouton) */}

      {/* Sticky mobile CTA bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
                  <button
            form="register-form"
            type="submit"
            disabled={isLoading || !acceptTerms}
            className={`w-full ${getGenericGlassButton(0)} rounded-xl py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Création...' : 'Créer mon espace pro'}
                  </button>
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
                  onClick={() => setLocation('/search-results?q=coaching')}
                >
                  Coaching
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search-results?q=sante')}
                >
                  Santé
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search-results?q=consulting')}
                >
                  Consulting
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search-results?q=services')}
                >
                  Services pros
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