import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowLeft, ArrowRight,
  Star, MapPin, Scissors, Palette, Sparkles, CreditCard, Heart, Gift,
  Shield, Award, Users, ChevronRight, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export default function QuickBooking() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const salonInfo = {
    name: "Studio Élégance Paris",
    rating: 4.8,
    reviews: 247,
    address: "42 rue de Rivoli, Paris 1er",
    phone: "01 42 36 89 12",
    responseTime: "Répond en moins de 2h"
  };

  const services = [
    { 
      id: '1', 
      name: 'Coupe Femme', 
      description: 'Coupe personnalisée avec shampoing et brushing inclus',
      price: 65, 
      duration: 60, 
      popular: true,
      category: 'Coupe',
      icon: <Scissors className="w-5 h-5" />
    },
    { 
      id: '2', 
      name: 'Coloration Complète', 
      description: 'Coloration racines + longueurs avec soin protecteur',
      price: 95, 
      duration: 120, 
      popular: false,
      category: 'Coloration',
      icon: <Palette className="w-5 h-5" />
    },
    { 
      id: '3', 
      name: 'Balayage Premium', 
      description: 'Technique de mèches naturelles avec tonalisation',
      price: 140, 
      duration: 180, 
      popular: true,
      category: 'Coloration',
      icon: <Sparkles className="w-5 h-5" />
    },
    { 
      id: '4', 
      name: 'Soin Hydratant Intense', 
      description: 'Masque réparateur pour cheveux secs et abîmés',
      price: 35, 
      duration: 30, 
      popular: false,
      category: 'Soin',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/quick-booking', data),
    onSuccess: () => {
      setStep(4);
      toast({
        title: "Réservation confirmée !",
        description: "Vous recevrez une confirmation par email sous peu.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const selectedService = services.find(s => s.id === bookingData.serviceId);
    createBookingMutation.mutate({
      ...bookingData,
      serviceName: selectedService?.name,
      servicePrice: selectedService?.price,
      serviceDuration: selectedService?.duration,
    });
  };

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return bookingData.serviceId !== '';
      case 2:
        return bookingData.preferredDate !== '' && bookingData.preferredTime !== '';
      case 3:
        return bookingData.firstName !== '' && bookingData.lastName !== '' && 
               bookingData.email !== '' && bookingData.phone !== '';
      default:
        return false;
    }
  };

  const selectedService = services.find(s => s.id === bookingData.serviceId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Réservation Express
          </h1>
          <p className="text-gray-600 text-lg">Réservez votre rendez-vous en 3 étapes simples</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= stepNum 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all ${
                  step > stepNum ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">
              {step === 1 && "Choisissez votre service"}
              {step === 2 && "Sélectionnez votre créneau"}
              {step === 3 && "Vos informations"}
              {step === 4 && "Confirmation"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        bookingData.serviceId === service.id
                          ? 'ring-2 ring-purple-600 bg-purple-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setBookingData(prev => ({ ...prev, serviceId: service.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              {service.popular && (
                                <Badge className="bg-orange-500 text-white text-xs">Populaire</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {service.duration} min
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600">{service.price}€</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button
                  onClick={() => setStep(2)}
                  disabled={!isStepValid(1)}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-lg"
                >
                  Continuer
                </Button>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Date souhaitée</Label>
                  <Input
                    type="date"
                    value={bookingData.preferredDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-lg p-3"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Heure souhaitée</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={bookingData.preferredTime === time ? "default" : "outline"}
                        className={`p-3 ${
                          bookingData.preferredTime === time 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : ''
                        }`}
                        onClick={() => setBookingData(prev => ({ ...prev, preferredTime: time }))}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!isStepValid(2)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Customer Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom *</Label>
                    <Input
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-1"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label>Nom *</Label>
                    <Input
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-1"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Label>Téléphone *</Label>
                  <Input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <Label>Notes (optionnel)</Label>
                  <Input
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                    placeholder="Demandes spécifiques..."
                  />
                </div>

                {/* Summary */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Récapitulatif</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{bookingData.preferredDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heure:</span>
                        <span className="font-medium">{bookingData.preferredTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span className="font-medium">{selectedService?.duration} min</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-2">
                        <span className="font-semibold">Prix:</span>
                        <span className="font-bold text-purple-600">{selectedService?.price}€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid(3) || createBookingMutation.isPending}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3"
                  >
                    {createBookingMutation.isPending ? 'Confirmation...' : 'Confirmer la réservation'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Réservation confirmée !</h3>
                  <p className="text-gray-600">
                    Votre rendez-vous a été enregistré avec succès.
                  </p>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Détails de votre rendez-vous</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{bookingData.preferredDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heure:</span>
                        <span className="font-medium">{bookingData.preferredTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span className="font-medium">{bookingData.firstName} {bookingData.lastName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    📧 Un email de confirmation vous a été envoyé<br/>
                    📱 Vous recevrez un SMS de rappel 24h avant<br/>
                    ❌ Annulation gratuite jusqu'à 24h avant
                  </p>
                  
                  <Button
                    onClick={() => window.close()}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}