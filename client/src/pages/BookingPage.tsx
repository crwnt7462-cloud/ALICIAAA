import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Clock, 
  Euro, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  CheckCircle,
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  Shield,
  Users,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
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

  const professionals = [
    { 
      id: "sophie", 
      name: "Sophie Martin", 
      specialties: ["Coupe", "Couleur"], 
      avatar: "👩🏼‍🦱", 
      experience: "8 ans",
      rating: 4.9,
      reviews: 127,
      badge: "Expert"
    },
    { 
      id: "julie", 
      name: "Julie Dubois", 
      specialties: ["Balayage", "Soins"], 
      avatar: "👩🏻‍🦰", 
      experience: "5 ans",
      rating: 4.8,
      reviews: 89,
      badge: "Pro"
    },
    { 
      id: "marie", 
      name: "Marie Leroy", 
      specialties: ["Coupe", "Brushing"], 
      avatar: "👩🏽‍🦱", 
      experience: "12 ans",
      rating: 5.0,
      reviews: 203,
      badge: "Master"
    },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerInfo.firstName || !customerInfo.email || !selectedProfessional || !customerInfo.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const appointmentData = {
        clientFirstName: customerInfo.firstName,
        clientLastName: customerInfo.lastName,
        clientEmail: customerInfo.email,
        clientPhone: customerInfo.phone,
        serviceId: selectedService,
        professionalId: selectedProfessional,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        startTime: selectedTime,
        notes: customerInfo.notes,
        depositAmount: Math.round(selectedServiceData!.price * 0.3),
        totalAmount: selectedServiceData!.price
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      const result = await response.json();

      toast({
        title: "Réservation confirmée !",
        description: `Votre rendez-vous a été confirmé pour le ${selectedDate.toLocaleDateString()} à ${selectedTime}. Un email de confirmation vous a été envoyé.`,
      });

      setTimeout(() => {
        setLocation("/");
      }, 3000);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate slot availability check
  const checkAvailability = (date: Date, professionalId: string) => {
    const baseSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];
    
    // Simulate some taken slots
    const takenSlots = Math.random() > 0.7 ? ["10:00", "14:30", "16:00"] : ["11:30", "15:00"];
    return baseSlots.filter(slot => !takenSlots.includes(slot));
  };

  // Update available slots when date or professional changes
  const updateAvailableSlots = () => {
    if (selectedDate && selectedProfessional) {
      const slots = checkAvailability(selectedDate, selectedProfessional);
      setAvailableSlots(slots);
      if (!slots.includes(selectedTime)) {
        setSelectedTime("");
      }
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/search")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">{salon.name}</h1>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{salon.location}</span>
              <div className="flex items-center gap-1 ml-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{salon.rating}</span>
                <span className="text-gray-400">({salon.reviews})</span>
              </div>
            </div>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 ${
                    step < currentStep ? 'bg-violet-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Titres des étapes */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentStep === 1 && "Service & Professionnel"}
            {currentStep === 2 && "Date & Créneau"}
            {currentStep === 3 && "Informations & Paiement"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentStep === 1 && "Choisissez votre service et votre professionnel"}
            {currentStep === 2 && "Sélectionnez votre date et heure"}
            {currentStep === 3 && "Finalisez votre réservation"}
          </p>
        </div>

        {/* Étape 1: Service & Professionnel */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choisir un service</CardTitle>
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

            {/* Professionnels */}
            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choisir votre professionnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {professionals.map((pro) => (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedProfessional(pro.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProfessional === pro.id 
                          ? 'border-violet-500 bg-violet-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="text-3xl">{pro.avatar}</div>
                          <div className={`absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded-full text-white ${
                            pro.badge === 'Master' ? 'bg-amber-500' : 
                            pro.badge === 'Expert' ? 'bg-violet-500' : 'bg-blue-500'
                          }`}>
                            {pro.badge}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{pro.name}</div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{pro.rating}</span>
                              <span className="text-xs text-gray-400">({pro.reviews})</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {pro.experience} d'expérience
                          </div>
                          <div className="text-xs text-violet-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {pro.specialties.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {selectedService && selectedProfessional && (
              <Button 
                onClick={() => setCurrentStep(2)}
                className="w-full bg-violet-500 hover:bg-violet-600"
                size="lg"
              >
                Continuer
              </Button>
            )}
          </div>
        )}

        {/* Étape 2: Date & Créneau */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choisir une date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime("");
                    if (date && selectedProfessional) {
                      const slots = checkAvailability(date, selectedProfessional);
                      setAvailableSlots(slots);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Créneaux */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choisir un créneau</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {(availableSlots.length > 0 ? availableSlots : timeSlots).map((time) => {
                      const isAvailable = availableSlots.length === 0 || availableSlots.includes(time);
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => isAvailable && setSelectedTime(time)}
                          disabled={!isAvailable}
                          className={`text-sm ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {time}
                          {!isAvailable && <span className="ml-1 text-xs">❌</span>}
                        </Button>
                      );
                    })}
                  </div>
                  {availableSlots.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      ✅ {availableSlots.length} créneaux disponibles pour {professionals.find(p => p.id === selectedProfessional)?.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                Retour
              </Button>
              {selectedDate && selectedTime && (
                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-violet-500 hover:bg-violet-600"
                >
                  Continuer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Étape 3: Informations & Paiement */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vos informations</CardTitle>
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
                  <Label>Téléphone *</Label>
                  <Input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (optionnel)</Label>
                  <Input
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    placeholder="Allergies, préférences..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Résumé et paiement */}
            {customerInfo.firstName && customerInfo.email && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé & Acompte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-violet-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-violet-600" />
                      <span className="font-medium text-violet-800">Acompte requis</span>
                    </div>
                    <p className="text-sm text-violet-700">
                      Un acompte de 30% est requis pour confirmer votre réservation
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professionnel:</span>
                      <span className="font-medium">{professionals.find(p => p.id === selectedProfessional)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heure:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Total service:</span>
                      <span className="font-medium">{selectedServiceData?.price}€</span>
                    </div>
                    <div className="flex justify-between text-violet-600 font-semibold">
                      <span>Acompte à payer:</span>
                      <span>{selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0}€</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Solde sur place:</span>
                      <span>{selectedServiceData ? selectedServiceData.price - Math.round(selectedServiceData.price * 0.3) : 0}€</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-violet-600" />
                      <span className="font-medium text-violet-800">Paiement sécurisé</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white p-2 rounded-lg border text-center">
                        <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <span className="text-xs font-medium">Carte</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border text-center">
                        <div className="w-4 h-4 mx-auto mb-1 bg-black rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <span className="text-xs font-medium">Apple Pay</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border text-center">
                        <div className="w-4 h-4 mx-auto mb-1 bg-blue-600 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <span className="text-xs font-medium">PayPal</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-violet-600">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>SSL</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Crypté</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>100% sûr</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                Retour
              </Button>
              {customerInfo.firstName && customerInfo.email && customerInfo.phone && (
                <Button 
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="flex-1 bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Confirmation...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payer {selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0}€
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 justify-center text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Garantie satisfait ou remboursé</span>
              </div>
              <p className="text-xs text-green-600 text-center mt-1">
                Annulation gratuite jusqu'à 24h avant • Support 7j/7
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}