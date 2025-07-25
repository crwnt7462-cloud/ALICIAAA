import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useClientAuth } from '@/hooks/useClientAuth';
import { 
  Calendar, 
  Clock, 
  MessageCircle,
  User,
  Search,
  Star,
  MapPin,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Appointment {
  id: number;
  serviceName: string;
  salonName: string;
  date: string;
  time: string;
  status: string;
  price: number;
  address: string;
}

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalAppointments: number;
  favoriteServices: string[];
}

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { clientData, isLoading: authLoading, isAuthenticated, logout: authLogout } = useClientAuth();

  // Rediriger si pas authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/client-login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Récupérer les données du client
  const { data: clientData, isLoading: loadingClient } = useQuery({
    queryKey: ['/api/client/profile'],
  });

  // Récupérer les rendez-vous du client
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ['/api/client/appointments'],
  });

  // Récupérer les messages
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['/api/client/messages'],
  });

  const handleLogout = () => {
    authLogout();
    queryClient.clear();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !"
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation('/search');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  if (authLoading || loadingClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (la redirection est gérée par useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Bonjour {clientData?.firstName || 'Client'} !
                </h1>
                <p className="text-gray-600 text-sm">
                  {appointments.length} rendez-vous • {messages.length} messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/client-settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Recherche rapide */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rechercher un salon</h2>
            <div className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un salon ou un service..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-700">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation('/category-selection')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nouveau rendez-vous</h3>
              <p className="text-sm text-gray-600">Choisissez votre catégorie de service</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation('/client-messaging')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Messagerie</h3>
              <p className="text-sm text-gray-600">
                {messages.length > 0 ? `${messages.length} nouveaux messages` : 'Aucun nouveau message'}
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation('/client-favorites')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mes favoris</h3>
              <p className="text-sm text-gray-600">Vos salons et services préférés</p>
            </CardContent>
          </Card>
        </div>

        {/* Prochains rendez-vous */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-600" />
                Mes rendez-vous
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/category-selection')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-violet-600 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment: Appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.serviceName}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{appointment.salonName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{appointment.price}€</p>
                        {appointment.status === 'confirmed' && (
                          <Button variant="outline" size="sm" className="mt-2">
                            Modifier
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-600 mb-4">Découvrez les salons près de chez vous et prenez votre premier rendez-vous</p>
                <Button onClick={() => setLocation('/search')} className="bg-violet-600 hover:bg-violet-700">
                  Rechercher un salon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique récent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-violet-600" />
              Historique récent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Rendez-vous confirmé", salon: "Salon Beautiful", date: "Il y a 2 jours" },
                { action: "Message reçu", salon: "Institut Zen", date: "Il y a 3 jours" },
                { action: "Avis laissé", salon: "Coiffure Moderne", date: "Il y a 1 semaine" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.salon}</p>
                  </div>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}