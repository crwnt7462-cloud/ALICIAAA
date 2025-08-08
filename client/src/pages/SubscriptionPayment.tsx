import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  Building, 
  CheckCircle, 
  Crown, 
  Lock,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getGenericGlassButton } from "@/lib/salonColors";

interface SubscriptionPaymentProps {
  subscriptionId: string;
}

export default function SubscriptionPayment({ subscriptionId }: SubscriptionPaymentProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: [`/api/subscriptions/${subscriptionId}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/subscriptions/${subscriptionId}`);
      return response.json();
    },
  });

  const paymentMethods = [
    {
      id: "card",
      name: "Carte bancaire",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, American Express",
      popular: true,
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Paiement rapide et sécurisé",
      popular: false,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>,
      description: "Compte PayPal ou carte via PayPal",
      popular: false,
    },
    {
      id: "bank_transfer",
      name: "Virement bancaire",
      icon: <Building className="w-5 h-5" />,
      description: "Paiement par virement SEPA",
      popular: false,
    },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Méthode de paiement requise",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulation du processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Activer la souscription après le paiement
      await apiRequest("POST", `/api/subscriptions/${subscriptionId}/activate`);
      
      toast({
        title: "Paiement réussi !",
        description: "Votre souscription a été activée avec succès",
      });
      
      setLocation("/pro-tools");
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Le paiement n'a pas pu être traité",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Souscription non trouvée</p>
          <Button onClick={() => setLocation("/pro-tools")} className="mt-4">
            Retour aux outils pro
          </Button>
        </div>
      </div>
    );
  }

  const planInfo = {
    basic: {
      name: "Basic Pro",
      features: ["Gestion rendez-vous", "Base clients", "Calendrier", "Support email"],
      color: "blue",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    premium: {
      name: "Premium Pro",
      features: ["Tout du Basic", "IA avancée", "Messagerie directe", "Analytics", "Support prioritaire"],
      color: "violet",
      icon: <Crown className="w-5 h-5" />,
    },
  };

  const currentPlan = planInfo[subscription.planType as keyof typeof planInfo];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pro-tools")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Finaliser votre souscription
          </h1>
          <p className="text-gray-600 mt-2">
            Choisissez votre méthode de paiement pour activer votre abonnement
          </p>
        </div>

        {/* Récapitulatif commande */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Récapitulatif de la commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${currentPlan.color}-600 rounded-full flex items-center justify-center`}>
                    {currentPlan.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentPlan.name}</h3>
                    <p className="text-sm text-gray-600">{subscription.companyName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{subscription.priceMonthly}€</p>
                  <p className="text-sm text-gray-500">par mois</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Entreprise</p>
                    <p className="text-gray-600">{subscription.companyName}</p>
                  </div>
                  <div>
                    <p className="font-medium">SIRET</p>
                    <p className="text-gray-600">{subscription.siret}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">{subscription.businessAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium">Forme juridique</p>
                    <p className="text-gray-600">{subscription.legalForm}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total mensuel</span>
                  <span className="text-2xl font-bold">{subscription.priceMonthly}€</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Facturé mensuellement • Annulation possible à tout moment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Méthodes de paiement */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Méthode de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Populaire
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? "border-pink-500 bg-pink-500"
                        : "border-gray-300"
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="w-4 h-4 text-white ml-0.5 mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Paiement sécurisé SSL • Vos données sont protégées</span>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de paiement */}
        <Button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing}
          className={`w-full ${getGenericGlassButton(0)} py-3 text-lg font-semibold`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Finaliser le paiement • {subscription.priceMonthly}€/mois
            </>
          )}
        </Button>

        {/* Note légale */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            En finalisant votre paiement, vous acceptez nos conditions générales de vente.
            Votre abonnement sera automatiquement renouvelé chaque mois.
          </p>
        </div>
      </div>
    </div>
  );
}