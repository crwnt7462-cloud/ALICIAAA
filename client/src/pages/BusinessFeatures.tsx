import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Store,
  Settings,
  CreditCard,
  BarChart3,
  Package,
  Target,
  Clock,
  Euro,
  Star,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Share2,
  Copy,
  QrCode,
  MessageCircle,
  Crown
} from "lucide-react";

export default function BusinessFeatures() {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pro Tools
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Fonctionnalités avancées Planity & Treatwell
        </p>
      </div>

      {/* Section Abonnement */}
      <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Abonnement Pro</h3>
                <p className="text-sm text-gray-600">Déverrouillez toutes les fonctionnalités</p>
              </div>
            </div>
            <Badge className="bg-amber-600 text-white">Nouvelle offre</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div>
              <div className="text-lg font-bold text-amber-600">Pro</div>
              <div className="text-xs text-gray-600">49€/mois</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600">Premium</div>
              <div className="text-xs text-gray-600">149€/mois</div>
            </div>
          </div>
          
          <Button 
            onClick={() => setLocation("/subscription-plans")}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            Voir les plans d'abonnement
          </Button>
        </CardContent>
      </Card>

      {/* Messagerie Premium - Section spéciale */}
      <Card className="mb-6 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Messagerie Pro
                  <Crown className="w-4 h-4 text-violet-600" />
                </h3>
                <p className="text-sm text-gray-600">Communiquez directement avec vos clients</p>
              </div>
            </div>
            <Badge className="bg-violet-600 text-white">Premium</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="text-lg font-bold text-violet-600">24h</div>
              <div className="text-xs text-gray-600">Réponse rapide</div>
            </div>
            <div>
              <div className="text-lg font-bold text-violet-600">∞</div>
              <div className="text-xs text-gray-600">Messages illimités</div>
            </div>
            <div>
              <div className="text-lg font-bold text-violet-600">100%</div>
              <div className="text-xs text-gray-600">Sécurisé</div>
            </div>
          </div>
          
          <Button 
            onClick={() => setLocation("/direct-messaging")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            Ouvrir la messagerie
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-3">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Config</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex flex-col items-center gap-1 py-3">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Paiements</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex flex-col items-center gap-1 py-3">
            <Store className="h-4 w-4" />
            <span className="text-xs">Pages</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory" className="flex flex-col items-center gap-1 py-3">
            <Package className="h-4 w-4" />
            <span className="text-xs">Stock</span>
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex flex-col items-center gap-1 py-3">
            <Target className="h-4 w-4" />
            <span className="text-xs">Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="h-4 w-4" />
                Configuration Salon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <Label className="text-sm">Nom du salon</Label>
                <Input placeholder="Mon Salon Beauty" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Adresse</Label>
                <Input placeholder="123 Rue de la Beauté, Paris" className="h-9" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-sm">Téléphone</Label>
                  <Input placeholder="01 23 45 67 89" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Email</Label>
                  <Input placeholder="contact@salon.fr" className="h-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Horaires</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" defaultValue="09:00" className="h-9" />
                  <Input type="time" defaultValue="18:00" className="h-9" />
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => toast({ title: "Configuration sauvegardée", description: "Les paramètres du salon ont été mis à jour" })}
              >
                Sauvegarder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Options Réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Confirmation auto</Label>
                <Switch 
                  defaultChecked 
                  onCheckedChange={(checked) => 
                    toast({ 
                      title: checked ? "Confirmation auto activée" : "Confirmation auto désactivée",
                      description: "Paramètre mis à jour"
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Booking en ligne</Label>
                <Switch 
                  defaultChecked 
                  onCheckedChange={(checked) => 
                    toast({ 
                      title: checked ? "Booking en ligne activé" : "Booking en ligne désactivé",
                      description: "Paramètre mis à jour"
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Acompte obligatoire</Label>
                <Switch 
                  onCheckedChange={(checked) => 
                    toast({ 
                      title: checked ? "Acompte obligatoire activé" : "Acompte obligatoire désactivé",
                      description: "Paramètre mis à jour"
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Annulation</Label>
                <Select onValueChange={(value) => 
                  toast({ 
                    title: "Politique d'annulation mise à jour",
                    description: `Nouveau délai: ${value}`
                  })
                }>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Politique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24h avant</SelectItem>
                    <SelectItem value="48h">48h avant</SelectItem>
                    <SelectItem value="no-refund">Non remboursable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paiements Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-4 w-4" />
                Méthodes de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                {[
                  { name: "Carte bancaire", status: "Actif" },
                  { name: "Espèces", status: "Actif" },
                  { name: "Chèques", status: "Inactif" },
                ].map((method, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => toast({ 
                      title: `Méthode de paiement: ${method.name}`,
                      description: `Statut: ${method.status}`
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">{method.name}</span>
                    </div>
                    <Badge variant={method.status === "Actif" ? "default" : "secondary"}>
                      {method.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ 
                  title: "Nouvelle méthode", 
                  description: "Fonction disponible avec l'abonnement Pro" 
                })}
              >
                + Ajouter méthode
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Euro className="h-4 w-4" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { client: "Marie D.", amount: "65€", status: "Payé" },
                { client: "Sophie L.", amount: "45€", status: "En attente" },
                { client: "Emma M.", amount: "80€", status: "Payé" },
              ].map((transaction, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => toast({ 
                    title: `Transaction: ${transaction.client}`,
                    description: `Montant: ${transaction.amount} - Statut: ${transaction.status}`
                  })}
                >
                  <div>
                    <p className="text-sm font-medium">{transaction.client}</p>
                    <p className="text-xs text-gray-500">Aujourd'hui</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{transaction.amount}</p>
                    <Badge variant={transaction.status === "Payé" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-4 w-4" />
                Partage de lien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <Label className="text-sm">Lien de réservation personnalisé</Label>
                <div className="flex gap-2">
                  <Input 
                    value="beautybook.com/book/mon-salon"
                    readOnly
                    className="h-9 text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText('https://beautybook.com/book/mon-salon');
                      toast({ title: "Lien copié!" });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">QR Code</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">QR Code généré</p>
                    <p className="text-xs text-gray-600">Pour impression ou affichage</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({ 
                      title: "QR Code téléchargé", 
                      description: "Le fichier sera disponible dans vos téléchargements" 
                    })}
                  >
                    Télécharger
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Partage rapide</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    onClick={() => {
                      const message = "Bonjour ! Voici le lien pour réserver dans mon salon : https://beauty.app/book/monsalon";
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    onClick={() => {
                      const subject = "Réservez dans mon salon";
                      const body = "Bonjour,%0D%0A%0D%0AVoici le lien pour réserver dans mon salon : https://beauty.app/book/monsalon";
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                    }}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="h-4 w-4" />
                Pages de Réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                {[
                  { name: "Page Principale", url: "/book/main", active: true },
                  { name: "Offres Spéciales", url: "/book/promo", active: false },
                ].map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{page.name}</p>
                      <p className="text-xs text-gray-500">{page.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.active ? "default" : "secondary"}>
                        {page.active ? "Actif" : "Inactif"}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast({ title: "Page ouverte", description: `Ouverture de ${page.name}` });
                          setLocation(`/booking`);
                        }}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({ title: "Créateur de pages", description: "Ouverture du créateur de pages" });
                  setLocation('/page-builder');
                }}
              >
                + Créer nouvelle page
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-4 w-4" />
                Partage & QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <Label className="text-sm">Lien de réservation</Label>
                <div className="flex gap-2">
                  <Input 
                    value="https://beauty.app/book/monsalon" 
                    readOnly 
                    className="h-9 text-xs"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText("https://beauty.app/book/monsalon");
                      toast({ title: "Lien copié !", description: "Le lien a été copié dans le presse-papiers" });
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs">QR Code</span>
                </div>
                <p className="text-xs">Scan pour réserver</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toast({ title: "QR Code téléchargé", description: "Le QR code a été sauvegardé" })}
                >
                  Télécharger QR
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Réservez dans mon salon',
                        url: 'https://beauty.app/book/monsalon'
                      });
                    } else {
                      navigator.clipboard.writeText("https://beauty.app/book/monsalon");
                      toast({ title: "Lien copié !", description: "Le lien a été copié dans le presse-papiers" });
                    }
                  }}
                >
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-4 w-4" />
                Inventaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { name: "Shampoing Pro", stock: 12, alert: false },
                { name: "Masque Hydratant", stock: 3, alert: true },
                { name: "Sérum Anti-Age", stock: 8, alert: false },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => toast({ 
                    title: `Produit: ${item.name}`,
                    description: `Stock actuel: ${item.stock} unités${item.alert ? ' - Stock bas!' : ''}`
                  })}
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.alert && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    <Badge variant={item.alert ? "destructive" : "default"}>
                      {item.alert ? "Stock bas" : "OK"}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <Link to="/inventory">
                  <Button 
                    size="sm" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Gérer Stock
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({ title: "Produit ajouté", description: "Le produit a été ajouté à l'inventaire" })}
                >
                  + Nouveau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-4 w-4" />
                Campagnes Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { name: "Promo Nouvel An", status: "Active", reach: "156 clients" },
                { name: "Fidélité VIP", status: "Programmée", reach: "89 clients" },
              ].map((campaign, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => toast({ 
                    title: `Campagne: ${campaign.name}`,
                    description: `Portée: ${campaign.reach} - Statut: ${campaign.status}`
                  })}
                >
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-gray-500">{campaign.reach}</p>
                  </div>
                  <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "Campagne créée", description: "Nouvelle campagne marketing en préparation" })}
              >
                + Nouvelle campagne
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-4 w-4" />
                Programme Fidélité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Clients VIP</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Points distribués</span>
                  <span className="text-sm font-medium">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Récompenses données</span>
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => toast({ title: "Configuration programme", description: "Programme de fidélité en cours de configuration" })}
              >
                Configurer programme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-4 w-4" />
                Analytics Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50"
                  onClick={() => toast({ title: "Rendez-vous", description: "156 RDV ce mois (+15% vs mois dernier)" })}
                >
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-xs text-gray-500">RDV ce mois</p>
                </div>
                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:bg-green-50"
                  onClick={() => toast({ title: "Chiffre d'affaires", description: "€4,680 ce mois (+8% vs mois dernier)" })}
                >
                  <p className="text-2xl font-bold text-green-600">€4,680</p>
                  <p className="text-xs text-gray-500">Chiffre d'affaires</p>
                </div>
                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50"
                  onClick={() => toast({ title: "Taux de présence", description: "89% - Excellent! Moyenne du secteur: 75%" })}
                >
                  <p className="text-2xl font-bold text-purple-600">89%</p>
                  <p className="text-xs text-gray-500">Taux présence</p>
                </div>
                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50"
                  onClick={() => toast({ title: "Note moyenne", description: "4.8/5 basé sur 89 avis clients" })}
                >
                  <p className="text-2xl font-bold text-orange-600">4.8</p>
                  <p className="text-xs text-gray-500">Note moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-4 w-4" />
                Insights IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm">Votre taux de présence est excellent (89%)</p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">+15% de réservations vs mois dernier</p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-purple-500 mt-0.5" />
                  <p className="text-sm">23 nouveaux clients ce mois</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => toast({ title: "Rapport analytics", description: "Génération du rapport complet en cours..." })}
              >
                Voir rapport complet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}