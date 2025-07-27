import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, Brain, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SuggestionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AIProModern() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! 👋\n\nJe suis votre assistant IA professionnel. Je peux vous aider avec l\'optimisation de votre salon, l\'analyse de performances, les stratégies marketing et bien plus.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions: SuggestionCard[] = [
    {
      id: '1',
      title: 'Optimiser mon planning',
      description: 'Analysez et optimisez votre planning de la semaine',
      icon: <Brain className="w-5 h-5 text-violet-600" />
    },
    {
      id: '2',
      title: 'Analyse des performances',
      description: 'Obtenez des insights sur vos KPIs',
      icon: <Sparkles className="w-5 h-5 text-violet-600" />
    },
    {
      id: '3',
      title: 'Stratégie marketing',
      description: 'Créez des campagnes personnalisées',
      icon: <Zap className="w-5 h-5 text-violet-600" />
    }
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', {
        message,
        conversationHistory: messages.slice(-5)
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || 'Je n\'ai pas pu traiter votre demande. Pouvez-vous reformuler ?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Désolé, je rencontre des difficultés techniques. Réessayez dans quelques instants.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: SuggestionCard) => {
    setInputValue(suggestion.description);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-violet-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/business-features')}
          className="text-violet-600 hover:bg-violet-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Assistant IA Pro</h1>
          </div>
        </div>
        
        <div className="w-8 h-8" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border border-violet-100 text-gray-900 shadow-sm'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
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

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-violet-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm text-gray-600">L'IA réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions - Only show when no messages from user */}
        {messages.length === 1 && (
          <div className="space-y-3 mt-6">
            <h3 className="text-sm font-medium text-gray-600 text-center">
              Suggestions pour commencer
            </h3>
            <div className="grid gap-3">
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="p-4 border border-violet-100 hover:border-violet-200 cursor-pointer transition-all hover:shadow-md bg-white/60 backdrop-blur-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-50 rounded-lg">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-violet-100">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-violet-600"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="w-12 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center p-0"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            Propulsé par l'IA • Données sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}