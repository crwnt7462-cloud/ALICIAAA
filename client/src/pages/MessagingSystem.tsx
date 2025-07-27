import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, ArrowLeft, Search, Phone, Video, 
  MoreVertical, Calendar, Star, Paperclip, Smile, 
  CheckCircle2, Clock, Users, Hash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  handle: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  isOnline?: boolean;
  type: 'client' | 'professional';
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  mentions?: string[];
  isRead: boolean;
  type: 'text' | 'appointment' | 'system';
}

export default function MessagingSystem() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState<Contact[]>([]);

  // Mock data pour les contacts
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Marie Dubois",
      handle: "@marie.dubois",
      avatar: "/api/placeholder/32/32",
      lastMessage: "Parfait pour demain à 14h !",
      timestamp: "Il y a 5min",
      unread: 2,
      isOnline: true,
      type: 'client'
    },
    {
      id: "2",
      name: "Sophie Martin",
      handle: "@sophie.martin",
      avatar: "/api/placeholder/32/32",
      lastMessage: "Je confirme votre RDV",
      timestamp: "Il y a 1h",
      unread: 0,
      isOnline: false,
      type: 'professional' 
    },
    {
      id: "3",
      name: "Julie Dupont",
      handle: "@julie.dupont",
      avatar: "/api/placeholder/32/32",
      lastMessage: "Merci pour le soin !",
      timestamp: "Hier",
      unread: 1,
      isOnline: true,
      type: 'client'
    }
  ];

  // Mock data pour les messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! J'aimerais prendre rendez-vous pour demain si possible.",
      senderId: "1",
      senderName: "Marie Dubois",
      timestamp: "14:20",
      isRead: true,
      type: 'text'
    },
    {
      id: "2", 
      content: "Bonjour @marie.dubois ! Je vérifie mes disponibilités et je vous confirme dans quelques minutes.",
      senderId: "current",
      senderName: "Moi",
      timestamp: "14:22",
      mentions: ["@marie.dubois"],
      isRead: true,
      type: 'text'
    },
    {
      id: "3",
      content: "Parfait ! J'ai un créneau libre demain à 14h pour votre coupe + brushing. Ça vous convient ?",
      senderId: "current",
      senderName: "Moi", 
      timestamp: "14:25",
      isRead: true,
      type: 'text'
    },
    {
      id: "4",
      content: "Parfait pour demain à 14h ! Merci beaucoup ✨",
      senderId: "1",
      senderName: "Marie Dubois",
      timestamp: "14:26",
      isRead: false,
      type: 'text'
    }
  ]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      // Simulation d'envoi de message
      await new Promise(resolve => setTimeout(resolve, 500));
      return messageData;
    },
    onSuccess: (data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.content,
        senderId: "current",
        senderName: "Moi",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mentions: data.mentions,
        isRead: true,
        type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
      setShowMentions(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;

    // Détecter les mentions @
    const mentions = messageText.match(/@\w+(\.\w+)*/g) || [];
    
    sendMessageMutation.mutate({
      content: messageText,
      recipientId: selectedContact.id,
      mentions
    });
  };

  const handleMentionSearch = (query: string) => {
    setMentionQuery(query);
    if (query.length > 0) {
      const filtered = contacts.filter(contact => 
        contact.handle.toLowerCase().includes(query.toLowerCase()) ||
        contact.name.toLowerCase().includes(query.toLowerCase())
      );
      setMentionUsers(filtered);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (contact: Contact) => {
    const atIndex = messageText.lastIndexOf('@');
    const beforeMention = messageText.substring(0, atIndex);
    const afterMention = messageText.substring(messageText.length);
    
    setMessageText(beforeMention + contact.handle + ' ' + afterMention);
    setShowMentions(false);
    setMentionQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageText(value);
    
    // Détecter si l'utilisateur tape @
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1);
      if (!afterAt.includes(' ')) {
        handleMentionSearch(afterAt);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === "current";
    const messageContent = message.content.replace(
      /@\w+(\.\w+)*/g,
      '<span class="text-purple-600 font-semibold">$&</span>'
    );

    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex gap-3 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          {!isCurrentUser && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                {message.senderName[0]}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`space-y-1 ${isCurrentUser ? 'text-right' : ''}`}>
            {!isCurrentUser && (
              <p className="text-xs text-gray-500 font-medium">{message.senderName}</p>
            )}
            
            <div
              className={`rounded-2xl px-4 py-2 ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: messageContent }} />
            </div>
            
            <div className={`flex items-center gap-1 text-xs text-gray-500 ${isCurrentUser ? 'justify-end' : ''}`}>
              <span>{message.timestamp}</span>
              {isCurrentUser && (
                <CheckCircle2 className={`h-3 w-3 ${message.isRead ? 'text-purple-600' : 'text-gray-400'}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar des contacts */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 rounded-full p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
            
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full p-0"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Liste des contacts */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-purple-50 border-purple-200' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                    {contact.unread && contact.unread > 0 && (
                      <Badge className="bg-purple-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{contact.handle}</span>
                    <Badge variant="secondary" className={`text-xs ${
                      contact.type === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {contact.type === 'client' ? 'Client' : 'Pro'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header conversation */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700">
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedContact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{selectedContact.handle}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className={`text-sm ${selectedContact.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                        {selectedContact.isOnline ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    RDV
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Suggestions de mentions */}
              {showMentions && mentionUsers.length > 0 && (
                <div className="mb-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                  {mentionUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => insertMention(user)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Tapez @ pour mentionner quelqu'un...`}
                    value={messageText}
                    onChange={handleInputChange}
                    className="pr-12"
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {sendMessageMutation.isPending ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <Hash className="h-3 w-3" />
                Utilisez @ pour mentionner des contacts dans vos messages
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
              <p className="text-gray-600">Choisissez un contact pour commencer à échanger</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}