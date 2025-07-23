import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Calendar, Clock, MapPin, Star, 
  CreditCard, Check, User, Phone, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
}

export default function BookingPageSimple() {
  const [, setLocation] = useLocation();
  const { salonId } = useParams();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: "",
    date: "",
    time: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: ""
  });

  // Services disponibles
  const services: Service[] = [
    {
      id: "coupe-brushing",
      name: "Coupe + Brushing",
      duration: 60,
      price: 65,
      description: "Coupe personnalisée et brushing professionnel"
    },
    {
      id: "couleur",
      name: "Coloration",
      duration: 120,
      price: 85,
      description: "Coloration complète avec soins"
    },
    {
      id: "meches",
      name: "Mèches",
      duration: 150,
      price: 120,
      description: "Mèches et balayage expert"
    },
    {
      id: "soin",
      name: "Soin Capillaire",
      duration: 45,
      price: 35,
      description: "Soin hydratant et réparateur"
    }
  ];

  // Créneaux horaires
  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true }
  ];

  // Génération des dates disponibles (7 prochains jours)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingData) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée",
        description: "Votre rendez-vous a été enregistré avec succès.",
      });
      setCurrentStep(4);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation.",
        variant: "destructive",
      });
    }
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingData(prev => ({ ...prev, serviceId: service.id }));
    setCurrentStep(2);
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setBookingData(prev => ({ 
        ...prev, 
        date: selectedDate, 
        time: selectedTime 
      }));
      setCurrentStep(3);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.clientName || !bookingData.clientEmail || !bookingData.clientPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate(bookingData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Choisissez votre prestation
              </h2>
              <p className="text-sm text-gray-600">
                Sélectionnez le service qui vous intéresse
              </p>
            </div>
            
            {services.map((service) => (
              <Card 
                key={service.id}
                className="border-0 shadow-sm bg-white/60 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-all"
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-purple-600">
                        {service.price}€
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Choisissez votre créneau
              </h2>
              <p className="text-sm text-gray-600">
                {selectedService?.name} - {selectedService?.duration} min
              </p>
            </div>

            {/* Sélection de la date */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Date
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    size="sm"
                    className={`h-12 text-sm ${
                      selectedDate === date.value 
                        ? "bg-purple-600 text-white" 
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80"
                    }`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sélection de l'heure */}
            {selectedDate && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Heure
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      className={`h-10 text-sm ${
                        selectedTime === slot.time 
                          ? "bg-purple-600 text-white" 
                          : slot.available 
                            ? "bg-white/60 backdrop-blur-sm hover:bg-white/80" 
                            : "opacity-50"
                      }`}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <Button 
                onClick={handleDateTimeSelect}
                className="w-full gradient-bg text-white rounded-xl h-12"
              >
                Confirmer le créneau
              </Button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Vos informations
              </h2>
              <p className="text-sm text-gray-600">
                Complétez vos coordonnées pour finaliser
              </p>
            </div>

            {/* Récapitulatif */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{selectedService?.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric', 
                        month: 'long'
                      })} à {selectedTime}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    {selectedService?.price}€
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Nom complet *
                </Label>
                <Input
                  id="clientName"
                  value={bookingData.clientName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="mt-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div>
                <Label htmlFor="clientEmail" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={bookingData.clientEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="mt-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="clientPhone" className="text-sm font-medium text-gray-700">
                  Téléphone *
                </Label>
                <Input
                  id="clientPhone"
                  value={bookingData.clientPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="mt-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 bg-white/60 backdrop-blur-sm border-gray-200/50"
                  placeholder="Demandes particulières..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit"
                disabled={bookingMutation.isPending}
                className="w-full gradient-bg text-white rounded-xl h-12 font-medium"
              >
                {bookingMutation.isPending ? "Réservation en cours..." : "Confirmer la réservation"}
              </Button>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Réservation confirmée !
              </h2>
              <p className="text-gray-600">
                Vous recevrez un email de confirmation sous peu.
              </p>
            </div>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service :</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix :</span>
                    <span className="font-medium text-purple-600">{selectedService?.price}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={() => setLocation('/')}
                className="w-full gradient-bg text-white rounded-xl h-12"
              >
                Retour à l'accueil
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/client/login')}
                className="w-full bg-white/60 backdrop-blur-sm border-gray-200/50"
              >
                Gérer mes rendez-vous
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setLocation('/')}
              className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-medium text-gray-900">
                Réservation
              </h1>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 w-6 rounded-full ${
                      step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-sm mx-auto px-6 py-6">
        {renderStep()}
      </div>
    </div>
  );
}