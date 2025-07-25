// Messagerie mobile iPhone style pour pros et clients
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Plus,
  X,
  MessageCircle,
  Calendar,
  Gift,
  Users
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  userType: 'client' | 'pro';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participant: User;
  lastMessage?: string;
  timestamp?: string;
  unread: number;
  messages: Message[];
}

interface MessagingMobileProps {
  userType: 'client' | 'pro';
  currentUser?: User;
}

export default function MessagingMobile({ userType, currentUser }: MessagingMobileProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<'conversations' | 'chat' | 'search'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversations mockées pour le moment
  const conversations: Conversation[] = [
    {
      id: 'conv_1',
      participant: {
        id: 'user_1',
        name: 'Marie Dupont',
        handle: '@marie_d',
        userType: userType === 'pro' ? 'client' : 'pro',
        isOnline: true,
        lastSeen: 'En ligne'
      },
      lastMessage: 'Merci beaucoup pour ce magnifique soin ! 💕',
      timestamp: '14:30',
      unread: 2,
      messages: [
        {
          id: 'msg_1',
          senderId: 'user_1',
          content: 'Bonjour ! J\'aimerais prendre rendez-vous cette semaine',
          timestamp: '13:00',
          isRead: true
        },
        {
          id: 'msg_2',
          senderId: 'current',
          content: 'Bonjour Marie ! J\'ai de la disponibilité jeudi à 10h ou vendredi à 14h',
          timestamp: '13:15',
          isRead: true
        },
        {
          id: 'msg_3',
          senderId: 'user_1',
          content: 'Parfait ! Je prends jeudi à 10h',
          timestamp: '13:20',
          isRead: true
        },
        {
          id: 'msg_4',
          senderId: 'current',
          content: 'C\'est noté ! Rendez-vous confirmé 👍',
          timestamp: '13:25',
          isRead: true
        },
        {
          id: 'msg_5',
          senderId: 'user_1',
          content: 'Merci beaucoup pour ce magnifique soin ! 💕',
          timestamp: '14:30',
          isRead: false
        }
      ]
    },
    {
      id: 'conv_2',
      participant: {
        id: 'user_2',
        name: 'Sophie Martin',
        handle: '@sophie_m',
        userType: userType === 'pro' ? 'client' : 'pro',
        isOnline: false,
        lastSeen: 'Il y a 2h'
      },
      lastMessage: 'Pouvez-vous confirmer mon RDV de demain ?',
      timestamp: 'Hier',
      unread: 1,
      messages: [
        {
          id: 'msg_6',
          senderId: 'user_2',
          content: 'Bonjour, pouvez-vous confirmer mon rendez-vous de demain à 15h ?',
          timestamp: '12:15',
          isRead: false
        }
      ]
    }
  ];

  // Recherche d'utilisateurs
  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery<User[]>({
    queryKey: ['/api/users/search', searchTerm],
    enabled: searchTerm.length > 0 && isSearching,
    refetchOnWindowFocus: false
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      return apiRequest('POST', '/api/messages', data);
    },
    onSuccess: () => {
      setMessageContent('');
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const sendMessage = () => {
    if (!messageContent.trim() || !selectedConversation) return;
    
    // Pour le moment simulation locale
    toast({
      title: "Message envoyé",
      description: `Message envoyé à ${selectedConv?.participant.name}`
    });
    setMessageContent('');
  };

  const startNewConversation = (user: User) => {
    // Créer nouvelle conversation
    setIsSearching(false);
    setSearchTerm('');
    setView('chat');
    toast({
      title: "Nouvelle conversation",
      description: `Conversation démarrée avec ${user.name}`
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  // Header mobile
  const renderHeader = () => {
    if (view === 'conversations') {
      return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setLocation(userType === 'pro' ? '/business-features' : '/client-dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSearching(true);
                setView('search');
              }}
              className="p-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }

    if (view === 'search') {
      return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setView('conversations');
                setIsSearching(false);
                setSearchTerm('');
              }}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Nouveau message</h1>
          </div>
        </div>
      );
    }

    if (view === 'chat' && selectedConv) {
      return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setView('conversations');
                  setSelectedConversation(null);
                }}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(selectedConv.participant.name)}
                </div>
                {selectedConv.participant.isOnline && (
                  <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{selectedConv.participant.name}</h3>
                <p className="text-xs text-gray-500">{selectedConv.participant.lastSeen}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="p-2">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="p-2">
                <Video className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  // Vue conversations
  const renderConversations = () => (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="flex items-center gap-3 p-4 border-b border-gray-100 active:bg-gray-50"
          onClick={() => {
            setSelectedConversation(conv.id);
            setView('chat');
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {getInitials(conv.participant.name)}
            </div>
            {conv.participant.isOnline && (
              <div className="absolute -bottom-0 -right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900 truncate">{conv.participant.name}</h4>
              <div className="flex items-center gap-2">
                {conv.unread > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread}
                  </div>
                )}
                <span className="text-xs text-gray-500">{conv.timestamp}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
          </div>
        </div>
      ))}

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
          <p className="text-gray-600 mb-4">Commencez une conversation en appuyant sur le bouton +</p>
        </div>
      )}
    </div>
  );

  // Vue recherche
  const renderSearch = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un utilisateur (@nom)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 border-0 rounded-2xl"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearchLoading && (
          <div className="p-4 text-center text-gray-500">
            Recherche en cours...
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="divide-y divide-gray-100">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-4 active:bg-gray-50"
                onClick={() => startNewConversation(user)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {getInitials(user.name)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.handle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && !isSearchLoading && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Aucun utilisateur trouvé pour "{searchTerm}"
          </div>
        )}

        {!searchTerm && (
          <div className="p-4 text-center text-gray-500">
            Tapez @ suivi d'un nom pour rechercher
          </div>
        )}
      </div>
    </div>
  );

  // Vue chat
  const renderChat = () => {
    if (!selectedConv) return null;

    return (
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-3">
            {selectedConv.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    message.senderId === 'current'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 min-h-[44px] flex items-center">
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
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-11 h-11 p-0 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {renderHeader()}
      
      {view === 'conversations' && renderConversations()}
      {view === 'search' && renderSearch()}
      {view === 'chat' && renderChat()}
    </div>
  );
}