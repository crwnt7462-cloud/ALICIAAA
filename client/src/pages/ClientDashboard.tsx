import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MessageCircle, Clock, MapPin, Phone, Mail, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Message {
  id: number;
  conversationId: string;
  fromUserId?: string;
  fromClientId?: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

export default function ClientDashboard() {
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Get client session from localStorage
  useEffect(() => {
    const session = localStorage.getItem('clientSession');
    if (session) {
      setClientSession(JSON.parse(session));
    }
  }, []);

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

  // Fetch messages for selected conversation
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['/api/conversations', selectedConversation, 'messages'],
    queryFn: () => apiRequest('GET', `/api/conversations/${selectedConversation}/messages`).then(res => res.json()),
    enabled: !!selectedConversation,
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !clientSession) return;
    
    try {
      await apiRequest('POST', `/api/conversations/${selectedConversation}/messages`, {
        content: newMessage,
        fromClientId: clientSession.id,
        messageType: 'text'
      });
      
      setNewMessage("");
      refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    window.location.href = '/client-login';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!clientSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Session expirée</CardTitle>
            <CardDescription>Veuillez vous reconnecter</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/client-login'} 
              className="w-full"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-orange-500 rounded-lg"></div>
              <h1 className="text-xl font-semibold text-gray-900">Mon Espace Client</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {clientSession.firstName?.[0]}{clientSession.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {clientSession.firstName} {clientSession.lastName}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Mes Rendez-vous</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Messagerie</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Mon Profil</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h2>
                <Button className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
                  Prendre un RDV
                </Button>
              </div>

              {appointmentsLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun rendez-vous programmé
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Prenez votre premier rendez-vous dès maintenant
                    </p>
                    <Button className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
                      Réserver un créneau
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {appointments.map((appointment: Appointment) => (
                    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.serviceName}
                              </h3>
                              <Badge className={getStatusBadge(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{appointment.businessName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {appointment.totalPrice}€
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(appointment.appointmentDate), 'EEEE d MMMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                          {appointment.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.location}</span>
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            Annuler
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
              {/* Conversations List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conversation: Conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                          selectedConversation === conversation.id ? 'bg-violet-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>Pro</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Professionnel
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessageContent}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="md:col-span-2">
                {selectedConversation ? (
                  <>
                    <CardHeader className="border-b">
                      <CardTitle className="text-lg">Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-[500px]">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message: Message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.fromClientId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.fromClientId
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.fromClientId ? 'text-violet-200' : 'text-gray-500'
                              }`}>
                                {format(new Date(message.createdAt), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Tapez votre message..."
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                          <Button
                            onClick={handleSendMessage}
                            className="bg-violet-600 hover:bg-violet-700"
                          >
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-[500px]">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Mon Profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        value={clientSession.firstName}
                        readOnly
                        className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={clientSession.lastName}
                        readOnly
                        className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={clientSession.email}
                        readOnly
                        className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Rappels de rendez-vous par SMS</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Notifications email</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">Offres promotionnelles</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    Sauvegarder les modifications
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