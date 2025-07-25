// Composant de messagerie temps réel pour clients et professionnels
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, User, MessageCircle, Clock } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  fromUserId: string;
  fromUserType: 'client' | 'professional';
  fromUserName: string;
  toUserId: string;
  toUserType: 'client' | 'professional';
  toUserName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface RealTimeMessagingProps {
  currentUserId: string;
  currentUserType: 'client' | 'professional';
  currentUserName: string;
  otherUserId: string;
  otherUserType: 'client' | 'professional';
  otherUserName: string;
}

export default function RealTimeMessaging({
  currentUserId,
  currentUserType,
  currentUserName,
  otherUserId,
  otherUserType,
  otherUserName
}: RealTimeMessagingProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Détermine les IDs client/pro selon les utilisateurs
  const getConversationIds = () => {
    if (currentUserType === 'client') {
      return { clientId: currentUserId, professionalId: otherUserId };
    } else {
      return { clientId: otherUserId, professionalId: currentUserId };
    }
  };

  // Charger les messages existants
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const { clientId, professionalId } = getConversationIds();
      
      const response = await fetch(`/api/messaging/conversation/${clientId}/${professionalId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les messages",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer un nouveau message
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);

      const messageData = {
        fromUserId: currentUserId,
        fromUserType: currentUserType,
        fromUserName: currentUserName,
        toUserId: otherUserId,
        toUserType: otherUserType,
        toUserName: otherUserName,
        content: newMessage.trim()
      };

      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();

      if (data.success) {
        // Ajouter le nouveau message à la liste
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès"
        });
        
        // Recharger les messages pour être sûr
        setTimeout(() => loadMessages(), 500);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible d'envoyer le message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 1) {
      return `Il y a ${Math.floor(diffInHours * 60)} min`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Gérer l'envoi avec Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger les messages au montage et scroller
  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Actualiser automatiquement les messages toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation(currentUserType === 'client' ? '/client-dashboard' : '/business-features')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Conversation avec {otherUserName}
                </h1>
                <p className="text-gray-600">
                  {messages.length} messages • Messagerie temps réel
                </p>
              </div>
            </div>
            
            <Button
              onClick={loadMessages}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.fromUserId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.fromUserId === currentUserId
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${
                      message.fromUserId === currentUserId ? 'text-violet-200' : 'text-gray-500'
                    }`}>
                      {message.fromUserName}
                    </span>
                    <span className={`text-xs ${
                      message.fromUserId === currentUserId ? 'text-violet-200' : 'text-gray-400'
                    }`}>
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun message
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez la conversation en envoyant votre premier message
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Zone de saisie fixe en bas */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Écrivez votre message à ${otherUserName}...`}
                disabled={isSending}
                className="resize-none"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}