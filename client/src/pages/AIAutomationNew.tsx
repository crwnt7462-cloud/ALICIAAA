import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Brain, MessageCircle, TrendingUp, Calendar, Users, Zap, Send, 
  Camera, Lightbulb, Target, DollarSign, AlertTriangle, 
  Sparkles, BarChart3, Eye, Palette, TrendingDown 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AIAutomation() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Chat IA - Défini en premier
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [
        ...prev,
        { role: "user", content: chatMessage },
        { role: "assistant", content: data.response }
      ]);
      setChatMessage("");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA.",
        variant: "destructive",
      });
    },
  });

  // Effect pour scroll automatique
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatMutation.isPending]);

  // Gestion des suggestions de chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    chatMutation.mutate(chatMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatMessage(suggestion);
    setTimeout(() => {
      if (suggestion.trim()) {
        chatMutation.mutate(suggestion);
      }
    }, 100);
  };

  // Gestion photo
  const photoAnalysisMutation = useMutation({
    mutationFn: async (photoBase64: string) => {
      const response = await apiRequest("POST", "/api/ai/analyze-photo", { 
        photoBase64, 
        clientProfile: { age: 30, preferences: "naturel", averageSpend: 150 }
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analyse terminée",
        description: "L'IA a analysé la photo et généré des recommandations.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'analyser la photo.",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];
        setSelectedPhoto(base64Data);
        photoAnalysisMutation.mutate(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  // Queries pour les données IA
  const { data: clientTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ["/api/ai/analyze-client-trends"],
    enabled: activeTab === "entrepreneur"
  });

  const { data: churnRisk, isLoading: churnLoading } = useQuery({
    queryKey: ["/api/ai/churn-detection"],
    enabled: activeTab === "entrepreneur"
  });

  const { data: businessOpportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/ai/business-opportunities"],
    enabled: activeTab === "entrepreneur"
  });

  const { data: trendyLooks, isLoading: looksLoading } = useQuery({
    queryKey: ["/api/ai/suggest-looks"],
    enabled: activeTab === "client"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Assistant IA Universel
                </h1>
                <p className="text-gray-600">Votre cerveau silencieux pour optimiser votre business</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-700 font-medium">GPT-4o Actif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation avec onglets */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="entrepreneur" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Eye className="h-4 w-4" />
              Beauté
            </TabsTrigger>
          </TabsList>

          {/* CHAT IA - Interface moderne */}
          <TabsContent value="chat" className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100">
              {/* Header du chat */}
              <div className="flex items-center justify-between p-6 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Chat avec GPT-4o</h3>
                    <p className="text-gray-600">Posez-moi n'importe quelle question !</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">En ligne</span>
                </div>
              </div>

              {/* Zone de messages */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-6">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-full mb-8">
                      <Brain className="h-20 w-20 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      Bonjour ! Je suis votre assistant IA universel
                    </h3>
                    <p className="text-gray-600 text-center max-w-lg mb-8 text-lg">
                      Je peux vous aider avec la gestion de votre salon, répondre à vos questions générales, 
                      donner des conseils et bien plus encore !
                    </p>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                      {[
                        { text: "Comment fidéliser mes clients ?", icon: "👥", color: "from-blue-500 to-purple-600" },
                        { text: "Quelle recette pour ce soir ?", icon: "🍳", color: "from-orange-500 to-red-600" },
                        { text: "Comment optimiser mon planning ?", icon: "📅", color: "from-green-500 to-blue-600" },
                        { text: "Explique-moi l'intelligence artificielle", icon: "🤖", color: "from-purple-500 to-pink-600" }
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className={`group p-4 bg-gradient-to-r ${suggestion.color} text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{suggestion.icon}</span>
                            <span className="text-sm font-medium">{suggestion.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl shadow-sm ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                              : 'bg-gray-50 text-gray-800 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">U</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Indicateur de frappe */}
                {chatMutation.isPending && (
                  <div className="flex gap-4 justify-start">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-md border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-purple-100 p-6">
                <form onSubmit={handleChatSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      disabled={chatMutation.isPending}
                      className="h-14 rounded-2xl border-purple-200 focus:ring-purple-500 focus:border-purple-500 text-base pr-14"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit(e);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={chatMutation.isPending || !chatMessage.trim()}
                      size="sm"
                      className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Alimenté par GPT-4o • L'IA peut faire des erreurs, vérifiez les informations importantes
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Business (simplifié) */}
          <TabsContent value="entrepreneur" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Analyse des tendances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trendsLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  ) : (
                    <p className="text-gray-600">Données d'analyse des tendances clients disponibles</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Risques de départ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {churnLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  ) : (
                    <p className="text-gray-600">Détection intelligente des clients à risque</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Client (simplifié) */}
          <TabsContent value="client" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-pink-600" />
                  Analyse photo beauté
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {photoAnalysisMutation.isPending && (
                    <div className="text-center py-4">
                      <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
                      <p className="text-sm text-gray-600 mt-2">Analyse en cours...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer informatif */}
      <div className="mt-12 bg-white/60 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Intelligence Artificielle Avancée</strong> - 
              Votre assistant utilise GPT-4o, le modèle le plus avancé d'OpenAI, pour vous offrir 
              des réponses précises et contextuelles sur tous les sujets.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}