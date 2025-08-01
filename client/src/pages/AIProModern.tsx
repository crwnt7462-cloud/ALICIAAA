import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
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

export default function AIProModern() {
  const [, setLocation] = useLocation();
  
  // Récupérer les infos du compte connecté
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
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
      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Erreur envoi message:', error);
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
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-violet-50/30 flex flex-col">
      {/* Header avec bouton retour */}
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/dashboard')}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg transition-all hover:scale-105 p-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      </div>

      {messages.length === 0 ? (
        /* Interface de salutation principale */
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Avatar principal */}
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>

          {/* Texte de salutation */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-gray-800 mb-3">
              Bonjour, {user?.email?.split('@')[0] || 'Demo'}
            </h1>
            <p className="text-gray-600 text-lg">
              Votre assistant IA est prêt à vous aider
            </p>
          </div>
        </div>
      ) : (
        /* Zone des messages quand il y en a */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-gray-900 shadow-md border border-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-violet-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Zone input en bas */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Input principal */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Rendly"
              className="w-full rounded-full px-6 py-4 text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200/50 outline-none transition-all font-light text-base placeholder-violet-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 shadow-lg"
              disabled={isLoading}
            />
          </div>
          
          {/* Bouton Send */}
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
          
          {/* Bouton User (bonhomme violet) */}
          <Button
            onClick={() => setLocation('/ai-alerts')}
            size="sm"
            className="w-12 h-12 rounded-full border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
          >
            <User className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}