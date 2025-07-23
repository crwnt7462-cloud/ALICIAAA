import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, MapPin, Phone, Mail, MessageSquare, 
  User, Settings, LogOut, Bell, Star, Gift, Heart,
  CalendarDays, ArrowUpRight, ChevronRight, Plus, Trash2, Edit3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mentionHandle?: string;
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

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    const data = localStorage.getItem("clientData") || localStorage.getItem("clientUser");
    
    if (!token || !data) {
      setLocation("/client/login");
      return;
    }
    
    try {
      setClientData(JSON.parse(data));
    } catch (error) {
      console.error("Erreur parsing client data:", error);
      setLocation("/client/login");
    }
  }, [setLocation]);

  // Récupération des rendez-vous
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/client/appointments'],
    enabled: !!clientData,
    queryFn: async () => {
      const token = localStorage.getItem("clientToken");
      const response = await fetch('/api/client/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json() as Promise<Appointment[]>;
    }
  });

  // Récupération des messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ['/api/client/messages'],
    enabled: !!clientData,
    queryFn: async () => {
      const token = localStorage.getItem("clientToken");
      const response = await fetch('/api/client/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json() as Promise<any[]>;
    }
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: number) => {
      return await apiRequest("PATCH", `/api/client/appointments/${appointmentId}/cancel`);
    },
    onSuccess: () => {
      toast({
        title: "Rendez-vous annulé",
        description: "Votre rendez-vous a été annulé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous.",
        variant: "destructive",
      });
    }
  });

  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async ({ appointmentId, newDate, newTime }: { appointmentId: number; newDate: string; newTime: string }) => {
      return await apiRequest("PATCH", `/api/client/appointments/${appointmentId}/reschedule`, { newDate, newTime });
    },
    onSuccess: () => {
      toast({
        title: "Rendez-vous déplacé",
        description: "Votre rendez-vous a été déplacé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de déplacer le rendez-vous.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientData");
    toast({
      title: "Déconnexion",
      description: "Vous êtes maintenant déconnecté.",
    });
    setLocation("/");
  };

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt: Appointment) => 
    new Date(apt.appointmentDate) > new Date() && apt.status === 'confirmed'
  );

  const pastAppointments = appointments.filter((apt: Appointment) => 
    new Date(apt.appointmentDate) <= new Date() || apt.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Mon Espace</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  2
                </div>
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={clientData.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm">
                    {clientData.firstName[0]}{clientData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{clientData.firstName} {clientData.lastName}</p>
                </div>
              </div>
              
              <Button variant="ghost" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation tabs */}
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-6">
            {/* Résumé rapide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Prochains RDV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{upcomingAppointments.length}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    {upcomingAppointments.length > 0 ? "Le prochain dans 2 jours" : "Aucun rendez-vous prévu"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Salons favoris
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-600">3</div>
                  <p className="text-sm text-gray-600 mt-1">Établissements préférés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-emerald-600" />
                    Points fidélité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">450</div>
                  <p className="text-sm text-gray-600 mt-1">50 points = 5€ de réduction</p>
                </CardContent>
              </Card>
            </div>

            {/* Prochains rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Vos prochains rendez-vous
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation('/booking')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nouveau RDV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rendez-vous prévu</h3>
                    <p className="text-gray-600 mb-6">Réservez votre prochain soin dès maintenant</p>
                    <Button 
                      onClick={() => setLocation('/booking')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Prendre rendez-vous
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment: Appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{appointment.serviceName}</h4>
                            <p className="text-sm text-gray-600">{appointment.salonName}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(appointment.appointmentDate).toLocaleDateString()} à {appointment.appointmentTime}
                              </span>
                              <span className="text-sm font-semibold text-purple-600">{appointment.price}€</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Confirmé
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Rendez-vous */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h2>
              <Button 
                onClick={() => setLocation('/booking')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau rendez-vous
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">À venir ({upcomingAppointments.length})</TabsTrigger>
                <TabsTrigger value="past">Historique ({pastAppointments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rendez-vous à venir</h3>
                      <p className="text-gray-600">Il est temps de prendre soin de vous !</p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingAppointments.map((appointment: Appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{appointment.serviceName}</h3>
                              <p className="text-gray-600 mb-2">{appointment.salonName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} à {appointment.appointmentTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {appointment.salonAddress}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Confirmé
                                </Badge>
                                <span className="text-lg font-bold text-purple-600">{appointment.price}€</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const newDate = prompt("Nouvelle date (YYYY-MM-DD):");
                                const newTime = prompt("Nouvelle heure (HH:MM):");
                                if (newDate && newTime) {
                                  rescheduleAppointmentMutation.mutate({ 
                                    appointmentId: appointment.id, 
                                    newDate, 
                                    newTime 
                                  });
                                }
                              }}
                              className="flex items-center gap-2"
                            >
                              <Edit3 className="h-3 w-3" />
                              Déplacer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                                  cancelAppointmentMutation.mutate(appointment.id);
                                }
                              }}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun historique</h3>
                      <p className="text-gray-600">Vos rendez-vous passés apparaîtront ici</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastAppointments.map((appointment: Appointment) => (
                    <Card key={appointment.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{appointment.serviceName}</h3>
                              <p className="text-gray-600 mb-2">{appointment.salonName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} à {appointment.appointmentTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                  Terminé
                                </Badge>
                                <span className="text-lg font-bold text-gray-600">{appointment.price}€</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Star className="h-3 w-3" />
                              Noter
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              Reprendre
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Onglet Messages */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <Button 
                variant="outline"
                onClick={() => setLocation('/client/messages')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Voir tous les messages
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messagerie disponible bientôt</h3>
                <p className="text-gray-600">Communiquez directement avec vos professionnels</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Modifier
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={clientData.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl">
                        {clientData.firstName[0]}{clientData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {clientData.firstName} {clientData.lastName}
                      </h3>
                      <p className="text-gray-600">{clientData.mentionHandle || '@' + clientData.firstName.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{clientData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-semibold">{clientData.phone || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <p className="text-sm text-gray-600">RDV réalisés</p>
                  </div>
                  
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">3</div>
                    <p className="text-sm text-gray-600">Salons visités</p>
                  </div>
                  
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">450</div>
                    <p className="text-sm text-gray-600">Points fidélité</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}