import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Calendar, Clock, MapPin, Star, Euro } from "lucide-react";
import BookingConfirmationModal from '@/components/BookingConfirmationModal';

// Interface pour les salons
interface SalonData {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  specialties?: string[];
  rating?: number;
  photos?: string[];
  services?: any[];
}

// Interface pour les services
interface ServiceData {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: string;
  categoryId?: number;
}

// Interface pour les créneaux
interface TimeSlot {
  time: string;
  available: boolean;
  staffMember?: {
    id: number;
    name: string;
  };
}

export default function OriginalBooking() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // États pour la réservation
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Extraction de l'ID salon depuis l'URL ou sessionStorage
  const extractSalonId = (): string | null => {
    // Essayer de récupérer depuis sessionStorage d'abord
    const storedSalonId = sessionStorage.getItem('selectedSalonId');
    if (storedSalonId) {
      console.log('🎯 ORIGINAL BOOKING: Salon ID depuis sessionStorage:', storedSalonId);
      return storedSalonId;
    }
    
    // Sinon depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const salonFromUrl = urlParams.get('salon');
    if (salonFromUrl) {
      console.log('🎯 ORIGINAL BOOKING: Salon ID depuis URL:', salonFromUrl);
      sessionStorage.setItem('selectedSalonId', salonFromUrl);
      return salonFromUrl;
    }
    
    console.log('⚠️ ORIGINAL BOOKING: Aucun salon ID trouvé');
    return null;
  };

  const salonId = extractSalonId();

  // Récupération des données salon
  const { data: salon, isLoading: loadingSalon, error: salonError } = useQuery({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId,
    retry: false
  });

  // Récupération des services
  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: [`/api/salon/${salonId}/services`],
    enabled: !!salonId && !!salon,
    retry: false
  });

  // Récupération des créneaux disponibles
  const { data: timeSlots, isLoading: loadingSlots } = useQuery({
    queryKey: [`/api/salon/${salonId}/slots`, selectedDate, selectedService?.id],
    enabled: !!salonId && !!selectedDate && !!selectedService,
    retry: false
  });

  // Récupération du service depuis sessionStorage si disponible
  useEffect(() => {
    const storedService = sessionStorage.getItem('selectedService');
    if (storedService && !selectedService) {
      try {
        const serviceData = JSON.parse(storedService);
        console.log('🔍 ORIGINAL BOOKING: Service depuis sessionStorage:', serviceData);
        setSelectedService(serviceData);
      } catch (error) {
        console.error('❌ Erreur parsing service:', error);
        sessionStorage.removeItem('selectedService');
      }
    }
  }, [selectedService]);

  // Génération des dates disponibles (7 prochains jours)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })
      });
    }
    return dates;
  };

  // Mutation pour créer la réservation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest("POST", `/api/salon/${salonId}/book`, bookingData);
    },
    onSuccess: (data) => {
      console.log('✅ Réservation créée:', data);
      toast({
        title: "Réservation confirmée",
        description: "Votre rendez-vous a été pris avec succès !",
      });
      // Redirection vers la confirmation ou paiement si nécessaire
      if (data.paymentRequired) {
        window.location.href = data.paymentUrl;
      } else {
        setLocation('/booking-confirmation');
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur réservation:', error);
      toast({
        title: "Erreur de réservation",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    },
  });

  // Gestion de la soumission
  const handleBookingSubmit = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientInfo.firstName || !clientInfo.email) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      staffId: selectedStaff?.id,
      clientInfo,
      source: 'original_booking_page'
    };

    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    const bookingData = {
      serviceId: selectedService?.id,
      date: selectedDate,
      time: selectedTime,
      staffId: selectedStaff?.id,
      clientInfo,
      source: 'original_booking_page'
    };

    createBookingMutation.mutate(bookingData);
    setShowConfirmation(false);
  };

  // Gestion des erreurs
  if (salonError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-amber-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Salon introuvable</h2>
            <p className="text-gray-600 mb-4">Le salon demandé n'existe pas ou n'est plus disponible.</p>
            <Button onClick={() => setLocation('/search')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la recherche
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loadingSalon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement des informations du salon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/search')}
              className="flex items-center text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Réservation</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Informations salon */}
        {salon && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">{salon.name}</CardTitle>
                  {salon.address && (
                    <p className="text-gray-600 flex items-center mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {salon.address}
                    </p>
                  )}
                  {salon.rating && (
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{salon.rating}/5</span>
                    </div>
                  )}
                </div>
                {salon.photos && salon.photos[0] && (
                  <img 
                    src={salon.photos[0]} 
                    alt={salon.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Sélection du service */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Choisir un service</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingServices ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Chargement des services...</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {services?.map((service: ServiceData) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                          <span className="flex items-center text-sm font-medium text-purple-600">
                            <Euro className="w-4 h-4 mr-1" />
                            {service.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sélection de la date */}
        {selectedService && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Choisir une date</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une date" />
                </SelectTrigger>
                <SelectContent>
                  {generateAvailableDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Sélection de l'heure */}
        {selectedDate && selectedService && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Choisir un créneau</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Chargement des créneaux...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots?.map((slot: TimeSlot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedTime(slot.time);
                        setSelectedStaff(slot.staffMember);
                      }}
                      className="p-3 h-auto"
                    >
                      <div className="text-center">
                        <div className="font-medium">{slot.time}</div>
                        {slot.staffMember && (
                          <div className="text-xs opacity-75">{slot.staffMember.name}</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations client */}
        {selectedTime && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Vos informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Prénom *"
                  value={clientInfo.firstName}
                  onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                />
                <Input
                  placeholder="Nom *"
                  value={clientInfo.lastName}
                  onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                />
              </div>
              <Input
                type="email"
                placeholder="Email *"
                value={clientInfo.email}
                onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="Téléphone"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
              />
            </CardContent>
          </Card>
        )}

        {/* Bouton de réservation */}
        {selectedTime && clientInfo.firstName && clientInfo.email && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Button 
                onClick={handleBookingSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Réservation en cours...
                  </>
                ) : (
                  'Confirmer la réservation'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de confirmation */}
      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmBooking}
        salon={salon}
        service={selectedService}
        date={selectedDate}
        time={selectedTime}
        clientInfo={clientInfo}
        staff={selectedStaff}
      />
    </div>
  );
}