import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Stripe public key (à remplacer par votre vraie clé)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  bookingId: string;
}

function CheckoutForm({ clientSecret, bookingId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success?booking_id=${bookingId}`,
      },
    });

    if (error) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      // Le paiement est confirmé, redirection automatique
      toast({
        title: "Paiement réussi",
        description: "Votre réservation est confirmée",
      });
      setLocation(`/booking-success?booking_id=${bookingId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informations de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
      >
        {isProcessing ? "Traitement en cours..." : "Confirmer le paiement"}
      </Button>
    </form>
  );
}

export default function StripeCheckout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('client_secret');
    const id = urlParams.get('booking_id');
    
    if (secret && id) {
      setClientSecret(secret);
      setBookingId(id);
    } else {
      // Rediriger si pas de paramètres
      setLocation('/');
    }
  }, [setLocation]);

  if (!clientSecret || !bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#8B5CF6',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon-booking')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Paiement sécurisé</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Finaliser votre réservation
          </h2>
          <p className="text-gray-600">
            Paiement 100% sécurisé par Stripe
          </p>
        </div>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} bookingId={bookingId} />
        </Elements>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Vos informations de paiement sont cryptées et sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}