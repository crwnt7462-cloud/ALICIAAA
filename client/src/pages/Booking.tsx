import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, Phone, Mail, CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const [customConfig, setCustomConfig] = useState(null);

  // Charger la configuration personnalisée depuis le localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('bookingPageConfig');
    if (savedConfig) {
      try {
        setCustomConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.warn('Erreur lors du chargement de la configuration:', e);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    // Client info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Booking info
    serviceId: "",
    date: "",
    time: "",
    // Payment
    depositAmount: 20
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  // Generate today + next 30 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Generate time slots 9h-18h
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const selectedService = services.find(s => s.id.toString() === formData.serviceId);

  const handleStripePayment = async (appointmentData: any) => {
    try {
      const response = await fetch('/api/stripe/create-payment-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: appointmentData.depositAmount,
          description: `Acompte - ${appointmentData.serviceName}`,
          customerEmail: appointmentData.email,
          customerName: `${appointmentData.firstName} ${appointmentData.lastName}`,
          appointmentId: Date.now().toString(),
          salonName: "Salon Excellence Paris",
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Rediriger vers Stripe pour le paiement d'acompte
      const selectedService = services.find(s => s.id.toString() === formData.serviceId);
      handleStripePayment({
        ...formData,
        serviceName: selectedService?.name,
        depositAmount: formData.depositAmount,
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.serviceId || !formData.date || !formData.time) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id.toString() === formData.serviceId);
    if (!selectedService) return;

    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + selectedService.duration);
    const endTimeStr = endTime.toTimeString().slice(0, 5);

    createBookingMutation.mutate({
      serviceId: parseInt(formData.serviceId),
      appointmentDate: formData.date,
      startTime: formData.time,
      endTime: endTimeStr,
      clientName: `${formData.firstName} ${formData.lastName}`,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      totalPrice: selectedService.price,
      depositPaid: formData.depositAmount,
      status: "confirmed"
    });
  };

  // Styles personnalisés basés sur la configuration
  const getCustomStyles = () => {
    if (!customConfig) return {};
    
    return {
      background: customConfig.headerStyle === "gradient" 
        ? `linear-gradient(135deg, ${customConfig.primaryColor}, ${customConfig.secondaryColor})`
        : customConfig.backgroundColor,
      primaryColor: customConfig.primaryColor,
      secondaryColor: customConfig.secondaryColor,
      accentColor: customConfig.accentColor,
      textColor: customConfig.textColor
    };
  };

  const styles = getCustomStyles();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto p-3">
        {/* Header minimaliste */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-medium text-gray-900 mb-1">
            Réserver un rendez-vous
          </h1>
          <p className="text-xs text-gray-500">
            Simple et rapide
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Informations client */}
          <Card className="border-0 shadow-none bg-white rounded-xl">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    className="h-9 text-sm rounded-lg border-gray-200"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <Input
                    className="h-9 text-sm rounded-lg border-gray-200"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Nom"
                  />
                </div>
              </div>
              <Input
                className="h-9 text-sm rounded-lg border-gray-200"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
              />
              <Input
                className="h-9 text-sm rounded-lg border-gray-200"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Téléphone"
              />
            </CardContent>
          </Card>

          {/* Service */}
          <Card className="border-0 shadow-none bg-white rounded-xl">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Service
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Select 
                value={formData.serviceId} 
                onValueChange={(value) => setFormData({...formData, serviceId: value})}
              >
                <SelectTrigger className="h-9 text-sm rounded-lg border-gray-200">
                  <SelectValue placeholder="Choisir un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      <span className="text-sm">{service.name} - {service.price}€</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date et heure */}
          <Card className="border-0 shadow-none bg-white rounded-xl">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Date et heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Select 
                value={formData.date} 
                onValueChange={(value) => setFormData({...formData, date: value})}
              >
                <SelectTrigger className="h-9 text-sm rounded-lg border-gray-200">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().map((date) => {
                    const dateObj = new Date(date);
                    const formattedDate = dateObj.toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    });
                    return (
                      <SelectItem key={date} value={date}>
                        <span className="text-sm">{formattedDate}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData({...formData, time: value})}
              >
                <SelectTrigger className="h-9 text-sm rounded-lg border-gray-200">
                  <SelectValue placeholder="Heure" />
                </SelectTrigger>
                <SelectContent>
                  {getTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      <span className="text-sm">{time}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Acompte minimaliste */}
          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total: {selectedService.price}€</span>
                <span className="font-medium text-gray-900">Acompte: {formData.depositAmount}€</span>
              </div>
            </div>
          )}

          {/* Bouton épuré */}
          <Button 
            type="submit" 
            className="w-full h-10 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Traitement...
              </div>
            ) : (
              "Réserver maintenant"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Paiement sécurisé • Annulation 24h</p>
        </div>
      </div>
    </div>
  );
}