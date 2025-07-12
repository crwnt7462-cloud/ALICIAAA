import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Clock, Check, ArrowLeft, Sparkles, Star, Euro, User, Phone, Mail, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ClientBooking() {
  const [location] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [isBooked, setIsBooked] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const { toast } = useToast();
  
  const salonId = location.split('/book/')[1] || 'demo-user';

  // Récupérer les services
  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/public-services", salonId],
    queryFn: async () => {
      const response = await fetch(`/api/public-services/${salonId}`);
      if (!response.ok) throw new Error('Salon non trouvé');
      return response.json();
    },
  });

  // Récupérer les créneaux disponibles
  const { data: availableSlots = [] } = useQuery<any[]>({
    queryKey: ["/api/available-slots", salonId, selectedService?.id],
    queryFn: async () => {
      if (!selectedService) return [];
      const response = await fetch(`/api/available-slots/${salonId}/${selectedService.id}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!selectedService
  });

  // Récupérer les informations du business
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`/api/business-info/${salonId}`);
        if (response.ok) {
          const data = await response.json();
          setBusinessInfo(data);
        }
      } catch (error) {
        setBusinessInfo({
          name: "Salon de Beauté",
          address: "123 Rue Example",
          phone: "01 23 45 67 89",
          rating: 4.8,
          reviewCount: 150
        });
      }
    };
    fetchBusinessInfo();
  }, [salonId]);

  // Générer les créneaux pour les 7 prochains jours
  const generateQuickSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      
      const dayName = d === 0 ? "Aujourd'hui" : 
                     d === 1 ? "Demain" :
                     date.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      const times = ["09:00", "10:30", "14:00", "15:30", "17:00"];
      
      times.forEach(time => {
        slots.push({
          date: date.toISOString().split('T')[0],
          time: time,
          display: `${dayName} ${time}`,
          available: Math.random() > 0.3 // Simulation disponibilité
        });
      });
    }
    
    return slots.filter(slot => slot.available).slice(0, 8);
  };

  const quickSlots = generateQuickSlots();

  // Mutation pour créer le rendez-vous
  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/public-booking", data);
    },
    onSuccess: () => {
      setIsBooked(true);
      toast({
        title: "Rendez-vous confirmé !",
        description: "Vous recevrez un email de confirmation",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de réserver ce créneau",
        variant: "destructive",
      });
    },
  });

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handleBooking = () => {
    if (!clientInfo.firstName || !clientInfo.email || !clientInfo.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    createBookingMutation.mutate({
      salonId,
      serviceId: selectedService.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      clientInfo
    });
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Rendez-vous confirmé !</h1>
            <p className="text-gray-600 mb-6">
              {selectedService?.name} • {selectedSlot?.display}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Détails de votre rendez-vous</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Service :</strong> {selectedService?.name}</p>
                <p><strong>Date :</strong> {selectedSlot?.display}</p>
                <p><strong>Durée :</strong> {selectedService?.duration}min</p>
                <p><strong>Prix :</strong> {selectedService?.price}€</p>
                <p><strong>Salon :</strong> {businessInfo?.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Un email de confirmation a été envoyé à {clientInfo.email}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header Business */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            {currentStep > 1 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-gray-900">{businessInfo?.name}</h1>
              {businessInfo?.rating && (
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{businessInfo.rating}</span>
                  <span className="text-gray-500">({businessInfo.reviewCount})</span>
                </div>
              )}
            </div>
            <div className="w-8" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Service</span>
            <span>Créneau</span>
            <span>Infos</span>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">

          {/* Étape 1: Sélection du service */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Choisissez votre prestation</h2>
                <p className="text-gray-600 text-sm">Sélectionnez le service souhaité</p>
              </div>

              <div className="space-y-3">
                {services.map((service) => (
                  <Card 
                    key={service.id}
                    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}min
                            </div>
                            <div className="flex items-center font-semibold text-violet-600">
                              <Euro className="w-3 h-3 mr-1" />
                              {service.price}€
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Sélection du créneau */}
          {currentStep === 2 && selectedService && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Choisissez votre créneau</h2>
                <p className="text-gray-600 text-sm">
                  {selectedService.name} • {selectedService.duration}min • {selectedService.price}€
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quickSlots.map((slot, index) => (
                  <Card 
                    key={index}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {slot.display.split(' ')[0]}
                      </div>
                      <div className="text-lg font-bold text-violet-600">
                        {slot.display.split(' ')[1]}
                      </div>
                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                        Disponible
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 shadow-md bg-violet-50/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm text-violet-700 font-medium">
                    Réservation instantanée • Sans attente
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Étape 3: Informations client */}
          {currentStep === 3 && selectedSlot && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Vos informations</h2>
                <p className="text-gray-600 text-sm">
                  {selectedService.name} • {selectedSlot.display}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="Prénom"
                      value={clientInfo.firstName}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="border-0 bg-white/80 backdrop-blur-sm shadow-md"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Nom"
                      value={clientInfo.lastName}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="border-0 bg-white/80 backdrop-blur-sm shadow-md"
                    />
                  </div>
                </div>

                <Input
                  type="email"
                  placeholder="Email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="border-0 bg-white/80 backdrop-blur-sm shadow-md"
                />

                <Input
                  type="tel"
                  placeholder="Téléphone"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-0 bg-white/80 backdrop-blur-sm shadow-md"
                />

                <Card className="border-0 shadow-md bg-gray-50/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Heure</span>
                        <span className="font-medium">{selectedSlot.display}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée</span>
                        <span className="font-medium">{selectedService.duration}min</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-violet-600">{selectedService.price}€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleBooking}
                  disabled={createBookingMutation.isPending}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg"
                >
                  {createBookingMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Réservation...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Confirmer mon rendez-vous
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  En réservant, vous acceptez nos conditions d'utilisation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}