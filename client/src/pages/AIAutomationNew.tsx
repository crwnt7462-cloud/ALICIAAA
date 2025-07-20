import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Brain, MessageCircle, TrendingUp, Calendar, Users, Zap, Send, 
  Camera, Lightbulb, Target, DollarSign, AlertTriangle, 
  Sparkles, BarChart3, Eye, Palette, TrendingDown, Bot, 
  Crown, Star, Activity, PieChart, ArrowUp, ArrowDown,
  Mic, Image, FileText, Clock, CheckCircle, Plus,
  Settings, Share2, Download, RefreshCw, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'analysis' | 'recommendation' | 'prediction';
  data?: any;
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: any;
  category: string;
  color: string;
}

export default function AIAutomation() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Actions rapides intelligentes
  const quickActions: QuickAction[] = [
    {
      id: 'revenue-analysis',
      label: 'Analyse Revenue',
      prompt: 'Analyse mes revenus des 30 derniers jours et identifie les opportunités d\'amélioration',
      icon: TrendingUp,
      category: 'business',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'planning-optimization',
      label: 'Optimiser Planning',
      prompt: 'Optimise mon planning de demain pour maximiser la rentabilité',
      icon: Calendar,
      category: 'planning',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'client-insights',
      label: 'Insights Clients',
      prompt: 'Analyse le comportement de mes clients et suggère des actions de fidélisation',
      icon: Users,
      category: 'clients',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'trend-analysis',
      label: 'Tendances 2025',
      prompt: 'Quelles sont les dernières tendances beauté 2025 que je devrais proposer?',
      icon: Sparkles,
      category: 'trends',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'marketing-campaign',
      label: 'Campagne Marketing',
      prompt: 'Crée une campagne marketing personnalisée pour mes clients VIP',
      icon: Target,
      category: 'marketing',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'photo-analysis',
      label: 'Analyser Photo',
      prompt: 'Je vais uploader une photo pour analyse et recommandations',
      icon: Camera,
      category: 'analysis',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  // Chat IA avec historique pour éviter les répétitions
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { 
        message,
        conversationHistory: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });
      return response.json();
    },
    onSuccess: (data) => {
      const userMessage: AIMessage = {
        id: Date.now().toString() + '-user',
        role: "user",
        content: chatMessage,
        timestamp: new Date(),
        type: 'text'
      };

      const assistantMessage: AIMessage = {
        id: Date.now().toString() + '-assistant',
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        type: data.type || 'text',
        data: data.data
      };

      setChatHistory(prev => [...prev, userMessage, assistantMessage]);
      setChatMessage("");
      setShowSuggestions(false);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [chatMessage]);

  // Gestion des suggestions de chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatMutation.isPending) return;
    chatMutation.mutate(chatMessage);
  };

  const handleQuickAction = (action: QuickAction) => {
    setChatMessage(action.prompt);
    setTimeout(() => {
      chatMutation.mutate(action.prompt);
    }, 100);
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
    <TooltipProvider>
      <div className="h-screen bg-gradient-to-br from-gray-50 to-purple-50/20 flex flex-col">
        {/* Header Pro avec stats en temps réel */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
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

        {/* Container principal */}
        <div className="flex-1 flex max-w-6xl mx-auto w-full">
          {/* Sidebar Actions Rapides - Masqué sur mobile */}
          {showSuggestions && chatHistory.length === 0 && (
            <div className="hidden lg:block w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    Actions Rapides
                  </h3>
                  <div className="grid gap-2">
                    {quickActions.map((action) => (
                      <Tooltip key={action.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleQuickAction(action)}
                            className={`group relative p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left bg-gradient-to-r ${action.color} hover:scale-[1.02] hover:shadow-md`}
                          >
                            <div className="flex items-center gap-3">
                              <action.icon className="w-5 h-5 text-white flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{action.label}</p>
                                <p className="text-xs text-white/80 mt-1 line-clamp-2">{action.prompt}</p>
                              </div>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">{action.prompt}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                
                {/* Métriques rapides */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Aujourd'hui
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Rendez-vous</span>
                      <span className="text-sm font-semibold text-gray-900">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Revenue</span>
                      <span className="text-sm font-semibold text-green-600">€1,240</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Satisfaction</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zone de conversation */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                  <div className="text-center max-w-2xl">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Bot className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment puis-je optimiser votre salon ?</h2>
                    <p className="text-gray-600 mb-8">Intelligence artificielle dédiée aux professionnels de la beauté</p>
                    
                    {/* Suggestions initiales - Version mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3 mb-8">
                      {quickActions.slice(0, 4).map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action)}
                          className={`group relative p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left bg-gradient-to-r ${action.color} hover:scale-[1.02] hover:shadow-md`}
                        >
                          <div className="flex items-center gap-3">
                            <action.icon className="w-5 h-5 text-white flex-shrink-0" />
                            <span className="text-sm font-medium text-white">{action.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Suggestions texte pour écrans larges */}
                    <div className="hidden lg:grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {[
                        { text: "Analyse mes performances ce mois", icon: "📊" },
                        { text: "Optimise mon planning demain", icon: "📅" },
                        { text: "Tendances beauté 2025", icon: "✨" },
                        { text: "Stratégies de fidélisation", icon: "💎" }
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="flex items-center gap-3 p-4 text-left border border-gray-200 hover:border-purple-300 rounded-xl hover:bg-purple-50/50 transition-all duration-200 group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                          <span className="text-sm text-gray-700 font-medium">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 px-4 lg:px-6 py-6">
                  {chatHistory.map((msg, idx) => (
                    <div key={msg.id} className="group">
                      <div className="flex gap-4 lg:gap-6">
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                          </div>
                        )}
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white font-semibold text-sm">U</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                            <div className="prose prose-sm max-w-none text-gray-900 leading-relaxed">
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                            {msg.type !== 'text' && msg.data && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <Badge variant="outline" className="text-xs">
                                  {msg.type === 'analysis' && 'Analyse'}
                                  {msg.type === 'recommendation' && 'Recommandation'}
                                  {msg.type === 'prediction' && 'Prédiction'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Indicateur de frappe amélioré */}
                  {chatMutation.isPending && (
                    <div className="group">
                      <div className="flex gap-4 lg:gap-6">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-white animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
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
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Zone de saisie améliorée */}
            <div className="flex-shrink-0 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 lg:p-6 sticky bottom-0">
              <form onSubmit={handleChatSubmit} className="relative max-w-4xl mx-auto">
                <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl p-3 shadow-lg focus-within:border-purple-300 focus-within:shadow-xl transition-all">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-purple-50"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = handlePhotoUpload;
                            input.click();
                          }}
                        >
                          <Camera className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Analyser une photo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-purple-50"
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Enregistrer un message vocal</TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Posez une question à votre assistant IA..."
                      disabled={chatMutation.isPending}
                      className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-400 text-gray-900 max-h-32 text-sm leading-relaxed"
                      rows={1}
                      style={{ minHeight: '20px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit(e);
                        }
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={chatMutation.isPending || !chatMessage.trim()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      chatMessage.trim() && !chatMutation.isPending
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-gray-500">
                      Rendly AI peut commettre des erreurs. Vérifiez les informations importantes.
                    </p>
                  </div>
                  
                  {chatHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setChatHistory([]);
                        setShowSuggestions(true);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Nouveau chat
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}