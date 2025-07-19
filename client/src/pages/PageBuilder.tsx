import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Globe, Copy, ExternalLink, Save, Eye, Palette, MapPin, Phone, Mail, Clock, CheckCircle, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PageBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [pageData, setPageData] = useState({
    // Étape 1: Informations du salon
    salonName: "",
    salonDescription: "",
    salonAddress: "",
    salonPhone: "",
    salonEmail: "",
    
    // Étape 2: Services
    selectedServices: [] as number[],
    
    // Étape 3: Design
    template: "moderne",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
    logoUrl: "",
    coverImageUrl: "",
    
    // Étape 4: Configuration
    showPrices: true,
    enableOnlineBooking: true,
    requireDeposit: true,
    depositPercentage: 30,
    businessHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true }
    },
    
    // Données générées
    pageUrl: "",
    isPublished: false
  });

  // Récupérer les services disponibles
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  // Templates disponibles
  const templates = [
    { id: "moderne", name: "Moderne", description: "Design épuré et contemporain" },
    { id: "luxe", name: "Luxe", description: "Élégant et sophistiqué" },
    { id: "naturel", name: "Naturel", description: "Couleurs douces et naturelles" },
    { id: "coloré", name: "Coloré", description: "Vibrant et énergique" }
  ];

  // Générer une URL unique
  const generatePageUrl = () => {
    const slug = pageData.salonName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const randomId = Math.random().toString(36).substr(2, 4);
    return `salon-${slug}-${randomId}`;
  };

  // Créer/Publier la page
  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/booking-pages", {
        ...data,
        pageUrl: generatePageUrl()
      });
      if (!response.ok) throw new Error("Erreur lors de la création");
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-pages"] });
      setPageData(prev => ({ ...prev, pageUrl: response.pageUrl, isPublished: true }));
      toast({ 
        title: "🎉 Page créée avec succès!", 
        description: `Votre page est maintenant en ligne sur /${response.pageUrl}` 
      });
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer la page",
        variant: "destructive" 
      });
    }
  });

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const publishPage = () => {
    createPageMutation.mutate(pageData);
  };

  const copyPageUrl = () => {
    const fullUrl = `${window.location.origin}/${pageData.pageUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast({ title: "Lien copié!", description: "L'URL de votre page a été copiée" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/business-features")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Créateur de Pages</h1>
                <p className="text-sm text-gray-500">Créez votre page de réservation personnalisée</p>
              </div>
            </div>
            
            {pageData.isPublished && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyPageUrl}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`/${pageData.pageUrl}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir la page
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${currentStep > step ? 'bg-violet-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulaire */}
          <div className="space-y-6">
            {/* Étape 1: Informations du salon */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-violet-600" />
                    Informations du salon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="salonName">Nom du salon *</Label>
                    <Input
                      id="salonName"
                      value={pageData.salonName}
                      onChange={(e) => setPageData(prev => ({...prev, salonName: e.target.value}))}
                      placeholder="Salon Bella Vista"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salonDescription">Description</Label>
                    <Textarea
                      id="salonDescription"
                      value={pageData.salonDescription}
                      onChange={(e) => setPageData(prev => ({...prev, salonDescription: e.target.value}))}
                      placeholder="Spécialisé dans les coupes modernes et les soins capillaires..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="salonAddress">Adresse</Label>
                    <Input
                      id="salonAddress"
                      value={pageData.salonAddress}
                      onChange={(e) => setPageData(prev => ({...prev, salonAddress: e.target.value}))}
                      placeholder="123 Rue de la Paix, 75001 Paris"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="salonPhone">Téléphone</Label>
                      <Input
                        id="salonPhone"
                        value={pageData.salonPhone}
                        onChange={(e) => setPageData(prev => ({...prev, salonPhone: e.target.value}))}
                        placeholder="01 23 45 67 89"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salonEmail">Email</Label>
                      <Input
                        id="salonEmail"
                        type="email"
                        value={pageData.salonEmail}
                        onChange={(e) => setPageData(prev => ({...prev, salonEmail: e.target.value}))}
                        placeholder="contact@salon.fr"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Services */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-violet-600" />
                    Services proposés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={pageData.selectedServices.includes(service.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPageData(prev => ({
                                  ...prev,
                                  selectedServices: [...prev.selectedServices, service.id]
                                }));
                              } else {
                                setPageData(prev => ({
                                  ...prev,
                                  selectedServices: prev.selectedServices.filter(id => id !== service.id)
                                }));
                              }
                            }}
                          />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.duration} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{service.price}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Design */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-violet-600" />
                    Design de la page
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Template</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            pageData.template === template.id 
                              ? 'border-violet-600 bg-violet-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPageData(prev => ({...prev, template: template.id}))}
                        >
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="primaryColor">Couleur principale</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={pageData.primaryColor}
                        onChange={(e) => setPageData(prev => ({...prev, primaryColor: e.target.value}))}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={pageData.secondaryColor}
                        onChange={(e) => setPageData(prev => ({...prev, secondaryColor: e.target.value}))}
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 4: Configuration */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-violet-600" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Afficher les prix</Label>
                    <Switch
                      checked={pageData.showPrices}
                      onCheckedChange={(checked) => setPageData(prev => ({...prev, showPrices: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Réservation en ligne</Label>
                    <Switch
                      checked={pageData.enableOnlineBooking}
                      onCheckedChange={(checked) => setPageData(prev => ({...prev, enableOnlineBooking: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Demander un acompte</Label>
                    <Switch
                      checked={pageData.requireDeposit}
                      onCheckedChange={(checked) => setPageData(prev => ({...prev, requireDeposit: checked}))}
                    />
                  </div>
                  
                  {pageData.requireDeposit && (
                    <div>
                      <Label>Pourcentage d'acompte</Label>
                      <Select 
                        value={pageData.depositPercentage.toString()} 
                        onValueChange={(value) => setPageData(prev => ({...prev, depositPercentage: parseInt(value)}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  disabled={currentStep === 1 && !pageData.salonName}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={publishPage}
                  disabled={createPageMutation.isPending || pageData.isPublished}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createPageMutation.isPending ? "Création..." : 
                   pageData.isPublished ? "Page publiée ✓" : "Publier la page"}
                </Button>
              )}
            </div>
          </div>

          {/* Aperçu */}
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Aperçu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-lg overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${pageData.primaryColor}20, ${pageData.secondaryColor}20)`
                  }}
                >
                  {/* Header preview */}
                  <div 
                    className="p-6 text-center text-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${pageData.primaryColor}, ${pageData.secondaryColor})`
                    }}
                  >
                    <h2 className="text-lg font-bold">
                      {pageData.salonName || "Nom du salon"}
                    </h2>
                    <p className="text-sm opacity-90">
                      {pageData.salonDescription || "Description du salon"}
                    </p>
                  </div>
                  
                  {/* Services preview */}
                  <div className="p-4 bg-white">
                    <h3 className="font-medium mb-3">Nos services</h3>
                    <div className="space-y-2">
                      {pageData.selectedServices.length > 0 ? (
                        pageData.selectedServices.slice(0, 3).map((serviceId) => {
                          const service = services.find((s: any) => s.id === serviceId);
                          return service ? (
                            <div key={service.id} className="flex justify-between text-sm">
                              <span>{service.name}</span>
                              {pageData.showPrices && <span>{service.price}€</span>}
                            </div>
                          ) : null;
                        })
                      ) : (
                        <p className="text-sm text-gray-500">Sélectionnez des services...</p>
                      )}
                    </div>
                    
                    {pageData.enableOnlineBooking && (
                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        style={{ 
                          background: `linear-gradient(to right, ${pageData.primaryColor}, ${pageData.secondaryColor})`
                        }}
                      >
                        Réserver maintenant
                      </Button>
                    )}
                  </div>
                  
                  {/* Contact preview */}
                  <div className="p-4 bg-gray-50 text-xs">
                    {pageData.salonAddress && (
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pageData.salonAddress}
                      </p>
                    )}
                    {pageData.salonPhone && (
                      <p className="flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {pageData.salonPhone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {pageData.isPublished && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Page publiée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm">Votre page est maintenant en ligne :</p>
                    <p className="text-xs font-mono mt-2 bg-white p-2 rounded border">
                      /{pageData.pageUrl}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" onClick={copyPageUrl}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copier
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`/${pageData.pageUrl}`, '_blank')}>
                        <Globe className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                    </div>
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