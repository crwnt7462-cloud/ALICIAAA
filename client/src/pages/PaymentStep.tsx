import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Check, AlertCircle, Loader2, Shield, Lock } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import logoImage from "@assets/3_1753714421825.png";

// Initialize Stripe with production key
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: any = null;
try {
  if (STRIPE_KEY && STRIPE_KEY.startsWith('pk_')) {
    stripePromise = loadStripe(STRIPE_KEY);
  }
} catch (error) {
  console.warn('Stripe initialization failed:', error);
}

interface PaymentFormProps {
  bookingData: any;
  onSuccess: (result: any) => void;
}

function PaymentForm({ bookingData, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Élément de carte introuvable");
      setProcessing(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(bookingData.clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: `${bookingData.clientInfo.firstName} ${bookingData.clientInfo.lastName}`,
            email: bookingData.clientInfo.email,
            phone: bookingData.clientInfo.phone,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Erreur de paiement");
        toast({
          title: "Erreur de paiement",
          description: stripeError.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm booking on backend
        const result = await apiRequest('POST', '/api/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          bookingData
        });

        toast({
          title: "Paiement confirmé !",
          description: "Votre rendez-vous a été réservé avec succès.",
        });

        onSuccess(result);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || "Erreur lors du traitement du paiement");
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
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
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Payer {bookingData.depositAmount}€
          </>
        )}
      </Button>
    </form>
  );
}

export default function PaymentStep() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/booking/:salonId/payment');
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('partial');

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const savedBookingData = sessionStorage.getItem('currentBooking');
    if (savedBookingData) {
      const data = JSON.parse(savedBookingData);
      setBookingData(data);
    } else {
      // Redirect back if no booking data
      setLocation(`/booking/${params?.salonId || 'demo'}`);
    }
  }, [params]);

  const handlePaymentSuccess = (result: any) => {
    setPaymentSuccess(true);
    setAppointmentDetails(result.appointment);
    
    // Clear booking data
    sessionStorage.removeItem('currentBooking');
    
    // Show success for 3 seconds then redirect
    setTimeout(() => {
      setLocation('/');
    }, 5000);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-600" />
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement confirmé !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre rendez-vous a été réservé avec succès.
            </p>
            
            {appointmentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Détails du rendez-vous</h3>
                <p className="text-sm text-gray-600">
                  📅 {appointmentDetails.appointmentDate} à {appointmentDetails.startTime}
                </p>
                <p className="text-sm text-gray-600">
                  💼 {bookingData.serviceName}
                </p>
                <p className="text-sm text-gray-600">
                  💰 Acompte payé : {bookingData.depositAmount}€
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Vous allez être redirigé automatiquement...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header avec logo */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src={logoImage} alt="Logo" className="h-12 w-auto" />
              <div>
                <p className="font-semibold text-gray-900">4. Moyen de paiement</p>
                <p className="text-sm text-gray-500">Comment souhaitez-vous payer ?</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation(`/booking/${params?.salonId || 'demo'}`)}
              className="text-gray-600 hover:text-violet-600 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Montant de l'acompte en évidence */}
        <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-xl">
          <CardContent className="p-6 text-center text-white">
            <h2 className="text-sm font-medium text-violet-100 mb-2">ACOMPTE À RÉGLER</h2>
            <div className="text-4xl font-bold mb-2">20,50 €</div>
            <p className="text-violet-100">
              50% à payer maintenant • 18,50 € sur place
            </p>
            <div className="mt-3 text-xs text-violet-100 bg-black/20 rounded-full px-3 py-1 inline-block">
              Total : 39,00 € • Coupe Bonhomme
            </div>
          </CardContent>
        </Card>

        {/* Options de paiement */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Comment souhaitez-vous payer ?</h3>
          
          {/* Option 1 - Payer une partie maintenant */}
          <label className="flex items-start gap-4 p-4 bg-white rounded-2xl border-2 border-violet-600 cursor-pointer group hover:bg-violet-50/50 transition-colors">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="partial"
              defaultChecked
              className="w-5 h-5 text-violet-600 border-violet-300 focus:ring-violet-500 mt-1" 
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">
                Payer une partie maintenant, le reste sur place
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Payer une partie {Math.round((bookingData?.price || 40) * 0.5)} € maintenant puis le reste {Math.round((bookingData?.price || 40) * 0.5)} € sur place.
              </p>
            </div>
          </label>
          
          {/* Option 2 - Payer la totalité */}
          <label className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 cursor-pointer group hover:bg-gray-50 transition-colors">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="total"
              className="w-5 h-5 text-violet-600 border-gray-300 focus:ring-violet-500 mt-1" 
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">Payer la totalité</p>
              <p className="text-sm text-gray-600">
                Payer maintenant le montant total {(bookingData?.price || 39).toFixed(2)} € de votre réservation.
              </p>
            </div>
          </label>
          
          {/* Option 3 - Carte cadeau */}
          <label className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer opacity-60">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="gift"
              disabled
              className="w-5 h-5 text-violet-600 border-gray-300 focus:ring-violet-500 mt-1" 
            />
            <div className="flex-1">
              <p className="font-medium text-gray-700 mb-1">Payer avec une carte cadeau</p>
              <p className="text-sm text-gray-500">
                La carte cadeau ne sera pas prélevée maintenant, vous paierez avec sur place.
              </p>
            </div>
          </label>
        </div>

        {/* Récapitulatif */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>{bookingData.serviceName || 'Coupe Bonhomme'}</span>
              <span>39,00 €</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">39,00 €</span>
              </div>
              
              <Separator />
              
              <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-violet-800">Acompte à régler maintenant</h3>
                  <div className="text-3xl font-bold text-violet-900 mt-1">20,50 €</div>
                  <p className="text-sm text-violet-600 mt-1">50% du montant total</p>
                </div>
                
                <div className="border-t border-violet-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Acompte maintenant</span>
                    <span className="font-semibold text-violet-700">20,50 €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Solde sur place</span>
                    <span className="font-semibold text-gray-700">18,50 €</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-violet-200 pt-2">
                    <span>Total prestation</span>
                    <span>39,00 €</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de paiement */}
        {stripePromise ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-violet-600" />
                Informations de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <PaymentForm bookingData={bookingData} onSuccess={handlePaymentSuccess} />
              </Elements>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <p className="text-gray-600 mb-4">
                Service de paiement temporairement indisponible.
              </p>
              <Button 
                onClick={() => handlePaymentSuccess({ appointment: { id: 'demo' } })}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                size="lg"
              >
                Simuler le paiement (Demo)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}