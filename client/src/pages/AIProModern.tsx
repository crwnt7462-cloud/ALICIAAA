import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIProModern() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA.\nComment puis-je vous aider aujourd\'hui ?',
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 max-w-md mx-auto relative overflow-hidden">
      {/* Effet de particules/lumière en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
      
      {/* Header moderne avec avatars */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft 
              className="w-4 h-4 text-white cursor-pointer" 
              onClick={() => setLocation('/dashboard')}
            />
          </div>
        </div>
      </div>

      {/* Message de salutation centré */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {messages.length === 1 ? (
          <div className="text-center px-8">
            <h1 className="text-4xl font-light text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text mb-4">
              Hello, Afzal
            </h1>
            <p className="text-white/60 text-sm">
              Votre assistant IA est prêt à vous aider
            </p>
          </div>
        ) : (
          <div className="w-full px-4 py-4 space-y-4 overflow-y-auto">
            {messages.slice(1).map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.role === 'assistant' ? (
                  <div className="self-start max-w-[85%]">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/20">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-white/50 mt-1 ml-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <div className="self-end max-w-[85%]">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl px-4 py-3 shadow-lg">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-white/50 mt-1 mr-2 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start max-w-[85%]">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input moderne en bas comme dans l'image */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Gemini"
              className="w-full bg-white/10 backdrop-blur-md rounded-full px-6 py-4 text-white placeholder-white/60 border border-white/20 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
          
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 border-none p-0 flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}