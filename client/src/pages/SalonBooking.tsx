import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft, Clock, MapPin, Star, Calendar, 
  CheckCircle2, User, Mail, Phone, MessageSquare
} from "lucide-react";

export default function SalonBooking() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer l'ID du salon depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const salonId = urlParams.get('salon') || 'salon-excellence';

  // Données du salon
  const salon = {
    id: salonId,
    name: "Salon Excellence Paris",
    location: "Paris 16ème",
    rating: 4.9,
    reviews: 324,
    address: "42 rue de Rivoli, 75001 Paris",
    verified: true
  };

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ['/api/services'],
  });

  // Créneaux disponibles (simulés)
  const availableSlots = [
    { date: '2024-01-27', time: '09:00', available: true },
    { date: '2024-01-27', time: '10:30', available: true },
    { date: '2024-01-27', time: '14:00', available: true },
    { date: '2024-01-27', time: '15:30', available: false },
    { date: '2024-01-27', time: '17:00', available: true },
    { date: '2024-01-28', time: '09:00', available: true },
    { date: '2024-01-28', time: '11:00', available: true },
    { date: '2024-01-28', time: '14:30', available: true },
    { date: '2024-01-28', time: '16:00', available: true },
  ];

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Réservation confirmée !',
        description: 'Votre rendez-vous a été enregistré avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setCurrentStep(4); // Étape de confirmation
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la réservation.',
        variant: 'destructive',
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

  const handleBookingSubmit = () => {
    const bookingData = {
      serviceId: selectedService.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      clientInfo: formData,
      totalPrice: selectedService.price,
      deposit: Math.round(selectedService.price * 0.3),
    };

    bookingMutation.mutate(bookingData);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.replace(':', 'h');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choisissez votre service";
      case 2: return "Sélectionnez un créneau";
      case 3: return "Vos informations";
      case 4: return "Réservation confirmée";
      default: return "Réservation";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full hover:bg-violet-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {getStepTitle()}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></div>
                  <span className="font-medium">{salon.name}</span>
                </div>
                {salon.verified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs">Vérifié</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step === currentStep
                      ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20'
                      : step < currentStep
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 h-1 mx-1 rounded-full transition-all ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Étape 1: Sélection du service */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {services.map((service) => (
              <Card 
                key={service.id}
                className="border border-black shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:border-violet-500 hover:shadow-violet-500/20 group"
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-violet-700 transition-colors mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-violet-50 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-violet-600" />
                          <span className="text-sm font-medium text-violet-700">
                            {service.duration} min
                          </span>
                        </div>
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {service.price}€
                      </div>
                      <div className="text-xs text-gray-500">
                        Acompte: {Math.round(service.price * 0.3)}€
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Étape 2: Sélection du créneau */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Service sélectionné */}
            <Card className="border border-gray-200 bg-violet-50/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedService?.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedService?.duration} min</span>
                  <span>{selectedService?.price}€</span>
                </div>
              </CardContent>
            </Card>

            {/* Créneaux disponibles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Créneaux disponibles</h3>
              
              {Object.entries(
                availableSlots
                  .filter(slot => slot.available)
                  .reduce((groups: any, slot) => {
                    if (!groups[slot.date]) groups[slot.date] = [];
                    groups[slot.date].push(slot);
                    return groups;
                  }, {})
              ).map(([date, slots]: [string, any]) => (
                <Card key={date} className="border border-black shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-violet-600" />
                      {formatDate(date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot: any) => (
                        <Button
                          key={`${slot.date}-${slot.time}`}
                          variant="outline"
                          onClick={() => handleSlotSelect(slot)}
                          className="border-violet-300 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all"
                        >
                          {formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3: Informations client */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Récapitulatif */}
            <Card className="border border-gray-200 bg-gradient-to-r from-violet-50 to-amber-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Récapitulatif</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{formatDate(selectedSlot?.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heure:</span>
                    <span className="font-medium">{formatTime(selectedSlot?.time)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span className="font-bold text-lg">{selectedService?.price}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire */}
            <Card className="border border-black shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-600" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Notes (optionnel)
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Commentaires, demandes spéciales..."
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleBookingSubmit}
                  disabled={bookingMutation.isPending || !formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {bookingMutation.isPending ? 'Réservation en cours...' : 'Confirmer la réservation'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center">
            <Card className="border border-green-500 shadow-lg shadow-green-500/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Réservation confirmée !
                </h2>
                <p className="text-gray-600 mb-6">
                  Votre rendez-vous a été enregistré avec succès. Vous recevrez une confirmation par email.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-3">Détails de votre rendez-vous</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{formatDate(selectedSlot?.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heure:</span>
                      <span className="font-medium">{formatTime(selectedSlot?.time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salon:</span>
                      <span className="font-medium">{salon.name}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span className="font-bold text-lg">{selectedService?.price}€</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation('/')}
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
                >
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}