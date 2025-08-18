import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import avyentoLogo from '@assets/Avyento transparent_1755518589119.png';
import { MobileBottomNav } from '@/components/MobileBottomNav';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantFixed() {
  const [, setLocation] = useLocation();
  
  // TOUS LES HOOKS EN PREMIER - JAMAIS CONDITIONNELS
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto lg:max-w-none lg:w-full relative overflow-hidden">
      {/* Navigation mobile - remplace BottomNavigation */}
      <div className="lg:hidden">
        <MobileBottomNav userType="pro" />
      </div>
      
      {/* Bulles décoratives flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-8 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-300/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-12 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-pink-300/30 to-orange-400/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-cyan-300/30 to-blue-400/30 rounded-full blur-md animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-8 w-14 h-14 lg:w-28 lg:h-28 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="absolute top-1/2 right-4 w-8 h-8 lg:w-16 lg:h-16 bg-gradient-to-br from-green-300/30 to-cyan-400/30 rounded-full blur-sm animate-pulse delay-2000"></div>
      </div>

      {/* Header minimaliste - Desktop uniquement */}
      <div className="hidden lg:block relative z-10 px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation('/dashboard')}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
          </button>
          
          <div className="text-center">
            <p className="text-sm lg:text-base text-blue-600 font-medium">Assistant IA</p>
          </div>

          <div className="w-10 h-10 lg:w-12 lg:h-12"></div>
        </div>
      </div>

      {/* Container Chat - Style moderne */}
      <div className="flex-1 flex flex-col justify-center relative z-10 px-6 lg:px-8 pb-20 lg:pb-8">
        {messages.length === 0 ? (
          <div className="text-center space-y-6 lg:space-y-8">
            {/* Logo Avyento Central - Proportions réelles */}
            <div className="flex justify-center mb-6 lg:mb-8">
              <div className="relative">
                <img 
                  src={avyentoLogo} 
                  alt="Avyento" 
                  className="w-32 h-auto lg:w-40 lg:h-auto xl:w-48 xl:h-auto drop-shadow-lg"
                  style={{ aspectRatio: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl scale-150"></div>
              </div>
            </div>

            {/* Message d'accueil en français */}
            <div className="space-y-2 lg:space-y-4">
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-light text-gray-800">
                Bonjour, <span className="text-blue-600 font-medium">comment puis-je vous aider ?</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600">
                Votre assistant IA Premium Pro est à votre service
              </p>
            </div>
            
            {/* Cartes de suggestions en français */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-8 lg:mt-12 max-w-lg lg:max-w-4xl mx-auto">
              <div className="group bg-white/60 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-lg">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-3 lg:mb-4 flex items-center justify-center">
                  <span className="text-white text-sm lg:text-base">📊</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 lg:mb-2 text-sm lg:text-base">Analyse du salon</h3>
                <p className="text-xs lg:text-sm text-gray-600">Analysez vos performances</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-lg">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-3 lg:mb-4 flex items-center justify-center">
                  <span className="text-white text-sm lg:text-base">📅</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 lg:mb-2 text-sm lg:text-base">Planning</h3>
                <p className="text-xs lg:text-sm text-gray-600">Optimisez vos horaires</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/30 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-lg col-span-2 lg:col-span-1">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full mb-3 lg:mb-4 flex items-center justify-center">
                  <span className="text-white text-sm lg:text-base">💡</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 lg:mb-2 text-sm lg:text-base">Marketing</h3>
                <p className="text-xs lg:text-sm text-gray-600">Développez votre clientèle</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.role === 'assistant' ? (
                  <div className="self-start max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
                    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
                      <p className="text-gray-800 text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 ml-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="self-end max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
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
                <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Barre de saisie moderne */}
      <div className="relative z-10 px-6 lg:px-8 py-4 lg:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md rounded-full border border-white/30 shadow-lg p-2 lg:p-3">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="w-full px-4 lg:px-6 py-2 lg:py-3 bg-transparent border-none focus:outline-none text-sm lg:text-base text-gray-700 placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}