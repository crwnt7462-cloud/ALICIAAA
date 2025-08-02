// Messagerie Pro parfaite niveau Planity/Treatwell
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Calendar, 
  MoreVertical,
  UserCheck,
  Clock,
  MessageCircle,
  Star,
  MapPin,
  Gift,
  Scissors,
  Archive,
  Filter,
  Plus,
  Users,
  TrendingUp,
  CheckCheck,
  Eye
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'appointment' | 'payment' | 'photo';
  isRead: boolean;
  metadata?: {
    appointmentId?: string;
    serviceName?: string;
    amount?: number;
    imageUrl?: string;
  };
}

interface Conversation {
  id: string;
  clientName: string;
  clientHandle: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'VIP' | 'Fidèle' | 'Nouveau' | 'Régulier';
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  totalSpent: number;
  totalVisits: number;
  favoriteService: string;
  nextAppointment?: string;
  clientSince: string;
  rating: number;
  tags: string[];
}

export default function ProMessagingPerfect() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientInfo, setShowClientInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    {
      id: 'conv_1',
      clientName: 'Marie Dupont',
      clientHandle: '@marie_d',
      lastMessage: 'Merci beaucoup pour ce magnifique soin ! Je recommande vivement 💕',
      timestamp: '2024-01-25T14:30:00Z',
      unread: 2,
      status: 'VIP',
      avatar: 'MD',
      isOnline: true,
      lastSeen: 'En ligne',
      totalSpent: 1250,
      totalVisits: 15,
      favoriteService: 'Soin du visage Premium',
      nextAppointment: '2024-01-28T10:00:00Z',
      clientSince: '2023-03-15',
      rating: 5,
      tags: ['VIP', 'Fidèle', 'Recommandatrice']
    },
    {
      id: 'conv_2',
      clientName: 'Sophie Martin',
      clientHandle: '@sophie_m',
      lastMessage: 'Bonjour, pouvez-vous confirmer mon rendez-vous de demain à 15h ? Merci',
      timestamp: '2024-01-25T12:15:00Z',
      unread: 1,
      status: 'Fidèle',
      avatar: 'SM',
      isOnline: false,
      lastSeen: 'Il y a 2h',
      totalSpent: 680,
      totalVisits: 8,
      favoriteService: 'Coupe + Couleur',
      nextAppointment: '2024-01-26T15:00:00Z',
      clientSince: '2023-06-20',
      rating: 4.8,
      tags: ['Ponctuelle', 'Recommande']
    },
    {
      id: 'conv_3',
      clientName: 'Emma Laurent',
      clientHandle: '@emma_l',
      lastMessage: 'Parfait, j\'arrive dans 10 minutes !',
      timestamp: '2024-01-24T16:45:00Z',
      unread: 0,
      status: 'Nouveau',
      avatar: 'EL',
      isOnline: true,
      lastSeen: 'En ligne',
      totalSpent: 120,
      totalVisits: 2,
      favoriteService: 'Manucure',
      clientSince: '2024-01-10',
      rating: 5,
      tags: ['Nouveau', 'Enthousiaste']
    },
    {
      id: 'conv_4',
      clientName: 'Julia Moreau',
      clientHandle: '@julia_m',
      lastMessage: 'Auriez-vous une place libre cette semaine pour un soin complet ?',
      timestamp: '2024-01-24T10:20:00Z',
      unread: 3,
      status: 'VIP',
      avatar: 'JM',
      isOnline: false,
      lastSeen: 'Il y a 1h',
      totalSpent: 2100,
      totalVisits: 22,
      favoriteService: 'Package VIP Complet',
      nextAppointment: '2024-01-27T14:00:00Z',
      clientSince: '2022-09-12',
      rating: 5,
      tags: ['VIP', 'Grosse dépenseuse', 'Influenceuse']
    },
    {
      id: 'conv_5',
      clientName: 'Camille Dubois',
      clientHandle: '@camille_d',
      lastMessage: 'Merci pour vos conseils beauté, à très bientôt !',
      timestamp: '2024-01-23T18:30:00Z',
      unread: 0,
      status: 'Régulier',
      avatar: 'CD',
      isOnline: false,
      lastSeen: 'Hier',
      totalSpent: 450,
      totalVisits: 6,
      favoriteService: 'Épilation',
      clientSince: '2023-08-05',
      rating: 4.5,
      tags: ['Régulière', 'Conseils']
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg_1',
      senderId: 'client_1',
      content: 'Bonjour ! J\'aimerais prendre rendez-vous pour un soin du visage cette semaine si possible',
      timestamp: '2024-01-25T13:00:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_2',
      senderId: 'pro_1',
      content: 'Bonjour Marie ! Bien sûr, j\'ai de la disponibilité jeudi 28 à 10h ou vendredi 29 à 14h. Lequel vous convient le mieux ?',
      timestamp: '2024-01-25T13:15:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_3',
      senderId: 'client_1',
      content: 'Parfait ! Je prends jeudi 28 à 10h s\'il vous plaît',
      timestamp: '2024-01-25T13:20:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_4',
      senderId: 'pro_1',
      content: 'C\'est noté ! Rendez-vous confirmé pour jeudi 28 janvier à 10h00 pour un soin du visage Premium (85€). Je vous envoie la confirmation.',
      timestamp: '2024-01-25T13:25:00Z',
      type: 'appointment',
      isRead: true,
      metadata: {
        appointmentId: 'apt_123',
        serviceName: 'Soin du visage Premium',
        amount: 85
      }
    },
    {
      id: 'msg_5',
      senderId: 'client_1',
      content: 'Merci beaucoup pour ce magnifique soin ! Je recommande vivement 💕',
      timestamp: '2024-01-25T14:30:00Z',
      type: 'text',
      isRead: false
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.clientHandle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conv.unread > 0;
    if (activeTab === 'vip') return matchesSearch && conv.status === 'VIP';
    if (activeTab === 'archived') return false; // Pas d'archives pour le moment
    
    return matchesSearch;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const unreadCount = conversations.reduce((acc, conv) => acc + conv.unread, 0);
  const vipCount = conversations.filter(conv => conv.status === 'VIP').length;

  const sendMessage = () => {
    if (!messageContent.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: `Message envoyé à ${selectedConv?.clientName}`
    });
    
    setMessageContent('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-purple-800 border-purple-200';
      case 'Fidèle': return 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-blue-800 border-blue-200';
      case 'Régulier': return 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-green-800 border-green-200';
      case 'Nouveau': return 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-orange-800 border-orange-200';
      default: return 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/business-features')}
                className="h-10 w-10 p-0 rounded-full hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Messagerie Pro</h1>
                <p className="text-gray-600">Gérez toutes vos conversations clients</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-blue-800">
                {unreadCount} non lus
              </Badge>
              <Badge variant="secondary" className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-purple-800">
                {vipCount} VIP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal - Mobile First */}
      <div className="h-[calc(100vh-80px)] flex flex-col lg:max-w-7xl lg:mx-auto lg:p-4">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 h-full">
          {/* Sidebar conversations - Hidden on mobile if conversation selected */}
          <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} lg:col-span-4 flex flex-col h-full`}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                </div>
                
                {/* Recherche */}
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Onglets */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs">
                      Tous ({conversations.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Non lus ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="vip" className="text-xs">
                      VIP ({vipCount})
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="text-xs">
                      Archives
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-0 h-[600px] overflow-y-auto">
                <div className="space-y-0">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation === conv.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20">
                            {conv.avatar}
                          </div>
                          {conv.isOnline && (
                            <div className="absolute -bottom-0 -right-0 w-4 h-4 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {conv.clientName}
                            </h4>
                            <div className="flex items-center gap-1">
                              {conv.unread > 0 && (
                                <Badge className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 text-xs min-w-[20px] h-5 flex items-center justify-center">
                                  {conv.unread}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(conv.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getStatusColor(conv.status)}`}>
                              {conv.status}
                            </Badge>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(conv.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 truncate mb-2">
                            {conv.lastMessage}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{conv.totalVisits} visites</span>
                            <span>{conv.totalSpent}€</span>
                            {conv.nextAppointment && (
                              <Badge variant="outline" className="text-xs">
                                RDV prévu
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de conversation - Full screen on mobile */}
          <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} lg:col-span-5 flex flex-col h-full`}>
            {selectedConv ? (
              <Card className="h-full flex flex-col">
                {/* Header conversation - Mobile optimized */}
                <div className="bg-white border-b p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-1"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20">
                        {selectedConv.avatar}
                      </div>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConv.clientName}</h3>
                      <p className="text-sm text-gray-500">{selectedConv.lastSeen}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-2 lg:hidden"
                      onClick={() => setShowClientInfo(!showClientInfo)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages - iPhone style */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'pro_1' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 ${
                            message.senderId === 'pro_1'
                              ? 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-2xl rounded-br-md ml-auto'
                              : 'bg-white text-gray-900 rounded-2xl rounded-bl-md border shadow-sm'
                          }`}
                        >
                          {message.type === 'appointment' && message.metadata ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Rendez-vous confirmé</span>
                              </div>
                              <div className="text-sm">
                                <p>{message.metadata.serviceName}</p>
                                <p>{message.metadata.amount}€</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs opacity-70 ${
                              message.senderId === 'pro_1' ? 'text-blue-100' : 'text-gray-600'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {message.senderId === 'pro_1' && (
                              <CheckCheck className={`h-3 w-3 ${
                                message.isRead ? 'text-blue-200' : 'text-blue-300'
                              }`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Zone de saisie iMessage style */}
                <div className="bg-white border-t p-3 lg:p-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-3xl px-4 py-3 min-h-[44px] flex items-center">
                      <Textarea
                        placeholder="iMessage"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={1}
                        className="border-0 p-0 resize-none focus:ring-0 bg-transparent text-base w-full"
                        style={{ minHeight: '20px', maxHeight: '100px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!messageContent.trim()}
                      className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-full w-11 h-11 p-0 shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Actions rapides - Hidden on mobile to save space */}
                  <div className="hidden lg:flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Prendre RDV
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      Offre spéciale
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Scissors className="h-3 w-3 mr-1" />
                      Nos services
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                  <p className="text-gray-600">Choisissez une conversation dans la liste pour commencer à discuter</p>
                </div>
              </Card>
            )}
          </div>

          {/* Panel info client - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-3">
            {selectedConv && showClientInfo ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Profil Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Info de base */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20">
                      {selectedConv.avatar}
                    </div>
                    <h3 className="font-medium text-lg">{selectedConv.clientName}</h3>
                    <p className="text-gray-600">{selectedConv.clientHandle}</p>
                    <Badge className={`mt-2 ${getStatusColor(selectedConv.status)}`}>
                      {selectedConv.status}
                    </Badge>
                  </div>
                  
                  {/* Statistiques */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">{selectedConv.totalVisits}</div>
                      <div className="text-xs text-gray-600">Visites</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{selectedConv.totalSpent}€</div>
                      <div className="text-xs text-gray-600">Dépensé</div>
                    </div>
                  </div>
                  
                  {/* Service préféré */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Service préféré</h4>
                    <p className="text-sm text-gray-600">{selectedConv.favoriteService}</p>
                  </div>
                  
                  {/* Prochain RDV */}
                  {selectedConv.nextAppointment && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Prochain rendez-vous</h4>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-900">
                            {new Date(selectedConv.nextAppointment).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedConv.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Prendre RDV
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Gift className="h-4 w-4 mr-2" />
                      Offre personnalisée
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informations client</h3>
                  <p className="text-gray-600">Sélectionnez une conversation pour voir le profil client</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}