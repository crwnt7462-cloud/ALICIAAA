import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantFixed() {
  const [, setLocation] = useLocation();
  
  // TOUS LES HOOKS EN PREMIER - JAMAIS CONDITIONNELS
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery<{
    planId: string;
    planName: string;
    price: number;
    status: string;
    userId: string;
  }>({
    queryKey: ['/api/user/subscription'],
    retry: 1,
    staleTime: 5000
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        role: 'assistant',
        content: data.response || "Je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Vérifications après tous les hooks
  const hasAIAccess = subscription && (
    subscription.planId === 'premium' || 
    subscription.planName?.includes('Premium Pro') ||
    subscription.price >= 149
  );

  console.log('🤖 Vérification accès IA:', {
    subscription,
    hasAIAccess,
    planId: subscription?.planId,
    planName: subscription?.planName,
    price: subscription?.price
  });

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre abonnement Premium Pro...</p>
        </div>
      </div>
    );
  }

  if (!hasAIAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="glass-button mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">IA Assistant</h1>
          </div>
          
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Accès restreint</h2>
            <p className="text-gray-700 mb-4">
              L'assistant IA avancé nécessite un abonnement Premium Pro (149€/mois).
            </p>
            <p className="text-sm text-gray-600">
              Plan actuel: {subscription?.planName || 'Non défini'} ({subscription?.price || 0}€)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 max-w-md mx-auto relative overflow-hidden">
      {/* Header glassmorphism violet */}
      <div className="px-6 py-4 flex items-center justify-between relative bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div 
          className="w-12 h-12 bg-violet-500 hover:bg-violet-600 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform border-none"
          onClick={() => setShowChatHistory(!showChatHistory)}
        >
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        
        <div className="w-12 h-12 bg-violet-500 hover:bg-violet-600 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-none">
          <ArrowLeft 
            className="w-4 h-4 text-white cursor-pointer" 
            onClick={() => setLocation('/dashboard')}
          />
        </div>
      </div>

      {/* Message de salutation centré */}
      <div className="flex-1 flex items-center justify-center relative">
        {messages.length === 0 ? (
          <div className="text-center px-8">
            <h1 className="text-4xl font-light text-violet-600 mb-4">
              Bonjour, Demo
            </h1>
            <p className="text-gray-600 text-sm mb-2">
              Votre assistant IA Premium Pro est prêt à vous aider
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              Plan actuel : {subscription?.planName || 'Premium Pro'} ({subscription?.price || 149}€)
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-4 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.role === 'assistant' ? (
                  <div className="self-start max-w-[85%]">
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 shadow-sm">
                      <p className="text-purple-900 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="self-end max-w-[85%]">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl px-4 py-3 shadow-lg">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start max-w-[85%]">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Barre de saisie - Toujours visible */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}