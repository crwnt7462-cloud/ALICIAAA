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
  type: 'header' | 'text' | 'services' | 'contact' | 'testimonials' | 'booking-form' | 'team' | 'gallery' | 'promotions' | 'pricing';
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

  // Template "Réservation Express" - Page de réservation en 3 étapes
  const loadProTemplate = () => {
    const proTemplate: PageDesign = {
      name: "Réservation Express",
      slug: "reservation-express",
      blocks: [
        {
          id: "header-1",
          type: "header",
          content: {
            title: "Réservation Express",
            subtitle: "Réservez votre rendez-vous en 3 étapes simples",
            backgroundImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200",
            logoUrl: "",
            ctaText: "Commencer la réservation",
            showCta: true
          },
          style: {
            backgroundColor: "#8B5CF6",
            textColor: "#FFFFFF",
            alignment: "center",
            height: "400px",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "0px",
            animation: "fadeIn"
          },
          order: 0
        },
        {
          id: "booking-form-1",
          type: "booking-form",
          content: {
            title: "Étape 1 - Choisissez votre service",
            subtitle: "Sélectionnez la prestation qui vous intéresse",
            buttonText: "Continuer →",
            showInstantBooking: true,
            requireDeposit: true,
            depositAmount: 20,
            stepByStep: true
          },
          style: {
            backgroundColor: "#FFFFFF",
            textColor: "#1F2937",
            padding: "40px",
            borderRadius: "12px",
            shadow: "lg",
            border: "1px solid #E5E7EB"
          },
          order: 1
        },
        {
          id: "services-1",
          type: "services",
          content: {
            title: "Nos Services Disponibles",
            subtitle: "Choisissez parmi nos prestations premium",
            showPrices: true,
            showDuration: true,
            layout: "list",
            showBookingButton: true,
            quickSelect: true
          },
          style: {
            backgroundColor: "#F8FAFC",
            textColor: "#1F2937",
            padding: "40px",
            borderRadius: "0px"
          },
          order: 2
        },
        {
          id: "text-1",
          type: "text",
          content: {
            content: `<div class="text-center space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-purple-600 font-bold text-xl">1</span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-2">Choisissez</h3>
                  <p class="text-gray-600 text-sm">Sélectionnez votre service parmi nos prestations</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-2">Planifiez</h3>
                  <p class="text-gray-600 text-sm">Choisissez votre créneau préféré</p>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-green-600 font-bold text-xl">3</span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-2">Confirmez</h3>
                  <p class="text-gray-600 text-sm">Finalisez votre réservation</p>
                </div>
              </div>
            </div>`,
            alignment: "center"
          },
          style: {
            backgroundColor: "#FFFFFF",
            textColor: "#1F2937",
            padding: "60px 40px"
          },
          order: 3
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          content: {
            title: "Ce que disent nos clients",
            subtitle: "Plus de 1000 clients satisfaits",
            layout: "carousel",
            autoplay: true
          },
          style: {
            backgroundColor: "#F8FAFC",
            textColor: "#1F2937",
            padding: "60px 40px"
          },
          order: 4
        }
      ],
      theme: {
        primaryColor: "#667eea",
        secondaryColor: "#764ba2",
        fontFamily: "Inter",
        buttonStyle: "rounded"
      },
      settings: {
        isPublished: true,
        metaTitle: "Réservation Express - Prenez RDV en 3 étapes",
        metaDescription: "Réservez votre rendez-vous rapidement en 3 étapes simples. Choisissez, planifiez, confirmez."
      }
    };
    
    setPageDesign(proTemplate);
    toast({
      title: "Réservation Express chargée",
      description: "Page de réservation en 3 étapes chargée avec succès",
    });
  };

  const [pageDesign, setPageDesign] = useState<PageDesign>({
    name: "Réservation Express",
    slug: "reservation-express",
    blocks: [
      {
        id: "header-1",
        type: "header",
        content: {
          title: "Réservation Express",
          subtitle: "Réservez votre rendez-vous en 3 étapes simples",
          backgroundImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200",
          logoUrl: "",
          ctaText: "Commencer la réservation",
          showCta: true
        },
        style: {
          backgroundColor: "#8B5CF6",
          textColor: "#FFFFFF",
          alignment: "center",
          height: "400px",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "0px",
          animation: "fadeIn"
        },
        order: 0
      },
      {
        id: "booking-form-1",
        type: "booking-form",
        content: {
          title: "Étape 1 - Choisissez votre service",
          subtitle: "Sélectionnez la prestation qui vous intéresse",
          buttonText: "Continuer →",
          showInstantBooking: true,
          requireDeposit: true,
          depositAmount: 20,
          stepByStep: true
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          padding: "40px",
          borderRadius: "12px",
          shadow: "lg",
          border: "1px solid #E5E7EB"
        },
        order: 1
      },
      {
        id: "services-1",
        type: "services",
        content: {
          title: "Nos Services Disponibles",
          subtitle: "Choisissez parmi nos prestations premium",
          showPrices: true,
          showDuration: true,
          layout: "list",
          showBookingButton: true,
          quickSelect: true
        },
        style: {
          backgroundColor: "#F8FAFC",
          textColor: "#1F2937",
          padding: "40px",
          borderRadius: "0px"
        },
        order: 2
      },
      {
        id: "text-1",
        type: "text",
        content: {
          content: `<div class="text-center space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-lg shadow-sm border">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-purple-600 font-bold text-xl">1</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Choisissez</h3>
                <p class="text-gray-600 text-sm">Sélectionnez votre service parmi nos prestations</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-sm border">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Planifiez</h3>
                <p class="text-gray-600 text-sm">Choisissez votre créneau préféré</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-sm border">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Confirmez</h3>
                <p class="text-gray-600 text-sm">Finalisez votre réservation</p>
              </div>
            </div>
          </div>`,
          alignment: "center"
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          padding: "60px 40px"
        },
        order: 3
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        content: {
          title: "Ce que disent nos clients",
          subtitle: "Plus de 1000 clients satisfaits",
          layout: "carousel",
          autoplay: true
        },
        style: {
          backgroundColor: "#F8FAFC",
          textColor: "#1F2937",
          padding: "60px 40px"
        },
        order: 4
      }
    ],
    theme: {
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      fontFamily: "Inter",
      buttonStyle: "rounded"
    },
    settings: {
      isPublished: true,
      metaTitle: "Réservation Express - Prenez RDV en 3 étapes",
      metaDescription: "Réservez votre rendez-vous rapidement en 3 étapes simples. Choisissez, planifiez, confirmez."
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
    { type: 'booking-form', icon: Calendar, label: 'Réservation', description: 'Formulaire de réservation rapide' },
    { type: 'testimonials', icon: Star, label: 'Témoignages', description: 'Avis clients' },
    { type: 'contact', icon: Type, label: 'Contact', description: 'Informations de contact' },
    { type: 'gallery', icon: Image, label: 'Galerie', description: 'Photos du salon' },
    { type: 'pricing', icon: Square, label: 'Tarifs', description: 'Grille tarifaire' },
    { type: 'team', icon: Type, label: 'Équipe', description: 'Présentation de l\'équipe' },
    { type: 'promotions', icon: Star, label: 'Promotions', description: 'Offres spéciales' },
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
        return { title: 'Nouveau titre', subtitle: 'Sous-titre', backgroundImage: '', logoUrl: '', ctaText: 'Réserver maintenant', showCta: true };
      case 'text':
        return { content: 'Votre texte ici...', alignment: 'left' };
      case 'services':
        return { title: 'Nos Services', showPrices: true, showDuration: true, layout: 'grid', showBookingButton: true };
      case 'booking-form':
        return { 
          title: 'Réservation Express', 
          subtitle: 'Réservez en 30 secondes', 
          buttonText: 'Réserver & Payer',
          showInstantBooking: true,
          requireDeposit: true,
          depositAmount: 20
        };
      case 'testimonials':
        return { title: 'Témoignages', layout: 'carousel' };
      case 'contact':
        return { title: 'Contact', address: '', phone: '', email: '', showMap: true };
      case 'gallery':
        return { title: 'Notre Salon', layout: 'masonry', images: [] };
      case 'pricing':
        return { title: 'Nos Tarifs', layout: 'table', showPromotions: true };
      case 'team':
        return { title: 'Notre Équipe', layout: 'cards', showSpecialties: true };
      case 'promotions':
        return { title: 'Offres Spéciales', layout: 'cards', showCountdown: true };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type: string) => {
    switch (type) {
      case 'header':
        return { 
          backgroundColor: '#8B5CF6', 
          textColor: '#FFFFFF', 
          alignment: 'center', 
          height: '400px',
          gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          borderRadius: '0px',
          animation: 'fadeIn'
        };
      case 'services':
        return { 
          backgroundColor: '#F8FAFC', 
          textColor: '#1F2937', 
          padding: '60px 40px',
          borderRadius: '16px',
          shadow: 'lg'
        };
      case 'booking-form':
        return { 
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          textColor: '#FFFFFF', 
          padding: '60px',
          borderRadius: '24px',
          buttonColor: '#10B981',
          buttonStyle: 'rounded-full'
        };
      default:
        return { 
          backgroundColor: '#FFFFFF', 
          textColor: '#1F2937', 
          padding: '40px',
          borderRadius: '8px',
          shadow: 'sm'
        };
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
      <div className="w-80 lg:w-80 md:w-72 sm:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
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
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Toolbar - Visible only on mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
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
            
            <Button
              onClick={() => savePageMutation.mutate(pageDesign)}
              disabled={savePageMutation.isPending}
              size="sm"
            >
              {savePageMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
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
                  } ${activeView === 'mobile' ? 'text-sm' : ''}`}
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
                      <div className="flex flex-col items-center justify-center h-full relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10 text-center">
                          {block.content.logoUrl && (
                            <img src={block.content.logoUrl} alt="Logo" className={`mb-6 drop-shadow-lg ${activeView === 'mobile' ? 'h-12' : 'h-20'}`} />
                          )}
                          <h1 className={`font-bold mb-4 drop-shadow-lg ${activeView === 'mobile' ? 'text-3xl' : 'text-5xl'}`}>{block.content.title}</h1>
                          <p className={`opacity-95 mb-6 drop-shadow ${activeView === 'mobile' ? 'text-lg' : 'text-2xl'}`}>{block.content.subtitle}</p>
                          {block.content.showCta && (
                            <Button 
                              size="lg"
                              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                              {block.content.ctaText}
                            </Button>
                          )}
                        </div>
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
                      <h2 className={`font-bold mb-6 text-center ${activeView === 'mobile' ? 'text-xl mb-4' : 'text-2xl'}`}>{block.content.title}</h2>
                      <div className={`grid gap-4 ${block.content.layout === 'grid' && activeView !== 'mobile' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {[
                          { name: "Coupe femme", price: 45, duration: 60, popular: true },
                          { name: "Coloration", price: 80, duration: 120, popular: false },
                          { name: "Brushing", price: 30, duration: 45, popular: false },
                          { name: "Balayage", price: 120, duration: 180, popular: true }
                        ].map((service, index) => (
                          <div key={index} className={`border rounded-xl p-4 transition-all hover:shadow-lg ${service.popular ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{service.name}</h3>
                                  {service.popular && (
                                    <Badge className="bg-purple-600 text-white text-xs">Populaire</Badge>
                                  )}
                                </div>
                                {block.content.showDuration && (
                                  <p className="text-sm text-gray-600 mt-1">⏱️ {service.duration} min</p>
                                )}
                              </div>
                              {block.content.showPrices && (
                                <div className="text-right">
                                  <span className="font-bold text-2xl text-purple-600">{service.price}€</span>
                                </div>
                              )}
                            </div>
                            {block.content.showBookingButton && (
                              <Button 
                                size="sm" 
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                                onClick={() => window.open('/quick-booking', '_blank')}
                              >
                                Réserver maintenant
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'booking-form' && (
                    <div className="text-center">
                      <h2 className={`font-bold mb-2 ${activeView === 'mobile' ? 'text-xl' : 'text-3xl'}`}>{block.content.title}</h2>
                      {block.content.subtitle && (
                        <p className={`opacity-90 mb-6 ${activeView === 'mobile' ? 'text-sm' : 'text-lg'}`}>{block.content.subtitle}</p>
                      )}
                      
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Prénom" className="bg-white/90" />
                          <Input placeholder="Nom" className="bg-white/90" />
                        </div>
                        <Input placeholder="Email" className="bg-white/90" />
                        <Input placeholder="Téléphone" className="bg-white/90" />
                        
                        <div className="bg-white/10 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm opacity-80">Service sélectionné</span>
                            <span className="font-semibold">Coupe + Brushing</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm opacity-80">Date souhaitée</span>
                            <span className="font-semibold">Aujourd'hui 14h30</span>
                          </div>
                          {block.content.requireDeposit && (
                            <div className="flex justify-between items-center border-t border-white/20 pt-2">
                              <span className="text-sm opacity-80">Acompte à régler</span>
                              <span className="font-bold text-lg">{block.content.depositAmount}€</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className={`w-full text-lg py-6 ${block.style.buttonStyle === 'rounded-full' ? 'rounded-full' : 'rounded-lg'} shadow-xl transform hover:scale-105 transition-all duration-200`}
                          style={{ backgroundColor: block.style.buttonColor }}
                          onClick={() => window.open('/quick-booking', '_blank')}
                        >
                          ⚡ {block.content.buttonText}
                          {block.content.requireDeposit && (
                            <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                              Acompte {block.content.depositAmount}€
                            </span>
                          )}
                        </Button>
                        
                        <p className="text-xs opacity-70 mt-3">
                          🔒 Paiement sécurisé • Confirmation immédiate • Annulation gratuite 24h avant
                        </p>
                      </div>
                    </div>
                  )}

                  {block.type === 'gallery' && (
                    <div>
                      <h2 className={`font-bold mb-6 text-center ${activeView === 'mobile' ? 'text-xl' : 'text-2xl'}`}>{block.content.title}</h2>
                      <div className={`grid gap-4 ${activeView === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Image className="w-8 h-8 text-purple-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'pricing' && (
                    <div>
                      <h2 className={`font-bold mb-6 text-center ${activeView === 'mobile' ? 'text-xl' : 'text-2xl'}`}>{block.content.title}</h2>
                      <div className="space-y-3">
                        {[
                          { category: "Coupes", services: [
                            { name: "Coupe femme", price: "45€", duration: "45min" },
                            { name: "Coupe homme", price: "35€", duration: "30min" }
                          ]},
                          { category: "Couleurs", services: [
                            { name: "Coloration", price: "80€", duration: "2h" },
                            { name: "Balayage", price: "120€", duration: "3h" }
                          ]}
                        ].map((category, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3 text-purple-600">{category.category}</h3>
                            {category.services.map((service, i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <span className="font-medium">{service.name}</span>
                                  <span className="text-sm text-gray-500 ml-2">({service.duration})</span>
                                </div>
                                <span className="font-bold text-purple-600">{service.price}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'team' && (
                    <div>
                      <h2 className={`font-bold mb-6 text-center ${activeView === 'mobile' ? 'text-xl' : 'text-2xl'}`}>{block.content.title}</h2>
                      <div className={`grid gap-6 ${activeView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                        {[
                          { name: "Sophie Martin", role: "Styliste Senior", specialties: "Coupes, Couleurs" },
                          { name: "Emma Dubois", role: "Coloriste", specialties: "Balayages, Méchés" },
                          { name: "Julie Moreau", role: "Coiffeuse", specialties: "Brushings, Soins" }
                        ].map((member, index) => (
                          <div key={index} className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <span className="text-2xl">👩‍💼</span>
                            </div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-purple-600 font-medium">{member.role}</p>
                            {block.content.showSpecialties && (
                              <p className="text-sm text-gray-600 mt-1">{member.specialties}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'promotions' && (
                    <div>
                      <h2 className={`font-bold mb-6 text-center ${activeView === 'mobile' ? 'text-xl' : 'text-2xl'}`}>{block.content.title}</h2>
                      <div className={`grid gap-4 ${activeView === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {[
                          { title: "Offre Découverte", description: "Première visite -30%", price: "31€", originalPrice: "45€", badge: "Nouveau client" },
                          { title: "Duo Amies", description: "2 coupes pour le prix d'1.5", price: "67€", originalPrice: "90€", badge: "Limitée" }
                        ].map((promo, index) => (
                          <div key={index} className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 rounded-full text-xs font-bold">
                              {promo.badge}
                            </div>
                            <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
                            <p className="opacity-90 mb-4">{promo.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold">{promo.price}</span>
                              <span className="text-lg line-through opacity-70">{promo.originalPrice}</span>
                            </div>
                            {block.content.showCountdown && (
                              <div className="mt-3 text-sm opacity-80">
                                ⏰ Plus que 2 jours !
                              </div>
                            )}
                          </div>
                        ))}
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

        {/* Mobile Bottom Sheet for Block Properties */}
        {selectedBlockData && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-h-96 overflow-y-auto z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {blockTypes.find(t => t.type === selectedBlockData.type)?.label}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBlock(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Same properties as desktop but condensed */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contenu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedBlockData.type === 'header' && (
                      <>
                        <div>
                          <Label className="text-xs">Titre</Label>
                          <Input
                            value={selectedBlockData.content.title}
                            onChange={(e) => updateBlock(selectedBlockData.id, {
                              content: { ...selectedBlockData.content, title: e.target.value }
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Sous-titre</Label>
                          <Input
                            value={selectedBlockData.content.subtitle}
                            onChange={(e) => updateBlock(selectedBlockData.id, {
                              content: { ...selectedBlockData.content, subtitle: e.target.value }
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </>
                    )}

                    {selectedBlockData.type === 'text' && (
                      <div>
                        <Label className="text-xs">Contenu</Label>
                        <Textarea
                          value={selectedBlockData.content.content}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, content: e.target.value }
                          })}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedBlockData.type === 'services' && (
                      <>
                        <div>
                          <Label className="text-xs">Titre</Label>
                          <Input
                            value={selectedBlockData.content.title}
                            onChange={(e) => updateBlock(selectedBlockData.id, {
                              content: { ...selectedBlockData.content, title: e.target.value }
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Afficher les prix</Label>
                          <Switch
                            checked={selectedBlockData.content.showPrices}
                            onCheckedChange={(checked) => updateBlock(selectedBlockData.id, {
                              content: { ...selectedBlockData.content, showPrices: checked }
                            })}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Couleurs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={selectedBlockData.style.backgroundColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, backgroundColor: e.target.value }
                        })}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        type="color"
                        value={selectedBlockData.style.textColor}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          style: { ...selectedBlockData.style, textColor: e.target.value }
                        })}
                        className="w-12 h-8 p-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Block Menu - Swipe up bottom sheet */}
        <div className="md:hidden">
          <input type="checkbox" id="mobile-blocks-toggle" className="hidden peer" />
          
          {/* Floating Action Button */}
          <label 
            htmlFor="mobile-blocks-toggle" 
            className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-6 h-6 text-white" />
          </label>

          {/* Bottom Sheet for Block Selection */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform translate-y-full peer-checked:translate-y-0 transition-transform duration-300">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Ajouter un bloc</h3>
                  <label htmlFor="mobile-blocks-toggle" className="cursor-pointer">
                    <Button variant="ghost" size="sm">✕</Button>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {blockTypes.map((blockType) => (
                    <label 
                      key={blockType.type}
                      htmlFor="mobile-blocks-toggle"
                      className="cursor-pointer"
                      onClick={() => addBlock(blockType.type)}
                    >
                      <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50">
                        <blockType.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-medium">{blockType.label}</p>
                        <p className="text-xs text-gray-500">{blockType.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedBlockData && (
          <div className="w-80 lg:w-80 md:w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden md:block">
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
                      <div className="flex items-center justify-between">
                        <Label>Boutons de réservation</Label>
                        <Switch
                          checked={selectedBlockData.content.showBookingButton}
                          onCheckedChange={(checked) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, showBookingButton: checked }
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
                        <Label>Sous-titre</Label>
                        <Input
                          value={selectedBlockData.content.subtitle}
                          onChange={(e) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, subtitle: e.target.value }
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
                      <div className="flex items-center justify-between">
                        <Label>Acompte requis</Label>
                        <Switch
                          checked={selectedBlockData.content.requireDeposit}
                          onCheckedChange={(checked) => updateBlock(selectedBlockData.id, {
                            content: { ...selectedBlockData.content, requireDeposit: checked }
                          })}
                        />
                      </div>
                      {selectedBlockData.content.requireDeposit && (
                        <div>
                          <Label>Montant de l'acompte (€)</Label>
                          <Input
                            type="number"
                            value={selectedBlockData.content.depositAmount}
                            onChange={(e) => updateBlock(selectedBlockData.id, {
                              content: { ...selectedBlockData.content, depositAmount: parseInt(e.target.value) }
                            })}
                          />
                        </div>
                      )}
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