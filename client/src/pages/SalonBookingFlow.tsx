import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Clock, Euro } from 'lucide-react';
import { useLocation } from 'wouter';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  price: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  salonId: string;
  professional: Professional | null;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  totalPrice: number;
}

export default function SalonBookingFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    salonId: 'salon-excellence-paris',
    professional: null,
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    totalPrice: 0
  });

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Sarah Martinez',
      specialty: 'Coiffure & Coloration',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      price: 65
    },
    {
      id: '2', 
      name: 'Marie Dubois',
      specialty: 'Soins Esthétiques',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      price: 80
    },
    {
      id: '3',
      name: 'Emma Laurent',
      specialty: 'Massage & Bien-être',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      price: 75
    },
    {
      id: '4',
      name: 'Julie Chen',
      specialty: 'Onglerie & Manucure',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      price: 45
    }
  ];

  const availableSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:30', available: false },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '15:30', available: false },
    { time: '17:00', available: true },
    { time: '18:30', available: true }
  ];

  const handleProfessionalSelect = (professional: Professional) => {
    setBookingData(prev => ({ 
      ...prev, 
      professional,
      totalPrice: professional.price
    }));
    setStep(2);
  };

  const handleTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
    setStep(3);
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.clientName || !bookingData.clientPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir votre nom et téléphone",
        variant: "destructive"
      });
      return;
    }

    try {
      // Créer une intention de paiement Stripe
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.totalPrice,
          bookingData: bookingData
        })
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        // Rediriger vers la page de paiement Stripe
        setLocation(`/stripe-checkout?client_secret=${clientSecret}&booking_id=${Date.now()}`);
      } else {
        throw new Error('Erreur lors de la création du paiement');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de procéder au paiement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => step > 1 ? setStep(step - 1) : setLocation('/salon-detail')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {step === 1 && "Choisir un professionnel"}
              {step === 2 && "Date & Heure"}
              {step === 3 && "Confirmation"}
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Progress indicator */}
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((num) => (
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
              {num < 3 && (
                <div 
                  className={`h-0.5 w-16 mx-2 ${
                    step > num ? 'bg-violet-600' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Choix du professionnel */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Salon Excellence Paris
              </h2>
              <p className="text-gray-600">Choisissez votre professionnel</p>
            </div>

            {professionals.map((pro) => (
              <Card
                key={pro.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProfessionalSelect(pro)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={pro.avatar} 
                      alt={pro.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{pro.specialty}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700">{pro.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm font-bold text-gray-900">{pro.price}€</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                        Choisir
                      </Button>
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
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {bookingData.professional?.name}
              </h2>
              <p className="text-gray-600">{bookingData.professional?.specialty}</p>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Aujourd'hui - 25 Janvier 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={slot.available ? "outline" : "secondary"}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect('2025-01-25', slot.time)}
                      className="h-12 text-sm"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Euro className="h-4 w-4" />
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Professionnel:</span>
                  <span className="text-sm font-medium">{bookingData.professional?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="text-sm font-medium">{bookingData.professional?.specialty}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-sm">Total:</span>
                  <span className="text-sm">{bookingData.totalPrice}€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Vos informations
              </h2>
              <p className="text-gray-600">Dernière étape avant le paiement</p>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Récapitulatif de réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Professionnel:</span>
                  <span className="text-sm font-medium">{bookingData.professional?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{bookingData.selectedDate} à {bookingData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="text-sm font-medium">{bookingData.professional?.specialty}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-sm">Total à payer:</span>
                    <span className="text-sm">{bookingData.totalPrice}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Nom complet *"
                  value={bookingData.clientName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="h-10"
                />
                <Input
                  placeholder="Téléphone *"
                  value={bookingData.clientPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="h-10"
                />
                <Input
                  placeholder="Email (optionnel)"
                  type="email"
                  value={bookingData.clientEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="h-10"
                />
              </CardContent>
            </Card>

            <Button
              onClick={handleBookingSubmit}
              disabled={!bookingData.clientName || !bookingData.clientPhone}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold"
            >
              Payer {bookingData.totalPrice}€ avec Stripe
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Paiement 100% sécurisé • Annulation gratuite 24h avant
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}