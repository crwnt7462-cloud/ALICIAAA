import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Send, ArrowLeft, Bot, User, BarChart3, Users, Target, Heart, 
  Brain, TrendingUp, Calendar, Clock, Star, AlertTriangle,
  CheckCircle, Zap, Crown, Sparkles, Camera, FileText,
  PieChart, Activity, Lightbulb, ShoppingBag, MessageSquare,
  Mic, Settings, Maximize2, Copy, RefreshCw, Palette
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
      content: 'Bienvenue dans votre assistant IA Pro ! Je suis votre assistant intelligent spécialisé dans l\'optimisation de salons de beauté. Je peux analyser vos performances, prédire les tendances, optimiser vos plannings et bien plus encore.',
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
        category: data.category || 'general',
        insights: data.insights || []
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de joindre l'assistant IA. Réessayez plus tard.",
        variant: "destructive"
      });
      setIsLoading(false);
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

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickActions = [
    { icon: <BarChart3 className="w-4 h-4" />, label: "Analyser les performances", action: "Analyse mes performances de cette semaine" },
    { icon: <Calendar className="w-4 h-4" />, label: "Optimiser planning", action: "Comment optimiser mon planning de demain ?" },
    { icon: <Users className="w-4 h-4" />, label: "Fidélisation clients", action: "Conseils pour fidéliser mes clients" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Augmenter CA", action: "Stratégies pour augmenter mon chiffre d'affaires" }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header fixe */}
      <div className="bg-white border-b p-4 flex items-center gap-3 shadow-sm flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/dashboard")}
          className="h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Assistant IA Pro</h1>
            <p className="text-sm text-gray-500">Assistant IA spécialisé beauté</p>
          </div>
        </div>
        <div className="ml-auto">
          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      </div>

      {/* Contenu principal scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-violet-100 text-violet-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-violet-500 text-white ml-auto' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {message.insights && message.insights.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {message.insights.map((insight, index) => (
                      <Card key={index} className="border-l-4 border-l-violet-500">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{insight.title}</span>
                            <span className={`text-sm font-semibold ${
                              insight.type === 'success' ? 'text-green-600' : 
                              insight.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                            }`}>
                              {insight.value}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.type === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-violet-100 text-violet-600">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border shadow-sm p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">L'IA réfléchit...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Actions rapides */}
      {messages.length === 1 && (
        <div className="p-4 bg-white border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="h-auto p-3 justify-start text-left"
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

      {/* Nouvelles fonctionnalités IA */}
      {messages.length > 1 && (
        <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Fonctionnalités IA Avancées</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('analyse_photo')}
              className="h-auto p-3 justify-start text-left"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-violet-600" />
                <div>
                  <div className="font-medium">Analyse Photo</div>
                  <div className="text-xs text-gray-500">Conseils beauté IA</div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('optimiser_planning')}
              className="h-auto p-3 justify-start text-left"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium">Optimiser Planning</div>
                  <div className="text-xs text-gray-500">IA prédictive</div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('analyse_tendances')}
              className="h-auto p-3 justify-start text-left"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <div className="font-medium">Tendances Marché</div>
                  <div className="text-xs text-gray-500">Insights business</div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('recommandations')}
              className="h-auto p-3 justify-start text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-medium">Recommandations</div>
                  <div className="text-xs text-gray-500">Personnalisées</div>
                </div>
              </div>
            </Button>
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
              placeholder="Posez votre question à l'IA..."
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