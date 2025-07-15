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
      {/* Header mobile optimisé */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/business-features")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Retour</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Messagerie Pro
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Communication directe avec vos clients</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Messages</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm text-xs">
              <Crown className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Premium</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar responsive */}
        <div className={`${selectedConversation ? 'hidden sm:flex' : 'flex'} w-full sm:w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 flex-col shadow-sm`}>
          {/* Navigation par onglets mobile */}
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <div className="flex rounded-xl bg-gray-50/80 p-1 mb-3 sm:mb-4 shadow-inner">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === 'conversations'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chat</span>
                <Badge className="bg-violet-500 text-white text-xs">3</Badge>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === 'clients'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Clients
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === 'archived'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Archives</span>
                <span className="sm:hidden">Arch</span>
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50 h-10 sm:h-12 text-sm"
              />
            </div>
          </div>

          {/* Liste des conversations mobile */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'conversations' && (
              <div className="space-y-1 p-1 sm:p-2">
                {conversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
                      selectedConversation === conversation.id 
                        ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 shadow-sm' 
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold text-sm sm:text-base">
                            {conversation.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {conversation.clientName}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-violet-500 text-white min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 text-xs rounded-full">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 truncate mb-2 leading-relaxed">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{conversation.clientRating}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{conversation.totalAppointments} RDV</span>
                          </div>
                          
                          <div className="flex gap-1">
                            {conversation.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 sm:px-2 py-0 bg-white/80 border-violet-200 text-violet-700"
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

        {/* Zone de conversation mobile */}
        <div className={`${selectedConversation ? 'flex' : 'hidden sm:flex'} flex-1 flex-col bg-white/40`}>
          {selectedConversation && selectedConversationData ? (
            <>
              {/* Header conversation mobile */}
              <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-3 sm:p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="sm:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-violet-100">
                      <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold text-sm sm:text-base">
                        {selectedConversationData.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedConversationData.clientName}</h2>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${selectedConversationData.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span>{selectedConversationData.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{selectedConversationData.totalAppointments} rendez-vous</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full p-2">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-violet-50 hover:text-violet-600 rounded-full p-2">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-violet-50 hover:text-violet-600 rounded-full p-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages mobile */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'business' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
                      message.senderType === 'business'
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 sm:mt-2 text-xs ${
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

              {/* Zone de saisie mobile */}
              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 p-3 sm:p-4 shadow-sm">
                <div className="flex items-end gap-2 sm:gap-3">
                  <Button variant="ghost" size="sm" className="mb-1 sm:mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full p-2 flex-shrink-0">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
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
                      className="min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] resize-none border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50 text-sm"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="mb-1 sm:mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full p-2 flex-shrink-0 sm:flex hidden">
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white mb-1 sm:mb-2 rounded-full w-10 h-10 sm:w-11 sm:h-11 p-0 shadow-lg flex-shrink-0 active:scale-95 transition-transform"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* État vide mobile */
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Sélectionnez une conversation
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Choisissez un client dans la liste pour commencer à discuter et gérer vos rendez-vous
                </p>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full text-sm sm:text-base active:scale-95 transition-transform">
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