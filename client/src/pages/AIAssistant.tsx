import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, ArrowLeft, Bot, User, Sparkles, TrendingUp, Users, 
  Camera, Palette, Brain, Zap, MessageCircle, Mic, Image,
  BarChart3, Target, Gift, Heart, Star
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
}

export default function AIAssistant() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assistant");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA Rendly. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
      category: 'greeting'
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

  const quickActions = [
    { icon: <BarChart3 className="w-4 h-4" />, label: "Analyser mes performances", action: "Analyse mes performances de ce mois" },
    { icon: <Users className="w-4 h-4" />, label: "Optimiser planning", action: "Comment optimiser mon planning de demain ?" },
    { icon: <Target className="w-4 h-4" />, label: "Conseils marketing", action: "Donne-moi des idées marketing pour fidéliser mes clients" },
    { icon: <Heart className="w-4 h-4" />, label: "Tendances beauté", action: "Quelles sont les tendances beauté actuelles ?" }
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const entrepreneurFeatures = [
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      title: "Analytics Prédictifs",
      description: "Anticipez les tendances et optimisez vos revenus"
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      title: "Gestion Clientèle IA",
      description: "Détectez les risques de départ et fidélisez intelligemment"
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
      title: "Optimisation Planning",
      description: "Maximisez votre taux d'occupation automatiquement"
    }
  ];

  const clientFeatures = [
    {
      icon: <Camera className="w-5 h-5 text-pink-500" />,
      title: "Analyse Photo IA",
      description: "Recommandations personnalisées via reconnaissance visuelle"
    },
    {
      icon: <Palette className="w-5 h-5 text-indigo-500" />,
      title: "Conseils Tendances",
      description: "Suggestions looks basées sur vos préférences"
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: "Expérience VIP",
      description: "Service client augmenté par l'intelligence artificielle"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Rendly AI
              </h1>
              <p className="text-sm text-gray-500">Assistant intelligent pour professionnels</p>
            </div>

            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="entrepreneur" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Entrepreneur
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Assistant IA
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Expérience Client
            </TabsTrigger>
          </TabsList>

          {/* Onglet Entrepreneur */}
          <TabsContent value="entrepreneur" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  IA pour l'Entrepreneur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {entrepreneurFeatures.map((feature, index) => (
                    <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="mb-3 flex justify-center">{feature.icon}</div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Assistant IA */}
          <TabsContent value="assistant" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-500" />
                  Chat avec l'Assistant IA
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={
                          message.type === 'user' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-violet-100 text-violet-600'
                        }>
                          {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-violet-100 text-violet-600">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 p-3 rounded-lg">
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

                {/* Actions rapides */}
                <div className="border-t border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => {
                          setInputMessage(action.action);
                          handleSendMessage();
                        }}
                      >
                        {action.icon}
                        <span className="ml-2 truncate">{action.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Zone de saisie */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Tapez votre question..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Client */}
          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  IA pour l'Expérience Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {clientFeatures.map((feature, index) => (
                    <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="mb-3 flex justify-center">{feature.icon}</div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}