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
    <div className="h-full flex flex-col bg-gray-100 max-w-md mx-auto">
      {/* Header simple comme dans l'image */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/dashboard')}
          className="p-1 h-8 w-8"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">Assistant IA</h1>
            <p className="text-xs text-green-600">En ligne</p>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            {message.role === 'assistant' ? (
              <div className="self-start max-w-[85%]">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            ) : (
              <div className="self-end max-w-[85%]">
                <div className="bg-blue-500 rounded-2xl px-4 py-3">
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
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Texte d'aide en bas */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500 text-center">
          L'assistant IA peut vous aider avec la gestion de votre salon, vos rendez-vous, et répondre à vos questions.
        </p>
      </div>

      {/* Input message en bas exactement comme dans l'image */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-sm border-none outline-none focus:bg-gray-50 transition-colors"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-600 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}