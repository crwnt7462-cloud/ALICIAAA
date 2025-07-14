import { useState } from "react";
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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    chatMutation.mutate(chatMessage);
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
              {clientTrends.newServices?.map((service: any, idx: number) => (
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
              
              {clientTrends.pricingOptimization?.map((pricing: any, idx: number) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-blue-800">{pricing.serviceName}</h4>
                      <p className="text-sm text-blue-600">{pricing.expectedImpact}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-700">
                        {pricing.currentPrice}€ → {pricing.suggestedPrice}€
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
              {churnRisk.churnRisks?.map((risk: any, idx: number) => (
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
              
              {churnRisk.overallChurnRate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de départ global</span>
                    <span className="font-medium">{Math.round(churnRisk.overallChurnRate * 100)}%</span>
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
              {businessOpportunities.crossSellingOpportunities?.map((opportunity: any, idx: number) => (
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
              
              {businessOpportunities.seasonalPredictions?.map((prediction: any, idx: number) => (
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
              {trendyLooks.suggestedLooks?.map((look: any, idx: number) => (
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Assistant IA Conversationnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat History */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        Démarrez une conversation avec votre assistant IA
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Posez vos questions sur l'optimisation, les tendances, ou la gestion
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Posez votre question à l'IA..."
                    disabled={chatMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={chatMutation.isPending || !chatMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
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