import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Eye,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image,
  Type,
  Square,
  Calendar,
  Star,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Move,
  Edit2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface PageBlock {
  id: string;
  type: 'header' | 'text' | 'services' | 'contact' | 'testimonials' | 'booking-form';
  content: any;
  style: any;
  order: number;
}

interface PageDesign {
  id?: number;
  name: string;
  slug: string;
  blocks: PageBlock[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    buttonStyle: string;
  };
  settings: {
    isPublished: boolean;
    metaTitle: string;
    metaDescription: string;
  };
}

export default function PageBuilder() {
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [pageDesign, setPageDesign] = useState<PageDesign>({
    name: "Ma Page de Réservation",
    slug: "ma-page-reservation",
    blocks: [
      {
        id: "header-1",
        type: "header",
        content: {
          title: "Prenez rendez-vous",
          subtitle: "Réservez en ligne en quelques clics",
          backgroundImage: "",
          logoUrl: ""
        },
        style: {
          backgroundColor: "#8B5CF6",
          textColor: "#FFFFFF",
          alignment: "center",
          height: "300px"
        },
        order: 0
      },
      {
        id: "services-1",
        type: "services",
        content: {
          title: "Nos Services",
          showPrices: true,
          showDuration: true,
          layout: "grid"
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          padding: "40px"
        },
        order: 1
      },
      {
        id: "booking-form-1",
        type: "booking-form",
        content: {
          title: "Prendre rendez-vous",
          buttonText: "Réserver maintenant"
        },
        style: {
          backgroundColor: "#F9FAFB",
          buttonColor: "#8B5CF6",
          padding: "40px"
        },
        order: 2
      }
    ],
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#F3F4F6",
      fontFamily: "Inter",
      buttonStyle: "rounded"
    },
    settings: {
      isPublished: false,
      metaTitle: "",
      metaDescription: ""
    }
  });

  // Fetch existing page if editing
  const { data: existingPage } = useQuery({
    queryKey: ['/api/booking-pages'],
  });

  // Save page design
  const savePageMutation = useMutation({
    mutationFn: (data: PageDesign) => apiRequest('/api/booking-pages', {
      method: pageDesign.id ? 'PATCH' : 'POST',
      body: data,
    }),
    onSuccess: () => {
      toast({
        title: "Page sauvegardée",
        description: "Votre page de réservation a été enregistrée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/booking-pages'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la page",
        variant: "destructive",
      });
    },
  });

  const blockTypes = [
    { type: 'header', icon: Image, label: 'En-tête', description: 'Titre, logo et image de fond' },
    { type: 'text', icon: Type, label: 'Texte', description: 'Paragraphe de contenu' },
    { type: 'services', icon: Square, label: 'Services', description: 'Liste des prestations' },
    { type: 'booking-form', icon: Calendar, label: 'Formulaire', description: 'Formulaire de réservation' },
    { type: 'testimonials', icon: Star, label: 'Témoignages', description: 'Avis clients' },
    { type: 'contact', icon: Type, label: 'Contact', description: 'Informations de contact' },
  ];

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
      order: pageDesign.blocks.length
    };

    setPageDesign(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const removeBlock = (blockId: string) => {
    setPageDesign(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
    setSelectedBlock(null);
  };

  const updateBlock = (blockId: string, updates: Partial<PageBlock>) => {
    setPageDesign(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    }));
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setPageDesign(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(b => b.id === blockId);
      
      if (direction === 'up' && index > 0) {
        [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      }
      
      return { ...prev, blocks };
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Nouveau titre', subtitle: 'Sous-titre', backgroundImage: '', logoUrl: '' };
      case 'text':
        return { content: 'Votre texte ici...' };
      case 'services':
        return { title: 'Nos Services', showPrices: true, showDuration: true, layout: 'grid' };
      case 'booking-form':
        return { title: 'Prendre rendez-vous', buttonText: 'Réserver' };
      case 'testimonials':
        return { title: 'Témoignages', testimonials: [] };
      case 'contact':
        return { title: 'Contact', address: '', phone: '', email: '' };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type: string) => {
    switch (type) {
      case 'header':
        return { backgroundColor: '#8B5CF6', textColor: '#FFFFFF', alignment: 'center', height: '300px' };
      default:
        return { backgroundColor: '#FFFFFF', textColor: '#1F2937', padding: '40px' };
    }
  };

  const selectedBlockData = selectedBlock ? pageDesign.blocks.find(b => b.id === selectedBlock) : null;

  // Set page title
  useEffect(() => {
    document.title = `${pageDesign.name} - Éditeur de Pages | Beauty Pro`;
  }, [pageDesign.name]);

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      {/* Sidebar - Block Library */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.close()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Fermer
            </Button>
            <div className="flex space-x-1">
              <Button
                variant={activeView === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={activeView === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500 mb-1">Nom de la page</Label>
              <Input
                value={pageDesign.name}
                onChange={(e) => setPageDesign(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ma Page de Réservation"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1">URL de la page</Label>
              <Input
                value={pageDesign.slug}
                onChange={(e) => setPageDesign(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="ma-page-reservation"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Block Library */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Ajouter des blocs</h3>
            <div className="grid grid-cols-2 gap-2">
              {blockTypes.map((blockType) => (
                <Button
                  key={blockType.type}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center text-center"
                  onClick={() => addBlock(blockType.type)}
                >
                  <blockType.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{blockType.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Blocks List */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Structure de la page</h3>
            <div className="space-y-2">
              {pageDesign.blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBlock === block.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedBlock(block.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Move className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {blockTypes.find(t => t.type === block.type)?.label || block.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 'down');
                        }}
                        disabled={index === pageDesign.blocks.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => savePageMutation.mutate(pageDesign)}
            disabled={savePageMutation.isPending}
            className="w-full"
          >
            {savePageMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Preview */}
      <div className="flex-1 flex">
        {/* Preview Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className={`mx-auto bg-white shadow-xl rounded-lg overflow-hidden ${
            activeView === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
          }`}>
            {pageDesign.blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <div
                  key={block.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedBlock(block.id)}
                  style={{
                    backgroundColor: block.style.backgroundColor,
                    color: block.style.textColor,
                    padding: block.style.padding || '20px'
                  }}
                >
                  {selectedBlock === block.id && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Sélectionné
                      </Badge>
                    </div>
                  )}
                  
                  {/* Render block content based on type */}
                  {block.type === 'header' && (
                    <div 
                      className="text-center"
                      style={{ 
                        height: block.style.height,
                        backgroundImage: block.content.backgroundImage ? `url(${block.content.backgroundImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        {block.content.logoUrl && (
                          <img src={block.content.logoUrl} alt="Logo" className="h-16 mb-4" />
                        )}
                        <h1 className="text-4xl font-bold mb-2">{block.content.title}</h1>
                        <p className="text-xl opacity-90">{block.content.subtitle}</p>
                      </div>
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div className="prose max-w-none">
                      <p>{block.content.content}</p>
                    </div>
                  )}

                  {block.type === 'services' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 text-center">{block.content.title}</h2>
                      <div className={`grid gap-4 ${block.content.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {[
                          { name: "Coupe femme", price: 45, duration: 60 },
                          { name: "Coloration", price: 80, duration: 120 },
                          { name: "Brushing", price: 30, duration: 45 },
                          { name: "Balayage", price: 120, duration: 180 }
                        ].map((service, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                {block.content.showDuration && (
                                  <p className="text-sm opacity-70">{service.duration} min</p>
                                )}
                              </div>
                              {block.content.showPrices && (
                                <span className="font-bold text-lg">{service.price}€</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'booking-form' && (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-6">{block.content.title}</h2>
                      <div className="max-w-md mx-auto space-y-4">
                        <Input placeholder="Votre nom" />
                        <Input placeholder="Votre email" />
                        <Input placeholder="Votre téléphone" />
                        <Button 
                          className="w-full"
                          style={{ backgroundColor: block.style.buttonColor }}
                        >
                          {block.content.buttonText}
                        </Button>
                      </div>
                    </div>
                  )}

                  {block.type === 'contact' && (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-6">{block.content.title}</h2>
                      <div className="space-y-2">
                        <p>📍 {block.content.address || "123 Rue de la Beauté, 75001 Paris"}</p>
                        <p>📞 {block.content.phone || "01 23 45 67 89"}</p>
                        <p>✉️ {block.content.email || "contact@salon.com"}</p>
                      </div>
                    </div>
                  )}

                  {block.type === 'testimonials' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 text-center">{block.content.title}</h2>
                      <div className="grid gap-4 md:grid-cols-3">
                        {[
                          { name: "Marie L.", text: "Service exceptionnel, je recommande !", rating: 5 },
                          { name: "Sophie M.", text: "Très professionnelle et à l'écoute.", rating: 5 },
                          { name: "Julie R.", text: "Toujours satisfaite de mes rdv.", rating: 5 }
                        ].map((testimonial, index) => (
                          <div key={index} className="bg-white bg-opacity-50 rounded-lg p-4">
                            <div className="flex mb-2">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm mb-2">"{testimonial.text}"</p>
                            <p className="font-semibold text-sm">- {testimonial.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedBlockData && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">
              Propriétés - {blockTypes.find(t => t.type === selectedBlockData.type)?.label}
            </h3>

            <div className="space-y-4">
              {/* Content Properties */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Contenu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedBlockData.type === 'header' && (
                    <>
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={selectedBlockData.content.title}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, title: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Sous-titre</Label>
                        <Input
                          value={selectedBlockData.content.subtitle}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, subtitle: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>URL du logo</Label>
                        <Input
                          value={selectedBlockData.content.logoUrl}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, logoUrl: e.target.value }
                          })}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label>Image de fond</Label>
                        <Input
                          value={selectedBlockData.content.backgroundImage}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, backgroundImage: e.target.value }
                          })}
                          placeholder="https://..."
                        />
                      </div>
                    </>
                  )}

                  {selectedBlockData.type === 'text' && (
                    <div>
                      <Label>Contenu</Label>
                      <Textarea
                        value={selectedBlockData.content.content}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, content: e.target.value }
                        })}
                        rows={4}
                      />
                    </div>
                  )}

                  {selectedBlockData.type === 'services' && (
                    <>
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={selectedBlockData.content.title}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, title: e.target.value }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Afficher les prix</Label>
                        <Switch
                          checked={selectedBlockData.content.showPrices}
                          onCheckedChange={(checked) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, showPrices: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Afficher la durée</Label>
                        <Switch
                          checked={selectedBlockData.content.showDuration}
                          onCheckedChange={(checked) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, showDuration: checked }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {selectedBlockData.type === 'booking-form' && (
                    <>
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={selectedBlockData.content.title}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, title: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Texte du bouton</Label>
                        <Input
                          value={selectedBlockData.content.buttonText}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, buttonText: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Style Properties */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Apparence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Couleur de fond</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="color"
                        value={selectedBlockData.style.backgroundColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, backgroundColor: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={selectedBlockData.style.backgroundColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, backgroundColor: e.target.value }
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Couleur du texte</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="color"
                        value={selectedBlockData.style.textColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, textColor: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={selectedBlockData.style.textColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, textColor: e.target.value }
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {selectedBlockData.type === 'booking-form' && (
                    <div>
                      <Label>Couleur du bouton</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          type="color"
                          value={selectedBlockData.style.buttonColor}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            style: { ...selectedBlockData.style, buttonColor: e.target.value }
                          })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={selectedBlockData.style.buttonColor}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            style: { ...selectedBlockData.style, buttonColor: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Padding</Label>
                    <Input
                      value={selectedBlockData.style.padding}
                      onChange={(e) => updateBlock(selectedBlockData.id, {
                        style: { ...selectedBlockData.style, padding: e.target.value }
                      })}
                      placeholder="40px"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}