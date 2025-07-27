import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Share2, Copy, MessageCircle, QrCode, Smartphone, Mail, 
  ExternalLink, Settings, Users, Calendar, CreditCard,
  TrendingUp, Package, Megaphone, Star, PlusCircle,
  BarChart3, FileText, Zap, Crown
} from "lucide-react";

export default function BusinessFeatures() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Vérifier l'authentification
  const { data: sessionData, isLoading } = useQuery<any>({
    queryKey: ['/api/auth/check-session'],
    retry: false,
  });

  useEffect(() => {
    // Rediriger vers login si pas connecté
    if (!isLoading && (!sessionData || !sessionData.authenticated)) {
      setLocation('/pro-login');
    }
  }, [sessionData, isLoading, setLocation]);

  // Données du salon (récupérées depuis la session)
  const salonData = sessionData?.user ? {
    name: sessionData.user.businessName || "Mon Salon",
    handle: sessionData.user.mention_handle || "monsalon"
  } : { name: "Mon Salon", handle: "monsalon" };

  const salonUrl = `${window.location.origin}/salon/${salonData.handle}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const shareWhatsApp = () => {
    const message = `Découvrez ${salonData.name} et prenez rendez-vous facilement : ${salonUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = `Prenez rendez-vous chez ${salonData.name}`;
    const body = `Bonjour,\n\nJe vous invite à découvrir ${salonData.name} et à prendre rendez-vous en ligne :\n\n${salonUrl}\n\nÀ bientôt !`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const generateQRCode = () => {
    // Génération de QR Code simple (on pourrait intégrer une vraie librairie)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(salonUrl)}`;
    window.open(qrUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pro Tools</h1>
              <p className="text-gray-600 mt-1">Suite complète pour professionnels de la beauté</p>
            </div>
            <Badge className="bg-violet-100 text-violet-800 text-sm font-medium px-3 py-1">
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="partage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="partage">Partage</TabsTrigger>
            <TabsTrigger value="gestion">Gestion</TabsTrigger>
            <TabsTrigger value="paiements">Paiements</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          {/* Onglet Partage */}
          <TabsContent value="partage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lien de partage principal */}
              <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-violet-600" />
                    Lien de partage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {salonData.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Partagez votre lien unique avec vos clients
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Votre lien de salon :</p>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md p-3">
                      <code className="flex-1 text-sm text-violet-600 font-mono truncate">
                        {salonUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(salonUrl)}
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => copyToClipboard(salonUrl)}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button
                      onClick={generateQRCode}
                      variant="outline"
                      className="border-violet-300 text-violet-700 hover:bg-violet-50"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions de partage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    Partager sur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={shareWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={shareEmail}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    onClick={() => setLocation('/page-builder')}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Créer une page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Gestion */}
          <TabsContent value="gestion" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/planning')}>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Planning</h3>
                  <p className="text-gray-600 text-sm">Gérez vos rendez-vous et créneaux</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/clients')}>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Clients</h3>
                  <p className="text-gray-600 text-sm">Base de données clientèle</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/services')}>
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <p className="text-gray-600 text-sm">Catalogues et tarifs</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/inventory')}>
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inventaire</h3>
                  <p className="text-gray-600 text-sm">Gestion des stocks</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/direct-messaging')}>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Messagerie</h3>
                  <p className="text-gray-600 text-sm">Communication clients</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/staff')}>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Équipe</h3>
                  <p className="text-gray-600 text-sm">Gestion du personnel</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Paiements */}
          <TabsContent value="paiements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Terminal de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">Encaissez vos clients directement</p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setLocation('/pos-payment')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ouvrir le terminal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Rapports financiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">Analysez vos revenus et performances</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation('/financial-reports')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Voir les rapports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Marketing */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/campaigns')}>
                <CardContent className="p-6 text-center">
                  <Megaphone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Campagnes</h3>
                  <p className="text-gray-600 text-sm">Créez vos campagnes marketing</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/loyalty-program')}>
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Fidélité</h3>
                  <p className="text-gray-600 text-sm">Programme de fidélisation</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/promotions')}>
                <CardContent className="p-6 text-center">
                  <PlusCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Promotions</h3>
                  <p className="text-gray-600 text-sm">Offres et réductions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/analytics-dashboard')}>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tableau de bord</h3>
                  <p className="text-gray-600 text-sm">Métriques et KPIs en temps réel</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/ai-insights')}>
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">IA Insights</h3>
                  <p className="text-gray-600 text-sm">Prédictions et recommandations IA</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Configuration */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/salon-settings')}>
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Paramètres salon</h3>
                  <p className="text-gray-600 text-sm">Configuration générale</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/subscription-plans')}>
                <CardContent className="p-6 text-center">
                  <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Abonnement</h3>
                  <p className="text-gray-600 text-sm">Gérer votre plan</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation('/support')}>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Support</h3>
                  <p className="text-gray-600 text-sm">Aide et documentation</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}