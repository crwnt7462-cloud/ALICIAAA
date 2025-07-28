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
import logoImage from "@assets/3_1753714984824.png";

// Initialize Stripe with fallback key
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51Rn0zHQbSa7XrNpDpM6MD9LPmkUAPzClEdnFW34j3evKDrUxMud0I0p6vk3ESOBwxjAwmj1cKU5VrKGa7pef6onE00eC66JjRo';

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
  depositAmount: number;
}

function PaymentForm({ bookingData, onSuccess, depositAmount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

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
        const confirmResult = await apiRequest('POST', '/api/appointments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          bookingData: bookingData,
        });

        onSuccess(confirmResult);
        
        toast({
          title: "Paiement réussi !",
          description: "Votre réservation a été confirmée.",
        });
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
        <CardElement 
          options={cardElementOptions}
          className="p-3 bg-white rounded-lg border border-gray-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200"
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Paiement 100% sécurisé</span>
        </div>
        <p className="text-sm text-green-700">
          Vos informations de paiement sont chiffrées et protégées par Stripe.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {processing ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Paiement en cours...
          </>
        ) : (
          <>
            <Lock className="mr-3 h-5 w-5" />
            Payer {depositAmount.toFixed(2)}€ maintenant
          </>
        )}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        En confirmant, vous acceptez nos conditions générales de vente
      </p>
    </form>
  );
}

export default function PaymentStepCustom() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/booking/:salonId/payment');
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('partial');

  const totalAmount = 39.00;
  const depositAmount = selectedPaymentMethod === 'partial' ? 20.50 : totalAmount;
  const remainingAmount = totalAmount - depositAmount;

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const savedBookingData = sessionStorage.getItem('currentBooking');
    if (savedBookingData) {
      const data = JSON.parse(savedBookingData);
      setBookingData({
        ...data,
        depositAmount: depositAmount
      });
    } else {
      // Redirect back if no booking data
      setLocation(`/booking/${params?.salonId || 'demo'}`);
    }
  }, [params, depositAmount]);

  const handlePaymentSuccess = (result: any) => {
    setPaymentSuccess(true);
    setAppointmentDetails(result.appointment);
    
    // Clear booking data
    sessionStorage.removeItem('currentBooking');
    
    // Show success for 5 seconds then redirect
    setTimeout(() => {
      setLocation('/client-dashboard');
    }, 5000);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-600" />
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Paiement confirmé !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre rendez-vous a été réservé avec succès.
            </p>
            
            {appointmentDetails && (
              <div className="bg-violet-50 rounded-lg p-4 mb-6 text-left border border-violet-200">
                <h3 className="font-semibold mb-3 text-violet-900">Détails du rendez-vous</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">{appointmentDetails.appointmentDate} à {appointmentDetails.startTime}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Service :</span>
                    <span className="font-medium">{bookingData.serviceName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Acompte payé :</span>
                    <span className="font-medium text-green-600">{depositAmount.toFixed(2)}€</span>
                  </p>
                  {remainingAmount > 0 && (
                    <p className="flex justify-between">
                      <span className="text-gray-600">Restant à payer :</span>
                      <span className="font-medium">{remainingAmount.toFixed(2)}€</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Redirection automatique dans quelques secondes...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Service de paiement indisponible
            </h2>
            <p className="text-gray-600 mb-6">
              Le service de paiement n'est pas configuré. Veuillez contacter le support.
            </p>
            <Button onClick={() => setLocation('/')} className="w-full">
              Retourner à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src={logoImage} alt="Logo" className="h-12 w-auto" />
              <div>
                <p className="font-semibold text-gray-900">Paiement sécurisé</p>
                <p className="text-sm text-gray-500">Étape 4/4</p>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Récapitulatif - Gauche */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{bookingData.serviceName || 'Coupe Bonhomme'}</p>
                      <p className="text-sm text-gray-500">
                        {bookingData.appointmentDate || 'Aujourd\'hui'} à {bookingData.startTime || '15:00'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Salon Excellence Paris - Archives
                      </p>
                    </div>
                    <p className="font-bold text-xl text-gray-900">{totalAmount.toFixed(2)} €</p>
                  </div>
                  
                  <Separator className="bg-gray-200" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{totalAmount.toFixed(2)} €</span>
                    </div>
                    
                    <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                      <p className="font-semibold text-violet-900 mb-3">Comment souhaitez-vous payer ?</p>
                      
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="partial"
                            checked={selectedPaymentMethod === 'partial'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="mt-1 w-4 h-4 text-violet-600 border-violet-300 focus:ring-violet-500" 
                          />
                          <div className="flex-1">
                            <p className="font-medium text-violet-900 group-hover:text-violet-700">
                              Payer une partie maintenant, le reste sur place
                            </p>
                            <p className="text-sm text-violet-700 mt-1">
                              Payer une partie {(totalAmount / 2).toFixed(2)} € maintenant puis le reste {(totalAmount / 2).toFixed(2)} € sur place.
                            </p>
                          </div>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer group opacity-75">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="total"
                            checked={selectedPaymentMethod === 'total'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="mt-1 w-4 h-4 text-violet-600 border-violet-300 focus:ring-violet-500" 
                          />
                          <div className="flex-1">
                            <p className="font-medium text-violet-900 group-hover:text-violet-700">
                              Payer la totalité
                            </p>
                            <p className="text-sm text-violet-700 mt-1">
                              Payer maintenant le montant total {totalAmount.toFixed(2)} € de votre réservation.
                            </p>
                          </div>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer group opacity-50">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="gift"
                            checked={selectedPaymentMethod === 'gift'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="mt-1 w-4 h-4 text-violet-600 border-violet-300 focus:ring-violet-500" 
                            disabled
                          />
                          <div className="flex-1">
                            <p className="font-medium text-violet-900">
                              Payer avec une carte cadeau
                            </p>
                            <p className="text-sm text-violet-700 mt-1">
                              La carte cadeau ne sera pas prélevée maintenant, vous paierez avec sur place.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">À régler maintenant</span>
                        <span className="font-semibold text-green-600">{depositAmount.toFixed(2)} €</span>
                      </div>
                      {remainingAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">À régler sur place</span>
                          <span className="font-semibold">{remainingAmount.toFixed(2)} €</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de paiement - Droite */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-violet-600" />
                  Informations de paiement
                </CardTitle>
                <p className="text-sm text-gray-500 mt-2">
                  Vos données sont protégées par un chiffrement SSL 256 bits
                </p>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    bookingData={bookingData} 
                    onSuccess={handlePaymentSuccess}
                    depositAmount={depositAmount}
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