import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Send, ArrowLeft, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatGPTInterface() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Vérification de l'abonnement pour l'accès IA
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const hasAIAccess = (user as any)?.subscriptionPlan === 'premium-pro' && (user as any)?.subscriptionStatus === 'active';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: data.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Vérifier l'accès IA avant d'envoyer
    if (!hasAIAccess) {
      toast({
        title: "Accès Premium Requis",
        description: "L'assistant IA est disponible uniquement avec l'abonnement Premium Pro à 149€/mois.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex flex-col">
      {/* Header violet intense - Responsive */}
      <div className="flex items-center justify-between p-4 lg:p-6 bg-violet-700/90 border-b border-violet-500/50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="h-8 w-8 lg:h-10 lg:w-10 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
          <div>
            <h1 className="text-lg lg:text-xl font-semibold text-white">Assistant IA</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm lg:text-base text-white/90">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de conversation - Responsive */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {/* Message de blocage pour utilisateurs sans Premium Pro */}
        {!userLoading && !hasAIAccess && (
          <div className="flex justify-center mb-6">
            <div className="max-w-md lg:max-w-lg bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 text-center border border-white/20">
              <Lock className="h-12 w-12 lg:h-16 lg:w-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Assistant IA Premium</h3>
              <p className="text-white/80 lg:text-lg mb-4">
                L'assistant IA est exclusivement disponible avec l'abonnement Premium Pro à 149€/mois.
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-semibold">Premium Pro uniquement</span>
              </div>
              <Button
                onClick={() => setLocation('/subscription-plans')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg"
              >
                Passer au Premium Pro
              </Button>
            </div>
          </div>
        )}
        
        {/* Messages de conversation (seulement si accès Premium) */}
        {hasAIAccess && messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white ml-12 shadow-lg'
                  : 'bg-white text-gray-900 mr-12 shadow-lg border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-violet-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicateur de frappe (seulement si accès Premium) */}
        {hasAIAccess && chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 rounded-2xl px-4 py-3 mr-12 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Assistant répond...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie violette */}
      <div className="bg-violet-700/90 border-t border-violet-500/50 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasAIAccess ? "Tapez votre message..." : "Premium Pro requis pour utiliser l'IA..."}
              disabled={chatMutation.isPending || !hasAIAccess}
              className={`min-h-[48px] pr-12 rounded-3xl border-white/30 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-0 resize-none ${
                hasAIAccess 
                  ? 'bg-white/20' 
                  : 'bg-white/10 cursor-not-allowed opacity-60'
              }`}
              style={{ paddingTop: '12px', paddingBottom: '12px' }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending || !hasAIAccess}
            className={`h-12 w-12 rounded-full text-white shadow-lg disabled:opacity-50 flex-shrink-0 ${
              hasAIAccess 
                ? 'bg-violet-600 hover:bg-violet-500' 
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Note informative */}
        <p className="text-xs text-white/80 text-center mt-2 max-w-4xl mx-auto">
          {hasAIAccess 
            ? "L'assistant IA peut vous aider avec la gestion de votre salon, vos rendez-vous, et répondre à vos questions."
            : "L'assistant IA est exclusivement disponible avec l'abonnement Premium Pro à 149€/mois."
          }
        </p>
      </div>
    </div>
  );
}