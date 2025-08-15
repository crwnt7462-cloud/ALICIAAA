import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, CreditCard, ArrowLeft, Building, CheckCircle2, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/3_1753714421825.png";

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

// Composant de paiement Stripe pour business
function BusinessStripePaymentForm({ onSuccess, clientSecret, planName, planPrice }: { 
  onSuccess: () => void, 
  clientSecret: string,
  planName: string,
  planPrice: number
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;
    
    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Professionnel Business",
            email: "business@example.com",
          },
        },
      });

      if (error) {
        setError(error.message || "Erreur lors du paiement");
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Finaliser votre abonnement</h3>
        <p className="text-sm text-gray-600 mt-1">Plan {planName} - {planPrice}€/mois</p>
      </div>

      <div className="p-4 glass-card rounded-xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <Button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full glass-button hover:glass-effect text-black py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          `Confirmer & Payer ${planPrice}€`
        )}
      </Button>

      <div className="text-center text-xs text-gray-500">
        <p>🔒 Paiement sécurisé par Stripe</p>
        <p>Votre abonnement sera actif immédiatement</p>
      </div>
    </form>
  );
}

// Schéma de validation
const formSchema = z.object({
  businessName: z.string().min(2, "Le nom de l'entreprise est requis"),
  businessType: z.string().min(1, "Le type d'établissement est requis"),
  siret: z.string().min(14, "Le numéro SIRET est requis"),
  legalForm: z.string().min(1, "La forme juridique est requise"),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Le code postal est requis"),
  phone: z.string().min(10, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  ownerFirstName: z.string().min(2, "Le prénom est requis"),
  ownerLastName: z.string().min(2, "Le nom est requis"),
  vatNumber: z.string().optional(),
  description: z.string().optional(),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

const businessTypes = [
  { value: "salon_coiffure", label: "Salon de coiffure" },
  { value: "institut_beaute", label: "Institut de beauté" },
  { value: "barbier", label: "Barbier" },
  { value: "spa", label: "Spa" },
  { value: "onglerie", label: "Onglerie" },
  { value: "centre_esthetique", label: "Centre esthétique" },
];

const legalForms = [
  { value: "auto_entrepreneur", label: "Auto-entrepreneur" },
  { value: "sarl", label: "SARL" },
  { value: "sas", label: "SAS" },
  { value: "eirl", label: "EIRL" },
  { value: "autre", label: "Autre" },
];

const plans = [
  { 
    id: 'essentiel', 
    name: 'ESSENTIEL', 
    price: 29, 
    color: 'from-green-500 to-emerald-600',
    description: 'Pour débuter votre transformation digitale',
    features: [
      'Réservation en ligne 24h/24',
      'Gestion des clients et RDV',
      'Notifications automatiques',
      'Support par email'
    ],
    popular: false
  },
  { 
    id: 'professionnel', 
    name: 'PROFESSIONNEL', 
    price: 79, 
    color: 'from-blue-500 to-purple-600',
    description: 'La solution complète pour pros ambitieux',
    features: [
      'Tout ESSENTIEL +',
      'IA prédictive avancée',
      'Gestion multi-employés',
      'Analytics et reporting',
      'Chat en temps réel',
      'Support prioritaire'
    ],
    popular: true
  },
  { 
    id: 'premium', 
    name: 'PREMIUM', 
    price: 149, 
    color: 'from-purple-500 to-pink-600',
    description: 'Excellence maximale avec IA révolutionnaire',
    features: [
      'Tout PROFESSIONNEL +',
      'IA GPT-4 personnalisée',
      'Marketing automation',
      'API personnalisées',
      'Formation dédiée 1-to-1',
      'Manager success dédié'
    ],
    popular: false
  }
];

export default function BusinessRegistration() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer le plan sélectionné
  const searchParams = new URLSearchParams(window.location.search);
  const planId = searchParams.get('plan') || 'professionnel';
  const currentPlan = plans.find(p => p.id === planId) || plans[1];
  
  console.log(`🎯 Plan sélectionné dans BusinessRegistration:`, { planId, currentPlan: currentPlan.name, price: currentPlan.price });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      siret: "",
      legalForm: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      ownerFirstName: "",
      ownerLastName: "",
      vatNumber: "",
      description: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      console.log("📝 Données envoyées pour inscription pro:", { ...values, planType: planId });
      
      const response = await fetch("/api/professional/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, planType: planId }),
      });

      const data = await response.json();
      console.log("📋 Réponse inscription pro:", data);

      if (response.ok && data.success) {
        toast({
          title: "Inscription réussie",
          description: "Ouverture du paiement..."
        });
        
        // Créer le Payment Intent et ouvrir le shell
        setTimeout(() => {
          createBusinessPaymentIntent(data.salon?.id || data.business?.salonId || 'demo-business');
        }, 800);
      } else {
        throw new Error(data.error || data.message || "Erreur lors de l'inscription");
      }
    } catch (error: any) {
      console.error("❌ Erreur inscription BusinessRegistration:", error);
      const errorMessage = error.message || "Une erreur s'est produite lors de l'inscription";
      
      // Message spécifique pour email déjà utilisé
      if (errorMessage.includes("email existe déjà")) {
        toast({
          title: "Email déjà utilisé", 
          description: "Cet email est déjà associé à un compte professionnel. Utilisez un autre email ou connectez-vous.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur d'inscription", 
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer le Payment Intent business
  const createBusinessPaymentIntent = async (businessId: string) => {
    try {
      const response = await fetch('/api/create-professional-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: businessId,
          plan: planId,
          amount: currentPlan.price
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentSheet(true);
      }
    } catch (error) {
      console.error('Erreur Payment Intent:', error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de préparer le paiement",
        variant: "destructive"
      });
    }
  };

  // Fonction appelée après paiement réussi
  const handlePaymentSuccess = () => {
    setShowPaymentSheet(false);
    toast({
      title: "Paiement confirmé !",
      description: "Votre abonnement est maintenant actif"
    });
    
    // Rediriger vers la page de succès
    setTimeout(() => {
      setLocation("/business-success");
    }, 1500);
  };

  // Rendu du Bottom Sheet de paiement business
  const renderBusinessPaymentSheet = () => (
    showPaymentSheet && clientSecret && (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white/95 backdrop-blur-md w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto border border-white/30">
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-white/30 p-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-violet-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paiement Business</h2>
                  <p className="text-sm text-gray-600">Abonnement {currentPlan.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPaymentSheet(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <BusinessStripePaymentForm
                onSuccess={handlePaymentSuccess}
                clientSecret={clientSecret}
                planName={currentPlan.name}
                planPrice={currentPlan.price}
              />
            </Elements>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(1600px 800px at 18% -10%, #F3EFFF 0%, #FFFFFF 58%)' }}>
      {/* Header - même style que page d'accueil */}
      <header className="relative bg-white/30 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Avyento" className="h-8 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Avyento</h1>
                <p className="text-xs text-gray-600">Inscription Professionnelle</p>
              </div>
            </div>

            {/* Bouton retour */}
            <motion.button
              onClick={() => setLocation('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 glass-button text-black px-6 py-2 rounded-2xl text-sm font-semibold shadow-xl hover:shadow-2xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section avec animation */}
      <div className="relative pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  Rejoignez 2500+ salons partenaires
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Créez votre
                <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  espace professionnel
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Démarrez votre transformation digitale en moins de 5 minutes. 
                Gestion complète, réservations automatisées, paiements sécurisés.
              </p>
            </motion.div>

            {/* Stats rapides */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center gap-8 mb-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">+35%</div>
                <div className="text-sm text-gray-600">CA moyen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24h/24</div>
                <div className="text-sm text-gray-600">Réservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4,9/5</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section Aperçu des Offres */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre offre
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des solutions adaptées à chaque étape de votre développement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className={`relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                plan.popular 
                  ? 'border-violet-300 shadow-2xl ring-2 ring-violet-200' 
                  : 'border-white/30 shadow-xl hover:border-violet-200'
              }`}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('plan', plan.id);
                window.history.replaceState({}, '', url.toString());
                setLocation(`/business-registration?plan=${plan.id}`);
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    PLUS POPULAIRE
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-sm text-gray-600">/mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-full py-3 px-4 rounded-xl text-center font-semibold transition-all ${
                currentPlan?.id === plan.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {currentPlan?.id === plan.id ? 'SÉLECTIONNÉ' : 'SÉLECTIONNER'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formulaire principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-left">
                Informations de votre salon
              </h2>
              <p className="text-gray-600 text-left">
                Quelques détails pour personnaliser votre espace professionnel
              </p>
              <div className="mt-4 p-4 bg-violet-50 rounded-2xl border border-violet-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${currentPlan?.color} flex items-center justify-center`}>
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-violet-700 font-medium">
                      Plan sélectionné : {currentPlan?.name}
                    </p>
                    <p className="text-xs text-violet-600">
                      {currentPlan?.price}€/mois • {currentPlan?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {/* Section Établissement */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Votre établissement</h3>
                      <p className="text-sm text-gray-600">Informations principales de votre salon</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Nom de votre salon *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Ex: Salon Excellence Paris" 
                              className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500 text-left" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Type d'établissement *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-left">
                                <SelectValue placeholder="Choisissez votre spécialité..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30 rounded-xl">
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="focus:bg-violet-50">
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="siret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">SIRET (optionnel)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="123 456 789 01234" 
                              className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500 text-left" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="legalForm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Statut juridique *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-left">
                                <SelectValue placeholder="Votre statut..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30 rounded-xl">
                              {legalForms.map((form) => (
                                <SelectItem key={form.value} value={form.value} className="focus:bg-violet-50">
                                  {form.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section Adresse */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Localisation</h3>
                      <p className="text-sm text-gray-600">Adresse de votre salon</p>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Adresse complète *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="15 rue de la Paix" 
                            className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500 text-left" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Ville *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Paris" 
                              className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500 text-left" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">Code postal *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="75001" 
                              className="h-14 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500 text-left" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section Contact */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Contact & Connexion</h3>
                      <p className="text-sm text-gray-600">Vos coordonnées et accès</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">Téléphone *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="01 23 45 67 89" 
                              className="h-12 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">Email professionnel *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="contact@monsalon.fr" 
                              className="h-12 bg-white/80 border-white/30 rounded-xl backdrop-blur-sm focus:bg-white/90 focus:border-violet-300 transition-all text-gray-900 placeholder-gray-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-5 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Building className="h-6 w-6" />
                    {isLoading ? "Création en cours..." : `Créer mon salon • ${currentPlan?.price}€/mois`}
                  </motion.button>

                  {/* Informations légales */}
                  <div className="text-center space-y-3 pt-6 border-t border-white/20 mt-8">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Inscription gratuite • Aucun engagement</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                      Support premium 7j/7 inclus.
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>

      {/* Section avantages supplémentaires */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration rapide</h3>
            <p className="text-sm text-gray-600">Votre salon opérationnel en moins de 5 minutes</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Support premium</h3>
            <p className="text-sm text-gray-600">Accompagnement personnalisé 7j/7</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">IA intégrée</h3>
            <p className="text-sm text-gray-600">Optimisation automatique de votre planning</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Sheet de paiement business */}
      {renderBusinessPaymentSheet()}
    </div>
  );
}