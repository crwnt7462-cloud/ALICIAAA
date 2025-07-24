import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  ArrowLeft, 
  Send, 
  User,
  Clock,
  Search,
  Phone,
  Video,
  Star
} from 'lucide-react';

interface Message {
  id: number;
  clientName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function ProMessagingSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  // Messages d'exemple pour démonstration
  const [messages] = useState<Message[]>([
    {
      id: 1,
      clientName: "Marie Dubois",
      message: "Bonjour, je souhaiterais décaler mon rendez-vous de demain à jeudi si possible ?",
      timestamp: "Il y a 2h",
      isRead: false
    },
    {
      id: 2,
      clientName: "Sophie Martin",
      message: "Merci pour la prestation de ce matin, j'ai adoré ma nouvelle coupe !",
      timestamp: "Il y a 5h",
      isRead: true
    },
    {
      id: 3,
      clientName: "Julie Leroy",
      message: "Est-ce que vous acceptez les chèques vacances ?",
      timestamp: "Hier",
      isRead: true
    }
  ]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Votre réponse a été envoyée au client"
    });
    
    setReplyText('');
    setSelectedConversation(null);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

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
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Messagerie Pro</h1>
                <p className="text-gray-600">Communication directe avec vos clients</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                ✓ Messages illimités
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                ⚡ Temps de réponse 24h
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                🔒 Sécurisé 100%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'conversations' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('conversations')}
            className={`${activeTab === 'conversations' ? 'bg-white shadow-sm' : ''} text-sm`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Conversations
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'clients' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('clients')}
            className={`${activeTab === 'clients' ? 'bg-white shadow-sm' : ''} text-sm`}
          >
            <User className="w-4 h-4 mr-2" />
            Clients
          </Button>
          <Button
            variant={activeTab === 'archives' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('archives')}
            className={`${activeTab === 'archives' ? 'bg-white shadow-sm' : ''} text-sm`}
          >
            Archives
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des conversations */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un client..."
                  className="pl-10"
                />
              </div>
            </div>

            {messages.map((message) => (
              <Card 
                key={message.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedConversation?.id === message.id ? 'ring-2 ring-violet-500' : ''
                } ${!message.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => setSelectedConversation(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {message.clientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {message.clientName}
                        </h3>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {message.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        <div className="flex gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-gray-500">VIP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConversation.clientName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.clientName}
                        </h3>
                        <p className="text-sm text-gray-500">Cliente fidèle • 12 RDV</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Appeler
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4 mr-1" />
                        Vidéo
                      </Button>
                      <Button variant="outline" size="sm">
                        RDV
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">{selectedConversation.message}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {selectedConversation.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Tapez votre réponse..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="bg-violet-600 hover:bg-violet-700 px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Réponse automatique sous 24h</span>
                    <span>Ctrl + Entrée pour envoyer</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-500">
                    Choisissez un client pour commencer à échanger
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}