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

  // Chat IA avec historique pour éviter les répétitions
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { 
        message,
        conversationHistory: chatHistory
      });
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header fixe en haut */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">IA Assistant</h1>
          </div>
          <div className="text-sm text-gray-500">GPT-4o</div>
        </div>
      </div>

      {/* Zone de conversation avec scroll */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comment puis-je vous aider ?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      { text: "Comment fidéliser mes clients ?", icon: "👥" },
                      { text: "Conseils pour mon salon", icon: "✨" },
                      { text: "Tendances beauté 2025", icon: "🎨" },
                      { text: "Stratégies marketing", icon: "📈" }
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="flex items-center gap-3 p-4 text-left border border-gray-200 hover:border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">{suggestion.icon}</span>
                        <span className="text-sm text-gray-700">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 px-4 py-6">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className="group">
                    <div className="flex gap-4">
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">U</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Indicateur de frappe */}
                {chatMutation.isPending && (
                  <div className="group">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

        {/* Zone de saisie fixe en bas */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 sticky bottom-0">
          <form onSubmit={handleChatSubmit} className="relative">
            <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-3">
              <div className="flex-1">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Envoyez un message à votre assistant IA"
                  disabled={chatMutation.isPending}
                  className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-500 text-gray-900 max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit(e);
                    }
                  }}
                  style={{
                    minHeight: '24px',
                    height: 'auto',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={chatMutation.isPending || !chatMessage.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  chatMessage.trim() && !chatMutation.isPending
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            L'assistant IA peut faire des erreurs. Pensez à vérifier les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}