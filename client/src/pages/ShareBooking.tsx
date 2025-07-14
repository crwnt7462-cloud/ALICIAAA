import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Link, 
  Share2, 
  Copy, 
  MessageCircle, 
  Mail, 
  QrCode, 
  ExternalLink,
  Check,
  Smartphone,
  Palette,
  Upload,
  Eye,
  Settings,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function ShareBooking() {
  const [businessName, setBusinessName] = useState("Mon Salon de Beauté");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Customization state
  const [customization, setCustomization] = useState({
    brandColor: "#8B5CF6",
    logoUrl: "",
    welcomeMessage: "Bienvenue ! Prenez rendez-vous en quelques clics.",
    description: "",
    showPrices: true,
    showDuration: true,
    enableInstantBooking: true,
  });

  // Fetch business settings
  const { data: businessSettings } = useQuery({
    queryKey: ['/api/business-settings'],
  });

  // Update customization when settings are loaded
  useEffect(() => {
    if (businessSettings) {
      setCustomization({
        brandColor: businessSettings.brandColor || "#8B5CF6",
        logoUrl: businessSettings.logoUrl || "",
        welcomeMessage: businessSettings.welcomeMessage || "Bienvenue ! Prenez rendez-vous en quelques clics.",
        description: businessSettings.description || "",
        showPrices: businessSettings.showPrices !== undefined ? businessSettings.showPrices : true,
        showDuration: businessSettings.showDuration !== undefined ? businessSettings.showDuration : true,
        enableInstantBooking: businessSettings.enableInstantBooking !== undefined ? businessSettings.enableInstantBooking : true,
      });
      if (businessSettings.businessName) {
        setBusinessName(businessSettings.businessName);
      }
    }
  }, [businessSettings]);

  // Save customization
  const saveCustomizationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/business-settings', {
      method: 'PATCH',
      body: data,
    }),
    onSuccess: () => {
      toast({
        title: "Personnalisation sauvegardée",
        description: "Vos modifications ont été enregistrées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business-settings'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    },
  });

  // Generate booking link
  const baseUrl = window.location.origin;
  const bookingLink = `${baseUrl}/book/${encodeURIComponent(businessName.toLowerCase().replace(/\s+/g, '-'))}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papier",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const handleSaveCustomization = () => {
    saveCustomizationMutation.mutate({
      businessName,
      ...customization,
    });
  };

  const updateCustomization = (key: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const predefinedColors = [
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5A2B", // Brown
    "#6B7280", // Gray
    "#EC4899", // Pink
  ];

  const shareViaWhatsApp = () => {
    const message = `Bonjour ! Vous pouvez prendre rendez-vous directement en ligne ici : ${bookingLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaSMS = () => {
    const message = `Prenez rendez-vous en ligne : ${bookingLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

  const shareViaEmail = () => {
    const subject = "Prenez rendez-vous en ligne";
    const body = `Bonjour,

Vous pouvez désormais prendre rendez-vous directement en ligne à l'adresse suivante :

${bookingLink}

C'est simple et rapide !

Cordialement,
${businessName}`;
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Personnaliser votre page de réservation</h1>
          <p className="text-gray-600 text-sm mt-1">
            Configurez l'apparence et les options de votre lien de réservation
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <Button
            variant={!showPreview ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setShowPreview(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Personnaliser
          </Button>
          <Button
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
        </div>

        {!showPreview ? (
          <>
            {/* Configuration de base */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Configuration de base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Nom de votre salon</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Mon Salon de Beauté"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="welcomeMessage">Message d'accueil</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={customization.welcomeMessage}
                    onChange={(e) => updateCustomization('welcomeMessage', e.target.value)}
                    placeholder="Bienvenue ! Prenez rendez-vous en quelques clics."
                    className="mt-1"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description du salon</Label>
                  <Textarea
                    id="description"
                    value={customization.description}
                    onChange={(e) => updateCustomization('description', e.target.value)}
                    placeholder="Décrivez votre salon, vos spécialités..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Couleurs et apparence */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-purple-600" />
                  Couleurs et apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Couleur principale</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateCustomization('brandColor', color)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          customization.brandColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Input
                      type="color"
                      value={customization.brandColor}
                      onChange={(e) => updateCustomization('brandColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={customization.brandColor}
                      onChange={(e) => updateCustomization('brandColor', e.target.value)}
                      placeholder="#8B5CF6"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="logoUrl">URL du logo (optionnel)</Label>
                  <Input
                    id="logoUrl"
                    value={customization.logoUrl}
                    onChange={(e) => updateCustomization('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options d'affichage */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Options d'affichage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Afficher les prix</Label>
                    <p className="text-sm text-gray-500">Les clients verront les tarifs</p>
                  </div>
                  <Switch
                    checked={customization.showPrices}
                    onCheckedChange={(checked) => updateCustomization('showPrices', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Afficher la durée</Label>
                    <p className="text-sm text-gray-500">Durée des prestations visible</p>
                  </div>
                  <Switch
                    checked={customization.showDuration}
                    onCheckedChange={(checked) => updateCustomization('showDuration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Réservation instantanée</Label>
                    <p className="text-sm text-gray-500">Confirmation automatique</p>
                  </div>
                  <Switch
                    checked={customization.enableInstantBooking}
                    onCheckedChange={(checked) => updateCustomization('enableInstantBooking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sauvegarder */}
            <Button
              onClick={handleSaveCustomization}
              disabled={saveCustomizationMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {saveCustomizationMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Aperçu de la page de réservation */}
            <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
              <div 
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: customization.brandColor }}
              >
                {customization.logoUrl ? (
                  <img 
                    src={customization.logoUrl} 
                    alt="Logo" 
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">{businessName}</h2>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {customization.welcomeMessage}
                </h3>
                {customization.description && (
                  <p className="text-gray-600 mb-4">{customization.description}</p>
                )}
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Coupe femme</h4>
                        {customization.showDuration && (
                          <p className="text-sm text-gray-500">60 min</p>
                        )}
                      </div>
                      {customization.showPrices && (
                        <span className="font-semibold">45€</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Coloration</h4>
                        {customization.showDuration && (
                          <p className="text-sm text-gray-500">120 min</p>
                        )}
                      </div>
                      {customization.showPrices && (
                        <span className="font-semibold">80€</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  style={{ backgroundColor: customization.brandColor }}
                >
                  Prendre rendez-vous
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Configuration du lien */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Link className="w-5 h-5 mr-2 text-green-600" />
              Votre lien de réservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm font-mono text-gray-700 break-all">
                {bookingLink}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => copyToClipboard(bookingLink)}
                className="flex-1"
                variant={copiedLink ? "default" : "outline"}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => window.open(bookingLink, '_blank')}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Tester
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Options de partage */}
        {showPreview && (
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-purple-600" />
                Partager avec vos clients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={shareViaSMS}
                variant="outline"
                className="w-full justify-start"
              >
                <Smartphone className="w-5 h-5 mr-3" />
                Envoyer par SMS
              </Button>
              
              <Button
                onClick={shareViaEmail}
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="w-5 h-5 mr-3" />
                Envoyer par Email
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-0 shadow-sm bg-blue-50/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                <span>Personnalisez votre page de réservation</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                <span>Partagez votre lien personnalisé</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                <span>Recevez les réservations automatiquement</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Personnalisation sauvegardée automatiquement • Aperçu en temps réel</p>
        </div>
      </div>
    </div>
  );
}