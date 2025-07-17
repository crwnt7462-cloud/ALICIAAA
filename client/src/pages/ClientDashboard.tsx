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
      {/* Header professionnel épuré */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Beautify</h1>
                <p className="text-sm text-gray-500">Bonjour {clientSession.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">{clientSession.firstName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation moderne */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border p-2 mb-8">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5 mb-2" />
              Accueil
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex flex-col items-center px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "appointments"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5 mb-2" />
              Rendez-vous
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex flex-col items-center px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "messages"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <MessageCircle className="w-5 h-5 mb-2" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5 mb-2" />
              Profil
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Barre de recherche principale */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Réserver votre prochain rendez-vous</h2>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input 
                    placeholder="Rechercher un salon, un service..."
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
                  onClick={() => setLocation('/')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Actions rapides avec design moderne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Scissors className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Coiffure</h3>
                    <p className="text-sm text-gray-500">Coupes, colorations, soins</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setLocation('/')}
                >
                  Réserver maintenant
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Palette className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Esthétique</h3>
                    <p className="text-sm text-gray-500">Soins visage, épilations</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                  onClick={() => setLocation('/')}
                >
                  Réserver maintenant
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Bien-être</h3>
                    <p className="text-sm text-gray-500">Massages, relaxation</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => setLocation('/')}
                >
                  Réserver maintenant
                </Button>
              </div>
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Prochains rendez-vous</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("appointments")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100">
                              <Scissors className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{appointment.serviceName}</h4>
                              <p className="text-gray-600 text-sm">{appointment.businessName}</p>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="flex items-center text-sm text-gray-500">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {appointment.startTime}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(appointment.appointmentDate), 'd MMMM', { locale: fr })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Confirmé
                            </div>
                            <p className="text-lg font-bold text-gray-900 mt-1">{appointment.totalPrice}€</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun rendez-vous programmé</h4>
                    <p className="text-gray-500 mb-6">Réservez votre premier rendez-vous dès maintenant</p>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
                      onClick={() => setLocation('/')}
                    >
                      Prendre rendez-vous
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages récents */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Messages récents</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("messages")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {conversationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : recentConversations.length > 0 ? (
                  <div className="space-y-4">
                    {recentConversations.map((conversation) => (
                      <div key={conversation.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              S
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Salon Professionnel</h4>
                              <p className="text-sm text-gray-600 truncate max-w-64">
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
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune conversation</h4>
                    <p className="text-gray-500">Vos échanges avec les salons apparaîtront ici</p>
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