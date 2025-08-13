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
  const [activeTab, setActiveTab] = useState("entrepreneur");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Chat général
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

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatMutation.isPending]);

  // 🎯 IA POUR L'ENTREPRENEUR
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

  // 🎨 IA POUR LE CLIENT
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

  const { data: trendyLooks, isLoading: looksLoading } = useQuery({
    queryKey: ["/api/ai/suggest-looks"],
    enabled: activeTab === "client"
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    chatMutation.mutate(chatMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatMessage(suggestion);
    // Auto-submit suggestion
    setTimeout(() => {
      if (suggestion.trim()) {
        chatMutation.mutate(suggestion);
      }
    }, 100);
  };

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

  const renderEntrepreneurTab = () => (
    <div className="space-y-6">
      {/* Analyse des tendances clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Analyse des tendances clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          ) : clientTrends ? (
            <div className="space-y-4">
              {(clientTrends as any)?.newServices?.map((service: any, idx: number) => (
                <div key={idx} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-800">{service.name}</h4>
                      <p className="text-sm text-green-600">{service.reasoning}</p>
                    </div>
                    <Badge variant="outline" className="text-green-700">
                      {service.suggestedPrice}€
                    </Badge>
                  </div>
                </div>
              ))}
              
              {(clientTrends as any)?.pricingOptimization?.map((pricing: any, idx: number) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-blue-800">{pricing.serviceName}</h4>
                      <p className="text-sm text-blue-600">{pricing.expectedImpact}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-700">
                        {pricing.currentPrice}€ TTC → {pricing.suggestedPrice}€ TTC
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible pour l'analyse des tendances.</p>
          )}
        </CardContent>
      </Card>

      {/* Détection des risques de départ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Clients à risque de départ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {churnLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          ) : churnRisk ? (
            <div className="space-y-4">
              {(churnRisk as any)?.churnRisks?.map((risk: any, idx: number) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  risk.urgency === 'high' ? 'bg-red-50' : 
                  risk.urgency === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-medium ${
                        risk.urgency === 'high' ? 'text-red-800' : 
                        risk.urgency === 'medium' ? 'text-yellow-800' : 'text-green-800'
                      }`}>
                        {risk.clientName}
                      </h4>
                      <p className={`text-sm ${
                        risk.urgency === 'high' ? 'text-red-600' : 
                        risk.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {risk.retentionStrategy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Risque: {Math.round(risk.riskScore * 100)}%
                      </div>
                      <Badge variant={risk.urgency === 'high' ? 'destructive' : 'outline'}>
                        {risk.urgency}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {(churnRisk as any)?.overallChurnRate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de départ global</span>
                    <span className="font-medium">{Math.round((churnRisk as any).overallChurnRate * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Aucun risque de départ détecté.</p>
          )}
        </CardContent>
      </Card>

      {/* Opportunités business */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Opportunités business
          </CardTitle>
        </CardHeader>
        <CardContent>
          {opportunitiesLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
            </div>
          ) : businessOpportunities ? (
            <div className="space-y-4">
              {(businessOpportunities as any)?.crossSellingOpportunities?.map((opportunity: any, idx: number) => (
                <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-purple-800">{opportunity.primaryService}</h4>
                      <p className="text-sm text-purple-600">
                        Complémentaires: {opportunity.complementaryServices?.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-700">
                        +{opportunity.revenueImpact}€
                      </div>
                      <div className="text-xs text-purple-600">
                        {Math.round(opportunity.conversionRate * 100)}% conversion
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(businessOpportunities as any)?.seasonalPredictions?.map((prediction: any, idx: number) => (
                <div key={idx} className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-indigo-800">{prediction.period}</h4>
                      <p className="text-sm text-indigo-600">
                        Demande prévue: {prediction.expectedDemand}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-indigo-700">
                        {prediction.expectedDemand}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune opportunité détectée actuellement.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderClientTab = () => (
    <div className="space-y-6">
      {/* Analyse photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-green-600" />
            Conseiller beauté virtuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Analysez une photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                L'IA analysera la photo pour recommander des services adaptés
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button asChild disabled={photoAnalysisMutation.isPending}>
                  <span>
                    {photoAnalysisMutation.isPending ? "Analyse en cours..." : "Choisir une photo"}
                  </span>
                </Button>
              </label>
            </div>
            
            {photoAnalysisMutation.data && (
              <div className="space-y-3">
                <h4 className="font-medium">Recommandations personnalisées</h4>
                {photoAnalysisMutation.data.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-green-800">{rec.service}</h5>
                        <p className="text-sm text-green-600">{rec.reasoning}</p>
                      </div>
                      <Badge variant="outline" className="text-green-700">
                        {rec.estimatedPrice}€
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions de looks tendances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-600" />
            Looks tendances
          </CardTitle>
        </CardHeader>
        <CardContent>
          {looksLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5" />
            </div>
          ) : trendyLooks ? (
            <div className="space-y-4">
              {(trendyLooks as any)?.suggestedLooks?.map((look: any, idx: number) => (
                <div key={idx} className="p-3 bg-pink-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-pink-800">{look.name}</h4>
                      <p className="text-sm text-pink-600">{look.description}</p>
                      <div className="text-xs text-pink-500 mt-1">
                        Services: {look.services?.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-pink-700">
                        {look.totalCost}€
                      </div>
                      <div className="text-xs text-pink-600">
                        Maintenance: {look.maintenanceLevel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune suggestion de look disponible.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Intelligence Artificielle Avancée</h1>
              <p className="text-gray-600">Votre cerveau silencieux pour optimiser votre business</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-4 w-4 mr-1" />
            Système actif
          </Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entrepreneur" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Entrepreneur
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entrepreneur" className="mt-6">
          {renderEntrepreneurTab()}
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          {renderClientTab()}
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <div className="flex flex-col h-[calc(100vh-280px)] bg-white rounded-lg shadow-sm">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Assistant IA Universel</h3>
                  <p className="text-sm text-gray-500">Posez-moi n'importe quelle question !</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">En ligne</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-full mb-6">
                    <Brain className="h-16 w-16 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Bonjour ! Je suis votre assistant IA
                  </h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Je peux vous aider avec la gestion de votre salon, répondre à vos questions générales, 
                    donner des conseils et bien plus encore !
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                    {[
                      { text: "Comment fidéliser mes clients ?", icon: "👥" },
                      { text: "Quelle recette pour ce soir ?", icon: "🍳" },
                      { text: "Comment optimiser mon planning ?", icon: "📅" },
                      { text: "Explique-moi l'intelligence artificielle", icon: "🤖" }
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <span className="text-xl">{suggestion.icon}</span>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">U</span>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {/* Typing indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
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

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    disabled={chatMutation.isPending}
                    className="pr-12 h-12 rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
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
                    className="absolute right-2 top-2 h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                L'IA peut faire des erreurs. Vérifiez les informations importantes.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Informations sur l'IA */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>L'IA devient le cerveau silencieux de votre application</strong> - 
          Elle anticipe vos besoins, optimise vos processus et crée une expérience quasi-magique 
          où tout semble se faire naturellement.
        </AlertDescription>
      </Alert>
    </div>
  );
}