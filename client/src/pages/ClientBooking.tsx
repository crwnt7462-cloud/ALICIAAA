import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, CreditCard, Check, ArrowLeft, Sparkles, Star, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const clientBookingSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"), 
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  notes: z.string().optional(),
});

type ClientBookingForm = z.infer<typeof clientBookingSchema>;

export default function ClientBooking() {
  const [location] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Extraire l'ID du salon depuis l'URL
  const salonId = location.split('/book/')[1] || 'demo-user';

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/public-services", salonId],
    queryFn: async () => {
      const response = await fetch(`/api/public-services/${salonId}`);
      if (!response.ok) throw new Error('Salon non trouvé');
      return response.json();
    },
  });

  // Récupérer les informations du business
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`/api/business-info/${salonId}`);
        if (response.ok) {
          const data = await response.json();
          setBusinessInfo(data);
        } else {
          throw new Error('Salon non trouvé');
        }
      } catch (error) {
        setBusinessInfo({
          name: "Salon de Beauté",
          address: "123 Rue Example",
          phone: "01 23 45 67 89",
          email: "contact@salon.fr",
          description: "Votre salon de beauté professionnel"
        });
      }
    };
    fetchBusinessInfo();
  }, [salonId]);

  const form = useForm<ClientBookingForm>({
    resolver: zodResolver(clientBookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  // Générer les créneaux disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const createBookingMutation = useMutation({
    mutationFn: async (data: ClientBookingForm) => {
      const depositAmount = calculateDeposit();
      
      const response = await fetch("/api/public-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salonId,
          serviceId: selectedService.id,
          appointmentDate: selectedDate,
          startTime: selectedTime,
          endTime: addMinutesToTime(selectedTime, selectedService.duration || 60),
          clientInfo: data,
          depositAmount
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setBookingResponse(data);
      setCurrentStep(4);
      toast({
        title: "Réservation confirmée !",
        description: "Votre rendez-vous a été créé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClientBookingForm) => {
    createBookingMutation.mutate(data);
  };

  const calculateDeposit = () => {
    if (!selectedService) return 0;
    return Math.round(selectedService.price * 0.3); // 30% d'acompte
  };

  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const simulatePayment = () => {
    // Simulation du paiement - en production, intégrer Stripe
    setTimeout(() => {
      setPaymentCompleted(true);
      toast({
        title: "Paiement réussi",
        description: `Acompte de ${calculateDeposit()}€ encaissé`,
      });
    }, 2000);
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4">
        <div className="max-w-md mx-auto space-y-6 pt-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Réservation confirmée !</h1>
            <p className="text-gray-600 text-sm">
              Votre rendez-vous a été enregistré. Vous recevrez un SMS de confirmation.
            </p>
          </div>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service</span>
                <span className="font-semibold">{selectedService?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="font-semibold">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Heure</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-gray-600">Acompte payé</span>
                <span className="font-bold text-green-600">{calculateDeposit()}€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reste à payer</span>
                <span className="font-semibold">{selectedService?.price - calculateDeposit()}€</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full gradient-bg text-white rounded-xl py-3"
            onClick={() => window.location.href = '/'}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : window.history.back()}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-gray-900">
              {businessInfo?.name || 'Salon de Beauté'}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                currentStep >= step 
                  ? 'gradient-bg text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-8 h-0.5 mx-1 transition-all ${
                  currentStep > step ? 'gradient-bg' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choisissez votre service</h2>
              <p className="text-sm text-gray-600">Sélectionnez le service souhaité</p>
            </div>

            <div className="space-y-3">
              {services.map((service: any) => (
                <Card 
                  key={service.id}
                  className={`border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer transition-all hover:scale-105 ${
                    selectedService?.id === service.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{service.duration}min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{service.price}€</p>
                        <p className="text-xs text-green-600">Acompte: {Math.round(service.price * 0.3)}€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full gradient-bg text-white rounded-xl py-3"
              disabled={!selectedService}
              onClick={() => setCurrentStep(2)}
            >
              Continuer
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Date et heure</h2>
              <p className="text-sm text-gray-600">Choisissez votre créneau</p>
            </div>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <Label className="text-sm font-medium">Créneaux disponibles</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            className={`text-xs ${selectedTime === time ? 'gradient-bg text-white' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full gradient-bg text-white rounded-xl py-3"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setCurrentStep(3)}
            >
              Continuer
            </Button>
          </div>
        )}

        {/* Step 3: Client Info & Payment */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Vos informations</h2>
              <p className="text-sm text-gray-600">Complétez votre réservation</p>
            </div>

            {/* Résumé */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{selectedService?.name}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(selectedDate).toLocaleDateString('fr-FR')} à {selectedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Acompte à régler</span>
                  <span className="text-purple-600">{calculateDeposit()}€</span>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-sm">Prénom</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm">Nom</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">Téléphone</Label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      {...form.register("notes")}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {!paymentCompleted ? (
                <Button 
                  type="button"
                  className="w-full gradient-bg text-white rounded-xl py-3"
                  onClick={simulatePayment}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer l'acompte ({calculateDeposit()}€)
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3"
                  disabled={createBookingMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {createBookingMutation.isPending ? 'Confirmation...' : 'Confirmer la réservation'}
                </Button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}