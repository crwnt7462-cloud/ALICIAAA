import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, User, Bell, CreditCard, Gift, 
  Clock, MapPin, Phone, Mail, Settings,
  Download, Trash2, Plus, Star, ArrowRight,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');

  // Vérifier l'authentification client
  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['/api/client/auth/check'],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/client-login');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="space-y-6">
      {/* Message de bienvenue */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bonjour {user?.firstName || 'Marie'} 👋
          </h2>
          <p className="text-gray-600 mb-4">
            Gérez vos rendez-vous et découvrez nos services beauté
          </p>
          <Button 
            onClick={() => setLocation('/salon-search')}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6"
          >
            Réserver un soin
          </Button>
        </CardContent>
      </Card>

      {/* Prochain rendez-vous */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Prochain rendez-vous</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">Coupe & Brushing</p>
                <p className="text-sm text-gray-600">Salon Excellence Paris</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Confirmé</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Demain 14h30</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>15 rue de Rivoli, Paris</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professionnels récents */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Vos professionnels</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <span className="text-violet-600 font-semibold text-sm">SE</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Salon Excellence</p>
                  <p className="text-sm text-gray-600">Dernière visite il y a 2 semaines</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Revoir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Mes rendez-vous</h2>
        <Button 
          onClick={() => setLocation('/salon-search')}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
        >
          Nouveau RDV
        </Button>
      </div>

      {/* À venir */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">À venir</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">Coupe & Brushing</p>
                  <p className="text-sm text-gray-600">Salon Excellence Paris</p>
                  <p className="text-sm text-gray-500">Demain 14h30 - 16h00</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Confirmé
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  Reprogrammer
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-red-600 border-red-200">
                  Annuler
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Même soin
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passés */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Historique</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">Soin du visage</p>
                  <p className="text-sm text-gray-600">Institut Belle Vie</p>
                  <p className="text-sm text-gray-500">Il y a 1 semaine - 80€</p>
                </div>
                <Badge variant="secondary">Terminé</Badge>
              </div>
              
              <Button variant="outline" size="sm" className="rounded-full">
                Reprendre le même soin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Rappels récents</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Rappel de rendez-vous</p>
                <p className="text-sm text-gray-600">Votre RDV demain à 14h30</p>
                <p className="text-xs text-gray-500 mt-1">Envoyé il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">RDV confirmé</p>
                <p className="text-sm text-gray-600">Votre réservation a été acceptée</p>
                <p className="text-xs text-gray-500 mt-1">Il y a 1 jour</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Mon profil</h2>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informations personnelles</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input 
                  type="text" 
                  defaultValue="Marie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input 
                  type="text" 
                  defaultValue="Dupont"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                defaultValue="marie.dupont@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input 
                type="tel" 
                defaultValue="06 12 34 56 78"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <Button 
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
              onClick={() => toast({ title: "Profil mis à jour", description: "Vos informations ont été sauvegardées" })}
            >
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Préférences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rappels par email</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rappels par SMS</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Offres promotionnelles</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Paiements & Factures</h2>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Historique des paiements</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Soin du visage</p>
                <p className="text-sm text-gray-600">Institut Belle Vie - 15 janvier 2025</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">80€</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">Payé</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Coupe & Brushing</p>
                <p className="text-sm text-gray-600">Salon Excellence - Demain</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">65€</p>
                <Badge variant="secondary">En attente</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Cartes enregistrées</h3>
            <Button variant="outline" size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                  VISA
                </div>
                <span className="text-gray-900">•••• •••• •••• 1234</span>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLoyalty = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Avantages & Fidélité</h2>

      <Card className="border border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-6 w-6 text-violet-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Statut Client Fidèle</h3>
              <p className="text-sm text-gray-600">5 rendez-vous effectués</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">150</p>
              <p className="text-sm text-gray-600">Points cumulés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">25€</p>
              <p className="text-sm text-gray-600">Crédit disponible</p>
            </div>
          </div>
          
          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full">
            Utiliser mes points
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Offres exclusives</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-dashed border-violet-300 rounded-lg bg-violet-50">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-violet-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">20% sur votre prochain soin</p>
                  <p className="text-sm text-gray-600">Valable jusqu'au 31 janvier</p>
                  <p className="text-xs text-violet-600 font-medium mt-1">Code: FIDELE20</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Mon Compte</h1>
                <p className="text-sm text-gray-600">{user?.email || 'marie.dupont@email.com'}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem('clientToken');
                setLocation('/');
              }}
              className="text-gray-600"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="home" className="text-xs">Accueil</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs">RDV</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">Notifs</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs">Profil</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Paiements</TabsTrigger>
            <TabsTrigger value="loyalty" className="text-xs">Fidélité</TabsTrigger>
          </TabsList>

          <TabsContent value="home">{renderHome()}</TabsContent>
          <TabsContent value="appointments">{renderAppointments()}</TabsContent>
          <TabsContent value="notifications">{renderNotifications()}</TabsContent>
          <TabsContent value="profile">{renderProfile()}</TabsContent>
          <TabsContent value="payments">{renderPayments()}</TabsContent>
          <TabsContent value="loyalty">{renderLoyalty()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}