import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, MessageCircle, ArrowLeft, User, Building2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Professional {
  id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  mentionHandle: string;
  address?: string;
  phone?: string;
}

export default function MessagingSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  // Recherche de professionnels par handle
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search-professionals', searchTerm],
    enabled: searchTerm.length > 2,
  });

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { professionalId: string; message: string }) => {
      const response = await apiRequest('POST', '/api/client/messages/send', data);
      if (!response.ok) throw new Error('Erreur envoi message');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès au professionnel"
      });
      setMessage('');
      setSelectedPro(null);
      setSearchTerm('');
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  });

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      toast({
        title: "Recherche trop courte",
        description: "Tapez au moins 2 caractères pour rechercher",
        variant: "destructive"
      });
      return;
    }
  };

  const handleSendMessage = () => {
    if (!selectedPro || !message.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez sélectionner un professionnel et écrire un message",
        variant: "destructive"
      });
      return;
    }

    sendMessageMutation.mutate({
      professionalId: selectedPro.id,
      message: message.trim()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/client-dashboard')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rechercher un Professionnel</h1>
              <p className="text-gray-600">Trouvez et contactez un professionnel par son @handle</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Barre de recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-violet-600" />
              Recherche par @handle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tapez @usemyrr par exemple..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? 'Recherche...' : 'Rechercher'}
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>💡 <strong>Exemple :</strong> Tapez @usemyrr pour trouver le salon associé</p>
            </div>
          </CardContent>
        </Card>

        {/* Résultats de recherche */}
        {searchResults && searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Professionnels trouvés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {searchResults.map((pro: Professional) => (
                <div
                  key={pro.id}
                  onClick={() => setSelectedPro(pro)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPro?.id === pro.id 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{pro.businessName}</h3>
                        <span className="text-sm text-violet-600 font-medium">{pro.mentionHandle}</span>
                      </div>
                      <p className="text-gray-600">{pro.firstName} {pro.lastName}</p>
                      {pro.address && (
                        <p className="text-sm text-gray-500">{pro.address}</p>
                      )}
                      {pro.phone && (
                        <p className="text-sm text-gray-500">{pro.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Zone de message */}
        {selectedPro && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-violet-600" />
                Envoyer un message à {selectedPro.businessName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-violet-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-violet-600" />
                  <span className="font-medium">{selectedPro.mentionHandle}</span>
                  <span className="text-gray-600">- {selectedPro.businessName}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bonjour, j'aimerais prendre rendez-vous..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !message.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {sendMessageMutation.isPending ? 'Envoi...' : 'Envoyer le message'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* État vide */}
        {searchTerm.length > 2 && searchResults && searchResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun professionnel trouvé</h3>
              <p className="text-gray-600">
                Aucun professionnel ne correspond à "{searchTerm}"
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Vérifiez l'orthographe du @handle
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}