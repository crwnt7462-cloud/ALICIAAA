import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Initialize Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/booking/${params?.salonId || 'demo'}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-violet-600">1</span>
            </div>
            <div className="w-8 h-1 bg-violet-200"></div>
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-violet-600">2</span>
            </div>
            <div className="w-8 h-1 bg-violet-200"></div>
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">3</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-violet-600" />
              <span>Paiement de l'acompte</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Récapitulatif de la réservation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{bookingData.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date et heure</span>
                  <span className="font-medium">
                    {bookingData.appointmentDate} à {bookingData.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client</span>
                  <span className="font-medium">
                    {bookingData.clientInfo.firstName} {bookingData.clientInfo.lastName}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prix total</span>
                  <span className="font-medium">{bookingData.totalPrice}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Acompte (30%)</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    {bookingData.depositAmount}€
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Solde à régler sur place</span>
                  <span>{(bookingData.totalPrice - bookingData.depositAmount).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <Elements stripe={stripePromise}>
              <PaymentForm 
                bookingData={bookingData} 
                onSuccess={handlePaymentSuccess}
              />
            </Elements>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 mt-0.5">
                  <svg viewBox="0 0 24 24" className="fill-blue-600">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Paiement 100% sécurisé</p>
                  <p className="text-xs text-blue-700">
                    Vos données bancaires sont protégées par Stripe et cryptées SSL. 
                    Annulation gratuite jusqu'à 24h avant le rendez-vous.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}