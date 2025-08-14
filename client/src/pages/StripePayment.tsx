import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Configuration Stripe avec clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface BookingData {
  salonName: string;
  salonLocation: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientEmail: string;
  professionalName: string;
}

function PaymentForm({ bookingData, onSuccess }: { bookingData: BookingData; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Créer le Payment Intent au chargement
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: bookingData.servicePrice * 0.3, // Acompte de 30%
            currency: 'eur',
            metadata: {
              salonName: bookingData.salonName,
              serviceName: bookingData.serviceName,
              clientEmail: bookingData.clientEmail,
              appointmentDate: bookingData.selectedDate,
              appointmentTime: bookingData.selectedTime
            }
          }),
        });

        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Erreur lors de la création du paiement");
        }
      } catch (err) {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    };

    createPaymentIntent();
  }, [bookingData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;
    
    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // Confirmer le paiement avec Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingData.clientName,
            email: bookingData.clientEmail,
          },
        },
      });

      if (error) {
        setError(error.message || "Erreur lors du paiement");
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirmer la réservation côté serveur
        const bookingResponse = await fetch('/api/confirm-booking-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            bookingData: {
              clientId: 1, // À récupérer depuis le contexte client
              salonId: 1,
              serviceId: 1,
              staffId: 1,
              date: bookingData.selectedDate,
              time: bookingData.selectedTime,
              totalPrice: bookingData.servicePrice,
              depositAmount: 20.50,
              notes: `Réservation de ${bookingData.serviceName} chez ${bookingData.salonName}`
            }
          }),
        });

        const bookingResult = await bookingResponse.json();
        
        if (bookingResult.success) {
          // Sauvegarder les détails de la réservation confirmée
          sessionStorage.setItem('confirmedBooking', JSON.stringify({
            ...bookingData,
            paymentId: paymentIntent.id,
            appointmentId: bookingResult.appointment?.id
          }));
          
          onSuccess();
        } else {
          setError("Paiement effectué mais erreur lors de la confirmation de réservation");
        }
      }
    } catch (err) {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
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
        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-full font-medium text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          `Payer ${(bookingData.servicePrice * 0.3).toFixed(2)} €`
        )}
      </Button>
    </form>
  );
}

export default function StripePayment() {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    // Récupérer les données de réservation
    const savedBooking = sessionStorage.getItem('currentBooking');
    if (savedBooking) {
      setBookingData(JSON.parse(savedBooking));
    } else {
      // Rediriger si pas de données
      setLocation('/');
    }
  }, [setLocation]);

  const handlePaymentSuccess = () => {
    setLocation('/booking-success');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 p-0 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Paiement sécurisé</h1>
              <p className="text-sm text-gray-600">{bookingData.salonName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Montant de l'acompte */}
        <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-xl">
          <CardContent className="p-6 text-center text-white">
            <h2 className="text-sm font-medium text-violet-100 mb-2">ACOMPTE À RÉGLER</h2>
            <div className="text-4xl font-bold mb-2">20,50 €</div>
            <p className="text-violet-100">
              50% à payer maintenant • 18,50 € sur place
            </p>
            <div className="mt-3 text-xs text-violet-100 bg-black/20 rounded-full px-3 py-1 inline-block">
              Total : {bookingData.servicePrice},00 € • {bookingData.serviceName}
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif de la réservation */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Détails de votre réservation</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{bookingData.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date et heure</span>
                <span className="font-medium">{bookingData.selectedDate} à {bookingData.selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professionnel</span>
                <span className="font-medium">{bookingData.professionalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Client</span>
                <span className="font-medium">{bookingData.clientName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Paiement sécurisé par Stripe</span>
        </div>

        {/* Formulaire de paiement Stripe */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-violet-600" />
              Informations de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <PaymentForm bookingData={bookingData} onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Service de paiement indisponible</p>
                <Button 
                  onClick={handlePaymentSuccess}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Simuler le paiement (Démo)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Garanties */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Annulation gratuite</p>
              <p>Vous pouvez annuler gratuitement jusqu'à 24h avant votre rendez-vous.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}