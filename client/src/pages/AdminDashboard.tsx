import { useAuthSession } from "@/hooks/useAuthSession";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  Settings,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isProfessional } = useAuthSession();

  // Statistiques générales
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isProfessional,
  });

  // Rendez-vous du jour
  const { data: todayAppointments = [] } = useQuery({
    queryKey: ['/api/appointments/today'],
    enabled: isProfessional,
  });

  // Messages non lus
  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['/api/conversations/unread'],
    enabled: isProfessional,
  });

  // Revenus du mois
  const { data: monthlyRevenue } = useQuery({
    queryKey: ['/api/revenue/monthly'],
    enabled: isProfessional,
  });

  if (!isProfessional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-lg font-medium mb-2">Accès restreint</h3>
            <p className="text-gray-600">
              Cette page est réservée aux comptes professionnels
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord - {user?.businessName}
          </h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de votre salon de beauté
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RDV Aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayAppointments.length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary">
                  {todayAppointments.filter((apt: any) => apt.status === 'confirmed').length} confirmés
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unreadMessages.length}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  Voir messages
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyRevenue?.total || 0}€
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-4">
                <Badge className="bg-green-100 text-green-800">
                  +{monthlyRevenue?.growth || 0}% vs mois dernier
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.averageRating || '5.0'}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mt-4">
                <Badge variant="outline">
                  {stats?.totalReviews || 0} avis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rendez-vous du jour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Planning du jour</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Aucun rendez-vous aujourd'hui</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.slice(0, 5).map((appointment: any) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{appointment.clientName}</p>
                            <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.time}</p>
                            <Badge 
                              className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Nouveau rendez-vous
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Ajouter un client
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Envoyer un message
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Voir les statistiques
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages récents</CardTitle>
              </CardHeader>
              <CardContent>
                {unreadMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucun nouveau message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unreadMessages.map((message: any) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{message.fromName}</p>
                            <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                          </div>
                          <Badge>Nouveau</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Évolution du chiffre d'affaires</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Graphique à venir</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services les plus demandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Coupe & Brushing</span>
                      <Badge>45%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Coloration</span>
                      <Badge>30%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Soins visage</span>
                      <Badge>25%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres du salon</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Gérer l'équipe
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Clock className="w-6 h-6 mb-2" />
                    Horaires d'ouverture
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="w-6 h-6 mb-2" />
                    Tarifs & Services
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}