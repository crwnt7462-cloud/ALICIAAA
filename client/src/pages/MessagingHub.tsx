import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  MessageCircle, 
  Search, 
  Plus, 
  Send,
  Users,
  Building,
  AtSign,
  Archive,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useClientAuth } from '@/hooks/useClientAuth';
import { MentionInput } from '@/components/MentionInput';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
  id: string;
  professionalUserId: string;
  clientAccountId: string;
  lastMessageAt: string;
  lastMessageContent: string;
  isArchived: boolean;
  professionalName?: string;
  businessName?: string;
  unreadCount?: number;
}

interface Message {
  id: number;
  conversationId: string;
  senderId: string;
  senderType: 'professional' | 'client';
  content: string;
  createdAt: string;
  mentions: string[];
  readAt?: string;
}

export default function MessagingHub() {
  const [, setLocation] = useLocation();
  const { clientSession, isLoading, requireAuth } = useClientAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'new'>('conversations');

  // Vérification d'authentification
  if (!isLoading && !clientSession) {
    requireAuth();
    return null;
  }

  // Query pour récupérer les conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: () => apiRequest('GET', '/api/conversations').then(res => res.json()),
    enabled: !!clientSession?.id,
  });

  // Query pour récupérer les messages d'une conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedConversation],
    queryFn: () => 
      apiRequest('GET', `/api/conversations/${selectedConversation}/messages`).then(res => res.json()),
    enabled: !!selectedConversation,
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, mentions, conversationId }: { 
      content: string; 
      mentions: string[]; 
      conversationId: string;
    }) => {
      const response = await apiRequest('POST', '/api/messages', {
        conversationId,
        content,
        mentions
      });
      if (!response.ok) throw new Error('Erreur lors de l\'envoi');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });

  // Mutation pour créer une nouvelle conversation
  const createConversationMutation = useMutation({
    mutationFn: async (professionalUserId: string) => {
      const response = await apiRequest('POST', '/api/conversations', {
        professionalUserId
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      return response.json();
    },
    onSuccess: (conversation) => {
      setSelectedConversation(conversation.id);
      setActiveTab('conversations');
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      toast({
        title: "Conversation créée",
        description: "Vous pouvez maintenant envoyer des messages",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (content: string, mentions: string[]) => {
    if (selectedConversation) {
      sendMessageMutation.mutate({ content, mentions, conversationId: selectedConversation });
    }
  };

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.professionalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/client-dashboard')}
                className="text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-500">Conversations avec les salons</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('new')}
              className="text-violet-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto bg-white min-h-screen">
        {!selectedConversation ? (
          // Liste des conversations
          <div className="p-4">
            {/* Onglets */}
            <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'conversations'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Conversations
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'new'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Nouveau
              </button>
            </div>

            {activeTab === 'conversations' && (
              <>
                {/* Barre de recherche */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Liste des conversations */}
                {conversationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation: Conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Building className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.businessName || conversation.professionalName}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {conversation.unreadCount && conversation.unreadCount > 0 && (
                                  <Badge className="bg-violet-600">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-400">
                                  {format(new Date(conversation.lastMessageAt), 'HH:mm', { locale: fr })}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {conversation.lastMessageContent}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
                    <p className="text-gray-500 mb-4">Commencez à discuter avec un salon</p>
                    <Button
                      onClick={() => setActiveTab('new')}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Démarrer une conversation
                    </Button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'new' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nouvelle conversation</h3>
                  <p className="text-gray-500 mb-6">
                    Pour démarrer une conversation, réservez d'abord un service dans un salon
                  </p>
                  <Button
                    onClick={() => setLocation('/')}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    Découvrir les salons
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Vue conversation sélectionnée
          <div className="flex flex-col h-screen">
            {/* Header conversation */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Building className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">Salon Professionnel</h2>
                  <p className="text-sm text-green-600">En ligne</p>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'client'
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.mentions && message.mentions.length > 0 && (
                        <div className="mt-1 flex items-center space-x-1">
                          <AtSign className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-70">
                            {message.mentions.length} mention{message.mentions.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de message avec mentions */}
            <MentionInput
              onSendMessage={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              placeholder="Tapez votre message... (utilisez @ pour mentionner)"
            />
          </div>
        )}
      </div>
    </div>
  );
}