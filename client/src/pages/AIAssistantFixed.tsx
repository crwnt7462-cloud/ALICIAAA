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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 max-w-md mx-auto lg:max-w-none lg:w-full relative overflow-hidden">
      {/* Header glassmorphism violet - Desktop Responsive */}
      <div className="px-6 lg:px-8 xl:px-12 py-4 lg:py-6 flex items-center justify-between relative bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div 
          className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-violet-500 hover:bg-violet-600 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform border-none"
          onClick={() => setShowChatHistory(!showChatHistory)}
        >
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full"></div>
        </div>
        
        {/* Titre centré Desktop */}
        <div className="hidden lg:flex items-center space-x-3">
          <h1 className="text-xl xl:text-2xl font-semibold text-gray-900">Assistant IA Premium Pro</h1>
          <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
            {subscription?.planName || 'Premium Pro'} ({subscription?.price || 149}€)
          </span>
        </div>
        
        <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-violet-500 hover:bg-violet-600 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-none">
          <ArrowLeft 
            className="w-4 h-4 lg:w-5 lg:h-5 text-white cursor-pointer" 
            onClick={() => setLocation('/dashboard')}
          />
        </div>
      </div>

      {/* Container Chat - Desktop Optimisé */}
      <div className="flex-1 flex items-center justify-center relative lg:max-w-4xl lg:mx-auto lg:w-full">
        {messages.length === 0 ? (
          <div className="text-center px-8 lg:px-12">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-violet-600 mb-4 lg:mb-6">
              Bonjour, Demo
            </h1>
            <p className="text-gray-600 text-sm lg:text-base xl:text-lg mb-2 lg:mb-4">
              Votre assistant IA Premium Pro est prêt à vous aider
            </p>
            <div className="lg:hidden inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              Plan actuel : {subscription?.planName || 'Premium Pro'} ({subscription?.price || 149}€)
            </div>
            
            {/* Suggestions d'actions - Desktop */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100 hover:border-violet-200 cursor-pointer transition-all">
                <h3 className="font-medium text-violet-900 mb-2">📊 Analyse du salon</h3>
                <p className="text-sm text-gray-600">Obtenez des insights sur vos performances</p>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100 hover:border-violet-200 cursor-pointer transition-all">
                <h3 className="font-medium text-violet-900 mb-2">📅 Optimiser planning</h3>
                <p className="text-sm text-gray-600">Conseils pour améliorer vos horaires</p>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100 hover:border-violet-200 cursor-pointer transition-all">
                <h3 className="font-medium text-violet-900 mb-2">💡 Stratégies marketing</h3>
                <p className="text-sm text-gray-600">Développez votre clientèle</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 lg:px-8 xl:px-12 py-4 lg:py-6 space-y-4 lg:space-y-6 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.role === 'assistant' ? (
                  <div className="self-start max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-sm">
                      <p className="text-purple-900 text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 ml-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="self-end max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
                      <p className="text-white text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 mr-2 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start max-w-[85%] lg:max-w-[75%]">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-sm">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Barre de saisie - Desktop Responsive */}
      <div className="px-4 lg:px-8 xl:px-12 py-3 lg:py-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}