import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Search, Send, Phone, Video, 
  MoreHorizontal, Paperclip, Smile, Star
} from 'lucide-react';

export default function ProMessagingModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');

  // Récupérer les conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['/api/professional/messages'],
    refetchInterval: 5000 // Actualisation toutes les 5 secondes
  });

  const mockConversations = [
    {
      id: '1',
      client: {
        name: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        status: 'VIP',
        lastSeen: 'En ligne'
      },
      lastMessage: 'Merci pour le rendez-vous, à bientôt !',
      time: '14:30',
      unread: 0,
      messages: [
        { id: 1, sender: 'client', text: 'Bonjour, j\'aimerais prendre rendez-vous', time: '14:15' },
        { id: 2, sender: 'pro', text: 'Bonjour Sophie ! Je peux vous proposer jeudi à 15h ?', time: '14:18' },
        { id: 3, sender: 'client', text: 'Parfait, je confirme !', time: '14:25' },
        { id: 4, sender: 'client', text: 'Merci pour le rendez-vous, à bientôt !', time: '14:30' }
      ]
    },
    {
      id: '2',
      client: {
        name: 'Emma Dubois',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'Fidèle',
        lastSeen: 'Il y a 2h'
      },
      lastMessage: 'Est-ce que vous avez des créneaux demain ?',
      time: '12:15',
      unread: 2,
      messages: [
        { id: 1, sender: 'client', text: 'Bonjour ! Comment allez-vous ?', time: '12:10' },
        { id: 2, sender: 'client', text: 'Est-ce que vous avez des créneaux demain ?', time: '12:15' }
      ]
    },
    {
      id: '3',
      client: {
        name: 'Claire Bernard',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
        status: 'Nouvelle',
        lastSeen: 'Hier'
      },
      lastMessage: 'Merci beaucoup pour les conseils !',
      time: 'Hier',
      unread: 0,
      messages: [
        { id: 1, sender: 'client', text: 'Première visite, j\'ai hâte !', time: 'Hier 16:30' },
        { id: 2, sender: 'pro', text: 'Bienvenue ! N\'hésitez pas si vous avez des questions', time: 'Hier 16:35' },
        { id: 3, sender: 'client', text: 'Merci beaucoup pour les conseils !', time: 'Hier 17:20' }
      ]
    }
  ];

  const currentConversation = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null;

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // Ici on enverrait le message via l'API
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
    });
    
    setMessageText('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {!selectedConversation ? (
        // Vue liste des conversations
        <div className="relative">
          
          {/* Header */}
          <div className="relative">
            <button
              onClick={() => window.history.back()}
              className="absolute left-4 top-4 z-10 p-2"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <div className="px-6 pt-16 pb-6">
              <div className="max-w-sm mx-auto">
                
                {/* Logo */}
                <div className="text-center mb-12">
                  <h1 className="text-3xl font-bold text-violet-600">Messages</h1>
                </div>

                {/* Titre */}
                <div className="text-center mb-8">
                  <h2 className="text-xl text-gray-500 font-normal">Client conversations</h2>
                </div>

                {/* Barre de recherche */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher un client..."
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                </div>

                {/* Liste des conversations */}
                <div className="space-y-3">
                  {mockConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className="w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={conversation.client.avatar}
                            alt={conversation.client.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.unread > 0 && (
                            <div className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm">{conversation.client.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              conversation.client.status === 'VIP' ? 'bg-purple-100 text-purple-600' :
                              conversation.client.status === 'Fidèle' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {conversation.client.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">{conversation.time}</div>
                          {conversation.unread > 0 && (
                            <Star className="h-3 w-3 text-violet-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        // Vue conversation individuelle
        <div className="flex flex-col h-screen">
          
          {/* Header conversation */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <img
                src={currentConversation?.client.avatar}
                alt={currentConversation?.client.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{currentConversation?.client.name}</h3>
                <p className="text-sm text-gray-500">{currentConversation?.client.lastSeen}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'pro' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'pro'
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'pro' ? 'text-violet-200' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="w-full h-10 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 rounded-full transition-colors"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}