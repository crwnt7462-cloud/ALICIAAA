import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, ArrowLeft, Bot, User, BarChart3, Users, Target, Heart
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
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header fixe */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/pro-tools")}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Rendly AI</h1>
              <p className="text-xs text-gray-500">Assistant Intelligence Artificielle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de messages - scroll indépendant */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-violet-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.type === 'user' && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-violet-500 text-white text-sm">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="w-8 h-8 shrink-0">
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