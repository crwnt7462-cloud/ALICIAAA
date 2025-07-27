import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Calendar, Settings, Star, Heart, Gift, Bell, User, MapPin, Clock, Phone, Mail } from "lucide-react";

export default function ClientDashboardNew() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('accueil');
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
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Bannière Bienvenue */}
      <div className="bg-gradient-to-r from-violet-400 to-purple-500 rounded-lg p-4">
        <div className="text-white">
          <h2 className="text-xl font-bold mb-1">Bonjour {clientData.firstName} !</h2>
          <p className="text-violet-100">Découvrez vos prochains rendez-vous</p>
        </div>
      </div>

      {/* Carte Prochain RDV */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-green-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Prochain RDV</h2>
                <Badge className="bg-green-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                  Confirmé
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Coupe + Brushing - Salon Excellence
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 mb-1">30</div>
                  <div className="text-xs text-gray-600">Janvier</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 mb-1">14h30</div>
                  <div className="text-xs text-gray-600">Heure</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 mb-1">45€</div>
                  <div className="text-xs text-gray-600">Prix</div>
                </div>
              </div>

              <Button 
                onClick={() => setActiveSection('rdv')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              >
                Gérer RDV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte Fidélité */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-amber-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Programme Fidélité</h2>
                <Badge className="bg-amber-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                  VIP
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {clientData.loyaltyPoints || 150} points disponibles
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600 mb-1">25€</div>
                  <div className="text-xs text-gray-600">Crédit</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600 mb-1">5</div>
                  <div className="text-xs text-gray-600">Visites</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600 mb-1">20%</div>
                  <div className="text-xs text-gray-600">Réduction</div>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              >
                Utiliser mes points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setLocation('/search')}
          className="h-20 bg-violet-600 hover:bg-violet-700 text-white flex flex-col items-center justify-center rounded-lg"
        >
          <Calendar className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Nouveau RDV</span>
        </Button>
        
        <Button 
          onClick={() => setLocation('/search')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center border-2 rounded-lg"
        >
          <Heart className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Mes favoris</span>
        </Button>
      </div>
    </div>
  );

  // Page Mes RDV
  const renderRdv = () => (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Bouton Nouveau RDV */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-4">
        <Button 
          className="w-full bg-transparent hover:bg-white/10 text-white font-medium py-2 rounded-lg"
          onClick={() => setLocation('/search')}
        >
          Prendre un nouveau rendez-vous
        </Button>
      </div>

      {/* Carte RDV À venir */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-blue-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Rendez-vous à venir</h2>
                <Badge className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                  1 RDV
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Coupe + Brushing - Salon Excellence
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">30</div>
                  <div className="text-xs text-gray-600">Janvier</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">14h30</div>
                  <div className="text-xs text-gray-600">Heure</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">45€</div>
                  <div className="text-xs text-gray-600">Prix</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
                >
                  Modifier
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 rounded-lg"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte Historique */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Historique</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Soin du visage</p>
                    <p className="text-sm text-gray-600">Institut Belle Vie - 15 janv.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">80€</p>
                    <Badge variant="secondary" className="text-xs">Terminé</Badge>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
              >
                Voir tout l'historique
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Page Paramètres
  const renderParametres = () => (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Carte Profil */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-violet-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Mon Profil</h2>
                <Badge className="bg-violet-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                  Client VIP
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {clientData.firstName} {clientData.lastName}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-violet-600 mb-1">{clientData.email}</div>
                  <div className="text-xs text-gray-600">Email</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-violet-600 mb-1">{clientData.phone || 'Non renseigné'}</div>
                  <div className="text-xs text-gray-600">Téléphone</div>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              >
                Modifier profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte Notifications */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-blue-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">Rappels par email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS</p>
                    <p className="text-sm text-gray-600">Rappels par SMS</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={() => setLocation('/support')}
          variant="outline" 
          className="w-full h-12 justify-start rounded-lg"
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
          className="w-full h-12 justify-start text-red-600 border-red-200 rounded-lg"
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );

  // Rendu principal avec sections 
  const renderMainView = () => {
    if (activeSection === 'accueil') {
      return renderAccueil();
    } else if (activeSection === 'rdv') {
      return renderRdv();
    } else if (activeSection === 'parametres') {
      return renderParametres();
    }
    return renderAccueil();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unique - Style iPhone identique aux pros */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  localStorage.removeItem('clientToken');
                  localStorage.removeItem('clientData');
                  setLocation('/client-login');
                }}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de navigation à onglets - Style professionnel */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            <Button
              variant="ghost"
              onClick={() => setActiveSection('accueil')}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 ${
                activeSection === 'accueil' 
                  ? 'text-violet-600 border-violet-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>

            <Button
              variant="ghost"
              onClick={() => setActiveSection('rdv')}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 ${
                activeSection === 'rdv' 
                  ? 'text-violet-600 border-violet-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Mes RDV
            </Button>

            <Button
              variant="ghost"
              onClick={() => setActiveSection('parametres')}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 ${
                activeSection === 'parametres' 
                  ? 'text-violet-600 border-violet-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-6">
        {renderMainView()}
      </div>
    </div>
  );
}