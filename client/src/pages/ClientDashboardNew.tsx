import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Home, Calendar, Settings, Search, Star, Heart, Gift, Bell, User, MapPin, Clock, Phone, Mail, Edit2, Save } from "lucide-react";

export default function ClientDashboardNew() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('accueil');
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données client depuis localStorage
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      setClientData(JSON.parse(storedClientData));
    } else {
      // Redirection vers login si pas de données client
      setLocation('/client-login');
    }
  }, [setLocation]);

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  // Page Accueil
  const renderAccueil = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-sm mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Accueil</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-sm mx-auto px-6 py-8 space-y-8">
        {/* Salutation */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour {clientData.firstName} !
          </h2>
          <p className="text-gray-600">
            Découvrez vos prochains rendez-vous et services favoris
          </p>
        </div>

        {/* Points de fidélité */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm mb-1">Points de fidélité</p>
                <p className="text-3xl font-bold">{clientData.loyaltyPoints || 150}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Gift className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <Button className="bg-white text-violet-600 hover:bg-gray-100" size="sm">
                Voir mes récompenses
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prochain rendez-vous */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prochain rendez-vous</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('rdv')}
              className="text-violet-600"
            >
              Voir tout
            </Button>
          </div>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Coupe + Brushing</h4>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Salon Excellence Paris
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      30 janvier 2025
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      14:30
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 mb-2">45€</p>
                  <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setLocation('/search')}
              className="h-20 bg-violet-600 hover:bg-violet-700 flex flex-col items-center justify-center"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="text-sm">Nouveau RDV</span>
            </Button>
            
            <Button 
              onClick={() => setLocation('/search')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-2"
            >
              <Heart className="w-6 h-6 mb-2" />
              <span className="text-sm">Mes favoris</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Page Mes RDV
  const renderRdv = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-sm mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Mes RDV</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-sm mx-auto px-6 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              className="pl-10 h-12 bg-gray-50 border-0 rounded-2xl"
            />
          </div>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="upcoming" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-2xl p-1">
            <TabsTrigger value="upcoming" className="rounded-xl text-sm">À venir</TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl text-sm">Passés</TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-xl text-sm">Annulés</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Coupe + Brushing</h4>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Salon Excellence Paris
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        30 janv. 2025
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        14:30
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 mb-2">45€</p>
                    <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200">
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bouton flottant */}
        <div className="fixed bottom-20 right-6">
          <Button 
            onClick={() => setLocation('/search')}
            className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg"
          >
            <Calendar className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Page Paramètres
  const renderParametres = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-sm mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Paramètres</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-sm mx-auto px-6 py-6 space-y-6">
        {/* Profil */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mon profil</CardTitle>
              <Button variant="ghost" size="sm" className="p-2">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Prénom</label>
                <Input value={clientData.firstName} className="h-10" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nom</label>
                <Input value={clientData.lastName} className="h-10" disabled />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input value={clientData.email} className="h-10 pl-10" disabled />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input value={clientData.phone || "Non renseigné"} className="h-10 pl-10" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">Notifications par email</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-gray-600">Notifications par SMS</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels RDV</p>
                <p className="text-sm text-gray-600">Rappels de rendez-vous</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => setLocation('/support')}
            variant="outline" 
            className="w-full h-12 justify-start"
          >
            Centre d'aide
          </Button>
          
          <Button 
            onClick={() => {
              localStorage.removeItem('clientToken');
              localStorage.removeItem('clientData');
              setLocation('/client-login');
            }}
            variant="outline" 
            className="w-full h-12 justify-start text-red-600 border-red-200"
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return renderAccueil();
      case 'rdv':
        return renderRdv();
      case 'parametres':
        return renderParametres();
      default:
        return renderAccueil();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Contenu principal */}
      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Menu de navigation en bas - Style professionnel */}
      <div className="bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-sm mx-auto px-6 py-2">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('accueil')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'accueil' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Accueil</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setActiveTab('rdv')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'rdv' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Mes RDV</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setActiveTab('parametres')}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === 'parametres' ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs">Paramètres</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}