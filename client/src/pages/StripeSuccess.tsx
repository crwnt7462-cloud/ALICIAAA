import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

interface SessionDetails {
  id: string;
  status: string;
  payment_status: string;
  metadata: {
    type: string;
    planType?: string;
    customerEmail: string;
    appointmentId?: string;
    salonName?: string;
  };
  customer_details: {
    email: string;
    name?: string;
  };
  amount_total: number;
}

export default function StripeSuccess() {
  const [, setLocation] = useLocation();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetchSessionDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/session/${sessionId}`);
      const data = await response.json();

      if (response.ok) {
        setSessionDetails(data);
      } else {
        console.error('Erreur récupération session:', data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const getPaymentTypeLabel = (metadata: SessionDetails['metadata']) => {
    if (metadata.type === 'subscription') {
      return `Abonnement ${metadata.planType}`;
    }
    return 'Paiement d\'acompte';
  };

  const getSuccessMessage = (metadata: SessionDetails['metadata']) => {
    if (metadata.type === 'subscription') {
      return `Votre abonnement ${metadata.planType} a été activé avec succès !`;
    }
    return `Votre paiement d'acompte a été traité avec succès !`;
  };

  const getNextSteps = (metadata: SessionDetails['metadata']) => {
    if (metadata.type === 'subscription') {
      return (
        <div className="space-y-2">
          <p>• Accédez à votre tableau de bord professionnel</p>
          <p>• Configurez votre salon et vos services</p>
          <p>• Commencez à recevoir des réservations</p>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <p>• Votre rendez-vous est confirmé</p>
        <p>• Vous recevrez un email de confirmation</p>
        <p>• Le solde sera réglé lors du rendez-vous</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        {sessionDetails ? (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">Paiement Réussi !</CardTitle>
              <p className="text-green-100 mt-2">
                {getSuccessMessage(sessionDetails.metadata)}
              </p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              {/* Détails du paiement */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Détails du paiement</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{getPaymentTypeLabel(sessionDetails.metadata)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Montant:</span>
                    <p className="font-medium">{formatAmount(sessionDetails.amount_total)}€</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{sessionDetails.customer_details.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Statut:</span>
                    <p className="font-medium text-green-600">Confirmé</p>
                  </div>
                </div>
                
                {sessionDetails.metadata.salonName && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Salon:</span>
                    <p className="font-medium">{sessionDetails.metadata.salonName}</p>
                  </div>
                )}
              </div>

              {/* Prochaines étapes */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Prochaines étapes</h3>
                <div className="text-blue-800 text-sm">
                  {getNextSteps(sessionDetails.metadata)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setLocation("/")}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
                
                {sessionDetails.metadata.type === 'subscription' && (
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/business-features")}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Dashboard Pro
                  </Button>
                )}
              </div>

              {/* Informations de contact */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                <p>Un email de confirmation a été envoyé à {sessionDetails.customer_details.email}</p>
                <p className="mt-1">
                  Besoin d'aide ? Contactez notre support : 
                  <a href="mailto:support@rendly.fr" className="text-blue-600 hover:underline ml-1">
                    support@rendly.fr
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <ExternalLink className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Session de paiement introuvable
              </h2>
              <p className="text-gray-600 mb-6">
                Impossible de récupérer les détails de votre paiement.
              </p>
              <Button onClick={() => setLocation("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}