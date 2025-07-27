import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle, Settings, CreditCard, Globe, Package, 
  TrendingUp, BarChart3, Bell, Crown, Banknote, Star,
  Users, TrendingDown, AlertTriangle, Check, Euro
} from "lucide-react";

export default function BusinessFeatures() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<string>('main');

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

  // Rendu principal avec sections selon les images
  const renderMainView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header unique - Style iPhone */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Salon Manager</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLocation('/salon-settings')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Bannière Plans d'abonnement */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-4">
          <Button 
            className="w-full bg-transparent hover:bg-white/10 text-white font-medium py-2 rounded-lg"
            onClick={() => toast({ title: "Plans", description: "Voir les plans d'abonnement" })}
          >
            Voir les plans d'abonnement
          </Button>
        </div>

        {/* Carte Messagerie Pro */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-violet-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Messagerie Pro</h2>
                  <Crown className="h-4 w-4 text-violet-600" />
                  <Badge className="bg-violet-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                    Premium
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Communiquez directement avec vos clients
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600 mb-1">24h</div>
                    <div className="text-xs text-gray-600">Réponse rapide</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600 mb-1">∞</div>
                    <div className="text-xs text-gray-600">Messages illimités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-violet-600 mb-1">100%</div>
                    <div className="text-xs text-gray-600">Sécurisé</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation('/pro-messaging')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                >
                  Messages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille des outils professionnels */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setLocation('/salon-settings')}
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Config</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setActiveSection('paiements')}
            >
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Paiements</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => toast({ title: "Pages", description: "Section supprimée" })}
            >
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Pages</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setActiveSection('stock')}
            >
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Stock</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setActiveSection('marketing')}
            >
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Marketing</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setActiveSection('analytics')}
            >
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Analytics</span>
            </Button>
          </div>
        </div>

        {/* Rendu conditionnel selon activeSection */}
        {activeSection === 'paiements' && renderPaiements()}
        {activeSection === 'stock' && renderStock()}
        {activeSection === 'marketing' && renderMarketing()}
        {activeSection === 'analytics' && renderAnalytics()}
        
        {/* Message si aucune section active */}
        {activeSection === 'main' && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Sélectionnez une section ci-dessus</p>
          </div>
        )}
      </div>
    </div>
  );

  // Section Paiements - Exact selon IMG_1235 et IMG_1236
  const renderPaiements = () => (
    <div className="space-y-4">
      {/* Section Méthodes de Paiement */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Méthodes de Paiement</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Carte bancaire</span>
              </div>
              <Badge className="bg-violet-600 text-white rounded-full px-3 py-1 text-xs">Actif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Espèces</span>
              </div>
              <Badge className="bg-violet-600 text-white rounded-full px-3 py-1 text-xs">Actif</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Chèques</span>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">Inactif</Badge>
            </div>

            <Button variant="ghost" className="w-full text-gray-600 py-3 rounded-xl">
              Gérer paiements
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Transactions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Euro className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Marie D.</div>
                <div className="text-sm text-gray-600">Aujourd'hui</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">65€</div>
                <Badge className="bg-violet-600 text-white rounded-full px-2 py-1 text-xs">Payé</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Sophie L.</div>
                <div className="text-sm text-gray-600">Aujourd'hui</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">45€</div>
                <Badge variant="secondary" className="rounded-full px-2 py-1 text-xs">En attente</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Emma M.</div>
                <div className="text-sm text-gray-600">Aujourd'hui</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">80€</div>
                <Badge className="bg-violet-600 text-white rounded-full px-2 py-1 text-xs">Payé</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Section Stock - Exact selon IMG_1238
  const renderStock = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Inventaire</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Shampooing Pro</div>
                <div className="text-sm text-gray-600">Stock: 12</div>
              </div>
              <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">OK</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium text-gray-900">Masque Hydratant</div>
                  <div className="text-sm text-gray-600">Stock: 3</div>
                </div>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <Badge className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs font-medium">Stock bas</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Sérum Anti-Age</div>
                <div className="text-sm text-gray-600">Stock: 8</div>
              </div>
              <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">OK</Badge>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl">
              <Package className="h-4 w-4 mr-2" />
              Gérer Stock
            </Button>
            <Button variant="outline" className="px-4 py-3 rounded-xl">
              + Nouveau
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Section Marketing - Exact selon IMG_1239
  const renderMarketing = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Campagnes Marketing</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Promo Nouvel An</div>
                <div className="text-sm text-gray-600">156 clients</div>
              </div>
              <Badge className="bg-violet-600 text-white rounded-full px-3 py-1 text-xs">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Fidélité VIP</div>
                <div className="text-sm text-gray-600">89 clients</div>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">Programmée</Badge>
            </div>

            <Button variant="ghost" className="w-full text-gray-600 py-3 rounded-xl">
              + Nouvelle campagne
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Programme Fidélité</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Clients VIP</span>
              <span className="font-semibold text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Points distribués</span>
              <span className="font-semibold text-gray-900">1,240</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Récompenses données</span>
              <span className="font-semibold text-gray-900">8</span>
            </div>
          </div>

          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl mt-4">
            Configurer programme
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Section Analytics - Exact selon IMG_1240
  const renderAnalytics = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics Pro</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
              <div className="text-xs text-gray-600">RDV ce mois</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">€4,680</div>
              <div className="text-xs text-gray-600">Chiffre d'affaires</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">89%</div>
              <div className="text-xs text-gray-600">Taux présence</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1">4.8</div>
              <div className="text-xs text-gray-600">Note moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Insights IA</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">Votre taux de présence est excellent (89%)</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <span className="text-sm text-gray-700">+15% de réservations vs mois dernier</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <Users className="h-4 w-4 text-purple-600 mt-0.5" />
              <span className="text-sm text-gray-700">23 nouveaux clients ce mois</span>
            </div>
          </div>

          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl mt-4">
            Voir rapport complet
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return renderMainView();
}