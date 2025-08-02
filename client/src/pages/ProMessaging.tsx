import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  ArrowLeft, 
  Send, 
  User,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: number;
  fromClientId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  clientName: string;
}

export default function ProMessaging() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  // Récupérer les messages reçus
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/professional/messages'],
    refetchInterval: 30000, // Actualise toutes les 30 secondes
  });

  // Mutation pour marquer comme lu
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest('PATCH', `/api/professional/messages/${messageId}/read`, {});
      if (!response.ok) throw new Error('Erreur lors du marquage');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/professional/messages'] });
    }
  });

  // Mutation pour répondre (simulation)
  const replyMutation = useMutation({
    mutationFn: async (data: { messageId: number; reply: string }) => {
      // Dans un vrai système, on enverrait la réponse au client
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée au client"
      });
      setReplyText('');
      setSelectedMessage(null);
    }
  });

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    replyMutation.mutate({
      messageId: selectedMessage.id,
      reply: replyText.trim()
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 1) {
      return `Il y a ${Math.floor(diffInHours * 60)} min`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // États pour nouvelle conversation
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  // Clients disponibles (simulés)
  const availableClients = [
    { id: 'client1', name: 'Marie Dupont', email: 'marie@email.com' },
    { id: 'client2', name: 'Sophie Martin', email: 'sophie@email.com' },
    { id: 'client3', name: 'Claire Rousseau', email: 'claire@email.com' }
  ];

  // Mutation pour envoyer un nouveau message
  const sendNewMessageMutation = useMutation({
    mutationFn: async (data: { clientId: string; message: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé au client"
      });
      setNewMessageText('');
      setSelectedClient('');
      setIsNewMessageOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/professional/messages'] });
    }
  });

  const handleSendNewMessage = () => {
    if (!newMessageText.trim() || !selectedClient) return;
    
    sendNewMessageMutation.mutate({
      clientId: selectedClient,
      message: newMessageText
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header violet moderne - Style iPhone identique client */}
      <div className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLocation('/business-features')}
                className="p-2 hover:bg-white/10 rounded-full text-violet-700/80 hover:text-violet-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <MessageCircle className="h-5 w-5 text-violet-700" />
              </div>
              <h1 className="text-lg font-semibold text-violet-700">Messagerie Pro</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-violet-700/80 bg-white/10 px-2 py-1 rounded-full">
                {messages.filter((m: Message) => !m.isRead).length} non lus
              </div>
              <Button
                onClick={() => setIsNewMessageOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-violet-700 border-0 h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Nouveau
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {selectedMessage ? (
          /* Vue détaillée du message */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedMessage.clientName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(selectedMessage.createdAt)}
                      {selectedMessage.isRead && (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  Retour
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{selectedMessage.message}</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Répondre au client</h4>
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replyMutation.isPending}
                      className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {replyMutation.isPending ? 'Envoi...' : 'Envoyer la réponse'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setReplyText('')}
                    >
                      Effacer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Liste des messages */
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message: Message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors hover:shadow-md ${
                    !message.isRead ? 'border-violet-200 bg-violet-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {message.clientName}
                            </h3>
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-violet-500/30 backdrop-blur-md border border-violet-300/20 shadow-lg shadow-violet-500/20 rounded-full"></span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                        <p className="text-gray-700 line-clamp-2">
                          {message.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {message.isRead ? 'Lu' : 'Non lu'}
                          </span>
                          {message.isRead && (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun message reçu
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Les clients peuvent vous contacter via votre handle @usemyrr
                  </p>
                  <Button
                    onClick={() => setLocation('/messaging-search')}
                    variant="outline"
                  >
                    Tester la messagerie
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      {/* Dialog pour nouveau message */}
      <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client destinataire</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Tapez votre message ici..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSendNewMessage}
                disabled={!selectedClient || !newMessageText.trim() || sendNewMessageMutation.isPending}
                className="flex-1"
              >
                {sendNewMessageMutation.isPending ? "Envoi..." : "Envoyer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsNewMessageOpen(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}