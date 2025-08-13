import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  { id: 'essentiel', name: 'ESSENTIEL', price: 29, color: 'from-green-500 to-emerald-600' },
  { id: 'professionnel', name: 'PROFESSIONNEL', price: 79, color: 'from-blue-500 to-purple-600' },
  { id: 'premium', name: 'PREMIUM', price: 149, color: 'from-purple-500 to-pink-600' }
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/30">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Avyento</h1>
              <p className="text-xs text-gray-600">Inscription</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/professional-plans")}
              className="text-black glass-button hover:glass-effect transition-all duration-300"
            >
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Formulaire */}
          <div className="glass-card rounded-lg shadow-sm">
            <div className="p-4 border-b border-white/30">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Informations entreprise
              </h2>
              <p className="text-sm text-gray-700">
                Complétez votre inscription
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
                {/* Établissement */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Établissement</h3>
                  
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Nom de l'entreprise *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Salon Excellence" className="h-10" />
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
                        <FormLabel className="text-sm font-medium text-gray-700">Type d'établissement *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Numéro SIRET *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12345678901234" className="h-10" />
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
                        <FormLabel className="text-sm font-medium text-gray-700">Forme juridique *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {legalForms.map((form) => (
                              <SelectItem key={form.value} value={form.value}>
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

                {/* Adresse */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Adresse</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Adresse *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="15 rue de la Paix" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Ville *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Paris" className="h-10" />
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
                          <FormLabel className="text-sm font-medium text-gray-700">CP *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="75001" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Contact</h3>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Téléphone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="01 23 45 67 89" className="h-10" />
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
                        <FormLabel className="text-sm font-medium text-gray-700">Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contact@salon.fr" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Responsable */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Responsable</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="ownerFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Prénom *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Marie" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nom *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Dubois" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">TVA (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="FR12345678901" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Description (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Décrivez votre salon..."
                            className="min-h-[80px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Sécurité</h3>
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Mot de passe *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder="Minimum 6 caractères"
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bouton soumission */}
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 glass-button hover:glass-effect text-black font-medium transition-all duration-300"
                  >
                    {isLoading ? "Traitement..." : "Finaliser l'inscription"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Plan sélectionné */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-900 mb-3">Plan sélectionné</h3>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${currentPlan.color} text-white text-center`}>
              <div className="font-semibold">{currentPlan.name}</div>
              <div className="text-2xl font-bold">{currentPlan.price}€</div>
              <div className="text-sm opacity-90">par mois</div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/professional-plans")}
                className="w-full glass-button hover:glass-effect text-black transition-all duration-300"
              >
                Changer de plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet de paiement business */}
      {renderBusinessPaymentSheet()}
    </div>
  );
}