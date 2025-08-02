import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Calendar, 
  Users, 
  MessageCircle, 
  Settings, 
  Bell,
  LogOut,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  address: string;
  city: string;
  mentionHandle: string;
}

interface BookingPage {
  salonName: string;
  title: string;
  description: string;
  primaryColor: string;
  isPublished: boolean;
  views: number;
  pageUrl: string;
}

export default function ProDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookingPage, setBookingPage] = useState<BookingPage | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Récupérer les données utilisateur via la session
  const { data: sessionData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/check-session'],
    retry: false,
  });

  // Récupérer les paramètres du salon
  const { data: salonData, isLoading: salonLoading } = useQuery({
    queryKey: ['/api/salon-settings'],
    retry: false,
  });

  // Récupérer la page de réservation
  const { data: bookingData, isLoading: bookingLoading } = useQuery({
    queryKey: ['/api/booking-pages/current'],
    retry: false,
  });

  // Récupérer les messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/professional/messages'],
    retry: false,
  });

  useEffect(() => {
    // Rediriger vers login si pas connecté
    if (!userLoading && (!sessionData || !sessionData.authenticated)) {
      setLocation('/pro-login');
      return;
    }
    
    if (sessionData?.user) setUser(sessionData.user);
    if (bookingData) setBookingPage(bookingData);
    if (messagesData) setMessages(messagesData);
  }, [sessionData, bookingData, messagesData, userLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      setLocation('/pro-login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const copyBookingLink = () => {
    if (bookingPage?.pageUrl) {
      const url = `${window.location.origin}/booking/${bookingPage.pageUrl}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié",
        description: "Le lien de réservation a été copié dans le presse-papier",
      });
    }
  };

  if (userLoading || salonLoading || bookingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-600">{user?.businessName}</h1>
                <p className="text-gray-600">{user?.mentionHandle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                {messages.filter(m => !m.isRead).length} nouveaux
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/salon-settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">RDV aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-600">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients total</p>
                  <p className="text-2xl font-bold text-gray-600">247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-600">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vues page</p>
                  <p className="text-2xl font-bold text-gray-600">{bookingPage?.views || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations salon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                Informations du salon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nom du salon</p>
                <p className="font-medium">{user?.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Responsable</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium">{user?.address}, {user?.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/salon-settings')}
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier les informations
              </Button>
            </CardContent>
          </Card>

          {/* Page de réservation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                Page de réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookingPage ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Titre</p>
                    <p className="font-medium">{bookingPage.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-600">{bookingPage.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      bookingPage.isPublished 
                        ? 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-gray-600' 
                        : 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-gray-600'
                    }`}>
                      {bookingPage.isPublished ? 'Publiée' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setLocation('/booking-customization')}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyBookingLink}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier lien
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Aucune page de réservation créée</p>
                  <Button 
                    onClick={() => setLocation('/booking-customization')}
                    className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20"
                  >
                    Créer ma page
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages récents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                Messages récents ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.slice(0, 5).map((message) => (
                    <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{message.clientName}</p>
                          <span className="text-xs text-gray-600">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                          {!message.isRead && (
                            <span className="w-2 h-2 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setLocation('/pro-messaging')}
                  >
                    Voir tous les messages
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun message reçu</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Les clients peuvent vous contacter via votre handle {user?.mentionHandle}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}