import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Calendar, Clock, CreditCard } from 'lucide-react';

function BookingSuccess() {
  const [, setLocation] = useLocation();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Récupérer les détails de la session Stripe
      fetch(`/api/booking-session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto p-4">
        {/* Confirmation de succès */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          
          <p className="text-sm text-gray-600 mb-6">
            Votre paiement a été traité avec succès
          </p>
        </div>

        {/* Détails de la réservation */}
        {sessionData && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {sessionData.metadata?.serviceName || 'Service'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sessionData.metadata?.selectedDate} à {sessionData.metadata?.selectedTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Acompte payé: {sessionData.metadata?.depositAmount}€
                  </p>
                  <p className="text-sm text-gray-600">
                    Total service: {sessionData.metadata?.servicePrice}€
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Client: {sessionData.metadata?.clientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sessionData.metadata?.clientPhone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations importantes */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">Informations importantes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vous recevrez un SMS de confirmation</li>
              <li>• Présentez-vous 5min avant votre RDV</li>
              <li>• Annulation gratuite jusqu'à 24h avant</li>
              <li>• Solde à régler sur place</li>
            </ul>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <Button
            onClick={() => setLocation('/')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
          >
            Retour à l'accueil
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="w-full rounded-xl"
          >
            Imprimer la confirmation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;