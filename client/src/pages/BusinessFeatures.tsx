import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RealtimeNotificationBar } from "@/components/RealtimeNotificationBar";
import {
  MessageCircle, Settings, CreditCard, Globe, Package, 
  TrendingUp, BarChart3, Bell, Crown, Banknote, Star,
  Users, TrendingDown, AlertTriangle, Check, Euro
} from "lucide-react";

export default function BusinessFeatures() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<string>('main');

  // Authentification désactivée temporairement pour debugging
  console.log('BusinessFeatures chargé - page visible');

  // Rendu principal avec sections selon les images  
  const renderMainView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de notifications temps réel */}
      <RealtimeNotificationBar />
      
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

        {/* BOUTON MA PAGE - ULTRA VISIBLE */}
        <Card className="border-4 border-red-500 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">MA PAGE SALON</h2>
            <p className="text-gray-600 text-lg mb-4">
              Modifiez votre page publique
            </p>
            
            {/* Lien de partage */}
            <div className="bg-white rounded-lg p-3 mb-4 border">
              <div className="text-xs text-gray-500 mb-1">Lien de partage :</div>
              <div className="text-sm font-mono text-blue-600 break-all">
                {window.location.origin}/salon/salon-demo
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/salon/salon-demo`);
                    toast({ title: "Lien copié !" });
                  }}
                >
                  Copier le lien
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => {
                    console.log('🔗 OUVERTURE SALON PUBLIC depuis lien partage');
                    window.open('/salon/salon-demo', '_blank');
                  }}
                >
                  Voir la page
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                console.log('🔥 CLIC MA PAGE depuis Dashboard - Vers SalonPageEditor');
                setLocation('/salon-page-editor');
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg text-xl"
            >
              🔥 MODIFIER MA PAGE 🔥
            </Button>
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
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl border-2 border-orange-500"
              onClick={() => {
                console.log('🔗 LIEN SALON - Vers page publique salon-demo');
                window.open('/salon/salon-demo', '_blank');
              }}
            >
              <Globe className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">MA PAGE</span>
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

        {/* Section Paiements - Interface exacte selon screenshots */}
        {activeSection === 'paiements' && (
          <div className="space-y-4">
            {/* Méthodes de Paiement */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Méthodes de Paiement</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      <span className="font-medium text-gray-900">Carte bancaire</span>
                    </div>
                    <Badge className="bg-violet-600 text-white px-3 py-1 rounded-full">Actif</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Euro className="h-5 w-5 text-gray-700" />
                      <span className="font-medium text-gray-900">Espèces</span>
                    </div>
                    <Badge className="bg-violet-600 text-white px-3 py-1 rounded-full">Actif</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-gray-700" />
                      <span className="font-medium text-gray-900">Chèques</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Inactif</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl">
                  Gérer paiements
                </Button>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Euro className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Marie D.</div>
                      <div className="text-sm text-gray-500">Aujourd'hui</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">65€</div>
                      <Badge className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs">Payé</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Sophie L.</div>
                      <div className="text-sm text-gray-500">Aujourd'hui</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">45€</div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">En attente</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Emma M.</div>
                      <div className="text-sm text-gray-500">Aujourd'hui</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">80€</div>
                      <Badge className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs">Payé</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section Stock */}
        {activeSection === 'stock' && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Inventaire</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Shampoing Pro</div>
                      <div className="text-sm text-gray-500">Stock: 12</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">OK</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Masque Hydratant</div>
                        <div className="text-sm text-gray-500">Stock: 3</div>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">Stock bas</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Sérum Anti-Âge</div>
                      <div className="text-sm text-gray-500">Stock: 8</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">OK</Badge>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700 rounded-xl">
                    <Package className="h-4 w-4 mr-2" />
                    Gérer Stock
                  </Button>
                  <Button variant="outline" className="px-4 rounded-xl">
                    + Nouveau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section Marketing */}
        {activeSection === 'marketing' && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Campagnes Marketing</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Promo Nouvel An</div>
                      <div className="text-sm text-gray-500">156 clients</div>
                    </div>
                    <Badge className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">Fidélité VIP</div>
                      <div className="text-sm text-gray-500">89 clients</div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">Programmée</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 rounded-xl">
                  + Nouvelle campagne
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Programme Fidélité</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Clients VIP</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Points distribués</span>
                    <span className="font-semibold">1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Récompenses données</span>
                    <span className="font-semibold">8</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-violet-600 text-white hover:bg-violet-700 rounded-xl">
                  Configurer programme
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section Analytics */}
        {activeSection === 'analytics' && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Analytics Pro</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
                    <div className="text-sm text-gray-600">RDV ce mois</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">€4,680</div>
                    <div className="text-sm text-gray-600">Chiffre d'affaires</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-violet-600 mb-1">89%</div>
                    <div className="text-sm text-gray-600">Taux présence</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">4.8</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-5 w-5 text-gray-900" />
                  <h2 className="text-lg font-semibold text-gray-900">Insights IA</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      Votre taux de présence est excellent (89%)
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      +15% de réservations vs mois dernier
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-xl">
                    <Users className="h-4 w-4 text-violet-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      23 nouveaux clients ce mois
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-violet-600 text-white hover:bg-violet-700 rounded-xl">
                  Voir rapport complet
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Message si aucune section active */}
        {activeSection === 'main' && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Sélectionnez une section ci-dessus</p>
          </div>
        )}
      </div>
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