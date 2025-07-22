import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Calendar, 
  MessageCircle, 
  User, 
  LogOut, 
  Clock, 
  Star,
  ChevronRight,
  Search,
  MapPin,
  Filter,
  Bell,
  Settings,
  Heart,
  Plus,
  AtSign,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";
import { useClientAuth } from "@/hooks/useClientAuth";

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  status: string;
  totalPrice: number;
  businessName: string;
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
  const [activeTab, setActiveTab] = useState("accueil");
  const [, setLocation] = useLocation();
  const { clientSession, isLoading, logout, requireAuth } = useClientAuth();

  // Rediriger si pas authentifié
  if (!isLoading && !clientSession) {
    requireAuth();
    return null;
  }

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/client/appointments'],
    queryFn: () => apiRequest('GET', `/api/client/appointments`).then(res => res.json()),
    enabled: !!clientSession?.id,
  });

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: () => apiRequest('GET', `/api/conversations`).then(res => res.json()),
    enabled: !!clientSession?.id,
  });

  const handleLogout = logout;

  if (isLoading || !clientSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt: Appointment) => 
    apt.status === 'confirmed' && new Date(apt.appointmentDate) >= new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium">
                    {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Bonjour {clientSession.firstName}</h1>
                <p className="text-sm text-gray-500">Gérez vos rendez-vous</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" onClick={handleLogout}>
                <LogOut className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation mobile moderne */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'accueil', label: 'Accueil', icon: Calendar },
            { id: 'rendez-vous', label: 'RDV', icon: Clock },
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'profil', label: 'Profil', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-violet-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mb-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-lg mx-auto px-4 pb-20">
        {activeTab === 'accueil' && (
          <div className="space-y-6">
            {/* Recherche épurée */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Rechercher un salon, service..."
                className="pl-10 h-12 border-gray-200 rounded-xl bg-white"
                onClick={() => setLocation('/')}
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-lg"
                onClick={() => setLocation('/')}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="h-14 flex flex-col space-y-1 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg text-sm"
                onClick={() => setLocation('/')}
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Nouveau RDV</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 flex flex-col space-y-1 bg-white border-gray-200 hover:bg-gray-50 rounded-lg text-sm"
                onClick={() => setActiveTab('rendez-vous')}
              >
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Mes RDV</span>
              </Button>
            </div>

            {/* Prochains rendez-vous */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Prochains rendez-vous</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('rendez-vous')}
                  className="text-violet-600 hover:text-violet-700 p-0"
                >
                  Voir tout
                </Button>
              </div>

              {appointmentsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-gray-100" />
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{appointment.serviceName}</h3>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status === 'confirmed' ? 'Confirmé' : appointment.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{appointment.businessName}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(appointment.appointmentDate), 'd MMM', { locale: fr })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.startTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{appointment.totalPrice}€</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-6 w-6 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                            onClick={() => setActiveTab('rendez-vous')}
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Aucun rendez-vous à venir</h3>
                  <p className="text-sm text-gray-500 mb-4">Réservez votre prochain soin</p>
                  <Button 
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 h-9 px-4"
                    onClick={() => setLocation('/')}
                  >
                    Réserver maintenant
                  </Button>
                </div>
              )}
            </div>

            {/* Politique d'annulation */}
            {upcomingAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 text-xs mb-1">Info importante</h4>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      <strong>Annulation gratuite jusqu'à 24h avant le RDV.</strong> 
                      Passé ce délai, l'acompte peut ne pas être remboursé selon la politique du salon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages récents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Messages récents</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('messages')}
                  className="text-violet-600 hover:text-violet-700 p-0 h-6 text-xs"
                >
                  Voir tout
                </Button>
              </div>

              {conversationsLoading ? (
                <div className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
              ) : conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.slice(0, 2).map((conversation: Conversation) => (
                    <div key={conversation.id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {conversation.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">Salon Professionnel</p>
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessageContent}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Aucun message</h3>
                  <p className="text-sm text-gray-500">Vos conversations apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rendez-vous' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Mes rendez-vous</h1>
              <Button 
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 h-8 px-3"
                onClick={() => setLocation('/')}
              >
                <Plus className="w-3 h-3 mr-1" />
                <span className="text-xs">Nouveau</span>
              </Button>
            </div>

            {appointmentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appointment: Appointment) => (
                  <div key={appointment.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{appointment.serviceName}</h3>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? 'Confirmé' : 
                             appointment.status === 'pending' ? 'En attente' :
                             appointment.status === 'cancelled' ? 'Annulé' : appointment.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{appointment.businessName}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(appointment.appointmentDate), 'd MMMM yyyy', { locale: fr })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">{appointment.notes}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 mb-2">{appointment.totalPrice}€</p>
                        {appointment.status === 'confirmed' && new Date(appointment.appointmentDate) > new Date() && (
                          <div className="flex flex-col space-y-1">
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                              Déplacer
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                              Annuler
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-500 mb-6">Commencez par réserver votre premier soin</p>
                <Button 
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setLocation('/')}
                >
                  Réserver maintenant
                </Button>
              </div>
            )}
            
            {/* Politique d'annulation */}
            {appointments.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800 text-sm mb-1">Politique d'annulation</h4>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      <strong>Annulation gratuite jusqu'à 24h avant le rendez-vous.</strong> 
                      Passé ce délai, l'acompte versé peut ne pas être remboursé selon la politique du salon. 
                      Contactez directement l'établissement pour connaître leurs conditions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <Button 
                onClick={() => setLocation('/messaging')}
                className="bg-violet-600 hover:bg-violet-700 h-8 px-3"
                size="sm"
              >
                <AtSign className="w-3 h-3 mr-1" />
                <span className="text-xs">Messagerie</span>
              </Button>
            </div>

            {conversationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation: Conversation) => (
                  <div key={conversation.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-violet-100 text-violet-600 font-medium">
                          SP
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">Salon Professionnel</h3>
                          <span className="text-xs text-gray-400">
                            {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessageContent}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                <p className="text-gray-500 mb-6">Vos conversations avec les salons apparaîtront ici</p>
                <Button 
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setLocation('/messaging')}
                >
                  Ouvrir la messagerie
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>

            {/* Informations profil */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg font-medium">
                    {clientSession.firstName.charAt(0)}{clientSession.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {clientSession.firstName} {clientSession.lastName}
                  </h2>
                  <p className="text-gray-500">{clientSession.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Informations personnelles</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Notifications</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Favoris</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>

                <div 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setLocation('/settings')}
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Paramètres</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-center h-12 border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}