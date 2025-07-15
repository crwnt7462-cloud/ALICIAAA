import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  MessageCircle,
  Users,
  Clock,
  CheckCheck,
  Star,
  Calendar,
  MapPin,
  Filter,
  Plus,
  Archive,
  Trash2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'business';
  content: string;
  timestamp: string;
  read: boolean;
  messageType: 'text' | 'image' | 'appointment' | 'system';
  metadata?: any;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  clientRating: number;
  totalAppointments: number;
  lastAppointment: string;
  avatar?: string;
  tags: string[];
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
  totalAppointments: number;
  totalSpent: number;
  averageRating: number;
  preferredServices: string[];
  notes: string;
}

export default function DirectMessaging() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'conversations' | 'clients' | 'archived'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulation de données - Dans la vraie app, ces données viendraient de l'API
  const { data: conversations } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      return [
        {
          id: "conv1",
          clientId: "client1",
          clientName: "Marie Laurent",
          clientPhone: "06 12 34 56 78",
          clientEmail: "marie.laurent@email.com",
          lastMessage: "Merci pour le rendez-vous, j'ai adoré ma nouvelle coupe !",
          lastMessageTime: "2024-01-15T14:30:00Z",
          unreadCount: 0,
          isOnline: true,
          clientRating: 5,
          totalAppointments: 8,
          lastAppointment: "2024-01-12",
          tags: ["VIP", "Fidèle"]
        },
        {
          id: "conv2",
          clientId: "client2",
          clientName: "Sophie Martin",
          clientPhone: "06 87 65 43 21",
          clientEmail: "sophie.martin@email.com",
          lastMessage: "Bonjour, j'aimerais changer la couleur de mes cheveux, avez-vous des créneaux cette semaine ?",
          lastMessageTime: "2024-01-15T09:15:00Z",
          unreadCount: 2,
          isOnline: false,
          clientRating: 4.8,
          totalAppointments: 12,
          lastAppointment: "2024-01-08",
          tags: ["Régulière"]
        },
        {
          id: "conv3",
          clientId: "client3",
          clientName: "Emma Rodriguez",
          clientPhone: "06 45 67 89 12",
          clientEmail: "emma.rodriguez@email.com",
          lastMessage: "Parfait ! À demain alors 😊",
          lastMessageTime: "2024-01-14T16:45:00Z",
          unreadCount: 0,
          isOnline: true,
          clientRating: 5,
          totalAppointments: 15,
          lastAppointment: "2024-01-10",
          tags: ["VIP", "Recommande"]
        }
      ] as Conversation[];
    }
  });

  const { data: messages } = useQuery({
    queryKey: ['/api/messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      return [
        {
          id: "msg1",
          conversationId: selectedConversation,
          senderId: "client1",
          senderName: "Marie Laurent",
          senderType: "client",
          content: "Bonjour ! Je souhaiterais prendre rendez-vous pour une coloration",
          timestamp: "2024-01-15T10:00:00Z",
          read: true,
          messageType: "text"
        },
        {
          id: "msg2",
          conversationId: selectedConversation,
          senderId: "business1",
          senderName: "Studio Élégance",
          senderType: "business",
          content: "Bonjour Marie ! Bien sûr, j'ai plusieurs créneaux disponibles cette semaine. Quelle couleur envisagez-vous ?",
          timestamp: "2024-01-15T10:05:00Z",
          read: true,
          messageType: "text"
        },
        {
          id: "msg3",
          conversationId: selectedConversation,
          senderId: "client1",
          senderName: "Marie Laurent",
          senderType: "client",
          content: "J'aimerais passer au blond cendré, pensez-vous que cela m'irait bien ?",
          timestamp: "2024-01-15T10:10:00Z",
          read: true,
          messageType: "text"
        },
        {
          id: "msg4",
          conversationId: selectedConversation,
          senderId: "business1",
          senderName: "Studio Élégance",
          senderType: "business",
          content: "Excellente idée ! Avec votre teint, le blond cendré sera parfait. Je vous propose jeudi 14h ou vendredi 10h ?",
          timestamp: "2024-01-15T10:15:00Z",
          read: true,
          messageType: "text"
        },
        {
          id: "msg5",
          conversationId: selectedConversation,
          senderId: "client1",
          senderName: "Marie Laurent",
          senderType: "client",
          content: "Jeudi 14h c'est parfait ! Merci beaucoup",
          timestamp: "2024-01-15T10:20:00Z",
          read: true,
          messageType: "text"
        }
      ] as Message[];
    },
    enabled: !!selectedConversation
  });

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; conversationId: string }) => {
      return apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setMessageText("");
    }
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      content: messageText,
      conversationId: selectedConversation
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversationData = conversations?.find(c => c.id === selectedConversation);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/business-features")}
              className="text-gray-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messagerie Pro</h1>
              <p className="text-sm text-gray-600">Communiquez directement avec vos clients</p>
            </div>
          </div>
          <Badge className="bg-violet-100 text-violet-700">Premium</Badge>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Liste des conversations */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Onglets et recherche */}
          <div className="p-4 border-b border-gray-200">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="conversations">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="clients">
                  <Users className="w-4 h-4 mr-2" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <Archive className="w-4 h-4 mr-2" />
                  Archives
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="conversations" className="mt-0">
              {conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-violet-50 border-violet-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-violet-100 text-violet-600 font-semibold">
                          {conversation.clientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.clientName}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-violet-600 text-white min-w-[20px] h-5 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">{conversation.clientRating}</span>
                        </div>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{conversation.totalAppointments} RDV</span>
                        
                        <div className="flex gap-1 ml-auto">
                          {conversation.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation && selectedConversationData ? (
            <>
              {/* Header conversation */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-violet-100 text-violet-600 font-semibold">
                        {selectedConversationData.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversationData.clientName}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${selectedConversationData.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span>{selectedConversationData.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                        <span>•</span>
                        <span>{selectedConversationData.totalAppointments} rendez-vous</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'business' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'business'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        message.senderType === 'business' ? 'text-violet-200' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderType === 'business' && (
                          <CheckCheck className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[40px] max-h-[120px] resize-none"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white mb-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* État vide */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600">
                  Choisissez un client pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}