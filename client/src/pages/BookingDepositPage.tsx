import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, Calendar, Clock, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/3_1753714984824.png";

export default function BookingDepositPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données de réservation depuis le localStorage
    const storedBooking = localStorage.getItem('pendingBooking');
    
    if (storedBooking) {
      const booking = JSON.parse(storedBooking);
      setBookingData(booking);
    } else {
      // Rediriger vers la recherche si pas de données
      setLocation('/search');
    }
  }, [setLocation]);

  const handlePayment = async () => {
    if (!bookingData) return;
    
    setIsLoading(true);
    try {
      const depositAmount = Math.round(bookingData.service.price * 0.3); // 30% d'acompte
      
      const response = await apiRequest('POST', '/api/stripe/create-deposit-checkout', {
        amount: depositAmount,
        description: bookingData.service.name,
        customerEmail: bookingData.client.email,
        customerName: `${bookingData.client.firstName} ${bookingData.client.lastName}`,
        appointmentId: bookingData.appointmentId || 'temp',
        salonName: bookingData.salon.name
      });

      if (response.url) {
        // Sauvegarder les données de réservation avant redirection
        localStorage.setItem('bookingInProgress', JSON.stringify({
          ...bookingData,
          sessionId: response.sessionId,
          depositAmount
        }));
        
        // Rediriger vers Stripe Checkout
        window.location.href = response.url;
      }
    } catch (error: any) {
      console.error('Erreur création paiement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const depositAmount = Math.round(bookingData.service.price * 0.3);
  const remainingAmount = bookingData.service.price - depositAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-14 w-auto" />
              <div className="ml-4">
                <p className="text-sm font-medium">Paiement de l'acompte</p>
                <p className="text-xs text-gray-500">Étape finale</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Détails de la réservation */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Résumé de votre réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Salon */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">{bookingData.salon.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{bookingData.salon.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>⭐ {bookingData.salon.rating}/5</span>
                    <span>•</span>
                    <span>{bookingData.salon.reviewCount} avis</span>
                  </div>
                </div>

                {/* Service */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Service sélectionné</h4>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{bookingData.service.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{bookingData.service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{bookingData.selectedDate}</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-violet-600">{bookingData.service.price}€</p>
                  </div>
                </div>

                {/* Horaire */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Créneaux sélectionnés</h4>
                  <div className="bg-violet-50 p-3 rounded-lg">
                    <p className="font-medium">{bookingData.selectedTime}</p>
                    <p className="text-sm text-gray-600">{bookingData.selectedDate}</p>
                  </div>
                </div>

                {/* Client */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Vos informations</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{bookingData.client.firstName} {bookingData.client.lastName}</p>
                    <p>{bookingData.client.email}</p>
                    <p>{bookingData.client.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section paiement */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Paiement de l'acompte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Détail des montants */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prix du service</span>
                      <span className="font-medium">{bookingData.service.price}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Acompte à payer (30%)</span>
                      <span className="font-semibold text-violet-600">{depositAmount}€</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-sm text-gray-600">Solde à payer au salon</span>
                      <span className="font-medium">{remainingAmount}€</span>
                    </div>
                  </div>
                </div>

                {/* Conditions d'annulation */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Politique d'annulation</h4>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li>• Annulation gratuite jusqu'à 24h avant</li>
                    <li>• Remboursement total de l'acompte</li>
                    <li>• Report possible selon disponibilités</li>
                  </ul>
                </div>

                {/* Sécurité */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Paiement 100% sécurisé</p>
                    <p className="text-xs text-blue-600">Chiffrement SSL et protection Stripe</p>
                  </div>
                </div>

                {/* Bouton de paiement */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Préparation du paiement...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payer l'acompte {depositAmount}€
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  En payant, vous confirmez votre réservation et acceptez nos{' '}
                  <a href="/terms" className="text-violet-600 hover:underline">
                    conditions d'utilisation
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}