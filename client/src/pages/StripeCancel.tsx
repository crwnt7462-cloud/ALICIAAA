import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, CreditCard, RefreshCw } from "lucide-react";
import logoImage from "@assets/3_1753714421825.png";

export default function StripeCancel() {
  const [, setLocation] = useLocation();

  const handleRetry = () => {
    // Récupérer le type de paiement pour rediriger correctement
    const registrationData = localStorage.getItem('pendingRegistration');
    const bookingData = localStorage.getItem('bookingInProgress');
    
    if (registrationData) {
      // Retour vers l'inscription
      const userData = JSON.parse(registrationData);
      setLocation(`/subscribe?plan=${userData.planType}&billing=${userData.billingCycle}`);
    } else if (bookingData) {
      // Retour vers la réservation
      setLocation('/search');
    } else {
      // Retour à l'accueil par défaut
      setLocation('/');
    }
  };

  const handleGoHome = () => {
    // Nettoyer les données en attente
    localStorage.removeItem('pendingRegistration');
    localStorage.removeItem('bookingInProgress');
    localStorage.removeItem('pendingBooking');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Paiement annulé
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Information sur l'annulation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Que s'est-il passé ?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vous avez cliqué sur "Retour" pendant le processus de paiement</li>
                <li>• Aucune transaction n'a été effectuée</li>
                <li>• Vos données sont conservées pour un prochain essai</li>
                <li>• Vous pouvez reprendre le processus à tout moment</li>
              </ul>
            </div>

            {/* Aide et support */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Besoin d'aide ?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Si vous rencontrez des difficultés avec le paiement, voici quelques solutions :
              </p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Vérifiez que votre carte est valide et non expirée</li>
                <li>• Assurez-vous d'avoir suffisamment de fonds</li>
                <li>• Essayez avec une autre carte bancaire</li>
                <li>• Contactez votre banque si le problème persiste</li>
              </ul>
            </div>

            {/* Options disponibles */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Vos options</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Réessayer le paiement avec les mêmes informations</li>
                <li>• Modifier vos informations et recommencer</li>
                <li>• Choisir un autre plan d'abonnement</li>
                <li>• Contacter notre support pour assistance</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleRetry}
                className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer le paiement
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full h-12 text-base font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            {/* Contact support */}
            <div className="pt-4 border-t">
              <p className="text-sm text-center text-gray-600 mb-3">
                Vous rencontrez toujours des difficultés ?
              </p>
              <div className="flex items-center justify-center gap-4">
                <a 
                  href="mailto:support@salon-app.com" 
                  className="text-sm text-violet-600 hover:underline flex items-center gap-1"
                >
                  <CreditCard className="w-4 h-4" />
                  support@salon-app.com
                </a>
                <span className="text-gray-300">•</span>
                <a 
                  href="tel:+33123456789" 
                  className="text-sm text-violet-600 hover:underline"
                >
                  01 23 45 67 89
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}