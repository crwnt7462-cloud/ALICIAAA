import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Palette,
  Layout,
  Eye,
  Save,
  Smartphone,
  Monitor,
  Type,
  Image,
  Settings2
} from "lucide-react";

export default function PageBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  const [pageConfig, setPageConfig] = useState({
    // Configuration de base
    pageName: "Ma Page de Réservation",
    welcomeTitle: "Bienvenue dans mon salon",
    description: "Réservez votre rendez-vous en quelques clics",
    
    // Design et couleurs
    primaryColor: "#8B5CF6", // Violet
    secondaryColor: "#F59E0B", // Amber
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    accentColor: "#10B981", // Emerald
    
    // Template et layout
    template: "moderne",
    showPrices: true,
    showDuration: true,
    showDescription: true,
    headerStyle: "gradient",
    buttonStyle: "rounded",
    
    // Contenu
    logoUrl: "",
    backgroundImage: "",
    customCSS: ""
  });

  const colorPresets = [
    { name: "Violet Élégant", primary: "#8B5CF6", secondary: "#F59E0B", accent: "#10B981" },
    { name: "Bleu Professionnel", primary: "#3B82F6", secondary: "#EF4444", accent: "#F59E0B" },
    { name: "Rose Féminin", primary: "#EC4899", secondary: "#8B5CF6", accent: "#06B6D4" },
    { name: "Vert Nature", primary: "#10B981", secondary: "#F59E0B", accent: "#8B5CF6" },
    { name: "Orange Dynamique", primary: "#F97316", secondary: "#3B82F6", accent: "#10B981" },
    { name: "Noir Luxe", primary: "#1F2937", secondary: "#F59E0B", accent: "#EF4444" }
  ];

  const templates = [
    { id: "moderne", name: "Moderne", description: "Design épuré et contemporary" },
    { id: "classique", name: "Classique", description: "Style intemporel et élégant" },
    { id: "minimaliste", name: "Minimaliste", description: "Interface ultra-simple" },
    { id: "luxe", name: "Luxe", description: "Design premium et sophistiqué" }
  ];

  const updateConfig = (key: string, value: any) => {
    setPageConfig(prev => ({ ...prev, [key]: value }));
  };

  const applyColorPreset = (preset: any) => {
    setPageConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));
    toast({ title: "Couleurs appliquées", description: `Thème "${preset.name}" activé` });
  };

  const savePage = () => {
    // Sauvegarder la configuration dans le localStorage pour l'appliquer à Booking.tsx
    localStorage.setItem('bookingPageConfig', JSON.stringify(pageConfig));
    toast({ 
      title: "Style sauvegardé", 
      description: "L'apparence de votre page de réservation a été mise à jour" 
    });
  };

  const previewPage = () => {
    toast({ 
      title: "Aperçu généré", 
      description: "Ouverture de la page de réservation personnalisée" 
    });
    setLocation('/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/business-features")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Personnalisation Page Client</h1>
              <p className="text-sm text-gray-500">Modifiez l'apparence de votre page de réservation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="outline" onClick={previewPage}>
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            
            <Button onClick={savePage}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-6xl mx-auto">
        {/* Panneau de configuration */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design" className="flex flex-col items-center gap-1 py-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs">Design</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex flex-col items-center gap-1 py-2">
                  <Layout className="w-4 h-4" />
                  <span className="text-xs">Layout</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2">
                  <Type className="w-4 h-4" />
                  <span className="text-xs">Contenu</span>
                </TabsTrigger>
              </TabsList>

              {/* Onglet Design */}
              <TabsContent value="design" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Thèmes de couleurs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {colorPresets.map((preset, index) => (
                        <div
                          key={index}
                          className="cursor-pointer p-2 border rounded-lg hover:border-gray-400 transition-colors"
                          onClick={() => applyColorPreset(preset)}
                        >
                          <div className="flex gap-1 mb-1">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <p className="text-xs font-medium">{preset.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Couleurs personnalisées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Couleur principale</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={pageConfig.primaryColor}
                            onChange={(e) => updateConfig("primaryColor", e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={pageConfig.primaryColor}
                            onChange={(e) => updateConfig("primaryColor", e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Couleur secondaire</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={pageConfig.secondaryColor}
                            onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={pageConfig.secondaryColor}
                            onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Couleur accent</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={pageConfig.accentColor}
                            onChange={(e) => updateConfig("accentColor", e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={pageConfig.accentColor}
                            onChange={(e) => updateConfig("accentColor", e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Arrière-plan</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={pageConfig.backgroundColor}
                            onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={pageConfig.backgroundColor}
                            onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Style des éléments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm">Style du header</Label>
                      <Select value={pageConfig.headerStyle} onValueChange={(value) => updateConfig("headerStyle", value)}>
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gradient">Dégradé</SelectItem>
                          <SelectItem value="solid">Couleur unie</SelectItem>
                          <SelectItem value="image">Image de fond</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Style des boutons</Label>
                      <Select value={pageConfig.buttonStyle} onValueChange={(value) => updateConfig("buttonStyle", value)}>
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Arrondis</SelectItem>
                          <SelectItem value="square">Carrés</SelectItem>
                          <SelectItem value="pill">Pilule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Layout */}
              <TabsContent value="layout" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Template</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          pageConfig.template === template.id 
                            ? "border-violet-500 bg-violet-50" 
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => updateConfig("template", template.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{template.name}</p>
                            <p className="text-xs text-gray-500">{template.description}</p>
                          </div>
                          {pageConfig.template === template.id && (
                            <Badge className="bg-violet-600">Actif</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Affichage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Afficher les prix</Label>
                      <Switch 
                        checked={pageConfig.showPrices}
                        onCheckedChange={(checked) => updateConfig("showPrices", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Afficher la durée</Label>
                      <Switch 
                        checked={pageConfig.showDuration}
                        onCheckedChange={(checked) => updateConfig("showDuration", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Afficher les descriptions</Label>
                      <Switch 
                        checked={pageConfig.showDescription}
                        onCheckedChange={(checked) => updateConfig("showDescription", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Contenu */}
              <TabsContent value="content" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Textes de la page</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm">Nom de la page</Label>
                      <Input
                        value={pageConfig.pageName}
                        onChange={(e) => updateConfig("pageName", e.target.value)}
                        className="h-9 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Titre d'accueil</Label>
                      <Input
                        value={pageConfig.welcomeTitle}
                        onChange={(e) => updateConfig("welcomeTitle", e.target.value)}
                        className="h-9 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Description</Label>
                      <Textarea
                        value={pageConfig.description}
                        onChange={(e) => updateConfig("description", e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm">URL du logo</Label>
                      <Input
                        value={pageConfig.logoUrl}
                        onChange={(e) => updateConfig("logoUrl", e.target.value)}
                        placeholder="https://..."
                        className="h-9 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Image de fond</Label>
                      <Input
                        value={pageConfig.backgroundImage}
                        onChange={(e) => updateConfig("backgroundImage", e.target.value)}
                        placeholder="https://..."
                        className="h-9 mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">CSS personnalisé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={pageConfig.customCSS}
                      onChange={(e) => updateConfig("customCSS", e.target.value)}
                      placeholder="/* Votre CSS personnalisé */"
                      rows={5}
                      className="font-mono text-xs"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Aperçu */}
        <div className="flex-1 p-6">
          <div className="bg-gray-100 rounded-lg p-4 h-full">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Aperçu - {previewMode === "mobile" ? "Mobile" : "Desktop"}</p>
            </div>
            
            <div 
              className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
                previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
              }`}
              style={{ 
                backgroundColor: pageConfig.backgroundColor,
                color: pageConfig.textColor 
              }}
            >
              {/* Header de l'aperçu */}
              <div 
                className={`p-6 text-white ${
                  pageConfig.headerStyle === "gradient" 
                    ? "bg-gradient-to-r"
                    : "bg-opacity-90"
                }`}
                style={{
                  background: pageConfig.headerStyle === "gradient" 
                    ? `linear-gradient(135deg, ${pageConfig.primaryColor}, ${pageConfig.secondaryColor})`
                    : pageConfig.primaryColor
                }}
              >
                <h1 className="text-xl font-bold mb-2">{pageConfig.welcomeTitle}</h1>
                <p className="text-sm opacity-90">{pageConfig.description}</p>
              </div>
              
              {/* Contenu de l'aperçu */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Services d'exemple */}
                  {[
                    { name: "Coupe + Brushing", price: "45€", duration: "1h" },
                    { name: "Coloration", price: "65€", duration: "2h" },
                    { name: "Soin Hydratant", price: "35€", duration: "45min" }
                  ].map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          {pageConfig.showDescription && (
                            <p className="text-sm text-gray-600 mt-1">
                              Description du service de beauté
                            </p>
                          )}
                          {pageConfig.showDuration && (
                            <p className="text-xs text-gray-500 mt-1">Durée: {service.duration}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {pageConfig.showPrices && (
                            <p className="font-bold" style={{ color: pageConfig.accentColor }}>
                              {service.price}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            className={`mt-2 ${pageConfig.buttonStyle === "pill" ? "rounded-full" : pageConfig.buttonStyle === "square" ? "rounded-none" : "rounded-lg"}`}
                            style={{ backgroundColor: pageConfig.primaryColor }}
                          >
                            Réserver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}