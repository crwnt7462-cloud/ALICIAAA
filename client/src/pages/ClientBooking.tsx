import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Clock, CreditCard, Check, ArrowLeft, User, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ClientBooking() {
  const [, params] = useRoute("/book/:userId");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
    depositAmount: 20
  });

  const { toast } = useToast();
  const userId = params?.userId;

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/public/services", userId],
    enabled: !!userId,
  });

  const { data: businessInfo } = useQuery({
    queryKey: ["/api/public/business", userId],
    enabled: !!userId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/public/booking", {
        ...data,
        userId: userId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setStep(4);
      toast({
        title: "Réservation confirmée !",
        description: "Vous recevrez un email de confirmation.",
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

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Skip Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  // Generate time slots (9h-18h30)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const selectedService = services.find(s => s.id.toString() === formData.serviceId);

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.email)) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !formData.serviceId) {
      toast({
        title: "Service requis",
        description: "Veuillez choisir un service.",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && (!formData.date || !formData.time)) {
      toast({
        title: "Date et heure requises",
        description: "Veuillez choisir une date et un créneau.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBooking = () => {
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
      status: "confirmed",
      notes: formData.notes
    });
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h1>
          <p className="text-gray-600">Ce lien de réservation n'est pas valide.</p>
        </div>
      </div>
    );
  }

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {businessInfo?.name || "Salon de beauté"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">Réservation en ligne</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              {num < 4 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    step > num ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Informations client */}
        {step === 1 && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre@email.com"
                  required
                />
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

              <Button onClick={handleNext} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Continuer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Choix du service */}
        {step === 2 && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Choisir un service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setFormData({...formData, serviceId: service.id.toString()})}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.serviceId === service.id.toString()
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-lg font-bold text-green-600">{service.price}€</span>
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} minutes
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Date et heure */}
        {step === 3 && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Date et heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Choisir une date</Label>
                <Select value={formData.date} onValueChange={(value) => setFormData({...formData, date: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une date" />
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
                <Label htmlFor="time">Choisir un créneau</Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un horaire" />
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

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Demandes particulières..."
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation et paiement */}
        {step === 4 && !createBookingMutation.isSuccess && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center">
                <Check className="w-5 h-5 mr-2 text-green-600" />
                Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Récapitulatif */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  
                  {selectedService && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée:</span>
                        <span className="font-medium">{selectedService.duration} min</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(formData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              {selectedService && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-3">Paiement</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix total:</span>
                      <span className="font-medium">{selectedService.price}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acompte (à payer maintenant):</span>
                      <span className="font-bold text-orange-700">{formData.depositAmount}€</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Reste à payer au salon:</span>
                      <span className="font-bold text-green-700">
                        {(parseFloat(selectedService.price) - formData.depositAmount).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <Button 
                  onClick={handleBooking}
                  disabled={createBookingMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {createBookingMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Confirmation...
                    </div>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmer et payer {formData.depositAmount}€
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {createBookingMutation.isSuccess && (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Réservation confirmée !
              </h2>
              <p className="text-gray-600 mb-4">
                Votre rendez-vous a été confirmé. Vous recevrez un email de confirmation avec tous les détails.
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">Votre rendez-vous</h3>
                <div className="space-y-1 text-sm text-green-700">
                  <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Heure:</strong> {formData.time}</p>
                  {selectedService && (
                    <p><strong>Service:</strong> {selectedService.name}</p>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Un email de confirmation a été envoyé à:</p>
                <p className="font-medium text-gray-900">{formData.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}