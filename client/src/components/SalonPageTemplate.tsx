import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Phone, Mail, Star, Calendar, 
  CreditCard, Check, Sparkles 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SalonPageTemplateProps {
  salonSlug?: string;
  salonData?: any;
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    intensity?: number;
  };
}

function SalonPageTemplate({ salonSlug, salonData, customColors }: SalonPageTemplateProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Utiliser le slug fourni ou l'extraire de l'URL
  const currentSalonSlug = salonSlug || location.split('/').pop();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    depositAmount: 0
  });

  // Récupérer les données du salon si pas fournies en props
  const { data: fetchedSalonData, isLoading: salonLoading } = useQuery({
    queryKey: [`/api/salon/${currentSalonSlug}`],
    enabled: !!currentSalonSlug && !salonData
  });

  // Utiliser les données fournies ou récupérées
  const activeSalonData = salonData || fetchedSalonData;

  // Récupérer les services disponibles
  const { data: allServices = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  // Services disponibles pour ce salon
  const availableServices = Array.isArray(allServices) ? allServices.filter((service: any) => 
    activeSalonData?.serviceCategories?.some((category: any) => 
      category.services?.some((s: any) => s.id === service.id || s.name === service.name)
    )
  ) : [];

  const selectedService = availableServices.find((s: any) => s.id?.toString() === formData.serviceId);

  // Calculer l'acompte si nécessaire
  useEffect(() => {
    if (selectedService && activeSalonData?.requireDeposit) {
      const depositPercentage = activeSalonData.depositPercentage || 30;
      const deposit = Math.round((selectedService.price * depositPercentage) / 100);
      setFormData(prev => ({ ...prev, depositAmount: deposit }));
    }
  }, [selectedService, activeSalonData]);

  // Générer les créneaux horaires
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Générer les dates disponibles
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

  // Mutation pour créer la réservation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/appointments", bookingData);
      if (!response.ok) throw new Error("Erreur lors de la réservation");
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Réservation confirmée!", 
        description: "Votre rendez-vous a été confirmé avec succès" 
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
        depositAmount: 0
      });
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer la réservation",
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: "Service requis",
        description: "Veuillez sélectionner un service pour continuer.",
        variant: "destructive",
      });
      return;
    }

    // Préparer les données de réservation
    const preBookingData = {
      salonId: currentSalonSlug,
      serviceId: formData.serviceId,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      selectedDate: formData.date,
      selectedTime: formData.time,
      depositAmount: formData.depositAmount,
      requireDeposit: activeSalonData?.requireDeposit || false
    };
    
    sessionStorage.setItem('preBookingData', JSON.stringify(preBookingData));
    
    // Rediriger vers la page de réservation
    setTimeout(() => {
      setLocation(`/salon-booking?salon=${encodeURIComponent(currentSalonSlug || '')}`);
    }, 100);
  };

  if (salonLoading && !salonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!activeSalonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-lg font-semibold mb-2">Salon non trouvé</h2>
            <p className="text-gray-600 mb-4">Ce salon n'existe pas ou a été supprimé.</p>
            <Button onClick={() => window.history.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Couleurs personnalisées avec fallback
  const colors = customColors || activeSalonData?.customColors || {
    primary: '#8b5cf6',
    accent: '#f59e0b',
    buttonText: '#ffffff'
  };
  
  const styles = {
    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
    headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    buttonBg: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: styles.background }}
    >
      {/* Photo de couverture avec header */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={activeSalonData?.photos?.[0] || activeSalonData?.coverImageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center"}
          alt={`${activeSalonData?.name || 'Salon'} - Photo de couverture`}
          className="w-full h-full object-cover"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&crop=center";
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Contenu centré sur la photo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{activeSalonData?.name || 'Salon'}</h1>
            {activeSalonData?.description && (
              <p className="text-xl opacity-90 mb-6 drop-shadow-lg max-w-2xl">{activeSalonData.description}</p>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 text-sm bg-black/20 backdrop-blur-sm rounded-lg p-4">
              {activeSalonData?.address && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {activeSalonData.address}
                </div>
              )}
              {activeSalonData?.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {activeSalonData.phone}
                </div>
              )}
              {activeSalonData?.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {activeSalonData.email}
                </div>
              )}
              {activeSalonData?.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                  {activeSalonData.rating} ({activeSalonData.reviewCount || 0} avis)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Services disponibles */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                Nos services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableServices.length > 0 ? availableServices.map((service: any) => (
                  <div 
                    key={service.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id?.toString() || '' }))}
                  >
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.duration || 60} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold" style={{ color: colors.primary }}>
                        {service.price}€
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun service disponible pour le moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de réservation */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                Réserver maintenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <Label htmlFor="service">Service *</Label>
                  <Select 
                    value={formData.serviceId} 
                    onValueChange={(value) => setFormData(prev => ({...prev, serviceId: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.map((service: any) => (
                        <SelectItem key={service.id} value={service.id?.toString() || ''}>
                          <div className="flex justify-between w-full">
                            <span>{service.name}</span>
                            <span className="ml-4 font-medium">{service.price}€</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Select 
                    value={formData.date} 
                    onValueChange={(value) => setFormData(prev => ({...prev, date: value}))}
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
                    onValueChange={(value) => setFormData(prev => ({...prev, time: value}))}
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

                {/* Acompte */}
                {selectedService && activeSalonData?.requireDeposit && (
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
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-white font-medium rounded-lg"
                  style={{ background: styles.buttonBg }}
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
                      {selectedService && activeSalonData?.requireDeposit && ` (${formData.depositAmount}€)`}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-4">
            <span>✅ Paiement sécurisé</span>
            <span>✅ Confirmation immédiate</span>
            <span>✅ Annulation gratuite 24h</span>
          </div>
          <p className="mt-4">
            Propulsé par Avyento - Solution de réservation pour professionnels de la beauté
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalonPageTemplate;
export { SalonPageTemplate };