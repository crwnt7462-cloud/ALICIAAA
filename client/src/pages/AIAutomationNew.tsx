import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Brain, Send, TrendingUp, Calendar, Users, Sparkles, Camera, Mic, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAutomation() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [chatMessage]);

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
        timestamp: new Date()
      };

      const assistantMessage: AIMessage = {
        id: Date.now().toString() + '-assistant',
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, userMessage, assistantMessage]);
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
    if (!chatMessage.trim() || chatMutation.isPending) return;
    chatMutation.mutate(chatMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatMessage(suggestion);
    setTimeout(() => {
      chatMutation.mutate(suggestion);
    }, 100);
  };

  const suggestions = [
    { text: "Analyse mes performances ce mois", icon: TrendingUp },
    { text: "Optimise mon planning demain", icon: Calendar },
    { text: "Comment fidéliser mes clients ?", icon: Users },
    { text: "Tendances beauté 2025", icon: Sparkles }
  ];

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header simple */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Assistant IA</h1>
              <p className="text-sm text-gray-500">Optimisation salon de beauté</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">GPT-4o</div>
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">Comment puis-je vous aider aujourd'hui ?</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="flex items-center gap-3 p-4 text-left border border-gray-200 hover:border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <suggestion.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {msg.role === 'assistant' ? (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">V</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gray-500">L'IA réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Zone de saisie simple */}
        <div className="flex-shrink-0 border-t bg-white px-6 py-4">
          <form onSubmit={handleChatSubmit}>
            <div className="flex items-end gap-3 border border-gray-300 rounded-lg p-3 focus-within:border-gray-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  title="Analyser une photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  title="Message vocal"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={chatMutation.isPending}
                  className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-500 text-gray-900 max-h-32"
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
                className={`p-2 rounded-md transition-colors ${
                  chatMessage.trim() && !chatMutation.isPending
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                L'IA peut faire des erreurs. Vérifiez les informations importantes.
              </p>
              
              {chatHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setChatHistory([])}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  Nouveau chat
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}