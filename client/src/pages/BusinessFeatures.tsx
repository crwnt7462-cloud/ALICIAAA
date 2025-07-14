import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  Package,
  Calendar,
  MessageSquare,
  Gift,
  TrendingUp,
  Clock,
  Euro,
  Star,
  MapPin,
  Smartphone,
  Mail,
  FileText,
  Target,
  Zap
} from "lucide-react";

// Types
interface BusinessSettings {
  id: number;
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  mondayOpen?: string;
  mondayClose?: string;
  tuesdayOpen?: string;
  tuesdayClose?: string;
  wednesdayOpen?: string;
  wednesdayClose?: string;
  thursdayOpen?: string;
  thursdayClose?: string;
  fridayOpen?: string;
  fridayClose?: string;
  saturdayOpen?: string;
  saturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
  timezone: string;
  currency: string;
  bookingConfirmation: boolean;
  cancellationPolicy?: string;
  paymentRequired: boolean;
  onlineBooking: boolean;
}

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  configuration?: any;
}

interface Transaction {
  id: number;
  amount: string;
  currency: string;
  status: string;
  type: string;
  description?: string;
  createdAt: string;
  client?: {
    firstName: string;
    lastName: string;
  };
}

interface BookingPage {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  theme: string;
  customCSS?: string;
  headerText?: string;
  footerText?: string;
}

interface Inventory {
  id: number;
  name: string;
  category: string;
  brand?: string;
  currentStock: number;
  minStock: number;
  price: string;
  cost?: string;
  supplier?: string;
  description?: string;
}

interface MarketingCampaign {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate?: string;
  targetAudience?: string;
  message?: string;
  budget?: string;
  performance?: any;
}

export default function BusinessFeatures() {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Business Settings
  const { data: businessSettings } = useQuery({
    queryKey: ["/api/business-settings"],
    enabled: activeTab === "settings"
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ["/api/payment-methods"],
    enabled: activeTab === "payments"
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: activeTab === "payments"
  });

  const { data: bookingPages } = useQuery({
    queryKey: ["/api/booking-pages"],
    enabled: activeTab === "booking-pages"
  });

  const { data: inventory } = useQuery({
    queryKey: ["/api/inventory"],
    enabled: activeTab === "inventory"
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
    enabled: activeTab === "inventory"
  });

  const { data: marketingCampaigns } = useQuery({
    queryKey: ["/api/marketing-campaigns"],
    enabled: activeTab === "marketing"
  });

  // Mutations
  const updateBusinessSettings = useMutation({
    mutationFn: (settings: Partial<BusinessSettings>) => 
      apiRequest("/api/business-settings", "PATCH", settings),
    onSuccess: () => {
      toast({ title: "Paramètres mis à jour", description: "Vos paramètres d'entreprise ont été sauvegardés." });
      queryClient.invalidateQueries({ queryKey: ["/api/business-settings"] });
    }
  });

  const createPaymentMethod = useMutation({
    mutationFn: (method: Partial<PaymentMethod>) => 
      apiRequest("/api/payment-methods", "POST", method),
    onSuccess: () => {
      toast({ title: "Méthode de paiement ajoutée", description: "La nouvelle méthode de paiement a été configurée." });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
    }
  });

  const createBookingPage = useMutation({
    mutationFn: (page: Partial<BookingPage>) => 
      apiRequest("/api/booking-pages", "POST", page),
    onSuccess: () => {
      toast({ title: "Page de réservation créée", description: "Votre page de réservation personnalisée est maintenant active." });
      queryClient.invalidateQueries({ queryKey: ["/api/booking-pages"] });
    }
  });

  const createInventoryItem = useMutation({
    mutationFn: (item: Partial<Inventory>) => 
      apiRequest("/api/inventory", "POST", item),
    onSuccess: () => {
      toast({ title: "Produit ajouté", description: "Le produit a été ajouté à votre inventaire." });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    }
  });

  const createMarketingCampaign = useMutation({
    mutationFn: (campaign: Partial<MarketingCampaign>) => 
      apiRequest("/api/marketing-campaigns", "POST", campaign),
    onSuccess: () => {
      toast({ title: "Campagne créée", description: "Votre campagne marketing a été lancée." });
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-campaigns"] });
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Fonctionnalités Professionnelles
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Accédez à tous les outils avancés pour gérer votre salon comme Planity et Treatwell
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="booking-pages" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Pages de Réservation
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Pro
          </TabsTrigger>
        </TabsList>

        {/* Business Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informations de l'entreprise
                </CardTitle>
                <CardDescription>
                  Configurez les détails de votre salon comme sur Planity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom du salon</Label>
                  <Input
                    id="businessName"
                    defaultValue={businessSettings?.businessName}
                    placeholder="Salon Beauty Pro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    defaultValue={businessSettings?.address}
                    placeholder="123 Rue de la Beauté, 75001 Paris"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      defaultValue={businessSettings?.phone}
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={businessSettings?.email}
                      placeholder="contact@salon.fr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description du salon</Label>
                  <Textarea
                    id="description"
                    defaultValue={businessSettings?.description}
                    placeholder="Salon de beauté moderne spécialisé dans..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horaires d'ouverture
                </CardTitle>
                <CardDescription>
                  Définissez vos heures de travail pour le planning automatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { day: "Lundi", openKey: "mondayOpen", closeKey: "mondayClose" },
                  { day: "Mardi", openKey: "tuesdayOpen", closeKey: "tuesdayClose" },
                  { day: "Mercredi", openKey: "wednesdayOpen", closeKey: "wednesdayClose" },
                  { day: "Jeudi", openKey: "thursdayOpen", closeKey: "thursdayClose" },
                  { day: "Vendredi", openKey: "fridayOpen", closeKey: "fridayClose" },
                  { day: "Samedi", openKey: "saturdayOpen", closeKey: "saturdayClose" },
                  { day: "Dimanche", openKey: "sundayOpen", closeKey: "sundayClose" },
                ].map(({ day, openKey, closeKey }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium w-20">{day}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        defaultValue={(businessSettings as any)?.[openKey] || "09:00"}
                        className="w-28"
                      />
                      <span>à</span>
                      <Input
                        type="time"
                        defaultValue={(businessSettings as any)?.[closeKey] || "18:00"}
                        className="w-28"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Paramètres de réservation
                </CardTitle>
                <CardDescription>
                  Configurez le comportement des réservations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Confirmation automatique</Label>
                    <p className="text-sm text-gray-500">Confirmer automatiquement les réservations</p>
                  </div>
                  <Switch defaultChecked={businessSettings?.bookingConfirmation} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Réservation en ligne</Label>
                    <p className="text-sm text-gray-500">Permettre les réservations via votre site</p>
                  </div>
                  <Switch defaultChecked={businessSettings?.onlineBooking} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Acompte obligatoire</Label>
                    <p className="text-sm text-gray-500">Demander un paiement à la réservation</p>
                  </div>
                  <Switch defaultChecked={businessSettings?.paymentRequired} />
                </div>
                <div className="space-y-2">
                  <Label>Politique d'annulation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une politique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Gratuit jusqu'à 24h avant</SelectItem>
                      <SelectItem value="48h">Gratuit jusqu'à 48h avant</SelectItem>
                      <SelectItem value="72h">Gratuit jusqu'à 72h avant</SelectItem>
                      <SelectItem value="no-refund">Acompte non remboursable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation et contact
                </CardTitle>
                <CardDescription>
                  Informations pour être trouvé par vos clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input 
                    defaultValue={businessSettings?.website}
                    placeholder="https://www.monselon.fr" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Select defaultValue={businessSettings?.timezone || "Europe/Paris"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Europe/Brussels">Europe/Brussels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Devise</Label>
                    <Select defaultValue={businessSettings?.currency || "EUR"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar ($)</SelectItem>
                        <SelectItem value="GBP">Livre (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => updateBusinessSettings.mutate({})}
              disabled={updateBusinessSettings.isPending}
            >
              {updateBusinessSettings.isPending ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </Button>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Méthodes de paiement
                </CardTitle>
                <CardDescription>
                  Configurez vos options de paiement comme Planity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods?.map((method: PaymentMethod) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.type}</p>
                        </div>
                      </div>
                      <Badge variant={method.isActive ? "default" : "secondary"}>
                        {method.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => createPaymentMethod.mutate({
                      name: "Carte bancaire",
                      type: "card",
                      isActive: true
                    })}
                    variant="outline" 
                    className="w-full"
                  >
                    + Ajouter une méthode de paiement
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Transactions récentes
                </CardTitle>
                <CardDescription>
                  Suivi des paiements et encaissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions?.slice(0, 5).map((transaction: Transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {transaction.client?.firstName} {transaction.client?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount}€</p>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "default" : 
                            transaction.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {transaction.status === "completed" ? "Payé" : 
                           transaction.status === "pending" ? "En attente" : 
                           "Échoué"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Booking Pages Tab */}
        <TabsContent value="booking-pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Pages de réservation personnalisées
                </CardTitle>
                <CardDescription>
                  Créez des pages de réservation comme Treatwell
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingPages?.map((page: BookingPage) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{page.name}</p>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Actif" : "Inactif"}
                        </Badge>
                        <Button size="sm" variant="outline">Voir</Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => createBookingPage.mutate({
                      name: "Page principale",
                      slug: "mon-salon",
                      isActive: true,
                      theme: "modern",
                      headerText: "Réservez votre rendez-vous"
                    })}
                    variant="outline" 
                    className="w-full"
                  >
                    + Créer une page de réservation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Partage et intégration
                </CardTitle>
                <CardDescription>
                  Partagez vos liens de réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Code QR pour réservation</Label>
                  <div className="p-4 border-2 border-dashed rounded-lg text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-500">Scannez pour réserver</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Lien de partage</Label>
                  <div className="flex gap-2">
                    <Input value="https://beautyapp.com/booking/mon-salon" readOnly />
                    <Button size="sm" variant="outline">Copier</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Code d'intégration</Label>
                  <Textarea
                    value={`<iframe src="https://beautyapp.com/booking/mon-salon" width="100%" height="600"></iframe>`}
                    readOnly
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gestion des stocks
                </CardTitle>
                <CardDescription>
                  Suivez votre inventaire de produits de beauté
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory?.slice(0, 5).map((item: Inventory) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.brand} - {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Stock: {item.currentStock}</p>
                        <Badge 
                          variant={item.currentStock <= item.minStock ? "destructive" : "default"}
                        >
                          {item.currentStock <= item.minStock ? "Stock faible" : "En stock"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => createInventoryItem.mutate({
                      name: "Shampoing Professionnel",
                      category: "Soins capillaires",
                      brand: "L'Oréal",
                      currentStock: 25,
                      minStock: 5,
                      price: "12.50"
                    })}
                    variant="outline" 
                    className="w-full"
                  >
                    + Ajouter un produit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Alertes stock
                </CardTitle>
                <CardDescription>
                  Produits en rupture ou stock faible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems?.map((item: Inventory) => (
                    <div key={item.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <p className="font-medium text-red-800">{item.name}</p>
                      <p className="text-sm text-red-600">Stock: {item.currentStock} (Min: {item.minStock})</p>
                    </div>
                  ))}
                  
                  {(!lowStockItems || lowStockItems.length === 0) && (
                    <p className="text-center text-gray-500 py-4">Aucune alerte stock</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Campagnes marketing
                </CardTitle>
                <CardDescription>
                  Créez des campagnes comme Treatwell
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingCampaigns?.map((campaign: MarketingCampaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.type} - {campaign.targetAudience}</p>
                      </div>
                      <Badge 
                        variant={
                          campaign.status === "active" ? "default" : 
                          campaign.status === "scheduled" ? "secondary" : 
                          "outline"
                        }
                      >
                        {campaign.status === "active" ? "Active" : 
                         campaign.status === "scheduled" ? "Programmée" : 
                         "Terminée"}
                      </Badge>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => createMarketingCampaign.mutate({
                      name: "Offre Nouvelles Clientes",
                      type: "email",
                      status: "scheduled",
                      startDate: new Date().toISOString(),
                      targetAudience: "new_clients",
                      message: "Obtenez 20% de réduction sur votre première visite",
                      budget: "50"
                    })}
                    variant="outline" 
                    className="w-full"
                  >
                    + Créer une campagne
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Promotions automatiques
                </CardTitle>
                <CardDescription>
                  Offres et réductions intelligentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800">Première visite -20%</h4>
                  <p className="text-sm text-green-600">Pour attirer de nouveaux clients</p>
                  <Badge className="mt-2">Active</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800">Fidélité 10 visites</h4>
                  <p className="text-sm text-blue-600">La 11ème visite offerte</p>
                  <Badge variant="secondary" className="mt-2">Programmée</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-medium text-purple-800">Happy Hour 14h-16h</h4>
                  <p className="text-sm text-purple-600">-15% sur les créneaux creux</p>
                  <Badge variant="outline" className="mt-2">Brouillon</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  + Créer une promotion
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance du mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Chiffre d'affaires</span>
                    <span className="font-bold text-green-600">€3,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Réservations</span>
                    <span className="font-bold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taux d'occupation</span>
                    <span className="font-bold text-blue-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nouveaux clients</span>
                    <span className="font-bold text-purple-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Segments clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Clients VIP</span>
                    <Badge>15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clients réguliers</span>
                    <Badge variant="secondary">65%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nouveaux clients</span>
                    <Badge variant="outline">20%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Note moyenne</span>
                    <span className="font-bold text-yellow-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avis positifs</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recommandations</span>
                    <span className="font-bold text-blue-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse prédictive IA</CardTitle>
              <CardDescription>
                Intelligence artificielle pour optimiser votre activité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800">Prédiction d'annulation</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    3 rendez-vous à risque détectés
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Voir détails</Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800">Optimisation planning</h4>
                  <p className="text-sm text-green-600 mt-1">
                    +12% d'efficacité possible
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Optimiser</Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-medium text-purple-800">Recommandations prix</h4>
                  <p className="text-sm text-purple-600 mt-1">
                    Ajustements suggérés
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Analyser</Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-orange-50">
                  <h4 className="font-medium text-orange-800">Tendances marché</h4>
                  <p className="text-sm text-orange-600 mt-1">
                    Rapport hebdomadaire
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Consulter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}