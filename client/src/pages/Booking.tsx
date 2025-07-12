import { useState } from "react";
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

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée !",
        description: "Votre rendez-vous a été créé avec succès.",
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        serviceId: "",
        date: "",
        time: "",
        depositAmount: 20
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
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

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h1>
          <p className="text-gray-600 text-sm mt-1">Rapide et simple</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations client */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Choix du service */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Service souhaité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.serviceId} 
                onValueChange={(value) => setFormData({...formData, serviceId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      <div className="flex justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {service.duration}min • {service.price}€
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Durée: {selectedService.duration} minutes</span>
                    <span className="font-semibold text-green-700">Prix: {selectedService.price}€</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date et heure */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Date et heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Select 
                  value={formData.date} 
                  onValueChange={(value) => setFormData({...formData, date: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time">Heure *</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({...formData, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un créneau" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTimeSlots().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Acompte */}
          {selectedService && (
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                  Acompte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700">Prix total: {selectedService.price}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Acompte à régler:</span>
                    <span className="text-xl font-bold text-orange-600">{formData.depositAmount}€</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Reste à payer sur place: {selectedService.price - formData.depositAmount}€
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de réservation */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Réservation...
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Réserver maintenant
                {selectedService && ` (${formData.depositAmount}€)`}
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Paiement sécurisé • Confirmation immédiate</p>
        </div>
      </div>
    </div>
  );
}