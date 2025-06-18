import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Star, ChevronRight, User, Phone, Mail, CreditCard, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [preSelectedClientId, setPreSelectedClientId] = useState<string | null>(null);

  // Vérifier les paramètres URL pour client pré-sélectionné
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const clientName = urlParams.get('clientName');
    
    if (clientId && clientName) {
      setPreSelectedClientId(clientId);
      const [firstName, lastName] = decodeURIComponent(clientName).split(' ');
      setClientInfo({
        firstName: firstName || '',
        lastName: lastName || '',
        email: '',
        phone: ''
      });
      setCurrentStep(2); // Passer directement à l'étape de sélection de service
    }
  }, []);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Generate time slots for booking
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const appointmentData = {
        ...data,
        clientId: preSelectedClientId ? parseInt(preSelectedClientId) : null,
      };
      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée !",
        description: "Votre rendez-vous a été enregistré avec succès.",
      });
      setCurrentStep(4);
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: () => {
      toast({
        title: "Erreur de réservation",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    createAppointmentMutation.mutate({
      serviceId: selectedService.id,
      appointmentDate: selectedDate,
      startTime: selectedTime,
      endTime: addMinutesToTime(selectedTime, selectedService.duration),
      clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      totalPrice: selectedService.price,
      status: "scheduled"
    });
  };

  const addMinutesToTime = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            {currentStep > step ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choisissez votre service
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sélectionnez le service qui vous intéresse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card 
            key={service.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedService?.id === service.id 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedService(service)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {service.duration}min
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                {service.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {service.description || "Service professionnel de beauté"}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {service.price}€
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">4.8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedService && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => setCurrentStep(2)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
          >
            Continuer
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choisissez votre créneau
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sélectionnez la date et l'heure qui vous conviennent
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Date Selection */}
            <div>
              <Label className="text-lg font-medium mb-4 block">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-12 text-lg"
              />
            </div>

            {/* Time Selection */}
            <div>
              <Label className="text-lg font-medium mb-4 block">Heure</Label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`h-12 ${
                      selectedTime === time
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Récapitulatif
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    {selectedService?.name} • {selectedDate} à {selectedTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedService?.price}€
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedService?.duration}min
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3"
        >
          Retour
        </Button>
        {selectedDate && selectedTime && (
          <Button 
            onClick={() => setCurrentStep(3)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
          >
            Continuer
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderClientInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Vos informations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {preSelectedClientId ? 'Client pré-sélectionné - Vérifiez les informations' : 'Complétez vos coordonnées pour finaliser la réservation'}
        </p>
        {preSelectedClientId && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">
              ✓ Client automatiquement sélectionné depuis la liste des clients
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Prénom
              </Label>
              <Input
                value={clientInfo.firstName}
                onChange={(e) => setClientInfo(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Votre prénom"
                className="h-12"
              />
            </div>

            <div>
              <Label className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Nom
              </Label>
              <Input
                value={clientInfo.lastName}
                onChange={(e) => setClientInfo(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Votre nom"
                className="h-12"
              />
            </div>

            <div>
              <Label className="flex items-center mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                type="email"
                value={clientInfo.email}
                onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="votre@email.com"
                className="h-12"
              />
            </div>

            <div>
              <Label className="flex items-center mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Téléphone
              </Label>
              <Input
                type="tel"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="06 12 34 56 78"
                className="h-12"
              />
            </div>
          </div>

          {/* Final Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              Récapitulatif de votre réservation
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date et heure</span>
                <span className="font-medium">{selectedDate} à {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Durée</span>
                <span className="font-medium">{selectedService?.duration}min</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">{selectedService?.price}€</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3"
        >
          Retour
        </Button>
        <Button 
          onClick={handleBooking}
          disabled={!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email || !clientInfo.phone || createAppointmentMutation.isPending}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {createAppointmentMutation.isPending ? "Confirmation..." : "Confirmer la réservation"}
          <CreditCard className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Réservation confirmée !
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Votre rendez-vous a été enregistré avec succès
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date</span>
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Heure</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Client</span>
              <span className="font-medium">{clientInfo.firstName} {clientInfo.lastName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => {
          setCurrentStep(1);
          setSelectedService(null);
          setSelectedDate("");
          setSelectedTime("");
          setClientInfo({ firstName: "", lastName: "", email: "", phone: "" });
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
      >
        Nouvelle réservation
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {renderStepIndicator()}
        
        {currentStep === 1 && renderServiceSelection()}
        {currentStep === 2 && renderDateTimeSelection()}
        {currentStep === 3 && renderClientInfo()}
        {currentStep === 4 && renderConfirmation()}
      </div>
    </div>
  );
}
