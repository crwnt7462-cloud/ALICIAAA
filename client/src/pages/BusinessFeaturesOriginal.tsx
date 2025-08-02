import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle, Settings, CreditCard, Globe, Package, 
  TrendingUp, BarChart3, Bell, Crown, Banknote
} from "lucide-react";

export default function BusinessFeaturesOriginal() {
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

  const handleMessagingClick = () => {
    setLocation('/pro-messaging');
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
      {/* Header simple style iPhone */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-xl flex items-center justify-center">
                <span className="text-violet-700 font-bold text-lg">S</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Salon Manager</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Carte Messagerie Pro - Style exact de l'image */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-violet-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-violet-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">Messagerie Pro</h2>
                  <div className="w-4 h-4 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-sm flex items-center justify-center">
                    <Crown className="h-2 w-2 text-violet-700" />
                  </div>
                  <Badge className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 px-2 py-1 text-xs font-medium rounded-full">
                    Premium
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  Communiquez directement avec vos clients
                </p>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-violet-600 mb-1">24h</div>
                    <div className="text-xs text-gray-600">Réponse rapide</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-violet-600 mb-1">∞</div>
                    <div className="text-xs text-gray-600">Messages illimités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-violet-600 mb-1">100%</div>
                    <div className="text-xs text-gray-600">Sécurisé</div>
                  </div>
                </div>

                <Button 
                  onClick={handleMessagingClick}
                  className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 font-medium py-3 rounded-lg"
                >
                  Messages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille des outils - Style exact de l'image */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => setLocation('/salon-settings')}
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Config</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => setLocation('/salon-payment')}
            >
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Paiements</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => setLocation('/booking-pages')}
            >
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Pages</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => setLocation('/inventory')}
            >
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Stock</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => toast({ title: "Marketing", description: "Fonctionnalité en développement" })}
            >
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Marketing</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
              onClick={() => setLocation('/analytics-dashboard')}
            >
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Analytics</span>
            </Button>
          </div>

          {/* Section Méthodes de Paiement - Style iPhone */}
          <div className="border-t border-gray-100 pt-4">
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
                <Badge className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-full">Actif</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Espèces</span>
                </div>
                <Badge className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-full">Actif</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}