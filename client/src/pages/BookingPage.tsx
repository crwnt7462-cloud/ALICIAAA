import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
import { useLocation } from 'wouter';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  specialist: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  });

  const services: Service[] = [
    { id: '1', name: 'Coupe + Brushing', price: 65, duration: 90, specialist: 'Sarah' },
    { id: '2', name: 'Coloration + Coupe', price: 120, duration: 180, specialist: 'Marie' },
    { id: '3', name: 'Soin Hydratant', price: 45, duration: 60, specialist: 'Emma' },
    { id: '4', name: 'Highlights', price: 85, duration: 120, specialist: 'Julie' }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:30', available: false },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '15:30', available: false },
    { time: '17:00', available: true }
  ];

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, selectedService: service }));
    setStep(2);
  };

  const handleTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
    setStep(3);
  };

  const handleBookingSubmit = () => {
    if (!bookingData.clientName || !bookingData.clientPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir votre nom et téléphone",
        variant: "destructive"
      });
      return;
    }
    
    // Simuler paiement
    toast({
      title: "Paiement en cours...",
      description: "Redirection vers Stripe"
    });
    
    setTimeout(() => {
      setStep(4);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Réservation</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Progress indicator */}
        <div className="flex items-center mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div 
                  className={`h-0.5 w-8 mx-2 ${
                    step > num ? 'bg-violet-600' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Services */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez votre service
            </h2>
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.duration} min • {service.specialist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{service.price}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Étape 2: Date & Heure */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez une date
            </h2>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Aujourd'hui - 25 Janvier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={slot.available ? "outline" : "secondary"}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect('2025-01-25', slot.time)}
                      className="h-10"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vos informations
            </h2>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="text-sm font-medium">{bookingData.selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{bookingData.selectedDate} à {bookingData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prix:</span>
                  <span className="text-sm font-medium">{bookingData.selectedService?.price}€</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Nom complet *"
                  value={bookingData.clientName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="h-9 text-sm"
                />
                <Input
                  placeholder="Téléphone *"
                  value={bookingData.clientPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="h-9 text-sm"
                />
                <Input
                  placeholder="Email"
                  value={bookingData.clientEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="h-9 text-sm"
                />
              </CardContent>
            </Card>

            <Button
              onClick={handleBookingSubmit}
              disabled={!bookingData.clientName || !bookingData.clientPhone}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
            >
              Payer l'acompte ({Math.round((bookingData.selectedService?.price || 0) * 0.3)}€)
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Paiement sécurisé par Stripe • Total: {bookingData.selectedService?.price}€
              </p>
            </div>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Réservation confirmée !
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Vous recevrez un SMS de confirmation
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}