import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Check, Crown, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_dummy");

interface StripePaymentProps {
  registrationId: string;
}

function CheckoutForm({ registration, onSuccess }: { registration: any; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  const processPaymentMutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await apiRequest("POST", "/api/payments/process-subscription", {
        registrationId: registration.id,
        paymentMethodId,
        planType: registration.planType,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Paiement réussi !",
        description: "Votre abonnement a été activé avec succès",
      });
      onSuccess();
    },
    onError: (error) => {
      setPaymentError("Le paiement n'a pas pu être traité. Veuillez réessayer.");
      toast({
        title: "Erreur de paiement",
        description: "Le paiement n'a pas pu être traité",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentError("");

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);

    try {
      // Créer le payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: registration.firstName + " " + registration.lastName,
          email: registration.email,
          phone: registration.phone,
        },
      });

      if (error) {
        setPaymentError(error.message || "Erreur lors du traitement de la carte");
        setIsProcessing(false);
        return;
      }

      // Traiter le paiement via notre API
      processPaymentMutation.mutate(paymentMethod.id);
    } catch (err) {
      setPaymentError("Une erreur inattendue s'est produite");
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte bancaire
        </label>
        <div className="p-3 border rounded bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        {paymentError && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {paymentError}
          </div>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Essai gratuit de 14 jours</span>
        </div>
        <p className="text-sm text-green-700">
          Aucun prélèvement aujourd'hui. Votre carte sera débitée uniquement après la période d'essai si vous continuez.
          Vous pouvez annuler à tout moment.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <CreditCard className="w-4 h-4" />
          <span className="font-medium">Paiement sécurisé</span>
        </div>
        <p className="text-sm text-blue-700">
          Vos informations sont protégées par le chiffrement SSL et traitées de manière sécurisée par Stripe.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || processPaymentMutation.isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
      >
        {isProcessing || processPaymentMutation.isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours...
          </div>
        ) : (
          <>
            Confirmer l'abonnement
            <CreditCard className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        En confirmant, vous acceptez que votre carte soit débitée après la période d'essai de 14 jours
      </p>
    </form>
  );
}

export default function StripePayment({ registrationId }: StripePaymentProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Récupérer les informations d'inscription
  const { data: registration, isLoading, error } = useQuery({
    queryKey: [`/api/business-registration/${registrationId}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/business-registration/${registrationId}`);
      return response.json();
    },
  });

  const handlePaymentSuccess = () => {
    setLocation("/business-success");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Inscription introuvable
            </h2>
            <p className="text-gray-600 mb-4">
              Impossible de récupérer les informations d'inscription.
            </p>
            <Button onClick={() => setLocation("/subscription-plans")}>
              Retourner aux plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plans = {
    basic: {
      name: "Plan Basic",
      price: "49€",
      originalPrice: "59€",
      features: [
        "Gestion des rendez-vous",
        "Base de données clients",
        "Calendrier intégré",
        "Support email",
        "Notifications automatiques",
      ],
      color: "blue",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
    premium: {
      name: "Plan Premium",
      price: "149€",
      originalPrice: "199€",
      features: [
        "Tout du plan Basic",
        "Intelligence Artificielle",
        "Messagerie directe clients",
        "Analytics avancés",
        "Support prioritaire",
        "Fonctionnalités exclusives",
      ],
      color: "violet",
      icon: <Crown className="w-5 h-5 text-white" />,
    },
  };

  const currentPlan = plans[registration.planType as keyof typeof plans];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/subscription-plans")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux plans
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Finaliser votre abonnement
          </h1>
          <p className="text-gray-600 mt-2">
            Dernière étape - Configurez votre méthode de paiement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Récapitulatif de l'inscription */}
          <div className="space-y-6">
            {/* Plan sélectionné */}
            <Card className={`border-${currentPlan.color}-200 bg-gradient-to-r from-${currentPlan.color}-50 to-${currentPlan.color}-100`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${currentPlan.color}-600 rounded-full flex items-center justify-center`}>
                      {currentPlan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {currentPlan.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {currentPlan.price}/mois
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {currentPlan.originalPrice}
                        </span>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          -17%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Informations de facturation */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de facturation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entreprise:</span>
                  <span className="font-medium">{registration.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{registration.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SIRET:</span>
                  <span className="font-medium">{registration.siret}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Adresse:</span>
                  <span className="font-medium">{registration.businessAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Résumé des coûts */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan {currentPlan.name}</span>
                  <span>{currentPlan.price}/mois</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Essai gratuit de 14 jours</span>
                  <span>-{currentPlan.price}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total aujourd'hui</span>
                  <span>0,00€</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Prochaine facturation</span>
                  <span>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de paiement */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Méthode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    registration={registration} 
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}