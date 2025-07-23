import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, 
  ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface BookingData {
  service?: Service;
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export default function BookingPageSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});

  const services: Service[] = [
    { id: "1", name: "Coupe & Brushing", duration: 60, price: 45, description: "Coupe personnalisée + brushing" },
    { id: "2", name: "Coloration", duration: 120, price: 80, description: "Coloration complète + soin" },
    { id: "3", name: "Soin Visage", duration: 75, price: 65, description: "Nettoyage + hydratation" },
    { id: "4", name: "Manucure", duration: 45, price: 35, description: "Soin des ongles + vernis" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleServiceSelect = (service: Service) => {
    setBookingData({ ...bookingData, service });
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData({ ...bookingData, date, time });
    setStep(3);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const finalBookingData = {
      ...bookingData,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      notes: formData.get('notes') as string,
    };

    setBookingData(finalBookingData);
    setStep(4);
  };

  const confirmBooking = () => {
    toast({
      title: "Rendez-vous confirmé",
      description: "Vous recevrez un email de confirmation sous peu.",
    });
    setLocation('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto bg-white shadow-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => step > 1 ? setStep(step - 1) : setLocation('/')}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-medium text-gray-900">Réservation</h1>
                <p className="text-sm text-gray-500">Étape {step}/4</p>
              </div>
              
              <div className="w-10" />
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    s <= step ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-6">
          {/* Étape 1: Choix du service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Choisissez votre service
                </h2>
                <p className="text-gray-600 text-sm">
                  Sélectionnez le service qui vous intéresse
                </p>
              </div>
              
              <div className="space-y-3">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className="cursor-pointer border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}min
                            </Badge>
                            <span className="font-medium text-purple-600">
                              {service.price}€
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Date et heure */}
          {step === 2 && bookingData.service && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Date et heure
                </h2>
                <p className="text-gray-600 text-sm">
                  {bookingData.service.name} - {bookingData.service.duration}min
                </p>
              </div>

              {/* Sélection de date */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Choisissez une date</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map((dateObj) => (
                    <Button
                      key={dateObj.date}
                      variant={bookingData.date === dateObj.date ? "default" : "outline"}
                      className="h-12 text-sm justify-center"
                      onClick={() => setBookingData({ ...bookingData, date: dateObj.date })}
                    >
                      {dateObj.display}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sélection d'heure */}
              {bookingData.date && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Choisissez une heure</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={bookingData.time === time ? "default" : "outline"}
                        className="h-10 text-sm"
                        onClick={() => handleDateTimeSelect(bookingData.date!, time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Informations personnelles */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Vos informations
                </h2>
                <p className="text-gray-600 text-sm">
                  Complétez vos coordonnées
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      required 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      required 
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    required 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    rows={3}
                    className="mt-1 resize-none"
                    placeholder="Demandes particulières..."
                  />
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Continuer
                </Button>
              </form>
            </div>
          )}

          {/* Étape 4: Confirmation */}
          {step === 4 && bookingData.service && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Récapitulatif
                </h2>
                <p className="text-gray-600 text-sm">
                  Vérifiez les détails de votre rendez-vous
                </p>
              </div>

              <Card className="border-gray-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {bookingData.firstName} {bookingData.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{bookingData.email}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Service</h3>
                    <p className="text-gray-700">{bookingData.service.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {bookingData.service.duration}min
                      </span>
                      <span className="font-medium text-purple-600">
                        {bookingData.service.price}€
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Date et heure</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(bookingData.date!).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric', 
                          month: 'long'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {bookingData.time}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={confirmBooking}
                className="w-full bg-purple-600 hover:bg-purple-700 h-12"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmer le rendez-vous
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}