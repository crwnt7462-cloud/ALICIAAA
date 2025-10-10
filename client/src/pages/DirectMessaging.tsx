import { useState, useEffect, useRef, useCallback } from "react";
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
  Filter,
  Bell,
  BellRing,
  Volume2,
  VolumeX
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getGenericGlassButton } from "@/lib/salonColors";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'conversations' | 'clients' | 'archived'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🔔 NOTIFICATIONS : États pour les notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  // 🔄 DONNÉES DYNAMIQUES : Récupération des conversations via API
  const { data: conversations, isLoading: conversationsLoading, error: conversationsError } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des conversations');
      }
      
      return response.json();
    },
    retry: 3,
    staleTime: 30 * 1000, // 30 secondes
    refetchOnWindowFocus: true
  });

  // 🧪 DONNÉES DE TEST : Fallback pour le développement
  const testConversations: Conversation[] = [
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
  ];

  // 🔄 DONNÉES FINALES : API avec fallback de test
  const conversationsData = conversations || testConversations;

  // 🔄 DONNÉES DYNAMIQUES : Récupération des messages via API
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const response = await fetch(`/api/messages?conversationId=${selectedConversation}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      
      return response.json();
    },
    enabled: !!selectedConversation,
    retry: 3,
    staleTime: 10 * 1000, // 10 secondes
    refetchInterval: 30 * 1000 // Rafraîchissement automatique toutes les 30s
  });

  // 🧪 DONNÉES DE TEST : Messages de fallback
  const testMessages: Message[] = [
    {
      id: "msg1",
      conversationId: selectedConversation || "conv1",
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
      conversationId: selectedConversation || "conv1",
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
      conversationId: selectedConversation || "conv1",
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
      conversationId: selectedConversation || "conv1",
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
      conversationId: selectedConversation || "conv1",
      senderId: "client1",
      senderName: "Marie Laurent",
      senderType: "client",
      content: "Jeudi 14h c'est parfait ! Merci beaucoup",
      timestamp: "2024-01-15T10:20:00Z",
      read: true,
      messageType: "text"
    }
  ];

  // 🔄 DONNÉES FINALES : API avec fallback de test
  const messagesData = messages || testMessages;

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

  // 🔒 SÉCURITÉ : Validation et sanitisation des messages
  const sanitizeMessage = (text: string): string => {
    // Supprimer les caractères dangereux et limiter la longueur
    return text
      .trim()
      .replace(/[<>]/g, '') // Supprimer les balises HTML
      .slice(0, 1000); // Limite de caractères
  };

  // 🔒 SÉCURITÉ : Rate limiting côté client
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const MESSAGE_RATE_LIMIT = 2000; // 2 secondes entre les messages

  // 🔔 NOTIFICATIONS : Fonctions de notification
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      // Créer un son de notification simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Impossible de jouer le son de notification:', error);
    }
  }, [soundEnabled]);

  const showNotification = useCallback((message: string, senderName: string) => {
    if (!notificationsEnabled) return;
    
    // Notification du navigateur
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nouveau message de ${senderName}`, {
        body: message,
        icon: '/favicon.ico',
        tag: 'new-message'
      });
    }
    
    // Toast notification
    toast({
      title: `Nouveau message de ${senderName}`,
      description: message,
      duration: 5000,
    });
    
    // Son de notification
    playNotificationSound();
  }, [notificationsEnabled, playNotificationSound, toast]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des notifications pour les nouveaux messages",
        });
      }
    }
  }, [toast]);

  // 🔔 NOTIFICATIONS : Marquer les messages comme lus
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Mettre à jour le compteur local
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.warn('Erreur lors du marquage des messages comme lus:', error);
    }
  }, []);

  // 🔔 NOTIFICATIONS : Marquer comme lu quand on sélectionne une conversation
  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation, markMessagesAsRead]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // 🔒 SÉCURITÉ : Rate limiting
    const now = Date.now();
    if (now - lastMessageTime < MESSAGE_RATE_LIMIT) {
      toast({
        title: "Trop rapide !",
        description: "Veuillez attendre avant d'envoyer un autre message",
        variant: "destructive",
      });
      return;
    }
    
    // 🔒 SÉCURITÉ : Sanitisation avant envoi
    const sanitizedContent = sanitizeMessage(messageText);
    if (sanitizedContent.length === 0) return;
    
    setLastMessageTime(now);
    sendMessageMutation.mutate({
      content: sanitizedContent,
      conversationId: selectedConversation
    });
  };

  // 🔧 OPTIMISATION : Formatage de temps externalisé
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

  // 🔧 OPTIMISATION : Classes CSS réutilisables
  const gradientClasses = {
    primary: "bg-gradient-to-r from-violet-500 to-purple-600",
    hover: "hover:from-violet-600 hover:to-purple-700",
    button: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  // 🔔 NOTIFICATIONS : Détection des nouveaux messages
  useEffect(() => {
    if (!messagesData || messagesData.length === 0) return;
    
    const latestMessage = messagesData[messagesData.length - 1];
    if (latestMessage && latestMessage.id !== lastMessageId) {
      // Nouveau message détecté
      setLastMessageId(latestMessage.id);
      
      // Vérifier si c'est un message reçu (pas envoyé par l'utilisateur actuel)
      if (latestMessage.senderType === 'client' || latestMessage.senderType === 'business') {
        // Déterminer le nom de l'expéditeur
        const senderName = latestMessage.senderName || 'Utilisateur';
        
        // Afficher la notification
        showNotification(latestMessage.content, senderName);
        
        // Mettre à jour le compteur de messages non lus
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messagesData, lastMessageId, showNotification]);

  // 🔔 NOTIFICATIONS : Demander la permission au chargement
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const selectedConversationData = conversationsData?.find((c: Conversation) => c.id === selectedConversation);

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
              <div className="xl:hidden">
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {selectedConversation ? 'Conversation' : 'Messages'}
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1 animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(!conversations || conversationsError) && (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-xs">
                🧪 Mode Test
              </Badge>
            )}
            
            {/* 🔔 NOTIFICATIONS : Contrôles de notification */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`p-2 rounded-full ${notificationsEnabled ? 'text-violet-600 bg-violet-50' : 'text-gray-400'}`}
                title={notificationsEnabled ? 'Désactiver les notifications' : 'Activer les notifications'}
              >
                {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full ${soundEnabled ? 'text-violet-600 bg-violet-50' : 'text-gray-400'}`}
                title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm text-xs">
              <Crown className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Premium</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar responsive */}
        <div className={`${selectedConversation ? 'hidden xl:flex' : 'flex'} w-full xl:w-80 2xl:w-96 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 flex-col shadow-sm`}>
          {/* Navigation par onglets responsive */}
          <div className="p-2 sm:p-3 md:p-4 border-b border-gray-100">
            <div className="flex rounded-xl bg-gray-50/80 p-0.5 sm:p-1 mb-2 sm:mb-3 md:mb-4 shadow-inner">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 md:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'conversations'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden md:inline">Messages</span>
                <span className="xs:hidden sm:inline md:hidden">Chat</span>
                <span className="hidden sm:hidden md:inline">Messages</span>
                {unreadCount > 0 && (
                  <Badge className="bg-pink-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 md:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'clients'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden md:inline">Clients</span>
                <span className="xs:hidden sm:inline md:hidden">Clients</span>
                <span className="hidden sm:hidden md:inline">Clients</span>
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 md:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'archived'
                    ? 'bg-white text-violet-600 shadow-sm transform scale-[0.98]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Archive className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden md:inline">Archives</span>
                <span className="xs:hidden sm:inline md:hidden">Arch</span>
                <span className="hidden sm:hidden md:inline">Archives</span>
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50 h-9 sm:h-10 md:h-12 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Liste des conversations mobile */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'conversations' && (
              <div className="space-y-1 p-1 sm:p-2">
                {conversationsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
                    <span className="ml-2 text-sm text-gray-600">Chargement des conversations...</span>
                  </div>
                ) : (
                  conversationsData?.map((conversation: Conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-2 sm:p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
                      selectedConversation === conversation.id 
                        ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 shadow-sm' 
                        : 'hover:bg-gray-50/80'
                    } ${selectedConversation ? 'xl:hidden' : ''}`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold text-xs sm:text-sm md:text-base">
                            {conversation.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-xs sm:text-sm md:text-base">
                            {conversation.clientName}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-indigo-500 text-white min-w-[16px] h-4 sm:min-w-[18px] sm:h-4 md:min-w-[20px] md:h-5 text-xs rounded-full animate-pulse">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 truncate mb-2 leading-relaxed">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 min-w-0">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              <span className="truncate">{conversation.clientRating}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline truncate">{conversation.totalAppointments} RDV</span>
                          </div>
                          
                          <div className="flex gap-1 flex-shrink-0">
                            {conversation.tags.slice(0, 2).map((tag: string) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1 sm:px-1.5 md:px-2 py-0 bg-white/80 border-violet-200 text-violet-700 truncate max-w-[60px] sm:max-w-[80px]"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {conversation.tags.length > 2 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs px-1 sm:px-1.5 py-0 bg-white/80 border-violet-200 text-violet-700"
                              >
                                +{conversation.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Zone de conversation responsive */}
        <div className={`${selectedConversation ? 'flex' : 'hidden xl:flex'} flex-1 flex-col bg-white/40`}>
          {selectedConversation && selectedConversationData ? (
            <>
              {/* Header conversation responsive */}
              <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-2 sm:p-3 md:p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="xl:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ring-2 ring-violet-100 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-semibold text-xs sm:text-sm md:text-base">
                        {selectedConversationData.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">{selectedConversationData.clientName}</h2>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedConversationData.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="truncate">{selectedConversationData.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline truncate">{selectedConversationData.totalAppointments} rendez-vous</span>
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

              {/* Messages responsive */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
                    <span className="ml-2 text-sm text-gray-600">Chargement des messages...</span>
                  </div>
                ) : (
                  messagesData?.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'business' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[240px] sm:max-w-[280px] md:max-w-xs lg:max-w-md xl:max-w-lg px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
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
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie responsive */}
              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 p-2 sm:p-3 md:p-4 shadow-sm">
                <div className="flex items-end gap-1 sm:gap-2 md:gap-3 max-w-full">
                  <Button variant="ghost" size="sm" className="mb-1 sm:mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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
                      className="min-h-[36px] sm:min-h-[40px] md:min-h-[44px] max-h-[80px] sm:max-h-[100px] md:max-h-[120px] resize-none border-gray-200/60 focus:border-violet-300 focus:ring-violet-200/30 rounded-xl bg-gray-50/50 text-xs sm:text-sm"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="mb-1 sm:mb-2 hover:bg-violet-50 hover:text-violet-600 rounded-full p-1.5 sm:p-2 flex-shrink-0 sm:flex hidden">
                    <Smile className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white mb-1 sm:mb-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 p-0 shadow-lg flex-shrink-0 active:scale-95 transition-transform"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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