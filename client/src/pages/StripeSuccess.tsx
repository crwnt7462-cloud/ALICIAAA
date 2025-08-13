import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, CreditCard, ArrowRight } from "lucide-react";
import logoImage from "@assets/3_1753714421825.png";
import { apiRequest } from "@/lib/queryClient";

export default function StripeSuccess() {
  const [, setLocation] = useLocation();
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Récupérer le session_id depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          setLocation('/');
          return;
        }

        // Récupérer les détails de la session Stripe
        const session = await apiRequest('GET', `/api/stripe/session/${sessionId}`);
        setSessionData(session);

        // Déterminer le type de paiement (abonnement ou acompte)
        if ((session as any).metadata?.type === 'subscription') {
          // Traitement pour abonnement professionnel
          const registrationData = localStorage.getItem('pendingRegistration');
          if (registrationData) {
            const userData = JSON.parse(registrationData);
            
            // Finaliser l'inscription professionnelle
            await apiRequest('POST', '/api/auth/register-professional', {
              ...userData,
              stripeSessionId: sessionId,
              subscriptionActive: true
            });

            localStorage.removeItem('pendingRegistration');
          }
        } else if ((session as any).metadata?.type === 'booking_deposit') {
          // Traitement pour acompte de réservation
          const bookingData = localStorage.getItem('bookingInProgress');
          if (bookingData) {
            const booking = JSON.parse(bookingData);
            
            // Finaliser la réservation
            await apiRequest('POST', '/api/appointments', {
              ...booking,
              stripeSessionId: sessionId,
              depositPaid: true,
              status: 'confirmed'
            });

            localStorage.removeItem('bookingInProgress');
            localStorage.removeItem('pendingBooking');
          }
        }
      } catch (error) {
        console.error('Erreur traitement paiement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentSuccess();
  }, [setLocation]);

  const handleContinue = () => {
    if ((sessionData as any)?.metadata?.type === 'subscription') {
      setLocation('/business-features');
    } else {
      setLocation('/client-dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Traitement de votre paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <img src={logoImage} alt="Logo" className="h-14 w-auto" />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {(sessionData as any)?.metadata?.type === 'subscription' 
                ? 'Abonnement activé !' 
                : 'Paiement confirmé !'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {(sessionData as any)?.metadata?.type === 'subscription' 
                ? 'Votre essai gratuit de 14 jours a commencé' 
                : 'Votre réservation est confirmée'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Détails du paiement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Détails du paiement</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium">
                    {(sessionData as any)?.amount_total ? 
                      `${((sessionData as any).amount_total / 100).toFixed(2)}€` : 
                      'Essai gratuit'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Statut</span>
                  <span className="font-medium text-green-600">Confirmé</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {(sessionData as any)?.customer_email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{(sessionData as any).customer_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Prochaines étapes</h4>
              {(sessionData as any)?.metadata?.type === 'subscription' ? (
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Accès immédiat à votre dashboard professionnel</li>
                  <li>• Configuration de votre salon</li>
                  <li>• Première facturation dans 14 jours</li>
                  <li>• Support disponible 7j/7</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Confirmation envoyée par email</li>
                  <li>• Rappel automatique 24h avant</li>
                  <li>• Solde à régler sur place</li>
                  <li>• Annulation gratuite jusqu'à 24h avant</li>
                </ul>
              )}
            </div>

            {/* Email de confirmation */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">Email de confirmation</span>
              </div>
              <p className="text-sm text-amber-700">
                Un email de confirmation a été envoyé à {(sessionData as any)?.customer_email || 'votre adresse email'} 
                avec tous les détails {(sessionData as any)?.metadata?.type === 'subscription' ? 'de votre abonnement' : 'de votre réservation'}.
              </p>
            </div>

            {/* Bouton de continuation */}
            <div className="pt-4">
              <Button
                onClick={handleContinue}
                className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
              >
                {(sessionData as any)?.metadata?.type === 'subscription' ? (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Accéder à mon dashboard
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Voir mes rendez-vous
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Besoin d'aide ? Contactez notre support à{' '}
              <a href="mailto:support@salon-app.com" className="text-violet-600 hover:underline">
                support@salon-app.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}