import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  CheckCircle,
  Star,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const { toast } = useToast();

  const salon = {
    id: "demo-user",
    name: "Salon Excellence",
    location: "Paris 16ème",
    rating: 4.9,
    reviews: 324
  };

  const services = [
    { id: "coupe", name: "Coupe femme", price: 45, duration: 60 },
    { id: "coloration", name: "Coloration", price: 80, duration: 120 },
    { id: "brushing", name: "Brushing", price: 25, duration: 30 },
    { id: "soin", name: "Soin capillaire", price: 35, duration: 45 }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerInfo.firstName || !customerInfo.email) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Réservation confirmée !",
      description: `Votre rendez-vous a été confirmé pour le ${selectedDate.toLocaleDateString()} à ${selectedTime}`,
    });

    setTimeout(() => {
      setLocation("/");
    }, 2000);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Réserver un rendez-vous</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{salon.name} - {salon.location}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{salon.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-8 h-1 ${
                    step < currentStep ? 'bg-violet-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Étape 1: Service */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Choisir un service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.id 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.duration} min</div>
                    </div>
                    <div className="text-lg font-semibold">{service.price}€</div>
                  </div>
                </div>
              ))}
              
              {selectedService && (
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-4 bg-violet-500 hover:bg-violet-600"
                >
                  Continuer
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Date */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Choisir une date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                {selectedDate && (
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    Continuer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Heure */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Choisir un créneau
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  Retour
                </Button>
                {selectedTime && (
                  <Button 
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    Continuer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Informations client */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Prénom *</Label>
                  <Input
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    placeholder="Dupont"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="jean.dupont@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="06 12 34 56 78"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Notes (optionnel)</Label>
                <Textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  placeholder="Précisions particulières..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                >
                  Retour
                </Button>
                {customerInfo.firstName && customerInfo.email && (
                  <Button 
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    Continuer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 5: Acompte et paiement */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                Acompte et confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-violet-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-violet-600" />
                  <span className="font-medium text-violet-800">Acompte requis</span>
                </div>
                <p className="text-sm text-violet-700">
                  Un acompte de 30% est requis pour confirmer votre réservation
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heure:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span className="font-medium">{selectedServiceData?.duration} min</span>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Total service:</span>
                  <span className="font-medium">{selectedServiceData?.price}€</span>
                </div>
                <div className="flex justify-between text-violet-600 font-semibold">
                  <span>Acompte à payer:</span>
                  <span>{selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0}€</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Solde à régler sur place:</span>
                  <span>{selectedServiceData ? selectedServiceData.price - Math.round(selectedServiceData.price * 0.3) : 0}€</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-800">Moyens de paiement acceptés</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-white px-2 py-1 rounded border">💳 Carte bancaire</span>
                  <span className="bg-white px-2 py-1 rounded border">📱 Apple Pay</span>
                  <span className="bg-white px-2 py-1 rounded border">🔐 PayPal</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(4)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button 
                  onClick={handleBooking}
                  className="flex-1 bg-violet-500 hover:bg-violet-600"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0}€
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Paiement sécurisé • Annulation gratuite jusqu'à 24h avant
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}