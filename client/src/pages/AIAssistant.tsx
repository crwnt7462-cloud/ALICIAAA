import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Send, ArrowLeft, Bot, User, BarChart3, Users, Target, Heart, 
  Brain, TrendingUp, Calendar, Clock, Star, AlertTriangle,
  CheckCircle, Zap, Crown, Sparkles, Camera, FileText,
  PieChart, Activity, Lightbulb, ShoppingBag, MessageSquare,
  Settings, Mic, Image, RefreshCw, Filter, Download, Share2, Plus
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

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

  const quickActions = [
    { id: 'revenue', label: 'Analyse Revenue', action: 'Analyse mes revenus des 30 derniers jours', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { id: 'planning', label: 'Optimiser Planning', action: 'Optimise mon planning pour maximiser la rentabilité', icon: Calendar, color: 'from-blue-500 to-cyan-600' },
    { id: 'clients', label: 'Insights Clients', action: 'Analyse le comportement de mes clients et suggère des actions', icon: Users, color: 'from-purple-500 to-violet-600' },
    { id: 'trends', label: 'Tendances 2025', action: 'Quelles sont les tendances beauté 2025 à proposer?', icon: Sparkles, color: 'from-pink-500 to-rose-600' }
  ];

  const insights = [
    { title: "Chiffre d'affaires", value: "€12,450", change: "+15.3%", trend: "up", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-600" },
    { title: "Taux occupation", value: "87%", change: "+5.2%", trend: "up", icon: <Activity className="w-4 h-4" />, color: "text-blue-600" },
    { title: "Clients fidèles", value: "234", change: "+23", trend: "up", icon: <Users className="w-4 h-4" />, color: "text-purple-600" },
    { title: "Note moyenne", value: "4.8/5", change: "+0.3", trend: "up", icon: <Star className="w-4 h-4" />, color: "text-yellow-600" }
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setActiveTab("chat");
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-purple-50/30">
        {/* Header Pro */}
        <div className="bg-white/95 backdrop-blur-sm border-b px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Rendly AI Pro
                  </h1>
                  <p className="text-xs text-gray-500">Powered by GPT-4o • En ligne</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-medium">CA +15%</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Activity className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-700 font-medium">87% taux</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white/80">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat">Chat IA</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-4">
                    {msg.type === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {msg.type === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-semibold text-sm">U</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="prose prose-sm max-w-none text-gray-900 leading-relaxed">
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        {msg.insights && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {msg.insights.map((insight, idx) => (
                                <div key={idx} className={`p-3 rounded-lg ${
                                  insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                                  insight.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                                  'bg-blue-50 border border-blue-200'
                                }`}>
                                  <p className="text-xs font-medium text-gray-600">{insight.title}</p>
                                  <p className={`text-sm font-bold ${
                                    insight.type === 'success' ? 'text-green-700' :
                                    insight.type === 'warning' ? 'text-amber-700' :
                                    'text-blue-700'
                                  }`}>{insight.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Brain className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-gray-500 animate-pulse">L'IA analyse votre demande...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="border-t bg-white/80 backdrop-blur-sm p-4 sticky bottom-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl p-3 shadow-lg focus-within:border-purple-300 focus-within:shadow-xl transition-all">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                          <Camera className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Analyser une photo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                          <Mic className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Enregistrer un message vocal</TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Posez une question à votre assistant IA..."
                      disabled={isLoading}
                      className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-400 text-gray-900 max-h-32 text-sm leading-relaxed"
                      rows={1}
                      style={{ minHeight: '20px' }}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      inputMessage.trim() && !isLoading
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 px-1">
                  <p className="text-xs text-gray-500">
                    Rendly AI peut commettre des erreurs. Vérifiez les informations importantes.
                  </p>
                  
                  {messages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessages([messages[0]])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Nouveau chat
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {insights.map((insight, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={insight.color}>{insight.icon}</div>
                        <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{insight.value}</p>
                      <p className={`text-sm ${insight.color}`}>{insight.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.action)}
                    className={`group relative p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left bg-gradient-to-r ${action.color} hover:scale-[1.02] hover:shadow-md`}
                  >
                    <div className="flex items-center gap-4">
                      <action.icon className="w-8 h-8 text-white flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-white">{action.label}</p>
                        <p className="text-sm text-white/80 mt-1">{action.action}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Fonctionnalités d'analytics avancées à venir...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}