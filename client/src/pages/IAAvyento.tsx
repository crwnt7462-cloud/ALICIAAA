import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIService {
  id: string;
  name: string;
  description: string;
  category: 'optimisation' | 'marketing' | 'description' | 'promotion';
  isActive: boolean;
}

export default function IAAvyento() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'services' | 'suggestions'>('chat');
  const { toast } = useToast();

  // Récupération dynamique des services IA
  const { data: aiServices = [], isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['ai-services'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/ai/services");
        return (response as any).services || [];
      } catch (error) {
        console.error('Erreur récupération services IA:', error);
        // Fallback avec services par défaut si l'API échoue
        return [
          {
            id: 'optimize-description',
            name: 'Optimiser la description du salon',
            description: 'Améliore automatiquement la description de votre salon pour attirer plus de clients',
            category: 'description' as const,
            isActive: true
          },
          {
            id: 'generate-promotion',
            name: 'Générer des promotions',
            description: 'Crée des offres promotionnelles personnalisées selon vos services',
            category: 'promotion' as const,
            isActive: true
          }
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Récupération dynamique des suggestions
  const { data: suggestions = [], isLoading: suggestionsLoading, error: suggestionsError } = useQuery({
    queryKey: ['ai-suggestions'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/ai/suggestions");
        return (response as any).suggestions || [];
      } catch (error) {
        console.error('Erreur récupération suggestions IA:', error);
        // Fallback avec suggestions par défaut si l'API échoue
        return [
          {
            title: "Optimisation planning",
            description: "Analyser votre planning pour identifier les créneaux optimaux",
            action: "Analyser mon planning"
          },
          {
            title: "Description salon",
            description: "Améliorer la description de votre salon pour attirer plus de clients",
            action: "Optimiser ma description"
          }
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Persistance des messages avec localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Erreur parsing messages sauvegardés:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Appel API réel vers l'IA
      const response = await apiRequest("POST", "/api/ai/chat", {
        message: currentMessage.trim(),
        conversationHistory: messages.slice(-10)
      });
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: (response as any).response || "Je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Vérifiez votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    handleSendMessage();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimisation': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'description': return 'bg-purple-100 text-purple-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">IA Avyento</h1>
        <p className="text-gray-600">
          Votre assistant IA Avyento pour optimiser votre salon et améliorer vos performances.
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveTab('chat')}
          className="rounded-xl"
        >
          Chat IA
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'outline'}
          onClick={() => setActiveTab('services')}
          className="rounded-xl"
        >
          Services IA
        </Button>
        <Button
          variant={activeTab === 'suggestions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('suggestions')}
          className="rounded-xl"
        >
          Suggestions
        </Button>
      </div>

      {/* Onglet Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de chat */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 rounded-xl shadow-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Assistant IA</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Posez votre question à l'IA..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                  >
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div>
            <Card className="border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion: any, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 border border-gray-200 rounded-xl"
                    onClick={() => handleQuickAction(suggestion.action)}
                  >
                    <div>
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Onglet Services IA */}
      {activeTab === 'services' && (
        <div className="grid gap-6 md:grid-cols-2">
          {servicesLoading ? (
            <div className="col-span-2 text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des services IA...</p>
            </div>
          ) : servicesError ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-red-600 mb-4">Erreur lors du chargement des services</p>
              <p className="text-sm text-gray-500">Utilisation des services par défaut</p>
            </div>
          ) : aiServices.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-600">Aucun service IA disponible</p>
            </div>
          ) : (
            aiServices.map((service: any) => (
            <Card key={service.id} className="border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge className={getCategoryColor(service.category)}>
                    {service.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
                  onClick={() => {
                    setActiveTab('chat');
                    handleQuickAction(service.name);
                  }}
                >
                  Utiliser ce service
                </Button>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      )}

      {/* Onglet Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          {suggestionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des suggestions IA...</p>
            </div>
          ) : suggestionsError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Erreur lors du chargement des suggestions</p>
              <p className="text-sm text-gray-500">Utilisation des suggestions par défaut</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune suggestion disponible</p>
            </div>
          ) : (
            <Card className="border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Recommandations IA Personnalisées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Optimisation du Planning</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Vos créneaux 9h-11h sont sous-exploités (45% d'occupation). 
                  Une promotion "Matinale" pourrait augmenter votre CA de 15%.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                  Créer la promotion
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📊 Performance des Services</h4>
                <p className="text-green-800 text-sm mb-3">
                  Vos soins visage génèrent le meilleur taux de satisfaction (4.8/5). 
                  Mettre ce service en avant pourrait attirer plus de clientes.
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl">
                  Optimiser la visibilité
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🏷️ Amélioration SEO</h4>
                <p className="text-purple-800 text-sm mb-3">
                  Ajouter 5 mots-clés ciblés pourrait améliorer votre visibilité en ligne de 30%.
                </p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                  Générer les tags
                </Button>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">💌 Fidélisation Client</h4>
                <p className="text-orange-800 text-sm mb-3">
                  47% de vos clientes n'ont pas pris de RDV depuis 3 mois. 
                  Une campagne de rappel personnalisée pourrait les reconquérir.
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 rounded-xl">
                  Créer la campagne
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      )}
    </div>
  );
}