import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Eye, 
  Save,
  Palette,
  Layout,
  Type,
  Image,
  Star,
  MapPin,
  CheckCircle,
  Calendar,
  Clock,
  Plus,
  Settings,
  Monitor,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PageBuilder() {
  const [, setLocation] = useLocation();
  const [pageName, setPageName] = useState("Ma Page de Réservation");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [pageSettings, setPageSettings] = useState({
    title: "Réservez votre rendez-vous",
    subtitle: "Trouvez le créneau parfait pour votre beauté",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
    showServices: true,
    showTestimonials: true,
    showContact: true
  });
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('mobile');
  const { toast } = useToast();

  const templates = [
    { id: "modern", name: "Moderne", description: "Design épuré et professionnel" },
    { id: "classic", name: "Classique", description: "Style traditionnel et élégant" },
    { id: "minimalist", name: "Minimaliste", description: "Simplicité et clarté" },
    { id: "luxury", name: "Luxe", description: "Prestige et raffinement" }
  ];

  const handleSavePage = () => {
    toast({
      title: "Page sauvegardée !",
      description: `Votre page "${pageName}" a été créée avec succès`,
    });

    setTimeout(() => {
      setLocation("/business-features");
    }, 2000);
  };

  const handlePreview = () => {
    toast({
      title: "Aperçu généré",
      description: "Ouverture de l'aperçu de votre page",
    });
    // Simuler l'ouverture d'un aperçu
    setTimeout(() => {
      setLocation("/quick-booking");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/business-features")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Créateur de Pages</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Layout className="w-4 h-4" />
              <span>Personnalisez votre page de réservation</span>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeView === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('mobile')}
              className="text-xs"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
            <Button
              variant={activeView === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('desktop')}
              className="text-xs"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="text-xs"
          >
            <Eye className="w-4 h-4 mr-1" />
            Aperçu
          </Button>
          
          <Button
            size="sm"
            onClick={handleSavePage}
            className="bg-violet-500 hover:bg-violet-600 text-xs"
          >
            <Save className="w-4 h-4 mr-1" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Étape 1: Nom de la page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Nom de la page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Nom de votre page</Label>
              <Input
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="Ma Page de Réservation"
              />
            </div>
          </CardContent>
        </Card>

        {/* Étape 2: Template */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Choisir un template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? 'border-violet-500 bg-violet-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-5 h-5 text-violet-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Étape 3: Contenu */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Contenu de la page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Titre principal</Label>
                <Input
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                  placeholder="Réservez votre rendez-vous"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sous-titre</Label>
                <Input
                  value={pageSettings.subtitle}
                  onChange={(e) => setPageSettings({...pageSettings, subtitle: e.target.value})}
                  placeholder="Trouvez le créneau parfait"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Sections à inclure</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Services disponibles</span>
                    <Switch
                      checked={pageSettings.showServices}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, showServices: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Témoignages clients</span>
                    <Switch
                      checked={pageSettings.showTestimonials}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, showTestimonials: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Informations de contact</span>
                    <Switch
                      checked={pageSettings.showContact}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, showContact: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Personnalisation */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Couleur principale</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: pageSettings.primaryColor }}
                    />
                    <Input
                      type="color"
                      value={pageSettings.primaryColor}
                      onChange={(e) => setPageSettings({...pageSettings, primaryColor: e.target.value})}
                      className="w-12 h-8 p-0 border-0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: pageSettings.secondaryColor }}
                    />
                    <Input
                      type="color"
                      value={pageSettings.secondaryColor}
                      onChange={(e) => setPageSettings({...pageSettings, secondaryColor: e.target.value})}
                      className="w-12 h-8 p-0 border-0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aperçu mobile de la page */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aperçu de votre page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold" style={{ color: pageSettings.primaryColor }}>
                    {pageSettings.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{pageSettings.subtitle}</p>
                </div>
                
                {pageSettings.showServices && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Nos Services</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 border rounded">Coiffure - 45€</div>
                      <div className="p-2 border rounded">Manucure - 25€</div>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full text-sm"
                  style={{ backgroundColor: pageSettings.primaryColor }}
                >
                  Réserver maintenant
                </Button>
                
                {pageSettings.showContact && (
                  <div className="text-center text-xs text-gray-600">
                    <p>📍 123 Rue de la Beauté, Paris</p>
                    <p>📞 01 23 45 67 89</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bouton de sauvegarde final */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Template:</span>
                <span className="font-medium">{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sections:</span>
                <span className="font-medium">
                  {[pageSettings.showServices && "Services", pageSettings.showTestimonials && "Avis", pageSettings.showContact && "Contact"].filter(Boolean).length} activées
                </span>
              </div>
              
              <Button 
                onClick={handleSavePage}
                className="w-full mt-4 bg-violet-500 hover:bg-violet-600"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Créer ma page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}