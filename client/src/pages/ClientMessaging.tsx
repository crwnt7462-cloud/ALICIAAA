import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical,
  Search, Plus, Archive, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isFromClient: boolean;
}

interface Conversation {
  id: string;
  professionalName: string;
  professionalAvatar?: string;
  salonName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function ClientMessaging() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversations simulées
  const conversations: Conversation[] = [
    {
      id: "conv-1",
      professionalName: "Sophie Martin",
      professionalAvatar: "",
      salonName: "Salon Excellence",
      lastMessage: "Parfait ! À demain pour votre rendez-vous de 14h",
      lastMessageTime: "14:30",
      unreadCount: 0,
      isOnline: true
    },
    {
      id: "conv-2", 
      professionalName: "Julie Dupont",
      professionalAvatar: "",
      salonName: "Beauty Center",
      lastMessage: "Je vous confirme la disponibilité pour vendredi",
      lastMessageTime: "12:15",
      unreadCount: 2,
      isOnline: false
    },
    {
      id: "conv-3",
      professionalName: "Marie Leroy",
      professionalAvatar: "",
      salonName: "Coiffure Prestige",
      lastMessage: "Merci pour votre confiance !",
      lastMessageTime: "Hier",
      unreadCount: 0,
      isOnline: true
    }
  ];

  // Messages simulés
  const messages: Message[] = [
    {
      id: "msg-1",
      content: "Bonjour, j'aimerais modifier mon rendez-vous de demain",
      senderId: "client-1",
      senderName: "Vous",
      timestamp: "14:25",
      isFromClient: true
    },
    {
      id: "msg-2",
      content: "Bonjour ! Bien sûr, à quelle heure préféreriez-vous ?",
      senderId: "pro-1",
      senderName: "Sophie Martin",
      timestamp: "14:27",
      isFromClient: false
    },
    {
      id: "msg-3",
      content: "Serait-il possible d'avoir un créneau vers 16h ?",
      senderId: "client-1", 
      senderName: "Vous",
      timestamp: "14:28",
      isFromClient: true
    },
    {
      id: "msg-4",
      content: "Parfait ! À demain pour votre rendez-vous de 14h",
      senderId: "pro-1",
      senderName: "Sophie Martin", 
      timestamp: "14:30",
      isFromClient: false
    }
  ];

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Simulation d'envoi
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès.",
    });
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.professionalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.salonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex">
      {/* Sidebar conversations */}
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm border-r border-gray-100/50 flex flex-col">
        {/* Header sidebar */}
        <div className="p-4 border-b border-gray-100/50">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/client/dashboard')}
              className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900">Messages</h1>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50/50 border-gray-200/50"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setLocation(`/message/${conversation.id}`)}
              className={`p-4 border-b border-gray-100/50 cursor-pointer hover:bg-gray-50/50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-purple-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.professionalAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm">
                      {conversation.professionalName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {conversation.professionalName}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    {conversation.salonName}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-purple-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header chat */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.professionalAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm">
                      {selectedConv.professionalName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedConv.professionalName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedConv.salonName}
                      {selectedConv.isOnline && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          En ligne
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isFromClient
                      ? 'bg-purple-600 text-white'
                      : 'bg-white shadow-sm border border-gray-100'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isFromClient ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100/50 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-gray-50/50 border-gray-200/50"
                />
                <Button 
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 p-0 gradient-bg rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Sélectionnez une conversation</p>
              <p className="text-sm text-gray-500">
                Choisissez un professionnel pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}