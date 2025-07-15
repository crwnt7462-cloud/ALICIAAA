import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Star, Phone, User, Check, ChevronRight, Palette, Settings, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedBookingBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });

  const salon = {
    name: "Mon Salon",
    address: "Votre adresse personnalisée",
    rating: 4.8,
    phone: "Votre numéro"
  };

  const services = [
    { id: "1", name: "Coupe + Brushing", duration: "1h", price: 45, description: "Coupe personnalisée et brushing professionnel" },
    { id: "2", name: "Coloration", duration: "2h", price: 85, description: "Coloration complète avec soins" },
    { id: "3", name: "Soin du visage", duration: "1h30", price: 65, description: "Nettoyage et hydratation en profondeur" },
    { id: "4", name: "Manucure", duration: "45min", price: 35, description: "Soin complet des ongles et vernis" }
  ];

  const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const steps = [
    { number: 1, title: "Service", completed: !!selectedService },
    { number: 2, title: "Date & Heure", completed: !!selectedDate && !!selectedTime },
    { number: 3, title: "Informations", completed: customerInfo.name && customerInfo.phone }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/business-features");
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Page de réservation créée !",
      description: "Votre page de réservation professionnelle est maintenant disponible."
    });

    setTimeout(() => {
      setLocation("/business-features");
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedService;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return customerInfo.name && customerInfo.phone;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo Rendly */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-black tracking-wide" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
                Rendly
              </h1>
              <p className="text-xs text-gray-500">Créateur de page</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: "Personnalisation", description: "Options de personnalisation disponibles" })}
                className="h-10 w-10"
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: "Aperçu", description: "Aperçu de votre page" })}
                className="h-10 w-10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.number 
                    ? 'bg-violet-600 text-white' 
                    : step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed && currentStep !== step.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.number ? 'text-violet-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Builder Info */}
        <Card className="mb-6 border-violet-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-violet-600">P</span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">Page de Réservation Pro</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <Settings className="h-3 w-3" />
                  Créateur de page personnalisée
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-violet-500 fill-current" />
                    <span className="font-medium text-violet-600">Design Pro</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">Mobile-first</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configurer vos services</CardTitle>
              <p className="text-sm text-gray-600">Définissez les services que vos clients pourront réserver</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService === service.id 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-base">{service.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-violet-600">{service.price}€</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({ title: "Modifier service", description: "Édition des détails du service" });
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast({ title: "Ajouter service", description: "Nouveau service ajouté" })}
              >
                + Ajouter un service
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Time Configuration */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Configuration calendrier
                </CardTitle>
                <p className="text-sm text-gray-600">Définissez vos disponibilités</p>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border w-full"
                />
                
                <div className="mt-4 space-y-2">
                  <Label>Jours d'ouverture</Label>
                  <div className="grid grid-cols-7 gap-1">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                      <Button
                        key={day}
                        variant={index < 6 ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Créneaux horaires
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Configurez vos horaires de réservation
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={`text-sm h-10 ${
                          selectedTime === time 
                            ? 'bg-violet-600 hover:bg-violet-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Durée des créneaux</Label>
                    <div className="flex gap-2">
                      {['15min', '30min', '1h', '2h'].map((duration) => (
                        <Button key={duration} variant="outline" size="sm">
                          {duration}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Page Configuration */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Configuration de la page
              </CardTitle>
              <p className="text-sm text-gray-600">Personnalisez votre page de réservation</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salon-name">Nom du salon *</Label>
                <Input
                  id="salon-name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="Mon Salon de Beauté"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salon-address">Adresse *</Label>
                <Input
                  id="salon-address"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="123 Rue de la Beauté, Paris"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salon-phone">Téléphone</Label>
                <Input
                  id="salon-phone"
                  type="tel"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="01 23 45 67 89"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Message d'accueil</Label>
                <Textarea
                  id="welcome-message"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  placeholder="Bienvenue dans notre salon ! Réservez votre rendez-vous en quelques clics..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Style Configuration */}
              <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Style et couleurs
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Couleur principale</Label>
                    <div className="flex gap-2 mt-1">
                      {['bg-violet-600', 'bg-blue-600', 'bg-pink-600', 'bg-green-600'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-md`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Logo</Label>
                    <Button variant="outline" size="sm" className="w-full mt-1">
                      Uploader votre logo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Aperçu</h3>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">
                      {customerInfo.name || "Mon Salon"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-medium">
                      {customerInfo.phone || "Votre adresse"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-medium">{customerInfo.email || "Votre numéro"}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Services configurés:</span>
                    <span className="font-semibold text-lg text-violet-600">
                      {services.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto px-4 py-4">
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:bg-gray-300"
              >
                Continuer
              </Button>
            ) : (
              <Button 
                onClick={handleBooking}
                disabled={!canProceed()}
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:bg-gray-300"
              >
                Créer la page
              </Button>
            )}
          </div>
        </div>

        {/* Spacer for fixed bottom nav */}
        <div className="h-20" />
      </div>
    </div>
  );
}