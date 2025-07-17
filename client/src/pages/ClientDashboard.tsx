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
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Beautify</h1>
                <p className="text-xs text-gray-500">Bonjour {clientSession.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-md px-2 py-1">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                  {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-gray-700">{clientSession.firstName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation compacte */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg border p-1 mb-6">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4 mb-1" />
              Accueil
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "appointments"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4 mb-1" />
              Rendez-vous
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "messages"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <MessageCircle className="w-4 h-4 mb-1" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4 mb-1" />
              Profil
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Réserver un rendez-vous</h2>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Rechercher un salon, un service..."
                    className="h-10 text-sm border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button 
                  size="sm"
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setLocation('/')}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Services compacts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Coiffure</h3>
                    <p className="text-xs text-gray-500">Coupes, colorations</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setLocation('/')}
                >
                  Réserver
                </Button>
              </div>

              <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Esthétique</h3>
                    <p className="text-xs text-gray-500">Soins visage</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setLocation('/')}
                >
                  Réserver
                </Button>
              </div>

              <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Bien-être</h3>
                    <p className="text-xs text-gray-500">Massages</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setLocation('/')}
                >
                  Réserver
                </Button>
              </div>
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Prochains rendez-vous</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("appointments")}
                    className="text-blue-600 hover:text-blue-700 text-xs p-1"
                  >
                    Voir tout <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border">
                              <Scissors className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{appointment.serviceName}</h4>
                              <p className="text-xs text-gray-600">{appointment.businessName}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {appointment.startTime}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(appointment.appointmentDate), 'd MMM', { locale: fr })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              Confirmé
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{appointment.totalPrice}€</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Aucun rendez-vous</h4>
                    <p className="text-xs text-gray-500 mb-4">Réservez votre premier rendez-vous</p>
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setLocation('/')}
                    >
                      Réserver
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages récents */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Messages récents</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("messages")}
                    className="text-blue-600 hover:text-blue-700 text-xs p-1"
                  >
                    Voir tout <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {conversationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : recentConversations.length > 0 ? (
                  <div className="space-y-3">
                    {recentConversations.map((conversation) => (
                      <div key={conversation.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                              S
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Salon Pro</h4>
                              <p className="text-xs text-gray-600 truncate max-w-48">
                                {conversation.lastMessageContent}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                            </p>
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Aucune conversation</h4>
                    <p className="text-xs text-gray-500">Vos échanges avec les salons apparaîtront ici</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Mes rendez-vous</h2>
              </div>
            </div>
            <div className="p-6">
              {appointmentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Scissors className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{appointment.serviceName}</h4>
                            <p className="text-gray-600 font-medium">{appointment.businessName}</p>
                            <div className="flex items-center space-x-6 mt-3">
                              <span className="flex items-center text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                {format(new Date(appointment.appointmentDate), 'd MMMM yyyy', { locale: fr })}
                              </span>
                              <span className="flex items-center text-gray-500">
                                <Clock className="w-4 h-4 mr-2" />
                                {appointment.startTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {appointment.totalPrice}€
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 border-blue-200 hover:bg-blue-50">
                            Gérer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Aucun rendez-vous programmé</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Découvrez nos salons partenaires et réservez votre premier rendez-vous beauté</p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
                    onClick={() => setLocation('/')}
                  >
                    Explorer les salons
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="font-medium text-gray-900">Mes conversations</h2>
              </div>
            </div>
            <div className="p-4">
              {conversationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div className="space-y-3">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            S
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Salon Professionnel</h4>
                            <p className="text-xs text-gray-600 truncate max-w-64">
                              {conversation.lastMessageContent}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {format(new Date(conversation.lastMessageAt), 'dd/MM à HH:mm')}
                          </p>
                          <Button size="sm" variant="ghost" className="mt-1 text-xs">
                            Répondre
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune conversation</h3>
                  <p className="text-xs text-gray-600">Vos échanges avec les salons apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="font-medium text-gray-900">Mon profil</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {clientSession.firstName} {clientSession.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{clientSession.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Prénom</label>
                  <Input value={clientSession.firstName} disabled className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Nom</label>
                  <Input value={clientSession.lastName} disabled className="h-8 text-sm" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Email</label>
                  <Input value={clientSession.email} disabled className="h-8 text-sm" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Modifier mes informations
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              activeTab === "dashboard" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-xs mt-1">Accueil</span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              activeTab === "appointments" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-xs mt-1">RDV</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              activeTab === "messages" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}