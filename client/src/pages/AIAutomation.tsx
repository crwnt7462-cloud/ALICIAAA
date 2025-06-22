import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Brain, Calendar, AlertTriangle, TrendingUp, Settings, Zap, Target, Clock, Users, DollarSign, MessageCircle, Send, Bot, HelpCircle, Book, Video } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AiInsight {
  id: string;
  type: "smart_planning" | "no_show_prediction" | "rebooking" | "promotion";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  action?: string;
  createdAt: Date;
}

interface SmartPlanningOptimization {
  date: string;
  originalSlots: number;
  optimizedSlots: number;
  gapsReduced: number;
  revenueIncrease: number;
}

const mockAiInsights: AiInsight[] = [
  {
    id: "1",
    type: "no_show_prediction",
    title: "Risque de no-show élevé détecté",
    description: "Client Marie Durand - RDV demain 14h - Probabilité no-show: 78%",
    confidence: 0.78,
    impact: "high",
    action: "Acompte de 20€ demandé automatiquement",
    createdAt: new Date()
  },
  {
    id: "2",
    type: "smart_planning",
    title: "Optimisation planning suggérée",
    description: "Réorganisation de 3 créneaux pourrait augmenter le CA de 85€",
    confidence: 0.92,
    impact: "medium",
    createdAt: new Date()
  },
  {
    id: "3",
    type: "rebooking",
    title: "Clients à relancer identifiés",
    description: "12 clients inactifs depuis plus de 2 mois détectés",
    confidence: 0.85,
    impact: "high",
    action: "Campagne de relance automatique programmée",
    createdAt: new Date()
  },
  {
    id: "4",
    type: "promotion",
    title: "Promotion ciblée recommandée",
    description: "Réduction 15% sur premier RDV - Taux conversion estimé: 34%",
    confidence: 0.67,
    impact: "high",
    createdAt: new Date()
  }
];

const mockOptimizations: SmartPlanningOptimization[] = [
  { date: "2025-06-18", originalSlots: 8, optimizedSlots: 10, gapsReduced: 2, revenueIncrease: 120 },
  { date: "2025-06-17", originalSlots: 6, optimizedSlots: 8, gapsReduced: 1, revenueIncrease: 85 },
  { date: "2025-06-16", originalSlots: 9, optimizedSlots: 11, gapsReduced: 3, revenueIncrease: 180 },
];

export default function AIAutomation() {
  const [aiSettings, setAiSettings] = useState({
    smartPlanningEnabled: true,
    noShowPredictionEnabled: true,
    autoRebookingEnabled: true,
    businessCopilotEnabled: true,
    noShowThreshold: 0.3,
    rebookingDaysAdvance: 7
  });

  // Support chat state
  const [messages, setMessages] = useState<any[]>([
    { id: '1', text: 'Bonjour ! Je suis votre assistant IA Beauty Pro. Comment puis-je vous aider aujourd\'hui ?', isBot: true, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();

  // Récupération des insights IA en temps réel
  const { data: aiInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/ai/insights'],
    refetchInterval: 30000, // Actualisation toutes les 30 secondes
  });

  // Récupération des promotions suggérées
  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ['/api/ai/promotions'],
    refetchInterval: 60000, // Actualisation toutes les minutes
  });

  // Mutation pour l'optimisation du planning
  const optimizePlanningMutation = useMutation({
    mutationFn: async (date: string) => {
      const response = await apiRequest("POST", "/api/ai/optimize-planning", { date });
      return response.json();
    },
  });

  // Chat functionality
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await apiRequest("POST", "/api/ai/chat", { message: inputMessage });
      const data = await response.json();
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler votre question ?",
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre des difficultés techniques. Essayez de reformuler votre question ou contactez le support technique.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "smart_planning": return <Calendar className="h-4 w-4" />;
      case "no_show_prediction": return <AlertTriangle className="h-4 w-4" />;
      case "rebooking": return <Users className="h-4 w-4" />;
      case "promotion": return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-luxury">
                <Brain className="h-6 w-6 text-white" />
              </div>
              Assistant Pro
            </h1>
            <p className="text-gray-600 mt-2">Copilote IA pour optimiser votre business beauté</p>
          </div>
          <Button className="gradient-bg text-white px-6 py-3 rounded-xl font-medium shadow-luxury hover:scale-105 transition-all duration-200">
            <Settings className="h-4 w-4 mr-2" />
            Configurer
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="automation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Automatisation IA
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Support & Assistance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automation" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Optimisations aujourd'hui</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CA additionnel (7j)</p>
                      <p className="text-2xl font-bold">385€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Temps économisé</p>
                      <p className="text-2xl font-bold">2.5h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taux précision</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Insights IA en temps réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAiInsights.map((insight) => (
                      <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(insight.type)}
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                          </div>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confiance:</span>
                            <Progress value={insight.confidence * 100} className="w-20 h-2" />
                            <span className="text-xs font-medium">{Math.round(insight.confidence * 100)}%</span>
                          </div>
                          {insight.action && (
                            <Button variant="outline" size="sm">
                              Appliquer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Promotions suggérées</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-purple-400 pl-3">
                        <p className="font-medium">Offre "Retour Client"</p>
                        <p className="text-purple-700">-20% pour clients inactifs depuis 2 mois</p>
                        <p className="text-xs text-purple-600">Taux conversion estimé: 28%</p>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-3">
                        <p className="font-medium">Package "Détente"</p>
                        <p className="text-blue-700">3 soins pour le prix de 2</p>
                        <p className="text-xs text-blue-600">Impact CA estimé: +15%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Insights comportementaux</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 68% de vos clients préfèrent les créneaux 14h-17h</p>
                      <p>• Les mardis génèrent 23% plus de CA que la moyenne</p>
                      <p>• 5 clients à risque de départ détectés</p>
                      <p>• Potentiel de 12 nouveaux clients via recommandations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chat IA */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      Assistant IA Beauty Pro
                    </CardTitle>
                    <p className="text-sm text-gray-500">Posez vos questions, je suis là pour vous aider</p>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[400px]">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <Bot className="h-12 w-12 mx-auto mb-3 text-blue-300" />
                            <p className="text-sm">Bonjour ! Je suis votre assistant IA.</p>
                            <p className="text-xs mt-1">Posez-moi vos questions sur la gestion de votre salon.</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
                            <div className={`max-w-[85%] rounded-lg p-4 shadow-sm ${
                              message.isBot 
                                ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                                : 'bg-blue-600 text-white'
                            }`}>
                              <div className="flex items-start gap-2">
                                {message.isBot && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                  <p className={`text-xs mt-2 ${message.isBot ? 'text-blue-600' : 'text-blue-100'}`}>
                                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Input */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tapez votre question ici..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={!inputMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Questions fréquentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="font-medium">Comment optimiser mon planning ?</p>
                        <p className="text-xs text-gray-500">Conseils pour maximiser votre chiffre d'affaires</p>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="font-medium">Gérer les no-shows</p>
                        <p className="text-xs text-gray-500">Stratégies pour réduire les annulations</p>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <p className="font-medium">Fidéliser ma clientèle</p>
                        <p className="text-xs text-gray-500">Techniques de rétention client</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Ressources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Tutoriels vidéo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Book className="h-4 w-4 mr-2" />
                      Guide utilisateur
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Communauté
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}