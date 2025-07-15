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
        {/* Étape 1: Service */}
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
          </CardContent>
        </Card>

        {/* Étape 2: Date */}
        {selectedService && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Choisir une date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Heure */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Choisir un créneau
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Informations client */}
        {selectedTime && (
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
            </CardContent>
          </Card>
        )}

        {/* Résumé et confirmation */}
        {selectedTime && customerInfo.firstName && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé de votre réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{selectedServiceData?.price}€</span>
              </div>
              
              <Button 
                onClick={handleBooking}
                className="w-full mt-4 bg-violet-500 hover:bg-violet-600"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmer la réservation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}