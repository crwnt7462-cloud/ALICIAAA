import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Check, Calendar, Clock, MapPin, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingDetails {
  id: number;
  professional: string;
  service: string;
  salon: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  address: string;
  phone: string;
  status: string;
  paymentStatus: string;
  depositPaid?: string;
}

export default function BookingSuccess() {
  const [location] = useLocation();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extraire l'ID de réservation depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
      setError('ID de réservation manquant');
      setLoading(false);
      return;
    }

    // Récupérer les détails de la réservation depuis l'API
    const fetchBookingDetails = async () => {
      try {
        console.log('🔍 Récupération détails réservation:', bookingId);
        
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Réservation non trouvée');
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Détails réservation récupérés:', data);
        
        setBookingDetails(data);
      } catch (err) {
        console.error('❌ Erreur récupération réservation:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des détails de votre réservation...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Erreur de chargement
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button asChild>
                <Link href="/salon-search">
                  Retour à la recherche
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Confirmation Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Réservation Confirmée !
          </h1>
          <p className="text-gray-600">
            Votre rendez-vous a été confirmé avec succès
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Détails de votre réservation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Service Info */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{bookingDetails.service}</h3>
              <p className="text-gray-600">Avec {bookingDetails.professional}</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{bookingDetails.price}</p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">Date</p>
                  <p className="text-gray-600">{bookingDetails.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">Heure</p>
                  <p className="text-gray-600">{bookingDetails.time} ({bookingDetails.duration})</p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">{bookingDetails.salon}</p>
                  <p className="text-gray-600">{bookingDetails.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">Contact</p>
                  <p className="text-gray-600">{bookingDetails.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {bookingDetails.paymentStatus && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Statut du paiement</p>
                    <p className="text-gray-600 capitalize">{bookingDetails.paymentStatus}</p>
                    {bookingDetails.depositPaid && (
                      <p className="text-sm text-green-600">
                        Acompte payé: {bookingDetails.depositPaid}€
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Informations importantes</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Un email de confirmation vous sera envoyé sous peu</li>
              <li>• Vous recevrez un rappel 24h avant votre rendez-vous</li>
              <li>• Merci d'arriver 10 minutes en avance</li>
              <li>• Pour toute modification, contactez directement le salon</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild 
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Link href="/salon-search">
              Nouvelle réservation
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-purple-200 hover:bg-purple-50"
            onClick={() => window.print()}
          >
            Imprimer la confirmation
          </Button>
        </div>

        {/* Booking ID for reference */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Numéro de réservation: #{bookingDetails.id}
          </p>
        </div>
      </div>
    </div>
  );
}