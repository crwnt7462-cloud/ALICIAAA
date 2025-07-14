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

  const [pageDesign, setPageDesign] = useState<PageDesign>({
    name: "Réservation Rapide",
    slug: "reservation-rapide",
    blocks: [
      {
        id: "hero-section",
        type: "text",
        content: {
          content: `<div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 text-center">
            <h1 class="text-4xl font-bold mb-2">Réservation Express</h1>
            <p class="text-xl opacity-90 mb-6">Prenez rendez-vous en 3 étapes simples</p>
            <div class="flex items-center justify-center space-x-4 mb-6">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold">1</span>
                </div>
                <span class="text-sm">Service</span>
              </div>
              <div class="w-8 h-0.5 bg-white/30"></div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold">2</span>
                </div>
                <span class="text-sm">Créneau</span>
              </div>
              <div class="w-8 h-0.5 bg-white/30"></div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold">3</span>
                </div>
                <span class="text-sm">Confirmation</span>
              </div>
            </div>
            <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span class="text-green-300 mr-2">✓</span>
              <span class="text-sm">Confirmation instantanée</span>
            </div>
          </div>`,
          alignment: "center"
        },
        style: {
          backgroundColor: "#A855F7",
          textColor: "#FFFFFF",
          padding: "0px"
        },
        order: 0
      },
      {
        id: "booking-form",
        type: "booking-form",
        content: {
          title: "Réservez votre créneau",
          subtitle: "Choisissez votre service et votre horaire préféré",
          buttonText: "Confirmer ma réservation",
          requireDeposit: true,
          depositAmount: 15,
          services: [
            {
              name: "Coupe + Brushing",
              price: 45,
              duration: 60,
              popular: true,
              depositRequired: 15
            },
            {
              name: "Coloration complète",
              price: 85,
              duration: 120,
              popular: false,
              depositRequired: 20
            },
            {
              name: "Mèches + Brushing",
              price: 75,
              duration: 90,
              popular: false,
              depositRequired: 20
            },
            {
              name: "Brushing seul",
              price: 25,
              duration: 30,
              popular: false,
              depositRequired: 10
            },
            {
              name: "Soin capillaire",
              price: 35,
              duration: 45,
              popular: false,
              depositRequired: 10
            }
          ],
          availableSlots: [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
          ]
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          padding: "32px",
          buttonColor: "#A855F7",
          buttonStyle: "rounded-lg"
        },
        order: 1
      },
      {
        id: "guarantees",
        type: "text",
        content: {
          content: `<div class="bg-gray-50 p-6">
            <h3 class="text-xl font-semibold text-center mb-6 text-gray-800">Nos garanties</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 class="font-semibold text-sm">Confirmation immédiate</h4>
                  <p class="text-xs text-gray-600">Votre RDV confirmé en temps réel</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-bold">↻</span>
                </div>
                <div>
                  <h4 class="font-semibold text-sm">Annulation gratuite</h4>
                  <p class="text-xs text-gray-600">Jusqu'à 24h avant le RDV</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-bold">€</span>
                </div>
                <div>
                  <h4 class="font-semibold text-sm">Acompte sécurisé</h4>
                  <p class="text-xs text-gray-600">Paiement 100% sécurisé</p>
                </div>
              </div>
            </div>
          </div>`,
          alignment: "center"
        },
        style: {
          backgroundColor: "#F9FAFB",
          textColor: "#1F2937",
          padding: "0px"
        },
        order: 2
      },
      {
        id: "contact-info",
        type: "text",
        content: {
          content: `<div class="bg-white p-6 text-center border-t">
            <h3 class="text-lg font-semibold mb-4">Salon Belle Époque</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p class="flex items-center justify-center gap-2">
                <span>📍</span>
                <span>123 Rue de la Beauté, 75001 Paris</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span>📞</span>
                <span>01 23 45 67 89</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span>🕒</span>
                <span>Ouvert du mardi au samedi, 9h-19h</span>
              </p>
            </div>
            <div class="mt-4 pt-4 border-t text-xs text-gray-500">
              <p>En cas d'urgence, contactez-nous directement au 01 23 45 67 89</p>
            </div>
          </div>`,
          alignment: "center"
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          padding: "0px"
        },
        order: 3
      }
    ],
    theme: {
      primaryColor: "#A855F7",
      secondaryColor: "#C084FC", 
      fontFamily: "Inter",
      buttonStyle: "rounded"
    },
    settings: {
      isPublished: true,
      metaTitle: "Réservation Express - Prenez RDV rapidement",
      metaDescription: "Réservez votre rendez-vous en 3 étapes simples et rapides."
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
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: block.content.content }}
                    />
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
                    <div className="max-w-2xl mx-auto">
                      <div className="text-center mb-8">
                        <h2 className={`font-bold mb-2 ${activeView === 'mobile' ? 'text-xl' : 'text-3xl'}`}>{block.content.title}</h2>
                        {block.content.subtitle && (
                          <p className={`opacity-90 mb-6 ${activeView === 'mobile' ? 'text-sm' : 'text-lg'}`}>{block.content.subtitle}</p>
                        )}
                      </div>
                      
                      {/* Progress Steps */}
                      <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full font-bold text-sm">1</div>
                          <div className="w-16 h-1 bg-purple-600"></div>
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-bold text-sm">2</div>
                          <div className="w-16 h-1 bg-gray-300"></div>
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-bold text-sm">3</div>
                        </div>
                      </div>

                      {/* Step 1: Service Selection */}
                      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Choisissez votre service</h3>
                        <div className="space-y-3">
                          {block.content.services?.map((service, index) => (
                            <div key={index} className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${service.popular ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-200'}`}>
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-lg">{service.name}</span>
                                    {service.popular && (
                                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">Populaire</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>⏱️ {service.duration} min</span>
                                    <span>💰 Acompte: {service.depositRequired}€</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-purple-600">{service.price}€</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-6">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                            Continuer → Choisir l'horaire
                          </Button>
                        </div>
                      </div>

                      {/* Step 2: Time Selection (Initially Hidden) */}
                      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 opacity-50 pointer-events-none">
                        <h3 className="text-xl font-bold mb-4 text-center">Sélectionnez votre créneau</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">Aujourd'hui</span>
                            <span className="font-semibold">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {block.content.availableSlots?.map((slot, index) => (
                              <button key={index} className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-medium hover:bg-purple-50 hover:border-purple-300 transition-colors">
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-center mt-6">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                            Continuer → Vos informations
                          </Button>
                        </div>
                      </div>

                      {/* Step 3: Contact Form (Initially Hidden) */}
                      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 opacity-50 pointer-events-none">
                        <h3 className="text-xl font-bold mb-4 text-center">Vos informations</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Prénom" className="bg-white" />
                            <Input placeholder="Nom" className="bg-white" />
                          </div>
                          <Input placeholder="Email" className="bg-white" />
                          <Input placeholder="Téléphone" className="bg-white" />
                          <textarea 
                            placeholder="Message ou demande particulière (optionnel)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                            rows={3}
                          />
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mt-6 mb-6">
                          <h4 className="font-semibold mb-3">Récapitulatif de votre réservation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Service sélectionné</span>
                              <span className="font-medium">Coupe + Brushing</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Date et heure</span>
                              <span className="font-medium">Aujourd'hui 14h30</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Durée</span>
                              <span className="font-medium">60 min</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Prix total</span>
                              <span className="font-medium">45€</span>
                            </div>
                            {block.content.requireDeposit && (
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Acompte à régler maintenant</span>
                                <span className="text-purple-600">{block.content.depositAmount}€</span>
                              </div>
                            )}
                          </div>
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
                        
                        <p className="text-xs text-gray-600 mt-3 text-center">
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
                      <Label>Texte à afficher</Label>
                      <Textarea
                        value={selectedBlockData.content.content.replace(/<[^>]*>/g, '')}
                        onChange={(e) => updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, content: e.target.value }
                        })}
                        rows={4}
                        placeholder="Votre texte ici..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Le texte sera affiché tel quel sur votre page</p>
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