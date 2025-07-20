import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, ArrowLeft, Bot, User, BarChart3, Users, Target, Heart, 
  Brain, TrendingUp, Calendar, Clock, Star, AlertTriangle,
  CheckCircle, Zap, Crown, Sparkles, Camera, FileText,
  PieChart, Activity, Lightbulb, ShoppingBag, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  insights?: {
    type: 'warning' | 'success' | 'info';
    title: string;
    value: string;
  }[];
}

export default function AIAssistant() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Bienvenue dans Rendly AI Pro ! Je suis votre assistant intelligent spécialisé dans l\'optimisation de salons de beauté. Je peux analyser vos performances, prédire les tendances, optimiser vos plannings et bien plus encore.',
      timestamp: new Date(),
      category: 'greeting',
      insights: [
        { type: 'success', title: 'CA ce mois', value: '+15%' },
        { type: 'info', title: 'Taux occupation', value: '87%' },
        { type: 'warning', title: 'Stock bas', value: '3 produits' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        conversationHistory: messages.slice(-10)
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.response || "Je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        timestamp: new Date(),
        category: data.category || 'general'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const aiCapabilities = [
    {
      category: "Analyse Business",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-600",
      actions: [
        { label: "Performance mensuelle", action: "Analyse complète de mes performances ce mois" },
        { label: "ROI par service", action: "Calcule le ROI de chaque service proposé" },
        { label: "Prévisions CA", action: "Prédis mon chiffre d'affaires du mois prochain" }
      ]
    },
    {
      category: "Optimisation Planning",
      icon: <Calendar className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      actions: [
        { label: "Planning optimal", action: "Optimise mon planning pour maximiser les revenus" },
        { label: "Créneaux libres", action: "Identifie les créneaux à optimiser cette semaine" },
        { label: "Prédiction no-shows", action: "Prédis les risques d'annulation demain" }
      ]
    },
    {
      category: "Marketing IA",
      icon: <Target className="w-5 h-5" />,
      color: "from-purple-500 to-violet-600",
      actions: [
        { label: "Campagne personnalisée", action: "Crée une campagne marketing pour mes clients VIP" },
        { label: "Segmentation clients", action: "Analyse et segmente ma clientèle" },
        { label: "Prix dynamiques", action: "Suggère des prix optimaux selon la demande" }
      ]
    },
    {
      category: "Tendances & Innovation",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-pink-500 to-rose-600",
      actions: [
        { label: "Tendances 2025", action: "Quelles sont les tendances beauté 2025 ?" },
        { label: "Nouveaux services", action: "Suggère de nouveaux services à proposer" },
        { label: "Formation équipe", action: "Recommande des formations pour mon équipe" }
      ]
    }
  ];

  const insights = [
    {
      title: "Chiffre d'affaires",
      value: "€12,450",
      change: "+15.3%",
      trend: "up",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-green-600"
    },
    {
      title: "Taux occupation",
      value: "87%",
      change: "+5.2%",
      trend: "up", 
      icon: <Activity className="w-4 h-4" />,
      color: "text-blue-600"
    },
    {
      title: "Clients fidèles",
      value: "234",
      change: "+23",
      trend: "up",
      icon: <Users className="w-4 h-4" />,
      color: "text-purple-600"
    },
    {
      title: "Note moyenne",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      icon: <Star className="w-4 h-4" />,
      color: "text-yellow-600"
    }
  ];

  const predictions = [
    {
      type: "success",
      title: "Pic de demande prévu",
      description: "Samedi 25 janvier - Coiffure +40%",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      type: "warning", 
      title: "Stock critique",
      description: "Shampoing professionnel - 3 jours restants",
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      type: "info",
      title: "Opportunité marketing",
      description: "15 clientes n'ont pas réservé depuis 3 mois",
      icon: <Target className="w-4 h-4" />
    }
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setActiveTab("chat");
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header Pro */}
      <div className="bg-white/95 backdrop-blur-sm border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-gray-900">Rendly AI Pro</h1>
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Intelligence artificielle avancée</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">En ligne</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm px-4 border-b">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 rounded-xl p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2 text-xs">
              <MessageSquare className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2 text-xs">
              <Lightbulb className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2 text-xs">
              <Zap className="w-4 h-4" />
              Prédictions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm">
                      <Brain className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl p-4'
                      : 'bg-white rounded-2xl p-4 shadow-sm border'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {message.insights && (
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                      {message.insights.map((insight, idx) => (
                        <div key={idx} className={`text-center p-2 rounded-lg ${
                          insight.type === 'success' ? 'bg-green-50 text-green-700' :
                          insight.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          <div className="text-xs font-medium">{insight.title}</div>
                          <div className="text-sm font-bold">{insight.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-3 ${
                    message.type === 'user' ? 'text-violet-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.type === 'user' && (
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-violet-500 text-white text-sm">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions rapides au premier message */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="justify-start h-auto p-3 text-left text-xs"
              >
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Zone de saisie fixe en bas */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="resize-none"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-violet-500 hover:bg-violet-600 text-white px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}