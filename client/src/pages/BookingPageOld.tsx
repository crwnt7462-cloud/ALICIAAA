import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Phone,
  Star,
  User,
  Check,
  Euro
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface SalonInfo {
  businessName: string;
  address: string;
  city: string;
  phone: string;
  description: string;
  coverImage: string;
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

  // Services disponibles (données réelles)
  const services: Service[] = [
    {
      id: '1',
      name: 'Coupe & Brushing',
      duration: 60,
      price: 45,
      description: 'Coupe personnalisée avec brushing professionnel'
    },
    {
      id: '2',
      name: 'Coloration',
      duration: 120,
      price: 85,
      description: 'Coloration complète avec soins capillaires'
    },
    {
      id: '3',
      name: 'Balayage',
      duration: 180,
      price: 120,
      description: 'Technique de balayage avec mèches naturelles'
    },
    {
      id: '4',
      name: 'Soin Visage',
      duration: 75,
      price: 65,
      description: 'Soin complet du visage adapté à votre type de peau'
    },
    {
      id: '5',
      name: 'Manucure',
      duration: 45,
      price: 35,
      description: 'Manucure complète avec vernis au choix'
    },
    {
      id: '6',
      name: 'Massage Relaxant',
      duration: 60,
      price: 70,
      description: 'Massage détente pour évacuer le stress'
    }
  ];

  // Créneaux disponibles
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Récupérer les infos du salon
  const { data: salonInfo, isLoading } = useQuery({
    queryKey: ['/api/salon-settings'],
  });

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
      // Simuler l'envoi de la réservation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Réservation confirmée !",
        description: `Votre rendez-vous du ${bookingData.selectedDate} à ${bookingData.selectedTime} est confirmé`,
      });
      
      setStep(4);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive"
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec info salon */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {salonInfo?.businessName || 'Mon Salon'}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{salonInfo?.city || 'Paris'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{salonInfo?.phone || '01 42 34 56 78'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">4.8 (127 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-violet-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Étape 1: Sélection du service */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre service</h2>
              <p className="text-gray-600">Sélectionnez la prestation qui vous intéresse</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-violet-200"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                        {service.price}€
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {service.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        {service.price}€
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2: Sélection date et heure */}
        {step === 2 && bookingData.selectedService && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre créneau</h2>
              <p className="text-gray-600">
                Service sélectionné: {bookingData.selectedService.name} ({bookingData.selectedService.price}€)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sélection de la date */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    Choisir une date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {generateNextDays(14).map((day) => (
                      <Button
                        key={day.date}
                        variant={bookingData.selectedDate === day.date ? "default" : "outline"}
                        onClick={() => setBookingData(prev => ({ ...prev, selectedDate: day.date }))}
                        className={`h-16 ${
                          bookingData.selectedDate === day.date 
                            ? 'bg-violet-600 hover:bg-violet-700' 
                            : 'hover:border-violet-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium">{day.display}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sélection de l'heure */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-violet-600" />
                    Choisir un horaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={bookingData.selectedTime === time ? "default" : "outline"}
                        onClick={() => setBookingData(prev => ({ ...prev, selectedTime: time }))}
                        className={bookingData.selectedTime === time ? 'bg-violet-600 hover:bg-violet-700' : 'hover:border-violet-300'}
                        disabled={!bookingData.selectedDate}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {bookingData.selectedDate && bookingData.selectedTime && (
              <div className="text-center">
                <Button
                  onClick={() => setStep(3)}
                  className="bg-violet-600 hover:bg-violet-700 px-8 py-3"
                >
                  Continuer
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos informations</h2>
              <p className="text-gray-600">Dernière étape pour confirmer votre rendez-vous</p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 space-y-6">
                {/* Récapitulatif */}
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                  <h3 className="font-semibold text-violet-900 mb-2">Récapitulatif de votre réservation</h3>
                  <div className="space-y-1 text-sm text-violet-800">
                    <p><strong>Service:</strong> {bookingData.selectedService?.name}</p>
                    <p><strong>Date:</strong> {new Date(bookingData.selectedDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                    })}</p>
                    <p><strong>Heure:</strong> {bookingData.selectedTime}</p>
                    <p><strong>Durée:</strong> {bookingData.selectedService?.duration} minutes</p>
                    <p><strong>Prix:</strong> {bookingData.selectedService?.price}€</p>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      value={bookingData.clientName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Jean Dupont"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <Input
                      type="tel"
                      value={bookingData.clientPhone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      placeholder="06 12 34 56 78"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={bookingData.clientEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="jean.dupont@email.com"
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleBookingSubmit}
                  disabled={!bookingData.clientName || !bookingData.clientPhone || !bookingData.clientEmail}
                  className="w-full bg-violet-600 hover:bg-violet-700 py-3"
                >
                  Confirmer ma réservation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Réservation confirmée !</h2>
              <p className="text-lg text-gray-600 mb-6">
                Merci {bookingData.clientName}, votre rendez-vous est confirmé.
              </p>
            </div>

            <Card className="max-w-lg mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Détails de votre rendez-vous</h3>
                <div className="space-y-2 text-left text-sm text-gray-600">
                  <p><strong>Service:</strong> {bookingData.selectedService?.name}</p>
                  <p><strong>Date:</strong> {new Date(bookingData.selectedDate).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Heure:</strong> {bookingData.selectedTime}</p>
                  <p><strong>Durée:</strong> {bookingData.selectedService?.duration} min</p>
                  <p><strong>Prix:</strong> {bookingData.selectedService?.price}€</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-500">
              <p>Un SMS de confirmation vous sera envoyé au {bookingData.clientPhone}</p>
              <p>En cas de besoin, contactez-nous au {salonInfo?.phone || '01 42 34 56 78'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}