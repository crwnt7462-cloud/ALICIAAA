import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Brain, MessageCircle, TrendingUp, Calendar, Users, Zap, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AIAutomation() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/ai/insights"],
  });

  const { data: optimization, isLoading: optimizationLoading } = useQuery({
    queryKey: ["/api/ai/schedule-optimization"],
  });

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

  const features = [
    {
      title: "Optimisation planning",
      description: "L'IA analyse votre planning pour maximiser la rentabilité",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      status: "active"
    },
    {
      title: "Prédiction d'absences",
      description: "Identifie les clients à risque d'absence ou d'annulation",
      icon: Users,
      color: "bg-orange-100 text-orange-600", 
      status: "active"
    },
    {
      title: "Insights business",
      description: "Analyse des tendances et recommandations stratégiques",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      status: "active"
    },
    {
      title: "Assistant personnel",
      description: "Chatbot IA pour répondre à vos questions",
      icon: MessageCircle,
      color: "bg-purple-100 text-purple-600",
      status: "active"
    }
  ];

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">IA Pro</h1>
        <p className="text-gray-600 text-sm mt-1">
          Intelligence artificielle pour votre salon
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {feature.description}
                </p>
                <Badge 
                  variant={feature.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {feature.status === "active" ? "Actif" : "Bientôt"}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      {insights && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.insights?.map((insight: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-blue-800">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence && `${Math.round(insight.confidence * 100)}%`}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">{insight.description}</p>
                {insight.impact && (
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'positive' ? 'bg-green-100 text-green-700' :
                      insight.impact === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Impact {insight.impact}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Schedule Optimization */}
      {optimization && optimization.suggestions?.length > 0 && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Optimisation du planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimization.suggestions.slice(0, 3).map((suggestion: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-orange-800">{suggestion.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      suggestion.impact === 'high' ? 'border-red-300 text-red-700' :
                      suggestion.impact === 'medium' ? 'border-orange-300 text-orange-700' :
                      'border-gray-300 text-gray-700'
                    }`}
                  >
                    {suggestion.impact}
                  </Badge>
                </div>
                <p className="text-sm text-orange-700">{suggestion.description}</p>
                {suggestion.revenue && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    Gain estimé: +{suggestion.revenue}€
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Chat */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            Assistant IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat History */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center py-6">
                <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Posez-moi une question sur votre salon !
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Exemples :</p>
                  <button 
                    onClick={() => setChatMessage("Comment optimiser mon planning ?")}
                    className="block w-full text-xs text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded px-2 py-1 transition-colors"
                  >
                    "Comment optimiser mon planning ?"
                  </button>
                  <button 
                    onClick={() => setChatMessage("Conseils pour fidéliser mes clients")}
                    className="block w-full text-xs text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded px-2 py-1 transition-colors"
                  >
                    "Conseils pour fidéliser mes clients"
                  </button>
                </div>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Posez votre question..."
              disabled={chatMutation.isPending}
            />
            <Button
              type="submit"
              disabled={chatMutation.isPending || !chatMessage.trim()}
              className="px-3"
            >
              {chatMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Status */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">IA connectée</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              OpenAI GPT-4o
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            L'intelligence artificielle analyse vos données en temps réel pour optimiser votre activité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}