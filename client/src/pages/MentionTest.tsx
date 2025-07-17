import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AtSign, Users, Building } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { MentionInput } from '@/components/MentionInput';

export default function MentionTest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreatingHandles, setIsCreatingHandles] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testMessages, setTestMessages] = useState<string[]>([]);

  const createHandles = async () => {
    setIsCreatingHandles(true);
    try {
      const response = await apiRequest('POST', '/api/users/create-handles');
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Handles @ créés avec succès !",
          description: `${result.proCount} professionnels + ${result.clientCount} clients mis à jour`
        });
      } else {
        throw new Error(result.message || 'Erreur inconnue');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer les handles",
        variant: "destructive"
      });
    } finally {
      setIsCreatingHandles(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await apiRequest('GET', `/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        const error = await response.json();
        toast({
          title: "Recherche impossible",
          description: error.message || "Connectez-vous d'abord",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur de recherche",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = (content: string, mentions: string[]) => {
    setTestMessages(prev => [...prev, content]);
    toast({
      title: "Message de test envoyé",
      description: `Contenu: "${content}" - Mentions: ${mentions.length}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Test des Mentions @</h1>
              <p className="text-sm text-gray-500">Testez le système de mentions avec handles uniques</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Création des handles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AtSign className="w-5 h-5" />
              <span>Génération des Handles @</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Créez automatiquement des handles uniques @ pour tous les utilisateurs existants dans la base de données.
            </p>
            <Button 
              onClick={createHandles}
              disabled={isCreatingHandles}
              className="w-full"
            >
              {isCreatingHandles ? 'Création en cours...' : 'Créer les Handles @'}
            </Button>
          </CardContent>
        </Card>

        {/* Recherche d'utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Recherche d'Utilisateurs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Rechercher un utilisateur par nom ou handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={searchUsers}>
                Rechercher
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label>Résultats de recherche :</Label>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {searchResults.map((user: any) => (
                    <div key={user.id} className="p-2 border rounded-lg flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.type === 'professional' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'
                      }`}>
                        {user.type === 'professional' ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">@{user.handle}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        user.type === 'professional' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'
                      }`}>
                        {user.type === 'professional' ? 'Pro' : 'Client'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de mentions */}
        <Card>
          <CardHeader>
            <CardTitle>Test de l'Input avec Mentions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Tapez @ suivi d'un nom pour déclencher l'autocomplétion des mentions.
            </p>
            <MentionInput
              onSendMessage={handleSendMessage}
              placeholder="Tapez @ pour mentionner quelqu'un..."
            />
            
            {testMessages.length > 0 && (
              <div className="space-y-2">
                <Label>Messages de test envoyés :</Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {testMessages.map((message, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                      {message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Cliquez sur "Créer les Handles @" pour générer des handles uniques pour tous les utilisateurs</li>
              <li>Utilisez la recherche pour voir tous les utilisateurs avec leurs handles @</li>
              <li>Dans le champ de message, tapez @ suivi d'un nom pour déclencher l'autocomplétion</li>
              <li>Sélectionnez un utilisateur dans la liste déroulante pour l'ajouter à votre message</li>
              <li>Pour utiliser pleinement le système, connectez-vous d'abord sur <a href="/pro-login" className="text-violet-600 underline">la page de connexion</a></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}