// Messagerie professionnelle avec recherche par @ et ancienne interface
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircle, Send, Plus, Search, User, Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  type: 'client' | 'professional';
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  clientId: string;
  professionalId: string;
  clientName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'new' | 'responded' | 'pending';
}

export default function ProMessagingWithSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'conversations' | 'clients' | 'archives'>('conversations');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Données de test
  const testConversations: Conversation[] = [
    {
      clientId: 'client_1',
      professionalId: 'pro_1',
      clientName: 'Marie Dupont',
      lastMessage: 'Merci pour le rendez-vous, à bientôt !',
      lastMessageTime: '2024-01-25 14:30',
      unreadCount: 0,
      status: 'responded'
    },
    {
      clientId: 'client_2',
      professionalId: 'pro_1',
      clientName: 'Sophie Martin',
      lastMessage: 'Pouvez-vous me rappeler les tarifs ?',
      lastMessageTime: '2024-01-25 13:15',
      unreadCount: 2,
      status: 'pending'
    },
    {
      clientId: 'client_3',
      professionalId: 'pro_1',
      clientName: 'Julie Bernard',
      lastMessage: 'Bonjour, j\'aimerais prendre rendez-vous',
      lastMessageTime: '2024-01-25 12:45',
      unreadCount: 1,
      status: 'new'
    }
  ];

  useEffect(() => {
    setConversations(testConversations);
  }, []);

  // Recherche d'utilisateurs par @
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Erreur recherche utilisateurs:', error);
      // Données de test en cas d'erreur
      const testUsers: User[] = [
        { id: 'client_1', name: 'Marie Dupont', handle: '@mariedupont', email: 'marie@example.com', type: 'client' },
        { id: 'client_2', name: 'Sophie Martin', handle: '@sophiemartin', email: 'sophie@example.com', type: 'client' },
        { id: 'client_3', name: 'Julie Bernard', handle: '@juliebernard', email: 'julie@example.com', type: 'client' }
      ];
      
      const filtered = testUsers.filter(user => 
        user.handle.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  // Charger messages d'une conversation
  const loadMessages = async (clientId: string, professionalId: string) => {
    try {
      const response = await fetch(`/api/messaging/conversation/${clientId}/${professionalId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      // Messages de test
      const testMessages: Message[] = [
        {
          id: '1',
          senderId: clientId,
          receiverId: professionalId,
          content: 'Bonjour, j\'aimerais prendre rendez-vous pour une coupe',
          timestamp: '2024-01-25 10:30:00',
          isRead: true
        },
        {
          id: '2',
          senderId: professionalId,
          receiverId: clientId,
          content: 'Bonjour ! Bien sûr, quand souhaiteriez-vous venir ?',
          timestamp: '2024-01-25 10:35:00',
          isRead: true
        }
      ];
      setMessages(testMessages);
    }
  };

  // Envoyer un message
  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    const receiverId = selectedUser?.id || selectedConversation?.clientId;
    if (!receiverId) return;

    try {
      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          receiverType: 'client',
          content: messageContent,
          senderType: 'professional'
        })
      });

      if (response.ok) {
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès"
        });
        setMessageContent('');
        
        // Recharger les messages si on est dans une conversation
        if (selectedConversation) {
          loadMessages(selectedConversation.clientId, selectedConversation.professionalId);
        }
        
        // Fermer le dialogue nouveau message
        setIsNewMessageOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                <p className="text-gray-600">Communication directe avec vos clients</p>
              </div>
            </div>
            
            <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nouveau message</DialogTitle>
                  <DialogDescription>
                    Recherchez un client par @ ou nom pour lui envoyer un message
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">À :</label>
                    <Input
                      placeholder="Tapez @ pour rechercher..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        searchUsers(e.target.value);
                      }}
                      className="mt-1"
                    />
                    
                    {/* Résultats de recherche */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="p-2 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserSearch(user.handle);
                              setSearchResults([]);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.handle}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <DialogFooter>
                  <Button
                    onClick={sendMessage}
                    disabled={!selectedUser || !messageContent.trim()}
                    className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar conversations */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Badge variant="secondary">{conversations.length}</Badge>
                </div>
                
                {/* Onglets */}
                <div className="flex space-x-1 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-lg p-1">
                  {[
                    { key: 'conversations', label: 'Actives' },
                    { key: 'clients', label: 'Clients' },
                    { key: 'archives', label: 'Archives' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                        activeTab === tab.key
                          ? 'bg-white text-violet-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Recherche */}
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-0 max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.clientId}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.clientId === conversation.clientId ? 'bg-violet-50 border-violet-200' : ''
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        loadMessages(conversation.clientId, conversation.professionalId);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{conversation.clientName}</h4>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Badge 
                            variant={
                              conversation.status === 'new' ? 'destructive' :
                              conversation.status === 'pending' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {conversation.status === 'new' ? 'Nouveau' :
                             conversation.status === 'pending' ? 'En attente' : 'Répondu'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs truncate mb-1">{conversation.lastMessage}</p>
                      <p className="text-gray-400 text-xs">{conversation.lastMessageTime}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-8">
            {selectedConversation ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.clientName}</CardTitle>
                      <p className="text-gray-600 text-sm">Conversation active</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'pro_1' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 ${
                            message.senderId === 'pro_1'
                              ? 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-2xl rounded-br-sm'
                              : 'bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-gray-900 rounded-2xl rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            message.senderId === 'pro_1' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {/* Zone de saisie iMessage style */}
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 px-4 py-2">
                      <Textarea
                        placeholder="Message"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={1}
                        className="border-0 p-0 resize-none focus:ring-0 bg-transparent text-sm"
                        style={{ minHeight: '20px', maxHeight: '100px' }}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!messageContent.trim()}
                      className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 text-violet-700 rounded-full w-8 h-8 p-0 shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                  <p className="text-gray-600">Choisissez une conversation dans la liste ou créez un nouveau message</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}