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
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Chat IA - Défini en premier
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

  // Effect pour scroll automatique
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatMutation.isPending]);

  // Gestion des suggestions de chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    chatMutation.mutate(chatMessage);
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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Interface Rendly AI - Mobile First */}
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header Rendly AI - Compact pour mobile */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">Rendly AI</h1>
                <p className="text-xs text-gray-500">Assistant beauté</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">En ligne</span>
            </div>
          </div>
        </div>

        {/* Zone de conversation - Hauteur calculée précisément */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages - Prend tout l'espace disponible */}
          <div className="flex-1 overflow-y-auto overscroll-bounce">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 pb-8">
                <div className="text-center max-w-sm mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Comment puis-je vous aider ?</h2>
                    <p className="text-sm text-gray-600 mb-6">Votre assistant beauté intelligent</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { text: "Conseils fidélisation clients", icon: "💼", gradient: "from-blue-500 to-purple-600" },
                      { text: "Optimiser mon salon", icon: "✨", gradient: "from-purple-500 to-pink-600" },
                      { text: "Tendances beauté 2025", icon: "🎨", gradient: "from-pink-500 to-rose-600" },
                      { text: "Stratégies marketing", icon: "📈", gradient: "from-green-500 to-emerald-600" }
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className={`bg-gradient-to-r ${suggestion.gradient} text-white p-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{suggestion.icon}</span>
                          <span className="text-sm font-medium text-left">{suggestion.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 px-3 py-3 pb-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className="group">
                    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">U</span>
                        </div>
                      )}
                      <div className={`flex-1 min-w-0 max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-2xl shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Indicateur de frappe */}
                {chatMutation.isPending && (
                  <div className="group">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="inline-block p-3 rounded-2xl rounded-bl-md bg-gray-100">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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

          {/* Zone de saisie fixe en bas - Toujours visible */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3 env(safe-area-inset-bottom)">
            <form onSubmit={handleChatSubmit} className="relative">
              <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2.5">
                <div className="flex-1">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Message Rendly AI..."
                    disabled={chatMutation.isPending}
                    className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-500 text-gray-900 max-h-24 text-base leading-tight"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                    style={{
                      minHeight: '20px',
                      height: 'auto',
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={chatMutation.isPending || !chatMessage.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    chatMessage.trim() && !chatMutation.isPending
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {chatMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Rendly AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}