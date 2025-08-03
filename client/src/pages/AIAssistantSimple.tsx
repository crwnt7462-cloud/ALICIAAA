import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: string;
}

export default function AIAssistantSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mutation pour envoyer un message à l'IA
  const aiMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { 
        message,
        context: "beauty_assistant"
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        content: data.response || "Je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        isFromUser: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        content: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.",
        isFromUser: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isFromUser: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage("");
    
    // Envoyer à l'IA
    aiMutation.mutate(messageToSend);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex flex-col">
      {/* Header violet intense */}
      <div className="bg-violet-700/90 border-b border-violet-500/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="h-9 w-9 p-0 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-medium text-white">
                  Rendly AI
                </h1>
                <p className="text-xs text-white/90">
                  Assistant beauté
                </p>
              </div>
            </div>
            
            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isFromUser && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-2xl ${message.isFromUser ? 'order-first' : ''}`}>
                <div className={`p-4 rounded-2xl ${
                  message.isFromUser
                    ? 'bg-violet-600 text-white ml-12 shadow-lg'
                    : 'bg-white text-gray-900 shadow-lg border border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className={`text-xs mt-2 ${
                  message.isFromUser ? 'text-white/70 text-right mr-12' : 'text-gray-500 ml-0'
                }`}>
                  {message.timestamp}
                </p>
              </div>
              
              {message.isFromUser && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                    Vous
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {/* Indicateur de frappe */}
          {aiMutation.isPending && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone de saisie violette */}
      <div className="bg-violet-700/90 border-t border-violet-500/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Posez votre question sur la beauté..."
                className="pr-12 py-3 rounded-2xl bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-0 resize-none"
                disabled={aiMutation.isPending}
              />
            </div>
            <Button 
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || aiMutation.isPending}
              className="h-10 w-10 p-0 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-xs text-white/80 text-center mt-2">
            Rendly AI peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}