import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/3_1753714984824.png";
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
  Mic, Settings, Maximize2, Copy, RefreshCw, Palette, 
  TrendingDown, DollarSign, Eye
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
    icon?: any;
  }[];
}

export default function AIAssistantNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Bonjour ! Je suis votre assistant IA, spécialisé dans l\'optimisation de salons de beauté. Je peux analyser vos performances, prédire les tendances, optimiser vos plannings et vous donner des conseils personnalisés pour développer votre activité.',
      timestamp: new Date(),
      category: 'greeting',
      insights: [
        { type: 'success', title: 'CA ce mois', value: '+15%', icon: TrendingUp },
        { type: 'info', title: 'Taux occupation', value: '87%', icon: Activity },
        { type: 'warning', title: 'Stock bas', value: '3 produits', icon: AlertTriangle }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollTop(scrollTop > 200);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        conversationHistory: messages.slice(-10)
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
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
      setIsTyping(false);
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
    setIsTyping(true);
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
    { 
      icon: <BarChart3 className="w-4 h-4" />, 
      label: "Analyser performances", 
      action: "Analyse mes performances de cette semaine",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      icon: <Calendar className="w-4 h-4" />, 
      label: "Optimiser planning", 
      action: "Comment optimiser mon planning de demain ?",
      gradient: "from-purple-500 to-violet-500"
    },
    { 
      icon: <Users className="w-4 h-4" />, 
      label: "Fidélisation clients", 
      action: "Conseils pour fidéliser mes clients",
      gradient: "from-emerald-500 to-green-500"
    },
    { 
      icon: <TrendingUp className="w-4 h-4" />, 
      label: "Augmenter CA", 
      action: "Stratégies pour augmenter mon chiffre d'affaires",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Analyse Prédictive",
      description: "Prédictions des tendances et comportements clients",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Optimisation Business",
      description: "Recommandations personnalisées pour votre salon",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "IA Créative", 
      description: "Suggestions looks et tendances beauté",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Analytics Avancés",
      description: "Insights détaillés sur vos performances", 
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header Ultra-Moderne - Fixé en haut */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-lg shrink-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
              className="mr-2 hover:bg-violet-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full m-0.5 animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Rendly AI Pro</h1>
                <p className="text-xs text-violet-600 font-medium">Assistant IA Spécialisé Beauté</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              GPT-4o Active
            </Badge>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-gray-200 bg-white/70 backdrop-blur-sm shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-12">
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 font-medium"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger 
              value="features"
              className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Fonctionnalités
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics IA
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Interface */}
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 min-h-0 relative">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4" 
            style={{ maxHeight: 'calc(100vh - 240px)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600">
                    <AvatarFallback className="bg-transparent text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white ml-auto'
                        : 'bg-white border border-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  
                  {/* Insights Cards */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {message.insights.map((insight, index) => {
                        const IconComponent = insight.icon || Activity;
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-xl border ${
                              insight.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200'
                                : insight.type === 'warning'
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`w-4 h-4 ${
                                  insight.type === 'success'
                                    ? 'text-emerald-600'
                                    : insight.type === 'warning'
                                    ? 'text-amber-600'
                                    : 'text-blue-600'
                                }`} />
                                <span className="text-sm font-medium text-gray-700">
                                  {insight.title}
                                </span>
                              </div>
                              <span className={`text-sm font-bold ${
                                insight.type === 'success'
                                  ? 'text-emerald-700'
                                  : insight.type === 'warning'
                                  ? 'text-amber-700'
                                  : 'text-blue-700'
                              }`}>
                                {insight.value}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700">
                    <AvatarFallback className="bg-transparent text-white text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600">
                  <AvatarFallback className="bg-transparent text-white text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bouton Remonter en haut */}
          {showScrollTop && (
            <Button
              onClick={scrollToTop}
              size="sm"
              className="absolute bottom-20 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 -rotate-90" />
            </Button>
          )}

          {/* Quick Actions & Input - Fixé en bas */}
          <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 shrink-0">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="justify-start h-auto p-3 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                  disabled={isLoading}
                >
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mr-2 text-white`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question à l'IA..."
                  className="pr-12 border-gray-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/ai-alerts')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-full shadow-sm"
                >
                  <User className="w-4 h-4 text-white" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="features" className="flex-1 p-4 space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fonctionnalités IA Avancées</h2>
            <p className="text-gray-600">Découvrez toutes les capacités de Rendly AI Pro</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-violet-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Version Pro Active</h3>
              <p className="text-gray-600 text-sm mb-4">
                Accès complet à toutes les fonctionnalités IA avancées
              </p>
              <Badge className="bg-violet-600 text-white">
                GPT-4o • Analyses illimitées • Support prioritaire
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex-1 p-4 space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics IA</h2>
            <p className="text-gray-600">Insights générés par intelligence artificielle</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                  Prédiction CA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 mb-1">+24%</div>
                <div className="text-xs text-gray-500">Prochaine semaine</div>
                <Progress value={75} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Rétention IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">89%</div>
                <div className="text-xs text-gray-500">Score optimisé</div>
                <Progress value={89} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-violet-600" />
                Recommandations IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Optimisation Planning</p>
                  <p className="text-blue-700 text-xs">Décaler les RDV de 15min améliorerait le taux d'occupation de 12%</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-900 text-sm">Opportunité Business</p>
                  <p className="text-emerald-700 text-xs">Lancer une offre "Coupe + Couleur" pourrait augmenter le CA de 18%</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 text-sm">Alerte Prédictive</p>
                  <p className="text-amber-700 text-xs">3 clients à risque de départ détectés - actions recommandées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}