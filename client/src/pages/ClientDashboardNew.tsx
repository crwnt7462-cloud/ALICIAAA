import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Calendar, Settings, Star, Heart, Search, Bell, MessageCircle, User } from "lucide-react";

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
    <div className="space-y-4">
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
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg"
              >
                Utiliser points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'action rapide */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setLocation('/search')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center border-2 rounded-lg"
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
    <div className="space-y-4">
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
                  variant="outline"
                  className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Déplacer
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Coupe + Couleur</div>
                <div className="text-sm text-gray-600">15 Décembre 2024</div>
              </div>
              <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">Terminé</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">Brushing</div>
                <div className="text-sm text-gray-600">28 Novembre 2024</div>
              </div>
              <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium">Terminé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Page Paramètres
  const renderParametres = () => (
    <div className="space-y-4">
      {/* Profil */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{clientData.firstName} {clientData.lastName}</h2>
              <p className="text-gray-600">{clientData.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-violet-600 mb-1">{clientData.loyaltyPoints || 150}</div>
              <div className="text-xs text-gray-600">Points fidélité</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-green-600 mb-1">5</div>
              <div className="text-xs text-gray-600">RDV pris</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h3>
          
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Bell className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Notifications</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Heart className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Mes favoris</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-12 text-left">
              <Settings className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">Préférences</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Déconnexion */}
      <Button 
        onClick={() => {
          localStorage.removeItem('clientData');
          setLocation('/client-login');
        }}
        variant="outline" 
        className="w-full text-red-600 border-red-600 hover:bg-red-50"
      >
        Se déconnecter
      </Button>
    </div>
  );

  const renderMainView = () => {
    switch (activeSection) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header iPhone - Style identique aux pros */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Mon Compte</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveSection('parametres')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Bannière Bienvenue */}
        <div className="bg-gradient-to-r from-violet-400 to-purple-500 rounded-lg p-4">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-1">Bonjour {clientData.firstName} !</h2>
            <p className="text-violet-100">Bienvenue dans votre espace client</p>
          </div>
        </div>

        {/* Grille des sections client - Style IDENTIQUE aux pros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="ghost"
              className={`h-16 flex flex-col items-center justify-center gap-1 rounded-xl ${
                activeSection === 'accueil' 
                  ? 'bg-violet-50 text-violet-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => setActiveSection('accueil')}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Accueil</span>
            </Button>

            <Button
              variant="ghost"
              className={`h-16 flex flex-col items-center justify-center gap-1 rounded-xl ${
                activeSection === 'rdv' 
                  ? 'bg-violet-50 text-violet-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => setActiveSection('rdv')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs font-medium">Mes RDV</span>
            </Button>

            <Button
              variant="ghost"
              className={`h-16 flex flex-col items-center justify-center gap-1 rounded-xl ${
                activeSection === 'parametres' 
                  ? 'bg-violet-50 text-violet-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => setActiveSection('parametres')}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Paramètres</span>
            </Button>

            {/* Boutons supplémentaires pour remplir la grille comme les pros */}
            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setLocation('/search')}
            >
              <Search className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Recherche</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setLocation('/support')}
            >
              <MessageCircle className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Support</span>
            </Button>

            <Button
              variant="ghost"
              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-xl"
              onClick={() => setLocation('/search')}
            >
              <Heart className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Favoris</span>
            </Button>
          </div>
        </div>

        {/* Contenu des sections */}
        <div className="space-y-4">
          {renderMainView()}
        </div>
      </div>
    </div>
  );
}