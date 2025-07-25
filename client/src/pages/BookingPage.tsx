import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
import { useLocation } from 'wouter';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface BookingData {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

function BookingPageNew() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  });

  // Services disponibles
  const services: Service[] = [
    {
      id: '1',
      name: 'Coupe & Brushing',
      duration: 60,
      price: 45,
      description: 'Coupe personnalisée avec brushing'
    },
    {
      id: '2',
      name: 'Coloration',
      duration: 120,
      price: 85,
      description: 'Coloration complète avec soins'
    },
    {
      id: '3',
      name: 'Balayage',
      duration: 180,
      price: 120,
      description: 'Technique de balayage naturel'
    },
    {
      id: '4',
      name: 'Soin Visage',
      duration: 75,
      price: 65,
      description: 'Soin complet du visage'
    },
    {
      id: '5',
      name: 'Manucure',
      duration: 45,
      price: 35,
      description: 'Manucure complète avec vernis'
    }
  ];

  // Créneaux disponibles
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Récupérer les infos du salon
  const { data: salonInfo } = useQuery({
    queryKey: ['/api/salon-settings'],
  });

  const generateNextDays = (count: number) => {
    const days = [];
    for (let i = 1; i <= count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return days;
  };

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, selectedService: service }));
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
    setStep(3);
  };

  const handleBookingSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Réservation confirmée",
        description: `Rendez-vous confirmé le ${bookingData.selectedDate} à ${bookingData.selectedTime}`,
      });
      
      setStep(4);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimaliste */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-sm mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h1 className="text-sm font-medium text-gray-900">
                {salonInfo?.businessName || 'Salon Excellence'}
              </h1>
              <p className="text-xs text-gray-500">Réservation</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto p-3">
        {/* Étape 1: Services */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <h2 className="text-sm font-medium text-gray-900">Choisir un service</h2>
            </div>
            
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:shadow-sm transition-shadow border-gray-200"
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {service.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {service.duration}min
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 text-sm">
                        {service.price}€
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Étape 2: Date et heure */}
        {step === 2 && bookingData.selectedService && (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <h2 className="text-sm font-medium text-gray-900">Choisir date et heure</h2>
              <p className="text-xs text-gray-600">
                {bookingData.selectedService.name} - {bookingData.selectedService.price}€
              </p>
            </div>

            {/* Sélection de date */}
            <Card>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Date</h3>
                <div className="grid grid-cols-3 gap-2">
                  {generateNextDays(9).map((day) => (
                    <Button
                      key={day.date}
                      variant={bookingData.selectedDate === day.date ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingData(prev => ({ ...prev, selectedDate: day.date }))}
                      className="h-12 text-xs flex flex-col"
                    >
                      <span className="text-xs">{day.display}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sélection d'heure */}
            {bookingData.selectedDate && (
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Heure</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={bookingData.selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDateTimeSelect(bookingData.selectedDate, time)}
                        className="h-8 text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <h2 className="text-sm font-medium text-gray-900">Vos informations</h2>
              <p className="text-xs text-gray-600">
                {bookingData.selectedService?.name} - {bookingData.selectedDate} à {bookingData.selectedTime}
              </p>
            </div>

            <Card>
              <CardContent className="p-3 space-y-3">
                <Input
                  placeholder="Prénom *"
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
              Confirmer la réservation
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Acompte: {Math.round((bookingData.selectedService?.price || 0) * 0.3)}€
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

export default BookingPageNew;