import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Star, Phone, User, Check, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });

  const salon = {
    name: "Studio Belle Vue",
    address: "123 Rue de la Beauté, Paris 15e",
    rating: 4.8,
    phone: "+33 1 23 45 67 89"
  };

  const services = [
    { id: "1", name: "Coupe + Brushing", duration: "1h", price: 45, description: "Coupe personnalisée et brushing professionnel" },
    { id: "2", name: "Coloration", duration: "2h", price: 85, description: "Coloration complète avec soins" },
    { id: "3", name: "Soin du visage", duration: "1h30", price: 65, description: "Nettoyage et hydratation en profondeur" },
    { id: "4", name: "Manucure", duration: "45min", price: 35, description: "Soin complet des ongles et vernis" }
  ];

  const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const steps = [
    { number: 1, title: "Service", completed: !!selectedService },
    { number: 2, title: "Date & Heure", completed: !!selectedDate && !!selectedTime },
    { number: 3, title: "Informations", completed: customerInfo.name && customerInfo.phone }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/");
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Réservation confirmée !",
      description: `Votre rendez-vous le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime} est confirmé.`
    });

    setTimeout(() => {
      setLocation("/");
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedService;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return customerInfo.name && customerInfo.phone;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo Rendly */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-black tracking-wide" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
                Rendly
              </h1>
            </div>
            
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.number 
                    ? 'bg-violet-600 text-white' 
                    : step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed && currentStep !== step.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.number ? 'text-violet-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Salon Info - toujours visible */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-violet-600">SB</span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{salon.name}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="h-3 w-3" />
                  {salon.address}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{salon.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">{salon.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choisir un service</CardTitle>
              <p className="text-sm text-gray-600">Sélectionnez le service désiré</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService === service.id 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-base">{service.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-violet-600">{service.price}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Choisir une date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Choisir un horaire
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={`text-sm h-10 ${
                          selectedTime === time 
                            ? 'bg-violet-600 hover:bg-violet-700' 
                            : 'hover:bg-gray-50'
                        }`}
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

        {/* Step 3: Customer Information */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Vos informations
              </CardTitle>
              <p className="text-sm text-gray-600">Les champs avec * sont obligatoires</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="Votre nom et prénom"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="06 12 34 56 78"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="votre@email.com"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  placeholder="Demandes particulières ou informations complémentaires..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Booking Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {services.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Prix total:</span>
                    <span className="font-semibold text-lg text-violet-600">
                      {services.find(s => s.id === selectedService)?.price}€
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto px-4 py-4">
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:bg-gray-300"
              >
                Continuer
              </Button>
            ) : (
              <Button 
                onClick={handleBooking}
                disabled={!canProceed()}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:bg-gray-300"
              >
                Confirmer la réservation
              </Button>
            )}
          </div>
        </div>

        {/* Spacer for fixed bottom nav */}
        <div className="h-20" />
      </div>
    </div>
  );
}