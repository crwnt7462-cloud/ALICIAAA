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
  MapPin, Phone, Mail, Clock, Star, Calendar, 
  CreditCard, Check, ArrowLeft, Sparkles, Settings, Edit3
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SalonPageProps {
  pageUrl?: string;
}

interface SalonData {
  id: string;
  salonName?: string;
  salonDescription?: string;
  salonAddress?: string;
  salonPhone?: string;
  salonEmail?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showPrices?: boolean;
  requireDeposit?: boolean;
  depositPercentage?: number;
  selectedServices?: string[];
}

export default function SalonPageFixed({ pageUrl }: SalonPageProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Salon par défaut si pas de données
  const defaultSalonData: SalonData = {
    id: "salon-demo",
    salonName: "Mon Salon de Beauté",
    salonDescription: "Votre salon de beauté premium avec les meilleures prestations",
    salonAddress: "123 Avenue des Champs-Élysées, 75008 Paris",
    salonPhone: "+33 1 23 45 67 89",
    salonEmail: "contact@excellence-beauty.fr",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
    showPrices: true,
    requireDeposit: true,
    depositPercentage: 30,
    selectedServices: ["1", "2", "3"]
  };

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

  // Récupérer les données de la page personnalisée
  const { data: pageDataRaw, isLoading: pageLoading } = useQuery({
    queryKey: [`/api/booking-pages/salon-demo`],
  });

  // Utiliser les données par défaut si pas de réponse API
  const pageData: SalonData = pageDataRaw || defaultSalonData;

  // Services par défaut
  const defaultServices = [
    { id: "1", name: "Coupe + Brushing", price: 65, duration: 60 },
    { id: "2", name: "Coloration", price: 120, duration: 120 },
    { id: "3", name: "Soin Visage", price: 80, duration: 75 },
    { id: "4", name: "Manucure", price: 35, duration: 45 },
    { id: "5", name: "Pédicure", price: 45, duration: 60 }
  ];

  // Récupérer les services disponibles
  const { data: allServices = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  // Utiliser les services par défaut si pas de réponse API
  const availableServices = Array.isArray(allServices) && allServices.length > 0 
    ? allServices.filter((service: any) => 
        pageData.selectedServices?.includes(service.id?.toString()) || false
      )
    : defaultServices;

  const selectedService = availableServices.find((s: any) => s.id?.toString() === formData.serviceId);

  // Calculer l'acompte
  useEffect(() => {
    if (selectedService && pageData.requireDeposit) {
      const depositPercentage = pageData.depositPercentage || 30;
      const deposit = Math.round((selectedService.price * depositPercentage) / 100);
      setFormData(prev => ({ ...prev, depositAmount: deposit }));
    }
  }, [selectedService, pageData]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Modifier
            </Button>
            <Button 
              size="sm" 
              className="gradient-bg text-white text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* En-tête salon */}
        <div 
          className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white overflow-hidden"
          style={{
            background: pageData.primaryColor 
              ? `linear-gradient(135deg, ${pageData.primaryColor}, ${pageData.secondaryColor || '#8B5CF6'})` 
              : undefined
          }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">
                  {pageData.salonName || "Mon Salon"}
                </h1>
                <p className="text-lg opacity-90 mb-4 max-w-2xl">
                  {pageData.salonDescription || "Votre salon de beauté professionnel"}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 opacity-75" />
                    <span>{pageData.salonAddress || "Adresse du salon"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 opacity-75" />
                    <span>{pageData.salonPhone || "Téléphone"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 opacity-75" />
                    <span>{pageData.salonEmail || "Email"}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Sparkles className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services disponibles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Calendar className="w-5 h-5 mr-2" />
              Nos Prestations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {availableServices.map((service: any) => (
                <div 
                  key={service.id} 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.serviceId === service.id?.toString() 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id?.toString() || '' }))}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {pageData.showPrices && (
                      <span 
                        className="font-bold text-lg"
                        style={{ color: pageData.primaryColor || '#8B5CF6' }}
                      >
                        {service.price}€
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duration || 60} min</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de réservation */}
        {formData.serviceId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Réserver votre rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Select 
                    value={formData.time} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTimeSlots().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Résumé et paiement */}
              {selectedService && formData.date && formData.time && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold mb-3">Résumé de votre réservation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(formData.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heure:</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix total:</span>
                      <span className="font-bold">{selectedService.price}€</span>
                    </div>
                    
                    {pageData.requireDeposit && formData.depositAmount > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Acompte à payer:</span>
                        <span className="font-bold">{formData.depositAmount}€</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 gradient-bg text-white"
                    onClick={() => {
                      toast({
                        title: "Fonctionnalité en développement",
                        description: "La réservation sera bientôt disponible !",
                      });
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {pageData.requireDeposit ? `Payer l'acompte (${formData.depositAmount}€)` : 'Réserver maintenant'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations pratiques */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horaires d'ouverture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 19h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Note client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">4.8/5</div>
                <div className="text-sm text-gray-500">Basé sur 142 avis</div>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}