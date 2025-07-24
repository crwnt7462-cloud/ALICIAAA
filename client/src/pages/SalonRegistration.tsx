import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, Mail, Instagram, Building2, Sparkles } from "lucide-react";

interface SalonFormData {
  salonName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  activityType: string;
  description: string;
  instagram: string;
  selectedPlan: string;
}

export default function SalonRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<SalonFormData>({
    salonName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    activityType: '',
    description: '',
    instagram: '',
    selectedPlan: new URLSearchParams(window.location.search).get('plan') || 'professionnel'
  });

  const plans = {
    essentiel: { name: "Essentiel", price: "29€/mois", color: "from-green-500 to-emerald-600" },
    professionnel: { name: "Professionnel", price: "79€/mois", color: "from-blue-500 to-purple-600" },
    premium: { name: "Premium", price: "149€/mois", color: "from-purple-500 to-pink-600" }
  };

  const selectedPlanInfo = plans[formData.selectedPlan as keyof typeof plans] || plans.professionnel;

  const activityTypes = [
    "Salon de coiffure",
    "Institut de beauté",
    "Salon d'esthétique",
    "Salon de massage",
    "Onglerie",
    "Barbier",
    "Spa",
    "Centre de bien-être",
    "Salon mixte (coiffure + esthétique)"
  ];

  const handleInputChange = (field: keyof SalonFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.salonName || !formData.activityType || !formData.email || !formData.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.address || !formData.city || !formData.postalCode) {
      toast({
        title: "Adresse incomplète",
        description: "Veuillez renseigner votre adresse complète",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleProceedToPayment = () => {
    setLocation(`/salon-payment?plan=${formData.selectedPlan}&salon=${encodeURIComponent(formData.salonName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/professional-plans')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Inscription de votre salon
              </h1>
              <p className="text-gray-600">Créez votre compte professionnel en quelques étapes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Plan sélectionné */}
          <div className="lg:order-2">
            <Card className="sticky top-28 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-lg">Plan sélectionné</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedPlanInfo.color} text-white text-center`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-bold text-xl">{selectedPlanInfo.name}</h3>
                  </div>
                  <p className="text-2xl font-bold">{selectedPlanInfo.price}</p>
                  <p className="text-sm opacity-90">Facturation mensuelle</p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Réservations illimitées</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Gestion clientèle complète</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Page de réservation personnalisée</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Support client prioritaire</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            {/* Indicateur d'étapes */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded transition-all ${
                      step > stepNumber ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Étape 1: Informations générales */}
            {step === 1 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="salonName" className="text-sm font-medium">
                        Nom du salon *
                      </Label>
                      <Input
                        id="salonName"
                        value={formData.salonName}
                        onChange={(e) => handleInputChange('salonName', e.target.value)}
                        placeholder="Ex: Salon Beauty Paradise"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activityType" className="text-sm font-medium">
                        Type d'activité *
                      </Label>
                      <Select value={formData.activityType} onValueChange={(value) => handleInputChange('activityType', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Sélectionnez votre activité" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email professionnel *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@monsalon.fr"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="01 23 45 67 89"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description du salon (optionnel)
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez votre salon, vos spécialités, votre équipe..."
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Continuer
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Adresse */}
            {step === 2 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Adresse du salon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Adresse complète *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Rue de la Beauté"
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        Ville *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Paris"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium">
                        Code postal *
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="75001"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-sm font-medium flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram (optionnel)
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@monsalon_beaute"
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Confirmation */}
            {step === 3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Récapitulatif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-lg text-gray-900">{formData.salonName}</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {formData.activityType}</p>
                      <p><span className="font-medium">Adresse:</span> {formData.address}, {formData.postalCode} {formData.city}</p>
                      <p><span className="font-medium">Contact:</span> {formData.email} • {formData.phone}</p>
                      {formData.instagram && (
                        <p><span className="font-medium">Instagram:</span> {formData.instagram}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Procéder au paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}