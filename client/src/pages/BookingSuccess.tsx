import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calendar, Clock, MapPin, Phone } from 'lucide-react';

export default function BookingSuccess() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('booking_id');
    if (id) {
      setBookingId(id);
    }
  }, []);

  const bookingDetails = {
    professional: 'Sarah Martinez',
    service: 'Coiffure & Coloration',
    salon: 'Salon Excellence Paris',
    date: '25 Janvier 2025',
    time: '14:00',
    duration: '90 min',
    price: '65€',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 25 76 89'
  };

  const confirmationNumber = `RDV-${bookingId.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-md mx-auto p-4 pt-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          
          <p className="text-gray-600 mb-4">
            Votre rendez-vous a été enregistré avec succès
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <p className="text-sm text-gray-700">
              Numéro de confirmation: <span className="font-mono font-bold text-green-700">{confirmationNumber}</span>
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-violet-600" />
              Détails de votre rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Professionnel</p>
                <p className="font-semibold text-gray-900">{bookingDetails.professional}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold text-gray-900">{bookingDetails.service}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">{bookingDetails.date} à {bookingDetails.time}</p>
                  <p className="text-sm text-gray-600">Durée: {bookingDetails.duration}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{bookingDetails.salon}</p>
                  <p className="text-sm text-gray-600">{bookingDetails.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-900">{bookingDetails.phone}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total payé:</span>
                <span className="text-lg font-bold text-green-600">{bookingDetails.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Vous recevrez un SMS de confirmation dans quelques minutes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Un rappel vous sera envoyé 24h avant votre rendez-vous
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Annulation gratuite jusqu'à 24h avant le rendez-vous
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.history.back()}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12"
          >
            Retour
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setLocation('/salon-detail')}
            className="w-full h-12"
          >
            Découvrir d'autres services
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            Une question ? Contactez le salon directement
          </p>
          <p className="text-sm font-medium text-gray-900">{bookingDetails.phone}</p>
        </div>
      </div>
    </div>
  );
}