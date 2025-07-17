import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Calendar, 
  MessageCircle, 
  User, 
  LogOut, 
  Phone, 
  Clock, 
  MapPin, 
  Star,
  Home,
  Search,
  Heart,
  Bell,
  ChevronRight,
  Scissors,
  Palette,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";

interface ClientSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  status: string;
  totalPrice: number;
  businessName: string;
  location: string;
  notes?: string;
}

interface Conversation {
  id: string;
  professionalUserId: string;
  clientName: string;
  lastMessageAt: string;
  lastMessageContent: string;
  isArchived: boolean;
}

export default function ClientDashboard() {
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, setLocation] = useLocation();

  // Get client session from localStorage
  useEffect(() => {
    const session = localStorage.getItem('clientSession');
    if (session) {
      setClientSession(JSON.parse(session));
    } else {
      setLocation('/client-login');
    }
  }, [setLocation]);

  // Fetch client appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/client/appointments'],
    queryFn: () => apiRequest('GET', `/api/client/appointments?clientId=${clientSession?.id}`).then(res => res.json()),
    enabled: !!clientSession?.id,
  });

  // Fetch client conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: () => apiRequest('GET', `/api/conversations?clientId=${clientSession?.id}`).then(res => res.json()),
    enabled: !!clientSession?.id,
  });

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    localStorage.removeItem('userType');
    setLocation('/');
  };

  if (!clientSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' && new Date(apt.appointmentDate) >= new Date()
  ).slice(0, 3);

  const recentConversations = conversations.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50">
      {/* Header avec même style que l'app principale */}
      <div className="bg-white border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mon Espace Client</h1>
                <p className="text-sm text-gray-600">Bienvenue {clientSession.firstName} !</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-violet-200 hover:bg-violet-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white rounded-xl p-1 border border-violet-100 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            <Home className="w-4 h-4 mx-auto mb-1" />
            Accueil
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "appointments"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            <Calendar className="w-4 h-4 mx-auto mb-1" />
            Mes RDV
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "messages"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            <MessageCircle className="w-4 h-4 mx-auto mb-1" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Profil
          </button>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Trouver un salon</h3>
                      <p className="text-sm text-gray-600">Découvrez de nouveaux salons</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-600"
                    onClick={() => setLocation('/')}
                  >
                    Rechercher
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mes favoris</h3>
                      <p className="text-sm text-gray-600">Salons préférés</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-amber-200 hover:bg-amber-50"
                  >
                    Voir mes favoris
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Donner un avis</h3>
                      <p className="text-sm text-gray-600">Partagez votre expérience</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-purple-200 hover:bg-purple-50"
                  >
                    Évaluer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Prochains rendez-vous */}
            <Card className="border-violet-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <span>Prochains rendez-vous</span>
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("appointments")}
                  >
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-violet-100 rounded-lg bg-gradient-to-r from-violet-50 to-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                              <Scissors className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{appointment.serviceName}</h4>
                              <p className="text-sm text-gray-600">{appointment.businessName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {format(new Date(appointment.appointmentDate), 'd MMM', { locale: fr })}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.startTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Aucun rendez-vous à venir</p>
                    <Button 
                      className="mt-3 bg-gradient-to-r from-violet-500 to-purple-600"
                      onClick={() => setLocation('/')}
                    >
                      Prendre rendez-vous
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages récents */}
            <Card className="border-violet-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-violet-600" />
                    <span>Messages récents</span>
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("messages")}
                  >
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : recentConversations.length > 0 ? (
                  <div className="space-y-3">
                    {recentConversations.map((conversation) => (
                      <div key={conversation.id} className="p-4 border border-violet-100 rounded-lg bg-gradient-to-r from-violet-50 to-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-violet-100 text-violet-600">
                                {conversation.clientName?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">Salon Pro</h4>
                              <p className="text-sm text-gray-600 truncate max-w-48">
                                {conversation.lastMessageContent}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Aucun message</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "appointments" && (
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-violet-600" />
                <span>Mes rendez-vous</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-violet-100 rounded-lg bg-gradient-to-r from-violet-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                            <Scissors className="w-6 h-6 text-violet-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{appointment.serviceName}</h4>
                            <p className="text-gray-600">{appointment.businessName}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(appointment.appointmentDate), 'd MMMM yyyy', { locale: fr })}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.startTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                            className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}
                          </Badge>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {appointment.totalPrice}€
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                  <p className="text-gray-600 mb-4">Vous n'avez pas encore de rendez-vous programmé</p>
                  <Button 
                    className="bg-gradient-to-r from-violet-500 to-purple-600"
                    onClick={() => setLocation('/')}
                  >
                    Prendre rendez-vous
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "messages" && (
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-violet-600" />
                <span>Mes conversations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="p-4 border border-violet-100 rounded-lg bg-gradient-to-r from-violet-50 to-white hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-violet-100 text-violet-600">
                              S
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">Salon Professionnel</h4>
                            <p className="text-sm text-gray-600 truncate max-w-64">
                              {conversation.lastMessageContent}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {format(new Date(conversation.lastMessageAt), 'dd/MM à HH:mm')}
                          </p>
                          <Button size="sm" variant="ghost" className="mt-1">
                            Répondre
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
                  <p className="text-gray-600">Vos échanges avec les salons apparaîtront ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "profile" && (
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-violet-600" />
                <span>Mon profil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl">
                    {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {clientSession.firstName} {clientSession.lastName}
                  </h3>
                  <p className="text-gray-600">{clientSession.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  <Input value={clientSession.firstName} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  <Input value={clientSession.lastName} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={clientSession.email} disabled />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full border-violet-200 hover:bg-violet-50"
                >
                  Modifier mes informations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-violet-100 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === "dashboard" ? "text-violet-600" : "text-gray-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Accueil</span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === "appointments" ? "text-violet-600" : "text-gray-500"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">RDV</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === "messages" ? "text-violet-600" : "text-gray-500"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === "profile" ? "text-violet-600" : "text-gray-500"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}