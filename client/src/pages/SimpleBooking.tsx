import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Clock, Euro, User, Phone, Mail, CreditCard,
  CheckCircle, Star, MapPin, Calendar as CalendarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SimpleBooking() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const salon = {
    name: "Salon Excellence",
    address: "42 rue de Rivoli, Paris 1er",
    rating: 4.8,
    reviews: 324
  };

  const services = [
    { id: "1", name: "Coupe Femme", duration: 45, price: 55 },
    { id: "2", name: "Coupe Homme", duration: 30, price: 35 },
    { id: "3", name: "Coloration", duration: 120, price: 85 },
    { id: "4", name: "Balayage", duration: 180, price: 120 },
    { id: "5", name: "Brushing", duration: 30, price: 25 }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = () => {
    toast({
      title: "Réservation confirmée !",
      description: "Vous recevrez une confirmation par email dans quelques instants.",
    });
    
    // Redirection vers page de paiement après 1 seconde
    setTimeout(() => {
      setLocation('/booking/payment');
    }, 1000);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1: return selectedService !== "";
      case 2: return selectedDate !== "" && selectedTime !== "";
      case 3: return clientInfo.firstName && clientInfo.lastName && clientInfo.email && clientInfo.phone;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{salon.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{salon.address}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{salon.rating} ({salon.reviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num === step ? 'bg-violet-600 text-white' :
                  num < step ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {num < step ? <CheckCircle className="w-4 h-4" /> : num}
                </div>
                {num < 4 && <div className={`w-8 h-0.5 ${
                  num < step ? 'bg-green-500' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">
              {step === 1 && "Choisissez votre service"}
              {step === 2 && "Sélectionnez un créneau"}
              {step === 3 && "Vos informations"}
              {step === 4 && "Confirmation"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Étape 1: Services */}
        {step === 1 && (
          <div className="space-y-3">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedService === service.id ? 'ring-2 ring-violet-500 bg-violet-50' : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.duration} min
                        </div>
                        <div className="flex items-center">
                          <Euro className="w-3 h-3 mr-1" />
                          {service.price}€
                        </div>
                      </div>
                    </div>
                    {selectedService === service.id && (
                      <CheckCircle className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Étape 2: Date et heure */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Date</Label>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {getAvailableDates().map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    className={`p-3 h-auto ${
                      selectedDate === date.value ? 'bg-violet-600 hover:bg-violet-700' : ''
                    }`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="text-base font-medium">Heure</Label>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`p-2 ${
                        selectedTime === time ? 'bg-violet-600 hover:bg-violet-700' : ''
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom *</Label>
                <Input
                  value={clientInfo.firstName}
                  onChange={(e) => setClientInfo({...clientInfo, firstName: e.target.value})}
                  placeholder="Votre prénom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Nom *</Label>
                <Input
                  value={clientInfo.lastName}
                  onChange={(e) => setClientInfo({...clientInfo, lastName: e.target.value})}
                  placeholder="Votre nom"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={clientInfo.email}
                onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                placeholder="votre@email.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Téléphone *</Label>
              <Input
                type="tel"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                placeholder="06 12 34 56 78"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {getAvailableDates().find(d => d.value === selectedDate)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-medium">{selectedServiceData?.duration} min</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{selectedServiceData?.price}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Politique d'annulation :</strong> Annulation gratuite jusqu'à 24h avant le rendez-vous.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex space-x-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Retour
            </Button>
          )}
          
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              Continuer
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Confirmer et payer
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
}