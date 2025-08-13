import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, 
  ChevronLeft, ChevronRight, CheckCircle2, Eye,
  Palette, Type, Layout, Sparkles, Save, Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export default function PerfectBookingCreator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  
  const [pageData, setPageData] = useState({
    salonName: "Mon Salon de Beauté",
    salonDescription: "Institut de beauté professionnel",
    salonAddress: "123 Rue de la Beauté, 75001 Paris",
    salonPhone: "01 23 45 67 89",
    salonEmail: "contact@monsalon.fr",
    primaryColor: "#7c3aed",
    secondaryColor: "#ec4899",
    template: "moderne"
  });

  const services: Service[] = [
    { id: "1", name: "Coupe & Brushing", duration: 60, price: 45, description: "Coupe personnalisée + brushing" },
    { id: "2", name: "Coloration", duration: 120, price: 80, description: "Coloration complète + soin" },
    { id: "3", name: "Soin Visage", duration: 75, price: 65, description: "Nettoyage + hydratation" },
    { id: "4", name: "Manucure", duration: 45, price: 35, description: "Soin des ongles + vernis" }
  ];

  const templates = [
    { id: "moderne", name: "Moderne", description: "Design épuré et contemporain" },
    { id: "classique", name: "Classique", description: "Style intemporel et élégant" },
    { id: "luxe", name: "Luxe", description: "Sophistiqué et premium" },
    { id: "minimal", name: "Minimal", description: "Simple et fonctionnel" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleSave = () => {
    toast({
      title: "Page créée avec succès",
      description: "Votre page de réservation est maintenant en ligne !",
    });
    setLocation('/business-features');
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-sm mx-auto bg-white shadow-sm">
          {/* Preview Header */}
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setIsPreview(false)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-medium">Aperçu</h1>
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>

          {/* Salon Header */}
          <div 
            className="text-white py-8 px-4"
            style={{ 
              background: `linear-gradient(135deg, ${pageData.primaryColor}, ${pageData.secondaryColor})` 
            }}
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">{pageData.salonName}</h1>
              <p className="text-sm opacity-90 mb-4">{pageData.salonDescription}</p>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{pageData.salonAddress}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>{pageData.salonPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services Preview */}
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Nos services</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <Card key={service.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.duration}min
                          </Badge>
                          <span className="font-medium text-purple-600">
                            {service.price}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setLocation('/business-features')}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-medium text-gray-900">Créer une page de réservation</h1>
                <p className="text-sm text-gray-500">Étape {step}/3</p>
              </div>
              
              <Button 
                onClick={handlePreview}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4 flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    s <= step ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Étape 1: Informations du salon */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Informations du salon
                </h2>
                <p className="text-gray-600 text-sm">
                  Renseignez les informations de base de votre salon
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="salonName">Nom du salon</Label>
                  <Input 
                    id="salonName" 
                    value={pageData.salonName}
                    onChange={(e) => setPageData({...pageData, salonName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salonDescription">Description</Label>
                  <Textarea 
                    id="salonDescription" 
                    value={pageData.salonDescription}
                    onChange={(e) => setPageData({...pageData, salonDescription: e.target.value})}
                    rows={3}
                    className="mt-1 resize-none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salonAddress">Adresse</Label>
                  <Input 
                    id="salonAddress" 
                    value={pageData.salonAddress}
                    onChange={(e) => setPageData({...pageData, salonAddress: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salonPhone">Téléphone</Label>
                    <Input 
                      id="salonPhone" 
                      value={pageData.salonPhone}
                      onChange={(e) => setPageData({...pageData, salonPhone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salonEmail">Email</Label>
                    <Input 
                      id="salonEmail" 
                      type="email"
                      value={pageData.salonEmail}
                      onChange={(e) => setPageData({...pageData, salonEmail: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full bg-purple-600 hover:bg-purple-700">
                Continuer
              </Button>
            </div>
          )}

          {/* Étape 2: Design et couleurs */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Design et couleurs
                </h2>
                <p className="text-gray-600 text-sm">
                  Personnalisez l'apparence de votre page
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Template</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer border-2 transition-colors ${
                          pageData.template === template.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPageData({...pageData, template: template.id})}
                      >
                        <CardContent className="p-4 text-center">
                          <Layout className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Couleur principale</Label>
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="color" 
                        id="primaryColor"
                        value={pageData.primaryColor}
                        onChange={(e) => setPageData({...pageData, primaryColor: e.target.value})}
                        className="w-12 h-10 rounded border border-gray-300"
                      />
                      <Input 
                        value={pageData.primaryColor}
                        onChange={(e) => setPageData({...pageData, primaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="color" 
                        id="secondaryColor"
                        value={pageData.secondaryColor}
                        onChange={(e) => setPageData({...pageData, secondaryColor: e.target.value})}
                        className="w-12 h-10 rounded border border-gray-300"
                      />
                      <Input 
                        value={pageData.secondaryColor}
                        onChange={(e) => setPageData({...pageData, secondaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* Étape 3: Configuration finale */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Configuration finale
                </h2>
                <p className="text-gray-600 text-sm">
                  Paramètres finaux et publication
                </p>
              </div>
              
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nom :</span>
                    <span className="font-medium">{pageData.salonName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Template :</span>
                    <span className="font-medium">{templates.find(t => t.id === pageData.template)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Services :</span>
                    <span className="font-medium">{services.length} services</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">URL :</span>
                    <span className="font-medium text-purple-600">salon-{pageData.salonName.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-purple-900 mb-1">Page prête à publier !</h3>
                    <p className="text-sm text-purple-700">
                      Votre page de réservation sera accessible publiquement et optimisée pour les moteurs de recherche.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Publier la page
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}