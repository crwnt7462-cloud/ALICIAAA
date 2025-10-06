import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, MapPin, Phone, Star, 
  Plus, Settings, Bell, MessageSquare,
  CheckCircle2, AlertCircle, XCircle,
  ArrowRight, User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

interface Appointment {
  id: number;
  serviceName: string;
  professionalName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  status: string;
  salonName: string;
  salonAddress: string;
}

export default function ClientDashboardSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const data = localStorage.getItem('clientUser') || localStorage.getItem('clientData');
    
    if (!token || !data) {
      setLocation('/client/login');
      return;
    }
    
    try {
      setClientData(JSON.parse(data));
    } catch (error) {
      console.error('Erreur parsing client data:', error);
      setLocation('/client/login');
    }
  }, [setLocation]);

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/client/appointments'],
    enabled: !!clientData,
    queryFn: async () => {
      const token = localStorage.getItem('clientToken');
      const response = await fetch('/api/client/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientData');
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
    });
    setLocation('/client/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-3 w-3" />;
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(`${apt.appointmentDate}T${apt.appointmentTime}`) > new Date()
  );

  if (!clientData) {
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Bonjour {clientData.firstName}
              </h1>
              <p className="text-sm text-gray-600">
                Gérez vos rendez-vous beauté
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/notifications')}
                className="h-10 w-10"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/settings')}
                className="h-10 w-10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mt-6">
            {[
              { id: 'home', label: 'Accueil' },
              { id: 'appointments', label: 'Mes RDV' },
              { id: 'messages', label: 'Messages' },
              { id: 'profile', label: 'Profil' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Onglet Accueil */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Action rapide */}
            <Card className="border-0 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Nouveau rendez-vous
                    </h3>
                    <p className="text-violet-100 text-sm">
                      Trouvez et réservez votre prochain RDV beauté
                    </p>
                  </div>
                  <Button
                    onClick={() => setLocation('/search')}
                    className="bg-white text-violet-600 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Prochains rendez-vous */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Vos prochains rendez-vous
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('appointments')}
                  className="text-violet-600"
                >
                  Voir tout
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <Card key={appointment.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {appointment.serviceName}
                              </h3>
                              <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1 capitalize">{appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}</span>
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.appointmentTime}</span>
                                <span>•</span>
                                <span>{appointment.duration} min</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{appointment.salonName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {appointment.price}€
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun rendez-vous à venir
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Réservez tout, partout
                    </p>
                    <Button
                      onClick={() => setLocation('/search')}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Prendre rendez-vous
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Actions rapides */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab('messages')}
                >
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Messages</p>
                    <p className="text-xs text-gray-600">Contacter un salon</p>
                  </CardContent>
                </Card>
                <Card 
                  className="border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab('profile')}
                >
                  <CardContent className="p-4 text-center">
                    <User className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Mon profil</p>
                    <p className="text-xs text-gray-600">Gérer mes infos</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Rendez-vous */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Mes rendez-vous
              </h2>
              <Button
                onClick={() => setLocation('/search')}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {appointment.serviceName}
                            </h3>
                            <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })} à {appointment.appointmentTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{appointment.salonName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>Avec {appointment.professionalName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            {appointment.price}€
                          </div>
                          {appointment.status === 'confirmed' && (
                            <div className="space-y-1">
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                Déplacer
                              </Button>
                              <Button size="sm" variant="ghost" className="w-full text-xs text-red-600">
                                Annuler
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-gray-200">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun rendez-vous
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de rendez-vous programmé
                  </p>
                  <Button
                    onClick={() => setLocation('/search')}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    Prendre mon premier RDV
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Onglet Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Messages
            </h2>
            <Card className="border border-gray-200">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun message
                </h3>
                <p className="text-gray-600">
                  Vos conversations avec les salons apparaîtront ici
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Mon profil
            </h2>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-violet-600">
                      {clientData.firstName[0]}{clientData.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {clientData.firstName} {clientData.lastName}
                    </h3>
                    <p className="text-gray-600">{clientData.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-700">Email</span>
                    <span className="text-gray-900">{clientData.email}</span>
                  </div>
                  {clientData.phone && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-700">Téléphone</span>
                      <span className="text-gray-900">{clientData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-700">Rendez-vous pris</span>
                    <span className="text-gray-900">{appointments.length}</span>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation('/settings')}
                  >
                    Modifier mes informations
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}