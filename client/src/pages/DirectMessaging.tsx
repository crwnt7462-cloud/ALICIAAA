import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Archive,
  Crown,
  Plus,
  Filter
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

export default function DirectMessaging() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'conversations' | 'clients' | 'archived'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulation de données
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
    <div className="h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex flex-col">
      {/* Header moderne */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/business-features")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Messagerie Pro
                </h1>
                <p className="text-sm text-gray-600">Communication directe avec vos clients</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar moderne */}
        <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-sm">
          {/* Navigation par onglets */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex rounded-xl bg-gray-50/80 p-1 mb-4 shadow-inner">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'conversations'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
                <Badge className="bg-violet-500 text-white text-xs">3</Badge>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'clients'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users className="w-4 h-4" />
                Clients
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'archived'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Archive className="w-4 h-4" />
                Archives
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'conversations' && (
              <div className="space-y-1 p-2">
                {conversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      selectedConversation === conversation.id 
                        ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 shadow-sm' 
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold">
                            {conversation.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
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
                              <Badge className="bg-violet-500 text-white min-w-[20px] h-5 text-xs rounded-full">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate mb-2 leading-relaxed">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{conversation.clientRating}</span>
                            </div>
                            <span>•</span>
                            <span>{conversation.totalAppointments} RDV</span>
                          </div>
                          
                          <div className="flex gap-1">
                            {conversation.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-2 py-0 bg-white/80 border-violet-200 text-violet-700"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col bg-white/40">
          {selectedConversation && selectedConversationData ? (
            <>
              {/* Header conversation */}
              <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-violet-100">
                      <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold">
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
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'business' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.senderType === 'business'
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
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

              {/* Zone de saisie moderne */}
              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 p-4 shadow-sm">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="sm" className="mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full">
                    <Paperclip className="w-5 h-5" />
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
                      className="min-h-[44px] max-h-[120px] resize-none border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white mb-2 rounded-full w-11 h-11 p-0 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* État vide moderne */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Choisissez un client dans la liste pour commencer à discuter et gérer vos rendez-vous
                </p>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}