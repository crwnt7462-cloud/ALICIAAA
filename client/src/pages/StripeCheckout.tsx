import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface CheckoutFormProps {
  plan: string;
  amount: number;
  email: string;
}

function CheckoutForm({ plan, amount, email }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment=success`,
        },
      });

      if (error) {
        console.error('❌ Erreur paiement Stripe:', error);
        toast({
          title: "Erreur de paiement",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const planNames: { [key: string]: string } = {
    'basic-pro': 'Basic Pro',
    'advanced-pro': 'Advanced Pro', 
    'premium-pro': 'Premium Pro'
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-600" />
            Finaliser votre abonnement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-violet-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{planNames[plan] || plan}</span>
              <span className="text-xl font-bold text-violet-600">{amount}€/mois</span>
            </div>
            <p className="text-sm text-gray-600">Compte: {email}</p>
          </div>

          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Paiement 100% sécurisé</span>
            </div>
            <div className="mt-2 text-xs text-green-600">
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                3D Secure activé
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                Cryptage SSL 256-bit
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700" 
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement en cours...
                </div>
              ) : (
                `Payer ${amount}€/mois`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StripeCheckout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Récupérer les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan') || 'basic-pro';
    const amountParam = parseFloat(urlParams.get('amount') || '29');
    const emailParam = urlParams.get('email') || '';

    setPlan(planParam);
    setAmount(amountParam);
    setEmail(emailParam);

    // Créer l'intention de paiement
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-subscription-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: planParam,
            amount: amountParam,
            email: emailParam
          }),
        });

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.error || 'Erreur création checkout');
        }
      } catch (error) {
        console.error('❌ Erreur création checkout:', error);
        setLocation('/dashboard');
      }
    };

    createPaymentIntent();
  }, [setLocation]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Paiement sécurisé
          </h1>
          <p className="text-gray-600 mt-2">
            Finalisez votre abonnement professionnel
          </p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm plan={plan} amount={amount} email={email} />
        </Elements>
      </div>
    </div>
  );
}