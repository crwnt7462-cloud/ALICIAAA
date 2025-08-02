import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { Bell, Calendar, Gift, User, MapPin, Clock, Star, CreditCard } from 'lucide-react';

interface ClientData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  clientStatus: string;
  totalSpent?: number;
  nextLoyaltyLevel?: string;
}

interface Appointment {
  id: number;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  salonName: string;
  totalPrice: string;
  depositPaid?: string;
}

interface LoyaltyInfo {
  currentPoints: number;
  nextLevel: string;
  pointsToNext: number;
}

export default function ClientDashboardNew() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accueil');
  const { toast } = useToast();

  // WebSocket pour notifications temps réel
  const { isConnected, notifications, clearNotifications, unreadCount } = useWebSocket({
    userType: 'client',
    clientId: client?.id.toString(),
    autoReconnect: true
  });

  useEffect(() => {
    loadClientDashboard();
  }, []);

  const loadClientDashboard = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      if (!token) {
        window.location.href = '/client-login';
        return;
      }

      const response = await fetch('/api/client/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
        setAppointments(data.appointments || []);
        setLoyaltyInfo(data.loyaltyInfo);
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de charger vos données",
          variant: "destructive"
        });
        window.location.href = '/client-login';
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-gray-600';
      case 'pending': return 'bg-yellow-100 text-gray-600';
      case 'completed': return 'bg-blue-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getLoyaltyLevelColor = (level: string) => {
    switch (level) {
      case 'VIP': return 'bg-purple-100 text-gray-600';
      case 'Premium': return 'bg-amber-100 text-gray-600';
      case 'Bronze': return 'bg-orange-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const cancelAppointment = async (appointmentId: number) => {
    try {
      const token = localStorage.getItem('clientToken');
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre rendez-vous a été annulé"
        });
        loadClientDashboard(); // Recharger les données
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'annuler le rendez-vous",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    window.location.href = '/client-login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Session expirée</h2>
          <Button onClick={() => window.location.href = '/client-login'}>
            Se reconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unifié */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-600">
                {client.firstName} {client.lastName}
              </h1>
              <p className="text-sm text-gray-600">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Connecté"></div>
            )}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation à onglets */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger 
                value="accueil" 
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-violet-600"
              >
                Accueil
              </TabsTrigger>
              <TabsTrigger 
                value="rdv"
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-violet-600"
              >
                Mes RDV
              </TabsTrigger>
              <TabsTrigger 
                value="profil"
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-violet-600"
              >
                Profil
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* ONGLET ACCUEIL */}
          <TabsContent value="accueil" className="space-y-4">
            {/* Programme de fidélité */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-gray-600" />
                    <span>Programme Fidélité</span>
                  </CardTitle>
                  <Badge className={getLoyaltyLevelColor(client.clientStatus)}>
                    {client.clientStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points actuels</span>
                  <span className="text-lg font-bold text-gray-600">{client.loyaltyPoints}</span>
                </div>
                {loyaltyInfo && loyaltyInfo.pointsToNext > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vers {loyaltyInfo.nextLevel}</span>
                      <span>{loyaltyInfo.pointsToNext} points restants</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(10, ((loyaltyInfo.currentPoints) / (loyaltyInfo.currentPoints + loyaltyInfo.pointsToNext)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prochain rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Prochain rendez-vous</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 1).map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-600">{appointment.serviceName}</h4>
                            <p className="text-sm text-gray-600">{appointment.salonName}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.appointmentDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.startTime}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Aucun rendez-vous prévu</p>
                    <Button className="w-full bg-violet-600 hover:bg-violet-700">
                      Prendre rendez-vous
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {appointments.filter(a => a.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">RDV terminés</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {client.totalSpent?.toFixed(0) || '0'}€
                  </div>
                  <div className="text-sm text-gray-600">Total dépensé</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ONGLET MES RDV */}
          <TabsContent value="rdv" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mes rendez-vous</h2>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                Nouveau RDV
              </Button>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-600">{appointment.serviceName}</h4>
                          <p className="text-sm text-gray-600">{appointment.salonName}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === 'confirmed' ? 'Confirmé' : 
                           appointment.status === 'completed' ? 'Terminé' : 
                           appointment.status === 'cancelled' ? 'Annulé' : appointment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.appointmentDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.startTime} - {appointment.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span>{appointment.totalPrice}€</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Note: -/5</span>
                        </div>
                      </div>

                      {appointment.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Annuler
                          </Button>
                        </div>
                      )}

                      {appointment.status === 'completed' && (
                        <Button variant="outline" size="sm" className="w-full">
                          Laisser un avis
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-600 mb-4">Commencez par prendre votre premier rendez-vous</p>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  Trouver un salon
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ONGLET PROFIL */}
          <TabsContent value="profil" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Prénom</label>
                    <div className="mt-1 text-sm text-gray-600">{client.firstName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom</label>
                    <div className="mt-1 text-sm text-gray-600">{client.lastName}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="mt-1 text-sm text-gray-600">{client.email}</div>
                </div>
                <Button variant="outline" className="w-full">
                  Modifier mes informations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications par email</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rappels de rendez-vous</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Offres promotionnelles</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Aide et support
              </Button>
              <Button variant="outline" className="w-full text-gray-600" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}