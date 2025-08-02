import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, ArrowLeft } from "lucide-react";
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
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header minimal glassmorphism */}
      <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/20 border-b border-white/30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="h-8 w-8 p-0 rounded-full backdrop-blur-md bg-white/40 border border-black/30 hover:bg-white/50 text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-black">Assistant IA</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-800">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'backdrop-blur-md bg-blue-500/80 border border-blue-400/30 text-white ml-12'
                  : 'backdrop-blur-md bg-white/50 border border-black/30 text-black mr-12'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-800'
              }`}>
                {message.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicateur de frappe */}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="backdrop-blur-md bg-white/50 border border-black/30 rounded-2xl px-4 py-3 mr-12">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-800 ml-2">Assistant répond...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie glassmorphism */}
      <div className="backdrop-blur-md bg-white/20 border-t border-white/30 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              disabled={chatMutation.isPending}
              className="min-h-[48px] pr-12 rounded-3xl backdrop-blur-md bg-white/40 border-black/30 text-black placeholder-gray-800 focus:border-black/50 focus:ring-black/30 resize-none"
              style={{ paddingTop: '12px', paddingBottom: '12px' }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending}
            className="h-12 w-12 rounded-full backdrop-blur-md bg-blue-500/80 border border-blue-400/30 hover:bg-blue-600/80 disabled:bg-gray-300/50 flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Note informative */}
        <p className="text-xs text-black text-center mt-2 max-w-4xl mx-auto">
          L'assistant IA peut vous aider avec la gestion de votre salon, vos rendez-vous, et répondre à vos questions.
        </p>
      </div>
    </div>
  );
}